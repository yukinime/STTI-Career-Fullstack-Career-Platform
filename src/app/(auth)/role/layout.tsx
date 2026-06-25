// src/app/(auth)/login/layout.tsx *Pengaturan Layout dirubah ke mode html sesuai standar next js BY JERRY
import "@/app/globals.css";

export const metadata = {
  title: "Rules - STTI CAREERS",
  description: "Website resmi STTI CAREERS",
  icons: {
    icon: "/logo-stti.png",
  },
};

export default function RulesLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body>
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}