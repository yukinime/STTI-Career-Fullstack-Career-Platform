//src/app/(dashboard)/hr/HRLayoutClient.tsx
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SidebarHR from "@/components/hr/SidebarHR";

export default function HRLayoutClient({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState<null | boolean>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;
    const role = user?.role;

    if (!token || role !== "hr") {
      router.replace("/login");
    } else {
      if (user?.id) {
        localStorage.setItem("hrId", user.id);
      }
      setAuthorized(true);
    }
  }, [router]);

  if (authorized === null) {
    return (
      <div className="flex h-screen items-center justify-center">
        Checking access...
      </div>
    );
  }

  if (!authorized) return null;

return (
  <div className="h-screen flex bg-gray-50">
    {/* Sidebar kiri */}
    <aside className="h-screen w-64 bg-white border-r">
      <SidebarHR />
    </aside>

    {/* Kanan: header + konten */}
    <div className="flex-1 flex flex-col">
      {/* Header sticky */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-10">
        {/* Bisa juga passing Header langsung di sini, 
            atau biarkan child page yang render Header */}
      </header>

      {/* Konten scrollable */}
      <main className="flex-1 overflow-y-auto bg-gray-50">
        {children}
      </main>
    </div>
  </div>
);

}
