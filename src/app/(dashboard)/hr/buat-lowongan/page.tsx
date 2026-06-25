// src/app/(dashboard)/hr/buat-lowongan/page.tsx
"use client";

import dynamic from "next/dynamic";

// Dynamic import supaya hook client-side aman (SSR dimatikan)
const BuatLowonganContent = dynamic(
  () => import("./BuatLowonganContent"),
  { ssr: false }
);

export default function BuatLowonganPage() {
  return <BuatLowonganContent />;
}
