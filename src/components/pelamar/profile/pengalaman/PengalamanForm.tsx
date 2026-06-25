// src/components/pelamar/profile/pengalaman/PengalamanForm.tsx
"use client";

import { useState, FormEvent, useEffect } from "react";

type Pengalaman = {
  id?: string | number;
  posisi: string;
  perusahaan: string;
  deskripsi: string;
  tahunMasuk: string;
  tahunKeluar: string;
  isCurrentJob?: boolean;
};

type PengalamanFormProps = {
  mode?: "add" | "edit";
  data?: Pengalaman;
  onSave: (values: Pengalaman) => void;
  onCancel: () => void;
  onDelete?: (id: string | number) => void;
};

interface Language {
  code: string;
  name: string;
  flag: string;
}

interface TranslationSet {
  [key: string]: {
    [lang: string]: string;
  };
}

const languages: Language[] = [
  { code: 'id', name: 'Indonesia', flag: '🇮🇩' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' }
];

// Translation mappings for the form
const translations: TranslationSet = {
  // Form titles
  'Tambah Pengalaman Kerja': {
    'id': 'Tambah Pengalaman Kerja',
    'en': 'Add Work Experience',
    'ja': '職歴を追加'
  },
  'Edit Pengalaman Kerja': {
    'id': 'Edit Pengalaman Kerja',
    'en': 'Edit Work Experience',
    'ja': '職歴を編集'
  },
  
  // Field labels
  'Posisi': {
    'id': 'Posisi',
    'en': 'Position',
    'ja': 'ポジション'
  },
  'Nama Perusahaan': {
    'id': 'Nama Perusahaan',
    'en': 'Company Name',
    'ja': '会社名'
  },
  'Tahun Masuk': {
    'id': 'Tahun Masuk',
    'en': 'Start Year',
    'ja': '入社年'
  },
  'Tahun Keluar': {
    'id': 'Tahun Keluar',
    'en': 'End Year',
    'ja': '退社年'
  },
  'Deskripsi Pekerjaan': {
    'id': 'Deskripsi Pekerjaan',
    'en': 'Job Description',
    'ja': '職務内容'
  },
  
  // Placeholders
  'Contoh: Senior Software Developer': {
    'id': 'Contoh: Senior Software Developer',
    'en': 'Example: Senior Software Developer',
    'ja': '例: シニアソフトウェア開発者'
  },
  'Contoh: PT Tech Innovate Indonesia': {
    'id': 'Contoh: PT Tech Innovate Indonesia',
    'en': 'Example: Tech Innovate Inc.',
    'ja': '例: テックイノベート株式会社'
  },
  'Contoh: 2022': {
    'id': 'Contoh: 2022',
    'en': 'Example: 2022',
    'ja': '例: 2022'
  },
  'Masih bekerja': {
    'id': 'Masih bekerja',
    'en': 'Still working',
    'ja': '在職中'
  },
  'Contoh: 2024': {
    'id': 'Contoh: 2024',
    'en': 'Example: 2024',
    'ja': '例: 2024'
  },
  
  // Checkbox
  'Saya masih bekerja di posisi ini': {
    'id': 'Saya masih bekerja di posisi ini',
    'en': 'I still work in this position',
    'ja': 'この職に現在も就いています'
  },
  
  // Buttons
  'Hapus': {
    'id': 'Hapus',
    'en': 'Delete',
    'ja': '削除'
  },
  'Batal': {
    'id': 'Batal',
    'en': 'Cancel',
    'ja': 'キャンセル'
  },
  'Tambah Pengalaman': {
    'id': 'Tambah Pengalaman',
    'en': 'Add Experience',
    'ja': '経験を追加'
  },
  'Perbarui Data': {
    'id': 'Perbarui Data',
    'en': 'Update Data',
    'ja': 'データを更新'
  },
  'Menyimpan...': {
    'id': 'Menyimpan...',
    'en': 'Saving...',
    'ja': '保存中...'
  },
  
  // Success messages
  'Pengalaman kerja berhasil ditambahkan!': {
    'id': 'Pengalaman kerja berhasil ditambahkan!',
    'en': 'Work experience added successfully!',
    'ja': '職歴が正常に追加されました！'
  },
  'Pengalaman kerja berhasil diperbarui!': {
    'id': 'Pengalaman kerja berhasil diperbarui!',
    'en': 'Work experience updated successfully!',
    'ja': '職歴が正常に更新されました！'
  },
  'Pengalaman kerja berhasil dihapus!': {
    'id': 'Pengalaman kerja berhasil dihapus!',
    'en': 'Work experience deleted successfully!',
    'ja': '職歴が正常に削除されました！'
  },
  
  // Error messages
  'Posisi harus diisi': {
    'id': 'Posisi harus diisi',
    'en': 'Position is required',
    'ja': 'ポジションは必須です'
  },
  'Nama perusahaan harus diisi': {
    'id': 'Nama perusahaan harus diisi',
    'en': 'Company name is required',
    'ja': '会社名は必須です'
  },
  'Tahun masuk harus diisi': {
    'id': 'Tahun masuk harus diisi',
    'en': 'Start year is required',
    'ja': '入社年は必須です'
  },
  'Tahun keluar harus diisi jika bukan pekerjaan saat ini': {
    'id': 'Tahun keluar harus diisi jika bukan pekerjaan saat ini',
    'en': 'End year is required if not current job',
    'ja': '現職でない場合は退社年が必須です'
  },
  'Deskripsi pekerjaan harus diisi': {
    'id': 'Deskripsi pekerjaan harus diisi',
    'en': 'Job description is required',
    'ja': '職務内容は必須です'
  },
  'Tahun masuk tidak valid': {
    'id': 'Tahun masuk tidak valid',
    'en': 'Invalid start year',
    'ja': '無効な入社年'
  },
  'Tahun keluar tidak valid': {
    'id': 'Tahun keluar tidak valid',
    'en': 'Invalid end year',
    'ja': '無効な退社年'
  },
  'Tahun keluar tidak boleh lebih kecil dari tahun masuk': {
    'id': 'Tahun keluar tidak boleh lebih kecil dari tahun masuk',
    'en': 'End year cannot be earlier than start year',
    'ja': '退社年は入社年より前にはできません'
  },
  
  // Delete confirmation
  'Konfirmasi Hapus': {
    'id': 'Konfirmasi Hapus',
    'en': 'Delete Confirmation',
    'ja': '削除の確認'
  },
  'Apakah Anda yakin ingin menghapus pengalaman kerja': {
    'id': 'Apakah Anda yakin ingin menghapus pengalaman kerja',
    'en': 'Are you sure you want to delete the work experience',
    'ja': '職歴を削除してもよろしいですか'
  },
  'di': {
    'id': 'di',
    'en': 'at',
    'ja': 'で'
  },
  'Tindakan ini tidak dapat dibatalkan.': {
    'id': 'Tindakan ini tidak dapat dibatalkan.',
    'en': 'This action cannot be undone.',
    'ja': 'この操作は元に戻せません。'
  },
  'Menghapus...': {
    'id': 'Menghapus...',
    'en': 'Deleting...',
    'ja': '削除中...'
  },
  
  // Character counter
  'karakter': {
    'id': 'karakter',
    'en': 'characters',
    'ja': '文字'
  },
  'Mendekati batas maksimal': {
    'id': 'Mendekati batas maksimal',
    'en': 'Approaching maximum limit',
    'ja': '最大制限に近づいています'
  },
  
  // Job description placeholder
  'Mengembangkan aplikasi web menggunakan Node.js, React, dan MySQL. Bertanggung jawab atas desain database dan implementasi API RESTful...': {
    'id': 'Mengembangkan aplikasi web menggunakan Node.js, React, dan MySQL. Bertanggung jawab atas desain database dan implementasi API RESTful...',
    'en': 'Develop web applications using Node.js, React, and MySQL. Responsible for database design and RESTful API implementation...',
    'ja': 'Node.js、React、MySQLを使用してWebアプリケーションを開発。データベース設計とRESTful API実装を担当...'
  }
};

export default function PengalamanForm({
  mode = "add",
  data,
  onSave,
  onCancel,
  onDelete,
}: PengalamanFormProps) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(languages[0]);
  const [values, setValues] = useState<Pengalaman>({
    id: data?.id || undefined,
    posisi: data?.posisi || "",
    perusahaan: data?.perusahaan || "",
    tahunMasuk: data?.tahunMasuk || "",
    tahunKeluar: data?.tahunKeluar || "",
    deskripsi: data?.deskripsi || "",
    isCurrentJob: data?.isCurrentJob || false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Get translated text
  const getTranslation = (key: string, lang: string): string => {
    return translations[key]?.[lang] || key;
  };

  // Load saved language and listen for language changes
  useEffect(() => {
    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage) {
      const language = languages.find(lang => lang.code === savedLanguage);
      if (language) {
        setCurrentLanguage(language);
      }
    }

    // Listen for language change events from other components
    const handleLanguageChange = (event: CustomEvent) => {
      const language = languages.find(lang => lang.code === event.detail.language);
      if (language) {
        setCurrentLanguage(language);
      }
    };

    window.addEventListener('languageChanged', handleLanguageChange as EventListener);
    
    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange as EventListener);
    };
  }, []);

  // Update form values ketika data prop berubah (untuk mode edit)
  useEffect(() => {
    if (data && mode === "edit") {
      console.log("Updating form values with data:", data);
      setValues({
        id: data.id,
        posisi: data.posisi || "",
        perusahaan: data.perusahaan || "",
        tahunMasuk: data.tahunMasuk || "",
        tahunKeluar: data.tahunKeluar || "",
        deskripsi: data.deskripsi || "",
        isCurrentJob: data.isCurrentJob || false,
      });
    }
  }, [data, mode]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setValues((prev) => ({ 
      ...prev, 
      [name]: type === "checkbox" ? checked : value 
    }));
    
    // Clear tahun keluar jika pekerjaan saat ini dicentang
    if (name === "isCurrentJob" && checked) {
      setValues((prev) => ({ 
        ...prev, 
        isCurrentJob: true,
        tahunKeluar: ""
      }));
    }
    
    // Clear messages when user starts typing
    if (error) setError("");
    if (success) setSuccess("");
  };

  const getToken = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token") || sessionStorage.getItem("token");
    }
    return null;
  };

  // Validasi form data
  const validateFormData = (data: Pengalaman): string | null => {
    const lang = currentLanguage.code;
    
    if (!data.posisi?.trim()) return getTranslation("Posisi harus diisi", lang);
    if (!data.perusahaan?.trim()) return getTranslation("Nama perusahaan harus diisi", lang);
    if (!data.tahunMasuk?.trim()) return getTranslation("Tahun masuk harus diisi", lang);
    if (!data.isCurrentJob && !data.tahunKeluar?.trim()) {
      return getTranslation("Tahun keluar harus diisi jika bukan pekerjaan saat ini", lang);
    }
    if (!data.deskripsi?.trim()) return getTranslation("Deskripsi pekerjaan harus diisi", lang);

    // Validasi tahun
    const tahunMasuk = parseInt(data.tahunMasuk);
    const currentYear = new Date().getFullYear();
    
    if (isNaN(tahunMasuk) || tahunMasuk < 1900 || tahunMasuk > currentYear + 10) {
      return getTranslation("Tahun masuk tidak valid", lang);
    }
    
    if (!data.isCurrentJob && data.tahunKeluar) {
      const tahunKeluar = parseInt(data.tahunKeluar);
      
      if (isNaN(tahunKeluar) || tahunKeluar < 1900 || tahunKeluar > currentYear + 10) {
        return getTranslation("Tahun keluar tidak valid", lang);
      }
      
      if (tahunKeluar < tahunMasuk) {
        return getTranslation("Tahun keluar tidak boleh lebih kecil dari tahun masuk", lang);
      }
    }

    return null;
  };

  // Format payload untuk API
  const formatPayload = (data: Pengalaman) => {
    const payload = {
      company_name: data.perusahaan.trim(),
      position: data.posisi.trim(),
      start_date: `${data.tahunMasuk.trim()}-01-15`, // Format: YYYY-MM-DD
      end_date: data.isCurrentJob ? null : `${data.tahunKeluar.trim()}-12-31`,
      is_current: Boolean(data.isCurrentJob),
      job_description: data.deskripsi.trim(),
    };
    
    console.log("Formatted payload:", payload);
    return payload;
  };

  // POST - Tambah pengalaman kerja baru
  const postWorkExperience = async (data: Pengalaman) => {
    const token = getToken();
    
    if (!token) {
      throw new Error("Token tidak ditemukan. Silakan login kembali.");
    }

    const validationError = validateFormData(data);
    if (validationError) {
      throw new Error(validationError);
    }

    const payload = formatPayload(data);
    console.log("POST Request - URL:", `${process.env.NEXT_PUBLIC_API_URL}/api/profile/work-experience`);
    console.log("POST Request - Payload:", payload);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/profile/work-experience`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      console.log("POST Response status:", response.status);

      const responseText = await response.text();
      console.log("POST Response text:", responseText);
      
      let responseData;
      try {
        responseData = responseText ? JSON.parse(responseText) : {};
      } catch (parseError) {
        console.log("Response is not JSON, treating as text");
        responseData = { message: responseText };
      }

      console.log("POST Response data:", responseData);

      if (!response.ok) {
        const errorMessage = responseData?.message || 
                           responseData?.error || 
                           responseText ||
                           `Server error: ${response.status} ${response.statusText}`;
        throw new Error(errorMessage);
      }

      return responseData;
    } catch (fetchError) {
      console.error("POST Fetch error:", fetchError);
      
      if (fetchError instanceof TypeError && fetchError.message.includes("fetch")) {
        throw new Error("Tidak dapat terhubung ke server. Periksa koneksi internet Anda.");
      }
      
      throw fetchError;
    }
  };

  // PUT - Update pengalaman kerja
  const updateWorkExperience = async (data: Pengalaman) => {
    const token = getToken();
    
    if (!token) {
      throw new Error("Token tidak ditemukan. Silakan login kembali.");
    }

    // Pastikan ID ada untuk update
    if (!data.id) {
      throw new Error("ID pengalaman kerja tidak ditemukan untuk update. Data mungkin belum tersimpan.");
    }

    const validationError = validateFormData(data);
    if (validationError) {
      throw new Error(validationError);
    }

    const payload = formatPayload(data);
    const updateUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/profile/work-experience/${data.id}`;
    
    console.log("PUT Request - URL:", updateUrl);
    console.log("PUT Request - ID:", data.id);
    console.log("PUT Request - Payload:", payload);
    console.log("PUT Request - Headers:", {
      Authorization: `Bearer ${token.substring(0, 20)}...`,
      "Content-Type": "application/json"
    });

    try {
      const response = await fetch(updateUrl, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      console.log("PUT Response status:", response.status);
      console.log("PUT Response headers:", Object.fromEntries(response.headers.entries()));

      const responseText = await response.text();
      console.log("PUT Response text:", responseText);
      
      let responseData;
      try {
        responseData = responseText ? JSON.parse(responseText) : {};
      } catch (parseError) {
        console.log("Response is not JSON, treating as text");
        responseData = { message: responseText };
      }

      console.log("PUT Response data:", responseData);

      if (!response.ok) {
        let errorMessage;
        
        switch (response.status) {
          case 400:
            errorMessage = responseData?.message || "Data yang dikirim tidak valid";
            break;
          case 401:
            errorMessage = "Sesi Anda telah berakhir. Silakan login kembali.";
            break;
          case 403:
            errorMessage = "Anda tidak memiliki izin untuk mengupdate data ini";
            break;
          case 404:
            errorMessage = "Data pengalaman kerja tidak ditemukan";
            break;
          case 422:
            errorMessage = responseData?.message || "Data yang dikirim tidak sesuai format";
            break;
          case 500:
            errorMessage = "Terjadi kesalahan pada server. Silakan coba lagi nanti.";
            break;
          default:
            errorMessage = responseData?.message || 
                          responseData?.error || 
                          responseText ||
                          `Server error: ${response.status} ${response.statusText}`;
        }
        
        throw new Error(errorMessage);
      }

      // Jika response OK tapi kosong, anggap berhasil
      if (!responseData || Object.keys(responseData).length === 0) {
        responseData = { 
          message: "Data berhasil diperbarui",
          data: { id: data.id, ...payload }
        };
      }

      return responseData;
    } catch (fetchError) {
      console.error("PUT Fetch error:", fetchError);
      
      if (fetchError instanceof TypeError && fetchError.message.includes("fetch")) {
        throw new Error("Tidak dapat terhubung ke server. Periksa koneksi internet Anda.");
      }
      
      throw fetchError;
    }
  };

  // DELETE - Hapus pengalaman kerja
  const deleteWorkExperience = async (id: string | number) => {
    const token = getToken();
    
    if (!token) {
      throw new Error("Token tidak ditemukan. Silakan login kembali.");
    }

    if (!id) {
      throw new Error("ID pengalaman kerja tidak ditemukan untuk penghapusan.");
    }

    const deleteUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/profile/work-experience/${id}`;
    console.log("DELETE Request - URL:", deleteUrl);
    console.log("DELETE Request - ID:", id);

    try {
      const response = await fetch(deleteUrl, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("DELETE Response status:", response.status);

      const responseText = await response.text();
      console.log("DELETE Response text:", responseText);
      
      let responseData;
      try {
        responseData = responseText ? JSON.parse(responseText) : {};
      } catch (parseError) {
        console.log("Response is not JSON, treating as text");
        responseData = { message: responseText || "Data berhasil dihapus" };
      }

      console.log("DELETE Response data:", responseData);

      if (!response.ok) {
        const errorMessage = responseData?.message || 
                           responseData?.error || 
                           responseText ||
                           `Server error: ${response.status} ${response.statusText}`;
        throw new Error(errorMessage);
      }

      return responseData;
    } catch (fetchError) {
      console.error("DELETE Fetch error:", fetchError);
      
      if (fetchError instanceof TypeError && fetchError.message.includes("fetch")) {
        throw new Error("Tidak dapat terhubung ke server. Periksa koneksi internet Anda.");
      }
      
      throw fetchError;
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    console.log("=== FORM SUBMIT STARTED ===");
    console.log("Mode:", mode);
    console.log("Current values:", values);
    
    setIsLoading(true);
    setError("");
    setSuccess("");

    // Validasi form terlebih dahulu
    const validationError = validateFormData(values);
    if (validationError) {
      console.log("Validation error:", validationError);
      setError(validationError);
      setIsLoading(false);
      return;
    }

    try {
      let result;
      const lang = currentLanguage.code;
      
      if (mode === "add") {
        console.log("=== EXECUTING POST REQUEST ===");
        result = await postWorkExperience(values);
        console.log("POST result:", result);
        
        setSuccess(getTranslation("Pengalaman kerja berhasil ditambahkan!", lang));
        
        // Reset form setelah berhasil (hanya untuk mode add)
        setValues({
          posisi: "",
          perusahaan: "",
          tahunMasuk: "",
          tahunKeluar: "",
          deskripsi: "",
          isCurrentJob: false,
        });
        
      } else if (mode === "edit") {
        console.log("=== EXECUTING PUT REQUEST ===");
        
        if (!values.id) {
          throw new Error("ID tidak ditemukan untuk update. Pastikan data sudah tersimpan sebelumnya.");
        }
        
        result = await updateWorkExperience(values);
        console.log("PUT result:", result);
        
        setSuccess(getTranslation("Pengalaman kerja berhasil diperbarui!", lang));
      }

      // Panggil callback onSave jika ada
      if (onSave) {
        // Untuk mode add, gunakan ID dari response jika ada
        // Untuk mode edit, gunakan data yang sudah ada
        const savedData = mode === "add" && result?.data?.id 
          ? { ...values, id: result.data.id }
          : values;
          
        console.log("Calling onSave with data:", savedData);
        onSave(savedData);
      }

      // Auto hide success message after 3 seconds
      setTimeout(() => {
        setSuccess("");
      }, 3000);
        
    } catch (err) {
      console.error("=== SUBMIT ERROR ===", err);
      const errorMessage = err instanceof Error ? err.message : "Terjadi kesalahan yang tidak diketahui";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
      console.log("=== FORM SUBMIT COMPLETED ===");
    }
  };

  const handleDelete = async () => {
    if (!values.id) {
      setError("ID tidak ditemukan untuk penghapusan");
      return;
    }

    setIsDeleting(true);
    setError("");
    setSuccess("");

    try {
      console.log("=== EXECUTING DELETE REQUEST ===");
      const result = await deleteWorkExperience(values.id);
      console.log("DELETE result:", result);
      
      const lang = currentLanguage.code;
      setSuccess(getTranslation("Pengalaman kerja berhasil dihapus!", lang));
      
      // Panggil callback onDelete jika ada
      if (onDelete) onDelete(values.id);
      
      // Auto hide success message dan close modal
      setTimeout(() => {
        setSuccess("");
        setShowDeleteConfirm(false);
        if (onCancel) onCancel(); // Close form after successful delete
      }, 1500);
      
    } catch (err) {
      console.error("=== DELETE ERROR ===", err);
      const errorMessage = err instanceof Error ? err.message : "Terjadi kesalahan saat menghapus data";
      setError(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  const lang = currentLanguage.code;

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 border border-gray-300 rounded-lg p-4 bg-white shadow-sm"
      >
        {/* Header */}
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium text-gray-800">
            {mode === "add" 
              ? getTranslation("Tambah Pengalaman Kerja", lang) 
              : getTranslation("Edit Pengalaman Kerja", lang)
            }
          </h3>
          {mode === "edit" && values.id && (
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              disabled={isLoading || isDeleting}
              className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 
                transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {getTranslation("Hapus", lang)}
            </button>
          )}
        </div>

        {/* Success Message */}
        {success && (
          <div className="text-green-600 text-xs bg-green-50 border border-green-200 rounded p-2 flex items-center gap-2">
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {success}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="text-red-600 text-xs bg-red-50 border border-red-200 rounded p-2 flex items-center gap-2">
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        {/* Form Fields */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              {getTranslation("Posisi", lang)} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="posisi"
              value={values.posisi}
              onChange={handleChange}
              disabled={isLoading || isDeleting}
              className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs 
                focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent
                disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
              placeholder={getTranslation("Contoh: Senior Software Developer", lang)}
              maxLength={100}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              {getTranslation("Nama Perusahaan", lang)} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="perusahaan"
              value={values.perusahaan}
              onChange={handleChange}
              disabled={isLoading || isDeleting}
              className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs 
                focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent
                disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
              placeholder={getTranslation("Contoh: PT Tech Innovate Indonesia", lang)}
              maxLength={100}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              {getTranslation("Tahun Masuk", lang)} <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="tahunMasuk"
              value={values.tahunMasuk}
              onChange={handleChange}
              disabled={isLoading || isDeleting}
              min="1900"
              max={new Date().getFullYear() + 10}
              className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs 
                focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent
                disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
              placeholder={getTranslation("Contoh: 2022", lang)}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              {getTranslation("Tahun Keluar", lang)} {!values.isCurrentJob && <span className="text-red-500">*</span>}
            </label>
            <input
              type="number"
              name="tahunKeluar"
              value={values.tahunKeluar}
              onChange={handleChange}
              disabled={isLoading || isDeleting || values.isCurrentJob}
              min="1900"
              max={new Date().getFullYear() + 10}
              className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs 
                focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent
                disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
              placeholder={values.isCurrentJob ? getTranslation("Masih bekerja", lang) : getTranslation("Contoh: 2024", lang)}
            />
          </div>
        </div>

        <div>
          <label className="flex items-center text-xs text-gray-600 cursor-pointer hover:text-blue-600 transition-colors">
            <input
              type="checkbox"
              name="isCurrentJob"
              checked={values.isCurrentJob}
              onChange={handleChange}
              disabled={isLoading || isDeleting}
              className="mr-2 h-3 w-3 text-blue-600 focus:ring-blue-400 border-gray-300 rounded
                disabled:cursor-not-allowed"
            />
            <span className={values.isCurrentJob ? "text-blue-600 font-medium" : ""}>
              {getTranslation("Saya masih bekerja di posisi ini", lang)}
            </span>
          </label>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 pb-1">
            {getTranslation("Deskripsi Pekerjaan", lang)} <span className="text-red-500">*</span>
          </label>
          <textarea
            name="deskripsi"
            value={values.deskripsi}
            onChange={handleChange}
            disabled={isLoading || isDeleting}
            className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs 
              focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none
              disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
            rows={4}
            placeholder={getTranslation("Mengembangkan aplikasi web menggunakan Node.js, React, dan MySQL. Bertanggung jawab atas desain database dan implementasi API RESTful...", lang)}
            maxLength={500}
            required
          />
          <div className="text-xs text-gray-400 mt-1 flex justify-between">
            <span>{values.deskripsi.length}/500 {getTranslation("karakter", lang)}</span>
            {values.deskripsi.length > 450 && (
              <span className="text-orange-500">{getTranslation("Mendekati batas maksimal", lang)}</span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading || isDeleting}
            className="px-4 py-1.5 text-xs bg-gray-400 text-white rounded 
              hover:bg-gray-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {getTranslation("Batal", lang)}
          </button>
          <button
            type="submit"
            disabled={isLoading || isDeleting || (mode === "edit" && !values.id)}
            className="px-4 py-1.5 text-xs bg-blue-600 text-white rounded 
              hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed
              flex items-center gap-1 min-w-[120px] justify-center"
          >
            {isLoading && (
              <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            )}
            {isLoading
              ? getTranslation("Menyimpan...", lang)
              : mode === "add"
              ? getTranslation("Tambah Pengalaman", lang)
              : getTranslation("Perbarui Data", lang)}
          </button>
        </div>

        {/* Debug Info */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 p-2 bg-gray-50 rounded text-xs text-gray-500 border-t">
            <p>Debug: Mode = {mode}, ID = {values.id || 'none'}</p>
            <p>Current Job: {values.isCurrentJob ? 'Ya' : 'Tidak'}</p>
            <p>Token: {getToken() ? 'Ada' : 'Tidak ada'}</p>
            <p>Submit Disabled: {mode === "edit" && !values.id ? 'Ya (No ID)' : 'Tidak'}</p>
          </div>
        )}
      </form>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd" />
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 012 0v4a1 1 0 11-2 0V7zM8 13a1 1 0 112 0 1 1 0 01-2 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h4 className="text-lg font-medium text-gray-800">
                {getTranslation("Konfirmasi Hapus", lang)}
              </h4>
            </div>
            
            <p className="text-sm text-gray-600 mb-6">
              {getTranslation("Apakah Anda yakin ingin menghapus pengalaman kerja", lang)} <span className="font-semibold">&quot;{values.posisi}&quot;</span> {getTranslation("di", lang)} <span className="font-semibold">&quot;{values.perusahaan}&quot;</span>? 
              <br />
              <span className="font-medium text-red-600 mt-2 block">{getTranslation("Tindakan ini tidak dapat dibatalkan.", lang)}</span>
            </p>
            
            {error && (
              <div className="text-red-600 text-xs bg-red-50 border border-red-200 rounded p-2 mb-4 flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            {success && (
              <div className="text-green-600 text-xs bg-green-50 border border-green-200 rounded p-2 mb-4 flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {success}
              </div>
            )}

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setError("");
                  setSuccess("");
                }}
                disabled={isDeleting}
                className="px-4 py-2 text-sm bg-gray-400 text-white rounded 
                  hover:bg-gray-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {getTranslation("Batal", lang)}
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-sm bg-red-500 text-white rounded 
                  hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                  flex items-center gap-1 min-w-[80px] justify-center"
              >
                {isDeleting && (
                  <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                )}
                {isDeleting ? getTranslation("Menghapus...", lang) : getTranslation("Hapus", lang)}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}