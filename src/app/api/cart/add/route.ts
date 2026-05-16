import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";

import Product from "@/models/Product";
import Cart from "@/models/Cart";

import { verifyToken } from "@/lib/verifyToken";

export async function POST(req: Request) {
  try {
    await connectDB();

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

    const body = await req.json();

    const { productId, quantity } =
      body;

    const product =
      await Product.findById(
        productId
      );

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Product not found",
        },
        {
          status: 404,
        }
      );
    }

    if (
      product.stock < quantity
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Not enough stock",
        },
        {
          status: 400,
        }
      );
    }

    let cart = await Cart.findOne({
      user: user._id,
    });

    if (!cart) {
      cart = await Cart.create({
        user: user._id,
        items: [],
      });
    }

    const existingItem =
      cart.items.find(
        (item: any) =>
          item.product.toString() ===
          productId
      );

    if (existingItem) {
      existingItem.quantity +=
        quantity;
    } else {
      cart.items.push({
        product: productId,
        quantity,
      });
    }

    await cart.save();

    return NextResponse.json({
      success: true,
      message:
        "Added to cart",
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