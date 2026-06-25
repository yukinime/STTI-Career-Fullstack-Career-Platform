"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import LowonganTersimpan from "@/components/pelamar/lowongan/LowonganTersimpan";

type User = {
  id: number;
  full_name: string;
  email: string;
  role: string;
  profile_photo_url?: string | null;
  created_at: string;
};

type ApiProfileResponse = {
  success: boolean;
  message: string;
  data: {
    id: number;
    user_id: number;
    full_name: string;
    email: string;
    profile_photo_url: string | null;
    created_at: string;
    user_created_at: string;
  };
};

export default function HalamanLowonganTersimpan() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/profile`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

      const data: ApiProfileResponse = await response.json();
      if (data.success && data.data) {
        const userData: User = {
          id: data.data.id,
          full_name: data.data.full_name,
          email: data.data.email,
          role: "Pelamar",
          profile_photo_url: data.data.profile_photo_url,
          created_at: data.data.user_created_at,
        };
        setUser(userData);
      }
    } catch (error) {
      console.error("Gagal mengambil data profil:", error);
      const cached = localStorage.getItem("user");
      if (cached) setUser(JSON.parse(cached));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        Memuat data profil...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Gagal memuat data profil.
      </div>
    );
  }

  // ✅ Samakan path gambar seperti halaman profil (fix garis merah)
  const photoUrl = user.profile_photo_url
    ? user.profile_photo_url.startsWith("http")
      ? user.profile_photo_url
      : `${process.env.NEXT_PUBLIC_API_URL}${user.profile_photo_url}`
    : null;

  const initial = user.full_name.charAt(0).toUpperCase();

  return (
    <div className="p-4">
      {/* ✅ Header dinamis tanpa komponen tambahan */}
      <div className="flex justify-between items-center p-4">
        <div>
          <h1 className="text-xl font-semibold">Lowongan Tersimpan</h1>
        </div>

        <div className="flex items-center gap-3">
          {photoUrl ? (
            <div className="relative w-12 h-12 rounded-full overflow-hidden">
              <Image
                src={photoUrl}
                alt={user.full_name}
                fill
                sizes="48px"
                className="object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  const parentDiv = target.parentElement;
                  if (parentDiv) {
                    parentDiv.innerHTML = `
                      <div class='w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center text-white font-bold'>
                        ${initial}
                      </div>`;
                  }
                }}
              />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center text-white font-bold text-lg">
              {initial}
            </div>
          )}
          <div className="text-left">
            <p className="font-medium">{user.full_name}</p>
            <p className="text-gray-500 text-sm">{user.role}</p>
          </div>
        </div>
      </div>

      {/* ✅ List lowongan tersimpan */}
      <div className="mt-6">
        <LowonganTersimpan />
      </div>
    </div>
  );
}
