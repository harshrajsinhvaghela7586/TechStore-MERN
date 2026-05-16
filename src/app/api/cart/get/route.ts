import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";

import Cart from "@/models/Cart";
import "@/models/Product";
import { verifyToken } from "@/lib/verifyToken";

export async function GET() {
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

    const cart =
      await Cart.findOne({
        user: user._id,
      }).populate("items.product");

    return NextResponse.json({
      success: true,
      cart: cart || {
        items: [],
      },
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