import React from "react";

// ENUMS
export type WorkType = "Remote" | "On-site" | "Hybrid";
export type WorkTime =
  | "full_time"
  | "part_time"
  | "freelance"
  | "internship"
  | "contract"
  | "volunteer"
  | "seasonal";

// Data asli dari backend
export interface JobApiResponse {
  id: number;
  job_title: string;
  job_description: string;
  qualifications: string;
  salary_min: number;
  salary_max: number;
  location: string;
  type: WorkType; // UI friendly (Remote, On-site, Hybrid)
  verification_status: "pending" | "verified" | "rejected"; // Status dari backend
  is_active?: number;
  company_id?: number | null;
  category_id?: number | null;
  created_at?: string;
  updated_at?: string;
  logo?: string;
  work_type: "on_site" | "remote" | "hybrid" | "field"; // backend
  work_time: WorkTime;
}

// Data hasil mapping → untuk UI
// Disimpan properti yang dibutuhkan JobCard dari data yang sudah diproses/disiapkan
export interface JobType extends JobApiResponse {
  title: string;
  description: string;
  requirements: string; // alias dari qualifications
  salary_range: string; // representasi string dari salary_min & salary_max
  statusLabel: "Tunggu Verifikasi" | "Terverifikasi" | "Ditolak" | string; // Label status
  statusColor: string; // 🔥 tambahan
  icon: React.ReactNode; // 🔥 tambahan
}


// Data untuk form (create/update)
export interface JobFormValues {
  job_title: string;
  job_description: string;
  qualifications: string;
  location: string;
  type: WorkType; // UI friendly
  work_type: "on_site" | "remote" | "hybrid" | "field"; // backend
  work_time: WorkTime;
  salary_min: number ;
  salary_max: number ;
  logo?: string;
  category_id?: number | null;
}