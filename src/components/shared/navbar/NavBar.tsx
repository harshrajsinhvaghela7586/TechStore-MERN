"use client";

import Link from "next/link";

import {
  ShoppingCart,
  Menu,
  LogOut,
  Package,
  LayoutDashboard,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import axios from "axios";

import {
  useRouter,
} from "next/navigation";

import { toast } from "sonner";

export default function Navbar() {
  const router = useRouter();

  const dropdownRef =
    useRef<any>(null);

  const [cartCount, setCartCount] =
    useState(0);

  const [user, setUser] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  const [openDropdown, setOpenDropdown] =
    useState(false);

  const [imageKey, setImageKey] =
    useState(Date.now());

  useEffect(() => {
    fetchNavbarData();

    const refreshNavbar =
      () => {
        fetchNavbarData();

        setImageKey(
          Date.now()
        );
      };

    window.addEventListener(
      "refreshNavbar",
      refreshNavbar
    );

    return () => {
      window.removeEventListener(
        "refreshNavbar",
        refreshNavbar
      );
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (
      e: any
    ) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(
          e.target
        )
      ) {
        setOpenDropdown(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  const fetchNavbarData =
    async () => {
      try {
        const [
          cartRes,
          userRes,
        ] = await Promise.all([
          axios.get(
            "/api/cart/get"
          ),

          axios.get(
            "/api/auth/me"
          ),
        ]);

        const items =
          cartRes.data.cart
            ?.items || [];

        const total =
          items.reduce(
            (
              acc: number,
              item: any
            ) =>
              acc +
              item.quantity,
            0
          );

        setCartCount(total);

        if (
          userRes.data.success
        ) {
          setUser(
            userRes.data.user
          );
        } else {
          setUser(null);
        }
      } catch (error) {
        setUser(null);

        setCartCount(0);
      } finally {
        setLoading(false);
      }
    };

  const handleLogout =
    async () => {
      try {
        await axios.post(
          "/api/auth/logout"
        );

        setUser(null);

        setCartCount(0);

        setOpenDropdown(false);

        setImageKey(
          Date.now()
        );

        window.dispatchEvent(
          new Event(
            "refreshNavbar"
          )
        );

        toast.success(
          "Logged out successfully"
        );

        router.push("/");

        router.refresh();
      } catch (error) {
        console.log(error);

        toast.error(
          "Logout failed"
        );
      }
    };

  const profileImage =
    user?.profileImage
      ? `${user.profileImage}?t=${imageKey}`
      : `https://ui-avatars.com/api/?name=${user?.name || "User"}&background=06b6d4&color=fff`;

  return (
    <header className="sticky top-0 z-50 border-b border-gray-800 bg-[#0B1120]/90 backdrop-blur-xl">

      <div className="max-w-7xl mx-auto px-4 lg:px-8">

        <div className="h-20 flex items-center justify-between">

          {/* LEFT */}
          <Link
            href="/"
            className="flex items-center gap-3 group"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center font-black text-lg shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition">
              T
            </div>

            <div>
              <h1 className="text-2xl font-black tracking-tight">
                TechStore
              </h1>

              <p className="text-xs text-gray-400 -mt-1">
                Premium Ecommerce
              </p>
            </div>
          </Link>

          {/* RIGHT */}
          <nav className="hidden lg:flex items-center gap-4">

            {loading ? (
              <div className="w-28 h-12 rounded-2xl bg-[#111827] animate-pulse" />
            ) : user ? (
              <>
  {user.role !== "admin" && (
                
                <Link href="/cart">
                  <Button
                    variant="ghost"
                    className="relative h-12 w-12 rounded-2xl border border-gray-800 bg-[#111827] hover:bg-[#1F2937] text-white transition"
                  >
                    <ShoppingCart className="w-5 h-5" />

                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-cyan-500 text-black text-xs flex items-center justify-center font-bold">
                        {cartCount}
                      </span>
                    )}
                  </Button>
                </Link>
)}
                {/* PROFILE */}
                <div
                  className="relative"
                  ref={dropdownRef}
                >
                  <button
                    onClick={() =>
                      setOpenDropdown(
                        !openDropdown
                      )
                    }
                    className="w-12 h-12 rounded-full overflow-hidden border-2 border-cyan-500 hover:scale-105 transition shadow-lg shadow-cyan-500/20"
                  >
                    <img
                      src={
                        profileImage
                      }
                      alt="profile"
                      className="w-full h-full object-cover"
                    />
                  </button>

                  {/* DROPDOWN */}
                  {openDropdown && (
                    <div className="absolute right-0 mt-4 w-72 rounded-3xl border border-gray-800 bg-[#111827] shadow-2xl overflow-hidden">

                      <div className="p-6 border-b border-gray-800 bg-gradient-to-b from-cyan-500/5 to-transparent">

                        <div className="flex items-center gap-4">

                          <img
                            src={
                              profileImage
                            }
                            alt="profile"
                            className="w-14 h-14 rounded-full border-2 border-cyan-500 object-cover"
                          />

                          <div>
                            <h3 className="font-bold text-lg">
                              {
                                user.name
                              }
                            </h3>

                            <p className="text-sm text-gray-400 mt-1 break-all">
                              {
                                user.email
                              }
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="p-3 space-y-2">

                        <Link
                          href="/profile"
                          onClick={() =>
                            setOpenDropdown(
                              false
                            )
                          }
                          className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-[#1F2937] transition"
                        >
                          <User className="w-5 h-5 text-cyan-400" />

                          <span className="font-medium">
                            My Profile
                          </span>
                        </Link>

                        {user.role !== "admin" && (
  <Link
    href="/orders"
                          onClick={() =>
                            setOpenDropdown(
                              false
                            )
                          }
                          className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-[#1F2937] transition"
                        >
                          <Package className="w-5 h-5 text-cyan-400" />

                          <span className="font-medium">
                            My Orders
                          </span>
                        </Link>
)}
                        {user.role ===
                          "admin" && (
                          <Link
                            href="/admin/dashboard"
                            onClick={() =>
                              setOpenDropdown(
                                false
                              )
                            }
                            className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-[#1F2937] transition"
                          >
                            <LayoutDashboard className="w-5 h-5 text-cyan-400" />

                            <span className="font-medium">
                              Admin Dashboard
                            </span>
                          </Link>
                        )}

                        <div className="pt-2 border-t border-gray-800">

                          <button
                            onClick={
                              handleLogout
                            }
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-red-500/10 text-red-400 transition"
                          >
                            <LogOut className="w-5 h-5" />

                            <span className="font-medium">
                              Logout
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link href="/login">
                <Button className="h-12 px-8 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 font-semibold shadow-lg shadow-cyan-500/20">
                  Login
                </Button>
              </Link>
            )}
          </nav>

          {/* MOBILE */}
          <Button
            variant="ghost"
            className="lg:hidden text-white hover:bg-[#111827] rounded-2xl"
          >
            <Menu />
          </Button>
        </div>
      </div>
    </header>
  );
}