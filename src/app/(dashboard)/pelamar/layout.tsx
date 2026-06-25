// src/app/(dashboard)/pelamar/layout.tsx
import "@/app/globals.css";
import PelamarLayoutClient from "./PelamarLayoutClient";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "Dashboard Pelamar",
  description: "Portal Karir STTI",
  icons: {
    icon: "/logo-stti.png",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        <PelamarLayoutClient>
          {children}
          <Toaster />
        </PelamarLayoutClient>
      </body>
    </html>
  );
}
