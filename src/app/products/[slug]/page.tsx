"use client";

import axios from "axios";
import { formatPrice } from "@/lib/utils";
import {
  Heart,
  ShoppingCart,
  Star,
  Truck,
  ShieldCheck,
  RotateCcw,
  Zap,
} from "lucide-react";

import {
  use,
  useEffect,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import { toast } from "sonner";

export default function ProductDetails({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

  const router = useRouter();

  const [product, setProduct] =
    useState<any>(null);

  const [selectedImage, setSelectedImage] =
    useState(0);

  const [alreadyInCart, setAlreadyInCart] =
    useState(false);

  const [cartLoading, setCartLoading] =
    useState(false);

  const [buyLoading, setBuyLoading] =
    useState(false);

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      const res = await axios.get(
        `/api/products/${slug}`
      );

      setProduct(res.data.product);

      checkCartStatus(
        res.data.product._id
      );
    } catch (error) {
      console.log(error);

      toast.error(
        "Failed to load product"
      );
    }
  };

  const checkCartStatus =
    async (
      productId: string
    ) => {
      try {
        const res =
          await axios.get(
            "/api/cart/get"
          );

        const items =
          res.data.cart?.items || [];

        const exists =
          items.some(
            (item: any) =>
              item.product?._id ===
              productId
          );

        setAlreadyInCart(
          exists
        );
      } catch (error) {
        console.log(error);
      }
    };

const handleAddToCart =
  async () => {
    try {
      if (alreadyInCart) {
        router.push("/cart");

        return;
      }

      setCartLoading(true);

      const res =
        await axios.post(
          "/api/cart/add",
          {
            productId:
              product._id,

            quantity: 1,
          }
        );

      if (
        res.data.success
      ) {
        setAlreadyInCart(
          true
        );

        toast.success(
          "Added to cart"
        );

        window.dispatchEvent(
          new Event(
            "refreshNavbar"
          )
        );
      }
    } catch (error: any) {
      console.log(error);

      toast.error(
        error.response?.data
          ?.message ||
          "Failed to add cart"
      );
    } finally {
      setCartLoading(false);
    }
  };

  const handleBuyNow =
  async () => {
    try {
      setBuyLoading(true);

      await axios.post(
        "/api/cart/add",
        {
          productId:
            product._id,

          quantity: 1,
        }
      );

      window.dispatchEvent(
        new Event(
          "refreshNavbar"
        )
      );

      router.push(
        "/checkout/address"
      );
    } catch (error: any) {
      console.log(error);

      toast.error(
        error.response?.data
          ?.message ||
          "Buy now failed"
      );
    } finally {
      setBuyLoading(false);
    }
  };

  
  if (!product) {
    return (
      <div className="min-h-screen bg-[#0B1120] text-white flex items-center justify-center text-2xl font-bold">
        Loading Product...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B1120] text-white pb-40">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-16">

          {/* LEFT */}
          <div>
            <div className="rounded-[40px] overflow-hidden border border-gray-800 bg-[#111827]">
              <img
                src={
                  product.images?.[
                    selectedImage
                  ]
                }
                alt={product.title}
                className="w-full h-[650px] object-cover"
              />
            </div>

            <div className="flex gap-4 mt-6 overflow-x-auto">
              {product.images?.map(
                (
                  image: string,
                  index: number
                ) => (
                  <button
                    key={index}
                    onClick={() =>
                      setSelectedImage(
                        index
                      )
                    }
                    className={`w-24 h-24 rounded-2xl overflow-hidden border-2 transition ${
                      selectedImage ===
                      index
                        ? "border-cyan-500"
                        : "border-gray-800"
                    }`}
                  >
                    <img
                      src={image}
                      alt="product"
                      className="w-full h-full object-cover"
                    />
                  </button>
                )
              )}
            </div>
          </div>

          {/* RIGHT */}
          <div>
            <div className="inline-flex px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm">
              {product.category}
            </div>

            <h1 className="text-5xl font-black mt-6 leading-tight">
              {product.title}
            </h1>

            <div className="flex items-center gap-2 mt-6">
              <div className="flex text-yellow-400">
                <Star fill="currentColor" />
                <Star fill="currentColor" />
                <Star fill="currentColor" />
                <Star fill="currentColor" />
                <Star fill="currentColor" />
              </div>

              <span className="text-gray-400">
                (4.9 Reviews)
              </span>
            </div>

            <div className="flex items-center gap-5 mt-10">
              <h2 className="text-6xl font-black">
                {formatPrice(product.price)}
              </h2>

              <div
                className={`px-4 py-2 rounded-full text-sm border ${
                  product.stock > 0
                    ? "bg-green-500/10 border-green-500/20 text-green-400"
                    : "bg-red-500/10 border-red-500/20 text-red-400"
                }`}
              >
                {product.stock > 0
                  ? `In Stock : ${product.stock}`
                  : "Out Of Stock"}
              </div>
            </div>

            <div className="mt-12 space-y-5">
              <div className="flex items-center justify-between border-b border-gray-800 pb-5">
                <span className="text-gray-400">
                  Brand
                </span>

                <span className="font-semibold text-lg">
                  {product.brand}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-gray-800 pb-5">
                <span className="text-gray-400">
                  Shipping
                </span>

                <span className="font-semibold text-lg">
                  Free Delivery
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-12">
              <div className="rounded-3xl border border-gray-800 bg-[#111827] p-5 text-center">
                <Truck className="mx-auto mb-3 text-cyan-400" />

                <p className="font-semibold">
                  Fast Delivery
                </p>
              </div>

              <div className="rounded-3xl border border-gray-800 bg-[#111827] p-5 text-center">
                <ShieldCheck className="mx-auto mb-3 text-cyan-400" />

                <p className="font-semibold">
                  Warranty
                </p>
              </div>

              <div className="rounded-3xl border border-gray-800 bg-[#111827] p-5 text-center">
                <RotateCcw className="mx-auto mb-3 text-cyan-400" />

                <p className="font-semibold">
                  Easy Return
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-24">
          <h2 className="text-4xl font-black mb-10">
            Product Description
          </h2>

          <div className="rounded-[40px] border border-gray-800 bg-[#111827] p-10">
            <p className="text-gray-400 leading-9 text-lg">
              {product.description}
            </p>
          </div>
        </div>
      </div>

      {/* Sticky Bottom */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-gray-800 bg-[#111827]/95 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 py-5 flex items-center gap-5">
          
        

          <button
            onClick={
              handleAddToCart
            }
            disabled={
              cartLoading ||
              product.stock === 0
            }
            className="flex-1 h-16 rounded-2xl bg-gray-800 hover:bg-gray-700 transition flex items-center justify-center gap-3 font-semibold text-lg disabled:opacity-50"
          >
            <ShoppingCart />

            {cartLoading
              ? "Loading..."
              : alreadyInCart
              ? "View Cart"
              : "Add To Cart"}
          </button>

          <button
            onClick={
              handleBuyNow
            }
            disabled={
              buyLoading ||
              product.stock === 0
            }
            className="flex-1 h-16 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center gap-3 font-semibold text-lg disabled:opacity-50"
          >
            <Zap />

            {buyLoading
              ? "Processing..."
              : "Buy Now"}
          </button>
        </div>
      </div>
    </div>
  );
}