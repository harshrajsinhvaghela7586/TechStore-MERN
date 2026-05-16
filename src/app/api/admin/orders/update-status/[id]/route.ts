import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import { verifyToken } from "@/lib/verifyToken";

import Order from "@/models/Order";

import "@/models/User";
import "@/models/Product";

const allowedStatuses = [
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

export async function PATCH(
  req: Request,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {
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

    const { id } = await context.params;

    const body = await req.json();

    const { orderStatus } = body;

    if (!orderStatus) {
      return NextResponse.json(
        {
          success: false,
          message: "Order status is required",
        },
        {
          status: 400,
        }
      );
    }

    if (!allowedStatuses.includes(orderStatus)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid order status",
        },
        {
          status: 400,
        }
      );
    }

    const order = await Order.findById(id);

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          message: "Order not found",
        },
        {
          status: 404,
        }
      );
    }

    if (
      order.orderStatus === "Delivered" &&
      orderStatus !== "Delivered"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Delivered order status cannot be changed",
        },
        {
          status: 400,
        }
      );
    }

    order.orderStatus = orderStatus;

    await order.save();

    const updatedOrder = await Order.findById(id)
      .populate("user", "name email role isEmailVerified")
      .populate("orderItems.product", "title slug images brand category stock")
      .lean();

    return NextResponse.json(
      {
        success: true,
        message: "Order status updated successfully",
        order: updatedOrder,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("ADMIN ORDER STATUS UPDATE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update order status",
      },
      {
        status: 500,
      }
    );
  }
}