import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";

import Cart from "@/models/Cart";

import Product from "@/models/Product";

import { verifyToken } from "@/lib/verifyToken";

export async function PUT(
  req: Request
) {
  try {
    await connectDB();

    const user =
      await verifyToken();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
        },
        {
          status: 401,
        }
      );
    }

    const {
      productId,
      type,
    } = await req.json();

    const cart =
      await Cart.findOne({
        user: user._id,
      });

    if (!cart) {
      return NextResponse.json(
        {
          success: false,
        },
        {
          status: 404,
        }
      );
    }

    const item =
      cart.items.find(
        (item: any) =>
          item.product.toString() ===
          productId
      );

    if (!item) {
      return NextResponse.json(
        {
          success: false,
        },
        {
          status: 404,
        }
      );
    }

    const product =
      await Product.findById(
        productId
      );

    if (!product) {
      return NextResponse.json(
        {
          success: false,
        },
        {
          status: 404,
        }
      );
    }

    if (type === "increase") {
      if (
        item.quantity >=
        product.stock
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Maximum stock reached",
          },
          {
            status: 400,
          }
        );
      }

      item.quantity += 1;
    }

    if (type === "decrease") {
      if (item.quantity > 1) {
        item.quantity -= 1;
      }
    }

    await cart.save();

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 500,
      }
    );
  }
}