"use client";

import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Header from "@/components/hr/buat-lowongan/Header";
import JobList from "@/components/hr/buat-lowongan/JobList";
import JobForm from "@/components/hr/buat-lowongan/JobForm";
import type {
  JobApiResponse,
  JobType,
  JobFormValues,
} from "@/components/hr/buat-lowongan/types";
import toast from "react-hot-toast";

function mapJob(job: JobApiResponse): JobType {
  let statusLabel = "";
  let statusColor = "";
  let icon: React.ReactNode = null;

  switch (job.verification_status) {
    case "pending":
      statusLabel = "Tunggu Verifikasi";
      statusColor = "text-blue-600";
      icon = <Clock className="w-5 h-5 text-blue-600" />;
      break;
    case "verified":
      statusLabel = "Terverifikasi";
      statusColor = "text-green-600";
      icon = <CheckCircle2 className="w-5 h-5 text-green-600" />;
      break;
    case "rejected":
      statusLabel = "Ditolak";
      statusColor = "text-red-600";
      icon = <XCircle className="w-5 h-5 text-red-600" />;
      break;
    default:
      statusLabel = "Tunggu Verifikasi";
      statusColor = "text-blue-600";
      icon = <Clock className="w-5 h-5 text-blue-600" />;
  }

  return {
    ...job,
    title: job.job_title?.trim() || "Untitled Position",
    description: job.job_description?.trim() || "No description available",
    requirements: job.qualifications || "-",
    salary_range: `Rp ${job.salary_min.toLocaleString()} - Rp ${job.salary_max.toLocaleString()}`,
    type:
      job.work_type === "remote"
        ? "Remote"
        : job.work_type === "on_site"
        ? "On-site"
        : "Hybrid",
    logo: job.logo || "/logo-stti.png",
    statusLabel,
    statusColor,
    icon,
  };
}

export default function BuatLowonganContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [showForm, setShowForm] = useState(false);
  const [jobs, setJobs] = useState<JobType[]>([]);
  const [editJob, setEditJob] = useState<JobType | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch jobs from API
  useEffect(() => {
    const fetchJobs = async () => {
      const token = localStorage.getItem("token");
      const hrId = localStorage.getItem("hrId");

      if (!token) {
        router.push("/login");
        return;
      }

      if (!hrId) {
        console.error("HR ID not found in localStorage.");
        return;
      }

      try {
        setLoading(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/jobs?hrId=${hrId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Gagal mengambil data lowongan");

        const data = await res.json();

        const mappedJobs: JobType[] = (
          Array.isArray(data.data) ? data.data : [data.data]
        ).map(mapJob);

        setJobs(mappedJobs);
      } catch (err) {
        console.error("Error fetching jobs:", err);
        toast.error("Gagal memuat data lowongan");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [router]);

  // Check URL params for form mode
  useEffect(() => {
    if (searchParams.get("mode") === "form") {
      setShowForm(true);
    }
  }, [searchParams]);

  // Add job via API
  const handleAddJob = async (job: JobFormValues) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(job),
      });

      const data = await res.json();

      if (res.ok) {
        const newJob = mapJob(data.data); // ✅ konsisten format
        setJobs((prev) => [...prev, newJob]);
        setShowForm(false);
        setEditJob(null);
        toast.success("Lowongan berhasil ditambahkan ✅");
      } else {
        toast.error(`Gagal tambah job: ${data.message || "Unknown error"}`);
      }
    } catch (err) {
      console.error("Error adding job:", err);
      toast.error("Terjadi kesalahan server ❌");
    }
  };

  // Edit job via API
  const handleEditJob = async (job: JobFormValues, id: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/jobs/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(job),
        }
      );

      const data = await res.json();

      if (res.ok) {
        // Update local state
        setJobs((prev) =>
          prev.map((j) =>
            j.id === id
              ? {
                  ...j,
                  ...job,
                  title: job.job_title,
                  description: job.job_description,
                  requirements: job.qualifications,
                  salary_range: `Rp ${Number(
                    job.salary_min
                  ).toLocaleString()} - Rp ${Number(
                    job.salary_max
                  ).toLocaleString()}`,
                }
              : j
          )
        );
        setShowForm(false);
        setEditJob(null);
        toast.success("Lowongan berhasil diperbarui ✏️");
      } else {
        toast.error(`Gagal update job: ${data.message || "Unknown error"}`);
      }
    } catch (err) {
      console.error("Error updating job:", err);
      toast.error("Terjadi kesalahan server ❌");
    }
  };

  // Delete job via API
  const handleDeleteJob = async (id: number) => {
    try {
      if (!confirm("Apakah Anda yakin ingin menghapus lowongan ini?")) {
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/jobs/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        setJobs((prev) => prev.filter((job) => job.id !== id));
        toast.success("Lowongan berhasil dihapus 🗑️");
      } else {
        const data = await res.json();
        toast.error(`Gagal hapus job: ${data.message || "Unknown error"}`);
      }
    } catch (err) {
      console.error("Error deleting job:", err);
      toast.error("Terjadi kesalahan server ❌");
    }
  };

  return (
    <div className="flex flex-col bg-gray-50 h-full">
      {/* Header sticky */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-10">
        <Header onAddClick={() => setShowForm(true)} />
      </div>

      {/* Konten ikut scroll parent */}
      <div className="p-6">
        {showForm ? (
          <JobForm
            initialValues={editJob || undefined}
            onCancel={() => {
              setShowForm(false);
              setEditJob(null);
              router.push("/hr/buat-lowongan");
            }}
            onSubmit={(values) =>
              editJob ? handleEditJob(values, editJob.id) : handleAddJob(values)
            }
          />
        ) : loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-4">Memuat data lowongan...</p>
          </div>
        ) : (
          <JobList
            jobs={jobs}
            onEdit={(job) => {
              setEditJob(job);
              setShowForm(true);
            }}
            onDelete={handleDeleteJob}
          />
        )}
      </div>
    </div>
  );
}
