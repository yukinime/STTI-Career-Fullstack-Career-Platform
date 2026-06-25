// src/app/(auth)/login/layout.tsx *Pengaturan Layout dirubah ke mode html sesuai standar next js BY JERRY
import "@/app/globals.css";

export const metadata = {
  title: "Register - Company",
  description: "Website resmi STTI CAREERS",
  icons: {
    icon: "/logo-stti.png",
  },
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body>
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}