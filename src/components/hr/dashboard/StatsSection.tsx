"use client";

import { useEffect, useState } from "react";
import { Users, Hourglass, CheckCircle2 } from "lucide-react";
import StatsCard from "./StatsCard";

type Applicant = {
  id: number;
  job_id: number;
  pelamar_id: number;
  status: "pending" | "accepted" | "rejected";
  cover_letter: string | null;
  applied_at: string;
  resume_file: string | null;
  notes: string | null;
  reviewed_at: string | null;
  reviewed_by: number | null;
  updated_at: string;
};

export default function StatsSection() {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    accepted: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const hrId = localStorage.getItem("hrId");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/applicant?hrId=${hrId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
            },
          }
        );

        if (!res.ok) {
          console.error("Failed to fetch stats:", res.statusText);
          return;
        }

        const result = await res.json();
        const data: Applicant[] = Array.isArray(result)
          ? result
          : result.data || [];

        setStats({
          total: data.length,
          pending: data.filter((d) => d.status === "pending").length,
          accepted: data.filter((d) => d.status === "accepted").length,
        });
      } catch (error) {
        console.error("Error fetching applicant stats:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-1">
      <StatsCard
        icon={Users}
        title="Total Pelamar"
        value={stats.total}
        iconBg="bg-blue-100"
        iconColor="text-blue-600"
      />
      <StatsCard
        icon={Hourglass}
        title="Tahapan Seleksi"
        value={stats.pending}
        iconBg="bg-yellow-100"
        iconColor="text-yellow-500"
      />
      <StatsCard
        icon={CheckCircle2}
        title="Tahapan Lolos"
        value={stats.accepted}
        iconBg="bg-green-100"
        iconColor="text-green-600"
      />
    </div>
  );
}
