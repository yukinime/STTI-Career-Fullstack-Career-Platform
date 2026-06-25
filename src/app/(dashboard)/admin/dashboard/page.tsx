"use client";

import React, { useEffect, useState } from "react";

interface ApplicationType {
  id?: number;
  status?: string;
  [key: string]: unknown; // fleksibel untuk field tambahan
}

interface DashboardData {
  users: {
    total_users: number;
    total_pelamar: string;
    total_hr: string;
    total_admin: string;
    active_users: string;
    inactive_users: string;
  };
  companies: {
    total_companies: number;
    active_companies: number | null;
  };
  jobs: {
    verification_status: string;
    total: number;
  }[];
  applications: ApplicationType[];
}

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Unauthorized");
          return;
        }

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/admin/dashboard`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) throw new Error("Gagal ambil data dashboard");

        const json = await res.json();
        console.log("Dashboard API response:", json);

        setData(json.data);
      } catch (err) {
        console.error(err);
        setError("Gagal memuat data dashboard");
      } finally {
        setLoading(false);
      }
      
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return <div className="px-6 py-4">Loading...</div>;
  }

  if (error) {
    return <div className="px-6 py-4 text-red-500">{error}</div>;
  }

  if (!data) return null;

  // Hitung data dari jobs
  const pendingJobs =
    data.jobs.find((j) => j.verification_status === "pending")?.total ?? 0;
  const rejectedJobs =
    data.jobs.find((j) => j.verification_status === "rejected")?.total ?? 0;
  const approvedJobs =
  data.jobs.find((j) =>
    ["approved", "verified"].includes(j.verification_status.toLowerCase())
  )?.total ?? 0;


  return (
    <>
      {/* Overview Section */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4 px-6">Overview</h2>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 max-w-5xl px-6">
        {/* Users */}
        <div className="bg-slate-800 p-6 rounded-lg">
          <div className="text-gray-400 text-sm mb-2">Total Users</div>
          <div className="text-2xl font-bold">{data.users.total_users}</div>
        </div>

        {/* Companies */}
        <div className="bg-slate-800 p-6 rounded-lg">
          <div className="text-gray-400 text-sm mb-2">Total Companies</div>
          <div className="text-2xl font-bold">
            {data.companies.total_companies}
          </div>
        </div>

        {/* Pending Verification */}
        <div className="bg-slate-800 p-6 rounded-lg">
          <div className="text-gray-400 text-sm mb-2">Pending Verification</div>
          <div className="text-2xl font-bold">{pendingJobs}</div>
        </div>

        {/* Approved Jobs */}
        <div className="bg-slate-800 p-6 rounded-lg">
          <div className="text-gray-400 text-sm mb-2">Verified Jobs</div>
          <div className="text-2xl font-bold">{approvedJobs}</div>
        </div>

        {/* Rejected Jobs */}
        <div className="bg-slate-800 p-6 rounded-lg">
          <div className="text-gray-400 text-sm mb-2">Rejected Jobs</div>
          <div className="text-2xl font-bold">{rejectedJobs}</div>
        </div>

        {/* Applications */}
        <div className="bg-slate-800 p-6 rounded-lg">
          <div className="text-gray-400 text-sm mb-2">Total Applications</div>
          <div className="text-2xl font-bold">{data.applications.length}</div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
