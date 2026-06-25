"use client";

import React, { useState, useEffect } from "react";
import CardLamaran from "./CardLamaran";

type StatusBackend = "pending" | "accepted" | "rejected";
type StatusFrontend = "terkirim" | "dilihat" | "proses" | "diterima" | "gagal";

interface Lamaran {
  id: number;
  job_id: number;
  pelamar_id: number;
  status: StatusBackend;
  cover_letter: string;
  notes: string;
  applied_at: string;
  resume_file: string;
  cover_letter_file: string;
  portfolio_file: string;
  job_title: string;
  location: string;
  salary_range: string;
  company_name: string;
}

interface Profile {
  id: number;
  full_name: string;
  email: string;
  phone: string;
}

// 🧩 Fungsi konversi status dari DB → status tampilan
const mapStatusToFrontend = (status: StatusBackend): StatusFrontend => {
  switch (status) {
    case "pending":
      return "terkirim";
    case "accepted":
      return "diterima";
    case "rejected":
      return "gagal";
    default:
      return "terkirim";
  }
};

export default function LamaranSaya() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [lamaranList, setLamaranList] = useState<Lamaran[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

 const fetchData = async () => {
  try {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token)
      throw new Error("Token tidak ditemukan. Silakan login terlebih dahulu.");

    // 🔹 Ambil profil
    const profileRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const profileData = await profileRes.json();
    if (!profileData.success) throw new Error("Gagal mengambil data profil");
    setProfile(profileData.data);

    // 🔹 Ambil lamaran
    const lamaranRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/applied/my`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const lamaranData = await lamaranRes.json();
    if (!lamaranData.success) throw new Error("Gagal mengambil data lamaran");
    setLamaranList(lamaranData.data);
  } catch (err) {
    if (err instanceof Error) {
      setError(err.message);
    } else {
      setError("Terjadi kesalahan yang tidak diketahui.");
    }
  } finally {
    setLoading(false);
  }
};


  // 🕓 Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-120px)] bg-white border rounded-xl shadow-sm">
        <p className="text-gray-500">Memuat data lamaran...</p>
      </div>
    );
  }

  // ⚠️ Error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-120px)] bg-white border rounded-xl shadow-sm">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  // 🚫 Jika profil tidak ditemukan
  if (!profile) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-120px)] bg-white border rounded-xl shadow-sm">
        <p className="text-gray-500">Data profil tidak ditemukan.</p>
      </div>
    );
  }

  // ✅ Tampilan utama
  return (
    <div className="bg-white rounded-xl shadow-sm border h-[calc(100vh-120px)] overflow-hidden">
      <div className="h-full overflow-y-auto">
        <div className="p-6 space-y-4">
          {lamaranList.length === 0 ? (
            <p className="text-gray-500 text-center">Kamu belum mengirimkan lamaran pekerjaan.</p>
          ) : (
            lamaranList.map((lamaran) => (
              <CardLamaran
                key={lamaran.id}
                posisi={lamaran.job_title}
                perusahaan={lamaran.company_name}
                nama={profile.full_name}
                telepon={profile.phone}
                email={profile.email}
                status={mapStatusToFrontend(lamaran.status)} // 🔁 konversi agar cocok dengan progress bar
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
