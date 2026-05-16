import type { Metadata } from "next";

import "./globals.css";

import { Toaster } from "sonner";

import NavBar from "@/components/shared/navbar/NavBar";
import Footer from "@/components/shared/footer/Footer";

export const metadata: Metadata = {
  title: "TechStore",
  description:
    "Premium Ecommerce Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#0B1120] text-white min-h-screen flex flex-col">
        
        {/* Navbar */}
        <NavBar />

        {/* Main Content */}
        <main className="flex-1">
          {children}
        </main>

        {/* Footer */}
        <Footer />

        {/* Toast */}
        <Toaster
          richColors
          position="top-right"
        />
      </body>
    </html>
  );
}