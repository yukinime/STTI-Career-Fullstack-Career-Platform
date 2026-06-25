import type { NextConfig } from "next";

// 🧩 Daftar awal remotePatterns (whitelist image source)
const remotePatterns: NonNullable<NextConfig["images"]>["remotePatterns"] = [
  // ✅ Sumber gambar umum (dummy/avatar)
  {
    protocol: "https",
    hostname: "i.pravatar.cc",
  },
  {
    protocol: "https",
    hostname: "images.unsplash.com",
  },
  {
    protocol: "https",
    hostname: "dummyimage.com",
  },

  // ✅ Lokasi backend lokal (development)
  {
    protocol: "http",
    hostname: "localhost",
    port: "5000",
    pathname: "/uploads/**",
  },
  {
    protocol: "http",
    hostname: "127.0.0.1",
    port: "5000",
    pathname: "/uploads/**",
  },
];

// 🌐 Tambahkan domain backend dari environment (.env)
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

if (apiUrl) {
  try {
    const parsed = new URL(apiUrl);
    const protocol = parsed.protocol === "https:" ? "https" : "http";

    remotePatterns.push({
      protocol,
      hostname: parsed.hostname,
      port: parsed.port || undefined,
      pathname: "/uploads/**",
    });
  } catch {
    console.warn("⚠️ NEXT_PUBLIC_API_URL tidak valid:", apiUrl);
  }
}

// ⚙️ Konfigurasi utama Next.js
const nextConfig: NextConfig = {
  images: {
    remotePatterns,
  },
  eslint: {
    // opsional: biar gak blok build saat lint error
    ignoreDuringBuilds: true,
  },
  typescript: {
    // opsional: biar gak blok build saat error TS
    ignoreBuildErrors: true,
  },
  reactStrictMode: true,
  swcMinify: true,
};

export default nextConfig;
