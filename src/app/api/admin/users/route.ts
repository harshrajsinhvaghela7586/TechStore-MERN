import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import { verifyToken } from "@/lib/verifyToken";

import User from "@/models/User";
import Order from "@/models/Order";

export async function GET() {
  try {
    await connectDB();

    const currentUser =
      await verifyToken();

    if (
      !currentUser ||
      currentUser.role !== "admin"
    ) {
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

    const users = await User.find()
      .select("-password -resetOtp -emailVerifyOtp")
      .sort({
        createdAt: -1,
      })
      .lean();

    const userIds = users.map(
      (user: any) => user._id
    );

    const orderStats =
      await Order.aggregate([
        {
          $match: {
            user: {
              $in: userIds,
            },
          },
        },
        {
          $group: {
            _id: "$user",
            orderCount: {
              $sum: 1,
            },
            totalSpent: {
              $sum: {
                $cond: [
                  {
                    $eq: [
                      "$paymentStatus",
                      "Paid",
                    ],
                  },
                  "$totalPrice",
                  0,
                ],
              },
            },
          },
        },
      ]);

    const statsMap = new Map(
      orderStats.map((item) => [
        item._id.toString(),
        {
          orderCount:
            item.orderCount || 0,
          totalSpent:
            item.totalSpent || 0,
        },
      ])
    );

    const usersWithStats = users.map(
      (user: any) => {
        const stats =
          statsMap.get(
            user._id.toString()
          ) || {
            orderCount: 0,
            totalSpent: 0,
          };

        return {
          ...user,
          orderCount:
            stats.orderCount,
          totalSpent:
            stats.totalSpent,
          isCurrentAdmin:
            user._id.toString() ===
            currentUser._id.toString(),
        };
      }
    );

    return NextResponse.json(
      {
        success: true,
        users: usersWithStats,
        currentUserId:
          currentUser._id.toString(),
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log(
      "ADMIN USERS FETCH ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to fetch users",
      },
      {
        status: 500,
      }
    );
  }
}