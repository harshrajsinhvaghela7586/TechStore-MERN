"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

 const handleLogout = async () => {
  try {
    await axios.post("/api/auth/logout");

    toast.success("Logged out");

    router.push("/login");

    router.refresh();
  } catch (error) {
    toast.error("Logout failed");
  }
};
  return (
    <div className="min-h-screen bg-[#0B1120] text-white flex">
      {/* Sidebar */}
      <aside className="w-72 border-r border-gray-800 bg-[#111827] p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-3xl font-black mb-10">
            TechStore
          </h2>

          <nav className="space-y-3">
            <Link
              href="/admin/dashboard"
              className="block rounded-2xl px-5 py-4 hover:bg-[#1F2937] transition"
            >
              Dashboard
            </Link>

            <Link
              href="/admin/products"
              className="block rounded-2xl px-5 py-4 hover:bg-[#1F2937] transition"
            >
              Products
            </Link>

            <Link
              href="/admin/orders"
              className="block rounded-2xl px-5 py-4 hover:bg-[#1F2937] transition"
            >
              Orders
            </Link>

            <Link
              href="/admin/users"
              className="block rounded-2xl px-5 py-4 hover:bg-[#1F2937] transition"
            >
              Users
            </Link>
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="w-full h-14 rounded-2xl bg-red-600 hover:bg-red-700 transition font-semibold"
        >
          Logout
        </button>
      </aside>

      {/* Main */}
      <main className="flex-1 p-10">
        {children}
      </main>
    </div>
  );
}