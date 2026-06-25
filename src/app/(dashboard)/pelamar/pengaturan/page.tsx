"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/pelamar/Header";
import ChangePassword from "@/components/pelamar/pengaturan/ChangePassword";

type User = {
  full_name: string;
  role: string;
  profile_photo_url?: string | null;
};

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      router.push("/login");
      return;
    }
    setToken(storedToken);
    fetchProfile(storedToken);
  }, []);

  const fetchProfile = async (storedToken: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/profile`, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });

      if (!res.ok) {
        throw new Error("Token invalid");
      }

      const data = await res.json();
      setUser({
        full_name: data.data.full_name,
        role: "Pelamar",
        profile_photo_url: data.data.profile_photo_url,
      });
    } catch (err) {
      console.error(err);
      localStorage.removeItem("token");
      router.push("/login");
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Memuat data...</p>
      </div>
    );
  }

  return (
    <>
      <Header
        title="Pengaturan"
        name={user.full_name}
        role={user.role}
        avatarUrl={user.profile_photo_url ?? undefined}
      />
      <div className="min-h-[calc(100vh-100px)] rounded-xl bg-gray-50 mt-4">
        <div className="p-8">
          {/* Kirim token ke komponen anak */}
          <ChangePassword token={token!} />
        </div>
      </div>
    </>
  );
}
