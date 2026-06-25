//src/app/%28dashboard%29/admin/AdminLayoutClient.tsx
"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SidebarAdmin from "@/app/(dashboard)/admin/adminSidebar";
import Header from "@/app/(dashboard)/admin/Profil";

const pageTitles: Record<string, string> = {
  "/admin/dashboard": "Dashboard",
  "/admin/job": "",
  "/admin/users": "",
  "/admin/statistics": "",
  "/admin/notification": "",
};

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [authorized, setAuthorized] = useState<null | boolean>(null);

  const title = pageTitles[pathname] || "";

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    const role = user ? JSON.parse(user).role : null;

    if (!token || role !== "admin") {
      router.replace("/login");
    } else {
      setAuthorized(true);
    }
  }, [router]);

  if (authorized === null) {
    return <div className="flex h-screen items-center justify-center text-white">Checking access...</div>;
  }

  if (!authorized) return null;

  return (
    <div className="h-screen bg-slate-900 text-white flex">
      {/* ✅ Sidebar fixed */}
      <div className="fixed inset-y-0 left-0 w-64">
        <SidebarAdmin />
      </div>

      {/* ✅ Konten utama */}
      <div className="flex-1 flex flex-col ml-64">
        <div className="px-12 pt-6">
          <Header title={title} />
        </div>

        {/* ✅ Scroll hanya di area konten */}
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
