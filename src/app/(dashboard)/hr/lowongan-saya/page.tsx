"use client";

import { useEffect, useState } from "react";
import LowonganSayaTable from "@/components/hr/lowongan-saya/LowonganSayaTable";
import type { Job } from "@/components/hr/lowongan-saya/LowonganSayaTable";

interface JobApiResponseItem {
  hr_id: string;
  job_title: string;
  created_at: string;
  verification_status: string;
}

export default function LowonganSayaPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      const token = localStorage.getItem("token");
      const hrId = localStorage.getItem("hrId");

      if (!token || !hrId) return;

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/jobs?hrId=${hrId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();

        if (data?.data && Array.isArray(data.data)) {
          const mappedJobs: Job[] = data.data.map((item: JobApiResponseItem) => ({
            hr_id: item.hr_id,
            posisi: item.job_title,
            tanggal: new Date(item.created_at).toLocaleDateString("id-ID"),
            status: convertStatus(item.verification_status),
          }));
          setJobs(mappedJobs);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {loading ? (
        <p>Memuat data lowongan...</p>
      ) : (
        <LowonganSayaTable jobs={jobs} />
      )}
    </div>
  );
}

function convertStatus(status: string): Job["status"] {
  switch (status.toLowerCase()) {
    case "verified":
      return "AKTIF";
    case "rejected":
      return "DITUTUP";
    case "pending":
      return "MENUNGGU";
    default:
      return "MENUNGGU";
  }
}
