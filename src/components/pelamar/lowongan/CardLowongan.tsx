"use client";

import Image from "next/image";
import { Bookmark } from "lucide-react";
import toast from "react-hot-toast";

type CardLowonganProps = {
  id: number; // ID bookmark
  judul: string;
  perusahaan: string;
  lokasi: string;
  kategori: string;
  warnaKategori?: string;
  logoUrl?: string;
  gaji?: string;
  onRemove?: (id: number) => void; // callback ke parent
};

export default function CardLowongan({
  id,
  judul,
  perusahaan,
  lokasi,
  kategori,
  warnaKategori = "bg-green-500",
  logoUrl,
  onRemove,
}: CardLowonganProps) {
  const avatarSrc =
    logoUrl ||
    `https://i.pravatar.cc/48?img=${Math.floor(Math.random() * 70) + 1}`;

  const handleRemoveBookmark = async () => {
    if (!id) {
      toast.error("ID bookmark tidak valid");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Kamu harus login untuk menghapus bookmark");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/bookmarks/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        const errText = await res.text();
        console.error("Respon error:", errText);
        throw new Error("Gagal menghapus bookmark");
      }

      toast.success("Bookmark berhasil dihapus!");
      if (onRemove) onRemove(id);
    } catch (err) {
      console.error("Error hapus bookmark:", err);
      toast.error("Terjadi kesalahan saat menghapus bookmark");
    }
  };

  return (
    <div className="flex items-center justify-between py-3 border-b-2 last:border-none">
      <div className="flex items-center gap-3">
        <Image
          src={avatarSrc}
          alt={perusahaan}
          width={48}
          height={48}
          className="w-12 h-12 rounded-md object-cover"
        />

        <div>
          <h3 className="font-semibold">{judul}</h3>
          <p className="text-sm text-gray-600">{perusahaan}</p>
          <div className="flex items-center gap-2 mt-1">
            <span
              className={`text-white text-xs px-2 py-0.5 rounded ${warnaKategori}`}
            >
              {kategori}
            </span>
            <span className="text-sm text-gray-500">{lokasi}</span>
          </div>
        </div>
      </div>

      <button
        onClick={handleRemoveBookmark}
        className="text-gray-600 hover:text-black transition-colors"
      >
        <Bookmark size={28} fill="blue" />
      </button>
    </div>
  );
}
