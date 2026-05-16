import { headers } from "next/headers";

import Stripe from "stripe";

import { connectDB } from "@/lib/db";

import Order from "@/models/Order";
import Cart from "@/models/Cart";
import Product from "@/models/Product";
import User from "@/models/User";

import { sendEmail } from "@/lib/sendEmail";
import { generateInvoicePdf } from "@/lib/generateInvoicePdf";
import { buildOrderEmailHtml } from "@/lib/buildOrderEmailHtml";

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY!
);

const endpointSecret =
  process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(
  req: Request
) {
  try {
    await connectDB();

    const body =
      await req.text();

    const signature =
      (
        await headers()
      ).get(
        "stripe-signature"
      ) as string;

    let event: Stripe.Event;

    try {
      event =
        stripe.webhooks.constructEvent(
          body,
          signature,
          endpointSecret
        );
    } catch (err: any) {
      console.log(
        "STRIPE WEBHOOK SIGNATURE ERROR:",
        err.message
      );

      return new Response(
        `Webhook Error: ${err.message}`,
        {
          status: 400,
        }
      );
    }

    if (
      event.type !==
      "checkout.session.completed"
    ) {
      return Response.json({
        received: true,
      });
    }

    const session =
      event.data
        .object as Stripe.Checkout.Session;

    const userId =
      session.metadata?.userId;

    if (!userId) {
      console.log(
        "WEBHOOK SKIPPED: userId missing"
      );

      return Response.json({
        received: true,
      });
    }

    let shippingAddress = {};

    try {
      shippingAddress =
        JSON.parse(
          session.metadata
            ?.shippingAddress || "{}"
        );
    } catch (error) {
      console.log(
        "WEBHOOK SHIPPING ADDRESS PARSE FAILED"
      );

      shippingAddress = {};
    }

    const existingOrder =
      await Order.findOne({
        stripeSessionId:
          session.id,
      });

    if (existingOrder) {
      console.log(
        "WEBHOOK SKIPPED: order already exists",
        existingOrder._id.toString()
      );

      return Response.json({
        received: true,
      });
    }

    const user =
      await User.findById(userId);

    if (!user) {
      console.log(
        "WEBHOOK SKIPPED: user not found",
        userId
      );

      return Response.json({
        received: true,
      });
    }

    const cart =
      await Cart.findOne({
        user: userId,
      }).populate(
        "items.product"
      );

    if (
      !cart ||
      cart.items.length === 0
    ) {
      console.log(
        "WEBHOOK SKIPPED: cart empty"
      );

      return Response.json({
        received: true,
      });
    }

    const orderItems = [];

    let totalPrice = 0;

    for (const item of cart.items) {
      const product: any =
        item.product;

      const freshProduct =
        await Product.findById(
          product._id
        );

      if (!freshProduct) {
        console.log(
          "WEBHOOK ITEM SKIPPED: product not found",
          product?._id
        );

        continue;
      }

      if (
        freshProduct.stock <
        item.quantity
      ) {
        console.log(
          "WEBHOOK ITEM SKIPPED: stock insufficient",
          freshProduct.title
        );

        continue;
      }

      orderItems.push({
        product:
          freshProduct._id,

        title:
          freshProduct.title,

        image:
          freshProduct.images?.[0] ||
          "",

        price:
          freshProduct.price,

        quantity:
          item.quantity,
      });

      totalPrice +=
        Number(freshProduct.price) *
        Number(item.quantity);

      freshProduct.stock -=
        item.quantity;

      await freshProduct.save();
    }

    if (orderItems.length === 0) {
      console.log(
        "WEBHOOK SKIPPED: no valid order items"
      );

      return Response.json({
        received: true,
      });
    }

    const order =
      await Order.create({
        user: userId,

        orderItems,

        shippingAddress,

        totalPrice,

        paymentMethod:
          "Stripe",

        paymentStatus:
          "Paid",

        orderStatus:
          "Processing",

        stripeSessionId:
          session.id,
      });

    console.log(
      "ORDER CREATED:",
      order._id.toString()
    );

    cart.items = [];

    await cart.save();

    console.log(
      "CART CLEARED. STARTING EMAIL..."
    );

    try {
      console.log(
        "ORDER EMAIL STEP 1: generating invoice"
      );

      const invoicePdf =
        await generateInvoicePdf({
          order,
          user,
        });

      console.log(
        "ORDER EMAIL STEP 2: invoice generated",
        invoicePdf.length
      );

      console.log(
        "ORDER EMAIL STEP 3: sending email to",
        user.email
      );

      await sendEmail({
        to: user.email,

        subject: `Your TechStore order is confirmed - #${order._id}`,

        html: buildOrderEmailHtml({
          userName:
            user.name ||
            "Customer",

          orderId:
            order._id.toString(),

          orderItems,

          totalPrice,

          shippingAddress,
        }),

        attachments: [
          {
            filename: `TechStore-Invoice-${order._id}.pdf`,

            content:
              invoicePdf,

            contentType:
              "application/pdf",
          },
        ],
      });

      console.log(
        "ORDER EMAIL STEP 4: email sent successfully"
      );
    } catch (emailError: any) {
      console.log(
        "ORDER EMAIL OR INVOICE FAILED"
      );

      console.log({
        message:
          emailError.message,
        code:
          emailError.code,
        command:
          emailError.command,
        response:
          emailError.response,
        stack:
          emailError.stack,
      });
    }

    return Response.json({
      received: true,
    });
  } catch (error) {
    console.log(
      "WEBHOOK MAIN ERROR:",
      error
    );

    return new Response(
      "Webhook Error",
      {
        status: 500,
      }
    );
  }
}