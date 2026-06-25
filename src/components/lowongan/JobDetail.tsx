// src/components/lowongan/JobDetail.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";

// Interface untuk tipe data job detail
interface JobDetail {
  id: number;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  type: string; // work_time
  workType: string; // work_type (remote/hybrid/onsite)
  description: string;
  tags: string[];
  salary: string;
  postedAt: string;
  companyDescription?: string;
  requirements: string[];
  qualifications: string; // qualifications dari API
  responsibilities: string[];
  benefits: string[];
  workingSystem: string[];
  companyCriteria: string[];
  applicants?: number;
  views?: number;
}

// helper untuk format waktu jadi "1 jam yang lalu"
function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diff = (now.getTime() - date.getTime()) / 1000; // selisih detik

  const units: { unit: Intl.RelativeTimeFormatUnit; seconds: number }[] = [
    { unit: "year", seconds: 60 * 60 * 24 * 365 },
    { unit: "month", seconds: 60 * 60 * 24 * 30 },
    { unit: "week", seconds: 60 * 60 * 24 * 7 },
    { unit: "day", seconds: 60 * 60 * 24 },
    { unit: "hour", seconds: 60 * 60 },
    { unit: "minute", seconds: 60 },
    { unit: "second", seconds: 1 },
  ];

  for (const { unit, seconds } of units) {
    const value = Math.floor(diff / seconds);
    if (value >= 1) {
      return new Intl.RelativeTimeFormat("id", { numeric: "auto" }).format(
        -value,
        unit
      );
    }
  }

  return "baru saja";
}

