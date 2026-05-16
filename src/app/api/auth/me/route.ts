import { NextResponse } from "next/server";

import { verifyToken } from "@/lib/verifyToken";

export async function GET() {
  try {
    const user =
      await verifyToken();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

   return NextResponse.json({
  success: true,

  user: {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    profileImage:
      user.profileImage || "",
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