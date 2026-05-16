"use client";

import axios from "axios";

import Link from "next/link";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ArrowRight,
  BadgeCheck,
  ChevronRight,
  Cpu,
  Headphones,
  Laptop,
  Loader2,
  PackageCheck,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Star,
  Truck,
} from "lucide-react";

import { formatPrice } from "@/lib/utils";

const PRODUCTS_ROUTE = "/products";

const getProductRoute = (slug: string) => {
  return `/products/${slug}`;
};

export default function HomePage() {
  const [user, setUser] =
    useState<any>(null);

  const [products, setProducts] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [heroIndex, setHeroIndex] =
    useState(0);

  const [heroImageIndex, setHeroImageIndex] =
    useState(0);

  useEffect(() => {
    initialize();

    const refreshNavbar = () => {
      getCurrentUser();
    };

    const userUpdated = () => {
      getCurrentUser();
    };

    window.addEventListener(
      "refreshNavbar",
      refreshNavbar
    );

    window.addEventListener(
      "userUpdated",
      userUpdated
    );

    return () => {
      window.removeEventListener(
        "refreshNavbar",
        refreshNavbar
      );

      window.removeEventListener(
        "userUpdated",
        userUpdated
      );
    };
  }, []);

  const initialize = async () => {
    setLoading(true);

    await Promise.all([
      getCurrentUser(),
      fetchProducts(),
    ]);
  };

  const getCurrentUser = async () => {
    try {
      const res = await axios.get(
        "/api/auth/me"
      );

      if (res.data.success) {
        setUser(res.data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        "/api/products/get"
      );

      const productList =
        res.data.products || [];

      const latest = [
        ...productList,
      ].reverse();

      setProducts(
        latest.slice(0, 8)
      );
    } catch (error) {
      console.log(
        "HOME PRODUCTS ERROR:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const heroProducts = useMemo(() => {
    const inStockProducts =
      products.filter(
        (item) => item.stock > 0
      );

    return inStockProducts.length > 0
      ? inStockProducts.slice(0, 5)
      : products.slice(0, 5);
  }, [products]);

  const heroProduct = useMemo(() => {
    if (heroProducts.length === 0) {
      return null;
    }

    return (
      heroProducts[
        heroIndex %
          heroProducts.length
      ]
    );
  }, [heroProducts, heroIndex]);

  const heroImages = useMemo(() => {
    if (
      heroProduct?.images &&
      heroProduct.images.length > 0
    ) {
      return heroProduct.images;
    }

    return [
      "https://images.unsplash.com/photo-1517336714739-489689fd1ca8?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1600&auto=format&fit=crop",
    ];
  }, [heroProduct]);

  const heroImage =
    heroImages[
      heroImageIndex %
        heroImages.length
    ];

  useEffect(() => {
    if (heroProducts.length <= 1) {
      return;
    }

    const interval = setInterval(
      () => {
        setHeroIndex((prev) =>
          prev + 1
        );

        setHeroImageIndex(0);
      },
      6500
    );

    return () =>
      clearInterval(interval);
  }, [heroProducts.length]);

  useEffect(() => {
    if (heroImages.length <= 1) {
      return;
    }

    const interval = setInterval(
      () => {
        setHeroImageIndex((prev) =>
          prev + 1
        );
      },
      2800
    );

    return () =>
      clearInterval(interval);
  }, [heroImages.length, heroProduct?._id]);

  const featuredProducts =
    useMemo(() => {
      return products.slice(0, 4);
    }, [products]);

  const categories = [
    {
      title: "Smartphones",
      icon: Smartphone,
      href: `${PRODUCTS_ROUTE}?category=smartphone`,
      description:
        "Flagship phones and daily drivers.",
    },
    {
      title: "Laptops",
      icon: Laptop,
      href: `${PRODUCTS_ROUTE}?category=laptop`,
      description:
        "Work, study and gaming machines.",
    },
    {
      title: "Accessories",
      icon: Headphones,
      href: `${PRODUCTS_ROUTE}?category=accessories`,
      description:
        "Audio, chargers and smart add-ons.",
    },
    {
      title: "Gaming",
      icon: Cpu,
      href: `${PRODUCTS_ROUTE}?category=gaming`,
      description:
        "Performance gear for gamers.",
    },
  ];

  return (
    <main className="min-h-screen overflow-hidden bg-[#070B14] text-white">
      {/* BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full bg-cyan-500/10 blur-[130px]" />

        <div className="absolute top-40 right-0 h-[480px] w-[480px] rounded-full bg-blue-600/10 blur-[140px]" />

        <div className="absolute bottom-0 left-1/3 h-[420px] w-[420px] rounded-full bg-indigo-500/10 blur-[130px]" />

        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(circle_at_top,black,transparent_72%)]" />
      </div>

      <div className="relative z-10">
        {/* HERO */}
        <section className="mx-auto max-w-7xl px-4 pt-24 pb-14 sm:px-6 lg:px-8 lg:pt-28 lg:pb-20">
          <div className="grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
            {/* LEFT */}
            <div className="relative z-20">
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-5 py-2.5 text-sm font-bold text-cyan-300 shadow-lg shadow-cyan-500/5 backdrop-blur-xl">
                <Sparkles className="h-4 w-4" />
                Premium Tech Shopping Platform
              </div>

              <h1 className="max-w-4xl text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-[76px]">
                Upgrade your
                <span className="mt-2 block bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-300 bg-clip-text text-transparent">
                  digital lifestyle.
                </span>
              </h1>

              <p className="mt-7 max-w-xl text-base leading-8 text-slate-400 sm:text-lg">
                Discover premium gadgets,
                laptops, smartphones, gaming
                accessories and next-generation
                electronics with secure checkout,
                fast delivery and a refined
                shopping experience.
              </p>

              <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                <Link
                  href={PRODUCTS_ROUTE}
                  className="group inline-flex h-14 items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-8 text-base font-black text-white shadow-2xl shadow-cyan-500/20 transition hover:-translate-y-1 hover:shadow-cyan-500/35"
                >
                  Explore Products
                  <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
                </Link>

                <Link
                  href="/cart"
                  className="inline-flex h-14 items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-8 text-base font-bold text-white backdrop-blur-xl transition hover:border-cyan-400/30 hover:bg-white/[0.07]"
                >
                  <ShoppingBag className="h-5 w-5 text-cyan-300" />
                  View Cart
                </Link>
              </div>

              {/* USER CARD */}
              {user ? (
                <div className="mt-9 max-w-xl rounded-[30px] border border-cyan-400/20 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-indigo-500/10 p-5 shadow-2xl shadow-cyan-500/10 backdrop-blur-2xl">
                  <div className="flex items-center gap-5">
                    <div className="relative">
                      <img
                        src={
                          user.profileImage ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            user.name || "User"
                          )}&background=06b6d4&color=fff`
                        }
                        alt={
                          user.name ||
                          "User"
                        }
                        className="h-16 w-16 rounded-2xl border border-cyan-300/40 object-cover shadow-lg shadow-cyan-500/20"
                      />

                      <div className="absolute -right-1 -bottom-1 rounded-full border-4 border-[#101827] bg-green-400 p-1.5" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-black uppercase tracking-[0.25em] text-cyan-300">
                        Welcome Back
                      </p>

                      <h3 className="mt-1 truncate text-2xl font-black">
                        {user.name}
                      </h3>

                      <p className="mt-1 truncate text-sm text-slate-400">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-9 flex flex-wrap items-center gap-3 text-sm text-slate-400">
                  <span>
                    New here?
                  </span>

                  <Link
                    href="/register"
                    className="font-bold text-cyan-300 hover:text-cyan-200"
                  >
                    Create an account
                  </Link>

                  <span className="text-slate-700">
                    /
                  </span>

                  <Link
                    href="/login"
                    className="font-bold text-white hover:text-cyan-200"
                  >
                    Login
                  </Link>
                </div>
              )}

              {/* TRUST BAR */}
              <div className="mt-9 grid gap-4 sm:grid-cols-3">
                <TrustItem
                  icon={
                    ShieldCheck
                  }
                  title="Secure Checkout"
                  description="JWT auth + Stripe payment"
                />

                <TrustItem
                  icon={Truck}
                  title="Fast Delivery"
                  description="Across India"
                />

                <TrustItem
                  icon={
                    BadgeCheck
                  }
                  title="Verified Flow"
                  description="OTP based account security"
                />
              </div>
            </div>

            {/* RIGHT HERO CARD */}
            <div className="relative z-10">
              <div className="absolute inset-0 rounded-[44px] bg-gradient-to-br from-cyan-500/20 via-blue-500/10 to-indigo-500/20 blur-3xl" />

              <div className="relative overflow-hidden rounded-[38px] border border-white/10 bg-white/[0.05] shadow-2xl shadow-black/40 backdrop-blur-2xl">
                <div className="relative h-[520px] sm:h-[580px] lg:h-[610px]">
                  <img
                    key={heroImage}
                    src={heroImage}
                    alt={
                      heroProduct?.title ||
                      "Premium tech product"
                    }
                    className="h-full w-full object-cover transition-all duration-700 ease-out"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#070B14] via-[#070B14]/20 to-transparent" />

                  <div className="absolute left-6 top-6 z-20 rounded-full border border-cyan-300/20 bg-[#08202b]/70 px-5 py-2.5 text-xs font-black uppercase tracking-[0.25em] text-cyan-200 backdrop-blur-xl">
                    Featured Drop
                  </div>

                  <div className="absolute right-6 top-6 z-20 hidden rounded-3xl border border-white/10 bg-black/30 p-4 backdrop-blur-xl sm:block">
                    <div className="flex items-center gap-2 text-yellow-300">
                      {Array.from({
                        length: 5,
                      }).map(
                        (_, index) => (
                          <Star
                            key={index}
                            className="h-4 w-4 fill-yellow-300"
                          />
                        )
                      )}
                    </div>

                    <p className="mt-2 text-xs font-bold text-slate-300">
                      Premium Rated
                    </p>
                  </div>

                  
                  <div className="absolute bottom-0 left-0 right-0 z-20 p-4 sm:p-6">
                    <div className="rounded-[30px] border border-white/10 bg-[#061018]/75 p-5 shadow-2xl backdrop-blur-2xl sm:p-6">
                      <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-300">
                        Featured Product
                      </p>

                      <div className="mt-3 grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
                        <div className="min-w-0">
                          <h2 className="line-clamp-1 text-2xl font-black sm:text-3xl">
                            {heroProduct
                              ?.title ||
                              "Premium Tech Collection"}
                          </h2>

                          <p className="mt-4 line-clamp-2 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
                            {heroProduct
                              ?.description ||
                              "Explore latest electronics with secure checkout and premium shopping experience."}
                          </p>

                          <div className="mt-6">
                            <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">
                              Starting From
                            </p>

                            <h3 className="mt-1 text-3xl font-black text-white sm:text-4xl">
                              {formatPrice(
                                heroProduct
                                  ?.price || 0
                              )}
                            </h3>
                          </div>
                        </div>

                        <div className="flex flex-col gap-4">
                          <div className="hidden rounded-3xl border border-white/10 bg-[#0B1120]/80 p-4 backdrop-blur-xl lg:block">
                            <div className="flex items-center gap-3">
                              <div className="rounded-2xl bg-green-500/10 p-3">
                                <ShieldCheck className="h-6 w-6 text-green-300" />
                              </div>

                              <div>
                                <p className="text-sm font-black">
                                  Secure Payment
                                </p>

                                <p className="text-xs text-slate-500">
                                  Stripe checkout
                                </p>
                              </div>
                            </div>
                          </div>

                          {heroProduct ? (
                            <Link
                              href={getProductRoute(
                                heroProduct.slug
                              )}
                              className="group inline-flex h-13 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-7 py-3 font-black text-white shadow-lg shadow-cyan-500/20 transition hover:-translate-y-1"
                            >
                              View Product
                              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                            </Link>
                          ) : (
                            <Link
                              href={
                                PRODUCTS_ROUTE
                              }
                              className="inline-flex h-13 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-7 py-3 font-black text-white"
                            >
                              Browse Store
                              <ArrowRight className="h-4 w-4" />
                            </Link>
                          )}
                        </div>
                      </div>

                      {heroImages.length > 1 && (
                        <div className="mt-5 flex gap-2">
                          {heroImages
                            .slice(0, 5)
                            .map(
                              (
                                _:unknown,
                                index:number
                              ) => (
                                <button
                                  key={
                                    index
                                  }
                                  type="button"
                                  onClick={() =>
                                    setHeroImageIndex(
                                      index
                                    )
                                  }
                                  className={`h-1.5 rounded-full transition-all ${
                                    index ===
                                    heroImageIndex %
                                      heroImages.length
                                      ? "w-8 bg-cyan-300"
                                      : "w-3 bg-white/25 hover:bg-white/50"
                                  }`}
                                />
                              )
                            )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* STATS */}
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              value="100%"
              label="Secure checkout"
            />

            <StatCard
              value="24/7"
              label="Shopping access"
            />

            <StatCard
              value="Fast"
              label="Order processing"
            />

            <StatCard
              value="OTP"
              label="Verified accounts"
            />
          </div>
        </section>

        {/* CATEGORIES */}
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.28em] text-cyan-300">
                Shop by category
              </p>

              <h2 className="mt-3 text-4xl font-black sm:text-5xl">
                Explore Tech Categories
              </h2>
            </div>

            <Link
              href={PRODUCTS_ROUTE}
              className="inline-flex items-center gap-2 font-bold text-cyan-300 hover:text-cyan-200"
            >
              Browse all
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {categories.map(
              (category) => {
                const Icon =
                  category.icon;

                return (
                  <Link
                    key={
                      category.title
                    }
                    href={
                      category.href
                    }
                    className="group rounded-[30px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl transition hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-white/[0.07] hover:shadow-2xl hover:shadow-cyan-500/10"
                  >
                    <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-300 transition group-hover:scale-110">
                      <Icon className="h-8 w-8" />
                    </div>

                    <h3 className="text-2xl font-black">
                      {category.title}
                    </h3>

                    <p className="mt-3 leading-7 text-slate-400">
                      {
                        category.description
                      }
                    </p>

                    <div className="mt-6 inline-flex items-center gap-2 text-sm font-black text-cyan-300">
                      Explore
                      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                    </div>
                  </Link>
                );
              }
            )}
          </div>
        </section>

        {/* FEATURED PRODUCTS */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mb-12 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.28em] text-cyan-300">
                Premium Collection
              </p>

              <h2 className="mt-3 text-4xl font-black sm:text-5xl">
                Featured Products
              </h2>

              <p className="mt-4 max-w-2xl text-slate-400">
                Latest products from your
                catalog with premium cards,
                stock visibility and direct
                product navigation.
              </p>
            </div>

            <Link
              href={PRODUCTS_ROUTE}
              className="hidden h-14 items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-7 font-black shadow-lg shadow-cyan-500/20 transition hover:-translate-y-1 md:inline-flex"
            >
              View All Products
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>

          {loading ? (
            <ProductSkeletonGrid />
          ) : featuredProducts.length >
            0 ? (
            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
              {featuredProducts.map(
                (product) => (
                  <ProductCard
                    key={
                      product._id
                    }
                    product={
                      product
                    }
                  />
                )
              )}
            </div>
          ) : (
            <EmptyProducts />
          )}

          <div className="mt-10 md:hidden">
            <Link
              href={PRODUCTS_ROUTE}
              className="flex h-14 items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-7 font-black shadow-lg shadow-cyan-500/20"
            >
              View All Products
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[40px] border border-white/10 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-indigo-500/10 p-8 shadow-2xl shadow-cyan-500/10 backdrop-blur-2xl sm:p-12">
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />

            <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />

            <div className="relative z-10 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.28em] text-cyan-300">
                  Ready to shop?
                </p>

                <h2 className="mt-4 max-w-3xl text-4xl font-black sm:text-5xl">
                  Experience a modern
                  production-style ecommerce
                  platform.
                </h2>

                <p className="mt-5 max-w-2xl leading-8 text-slate-400">
                  Browse products, add to cart,
                  checkout securely with Stripe
                  and receive invoice emails after
                  successful payment.
                </p>
              </div>

              <Link
                href={PRODUCTS_ROUTE}
                className="inline-flex h-14 items-center justify-center gap-3 rounded-2xl bg-white px-8 font-black text-[#0B1120] transition hover:-translate-y-1 hover:bg-cyan-100"
              >
                Start Shopping
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function TrustItem({
  icon: Icon,
  title,
  description,
}: {
  icon: any;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-300">
        <Icon className="h-6 w-6" />
      </div>

      <h3 className="font-black">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {description}
      </p>
    </div>
  );
}

function StatCard({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
      <p className="text-3xl font-black text-white">
        {value}
      </p>

      <p className="mt-2 text-sm font-medium text-slate-500">
        {label}
      </p>
    </div>
  );
}

function ProductSkeletonGrid() {
  return (
    <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
      {Array.from({
        length: 4,
      }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-[34px] border border-white/10 bg-white/[0.04] p-4"
        >
          <div className="h-[300px] animate-pulse rounded-[26px] bg-white/10" />

          <div className="mt-6 h-4 w-24 animate-pulse rounded-full bg-white/10" />

          <div className="mt-4 h-8 w-4/5 animate-pulse rounded-full bg-white/10" />

          <div className="mt-4 h-4 w-full animate-pulse rounded-full bg-white/10" />

          <div className="mt-3 h-4 w-2/3 animate-pulse rounded-full bg-white/10" />

          <div className="mt-8 flex items-center justify-between">
            <div className="h-10 w-28 animate-pulse rounded-2xl bg-white/10" />

            <div className="h-10 w-24 animate-pulse rounded-2xl bg-white/10" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyProducts() {
  return (
    <div className="rounded-[34px] border border-white/10 bg-white/[0.04] p-12 text-center backdrop-blur-xl">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-cyan-500/10 text-cyan-300">
        <Loader2 className="h-9 w-9" />
      </div>

      <h3 className="mt-6 text-3xl font-black">
        No products available
      </h3>

      <p className="mx-auto mt-3 max-w-xl text-slate-400">
        Add products from admin panel to
        display them on the homepage.
      </p>
    </div>
  );
}

function ProductCard({
  product,
}: {
  product: any;
}) {
  const [currentImage, setCurrentImage] =
    useState(0);

  const images =
    product.images?.length > 0
      ? product.images
      : [
          "https://images.unsplash.com/photo-1517336714739-489689fd1ca8?q=80&w=1200&auto=format&fit=crop",
        ];

  const hasDiscount =
    product.discountPrice &&
    product.discountPrice <
      product.price;

  const displayPrice =
    hasDiscount
      ? product.discountPrice
      : product.price;

  useEffect(() => {
    if (images.length <= 1) {
      return;
    }

    const interval = setInterval(
      () => {
        setCurrentImage((prev) =>
          prev ===
          images.length - 1
            ? 0
            : prev + 1
        );
      },
      3500
    );

    return () =>
      clearInterval(interval);
  }, [images.length]);

  return (
    <Link
      href={getProductRoute(
        product.slug
      )}
      className={`group relative overflow-hidden rounded-[34px] border bg-white/[0.04] backdrop-blur-2xl transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_90px_rgba(6,182,212,0.16)] ${
        product.stock > 0
          ? "border-white/10 hover:border-cyan-400/40"
          : "border-red-500/20 opacity-75"
      }`}
    >
      <div className="absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-blue-500/10" />
      </div>

      {/* IMAGE */}
      <div className="relative overflow-hidden">
        <img
          src={images[currentImage]}
          alt={product.title}
          className="h-[340px] w-full object-cover transition duration-700 group-hover:scale-110"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#070B14] via-[#070B14]/15 to-transparent" />

        <div className="absolute left-5 top-5 z-10">
          <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-cyan-300 backdrop-blur-xl">
            {product.category}
          </span>
        </div>

        <div className="absolute right-5 top-5 z-10">
          {product.stock > 0 ? (
            <span className="rounded-full bg-green-400 px-4 py-2 text-[10px] font-black uppercase tracking-wider text-[#07111f]">
              In Stock
            </span>
          ) : (
            <span className="rounded-full bg-red-500 px-4 py-2 text-[10px] font-black uppercase tracking-wider text-white">
              Out Of Stock
            </span>
          )}
        </div>

        {hasDiscount && (
          <div className="absolute left-5 bottom-5 z-10 rounded-2xl border border-red-400/20 bg-red-500/15 px-4 py-2 text-xs font-black text-red-200 backdrop-blur-xl">
            Special Price
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="relative z-10 p-6">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-300">
          {product.brand}
        </p>

        <h3 className="mt-3 line-clamp-2 min-h-[72px] text-2xl font-black leading-tight">
          {product.title}
        </h3>

        <p className="mt-4 line-clamp-3 min-h-[78px] text-sm leading-7 text-slate-400">
          {product.description}
        </p>

        <div className="mt-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">
              Price
            </p>

            <div className="mt-1 flex flex-wrap items-center gap-2">
              <h4 className="text-3xl font-black">
                {formatPrice(
                  displayPrice || 0
                )}
              </h4>

              {hasDiscount && (
                <span className="text-sm font-bold text-slate-500 line-through">
                  {formatPrice(
                    product.price
                  )}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1 text-yellow-300">
            <Star className="h-4 w-4 fill-yellow-300" />

            <span className="text-sm font-black text-white">
              {Number(
                product.rating || 4
              ).toFixed(1)}
            </span>
          </div>
        </div>

        <div className="mt-7 flex items-center justify-center gap-4">
          

          <div
            className={`inline-flex h-11 items-center justify-center rounded-2xl px-5 text-sm font-black transition ${
              product.stock > 0
                ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20 group-hover:-translate-y-0.5"
                : "bg-white/10 text-slate-500"
            }`}
          >
            {product.stock > 0
              ? "View"
              : "Sold Out"}
          </div>
        </div>
      </div>
    </Link>
  );
}