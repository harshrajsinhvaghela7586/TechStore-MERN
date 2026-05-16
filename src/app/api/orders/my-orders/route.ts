import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";

import Order from "@/models/Order";

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

    const orders =
      await Order.find({
        user: user._id,
      }).sort({
        createdAt: -1,
      });

    return NextResponse.json({
      success: true,
      orders,
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