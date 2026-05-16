import { ArrowRight } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-24 lg:py-36 grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-cyan-300 mb-8">
            Premium Electronics Platform
          </div>

          <h1 className="text-5xl lg:text-7xl font-black leading-tight tracking-tight">
            The Future
            <span className="block bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Of Tech Shopping
            </span>
          </h1>

          <p className="mt-8 text-gray-400 text-lg leading-8 max-w-xl">
            Discover flagship smartphones, gaming accessories,
            laptops, and premium gadgets curated for modern users.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <button className="h-14 px-8 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 font-semibold flex items-center gap-2 hover:scale-105 transition">
              Shop Now
              <ArrowRight className="w-5 h-5" />
            </button>

            <button className="h-14 px-8 rounded-2xl border border-gray-700 bg-[#111827] hover:bg-[#1f2937] transition">
              Explore Products
            </button>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-cyan-500/20 blur-[120px] rounded-full" />

          <img
            src="https://images.unsplash.com/photo-1517336714739-489689fd1ca8"
            alt="Laptop"
            className="relative rounded-[40px] border border-gray-800 shadow-2xl"
          />
        </div>
      </div>
    </section>
  );
}