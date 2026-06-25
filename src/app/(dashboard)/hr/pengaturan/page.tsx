// src/app/(dashboard)/hr/pengaturan/page.tsx
"use client";

import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import CompanyProfileForm from "@/components/hr/pengaturan/CompanyProfileForm";
import ChangePasswordForm from "@/components/hr/pengaturan/ChangePasswordForm";

export default function PengaturanPage() {
  const router = useRouter();

  const handleLogout = async () => {
    const confirm = await Swal.fire({
      title: "Yakin ingin logout?",
      text: "Kamu akan keluar dari akun ini.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, logout",
      cancelButtonText: "Batal",
      reverseButtons: true,
      background: "#f9fafb",
      color: "#111827",
    });

    if (confirm.isConfirmed) {
      // Tampilkan animasi loading
      Swal.fire({
        title: "Sedang logout...",
        html: `
        <div class="flex justify-center mt-3">
          <div class="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      `,
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      try {
        const refreshToken = localStorage.getItem("refreshToken");

        // (Opsional) panggil endpoint logout, kalau backend HR mendukung
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        }).catch(() => {});

        // Hapus semua data lokal
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");

        // Tampilkan sukses
        Swal.fire({
          icon: "success",
          title: "Logout Berhasil",
          text: "Kamu telah keluar dari akun HR.",
          showConfirmButton: false,
          timer: 1600,
          background: "#f9fafb",
          color: "#111827",
          didOpen: () => {
            const popup = Swal.getPopup();
            if (popup)
              popup.classList.add("animate__animated", "animate__fadeInDown");
          },
        });

        setTimeout(() => router.replace("/login"), 1600);
      } catch (err) {
        console.error("Gagal logout:", err);
        Swal.fire({
          icon: "error",
          title: "Gagal Logout",
          text: "Terjadi kesalahan. Silakan coba lagi.",
          background: "#fef2f2",
          color: "#7f1d1d",
          confirmButtonColor: "#dc2626",
        });
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b px-6 py-4 flex items-center justify-between flex-shrink-0">
          <h1 className="text-xl font-semibold">Pengaturan</h1>

          {/* Tombol Logout */}
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm font-medium"
          >
            Logout
          </button>
        </div>

        {/* Content Area dengan scroll */}
        <div className="flex-1 overflow-auto p-6">
          <div className="space-y-6 max-w-4xl">
            <CompanyProfileForm />
            <ChangePasswordForm />
          </div>
        </div>
      </div>
    </div>
  );
}
