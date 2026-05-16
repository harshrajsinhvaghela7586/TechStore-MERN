"use client";

import axios from "axios";
import {
  formatPrice,
} from "@/lib/utils";
import Link from "next/link";

import {
  useEffect,
  useState,
} from "react";

import {
  toast,
} from "sonner";

import {
  Plus,
  Pencil,
  Trash2,
  Package2,
} from "lucide-react";

export default function ProductsPage() {
  const [products, setProducts] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [deleteLoading, setDeleteLoading] =
    useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts =
    async () => {
      try {
        setLoading(true);

        const res =
          await axios.get(
            "/api/products/get"
          );

        setProducts(
          res.data.products || []
        );
      } catch (error) {
        console.log(error);

        toast.error(
          "Failed to load products"
        );
      } finally {
        setLoading(false);
      }
    };

  const handleDelete =
    async (
      id: string
    ) => {
      try {
        const confirmDelete =
          window.confirm(
            "Delete this product?"
          );

        if (!confirmDelete)
          return;

        setDeleteLoading(id);

        await axios.delete(
          `/api/products/delete/${id}`
        );

        toast.success(
          "Product deleted"
        );

        setProducts((prev) =>
          prev.filter(
            (item) =>
              item._id !== id
          )
        );
      } catch (error: any) {
        console.log(error);

        toast.error(
          error.response?.data
            ?.message ||
            "Delete failed"
        );
      } finally {
        setDeleteLoading("");
      }
    };

  return (
    <div className="min-h-screen text-white">

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">

        <div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-semibold mb-5">
            
            <Package2 className="w-4 h-4" />

            Admin Products
          </div>

          <h1 className="text-5xl font-black">
            Products
          </h1>

          <p className="text-gray-400 mt-4 text-lg">
            Manage all store products
          </p>
        </div>

        <Link
          href="/admin/products/create"
          className="h-14 px-8 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center gap-3 font-semibold hover:scale-[1.02] transition"
        >
          <Plus className="w-5 h-5" />

          Add Product
        </Link>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

          {Array.from({
            length: 6,
          }).map((_, index) => (
            <div
              key={index}
              className="h-[300px] rounded-[32px] border border-gray-800 bg-[#111827] animate-pulse"
            />
          ))}
        </div>
      ) : products.length === 0 ? (

        /* Empty */
        <div className="rounded-[40px] border border-gray-800 bg-[#111827] p-20 text-center">

          <h2 className="text-5xl font-black">
            No Products
          </h2>

          <p className="text-gray-400 mt-5 text-lg">
            Add your first product
          </p>

          <Link
            href="/admin/products/create"
            className="inline-flex mt-10 h-14 px-8 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 items-center font-semibold"
          >
            Create Product
          </Link>
        </div>
      ) : (

        /* Grid */
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

          {products.map(
            (product) => (
              <div
                key={product._id}
                className="rounded-[32px] overflow-hidden border border-gray-800 bg-[#111827] hover:border-cyan-500/30 transition"
              >

                {/* Image */}
                <div className="relative">

                  <img
                    src={
                      product.images?.[0] ||
                      "https://placehold.co/600x600/png"
                    }
                    className="w-full h-72 object-cover"
                  />

                  <div className="absolute top-4 left-4">

                    <div className="px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase">
                      {product.category}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">

                  <h2 className="text-2xl font-black line-clamp-1">
                    {product.title}
                  </h2>

                  <p className="text-gray-400 mt-2">
                    {product.brand}
                  </p>

                  <div className="flex items-center justify-between mt-8">

                    <div>
                      <p className="text-sm text-gray-500">
                        Price
                      </p>

                      <h3 className="text-3xl font-black mt-1">
                        {formatPrice(product.price)}
                      </h3>
                    </div>

                    <div
                      className={`px-4 py-2 rounded-full text-sm font-bold ${
                        product.stock > 0
                          ? "bg-green-500 text-black"
                          : "bg-red-500 text-white"
                      }`}
                    >
                      {product.stock > 0
                        ? `${product.stock} In Stock`
                        : "Out of Stock"}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-4 mt-8">

                    <Link
                      href={`/admin/products/edit/${product._id}`}
                      className="h-12 rounded-2xl bg-blue-600 flex items-center justify-center gap-2 font-semibold hover:opacity-90 transition"
                    >
                      <Pencil className="w-4 h-4" />

                      Edit
                    </Link>

                    <button
                      onClick={() =>
                        handleDelete(
                          product._id
                        )
                      }
                      disabled={
                        deleteLoading ===
                        product._id
                      }
                      className="h-12 rounded-2xl bg-red-600 flex items-center justify-center gap-2 font-semibold hover:opacity-90 transition disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />

                      {deleteLoading ===
                      product._id
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}