// src/app/(public)/lowongan/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import JobDetail from "@/components/lowongan/JobDetail";

export default function JobDetailPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    const role = userData ? JSON.parse(userData).role : null;

    // Jika tidak ada token atau role bukan pelamar, redirect ke login
    if (!token || role !== "pelamar") {
      router.replace("/login");
    } else {
      setAuthorized(true);
    }
  }, [router]);

  if (!authorized) return null;

  return <JobDetail />;
}
