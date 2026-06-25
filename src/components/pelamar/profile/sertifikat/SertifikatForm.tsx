"use client";
import { useRef, useState } from "react";

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/profile`;

type SertifikatFormProps = {
  mode?: "add" | "edit";
  data?: {
    id?: string;
    nama: string;
    penerbit: string;
    gambar?: string;
    tanggal_terbit?: string;
    tanggal_berakhir?: string;
  };
  onSave?: () => void;
  onCancel?: () => void;
};

export default function SertifikatForm({ mode = "add", data, onSave, onCancel }: SertifikatFormProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Form states
  const [formData, setFormData] = useState({
    certificate_name: data?.nama || "",
    issuer: data?.penerbit || "",
    issue_date: data?.tanggal_terbit || "",
    expiry_date: data?.tanggal_berakhir || "",
  });

  // Error states
  const [errors, setErrors] = useState({
    certificate_name: "",
    issuer: "",
    issue_date: "",
    expiry_date: "",
    file: "",
  });

  const getAuthToken = () => {
    const token = localStorage.getItem("jwt_token") || localStorage.getItem("token") || localStorage.getItem("auth_token");
    console.log("Token retrieved:", token ? "Token exists" : "No token found");
    return token;
  };

  const validateForm = () => {
    const newErrors = {
      certificate_name: "",
      issuer: "",
      issue_date: "",
      expiry_date: "",
      file: "",
    };

    let isValid = true;

    // Validasi nama sertifikat
    if (!formData.certificate_name.trim()) {
      newErrors.certificate_name = "Nama sertifikat wajib diisi";
      isValid = false;
    } else if (formData.certificate_name.trim().length < 3) {
      newErrors.certificate_name = "Nama sertifikat minimal 3 karakter";
      isValid = false;
    }

    // Validasi penerbit
    if (!formData.issuer.trim()) {
      newErrors.issuer = "Penerbit wajib diisi";
      isValid = false;
    } else if (formData.issuer.trim().length < 2) {
      newErrors.issuer = "Penerbit minimal 2 karakter";
      isValid = false;
    }

    // Validasi tanggal
    if (formData.issue_date && formData.expiry_date) {
      const issueDate = new Date(formData.issue_date);
      const expiryDate = new Date(formData.expiry_date);
      const today = new Date();

      if (issueDate > today) {
        newErrors.issue_date = "Tanggal terbit tidak boleh di masa depan";
        isValid = false;
      }

      if (expiryDate <= issueDate) {
        newErrors.expiry_date = "Tanggal berakhir harus lebih besar dari tanggal terbit";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleClickUpload = () => {
    if (!isLoading) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validasi ukuran file (10MB = 10 * 1024 * 1024 bytes)
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        setErrors((prev) => ({
          ...prev,
          file: "Ukuran file terlalu besar! Maksimal 10MB.",
        }));
        return;
      }

      // Validasi tipe file
      const allowedTypes = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          file: "Tipe file tidak didukung! Hanya PDF, JPG, dan PNG yang diperbolehkan.",
        }));
        return;
      }

      setSelectedFile(file);
      setErrors((prev) => ({ ...prev, file: "" }));
      console.log("File terpilih:", {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: new Date(file.lastModified),
      });
    }
  };

  // Upload file to appropriate endpoint
  const uploadFile = async (file: File): Promise<string> => {
    const token = getAuthToken();
    if (!token) {
      throw new Error("Token autentikasi tidak ditemukan");
    }

    const fileType = file.type;
    const isImage = fileType.startsWith("image/");
    const isPDF = fileType === "application/pdf";

    // Tentukan endpoint berdasarkan tipe file
    const uploadEndpoint = isImage ? `${API_BASE_URL}/upload-photo` : isPDF ? `${API_BASE_URL}/upload-files` : `${API_BASE_URL}/upload-files`;

    const formData = new FormData();
    // Sesuaikan field name dengan yang diharapkan backend
    formData.append(isImage ? "photo" : "file", file);

    console.log(`=== UPLOADING FILE ===`);
    console.log("File type:", fileType);
    console.log("Upload to:", uploadEndpoint);
    console.log("Is image:", isImage);

    try {
      const response = await fetch(uploadEndpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      console.log("Upload Response Status:", response.status);

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorData = await response.text();
          console.error("Upload Error Response:", errorData);
          try {
            const parsedError = JSON.parse(errorData);
            errorMessage = parsedError.message || parsedError.error || errorMessage;
          } catch {
            if (errorData) errorMessage = errorData;
          }
        } catch (parseError) {
          console.error("Failed to parse upload error:", parseError);
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log("Upload Success Response:", result);

      // Return file URL atau path dari response
      return result.url || result.path || result.file_url || result.data?.url;
    } catch (error) {
      console.error("Upload Error:", error);
      throw error;
    }
  };

  const createCertificate = async () => {
    const token = getAuthToken();
    if (!token) {
      throw new Error("Token autentikasi tidak ditemukan. Silakan login ulang.");
    }

    const form = new FormData();
    form.append("certificate_name", formData.certificate_name.trim());
    form.append("issuer", formData.issuer.trim());
    if (formData.issue_date) form.append("issue_date", formData.issue_date);
    if (formData.expiry_date) form.append("expiry_date", formData.expiry_date);
    if (selectedFile) form.append("certificate_file", selectedFile); // 👈 penting, harus sama dengan backend

    console.log("=== SENDING DATA TO API ===");
    console.log("Endpoint:", `${API_BASE_URL}/certificate`);
    console.log("FormData:", [...form.entries()]);

    try {
      const response = await fetch(`${API_BASE_URL}/certificate`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form, // 👈 langsung kirim FormData, jangan JSON
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || `HTTP ${response.status}`);
      }

      const result = await response.json();
      console.log("Success Response:", result);
      return result;
    } catch (error) {
      console.error("Upload Error:", error);
      throw error;
    }
  };

  const updateCertificate = async () => {
    if (!data?.id) throw new Error("ID sertifikat tidak ditemukan untuk update");

    const token = getAuthToken();
    if (!token) {
      throw new Error("Token autentikasi tidak ditemukan. Silakan login ulang.");
    }

    const form = new FormData();
    form.append("certificate_name", formData.certificate_name.trim());
    form.append("issuer", formData.issuer.trim());
    if (formData.issue_date) form.append("issue_date", formData.issue_date);
    if (formData.expiry_date) form.append("expiry_date", formData.expiry_date);
    if (selectedFile) form.append("certificate_file", selectedFile);

    console.log("=== UPDATING CERTIFICATE ===");
    console.log("Endpoint:", `${API_BASE_URL}/certificate/${data.id}`);
    console.log("FormData:", [...form.entries()]);

    try {
      const response = await fetch(`${API_BASE_URL}/certificate/${data.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || `HTTP ${response.status}`);
      }

      const result = await response.json();
      console.log("Update Success Response:", result);
      return result;
    } catch (error) {
      console.error("Update Error:", error);
      throw error;
    }
  };

  const deleteCertificate = async () => {
    if (!data?.id) throw new Error("ID sertifikat tidak ditemukan untuk hapus");

    const token = getAuthToken();
    if (!token) {
      throw new Error("Token autentikasi tidak ditemukan. Silakan login ulang.");
    }

    console.log("=== DELETING CERTIFICATE ===");
    console.log("Certificate ID:", data.id);

    try {
      const response = await fetch(`${API_BASE_URL}/certificate/${data.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`, // 👈 cukup ini
        },
      });

      console.log("Delete Response Status:", response.status);

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || `HTTP ${response.status}`);
      }

      let result = null;
      try {
        result = await response.json();
      } catch {
        result = { success: true };
      }

      console.log("Delete Success Response:", result);
      return result;
    } catch (error) {
      console.error("Delete Error:", error);
      throw error;
    }
  };

  const handleSave = async () => {
    console.log("=== FORM SUBMISSION STARTED ===");
    console.log("Mode:", mode);
    console.log("Form Data:", formData);
    console.log(
      "Selected File:",
      selectedFile
        ? {
            name: selectedFile.name,
            size: selectedFile.size,
            type: selectedFile.type,
          }
        : "No file selected"
    );

    // Validasi form
    if (!validateForm()) {
      console.log("Form validation failed");
      return;
    }

    setIsLoading(true);
    setUploadProgress(0);

    try {
      let result;

      if (mode === "add") {
        console.log("Creating new certificate...");
        result = await createCertificate();
        console.log("Certificate created successfully:", result);

        if (window.confirm("Sertifikat berhasil ditambahkan! Apakah Anda ingin menambah sertifikat lagi?")) {
          // Reset form
          setFormData({
            certificate_name: "",
            issuer: "",
            issue_date: "",
            expiry_date: "",
          });
          setSelectedFile(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
          setErrors({
            certificate_name: "",
            issuer: "",
            issue_date: "",
            expiry_date: "",
            file: "",
          });
        } else {
          onSave?.();
        }
      } else {
        console.log("Updating existing certificate...");
        result = await updateCertificate();
        console.log("Certificate updated successfully:", result);

        alert("Sertifikat berhasil diperbarui!");
        onSave?.();
      }
    } catch (error) {
      console.error("=== ERROR OCCURRED ===");
      console.error("Error details:", error);

      const errorMessage = error instanceof Error ? error.message : "Terjadi kesalahan yang tidak diketahui";

      let userMessage = errorMessage;

      if (errorMessage.includes("401")) {
        userMessage = "Sesi Anda telah berakhir. Silakan login ulang.";
      } else if (errorMessage.includes("403")) {
        userMessage = "Anda tidak memiliki izin untuk melakukan aksi ini.";
      } else if (errorMessage.includes("404")) {
        userMessage = "Data sertifikat tidak ditemukan.";
      } else if (errorMessage.includes("413")) {
        userMessage = "File yang diupload terlalu besar.";
      } else if (errorMessage.includes("415")) {
        userMessage = "Format file tidak didukung.";
      } else if (errorMessage.includes("422")) {
        userMessage = "Data yang dikirim tidak valid. Periksa kembali form Anda.";
      } else if (errorMessage.includes("500")) {
        userMessage = "Terjadi kesalahan di server. Silakan coba lagi nanti.";
      }

      alert(`Gagal ${mode === "add" ? "menambah" : "memperbarui"} sertifikat:\n\n${userMessage}`);
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  const handleDelete = async () => {
    const confirmMessage = `Apakah Anda yakin ingin menghapus sertifikat "${formData.certificate_name}"?\n\nTindakan ini tidak dapat dibatalkan.`;

    if (!window.confirm(confirmMessage)) {
      return;
    }

    setIsLoading(true);

    try {
      console.log("Deleting certificate...");
      await deleteCertificate();
      console.log("Certificate deleted successfully");

      alert("Sertifikat berhasil dihapus!");
      onSave?.();
    } catch (error) {
      console.error("Delete Error:", error);

      const errorMessage = error instanceof Error ? error.message : "Terjadi kesalahan yang tidak diketahui";

      let userMessage = errorMessage;
      if (errorMessage.includes("401")) {
        userMessage = "Sesi Anda telah berakhir. Silakan login ulang.";
      } else if (errorMessage.includes("403")) {
        userMessage = "Anda tidak memiliki izin untuk menghapus sertifikat ini.";
      } else if (errorMessage.includes("404")) {
        userMessage = "Sertifikat tidak ditemukan atau sudah dihapus.";
      }

      alert(`Gagal menghapus sertifikat:\n\n${userMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      certificate_name: "",
      issuer: "",
      issue_date: "",
      expiry_date: "",
    });
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setErrors({
      certificate_name: "",
      issuer: "",
      issue_date: "",
      expiry_date: "",
      file: "",
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">{mode === "add" ? "Tambah Sertifikat Baru" : "Edit Sertifikat"}</h3>
        <p className="text-sm text-gray-600 mt-1">{mode === "add" ? "Lengkapi informasi sertifikat yang ingin ditambahkan" : "Ubah informasi sertifikat sesuai kebutuhan"}</p>
      </div>

      {/* Form Content */}
      <form className="p-6" onSubmit={(e) => e.preventDefault()}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nama Sertifikat */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nama Sertifikat <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.certificate_name}
              onChange={(e) => handleInputChange("certificate_name", e.target.value)}
              className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                errors.certificate_name ? "border-red-500 bg-red-50" : "border-gray-300"
              }`}
              placeholder="Contoh: AWS Certified Solutions Architect - Associate"
              required
              disabled={isLoading}
              maxLength={200}
            />
            {errors.certificate_name && (
              <p className="text-red-500 text-xs mt-1 flex items-center">
                <span className="mr-1">⚠️</span>
                {errors.certificate_name}
              </p>
            )}
          </div>

          {/* Penerbit */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Penerbit <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.issuer}
              onChange={(e) => handleInputChange("issuer", e.target.value)}
              className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${errors.issuer ? "border-red-500 bg-red-50" : "border-gray-300"}`}
              placeholder="Contoh: Amazon Web Services (AWS)"
              required
              disabled={isLoading}
              maxLength={150}
            />
            {errors.issuer && (
              <p className="text-red-500 text-xs mt-1 flex items-center">
                <span className="mr-1">⚠️</span>
                {errors.issuer}
              </p>
            )}
          </div>

          {/* Tanggal Terbit */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Terbit</label>
            <input
              type="date"
              value={formData.issue_date}
              onChange={(e) => handleInputChange("issue_date", e.target.value)}
              className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${errors.issue_date ? "border-red-500 bg-red-50" : "border-gray-300"}`}
              disabled={isLoading}
              max={new Date().toISOString().split("T")[0]}
            />
            {errors.issue_date && (
              <p className="text-red-500 text-xs mt-1 flex items-center">
                <span className="mr-1">⚠️</span>
                {errors.issue_date}
              </p>
            )}
          </div>

          {/* Tanggal Berakhir */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tanggal Berakhir
              <span className="text-gray-500 text-xs ml-1">(Opsional)</span>
            </label>
            <input
              type="date"
              value={formData.expiry_date}
              onChange={(e) => handleInputChange("expiry_date", e.target.value)}
              className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${errors.expiry_date ? "border-red-500 bg-red-50" : "border-gray-300"}`}
              disabled={isLoading}
              min={formData.issue_date || undefined}
            />
            {errors.expiry_date && (
              <p className="text-red-500 text-xs mt-1 flex items-center">
                <span className="mr-1">⚠️</span>
                {errors.expiry_date}
              </p>
            )}
          </div>

          {/* Upload File */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Unggah Sertifikat
              <span className="text-gray-500 text-xs ml-1">(Opsional - PDF, JPG, PNG, max 10MB)</span>
            </label>

            <input type="file" accept=".pdf,.jpg,.jpeg,.png" ref={fileInputRef} onChange={handleFileChange} className="hidden" disabled={isLoading} />

            <div
              onClick={handleClickUpload}
              className={`w-full h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-gray-500 transition-all ${
                errors.file ? "border-red-500 bg-red-50" : !isLoading ? "cursor-pointer hover:border-blue-400 hover:bg-blue-50" : "cursor-not-allowed opacity-50"
              }`}
            >
              {selectedFile ? (
                <>
                  <span className="text-4xl mb-2">📄</span>
                  <p className="text-sm text-blue-600 font-medium text-center px-4">{selectedFile.name}</p>
                  <p className="text-xs text-gray-400 mt-1">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                </>
              ) : (
                <>
                  <span className="text-4xl mb-2">📁</span>
                  <p className="text-sm text-blue-600 font-medium">Klik untuk pilih file</p>
                  <p className="text-xs text-gray-400 mt-1">atau seret dan lepas file di sini</p>
                </>
              )}
            </div>

            {errors.file && (
              <p className="text-red-500 text-xs mt-2 flex items-center">
                <span className="mr-1">⚠️</span>
                {errors.file}
              </p>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        {isLoading && uploadProgress > 0 && (
          <div className="mt-6">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Mengunggah...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 pt-6 border-t border-gray-200">
          <div>
            {mode === "edit" && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={isLoading}
                className="bg-red-600 text-white px-6 py-2.5 rounded-lg hover:bg-red-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Menghapus...
                  </>
                ) : (
                  <>🗑️ Hapus Sertifikat</>
                )}
              </button>
            )}
          </div>

          <div className="flex gap-3">
            {mode === "add" && (
              <button
                type="button"
                onClick={resetForm}
                disabled={isLoading}
                className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-lg hover:bg-gray-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                🔄 Reset Form
              </button>
            )}

            <button type="button" onClick={onCancel} disabled={isLoading} className="bg-gray-500 text-white px-6 py-2.5 rounded-lg hover:bg-gray-600 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              ❌ Batal
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={isLoading}
              className="bg-blue-600 text-white px-8 py-2.5 rounded-lg hover:bg-blue-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 min-w-[140px] justify-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {mode === "add" ? "Menambah..." : "Menyimpan..."}
                </>
              ) : (
                <>{mode === "add" ? "➕ Tambah Sertifikat" : "💾 Simpan Perubahan"}</>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
