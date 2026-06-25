"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface HrUser {
  id: number;
  full_name: string;
  email: string;
  role: string;
  company_name?: string | null;
  company_address?: string | null;
  position?: string | null;
  phone?: string | null;
  is_active: number;
  created_at: string;
  updated_at: string;
}

const HrTable: React.FC = () => {
  const [search, setSearch] = useState("");
  const [hrs, setHrs] = useState<HrUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<HrUser | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL + "/api";
  const TOKEN = localStorage.getItem("token");

  // ✅ Fetch semua HR dari semua halaman
  const fetchHrUsers = async () => {
    try {
      setLoading(true);
      let allUsers: HrUser[] = [];
      let currentPage = 1;
      let totalPages = 1;

      do {
        const res = await fetch(`${API_URL}/admin/users?page=${currentPage}`, {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) throw new Error("Gagal mengambil data HR");

        const json = await res.json();
        const users: HrUser[] = json?.data?.users || [];
        totalPages = json?.data?.pagination?.total_pages || 1;

        allUsers = [...allUsers, ...users];
        currentPage++;
      } while (currentPage <= totalPages);

      const filtered = allUsers.filter(
        (u) => u.role?.toLowerCase() === "hr"
      );
      setHrs(filtered);
    } catch (err) {
      console.error("❌ Error fetching HR users:", err);
      toast.error("Gagal memuat data HR");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHrUsers();
  }, []);

  // ✅ Buka modal edit
  const openEditModal = (user: HrUser) => {
    setSelectedUser(user);
    setEmail(user.email);
    setPassword("");
    setShowEditModal(true);
  };

  // ✅ Update password HR
  const handleUpdate = async () => {
    if (!selectedUser) return;
    if (!email.trim()) {
      toast.error("Email tidak boleh kosong");
      return;
    }

    try {
      const payload: Record<string, string> = {};

      if (password.trim()) {
        if (password.length < 6) {
          toast.error("Password minimal 6 karakter");
          return;
        }
        payload["new_password"] = password;
      }

      const response = await fetch(
        `${API_URL}/users/${selectedUser.id}/reset-password`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const result: { success: boolean; message: string } = await response.json();

      if (!response.ok)
        throw new Error(result?.message || "Gagal memperbarui data HR");

      toast.success(result.message || "Password HR berhasil diperbarui!");
      setShowEditModal(false);
      await fetchHrUsers();
    } catch (err) {
      console.error("❌ Error updating HR:", err);
      toast.error("Gagal memperbarui HR");
    }
  };

  // ✅ Konfirmasi hapus
  const confirmDelete = (id: number) => {
    setSelectedId(id);
    setShowConfirm(true);
  };

  // ✅ Hapus HR
  const handleDelete = async () => {
    if (!selectedId) return;

    try {
      const res = await fetch(`${API_URL}/admin/users/${selectedId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Gagal menghapus HR");

      toast.success("HR berhasil dihapus");
      setShowConfirm(false);
      await fetchHrUsers();
    } catch (err) {
      console.error("❌ Error deleting HR:", err);
      toast.error("Gagal menghapus HR");
    } finally {
      setSelectedId(null);
    }
  };

  const filtered = hrs.filter((h) =>
    h.full_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative bg-[#1E2235] rounded-xl p-6">
      {/* Search */}
      <div className="flex items-center mb-6">
        <input
          type="text"
          placeholder="Cari HR..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-1/3 px-6 py-3 rounded-md bg-[#2A2E42] text-gray-200 placeholder-gray-400 focus:outline-none"
        />
        <button
          onClick={fetchHrUsers}
          className="ml-auto px-6 py-3 rounded-md bg-[#3A3E55] text-gray-200 hover:bg-[#4A4E66]"
        >
          Refresh
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg">
        {loading ? (
          <div className="text-center py-6 text-gray-400">Loading...</div>
        ) : (
          <table className="w-full">
            <thead className="bg-[#2A2E42]">
              <tr>
                <th className="text-left py-4 px-6 text-gray-300 font-medium">
                  NAME
                </th>
                <th className="text-left py-4 px-6 text-gray-300 font-medium">
                  EMAIL
                </th>
                <th className="text-left py-4 px-6 text-gray-300 font-medium">
                  COMPANY
                </th>
                <th className="text-left py-4 px-6 text-gray-300 font-medium">
                  POSITION
                </th>
                <th className="text-left py-4 px-6 text-gray-300 font-medium">
                  STATUS
                </th>
                <th className="text-left py-4 px-6 text-gray-300 font-medium">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <tr
                  key={user.id}
                  className="border-t border-gray-700 hover:bg-[#2A2E42]"
                >
                  <td className="py-4 px-6 text-white">{user.full_name}</td>
                  <td className="py-4 px-6 text-gray-300">{user.email}</td>
                  <td className="py-4 px-6 text-gray-300">
                    {user.company_name || "-"}
                  </td>
                  <td className="py-4 px-6 text-gray-300">
                    {user.position || "-"}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-4 py-1 rounded-full text-xs font-medium ${
                        user.is_active
                          ? "bg-green-500 text-black"
                          : "bg-gray-400 text-black"
                      }`}
                    >
                      {user.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex space-x-2 text-sm">
                      <button
                        onClick={() => openEditModal(user)}
                        className="text-yellow-400 hover:text-yellow-300 font-medium"
                      >
                        Edit
                      </button>
                      <span className="text-gray-500">|</span>
                      <button
                        onClick={() => confirmDelete(user.id)}
                        className="text-red-400 hover:text-red-300 font-medium"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-gray-400">
                    Tidak ada HR ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal Konfirmasi Delete */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-[#1E2235] rounded-md w-[550px] shadow-lg border border-[#2A2E42] p-5">
            <div className="flex items-center justify-between">
              <p className="text-gray-200 text-sm font-medium whitespace-nowrap">
                Apakah anda yakin ingin menghapus akun ini ?
              </p>
              <div className="flex gap-2 ml-4">
                <button
                  onClick={handleDelete}
                  className="px-4 py-1.5 text-sm font-semibold text-white bg-[#2A2E42] rounded-md hover:bg-[#343850] transition-colors"
                >
                  Iya
                </button>
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-4 py-1.5 text-sm font-semibold text-white bg-[#2A2E42] rounded-md hover:bg-[#343850] transition-colors"
                >
                  Tidak
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Edit HR */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-[#1E2235] rounded-md w-[500px] shadow-lg border border-[#2A2E42] p-8">
            <h2 className="text-lg text-gray-200 font-semibold mb-6">
              Edit Data HR
            </h2>

            {/* Email (readonly) */}
            <div className="mb-4">
              <label className="block text-sm text-gray-300 mb-1">Email</label>
              <input
                type="email"
                value={email}
                readOnly
                className="w-full px-4 py-2 rounded-md bg-[#2A2E42] text-gray-400 border border-gray-600 cursor-not-allowed"
              />
            </div>

            {/* Password Baru */}
            <div className="mb-4">
              <label className="block text-sm text-gray-300 mb-1">Password Baru</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                className={`w-full px-4 py-2 rounded-md bg-[#2A2E42] text-gray-200 border ${
                  password && password.length < 6
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-600 focus:border-blue-500"
                } focus:outline-none`}
              />
              {password && password.length < 6 && (
                <p className="text-red-500 text-xs mt-1">
                  Password harus minimal 6 karakter
                </p>
              )}
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-6 py-2 text-sm font-semibold text-white bg-gray-500 rounded-md hover:bg-gray-600"
              >
                Batal
              </button>
              <button
                onClick={handleUpdate}
                className="px-6 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HrTable;
