// src/app/(dashboard)/pelamar/profile/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/pelamar/Header";
import ProfileHeader from "@/components/pelamar/profile/ProfileHeader";
import Tabs from "@/components/pelamar/profile/Tabs";
import Biodata from "@/components/pelamar/profile/biodata/Biodata";
import Pendidikan from "@/components/pelamar/profile/pendidikan/Pendidikan";
import PengalamanSection from "@/components/pelamar/profile/pengalaman/PengalamanSection";
import SertifikatSection from "@/components/pelamar/profile/sertifikat/SertifikatSection";
import KeterampilanSection from "@/components/pelamar/profile/keterampilan/KeterampilanSection";

type User = {
  id: number;
  full_name: string;
  email: string;
  role: string;
  profile_photo_url?: string | null;
  created_at: string;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  country?: string | null;
};

type Education = {
  education_level: string;
  institution_name: string;
  major: string;
  gpa: string;
  entry_year: string;
  graduation_year: string;
};

type ApiProfileResponse = {
  success: boolean;
  message: string;
  data: {
    id: number;
    user_id: number;
    full_name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
    profile_photo_url: string;
    education_level: string;
    major: string;
    institution_name: string;
    gpa: string;
    graduation_year: number;
    entry_year: number;
    created_at: string;
    user_created_at: string;
  };
};

export default function ProfilePage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("biodata");
  const [user, setUser] = useState<User | null>(null);
  const [education, setEducation] = useState<Education | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem("token");
      
      if (!token) {
        console.error("Token tidak ditemukan di localStorage");
        router.push("/login");
        return;
      }

      // Validasi token sebelum digunakan
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) {
        console.error("Format token tidak valid");
        localStorage.removeItem("token");
        router.push("/login");
        return;
      }

      console.log("Mengambil data profil...");
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include", // Tambahkan ini untuk mengirim cookies jika diperlukan
      });

      console.log("Response status:", response.status);

      if (response.status === 401) {
        // Token tidak valid atau expired
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("education");
        setError("Sesi telah berakhir. Silakan login kembali.");
        router.push("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiProfileResponse = await response.json();
      console.log("Data diterima:", data);

      if (data.success && data.data) {
        // Transform data dari API ke format User
        const userData: User = {
          id: data.data.id,
          full_name: data.data.full_name,
          email: data.data.email,
          role: "pelamar",
          profile_photo_url: data.data.profile_photo_url,
          created_at: data.data.user_created_at,
          phone: data.data.phone,
          address: data.data.address,
          city: data.data.city,
          country: data.data.country,
        };

        const educationData: Education = {
          education_level: data.data.education_level,
          institution_name: data.data.institution_name,
          major: data.data.major,
          gpa: data.data.gpa,
          entry_year: data.data.entry_year?.toString() || "",
          graduation_year: data.data.graduation_year?.toString() || "",
        };

        setUser(userData);
        setEducation(educationData);
        
        // Simpan ke localStorage untuk cache
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("education", JSON.stringify(educationData));
      } else {
        throw new Error(data.message || "Gagal memuat data profil");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Terjadi kesalahan saat memuat data profil");
      }
      
      // Fallback ke localStorage jika API gagal
      try {
        const storedUser = localStorage.getItem("user");
        const storedEdu = localStorage.getItem("education");
        
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          console.log("Menggunakan data dari localStorage");
        }
        if (storedEdu) setEducation(JSON.parse(storedEdu));
      } catch (localStorageError) {
        console.error("Error reading localStorage:", localStorageError);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    fetchProfileData();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data profil...</p>
        </div>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={handleRetry}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Coba Lagi
          </button>
          <button
            onClick={() => router.push("/login")}
            className="ml-4 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Login Kembali
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <p className="text-red-500 mb-4">User belum login</p>
          <button
            onClick={() => router.push("/login")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  const joinedYear = new Date(user.created_at).toLocaleDateString("id-ID", {
    year: "numeric",
  });

  const handleUpdateUser = (updated: Partial<User>) => {
    const newUser = { ...user, ...updated };
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
    setIsEditing(false);
  };

  const handleUpdateEducation = (updated: Education) => {
    setEducation(updated);
    localStorage.setItem("education", JSON.stringify(updated));
    setIsEditing(false);
  };

  return (
    <>
      <Header
        title="Dashboard Pelamar"
        avatarUrl={user.profile_photo_url ?? undefined}
      />

      <div className="bg-white rounded-xl p-6 mt-4 h-[calc(100vh-110px)] overflow-y-auto">
        <ProfileHeader
          name={user.full_name}
          joined={joinedYear}
          avatarUrl={user.profile_photo_url ?? undefined}
          onEdit={() => setIsEditing(true)}
        />

        <Tabs activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="pb-6">
          {activeTab === "biodata" && (
            <Biodata
              user={user}
              isEditing={isEditing}
              onCancel={() => setIsEditing(false)}
              onSaveSuccess={handleUpdateUser}
            />
          )}
          {activeTab === "pendidikan" && (
            <Pendidikan
              education={education}
              isEditing={isEditing}
              onCancel={() => setIsEditing(false)}
              onSaveSuccess={handleUpdateEducation}
            />
          )}
          {activeTab === "pengalaman" && <PengalamanSection />}
          {activeTab === "sertifikat" && <SertifikatSection />}
          {activeTab === "keterampilan" && <KeterampilanSection />}
        </div>
      </div>
    </>
  );
}