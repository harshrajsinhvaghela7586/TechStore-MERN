import { cookies } from "next/headers";

import jwt from "jsonwebtoken";

export async function isAdmin() {
  const cookieStore =
    await cookies();

  const token =
    cookieStore.get("token")
      ?.value;

  if (!token) return false;

  try {
    const decoded: any =
      jwt.verify(
        token,
        process.env.JWT_SECRET!
      );

    return (
      decoded.role === "admin"
    );
  } catch (error) {
    return false;
  }
}