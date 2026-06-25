"use client";

import { useEffect, useState } from "react";

interface ApiJob {
  id: number;
  job_title: string;
  company_name?: string;
  created_at: string;
}

export default function RejectedJobsBody() {
  const [jobs, setJobs] = useState<ApiJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem("token");
        
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/jobs/admin?status=rejected`,
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
        }
      } catch (err) {
        console.error("Failed to fetch rejected jobs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  if (loading) {
    return <div className="text-center py-6 text-slate-400">Loading...</div>;
  }

  if (jobs.length === 0) {
    return <div className="text-center py-6 text-slate-400">No rejected job posts found.</div>;
  }

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
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-500 text-white">
              Rejected
            </span>
          </div>
          <div className="text-red-400 text-xs font-medium">Rejected</div>
        </div>
      ))}
    </>
  );
}
