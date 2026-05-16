import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

import jwt from "jsonwebtoken";

export function proxy(
  request: NextRequest
) {
  const token =
    request.cookies.get(
      "token"
    )?.value;

  const pathname =
    request.nextUrl.pathname;

  const protectedRoutes = [
    "/cart",
    "/checkout",
    "/orders",
    "/profile",
  ];

  const adminRoutes = [
    "/admin",
  ];

  // Protected Routes
  if (
    protectedRoutes.some((route) =>
      pathname.startsWith(route)
    )
  ) {
    if (!token) {
      return NextResponse.redirect(
        new URL(
          "/login",
          request.url
        )
      );
    }
  }

  // Admin Routes
  if (
    adminRoutes.some((route) =>
      pathname.startsWith(route)
    )
  ) {
    if (!token) {
      return NextResponse.redirect(
        new URL(
          "/login",
          request.url
        )
      );
    }

    try {
      const decoded: any =
        jwt.verify(
          token,
          process.env.JWT_SECRET!
        );

      if (
        decoded.role !==
        "admin"
      ) {
        return NextResponse.redirect(
          new URL(
            "/",
            request.url
          )
        );
      }
    } catch (error) {
      return NextResponse.redirect(
        new URL(
          "/login",
          request.url
        )
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/cart/:path*",
    "/checkout/:path*",
    "/orders/:path*",
    "/profile/:path*",
    "/admin/:path*",
  ],
};