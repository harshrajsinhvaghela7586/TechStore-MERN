import { NextResponse } from "next/server";

import cloudinary from "@/lib/cloudinary";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const file = body.file || body.image;

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          message: "Image file is required",
        },
        {
          status: 400,
        }
      );
    }

    const uploadedImage =
      await cloudinary.uploader.upload(file, {
        folder: "techstore",
      });

    return NextResponse.json(
      {
        success: true,
        message: "Image uploaded successfully",
        url: uploadedImage.secure_url,
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    console.log("UPLOAD ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error?.message || "Upload failed",
      },
      {
        status: 500,
      }
    );
  }
}