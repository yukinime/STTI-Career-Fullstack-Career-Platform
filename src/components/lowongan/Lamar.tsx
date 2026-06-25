"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { CircleDollarSign, MapPin } from "lucide-react";

// Interface untuk tipe data job detail
interface JobDetail {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string; // work_time
  workType: string; // work_type
  description: string;
  tags: string[];
  salary_min: number;
  salary_max: number;
  postedAt: string;
  companyLogo?: string;
}

// Interface untuk application form
interface ApplicationForm {
  fullName: string;
  email: string;
  phone: string;
  portfolioUrl: string;
  resume: File | null;
  userId: number | null;
}

const LamarKerja: React.FC = () => {
  const [job, setJob] = useState<JobDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [hasApplied, setHasApplied] = useState<boolean>(false);
  const [formData, setFormData] = useState<ApplicationForm>({
    fullName: "",
    email: "",
    phone: "",
    portfolioUrl: "",
    resume: null,
    userId: null,
  });
  const [token, setToken] = useState<string | null>(null);

  const router = useRouter();
  const params = useParams();
  const jobId = params?.id;

  const workTypeMap: Record<string, string> = {
    on_site: "On Site",
    remote: "Remote",
    hybrid: "Hybrid",
    field: "Field",
  };

  const workTimeMap: Record<string, string> = {
    full_time: "Full Time",
    part_time: "Part Time",
    freelance: "Freelance",
    internship: "Internship",
    contract: "Contract",
    volunteer: "Volunteer",
    seasonal: "Seasonal",
  };

  // Ambil token hanya di client
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      setToken(storedToken);
    }
  }, []);

  // Fetch job detail dari API
  useEffect(() => {
    const fetchJobDetail = async () => {
      if (!jobId) return;
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const headers: any = {};
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/jobs/public/${jobId}`,
          { headers }
        );
        const result = await res.json();

        if (result.success && result.data) {
          const data = result.data;

          // 🔹 simpan status lamaran
          setHasApplied(data.has_applied || false);

          const workType = workTypeMap[data.work_type] || "Remote";
          const workTime = workTimeMap[data.work_time] || "Full Time";

          setJob({
            id: data.id,
            title: data.job_title,
            company: data.company_name || "Perusahaan",
            location: data.location || "-",
            type: workTime,
            workType: workType,
            description: data.job_description,
            tags: data.tags && data.tags.length > 0 ? data.tags : [],
            salary_min: data.salary_min ?? 0,
            salary_max: data.salary_max ?? 0,
            postedAt: new Date().toISOString(),
            companyLogo: data.company_logo,
          });
        } else {
          throw new Error("Job not found");
        }
      } catch (err) {
        console.error("Error fetching job details:", err);
        router.push("/lowongan");
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetail();
  }, [jobId, router]);

  useEffect(() => {
    if (hasApplied) {
      alert("Anda sudah melamar pekerjaan ini!");
      router.push(`/lowongan/${jobId}`);
    }
  }, [hasApplied, jobId, router]);

  // Fetch applicant profile otomatis
  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) return;
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/profile`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const result = await res.json();
        if (result.success && result.data) {
          setFormData((prev) => ({
            ...prev,
            fullName: result.data.full_name || "",
            email: result.data.email || "",
            phone: result.data.phone || "",
            userId: result.data.id ?? null,
          }));
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    fetchProfile();
  }, [token]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, resume: file }));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "image/png",
        "image/jpeg",
        "image/jpg",
      ];
      if (allowedTypes.includes(file.type)) {
        setFormData((prev) => ({ ...prev, resume: file }));
      } else {
        alert("Please upload a valid file (PDF, DOC, DOCX, PNG, JPG, JPEG)");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);

      if (
        !formData.fullName ||
        !formData.email ||
        !formData.phone ||
        !formData.resume ||
        !job?.id ||
        !formData.userId
      ) {
        alert(
          "Lengkapi semua field termasuk full name, email, phone dan resume"
        );
        return;
      }

      const fd = new FormData();
      fd.append("full_name", formData.fullName);
      fd.append("email", formData.email);
      fd.append("phone", formData.phone);
      fd.append("portfolio_url", formData.portfolioUrl);
      fd.append("cover_letter", "");
      fd.append("job_id", String(job.id));
      fd.append("user_id", String(formData.userId));
      fd.append("status", "pending");
      fd.append("resume_file", formData.resume); // ⬅️ kirim file asli

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/jobs/${job.id}/apply`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`, // ⬅️ jangan pakai Content-Type di sini!
          },
          body: fd,
        }
      );

      const result = await res.json();

      if (res.ok) {
        setHasApplied(true);
        setShowSuccessModal(true);
      } else if (result.message === "Kamu sudah melamar pekerjaan ini") {
        setHasApplied(true);
        alert("Anda sudah melamar pekerjaan ini!");
      } else {
        throw new Error(result.message || "Failed to submit application");
      }
    } catch (err) {
      console.error("Error submitting application:", err);
      alert("Gagal mengirim lamaran. Silakan coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoBack = () => router.back();
  const handleViewStatus = () => {
    setShowSuccessModal(false);
    router.push("/pelamar/lamaran");
  };

  const handleBackToJobs = () => {
    setShowSuccessModal(false);
    router.push("/lowongan");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Job not found
          </h3>
          <button
            onClick={() => router.push("/lowongan")}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Back
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
          onClick={handleGoBack}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-6 transition-colors"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back
        </button>

        {/* Job Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-start space-x-4">
            {job.companyLogo ? (
              <img
                src={job.companyLogo}
                alt={job.company}
                width={16}
                height={16}
                className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
              />
            ) : (
              <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-lg">
                  {job.company[0]}
                </span>
              </div>
            )}

            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                {job.title}
              </h1>
              <p className="text-gray-600 mb-2">{job.company}</p>

              <div className="text-gray-700 text-sm leading-relaxed mb-3 select-text">
                {job.description}
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
                {job.tags?.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                  >
                    {tag}
                  </span>
                ))}

                {job.workType && (
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {job.workType}
                  </span>
                )}

                {job.type && (
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    {job.type}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-4 text-gray-600 text-sm">
                <div className="flex items-center">
                  <CircleDollarSign className="w-4 h-4 mr-1" />
                  {job.salary_min > 0 && job.salary_max > 0
                    ? `Rp ${job.salary_min.toLocaleString(
                        "id-ID"
                      )} – Rp ${job.salary_max.toLocaleString("id-ID")}`
                    : job.salary_min > 0
                    ? `Rp ${job.salary_min.toLocaleString("id-ID")}`
                    : job.salary_max > 0
                    ? `Rp ${job.salary_max.toLocaleString("id-ID")}`
                    : "Gaji dapat dinegosiasi"}
                </div>

                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {job.location && job.location.trim() !== ""
                    ? job.location
                    : "-"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Application Form */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          {hasApplied ? (
            <div className="text-center py-10">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Anda sudah melamar pekerjaan ini
              </h2>
              <p className="text-gray-600 mb-6">
                Silakan cek status lamaran Anda di halaman{" "}
                <span className="font-semibold">Lamaran Saya</span>.
              </p>
              <button
                onClick={() => router.push("/pelamar/lamaran")}
                className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
              >
                Lihat Status Lamaran
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Submit Your Application
              </h2>
              <form onSubmit={handleSubmit}>
                {/* Form field aslinya di sini */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName || ""}
                      readOnly
                      placeholder={
                        formData.fullName ? "" : "Silakan lengkapi profile Anda"
                      }
                      className="w-full p-3 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email || ""}
                      readOnly
                      placeholder={
                        formData.email ? "" : "Silakan lengkapi profile Anda"
                      }
                      className="w-full p-3 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone || ""}
                      readOnly
                      placeholder={
                        formData.phone ? "" : "Silakan lengkapi profile Anda"
                      }
                      className="w-full p-3 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Portfolio/Website URL
                    </label>
                    <input
                      type="url"
                      name="portfolioUrl"
                      value={formData.portfolioUrl}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                {/* Resume Upload */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Your Resume
                  </label>
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  >
                    <p className="text-sm text-gray-500 mb-3">
                      PNG, JPG, PDF up to 10MB
                    </p>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                      onChange={handleFileChange}
                      className="block mx-auto"
                      id="resume-upload"
                      required
                    />
                    {formData.resume && (
                      <p className="text-sm text-gray-600 mt-2">
                        Selected: {formData.resume.name}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    {submitting ? "Submitting..." : "Apply Now"}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-8 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Lamaran Anda Telah Berhasil Dikirim
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Terima kasih telah melamar posisi ini. Kami akan meninjau
                lamaran Anda dan menghubungi Anda jika ada perkembangan lebih
                lanjut.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleViewStatus}
                className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
              >
                Lihat Status Lamaran
              </button>
              <button
                onClick={handleBackToJobs}
                className="flex-1 bg-gray-500 text-white py-3 px-4 rounded-md hover:bg-gray-600 transition-colors font-medium"
              >
                Kembali Ke Beranda
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LamarKerja;
