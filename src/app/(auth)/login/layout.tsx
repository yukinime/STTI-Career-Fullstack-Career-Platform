// src/app/(auth)/login/layout.tsx *Pengaturan Layout dirubah ke mode html sesuai standar next js BY JERRY
import "@/app/globals.css";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "Login - STTI CAREERS",
  description: "Website resmi STTI CAREERS",
  icons: {
    icon: "/logo-stti.png",
  },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="">
      <head />
      <body>
        <main className="min-h-screen">{children}
          <Toaster />
        </main>
      </body>
    </html>
  );
}