const JobDetail: React.FC = () => {
  const [job, setJob] = useState<JobDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  const router = useRouter();
  const params = useParams<{ id: string }>();
  const jobId = params?.id;

  // Fetch job detail (API)
  const fetchJobDetail = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/jobs/public/${id}`
      );

      if (!res.ok) {
        throw new Error(`Failed to fetch job (status ${res.status})`);
      }

      const json = await res.json();

      if (json.success && json.data) {
        const apiJob = json.data;

        // Format gaji
        let salaryText = "";
        if (apiJob.salary_min && apiJob.salary_max) {
          salaryText = `Rp ${apiJob.salary_min.toLocaleString(
            "id-ID"
          )} - Rp ${apiJob.salary_max.toLocaleString("id-ID")}`;
        } else if (apiJob.salary_min) {
          salaryText = `Rp ${apiJob.salary_min.toLocaleString("id-ID")}`;
        } else if (apiJob.salary_max) {
          salaryText = `Rp ${apiJob.salary_max.toLocaleString("id-ID")}`;
        } else {
          salaryText = "Negotiable";
        }

        // Format work_type untuk tags
        const workTypeMap: Record<string, string> = {
          on_site: "On Site",
          remote: "Remote",
          hybrid: "Hybrid",
          field: "Field",
        };
        const workTypeTag = workTypeMap[apiJob.work_type] || "On Site";

        // Format work_time untuk type
        const workTimeMap: Record<string, string> = {
          full_time: "Full Time",
          part_time: "Part Time",
          freelance: "Freelance",
          internship: "Internship",
          contract: "Contract",
          volunteer: "Volunteer",
          seasonal: "Seasonal",
        };
        const workTimeFormatted = workTimeMap[apiJob.work_time] || "Full Time";

        // Parse requirements jika ada (misal: string dengan newline atau array)
        const requirementsArray = apiJob.requirements
          ? apiJob.requirements.split("\n").filter((r: string) => r.trim())
          : [];

        // Mapping data API → struktur JobDetail
        const mappedJob: JobDetail = {
          id: apiJob.id,
          title: apiJob.job_title,
          company: apiJob.company_name || `Company #${apiJob.company_id}`,
          companyLogo: apiJob.company_logo
            ? `${process.env.NEXT_PUBLIC_API_URL}/uploads/company_logos/${apiJob.company_logo}`
            : undefined,
          location: apiJob.location || "Indonesia",
          type: workTimeFormatted, // Full Time, Part Time, dll
          workType: apiJob.work_type || "on_site", // remote, hybrid, on_site
          description: apiJob.job_description || "",
          tags: [workTypeTag], // ["Remote"], ["Hybrid"], atau ["On Site"]
          salary: salaryText,
          postedAt: apiJob.created_at
            ? timeAgo(apiJob.created_at)
            : "Baru saja",
          companyDescription: undefined, // belum ada di API
          requirements: requirementsArray,
          qualifications: apiJob.qualifications || "", // qualifications dari API
          responsibilities: [],
          benefits: [],
          workingSystem: [],
          companyCriteria: [],
          applicants: apiJob.total_applicants || 0,
          views: 0,
        };

        setJob(mappedJob);
        setHasApplied(apiJob.has_applied || false);
      } else {
        throw new Error("Job not found");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch job details"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Check if job is bookmarked
  const checkBookmarkStatus = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token || !jobId) return;

      // Gunakan endpoint check bookmark spesifik
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/bookmarks/check/${jobId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setIsBookmarked(result.data.is_bookmarked);
        }
      }
    } catch (err) {
      console.error("Error checking bookmark status:", err);
    }
  }, [jobId]);

  const checkApplicationStatus = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token || !jobId) return;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/jobs/${jobId}/apply`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data?.status === "pending") {
          setHasApplied(true);
        }
      }
    } catch (err) {
      console.error("Error checking application status:", err);
    }
  }, [jobId]);

  // Toggle bookmark
  const handleBookmark = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Silakan login terlebih dahulu untuk menyimpan lowongan");
        router.push("/login");
        return;
      }

      if (!jobId) return;

      if (isBookmarked) {
        // Remove bookmark by job_id (DELETE)
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/bookmarks/job/${jobId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          setIsBookmarked(false);
          const result = await response.json();
          toast.success(
            result.message || "Lowongan berhasil dihapus dari bookmark"
          );
        } else {
          const error = await response.json();
          toast.error(error.message || "Gagal menghapus bookmark");
        }
      } else {
        // Add bookmark (POST)
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/bookmarks`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              job_id: parseInt(jobId),
            }),
          }
        );

        if (response.ok) {
          setIsBookmarked(true);
          const result = await response.json();
          toast.success(
            result.message || "Lowongan berhasil disimpan ke bookmark"
          );
        } else {
          const error = await response.json();
          toast.error(error.message || "Gagal menyimpan bookmark");
        }
      }
    } catch (err) {
      console.error("Error toggling bookmark:", err);
      toast.error("Terjadi kesalahan saat menyimpan bookmark");
    }
  };

  // Apply Now
  const handleApplyNow = () => {
    if (jobId) {
      router.push(`/lowongan/${jobId}/lamar`);
    }
  };

  // Share
  const handleShare = async () => {
    if (!job) return;

    try {
      if (navigator.share) {
        await navigator.share({
          title: job.title,
          text: `Check out this job: ${job.title} at ${job.company}`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Job link copied to clipboard!");
      }
    } catch (err) {
      console.error("Error sharing:", err);
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Job link copied to clipboard!");
      } catch {
        console.error("Clipboard not supported");
      }
    }
  };

  // Load job detail
  useEffect(() => {
    if (jobId) {
      fetchJobDetail(jobId);
      checkBookmarkStatus();
      checkApplicationStatus();
    }
  }, [jobId, fetchJobDetail, checkBookmarkStatus]);

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Error
  if (error || !job) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {error || "Job not found"}
          </h3>
          <p className="text-gray-500 mb-4">
            The job you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <button
            onClick={() => router.push("/lowongan")}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16 md:pt-20">
      <div className="max-w-4xl mx-auto p-4 lg:p-6">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-6 transition-colors"
        >
          ← Back
        </button>

        {/* Main Card */}
        <div className="bg-white rounded-lg border p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row justify-between mb-8">
            {/* Logo & Title */}
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 relative flex-shrink-0">
                {job.companyLogo ? (
                  <Image
                    src={job.companyLogo}
                    alt={`${job.company} logo`}
                    width={64}
                    height={64}
                    className="rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                    {job.company.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {job.title}
                </h1>
                <p className="text-gray-600">{job.company}</p>
                <p className="text-gray-500">{job.location}</p>
              </div>
            </div>

            {/* Job Type & Tags */}
            <div className="mt-4 lg:mt-0 flex flex-col gap-2">
              <span className="bg-blue-600 text-white px-3 py-1 rounded text-sm text-center">
                {job.type}
              </span>
              <div className="flex flex-wrap gap-2">
                {job.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-800 text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Job Description */}
          <div className="mb-6">
            <h2 className="font-semibold mb-2">Deskripsi Pekerjaan</h2>
            <p className="text-gray-700">{job.description}</p>
          </div>

          {/* Salary */}
          <div className="mb-6">
            <h2 className="font-semibold mb-2">Gaji</h2>
            <p className="text-gray-700">{job.salary}</p>
          </div>

          {/* Requirements */}
          {job.requirements.length > 0 && (
            <div className="mb-6">
              <h2 className="font-semibold mb-2">Requirements</h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                {job.requirements.map((req, i) => (
                  <li key={i}>{req}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Qualifications */}
          {job.qualifications && (
            <div className="mb-6">
              <h2 className="font-semibold mb-2">Kualifikasi</h2>
              <p className="text-gray-700">{job.qualifications}</p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <button
              onClick={handleBookmark}
              className={`px-4 py-2 rounded-md ${
                isBookmarked
                  ? "bg-blue-100 text-blue-700 border border-blue-200"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {isBookmarked ? "Tersimpan" : "Simpan"}
            </button>
            <button
              onClick={handleShare}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              Bagikan
            </button>
            <button
              onClick={handleApplyNow}
              disabled={hasApplied}
              className={`flex-1 px-4 py-2 rounded-md text-white ${
                hasApplied
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {hasApplied ? "Lamaran Terkirim" : "Apply Now"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
