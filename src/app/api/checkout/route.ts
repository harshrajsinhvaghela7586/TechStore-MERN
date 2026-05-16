import { NextResponse } from "next/server";

import Stripe from "stripe";

import { connectDB } from "@/lib/db";

import Cart from "@/models/Cart";
import Product from "@/models/Product";

import { verifyToken } from "@/lib/verifyToken";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    const address = body.address;

    const user = await verifyToken();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    if (
      !address ||
      !address.fullName ||
      !address.phone ||
      !address.address ||
      !address.city ||
      !address.pincode
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Shipping address required",
        },
        {
          status: 400,
        }
      );
    }

    const cart = await Cart.findOne({
      user: user._id,
    }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Cart is empty",
        },
        {
          status: 400,
        }
      );
    }

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    for (const item of cart.items) {
      const product: any = item.product;

      const freshProduct = await Product.findById(product._id);

      if (!freshProduct) {
        return NextResponse.json(
          {
            success: false,
            message: "Product not found",
          },
          {
            status: 404,
          }
        );
      }

      if (freshProduct.stock < item.quantity) {
        return NextResponse.json(
          {
            success: false,
            message: `${freshProduct.title} out of stock`,
          },
          {
            status: 400,
          }
        );
      }

      line_items.push({
        price_data: {
          currency: "inr",

          product_data: {
            name: freshProduct.title,

            images:
              freshProduct.images && freshProduct.images.length > 0
                ? [freshProduct.images[0]]
                : [],
          },

          unit_amount: Math.round(Number(freshProduct.price) * 100),
        },

        quantity: item.quantity,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],

      line_items,

      mode: "payment",

      metadata: {
        userId: user._id.toString(),

        shippingAddress: JSON.stringify(address),
      },

      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,

      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
    });

    return NextResponse.json({
      success: true,
      url: session.url,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message: "Checkout failed",
      },
      {
        status: 500,
      }
    );
  }
}