"use client";

import React, { useState } from "react";
import ApplicantTable from "./applicant/page";
import HrTable from "./hr/page";

const UserManagementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"Applicant" | "HR">("Applicant");

  return (
    <div className="h-screen text-white">
      <h2 className="text-3xl px-6 pb-4 font-bold">Management Users</h2>

      {/* Tabs */}
      <div className="px-6">
        <div className="flex items-center space-x-8">
          <button
            onClick={() => setActiveTab("Applicant")}
            className={`text-sm pb-2 transition-colors ${
              activeTab === "Applicant"
                ? "text-yellow-400 border-b-2 border-yellow-400"
                : "text-gray-400"
            }`}
          >
            Applicant
          </button>
          <button
            onClick={() => setActiveTab("HR")}
            className={`text-sm pb-2 transition-colors ${
              activeTab === "HR"
                ? "text-yellow-400 border-b-2 border-yellow-400"
                : "text-gray-400"
            }`}
          >
            HR Representatives
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === "Applicant" ? <ApplicantTable /> : <HrTable />}
      </div>
    </div>
  );
};

export default UserManagementPage;
