import { NextResponse } from "next/server";

import slugify from "slugify";

import { connectDB } from "@/lib/db";

import Product from "@/models/Product";

import { isAdmin } from "@/lib/isAdmin";

export async function PUT(
  req: Request,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    const admin =
      await isAdmin();

    if (!admin) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Unauthorized",
        },
        {
          status: 403,
        }
      );
    }

    await connectDB();

    const body =
      await req.json();

    const { id } =
      await params;

    const slug = slugify(
      body.title,
      {
        lower: true,
        strict: true,
      }
    );

    const updatedProduct =
      await Product.findByIdAndUpdate(
        id,
        {
          ...body,
          slug,
        },
        {
          returnDocument:
            "after",

          runValidators: true,
        }
      );

    if (!updatedProduct) {
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

    return NextResponse.json({
      success: true,
      updatedProduct,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Update failed",
      },
      {
        status: 500,
      }
    );
  }
}