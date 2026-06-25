"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { MapPin, Phone } from "lucide-react";

interface Company {
  id: number;
  nama_companies: string;
  email_companies: string | null;
  nomor_telepon: string | null;
  website: string | null;
  alamat: string | null;
  logo: string | null;
}

export default function CompanyPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");
  const [industry, setIndustry] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 6;
  const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // ✅ Ambil semua perusahaan dari backend
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await fetch(`${baseURL}/api/company`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Gagal mengambil data perusahaan");
        const data: Company[] = await res.json();
        setCompanies(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching companies:", err);
        setCompanies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, [baseURL]);

  // 🔍 Filter hasil pencarian
  const filteredCompanies = companies.filter((c) => {
    const matchName = c.nama_companies
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchLocation =
      c.alamat?.toLowerCase().includes(location.toLowerCase()) ?? true;
    const matchIndustry =
      c.website?.toLowerCase().includes(industry.toLowerCase()) ?? true;
    return matchName && matchLocation && matchIndustry;
  });

  // 📑 Pagination logic
  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentCompanies = filteredCompanies.slice(indexOfFirst, indexOfLast);

  const handleSearch = () => setCurrentPage(1);
  const handlePrevPage = () => setCurrentPage((prev) => Math.max(1, prev - 1));
  const handleNextPage = () =>
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));

  // 🧱 Kartu perusahaan
  const CompanyCard = ({ company }: { company: Company }) => {
    const [imgFailed, setImgFailed] = useState(false);

    // 🔧 Normalisasi URL logo agar bisa diakses dari browser / Next
    const normalizeLogoUrl = (raw?: string | null): string | null => {
      if (!raw) return null;
      const trimmed = raw.trim();

      // kalau sudah absolute URL
      if (/^https?:\/\//i.test(trimmed)) {
        try {
          const url = new URL(trimmed);
          const base = new URL(baseURL);

          // ubah localhost/127.0.0.1 ke host backend yang aktif
          if (["localhost", "127.0.0.1"].includes(url.hostname)) {
            url.hostname = base.hostname;
            if (base.port) url.port = base.port;
          }
          return url.toString();
        } catch {
          return null;
        }
      }

      // kalau cuma filename
      return `${baseURL.replace(/\/+$/, "")}/uploads/company_logos/${trimmed}`;
    };

    const logoUrl = normalizeLogoUrl(company.logo);

    // 🔤 Buat inisial perusahaan (misal: PT Pantek Indonesia → PI)
    const getInitials = (name: string): string => {
      const words = name
        .replace(/^PT\s+/i, "")
        .split(" ")
        .filter(Boolean);
      return words
        .slice(0, 2)
        .map((w) => w[0].toUpperCase())
        .join("");
    };

    // 🎨 Warna background acak tapi konsisten
    const getColorFromName = (name: string): string => {
      const colors = [
        "bg-blue-500",
        "bg-green-500",
        "bg-purple-500",
        "bg-pink-500",
        "bg-orange-500",
        "bg-indigo-500",
        "bg-teal-500",
      ];
      let hash = 0;
      for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
      }
      return colors[Math.abs(hash) % colors.length];
    };

    const initials = getInitials(company.nama_companies);
    const bgColor = getColorFromName(company.nama_companies);

    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow flex flex-col h-full min-h-[250px]">
        <div className="flex items-center gap-3 mb-3">
          {/* 🧩 Logo atau fallback huruf */}
          <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 relative">
            {logoUrl && !imgFailed ? (
              <Image
                src={logoUrl}
                alt={company.nama_companies}
                fill
                className="object-cover"
                sizes="48px"
                onError={() => {
                  // kalau gagal load (404, dll) -> tampilkan fallback huruf
                  setImgFailed(true);
                }}
              />
            ) : (
              <div
                className={`flex items-center justify-center w-full h-full text-white font-semibold text-lg ${bgColor}`}
              >
                {initials}
              </div>
            )}
          </div>

          <div>
            <h3 className="font-semibold text-lg text-gray-900">
              {company.nama_companies}
            </h3>
            {company.website ? (
              <a
                href={
                  company.website.startsWith("http")
                    ? company.website
                    : `https://${company.website}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 text-sm truncate hover:underline"
              >
                {company.website.replace(/^https?:\/\//, "")}
              </a>
            ) : (
              <p className="text-gray-400 text-sm">Tidak ada website</p>
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col items-start">
          {/* 📍 Alamat */}
          <div className="flex items-center text-gray-600 text-sm mb-3">
            <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
            <span className="leading-relaxed line-clamp-3">
              {company.alamat || "Alamat tidak tersedia"}
            </span>
          </div>

          {/* ☎️ Nomor telepon */}
          <div className="flex items-center text-gray-500 text-sm mt-auto">
            <Phone className="w-4 h-4 mr-1 flex-shrink-0" />
            <span>{company.nomor_telepon || "Tidak ada kontak"}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 p-4">
      <div className="max-w-6xl mx-auto">
        {/* 🔍 Search Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h1 className="text-xl font-semibold text-gray-900 mb-4">
            Cari Perusahaan Impianmu
          </h1>
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Nama Perusahaan"
              className="flex-1 px-4 py-3 border rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <input
              type="text"
              placeholder="Lokasi"
              className="flex-1 px-4 py-3 border rounded-lg"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <input
              type="text"
              placeholder="Industri"
              className="flex-1 px-4 py-3 border rounded-lg"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
            />
            <button
              onClick={handleSearch}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Cari
            </button>
          </div>
        </div>

        {/* 🏢 Daftar Perusahaan */}
        {loading ? (
          <p className="text-center text-gray-500 py-10">
            Memuat data perusahaan...
          </p>
        ) : filteredCompanies.length === 0 ? (
          <p className="text-center text-gray-500 py-10">
            Tidak ada perusahaan ditemukan.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {currentCompanies.map((company) => (
                <CompanyCard key={company.id} company={company} />
              ))}
            </div>

            {/* 📄 Pagination */}
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-40"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
              >
                ◀
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    className={`w-10 h-10 rounded-lg ${
                      currentPage === page
                        ? "bg-blue-600 text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                )
              )}
              <button
                className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-40"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                ▶
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
