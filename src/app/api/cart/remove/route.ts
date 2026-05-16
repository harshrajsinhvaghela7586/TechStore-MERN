import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";

import Cart from "@/models/Cart";
import Product from "@/models/Product";
import { verifyToken } from "@/lib/verifyToken";

export async function DELETE(
  req: Request
) {
  try {
    await connectDB();

    const user = await verifyToken();

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

    const { productId } =
      await req.json();

    const cart =
      await Cart.findOne({
        user: user._id,
      });

    if (!cart) {
      return NextResponse.json({
        success: false,
      });
    }

    cart.items =
      cart.items.filter(
        (item: any) =>
          item.product.toString() !==
          productId
      );

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