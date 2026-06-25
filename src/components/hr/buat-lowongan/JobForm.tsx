"use client";

import { useState, useEffect, useRef } from "react";
import type { JobFormValues, JobType, WorkTime, WorkType } from "./types";
import Image from "next/image";

interface JobFormProps {
  onCancel: () => void;
  onSubmit: (data: JobFormValues) => void;
  initialValues?: JobType;
}

// mapping antara type (UI) <-> work_type (backend)
const typeToWorkType: Record<WorkType, "on_site" | "remote" | "hybrid"> = {
  Remote: "remote",
  "On-site": "on_site",
  Hybrid: "hybrid",
};
const workTypeToType: Record<
  "on_site" | "remote" | "hybrid" | "field",
  WorkType
> = {
  remote: "Remote",
  on_site: "On-site",
  hybrid: "Hybrid",
  field: "On-site", // fallback
};

export default function JobForm({
  onCancel,
  onSubmit,
  initialValues,
}: JobFormProps) {
  const [formData, setFormData] = useState<JobFormValues>({
    job_title: "",
    job_description: "",
    qualifications: "",
    salary_min: 0,
    salary_max: 0,
    location: "",
    type: "Remote",
    work_type: "remote",
    work_time: "full_time",
    logo: "",
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [categoryId, setCategoryId] = useState<number>(1); // default kategori Engineering

  useEffect(() => {
    if (initialValues) {
      setFormData({
        job_title: initialValues.job_title,
        job_description: initialValues.job_description,
        qualifications: initialValues.qualifications,
        salary_min: initialValues.salary_min,
        salary_max: initialValues.salary_max,
        location: initialValues.location,
        type: workTypeToType[initialValues.work_type],
        work_type: initialValues.work_type,
        work_time: initialValues.work_time || "full_time",
        logo: initialValues.logo || "",
      });
    }
  }, [initialValues]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "salary_min" || name === "salary_max"
          ? value === ""
            ? null
            : Number(value)
          : value,
    }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      setFormData((prev) => ({
        ...prev,
        logo: URL.createObjectURL(file),
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // pastikan mapping type -> work_type sebelum submit
    const finalData: JobFormValues = {
      ...formData,
      work_type: typeToWorkType[formData.type],
      category_id: categoryId, // ✅ kirim category_id ke backend
    };

    onSubmit(finalData);
  };

  return (
    <div className="max-h-screen flex justify-center items-start bg-gray-50 p-4">
      <div className="bg-white rounded-lg shadow-md p-4 w-full mx-auto text-xl my-4">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div className="col-span-2 space-y-2">
            {/* Job Category */}
            <div>
              <label className="block font-semibold mb-1 text-base">
                Job Category
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(Number(e.target.value))}
                className="w-full border rounded px-2 py-1 text-sm"
              >
                <option value={1}>Engineering</option>
                <option value={2}>Design</option>
                <option value={3}>Marketing</option>
                <option value={4}>Product</option>
                <option value={5}>Data</option>
                <option value={6}>Operation</option>
                <option value={7}>Finance</option>
                <option value={8}>Human Resource (HR)</option>
              </select>
            </div>

            {/* Job Title */}
            <div>
              <label className="block font-semibold mb-1 text-lg">
                Job Title
              </label>
              <input
                type="text"
                name="job_title"
                value={formData.job_title}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1 text-sm"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block font-semibold mb-1 text-base">
                Description
              </label>
              <textarea
                name="job_description"
                value={formData.job_description}
                onChange={handleChange}
                rows={2}
                className="w-full border rounded px-2 py-1 text-sm"
              />
            </div>

            {/* Requirements */}
            <div>
              <label className="block font-semibold mb-1 text-base">
                Requirements
              </label>
              <textarea
                name="qualifications"
                value={formData.qualifications}
                onChange={handleChange}
                rows={2}
                className="w-full border rounded px-2 py-1 text-sm"
              />
            </div>

            {/* Work Type */}
            <div>
              <label className="block font-semibold mb-1 text-base">
                Work Type
              </label>
              <div className="flex gap-2 mb-1">
                {["Remote", "On-site", "Hybrid"].map((label) => (
                  <button
                    type="button"
                    key={label}
                    className={`w-24 py-1 rounded-full text-xs font-semibold text-white transition-colors ${
                      formData.type === label ? "bg-blue-600" : "bg-gray-300"
                    }`}
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        type: label as WorkType,
                        work_type: typeToWorkType[label as WorkType],
                      }))
                    }
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Work Time */}
            <div>
              <label className="block font-semibold mb-1 text-base">
                Work Time
              </label>
              <div className="flex flex-wrap gap-2 mb-1">
                {[
                  "full_time",
                  "part_time",
                  "freelance",
                  "internship",
                  "contract",
                  "volunteer",
                  "seasonal",
                ].map((label) => (
                  <button
                    type="button"
                    key={label}
                    className={`px-4 py-1 rounded-full text-xs font-semibold text-white transition-colors ${
                      formData.work_time === label
                        ? "bg-blue-600"
                        : "bg-gray-300"
                    }`}
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        work_time: label as WorkTime,
                      }))
                    }
                  >
                    {label.replace("_", " ")}
                  </button>
                ))}
              </div>
            </div>

            {/* Salary Min */}
            <div>
              <label className="block font-semibold mb-1 text-base">
                Salary Min
              </label>
              <input
                type="number"
                name="salary_min"
                value={formData.salary_min ?? ""}
                onChange={handleChange}
                placeholder="Contoh: 5000000"
                className="w-full border rounded px-2 py-1 text-sm"
              />
            </div>

            {/* Salary Max */}
            <div>
              <label className="block font-semibold mb-1 text-base">
                Salary Max
              </label>
              <input
                type="number"
                name="salary_max"
                value={formData.salary_max ?? ""}
                onChange={handleChange}
                placeholder="Contoh: 8000000"
                className="w-full border rounded px-2 py-1 text-sm"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block font-semibold mb-1 text-base">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1 text-sm"
              />
            </div>
          </div>

          {/* Logo */}
          <div className="col-span-1 flex flex-col items-center">
            <label className="block font-semibold mb-1 text-base">
              Company Logo
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-44 h-28 border-2 border-dashed rounded flex items-center justify-center text-gray-500 text-xs cursor-pointer hover:bg-gray-50"
            >
              {logoFile || formData.logo ? (
                <Image
                  src={
                    logoFile
                      ? URL.createObjectURL(logoFile)
                      : formData.logo || "/default-logo.png"
                  }
                  alt="Logo Preview"
                  width={176}
                  height={112}
                  className="w-full h-full object-contain p-2"
                />
              ) : (
                "Unggah"
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleLogoChange}
              className="hidden"
            />
          </div>

          {/* Buttons */}
          <div className="col-span-3 flex justify-end gap-2 mt-6 pt-4 border-t">
            <button
              type="button"
              onClick={onCancel}
              className="px-3 py-1 text-base rounded bg-gray-300 hover:bg-gray-400"
            >
              Kembali
            </button>
            <button
              type="submit"
              className="px-3 py-1 text-base rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              {initialValues ? "Update" : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
