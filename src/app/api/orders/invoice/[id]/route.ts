import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import { verifyToken } from "@/lib/verifyToken";
import { generateInvoicePdf } from "@/lib/generateInvoicePdf";

import Order from "@/models/Order";
import User from "@/models/User";
import Product from "@/models/Product";

export async function GET(
  req: NextRequest,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    await connectDB();

    const decoded: any = await verifyToken();

    if (!decoded || !decoded.id) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized. Please login first.",
        },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Order id is required.",
        },
        { status: 400 }
      );
    }

    const user = await User.findById(decoded.id).select(
      "-password -resetOtp -resetOtpExpiry"
    );

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found.",
        },
        { status: 404 }
      );
    }

    const order = await Order.findById(id).populate({
      path: "orderItems.product",
      model: Product,
    });

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          message: "Order not found.",
        },
        { status: 404 }
      );
    }

    const isOwner =
      order.user.toString() === user._id.toString();

    const isAdmin =
      user.role === "admin";

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        {
          success: false,
          message: "You are not allowed to access this invoice.",
        },
        { status: 403 }
      );
    }

    const invoicePdf = await generateInvoicePdf({
      order,
      user,
    });

    const download =
      req.nextUrl.searchParams.get("download") === "true";

    return new Response(invoicePdf, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `${
          download ? "attachment" : "inline"
        }; filename="invoice-${order._id}.pdf"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error: any) {
    console.log("INVOICE GENERATE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error?.message ||
          "Something went wrong while generating invoice.",
      },
      { status: 500 }
    );
  }
}