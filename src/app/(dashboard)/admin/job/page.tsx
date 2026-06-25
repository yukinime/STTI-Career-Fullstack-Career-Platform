"use client";

import { useState } from "react";
import PendingJobsBody from "./pending/page";
import VerifiedJobsBody from "./verified/page";
import RejectedJobsBody from "./rejected/page";

export default function JobPostsVerification() {
  const [activeTab, setActiveTab] = useState<"Pending" | "Verified" | "Rejected">("Pending");

  return (
    <div className="px-6">
      {/* Page Title */}
      <h2 className="text-3xl font-semibold mb-6">Job Posts Verification</h2>

      {/* Tab Navigation */}
      <div className="flex gap-0 border-b border-slate-700 mb-6">
        {(["Pending", "Verified", "Rejected"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 text-sm font-medium transition-colors relative ${
              activeTab === tab
                ? "text-orange-400 bg-slate-700"
                : "text-slate-400 hover:text-slate-300 hover:bg-slate-750"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-400"></div>
            )}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-slate-800 rounded-lg overflow-hidden">
        {/* Table Header (tetap ada) */}
        <div className="bg-slate-700 px-6 py-3 grid grid-cols-5 text-slate-300 text-xs uppercase">
          <div>Job Title</div>
          <div>Company</div>
          <div>Posted Date</div>
          <div>Status</div>
          <div>Actions</div>
        </div>

        {/* Table Body (ganti sesuai tab) */}
        <div className="divide-y divide-slate-700">
          {activeTab === "Pending" && <PendingJobsBody />}
          {activeTab === "Verified" && <VerifiedJobsBody />}
          {activeTab === "Rejected" && <RejectedJobsBody />}
        </div>
      </div>
    </div>
  );
}
