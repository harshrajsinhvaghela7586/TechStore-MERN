"use client";

import axios from "axios";

import Link from "next/link";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Search,
  SlidersHorizontal,
  Star,
} from "lucide-react";

export default function ProductsPage() {
  const [products, setProducts] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  // SEARCH
  const [search, setSearch] =
    useState("");

  // CATEGORY
  const [category, setCategory] =
    useState("All");

  // BRAND
  const [brand, setBrand] =
    useState("All");

  // SORT
  const [sort, setSort] =
    useState("");

  // PRICE
  const [priceValue, setPriceValue] =
    useState("");

  const [priceType, setPriceType] =
    useState("less");

  // STOCK
  const [stockFilter, setStockFilter] =
    useState(false);

  // RATING
  const [rating, setRating] =
    useState(0);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts =
    async () => {
      try {
        const res =
          await axios.get(
            "/api/products/get"
          );

        const reversed = [
          ...res.data.products,
        ].reverse();

        setProducts(reversed);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

  // UNIQUE CATEGORIES
  const categories =
    useMemo(() => {
      const unique =
        new Set(
          products.map(
            (p) => p.category
          )
        );

      return [
        "All",
        ...Array.from(unique),
      ];
    }, [products]);

  // UNIQUE BRANDS
  const brands =
    useMemo(() => {
      const unique =
        new Set(
          products.map(
            (p) => p.brand
          )
        );

      return [
        "All",
        ...Array.from(unique),
      ];
    }, [products]);

  // FILTERED PRODUCTS
  const filteredProducts =
    useMemo(() => {
      let filtered = [
        ...products,
      ];

      // SEARCH
      filtered =
        filtered.filter(
          (product) =>
            product.title
              .toLowerCase()
              .includes(
                search.toLowerCase()
              )
        );

      // CATEGORY
      if (
        category !== "All"
      ) {
        filtered =
          filtered.filter(
            (product) =>
              product.category ===
              category
          );
      }

      // BRAND
      if (brand !== "All") {
        filtered =
          filtered.filter(
            (product) =>
              product.brand ===
              brand
          );
      }

      // PRICE FILTER
      if (priceValue) {
        filtered =
          filtered.filter(
            (product) => {
              if (
                priceType ===
                "less"
              ) {
                return (
                  product.price <=
                  Number(
                    priceValue
                  )
                );
              }

              return (
                product.price >=
                Number(
                  priceValue
                )
              );
            }
          );
      }

      // STOCK
      if (stockFilter) {
        filtered =
          filtered.filter(
            (product) =>
              product.stock > 0
          );
      }

      // RATING
      if (rating > 0) {
        filtered =
          filtered.filter(
            (product) =>
              product.rating >=
              rating
          );
      }

      // SORTING
      if (sort === "a-z") {
        filtered.sort(
          (a, b) =>
            a.title.localeCompare(
              b.title
            )
        );
      }

      if (sort === "low-high") {
        filtered.sort(
          (a, b) =>
            a.price - b.price
        );
      }

      if (sort === "high-low") {
        filtered.sort(
          (a, b) =>
            b.price - a.price
        );
      }

      if (sort === "newest") {
        filtered.sort(
          (a, b) =>
            new Date(
              b.createdAt
            ).getTime() -
            new Date(
              a.createdAt
            ).getTime()
        );
      }

      return filtered;
    }, [
      products,
      search,
      category,
      brand,
      sort,
      priceValue,
      priceType,
      stockFilter,
      rating,
    ]);

  const clearFilters =
    () => {
      setSearch("");
      setCategory("All");
      setBrand("All");
      setSort("");
      setPriceValue("");
      setPriceType("less");
      setStockFilter(false);
      setRating(0);
    };

  return (
    <div className="min-h-screen bg-[#0B1120] text-white overflow-hidden">

      {/* GLOW */}
      <div className="fixed top-0 left-0 w-[400px] h-[400px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="fixed bottom-0 right-0 w-[400px] h-[400px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 py-16 relative z-10">

        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-14">

          <div>

            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 text-cyan-400 text-sm font-semibold mb-6">

              <SlidersHorizontal className="w-4 h-4" />

              Premium Catalog
            </div>

            <h1 className="text-6xl font-black tracking-tight">
              Explore Products
            </h1>

            <p className="text-gray-400 mt-5 text-lg max-w-2xl leading-8">
              Browse premium gadgets,
              gaming accessories,
              flagship smartphones and
              futuristic electronics.
            </p>
          </div>

          {/* SEARCH */}
          <div className="relative w-full lg:w-[420px]">

            <input
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              placeholder="Search products..."
              className="w-full h-16 rounded-3xl bg-[#111827]/80 backdrop-blur-xl border border-gray-800 pl-16 pr-5 outline-none focus:border-cyan-500 transition"
            />

            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6" />
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-10">

          {/* SIDEBAR */}
          <div className="lg:sticky lg:top-28 h-fit">

            <div className="rounded-[36px] border border-gray-800 bg-[#111827]/80 backdrop-blur-xl p-8">

              <h2 className="text-3xl font-black">
                Filters
              </h2>

              {/* CATEGORY */}
              <div className="mt-10">

                <h3 className="text-lg font-bold mb-5">
                  Category
                </h3>

                <div className="space-y-3">

                  {categories.map(
                    (cat) => (
                      <button
                        key={cat}
                        onClick={() =>
                          setCategory(
                            cat
                          )
                        }
                        className={`w-full h-12 rounded-2xl text-left px-5 transition font-medium ${
                          category ===
                          cat
                            ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white"
                            : "bg-[#0B1120] border border-gray-800 hover:border-cyan-500/30"
                        }`}
                      >
                        {cat}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* BRAND */}
              <div className="mt-10">

                <h3 className="text-lg font-bold mb-5">
                  Brand
                </h3>

                <div className="space-y-3">

                  {brands.map(
                    (b) => (
                      <button
                        key={b}
                        onClick={() =>
                          setBrand(b)
                        }
                        className={`w-full h-12 rounded-2xl text-left px-5 transition font-medium ${
                          brand ===
                          b
                            ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white"
                            : "bg-[#0B1120] border border-gray-800 hover:border-cyan-500/30"
                        }`}
                      >
                        {b}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* PRICE */}
              <div className="mt-10">

                <h3 className="text-lg font-bold mb-5">
                  Price Filter
                </h3>

                <div className="space-y-4">

                  <input
                    type="number"
                    value={priceValue}
                    onChange={(e) =>
                      setPriceValue(
                        e.target.value
                      )
                    }
                    placeholder="Enter price..."
                    className="w-full h-14 rounded-2xl bg-[#0B1120] border border-gray-800 px-5 outline-none focus:border-cyan-500 transition"
                  />

                  <div className="grid grid-cols-2 gap-4">

                    <button
                      onClick={() =>
                        setPriceType(
                          "less"
                        )
                      }
                      className={`h-12 rounded-2xl font-semibold transition ${
                        priceType ===
                        "less"
                          ? "bg-gradient-to-r from-cyan-500 to-blue-600"
                          : "bg-[#0B1120] border border-gray-800"
                      }`}
                    >
                      Less Than
                    </button>

                    <button
                      onClick={() =>
                        setPriceType(
                          "greater"
                        )
                      }
                      className={`h-12 rounded-2xl font-semibold transition ${
                        priceType ===
                        "greater"
                          ? "bg-gradient-to-r from-cyan-500 to-blue-600"
                          : "bg-[#0B1120] border border-gray-800"
                      }`}
                    >
                      Greater Than
                    </button>
                  </div>
                </div>
              </div>

              {/* RATING */}
              <div className="mt-10">

                <h3 className="text-lg font-bold mb-5">
                  Rating
                </h3>

                <div className="space-y-3">

                  {[4, 3, 2, 1].map(
                    (r) => (
                      <button
                        key={r}
                        onClick={() =>
                          setRating(
                            r
                          )
                        }
                        className={`w-full h-12 rounded-2xl px-5 flex items-center gap-2 transition ${
                          rating ===
                          r
                            ? "bg-gradient-to-r from-cyan-500 to-blue-600"
                            : "bg-[#0B1120] border border-gray-800"
                        }`}
                      >
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />

                        {r}★ & Above
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* STOCK */}
              <div className="mt-10">

                <button
                  onClick={() =>
                    setStockFilter(
                      !stockFilter
                    )
                  }
                  className={`w-full h-14 rounded-2xl font-semibold transition ${
                    stockFilter
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600"
                      : "bg-[#0B1120] border border-gray-800"
                  }`}
                >
                  In Stock Only
                </button>
              </div>

              {/* SORT */}
              <div className="mt-10">

                <h3 className="text-lg font-bold mb-5">
                  Sort By
                </h3>

                <select
                  value={sort}
                  onChange={(e) =>
                    setSort(
                      e.target.value
                    )
                  }
                  className="w-full h-14 rounded-2xl bg-[#0B1120] border border-gray-800 px-5 outline-none"
                >
                  <option value="">
                    Default
                  </option>

                  <option value="newest">
                    Newest First
                  </option>

                  <option value="a-z">
                    A - Z
                  </option>

                  <option value="low-high">
                    Price Low → High
                  </option>

                  <option value="high-low">
                    Price High → Low
                  </option>
                </select>
              </div>

              {/* CLEAR */}
              <button
                onClick={
                  clearFilters
                }
                className="w-full mt-10 h-14 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 font-semibold hover:scale-[1.02] transition"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* PRODUCTS */}
          <div className="lg:col-span-3">

            <div className="flex items-center justify-between mb-10">

              <div>

                <h2 className="text-3xl font-black">
                  {
                    filteredProducts.length
                  }{" "}
                  Products
                </h2>

                <p className="text-gray-400 mt-2">
                  Premium products
                  curated for next-gen
                  shopping experience.
                </p>
              </div>
            </div>

            {loading ? (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

                {Array.from({
                  length: 6,
                }).map(
                  (_, index) => (
                    <div
                      key={index}
                      className="h-[450px] rounded-[32px] bg-[#111827] border border-gray-800 animate-pulse"
                    />
                  )
                )}
              </div>
            ) : filteredProducts.length ===
              0 ? (
              <div className="rounded-[40px] border border-gray-800 bg-[#111827]/80 backdrop-blur-xl p-20 text-center">

                <div className="w-28 h-28 rounded-full bg-cyan-500/10 flex items-center justify-center mx-auto">

                  <Search className="w-12 h-12 text-cyan-400" />
                </div>

                <h2 className="text-5xl font-black mt-10">
                  No Products Found
                </h2>

                <p className="text-gray-400 mt-5 text-lg max-w-xl mx-auto leading-8">
                  We couldn't find
                  products matching your
                  filters.
                </p>

                <button
                  onClick={
                    clearFilters
                  }
                  className="mt-10 h-14 px-8 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 font-semibold"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

                {filteredProducts.map(
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
            )}
          </div>
        </div>
      </div>
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

  useEffect(() => {
    if (
      !product.images ||
      product.images.length <= 1
    )
      return;

    const interval = setInterval(() => {
      setCurrentImage((prev) =>
        prev ===
        product.images.length - 1
          ? 0
          : prev + 1
      );
    }, 3000);

    return () =>
      clearInterval(interval);
  }, [product.images]);

  return (
    <Link
      href={`/products/${product.slug}`}
      className={`group relative rounded-[32px] overflow-hidden border border-gray-800 bg-[#111827]/80 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-cyan-500/10 ${
  product.stock <= 0
    ? "opacity-60"
    : "hover:border-cyan-500/40"
}`}>

      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/[0.03] to-blue-500/[0.03] opacity-0 group-hover:opacity-100 transition duration-500" />

      {/* IMAGE */}
      <div className="relative overflow-hidden">

        <img
          src={
            product.images?.[
              currentImage
            ]
          }
          alt={product.title}
          className="w-full h-80 object-cover group-hover:scale-110 transition duration-700"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-transparent to-transparent" />

        {/* CATEGORY */}
        <div className="absolute top-4 left-4">

          <div className="px-4 py-2 rounded-full bg-cyan-500/10 backdrop-blur-xl border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-wider">
            {product.category}
          </div>
        </div>

        {/* STOCK */}
        <div className="absolute top-4 right-4">

         <div className="absolute top-4 right-4">
  {product.stock > 0 ? (
    <div className="px-4 py-2 rounded-full bg-green-500 text-black text-xs font-bold">
      In Stock
    </div>
  ) : (
    <div className="px-4 py-2 rounded-full bg-red-500 text-white text-xs font-bold">
      Out Of Stock
    </div>
  )}
</div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="relative p-6">

        <h3 className="text-2xl font-black line-clamp-1">
          {product.title}
        </h3>

        <p className="text-gray-400 mt-3 line-clamp-2 min-h-[56px] leading-7">
          {product.description}
        </p>

        <div className="flex items-center justify-between mt-8">

          <div>

            <p className="text-sm text-gray-500">
              Starting From
            </p>

            <h4 className="text-3xl font-black mt-1">
              ₹
              {product.price.toLocaleString()}
            </h4>
          </div>

          <button className="h-12 px-5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 font-semibold hover:scale-105 transition">
            View
          </button>
        </div>
      </div>
    </Link>
  );
}