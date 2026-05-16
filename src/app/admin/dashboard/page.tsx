import { redirect } from "next/navigation";

import {
  AlertTriangle,
  BadgeCheck,
  Ban,
  Boxes,
  CalendarDays,
  DollarSign,
  Package,
  ShoppingCart,
  Star,
  TrendingUp,
  Truck,
  Users,
} from "lucide-react";

import { isAdmin } from "@/lib/isAdmin";
import { connectDB } from "@/lib/db";

import Order from "@/models/Order";
import Product from "@/models/Product";
import User from "@/models/User";

import "@/models/User";
import "@/models/Product";

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price || 0);
};

const getMonthName = (monthIndex: number) => {
  return [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ][monthIndex];
};

export default async function DashboardPage() {
  const admin = await isAdmin();

  if (!admin) {
    redirect("/login");
  }

  await connectDB();

  const currentYear =
    new Date().getFullYear();

  const startOfYear =
    new Date(currentYear, 0, 1);

  const endOfYear =
    new Date(currentYear + 1, 0, 1);

  const [
    totalUsers,
    verifiedUsers,
    blockedUsers,
    totalProducts,
    lowStockProducts,
    totalOrders,
    paidOrders,
    processingOrders,
    deliveredOrders,
    paidOrderDocs,
    recentOrders,
    topSellingProducts,
    monthlyRevenueAgg,
  ] = await Promise.all([
    User.countDocuments(),

    User.countDocuments({
      isEmailVerified: true,
    }),

    User.countDocuments({
      isBlocked: true,
    }),

    Product.countDocuments(),

    Product.find({
      stock: {
        $lte: 5,
      },
    })
      .select(
        "title slug images stock price category brand"
      )
      .sort({
        stock: 1,
      })
      .limit(5)
      .lean(),

    Order.countDocuments(),

    Order.countDocuments({
      paymentStatus: "Paid",
    }),

    Order.countDocuments({
      orderStatus: "Processing",
    }),

    Order.countDocuments({
      orderStatus: "Delivered",
    }),

    Order.find({
      paymentStatus: "Paid",
    })
      .select(
        "totalPrice createdAt orderStatus paymentStatus"
      )
      .lean(),

    Order.find()
      .populate(
        "user",
        "name email"
      )
      .sort({
        createdAt: -1,
      })
      .limit(6)
      .lean(),

    Order.aggregate([
      {
        $match: {
          paymentStatus: "Paid",
        },
      },
      {
        $unwind: "$orderItems",
      },
      {
        $group: {
          _id: "$orderItems.title",
          quantitySold: {
            $sum: "$orderItems.quantity",
          },
          revenue: {
            $sum: {
              $multiply: [
                "$orderItems.price",
                "$orderItems.quantity",
              ],
            },
          },
          image: {
            $first: "$orderItems.image",
          },
        },
      },
      {
        $sort: {
          quantitySold: -1,
        },
      },
      {
        $limit: 5,
      },
    ]),

    Order.aggregate([
      {
        $match: {
          paymentStatus: "Paid",
          createdAt: {
            $gte: startOfYear,
            $lt: endOfYear,
          },
        },
      },
      {
        $group: {
          _id: {
            month: {
              $month: "$createdAt",
            },
          },
          revenue: {
            $sum: "$totalPrice",
          },
          orders: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          "_id.month": 1,
        },
      },
    ]),
  ]);

  const totalRevenue =
    paidOrderDocs.reduce(
      (sum: number, order: any) =>
        sum +
        (order.totalPrice || 0),
      0
    );

  const averageOrderValue =
    paidOrders > 0
      ? Math.round(
          totalRevenue / paidOrders
        )
      : 0;

  const monthlyMap = new Map(
    monthlyRevenueAgg.map(
      (item: any) => [
        item._id.month,
        {
          revenue:
            item.revenue || 0,
          orders:
            item.orders || 0,
        },
      ]
    )
  );

  const monthlyData = Array.from(
    {
      length: 12,
    },
    (_, index) => {
      const monthNumber =
        index + 1;

      const data =
        monthlyMap.get(
          monthNumber
        ) || {
          revenue: 0,
          orders: 0,
        };

      return {
        month:
          getMonthName(index),
        revenue:
          data.revenue,
        orders:
          data.orders,
      };
    }
  );

  const maxRevenue = Math.max(
    ...monthlyData.map(
      (item) => item.revenue
    ),
    1
  );

  const activeUsers =
    totalUsers - blockedUsers;

  const verificationRate =
    totalUsers > 0
      ? Math.round(
          (verifiedUsers /
            totalUsers) *
            100
        )
      : 0;

  const deliveryRate =
    totalOrders > 0
      ? Math.round(
          (deliveredOrders /
            totalOrders) *
            100
        )
      : 0;

  return (
    <div className="min-h-screen bg-[#0B1120] text-white">
      {/* GLOW */}
      <div className="fixed top-0 left-0 w-[400px] h-[400px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="fixed bottom-0 right-0 w-[400px] h-[400px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10">
        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-12">
          <div>
            <p className="text-cyan-400 uppercase tracking-[0.3em] text-sm font-semibold">
              Admin Panel
            </p>

            <h1 className="text-5xl md:text-6xl font-black mt-3 tracking-tight">
              Dashboard
            </h1>

            <p className="text-gray-400 mt-4 text-lg">
              Real-time store analytics,
              revenue, inventory and order
              insights.
            </p>
          </div>

          <div className="hidden lg:flex items-center gap-3 px-5 py-3 rounded-2xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-400 font-semibold">
            <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
            System Active
          </div>
        </div>

        {/* MAIN STATS */}
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8">
          <div className="rounded-[32px] border border-gray-800 bg-[#111827]/80 backdrop-blur-xl p-8 hover:border-cyan-500/30 transition">
            <div className="flex items-center justify-between">
              <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center">
                <DollarSign className="w-8 h-8 text-cyan-400" />
              </div>

              <span className="text-green-400 text-sm font-bold">
                Paid Orders
              </span>
            </div>

            <p className="text-gray-400 mt-8">
              Total Revenue
            </p>

            <h2 className="text-4xl md:text-5xl font-black mt-3">
              {formatPrice(
                totalRevenue
              )}
            </h2>
          </div>

          <div className="rounded-[32px] border border-gray-800 bg-[#111827]/80 backdrop-blur-xl p-8 hover:border-cyan-500/30 transition">
            <div className="flex items-center justify-between">
              <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center">
                <ShoppingCart className="w-8 h-8 text-cyan-400" />
              </div>

              <span className="text-yellow-300 text-sm font-bold">
                {processingOrders} Processing
              </span>
            </div>

            <p className="text-gray-400 mt-8">
              Total Orders
            </p>

            <h2 className="text-5xl font-black mt-3">
              {totalOrders}
            </h2>
          </div>

          <div className="rounded-[32px] border border-gray-800 bg-[#111827]/80 backdrop-blur-xl p-8 hover:border-cyan-500/30 transition">
            <div className="flex items-center justify-between">
              <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center">
                <Users className="w-8 h-8 text-cyan-400" />
              </div>

              <span className="text-green-400 text-sm font-bold">
                {activeUsers} Active
              </span>
            </div>

            <p className="text-gray-400 mt-8">
              Total Users
            </p>

            <h2 className="text-5xl font-black mt-3">
              {totalUsers}
            </h2>
          </div>

          <div className="rounded-[32px] border border-gray-800 bg-[#111827]/80 backdrop-blur-xl p-8 hover:border-cyan-500/30 transition">
            <div className="flex items-center justify-between">
              <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center">
                <Package className="w-8 h-8 text-cyan-400" />
              </div>

              <span className="text-red-400 text-sm font-bold">
                {lowStockProducts.length} Low Stock
              </span>
            </div>

            <p className="text-gray-400 mt-8">
              Total Products
            </p>

            <h2 className="text-5xl font-black mt-3">
              {totalProducts}
            </h2>
          </div>
        </div>

        {/* SECONDARY STATS */}
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 mt-8">
          <div className="rounded-[28px] border border-gray-800 bg-[#111827]/70 p-6">
            <div className="flex items-center gap-3 text-blue-400">
              <BadgeCheck className="w-5 h-5" />
              <p className="font-bold">
                Verified Users
              </p>
            </div>

            <h3 className="text-3xl font-black mt-4">
              {verifiedUsers}
            </h3>

            <p className="text-gray-500 mt-2">
              {verificationRate}% verified
              accounts
            </p>
          </div>

          <div className="rounded-[28px] border border-gray-800 bg-[#111827]/70 p-6">
            <div className="flex items-center gap-3 text-red-400">
              <Ban className="w-5 h-5" />
              <p className="font-bold">
                Blocked Users
              </p>
            </div>

            <h3 className="text-3xl font-black mt-4">
              {blockedUsers}
            </h3>

            <p className="text-gray-500 mt-2">
              Restricted from login
            </p>
          </div>

          <div className="rounded-[28px] border border-gray-800 bg-[#111827]/70 p-6">
            <div className="flex items-center gap-3 text-green-400">
              <Truck className="w-5 h-5" />
              <p className="font-bold">
                Delivered Orders
              </p>
            </div>

            <h3 className="text-3xl font-black mt-4">
              {deliveredOrders}
            </h3>

            <p className="text-gray-500 mt-2">
              {deliveryRate}% delivery
              completion
            </p>
          </div>

          <div className="rounded-[28px] border border-gray-800 bg-[#111827]/70 p-6">
            <div className="flex items-center gap-3 text-yellow-300">
              <TrendingUp className="w-5 h-5" />
              <p className="font-bold">
                Avg Order Value
              </p>
            </div>

            <h3 className="text-3xl font-black mt-4">
              {formatPrice(
                averageOrderValue
              )}
            </h3>

            <p className="text-gray-500 mt-2">
              Based on paid orders
            </p>
          </div>
        </div>

        {/* CHART */}
        <div className="mt-12 rounded-[40px] border border-gray-800 bg-[#111827]/80 backdrop-blur-xl p-6 md:p-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-14">
            <div>
              <p className="text-cyan-400 uppercase tracking-[0.3em] text-sm font-semibold">
                Analytics
              </p>

              <h2 className="text-4xl font-black mt-3">
                Revenue Overview
              </h2>

              <p className="text-gray-500 mt-3">
                Monthly paid revenue for{" "}
                {currentYear}
              </p>
            </div>

            <div className="px-5 py-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-semibold flex items-center gap-2 w-fit">
              <CalendarDays className="w-5 h-5" />
              {currentYear}
            </div>
          </div>

          <div className="h-[420px] flex items-end gap-4 overflow-x-auto pb-2">
            {monthlyData.map(
              (item, index) => {
                const height =
                  (item.revenue /
                    maxRevenue) *
                  100;

                return (
                  <div
                    key={index}
                    className="min-w-[70px] flex-1 flex flex-col items-center"
                  >
                    <div className="mb-4 text-xs md:text-sm text-gray-400 font-medium text-center">
                      {formatPrice(
                        item.revenue
                      )}
                    </div>

                    <div className="relative w-full flex justify-center h-[260px] items-end">
                      <div
                        className="w-full max-w-[70px] rounded-t-3xl bg-gradient-to-t from-cyan-500 to-blue-600 hover:opacity-90 transition-all duration-500 shadow-lg shadow-cyan-500/20"
                        style={{
                          height: `${Math.max(
                            height,
                            item.revenue > 0
                              ? 8
                              : 3
                          )}%`,
                        }}
                      />
                    </div>

                    <p className="mt-5 text-gray-400 font-medium">
                      {item.month}
                    </p>

                    <p className="text-xs text-gray-600 mt-1">
                      {item.orders} orders
                    </p>
                  </div>
                );
              }
            )}
          </div>
        </div>

        {/* RECENT ACTIVITY */}
        <div className="grid xl:grid-cols-2 gap-10 mt-12">
          {/* RECENT ORDERS */}
          <div className="rounded-[40px] border border-gray-800 bg-[#111827]/80 backdrop-blur-xl p-6 md:p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-black">
                  Recent Orders
                </h2>

                <p className="text-gray-500 mt-2">
                  Latest customer purchases
                </p>
              </div>

              <span className="text-cyan-400 font-semibold">
                {totalOrders} Total
              </span>
            </div>

            <div className="space-y-5">
              {recentOrders.length === 0 && (
                <div className="rounded-2xl border border-gray-800 bg-[#0B1120] p-8 text-center text-gray-500">
                  No recent orders found
                </div>
              )}

              {recentOrders.map(
                (order: any) => (
                  <div
                    key={order._id}
                    className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 rounded-2xl border border-gray-800 bg-[#0B1120] p-5"
                  >
                    <div>
                      <p className="font-bold">
                        Order #
                        {order._id
                          .toString()
                          .slice(-6)}
                      </p>

                      <p className="text-sm text-gray-400 mt-1">
                        {order.user?.email ||
                          "Unknown user"}
                      </p>

                      <p className="text-xs text-gray-600 mt-1">
                        {new Date(
                          order.createdAt
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </p>
                    </div>

                    <div className="text-left md:text-right">
                      <p className="text-xl font-black">
                        {formatPrice(
                          order.totalPrice
                        )}
                      </p>

                      <div className="flex md:justify-end gap-2 mt-2">
                        <span
                          className={`text-xs px-3 py-1 rounded-full font-bold ${
                            order.paymentStatus ===
                            "Paid"
                              ? "bg-green-500/10 text-green-400"
                              : "bg-yellow-500/10 text-yellow-300"
                          }`}
                        >
                          {
                            order.paymentStatus
                          }
                        </span>

                        <span className="text-xs px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 font-bold">
                          {
                            order.orderStatus
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          {/* TOP SELLING PRODUCTS */}
          <div className="rounded-[40px] border border-gray-800 bg-[#111827]/80 backdrop-blur-xl p-6 md:p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-black">
                  Top Selling Products
                </h2>

                <p className="text-gray-500 mt-2">
                  Ranked by quantity sold
                </p>
              </div>

              <Star className="w-7 h-7 text-yellow-300" />
            </div>

            <div className="space-y-5">
              {topSellingProducts.length ===
                0 && (
                <div className="rounded-2xl border border-gray-800 bg-[#0B1120] p-8 text-center text-gray-500">
                  No sales data found
                </div>
              )}

              {topSellingProducts.map(
                (
                  product: any,
                  index: number
                ) => (
                  <div
                    key={product._id}
                    className="flex items-center justify-between gap-5 rounded-2xl border border-gray-800 bg-[#0B1120] p-5"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 font-black">
                        #{index + 1}
                      </div>

                      <div className="w-16 h-16 rounded-2xl bg-gray-900 overflow-hidden border border-gray-800">
                        {product.image ? (
                          <img
                            src={
                              product.image
                            }
                            alt={
                              product._id
                            }
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Boxes className="w-7 h-7 text-gray-600 m-4" />
                        )}
                      </div>

                      <div>
                        <p className="font-bold line-clamp-1">
                          {
                            product._id
                          }
                        </p>

                        <p className="text-sm text-gray-500 mt-1">
                          {
                            product.quantitySold
                          }{" "}
                          units sold
                        </p>
                      </div>
                    </div>

                    <p className="font-black text-lg">
                      {formatPrice(
                        product.revenue
                      )}
                    </p>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        {/* LOW STOCK */}
        <div className="mt-12 rounded-[40px] border border-gray-800 bg-[#111827]/80 backdrop-blur-xl p-6 md:p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-black">
                Low Stock Products
              </h2>

              <p className="text-gray-500 mt-2">
                Products with stock 5 or
                below
              </p>
            </div>

            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>

          {lowStockProducts.length ===
            0 && (
            <div className="rounded-2xl border border-gray-800 bg-[#0B1120] p-8 text-center text-gray-500">
              No low stock products.
              Inventory looks healthy.
            </div>
          )}

          {lowStockProducts.length >
            0 && (
            <div className="grid md:grid-cols-2 xl:grid-cols-5 gap-5">
              {lowStockProducts.map(
                (product: any) => (
                  <div
                    key={product._id}
                    className="rounded-3xl border border-gray-800 bg-[#0B1120] p-5"
                  >
                    <div className="h-36 rounded-2xl overflow-hidden bg-gray-900 border border-gray-800">
                      {product.images?.[0] ? (
                        <img
                          src={
                            product.images[0]
                          }
                          alt={
                            product.title
                          }
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-10 h-10 text-gray-700" />
                        </div>
                      )}
                    </div>

                    <p className="font-bold mt-4 line-clamp-1">
                      {product.title}
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                      {product.brand} •{" "}
                      {product.category}
                    </p>

                    <div className="flex items-center justify-between mt-4">
                      <span className="text-cyan-400 font-black">
                        {formatPrice(
                          product.price
                        )}
                      </span>

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          product.stock ===
                          0
                            ? "bg-red-500/10 text-red-400"
                            : "bg-yellow-500/10 text-yellow-300"
                        }`}
                      >
                        {product.stock} left
                      </span>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}