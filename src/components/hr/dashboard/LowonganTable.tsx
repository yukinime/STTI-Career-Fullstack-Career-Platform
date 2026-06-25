"use client";

import { useEffect, useState } from "react";

type Job = {
  id: number;
  job_title: string;
  total_applicants: number;
  is_active: number; // 1 = aktif, 0 = ditutup
  verification_status: "pending" | "verified" | "rejected"; // tambahin field ini
};

export default function LowonganTable() {
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem("token") ?? "";
        const user = JSON.parse(localStorage.getItem("user") ?? "{}");
        let url = `${process.env.NEXT_PUBLIC_API_URL}/api/jobs`;

        if (user.role === "hr") {
          url += `?hrId=${user.id}`;
        }

        const res = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          console.error("Failed to fetch jobs:", res.statusText);
          return;
        }

        const result = await res.json();
        setJobs(result.data || []);
      } catch (err) {
        console.error("Error fetching jobs:", err);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className="max-h-full bg-white shadow rounded-lg flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              <th className="px-6 py-3 w-1/2">Posisi</th>
              <th className="px-6 py-3 text-center w-1/4">Total Pelamar</th>
              <th className="px-6 py-3 text-center w-1/4">Status</th>
            </tr>
          </thead>
          <tbody>
            {jobs
              .filter((job) => job.verification_status === "verified") // hanya ambil yang verified
              .map((job) => (
                <tr key={job.id} className="border-t hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3">{job.job_title}</td>
                  <td className="px-6 py-3 text-center">{job.total_applicants ?? 0}</td>
                  <td className="px-6 py-3 text-center">
                    {job.is_active ? <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm">Aktif</span> : <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm">Ditutup</span>}
                  </td>
                </tr>
              ))}

            {/* kalau setelah filter ternyata kosong */}
            {jobs.filter((job) => job.verification_status === "verified").length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-2 text-center text-gray-500 italic">
                  Belum ada lowongan terverifikasi 
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
