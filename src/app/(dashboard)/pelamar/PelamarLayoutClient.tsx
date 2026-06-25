//src/app/%28dashboard%29/pelamar/PelamarLayoutClient.tsx
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Sidebar from "@/components/pelamar/Sidebar";

export default function PelamarLayoutClient({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    const role = user ? JSON.parse(user).role : null;

    if (!token || role !== "pelamar") {
      router.replace("/login");
      window.location.reload();
    } else {
      setAuthorized(true);
    }
  }, [router]);

  if (!authorized) return null;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
      {/* Sidebar khusus pelamar */}
      <Sidebar />

      {/* Konten utama */}
      <main className="flex-1 p-6 overflow-y-auto">{children}</main>
    </div>
  );
}
