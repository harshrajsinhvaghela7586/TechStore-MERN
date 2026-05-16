"use client";

import axios from "axios";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

import {
  PackageCheck,
  ArrowRight,
  ShoppingBag,
  Truck,
  CheckCircle2,
  Eye,
  Download,
  ReceiptText,
  CalendarDays,
  CreditCard,
  MapPin,
  Phone,
  User,
  ShieldCheck,
  Loader2,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

export default function OrdersPage() {
  const [orders, setOrders] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders =
    async () => {
      try {
        const res =
          await axios.get(
            "/api/orders/my-orders"
          );

        if (
          res.data.success
        ) {
          setOrders(
            res.data.orders
          );
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

  const formatDate = (
    date: string
  ) => {
    if (!date) return "N/A";

    return new Intl.DateTimeFormat(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    ).format(new Date(date));
  };

  const getPaymentBadge =
    (status: string) => {
      if (status === "Paid") {
        return "bg-green-500/10 border-green-500/20 text-green-400";
      }

      if (status === "Failed") {
        return "bg-red-500/10 border-red-500/20 text-red-400";
      }

      return "bg-yellow-500/10 border-yellow-500/20 text-yellow-400";
    };

  const getOrderBadge =
    (status: string) => {
      if (status === "Delivered") {
        return "bg-green-500/10 border-green-500/20 text-green-400";
      }

      if (status === "Cancelled") {
        return "bg-red-500/10 border-red-500/20 text-red-400";
      }

      if (status === "Shipped") {
        return "bg-blue-500/10 border-blue-500/20 text-blue-400";
      }

      return "bg-cyan-500/10 border-cyan-500/20 text-cyan-400";
    };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B1120] text-white flex items-center justify-center px-4">
        <div className="text-center rounded-[36px] border border-gray-800 bg-[#111827]/80 backdrop-blur-xl px-10 py-14 shadow-2xl">
          <div className="w-20 h-20 rounded-full border-4 border-cyan-500 border-t-transparent animate-spin mx-auto" />

          <h2 className="text-4xl font-black mt-8">
            Loading Orders...
          </h2>

          <p className="text-gray-400 mt-3">
            Fetching your purchases
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B1120] text-white overflow-hidden">
      {/* Glow */}
      <div className="fixed top-0 left-0 w-[420px] h-[420px] bg-cyan-500/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="fixed bottom-0 right-0 w-[420px] h-[420px] bg-blue-500/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 py-16 relative z-10">
        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-14">
          <div>
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 text-cyan-400 text-sm font-semibold mb-6">
              <ShoppingBag className="w-4 h-4" />
              Order History
            </div>

            <h1 className="text-5xl md:text-6xl font-black tracking-tight">
              My Orders
            </h1>

            <p className="text-gray-400 mt-5 text-lg max-w-2xl leading-8">
              Track your purchases, view delivery
              status, and download invoices for
              every TechStore order.
            </p>
          </div>

          <Link
            href="/"
            className="h-14 px-8 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center gap-3 font-semibold text-lg shadow-lg shadow-cyan-500/20 hover:scale-[1.02] transition w-fit"
          >
            Continue Shopping
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* SUMMARY CARDS */}
        {orders.length > 0 && (
          <div className="grid md:grid-cols-3 gap-5 mb-12">
            <div className="rounded-[28px] border border-gray-800 bg-[#111827]/80 backdrop-blur-xl p-6">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-5">
                <ReceiptText className="w-6 h-6" />
              </div>

              <p className="text-gray-500 text-sm uppercase tracking-widest">
                Total Orders
              </p>

              <h2 className="text-4xl font-black mt-2">
                {orders.length}
              </h2>
            </div>

            <div className="rounded-[28px] border border-gray-800 bg-[#111827]/80 backdrop-blur-xl p-6">
              <div className="w-12 h-12 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400 mb-5">
                <ShieldCheck className="w-6 h-6" />
              </div>

              <p className="text-gray-500 text-sm uppercase tracking-widest">
                Paid Orders
              </p>

              <h2 className="text-4xl font-black mt-2">
                {
                  orders.filter(
                    (order) =>
                      order.paymentStatus ===
                      "Paid"
                  ).length
                }
              </h2>
            </div>

            <div className="rounded-[28px] border border-gray-800 bg-[#111827]/80 backdrop-blur-xl p-6">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-5">
                <CreditCard className="w-6 h-6" />
              </div>

              <p className="text-gray-500 text-sm uppercase tracking-widest">
                Total Spent
              </p>

              <h2 className="text-4xl font-black mt-2 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                {formatPrice(
                  orders.reduce(
                    (
                      total,
                      order
                    ) =>
                      total +
                      Number(
                        order.totalPrice ||
                          0
                      ),
                    0
                  )
                )}
              </h2>
            </div>
          </div>
        )}

        {/* EMPTY */}
        {orders.length === 0 && (
          <div className="rounded-[40px] border border-gray-800 bg-[#111827]/80 backdrop-blur-xl p-10 md:p-20 text-center">
            <div className="w-32 h-32 rounded-full bg-cyan-500/10 flex items-center justify-center mx-auto">
              <PackageCheck className="w-16 h-16 text-cyan-400" />
            </div>

            <h2 className="text-4xl md:text-5xl font-black mt-10">
              No Orders Yet
            </h2>

            <p className="text-gray-400 mt-5 text-lg max-w-xl mx-auto leading-8">
              Looks like you haven’t
              purchased anything yet.
              Start exploring premium
              products now.
            </p>

            <Link
              href="/"
              className="mt-10 inline-flex h-14 px-8 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 items-center gap-3 justify-center font-semibold text-lg shadow-lg shadow-cyan-500/20 hover:scale-105 transition"
            >
              Start Shopping
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        )}

        {/* ORDERS */}
        <div className="space-y-12">
          {orders.map(
            (order: any) => (
              <div
                key={order._id}
                className="rounded-[40px] border border-gray-800 bg-[#111827]/80 backdrop-blur-xl overflow-hidden shadow-2xl shadow-black/20"
              >
                {/* TOP */}
                <div className="p-6 md:p-8 border-b border-gray-800 bg-gradient-to-r from-cyan-500/[0.04] to-blue-500/[0.04]">
                  <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-8">
                    <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-7 flex-1">
                      <div>
                        <p className="text-gray-500 text-xs uppercase tracking-widest">
                          Order ID
                        </p>

                        <h2 className="font-bold text-base mt-3 break-all text-gray-100">
                          {order._id}
                        </h2>
                      </div>

                      <div>
                        <p className="text-gray-500 text-xs uppercase tracking-widest">
                          Order Date
                        </p>

                        <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-gray-300 text-sm font-semibold">
                          <CalendarDays className="w-4 h-4" />
                          {formatDate(
                            order.createdAt
                          )}
                        </div>
                      </div>

                      <div>
                        <p className="text-gray-500 text-xs uppercase tracking-widest">
                          Payment
                        </p>

                        <div
                          className={`mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold ${getPaymentBadge(
                            order.paymentStatus
                          )}`}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          {
                            order.paymentStatus
                          }
                        </div>
                      </div>

                      <div>
                        <p className="text-gray-500 text-xs uppercase tracking-widest">
                          Delivery Status
                        </p>

                        <div
                          className={`mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold ${getOrderBadge(
                            order.orderStatus
                          )}`}
                        >
                          <Truck className="w-4 h-4" />
                          {
                            order.orderStatus
                          }
                        </div>
                      </div>
                    </div>

                    {/* INVOICE ACTIONS */}
                    <div className="flex flex-col sm:flex-row xl:flex-col gap-3 xl:min-w-[220px]">
                      <a
                        href={`/api/orders/invoice/${order._id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="h-12 px-5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400/40 transition flex items-center justify-center gap-2 font-semibold"
                      >
                        <Eye className="w-4 h-4" />
                        View Invoice
                      </a>

                      <a
                        href={`/api/orders/invoice/${order._id}?download=true`}
                        className="h-12 px-5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20 hover:scale-[1.02] transition flex items-center justify-center gap-2 font-semibold"
                      >
                        <Download className="w-4 h-4" />
                        Download Invoice
                      </a>
                    </div>
                  </div>

                  {/* TOTAL */}
                  <div className="mt-8 rounded-[28px] border border-gray-800 bg-[#0B1120]/60 p-6 flex flex-col md:flex-row md:items-center justify-between gap-5">
                    <div>
                      <p className="text-gray-500 text-xs uppercase tracking-widest">
                        Total Amount
                      </p>

                      <h2 className="text-4xl md:text-5xl font-black mt-3 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                        {formatPrice(
                          order.totalPrice
                        )}
                      </h2>
                    </div>

                    <div className="text-gray-400 text-sm leading-7 max-w-xl">
                      Invoice is generated from
                      your confirmed order details.
                      You can view it in browser or
                      download it as a PDF.
                    </div>
                  </div>
                </div>

                {/* PRODUCTS */}
                <div className="p-6 md:p-8">
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <h3 className="text-2xl md:text-3xl font-black">
                      Purchased Items
                    </h3>

                    <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-gray-300 text-sm font-semibold">
                      {
                        order.orderItems
                          ?.length || 0
                      }{" "}
                      Items
                    </div>
                  </div>

                  <div className="space-y-6">
                    {order.orderItems.map(
                      (
                        item: any,
                        index: number
                      ) => (
                        <div
                          key={index}
                          className="group rounded-[32px] border border-gray-800 bg-[#0B1120]/60 backdrop-blur-xl p-5 hover:border-cyan-500/30 transition"
                        >
                          <div className="flex flex-col md:flex-row gap-6">
                            {/* IMAGE */}
                            <div className="overflow-hidden rounded-3xl bg-white/5 border border-white/10 shrink-0">
                              <img
                                src={
                                  item.image
                                }
                                alt={
                                  item.title
                                }
                                className="w-full md:w-40 h-40 object-cover group-hover:scale-105 transition duration-500"
                              />
                            </div>

                            {/* INFO */}
                            <div className="flex-1 flex flex-col justify-between">
                              <div>
                                <h2 className="text-2xl md:text-3xl font-black leading-tight">
                                  {
                                    item.title
                                  }
                                </h2>

                                <div className="flex flex-wrap items-center gap-3 mt-5">
                                  <div className="px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-semibold">
                                    Qty:{" "}
                                    {
                                      item.quantity
                                    }
                                  </div>

                                  <div
                                    className={`px-4 py-2 rounded-full border text-sm font-semibold ${getOrderBadge(
                                      order.orderStatus
                                    )}`}
                                  >
                                    {
                                      order.orderStatus
                                    }
                                  </div>
                                </div>
                              </div>

                              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mt-8">
                                <div>
                                  <p className="text-gray-500 text-sm">
                                    Product Price
                                  </p>

                                  <h3 className="text-3xl md:text-4xl font-black mt-2">
                                    {formatPrice(
                                      item.price
                                    )}
                                  </h3>
                                </div>

                                <div className="text-left sm:text-right">
                                  <p className="text-gray-500 text-sm">
                                    Item Total
                                  </p>

                                  <h3 className="text-3xl font-black text-cyan-400 mt-2">
                                    {formatPrice(
                                      item.price *
                                        item.quantity
                                    )}
                                  </h3>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>

                  {/* ADDRESS */}
                  <div className="mt-10 rounded-[32px] border border-gray-800 bg-[#0B1120]/60 backdrop-blur-xl p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                        <MapPin className="w-6 h-6" />
                      </div>

                      <h3 className="text-2xl md:text-3xl font-black">
                        Delivery Address
                      </h3>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="rounded-[24px] border border-gray-800 bg-white/[0.03] p-5">
                        <p className="text-gray-500 text-xs uppercase tracking-widest">
                          Customer
                        </p>

                        <div className="flex items-center gap-3 mt-4">
                          <User className="w-5 h-5 text-cyan-400" />

                          <h4 className="text-2xl font-bold">
                            {
                              order
                                .shippingAddress
                                ?.fullName
                            }
                          </h4>
                        </div>

                        <div className="flex items-center gap-3 mt-4 text-gray-400">
                          <Phone className="w-5 h-5 text-cyan-400" />

                          <p>
                            {
                              order
                                .shippingAddress
                                ?.phone
                            }
                          </p>
                        </div>
                      </div>

                      <div className="rounded-[24px] border border-gray-800 bg-white/[0.03] p-5">
                        <p className="text-gray-500 text-xs uppercase tracking-widest">
                          Address
                        </p>

                        <div className="text-gray-300 leading-8 mt-4">
                          <p>
                            {
                              order
                                .shippingAddress
                                ?.address
                            }
                          </p>

                          <p>
                            {
                              order
                                .shippingAddress
                                ?.city
                            }
                            {" "}
                            -
                            {" "}
                            {
                              order
                                .shippingAddress
                                ?.pincode
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}