// src/app/(public)/layout.tsx *Pengaturan Layout dirubah ke mode html sesuai standar next js BY JERRY
import "@/app/globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "STTI CAREERS",
  description: "Website resmi STTI CAREERS",
  icons: {
    icon: "/logo-stti.png",
  },
};

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body>
        <Navbar />
        <main className="min-h-screen">{children}
          <Toaster />
        </main>
        <Footer />
      </body>
    </html>
  );
}
