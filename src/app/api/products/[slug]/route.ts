import { NextResponse } from "next/server";

import Product from "@/models/Product";
import { connectDB } from "@/lib/db";

export async function GET(
  req: Request,
  {
    params,
  }: {
    params: Promise<{ slug: string }>;
  }
) {
  try {
    await connectDB();

    const { slug } = await params;

    const product =
      await Product.findOne({
        slug,
      });

    return NextResponse.json({
      success: true,
      product,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
      },
      { status: 500 }
    );
  }
}