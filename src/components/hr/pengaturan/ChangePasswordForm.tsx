"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export default function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token") || "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Semua kolom wajib diisi!");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Kata sandi baru dan konfirmasi tidak sama!");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/change-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        }
      );

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Gagal mengubah kata sandi");
      }

      toast.success("Kata sandi berhasil diubah!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
  console.error("Gagal ubah password:", err);

  if (err instanceof Error) {
    toast.error(err.message);
  } else {
    toast.error("Terjadi kesalahan saat mengubah kata sandi");
  }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border rounded-lg shadow-sm p-3 text-sm"
    >
      <h2 className="text-sm font-semibold mb-3">Ubah Kata Sandi</h2>

      <div className="grid grid-cols-2 gap-3 items-end">
        <div>
          <label className="block text-xs font-medium mb-1">
            Kata Sandi Saat Ini
          </label>
          <input
            type="password"
            className="border rounded px-2 py-1.5 w-full text-xs"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">
            Konfirmasi Kata Sandi Baru
          </label>
          <input
            type="password"
            className="border rounded px-2 py-1.5 w-full text-xs"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">
            Kata Sandi Baru
          </label>
          <input
            type="password"
            className="border rounded px-2 py-1.5 w-full text-xs"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div className="flex justify-end items-end">
          <button
            type="submit"
            disabled={loading}
            className="px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700 text-xs w-32 disabled:opacity-50"
          >
            {loading ? "Menyimpan..." : "Ubah Kata Sandi"}
          </button>
        </div>
      </div>
    </form>
  );
}
