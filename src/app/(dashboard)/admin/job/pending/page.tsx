"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface ApiJob {
  id: number;
  job_title: string;
  company_name?: string;
  created_at: string;
}

export default function PendingJobsBody() {
  const [jobs, setJobs] = useState<ApiJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<number | null>(null);

  // ✅ Fetch jobs pending
  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/jobs/admin?status=pending`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setJobs(data.data);
      } else {
        toast.error("Gagal memuat data job!");
      }
    } catch (err) {
      console.error("Failed to fetch pending jobs:", err);
      toast.error("Terjadi kesalahan saat memuat data!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // ✅ Handle verify / reject
  const handleUpdateStatus = async (id: number, status: "verified" | "rejected") => {
    const token = localStorage.getItem("token");
    setProcessing(id);

    const actionText = status === "verified" ? "memverifikasi" : "menolak";
    toast.loading(`Sedang ${actionText} job...`, { id: "jobAction" });

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/${id}/verify`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }), // ✅ sesuai backend
      });

      const data = await res.json();
      if (data.success) {
        setJobs((prev) => prev.filter((job) => job.id !== id));
        toast.success(
          status === "verified"
            ? "Job berhasil diverifikasi ✅"
            : "Job berhasil ditolak ❌",
          { id: "jobAction" }
        );
      } else {
        toast.error(data.message || "Gagal memperbarui status!", { id: "jobAction" });
      }
    } catch (err) {
      console.error("Gagal update status:", err);
      toast.error("Terjadi kesalahan server!", { id: "jobAction" });
    } finally {
      setProcessing(null);
    }
  };

  if (loading)
    return <div className="text-center py-6 text-slate-400">Loading...</div>;

  if (jobs.length === 0)
    return (
      <div className="text-center py-6 text-slate-400">
        No pending job posts found.
      </div>
    );

  return (
    <>
      {jobs.map((job) => (
        <div
          key={job.id}
          className="px-6 py-4 grid grid-cols-5 items-center hover:bg-slate-750 transition-colors"
        >
          <div className="text-white text-sm">{job.job_title}</div>
          <div className="text-slate-300 text-sm">{job.company_name || "Unknown"}</div>
          <div className="text-slate-300 text-sm">
            {new Date(job.created_at).toLocaleDateString("id-ID")}
          </div>
          <div>
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-500 text-black">
              Pending
            </span>
          </div>
          <div className="flex gap-2">
            <button
              disabled={processing === job.id}
              onClick={() => handleUpdateStatus(job.id, "verified")}
              className={`px-3 py-1 text-xs rounded font-medium transition ${
                processing === job.id
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
            >
              {processing === job.id ? "Processing..." : "Verify"}
            </button>

            <button
              disabled={processing === job.id}
              onClick={() => handleUpdateStatus(job.id, "rejected")}
              className={`px-3 py-1 text-xs rounded font-medium transition ${
                processing === job.id
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700 text-white"
              }`}
            >
              {processing === job.id ? "Processing..." : "Reject"}
            </button>
          </div>
        </div>
      ))}
    </>
  );
}
