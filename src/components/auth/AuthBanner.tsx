import { ShieldCheck, ShoppingBag, Truck } from "lucide-react";

export default function AuthBanner() {
  return (
    <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-blue-700 via-blue-900 to-black p-10 rounded-3xl relative overflow-hidden">
      <div>
        <h1 className="text-5xl font-black tracking-tight">
          TechStore
        </h1>

        <p className="mt-5 text-lg text-gray-200 max-w-md leading-8">
          Premium electronics, smart gadgets, gaming accessories,
          laptops, smartphones, and next-generation tech delivered
          with lightning-fast shipping.
        </p>
      </div>

      <div className="space-y-5">
        <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/10">
          <ShieldCheck className="w-7 h-7 text-cyan-300" />

          <div>
            <h3 className="font-semibold">Secure Payments</h3>
            <p className="text-sm text-gray-300">
              Stripe & Razorpay protected checkout.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/10">
          <Truck className="w-7 h-7 text-cyan-300" />

          <div>
            <h3 className="font-semibold">Fast Delivery</h3>
            <p className="text-sm text-gray-300">
              Express shipping across India.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/10">
          <ShoppingBag className="w-7 h-7 text-cyan-300" />

          <div>
            <h3 className="font-semibold">Premium Products</h3>
            <p className="text-sm text-gray-300">
              Curated gadgets from top brands.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}