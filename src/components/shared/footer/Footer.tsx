import Link from "next/link";

import {
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-[#0B1120]">
      
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-20">
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-14">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-3">
              
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center font-black text-xl">
                T
              </div>

              <h2 className="text-3xl font-black">
                TechStore
              </h2>
            </div>

            <p className="text-gray-400 mt-6 leading-8">
              Premium gadgets, gaming accessories,
              smartphones, laptops and next-generation
              electronics for modern creators.
            </p>

            <div className="flex items-center gap-4 mt-8">
              
              <button className="w-11 h-11 rounded-2xl border border-gray-800 bg-[#111827] flex items-center justify-center hover:border-cyan-500 transition">
               
              </button>

              <button className="w-11 h-11 rounded-2xl border border-gray-800 bg-[#111827] flex items-center justify-center hover:border-cyan-500 transition">
               
              </button>

              <button className="w-11 h-11 rounded-2xl border border-gray-800 bg-[#111827] flex items-center justify-center hover:border-cyan-500 transition">
               
              </button>

              <button className="w-11 h-11 rounded-2xl border border-gray-800 bg-[#111827] flex items-center justify-center hover:border-cyan-500 transition">
                
              </button>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-xl font-bold mb-6">
              Shop
            </h3>

            <div className="space-y-4 text-gray-400">
              
              <Link
                href="/"
                className="block hover:text-cyan-400 transition"
              >
                Laptops
              </Link>

              <Link
                href="/"
                className="block hover:text-cyan-400 transition"
              >
                Gaming
              </Link>

              <Link
                href="/"
                className="block hover:text-cyan-400 transition"
              >
                Smartphones
              </Link>

              <Link
                href="/"
                className="block hover:text-cyan-400 transition"
              >
                Accessories
              </Link>

              <Link
                href="/"
                className="block hover:text-cyan-400 transition"
              >
                Smart Watches
              </Link>
            </div>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-xl font-bold mb-6">
              Support
            </h3>

            <div className="space-y-4 text-gray-400">
              
              <Link
                href="/"
                className="block hover:text-cyan-400 transition"
              >
                Contact Us
              </Link>

              <Link
                href="/"
                className="block hover:text-cyan-400 transition"
              >
                Order Tracking
              </Link>

              <Link
                href="/"
                className="block hover:text-cyan-400 transition"
              >
                Returns & Refunds
              </Link>

              <Link
                href="/"
                className="block hover:text-cyan-400 transition"
              >
                Privacy Policy
              </Link>

              <Link
                href="/"
                className="block hover:text-cyan-400 transition"
              >
                Terms & Conditions
              </Link>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-xl font-bold mb-6">
              Stay Updated
            </h3>

            <p className="text-gray-400 leading-7">
              Subscribe to get exclusive offers,
              flash sales and latest product launches.
            </p>

            <div className="mt-6 flex gap-3">
              
              <input
                placeholder="Email address"
                className="flex-1 h-12 rounded-2xl bg-[#111827] border border-gray-800 px-4 outline-none focus:border-cyan-500"
              />

              <button className="px-6 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 font-semibold hover:opacity-90 transition">
                Join
              </button>
            </div>

            <div className="space-y-4 mt-8 text-gray-400">
              
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-cyan-400" />

                <span>
                  support@techstore.com
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-cyan-400" />

                <span>
                  +91 9876543210
                </span>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-cyan-400" />

                <span>
                  Ahmedabad, India
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-16 pt-8 flex flex-col lg:flex-row items-center justify-between gap-5">
          
          <p className="text-gray-500 text-sm">
            © 2026 TechStore. All rights reserved.
          </p>

          <div className="flex items-center gap-6 text-sm text-gray-500">
            
            <span>
              Secure Payments
            </span>

            <span>
              Fast Delivery
            </span>

            <span>
              Premium Support
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}