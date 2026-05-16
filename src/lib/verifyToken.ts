import jwt from "jsonwebtoken";

import { cookies } from "next/headers";

import User from "@/models/User";

import { connectDB } from "./db";

export async function verifyToken() {
  try {
    await connectDB();

    const cookieStore =
      await cookies();

    const token =
      cookieStore.get("token")
        ?.value;

    if (!token) {
      return null;
    }

    const decoded: any =
      jwt.verify(
        token,
        process.env.JWT_SECRET!
      );

    const user =
      await User.findById(
        decoded._id
      );

    if (!user) {
      return null;
    }

    return user;
  } catch (error) {
    console.log(error);

    return null;
  }
}