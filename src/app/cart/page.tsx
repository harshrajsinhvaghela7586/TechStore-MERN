"use client";

import Link from "next/link";

import axios from "axios";
import { formatPrice } from "@/lib/utils";
import {
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  ArrowRight,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import { toast } from "sonner";

export default function CartPage() {
  const [cart, setCart] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [updatingId, setUpdatingId] =
    useState("");

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart =
    async () => {
      try {
        const res =
          await axios.get(
            "/api/cart/get"
          );

        setCart(
          res.data.cart?.items ||
            []
        );
      } catch (error) {
        console.log(error);

        toast.error(
          "Failed to load cart"
        );
      } finally {
        setLoading(false);
      }
    };

  const updateQuantity =
    async (
      productId: string,
      type:
        | "increase"
        | "decrease"
    ) => {
      try {
        setUpdatingId(
          productId
        );

        await axios.put(
          "/api/cart/update",
          {
            productId,
            type,
          }
        );

        fetchCart();

        window.dispatchEvent(
          new Event(
            "refreshNavbar"
          )
        );
      } catch (error: any) {
        toast.error(
          error.response?.data
            ?.message ||
            "Update failed"
        );
      } finally {
        setUpdatingId("");
      }
    };

  const handleRemove =
    async (
      productId: string
    ) => {
      try {
        await axios.delete(
          "/api/cart/remove",
          {
            data: {
              productId,
            },
          }
        );

        toast.success(
          "Removed from cart"
        );

        fetchCart();

        window.dispatchEvent(
          new Event(
            "refreshNavbar"
          )
        );
      } catch (error) {
        toast.error(
          "Remove failed"
        );
      }
    };

  const subtotal =
    cart.reduce(
      (
        acc,
        item
      ) =>
        acc +
        item.product.price *
          item.quantity,
      0
    );

  const shipping = 0;

  const total =
    subtotal + shipping;

  const totalItems =
    cart.reduce(
      (
        acc,
        item
      ) =>
        acc + item.quantity,
      0
    );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B1120] text-white flex items-center justify-center">

        <div className="text-center">

          <div className="w-20 h-20 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto" />

          <h2 className="text-3xl font-black mt-8">
            Loading Cart...
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B1120] text-white overflow-hidden">

      {/* Background Glow */}
      <div className="fixed top-0 left-0 w-[400px] h-[400px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="fixed bottom-0 right-0 w-[400px] h-[400px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 py-16 relative z-10">

        {/* Header */}
        <div className="flex items-center gap-4 mb-14">

          <div className="w-16 h-16 rounded-3xl bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">

            <ShoppingBag className="w-8 h-8" />
          </div>

          <div>
            <h1 className="text-5xl font-black">
              Shopping Cart
            </h1>

            <p className="text-gray-400 mt-2">
              {totalItems} item
              {totalItems !== 1
                ? "s"
                : ""}{" "}
              in your cart
            </p>
          </div>
        </div>

        {cart.length === 0 ? (
          <div className="rounded-[40px] border border-gray-800 bg-[#111827]/80 backdrop-blur-xl p-20 text-center">

            <div className="w-28 h-28 rounded-full bg-cyan-500/10 flex items-center justify-center mx-auto">

              <ShoppingBag className="w-14 h-14 text-cyan-400" />
            </div>

            <h2 className="text-5xl font-black mt-10">
              Your Cart Is Empty
            </h2>

            <p className="text-gray-400 mt-5 text-lg">
              Looks like you haven't
              added anything yet.
            </p>

            <Link
              href="/"
              className="mt-10 inline-flex h-14 px-8 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 items-center gap-3 justify-center font-semibold text-lg shadow-lg shadow-cyan-500/20 hover:scale-105 transition"
            >
              Continue Shopping

              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-10">

            {/* CART ITEMS */}
            <div className="lg:col-span-2 space-y-6">

              {cart.map(
                (item) => (
                  <div
                    key={
                      item.product
                        ?._id
                    }
                    className="group rounded-[36px] border border-gray-800 bg-[#111827]/80 backdrop-blur-xl p-6 hover:border-cyan-500/30 transition-all duration-300"
                  >

                    <div className="flex flex-col md:flex-row gap-6">

                      {/* IMAGE */}
                      <div className="relative overflow-hidden rounded-3xl">

                        <img
                          src={
                            item
                              .product
                              ?.images?.[0]
                          }
                          alt={
                            item
                              .product
                              ?.title
                          }
                          className="w-full md:w-40 h-40 object-cover group-hover:scale-105 transition duration-500"
                        />
                      </div>

                      {/* CONTENT */}
                      <div className="flex-1">

                        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">

                          <div>

                            <div className="inline-flex px-4 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-4">
                              {
                                item
                                  .product
                                  ?.category
                              }
                            </div>

                            <h2 className="text-3xl font-black leading-tight">
                              {
                                item
                                  .product
                                  ?.title
                              }
                            </h2>

                            <p className="text-gray-400 mt-3">
                              {
                                item
                                  .product
                                  ?.brand
                              }
                            </p>

                            <h3 className="text-4xl font-black mt-6">
                              
                              {formatPrice(
                                item
                                  .product
                                  ?.price)
                              }
                            </h3>
                          </div>

                          {/* REMOVE */}
                          <button
                            onClick={() =>
                              handleRemove(
                                item
                                  .product
                                  ?._id
                              )
                            }
                            className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 hover:bg-red-500 hover:text-white transition"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>

                        {/* QUANTITY */}
                        <div className="flex items-center justify-between mt-10">

                          <div className="flex items-center gap-4 rounded-2xl border border-gray-700 bg-[#0B1120] p-2">

                            <button
                              onClick={() =>
                                updateQuantity(
                                  item
                                    .product
                                    ?._id,
                                  "decrease"
                                )
                              }
                              disabled={
                                updatingId ===
                                item
                                  .product
                                  ?._id
                              }
                              className="w-12 h-12 rounded-xl bg-[#111827] hover:bg-[#1F2937] flex items-center justify-center transition"
                            >
                              <Minus className="w-5 h-5" />
                            </button>

                            <span className="w-10 text-center text-2xl font-black">
                              {
                                item.quantity
                              }
                            </span>

                            <button
                              onClick={() =>
                                updateQuantity(
                                  item
                                    .product
                                    ?._id,
                                  "increase"
                                )
                              }
                              disabled={
                                updatingId ===
                                item
                                  .product
                                  ?._id
                              }
                              className="w-12 h-12 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black flex items-center justify-center transition"
                            >
                              <Plus className="w-5 h-5" />
                            </button>
                          </div>

                          <div className="text-right">

                            <p className="text-sm text-gray-500">
                              Subtotal
                            </p>

                            <h3 className="text-3xl font-black">
                              
                              {formatPrice(
                                item
                                  .product
                                  ?.price *
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

            {/* SUMMARY */}
            <div className="sticky top-28 h-fit">

              <div className="rounded-[36px] border border-gray-800 bg-[#111827]/80 backdrop-blur-xl p-8">

                <h2 className="text-4xl font-black">
                  Order Summary
                </h2>

                <div className="space-y-6 mt-10">

                  <div className="flex items-center justify-between">

                    <span className="text-gray-400">
                      Total Items
                    </span>

                    <span className="text-xl font-bold">
                      {totalItems}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">

                    <span className="text-gray-400">
                      Subtotal
                    </span>

                    <span className="text-xl font-bold">
                      
                      {formatPrice(subtotal.toFixed(
                        2
                      ))}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">

                    <span className="text-gray-400">
                      Shipping
                    </span>

                    <span className="text-green-400 font-bold">
                      Free
                    </span>
                  </div>

                  <div className="border-t border-gray-800 pt-6 flex items-center justify-between">

                    <span className="text-2xl font-bold">
                      Total
                    </span>

                    <span className="text-5xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                      
                      {formatPrice(total.toFixed(
                        2
                      ))}
                    </span>
                  </div>
                </div>

                <Link
                  href="/checkout/address"
                  className="mt-10 h-16 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center gap-3 font-semibold text-lg shadow-lg shadow-cyan-500/20 hover:scale-[1.02] transition"
                >
                  Proceed To Checkout

                  <ArrowRight className="w-5 h-5" />
                </Link>

                <Link
                  href="/"
                  className="mt-5 h-14 rounded-2xl border border-gray-700 bg-[#0B1120] hover:bg-[#1F2937] flex items-center justify-center font-semibold transition"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}