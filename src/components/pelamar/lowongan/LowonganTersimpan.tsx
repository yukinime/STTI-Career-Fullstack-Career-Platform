"use client";

import { useEffect, useState } from "react";
import CardLowongan from "./CardLowongan";

interface HRInfo {
  name: string;
  company_name: string;
  company_logo_url: string | null;
}

interface JobPost {
  id: number;
  title: string;
  description: string;
  requirements: string | null;
  salary_range: string;
  location: string;
  is_active: number;
  created_at: string;
  updated_at: string;
  hr_info: HRInfo;
}

interface Bookmark {
  bookmark_id: number;
  user_id: number;
  job_id: number;
  bookmarked_at: string;
  job_post: JobPost;
}

interface BookmarkResponse {
  success: boolean;
  message: string;
  data: {
    bookmarks: Bookmark[];
  };
}

type BookmarkJob = {
  id: number; // <-- Tambahkan untuk simpan bookmark_id
  judul: string;
  perusahaan: string;
  lokasi: string;
  kategori: string;
  warnaKategori?: string;
  userId: number;
  logoUrl?: string;
  gaji: string;
};

export default function LowonganTersimpan() {
  const [dataLowongan, setDataLowongan] = useState<BookmarkJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Token tidak ditemukan, silakan login dulu.");
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/bookmarks`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Fetch gagal:", errorText);
          throw new Error("Gagal fetch data");
        }

        const result: BookmarkResponse = await response.json();
        console.log("Response API:", result);

        const bookmarks = result?.data?.bookmarks || [];

        if (bookmarks.length > 0) {
          const currentUserId = bookmarks[0].user_id;

          const filteredBookmarks = bookmarks.filter(
            (item) => item.user_id === currentUserId
          );

          const mappedData: BookmarkJob[] = filteredBookmarks.map((item) => ({
            id: item.bookmark_id, // 🟢 simpan ID bookmark
            judul: item.job_post.title,
            perusahaan: item.job_post.hr_info?.company_name || "Unknown",
            lokasi: item.job_post.location,
            kategori: "IT",
            warnaKategori: "bg-green-500",
            userId: item.user_id,
            logoUrl: item.job_post.hr_info?.company_logo_url ?? undefined,
            gaji: item.job_post.salary_range,
          }));

          setDataLowongan(mappedData);
        } else {
          console.log("Tidak ada bookmark ditemukan");
        }
      } catch (error) {
        console.error("Error fetching bookmarks:", error);
        setError(error instanceof Error ? error.message : "Terjadi kesalahan");
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, []);

  // 🧹 Fungsi hapus bookmark dari list state
  const handleRemoveBookmark = (id: number) => {
    setDataLowongan((prev) => prev.filter((item) => item.id !== id));
  };

  if (loading) {
    return <p className="text-gray-500">Loading data...</p>;
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  return (
    <div className="bg-gray-50 p-4 rounded-xl max-h-[calc(100vh-110px)] overflow-y-auto">
      {dataLowongan.length > 0 ? (
        dataLowongan.map((job) => (
          <CardLowongan
            key={job.id}
            id={job.id} // 🟢 kirim ID bookmark ke CardLowongan
            judul={job.judul}
            perusahaan={job.perusahaan}
            lokasi={job.lokasi}
            kategori={job.kategori}
            warnaKategori={job.warnaKategori}
            logoUrl={job.logoUrl}
            gaji={job.gaji}
            onRemove={handleRemoveBookmark} // 🟢 fungsi hapus di FE
          />
        ))
      ) : (
        <p className="text-gray-500">Belum ada lowongan tersimpan.</p>
      )}
    </div>
  );
}
