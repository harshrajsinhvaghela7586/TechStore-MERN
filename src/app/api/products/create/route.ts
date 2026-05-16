import { NextResponse } from "next/server";
import slugify from "slugify";

import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { isAdmin } from "@/lib/isAdmin";

export async function POST(req: Request) {
  try {
    const admin = await isAdmin();

    if (!admin) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 403 }
      );
    }

    await connectDB();

    const body = await req.json();

    const slug = slugify(body.title, {
      lower: true,
      strict: true,
    });

    const existingProduct =
      await Product.findOne({
        slug,
      });

    if (existingProduct) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Product with same title already exists",
        },
        { status: 400 }
      );
    }

    const product = await Product.create({
      ...body,
      slug,
    });

    return NextResponse.json({
      success: true,
      product,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
}