"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menu = [
  { name: "Dashboard", href: "/hr/dashboard" },
  { name: "Buat Lowongan", href: "/hr/buat-lowongan" },
  { name: "Lowongan Saya", href: "/hr/lowongan-saya" },
  { name: "Pelamar", href: "/hr/pelamar" },
  { name: "Pengaturan", href: "/hr/pengaturan" },
];

export default function SidebarHR() {
  const pathname = usePathname();

  return (
    <div className="w-64 h-screen bg-[#0B1B54] text-white flex flex-col">
      {/* Logo/Header */}
      <div className="flex items-center justify-center h-20 border-b border-gray-700 gap-2">
        <Image
          src="/logo-stti.png"
          alt="Logo"
          width={60}
          height={60}
          className="object-contain"
        />
        <h1 className="text-lg font-bold">STTICAREER</h1>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menu.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`block px-4 py-2 rounded-lg transition ${
                    isActive
                      ? "bg-stone-200/50 font-semibold text-[#0B1B54] hover:text-[#0B1B54]"
                      : "text-white"
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Tombol bawah */}
      <div className="p-4">
        <Link href="/hr/buat-lowongan?mode=form">
          <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
            Buat Lowongan
          </button>
        </Link>
      </div>
    </div>
  );
}
