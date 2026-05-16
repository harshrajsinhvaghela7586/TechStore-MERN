import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import { verifyToken } from "@/lib/verifyToken";

import Order from "@/models/Order";

import "@/models/User";
import "@/models/Product";

export async function GET() {
  try {
    await connectDB();

    const user = await verifyToken();

    if (!user || user.role !== "admin") {
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

    const orders = await Order.find()
      .populate("user", "name email role isEmailVerified")
      .populate("orderItems.product", "title slug images brand category stock")
      .sort({
        createdAt: -1,
      })
      .lean();

    return NextResponse.json(
      {
        success: true,
        orders,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("ADMIN ORDERS FETCH ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch orders",
      },
      {
        status: 500,
      }
    );
  }
}