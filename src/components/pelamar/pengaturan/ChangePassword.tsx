"use client";

import { useState } from "react";

export default function ChangePassword({ token }: { token: string }) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("❌ Password baru dan konfirmasi tidak sama!");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: oldPassword,
          newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal mengubah password");

      setMessage("✅ Password berhasil diubah");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error(err);
      setMessage("❌ Gagal mengubah password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow">
      <h1 className="text-xl font-bold text-gray-800 mb-6">Ubah Password</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Input password lama */}
        <input
          type="password"
          placeholder="Password Lama"
          className="w-full border rounded px-3 py-2"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          required
        />
        {/* Password baru */}
        <input
          type="password"
          placeholder="Password Baru"
          className="w-full border rounded px-3 py-2"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        {/* Konfirmasi */}
        <input
          type="password"
          placeholder="Konfirmasi Password Baru"
          className="w-full border rounded px-3 py-2"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        {/* Feedback */}
        {message && (
          <p className={`text-sm text-center ${message.includes("✅") ? "text-green-600" : "text-red-500"}`}>
            {message}
          </p>
        )}
        {/* Tombol */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:bg-gray-400"
        >
          {loading ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </form>
    </div>
  );
}
