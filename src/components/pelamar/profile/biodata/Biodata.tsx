"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

type User = {
  full_name: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  date_of_birth?: string | null;
  profile_photo?: string | null;
  profile_photo_url?: string | null;
};

type Props = {
  user: User;
  isEditing: boolean;
  onCancel: () => void;
  onSaveSuccess: (updated: Partial<User>) => void;
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
  { code: "id", name: "Indonesia", flag: "🇮🇩" },
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
];

// Translation mappings untuk form biodata
const translations: TranslationSet = {
  // Labels
  "Nama Lengkap": {
    id: "Nama Lengkap",
    en: "Full Name",
    ja: "フルネーム",
  },
  Email: {
    id: "Email",
    en: "Email",
    ja: "メール",
  },
  "Nomor Telepon": {
    id: "Nomor Telepon",
    en: "Phone Number",
    ja: "電話番号",
  },
  "Tanggal Lahir": {
    id: "Tanggal Lahir",
    en: "Date of Birth",
    ja: "生年月日",
  },
  Alamat: {
    id: "Alamat",
    en: "Address",
    ja: "住所",
  },
  Kota: {
    id: "Kota",
    en: "City",
    ja: "市",
  },
  Negara: {
    id: "Negara",
    en: "Country",
    ja: "国",
  },
  "Foto Profil": {
    id: "Foto Profil",
    en: "Profile Photo",
    ja: "プロフィール写真",
  },

  // Placeholders
  "Masukkan nama lengkap": {
    id: "Masukkan nama lengkap",
    en: "Enter full name",
    ja: "フルネームを入力してください",
  },
  "Email tidak dapat diubah": {
    id: "Email tidak dapat diubah",
    en: "Email cannot be changed",
    ja: "メールは変更できません",
  },
  "Contoh: +62 812-3456-7890": {
    id: "Contoh: +62 812-3456-7890",
    en: "Example: +1 234-567-8900",
    ja: "例: +81 90-1234-5678",
  },
  "Masukkan alamat lengkap": {
    id: "Masukkan alamat lengkap",
    en: "Enter complete address",
    ja: "完全な住所を入力してください",
  },
  "Masukkan nama kota": {
    id: "Masukkan nama kota",
    en: "Enter city name",
    ja: "市名を入力してください",
  },
  "Masukkan nama negara": {
    id: "Masukkan nama negara",
    en: "Enter country name",
    ja: "国名を入力してください",
  },
  "Tanggal lahir belum diatur": {
    id: "Tanggal lahir belum diatur",
    en: "Date of birth not set",
    ja: "生年月日が設定されていません",
  },

  // Messages
  "Format: JPG, PNG, GIF. Maksimal 5MB": {
    id: "Format: JPG, PNG, GIF. Maksimal 5MB",
    en: "Format: JPG, PNG, GIF. Maximum 5MB",
    ja: "フォーマット: JPG、PNG、GIF。最大5MB",
  },
  "Tanggal lahir tidak dapat diubah": {
    id: "Tanggal lahir tidak dapat diubah",
    en: "Date of birth cannot be changed",
    ja: "生年月日は変更できません",
  },
  "Format tampilan": {
    id: "Format tampilan",
    en: "Display format",
    ja: "表示形式",
  },
  "Format lengkap": {
    id: "Format lengkap",
    en: "Full format",
    ja: "完全な形式",
  },
  "File baru": {
    id: "File baru",
    en: "New file",
    ja: "新しいファイル",
  },
  Ukuran: {
    id: "Ukuran",
    en: "Size",
    ja: "サイズ",
  },
  Tipe: {
    id: "Tipe",
    en: "Type",
    ja: "タイプ",
  },
  "Foto saat ini": {
    id: "Foto saat ini",
    en: "Current photo",
    ja: "現在の写真",
  },

  // Buttons
  "Simpan Perubahan": {
    id: "💾 Simpan Perubahan",
    en: "💾 Save Changes",
    ja: "💾 変更を保存",
  },
  "Menyimpan...": {
    id: "Menyimpan...",
    en: "Saving...",
    ja: "保存中...",
  },
  Batal: {
    id: "Batal",
    en: "Cancel",
    ja: "キャンセル",
  },
  "Hapus foto": {
    id: "Hapus foto",
    en: "Remove photo",
    ja: "写真を削除",
  },

  // Upload progress
  "Upload foto": {
    id: "Upload foto",
    en: "Upload photo",
    ja: "写真をアップロード",
  },

  // Error messages
  "Nama lengkap tidak boleh kosong": {
    id: "Nama lengkap tidak boleh kosong",
    en: "Full name cannot be empty",
    ja: "フルネームは空にできません",
  },
  "Email tidak boleh kosong": {
    id: "Email tidak boleh kosong",
    en: "Email cannot be empty",
    ja: "メールは空にできません",
  },
  "Format email tidak valid": {
    id: "Format email tidak valid",
    en: "Invalid email format",
    ja: "無効なメール形式",
  },
  "Format nomor telepon tidak valid": {
    id: "Format nomor telepon tidak valid",
    en: "Invalid phone number format",
    ja: "無効な電話番号形式",
  },
  "Tanggal lahir tidak boleh di masa depan": {
    id: "Tanggal lahir tidak boleh di masa depan",
    en: "Date of birth cannot be in the future",
    ja: "生年月日は未来にできません",
  },
  "Usia minimal 17 tahun": {
    id: "Usia minimal 17 tahun",
    en: "Minimum age 17 years",
    ja: "最低年齢17歳",
  },
  "File yang dipilih harus berupa gambar": {
    id: "File yang dipilih harus berupa gambar",
    en: "Selected file must be an image",
    ja: "選択したファイルは画像である必要があります",
  },
  "Ukuran file tidak boleh lebih dari 5MB": {
    id: "Ukuran file tidak boleh lebih dari 5MB",
    en: "File size cannot exceed 5MB",
    ja: "ファイルサイズは5MBを超えることはできません",
  },

  // Success messages
  "Biodata berhasil diperbarui!": {
    id: "✅ Biodata berhasil diperbarui!",
    en: "✅ Profile data updated successfully!",
    ja: "✅ プロフィールデータが正常に更新されました！",
  },

  // Token & Auth errors
  "Token tidak ditemukan": {
    id: "⚠️ Sesi tidak ditemukan, silakan login ulang",
    en: "⚠️ Session not found, please login again",
    ja: "⚠️ セッションが見つかりません。再度ログインしてください",
  },
  "Token expired": {
    id: "⚠️ Sesi telah berakhir, silakan login ulang",
    en: "⚠️ Session expired, please login again",
    ja: "⚠️ セッションの有効期限が切れました。再度ログインしてください",
  },
  "Gagal memuat data": {
    id: "❌ Gagal memuat tanggal lahir dari server",
    en: "❌ Failed to load date of birth from server",
    ja: "❌ サーバーから生年月日を読み込めませんでした",
  },
};

export default function Biodata({ user, isEditing, onCancel, onSaveSuccess }: Props) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(languages[0]);
  const [formData, setFormData] = useState<User>({
    full_name: user.full_name || "",
    email: user.email || "",
    phone: user.phone || "",
    address: user.address || "",
    city: user.city || "",
    country: user.country || "",
    date_of_birth: user.date_of_birth || "",
    profile_photo: user.profile_photo || "",
    profile_photo_url: user.profile_photo_url || "",
  });

  const [loading, setLoading] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [tokenValid, setTokenValid] = useState<boolean>(true);

  // Get translated text
  const getTranslation = (key: string, lang: string): string => {
    return translations[key]?.[lang] || key;
  };

  // Listen for language changes from Header
  useEffect(() => {
    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem("selectedLanguage");
    if (savedLanguage) {
      const language = languages.find((lang) => lang.code === savedLanguage);
      if (language) {
        setCurrentLanguage(language);
      }
    }

    // Listen for language change events from Header component
    const handleLanguageChange = (event: CustomEvent) => {
      const language = languages.find((lang) => lang.code === event.detail.language);
      if (language) {
        setCurrentLanguage(language);
      }
    };

    window.addEventListener("languageChanged", handleLanguageChange as EventListener);

    return () => {
      window.removeEventListener("languageChanged", handleLanguageChange as EventListener);
    };
  }, []);

  // 🔧 Validasi token sebelum melakukan request
  const validateToken = (): string | null => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      console.error("❌ Token tidak ditemukan di localStorage");
      setTokenValid(false);
      return null;
    }

    // Basic token format validation
    if (token.length < 20) {
      console.error("❌ Token format tidak valid (terlalu pendek)");
      setTokenValid(false);
      return null;
    }

    console.log("✅ Token ditemukan:", token.substring(0, 30) + "...");
    setTokenValid(true);
    return token;
  };

  // 🔧 Format date dari API (ISO format) ke format tampilan mm/dd/yyyy
  const formatDateForDisplay = (dateString: string | null): string => {
    if (!dateString) return "";

    try {
      // Handle ISO date format from API (2003-01-31T17:00:00.000Z)
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "";

      // Format to mm/dd/yyyy for display
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const year = date.getFullYear();

      return `${month}/${day}/${year}`;
    } catch (error) {
      console.error("Error formatting date for display:", error);
      return "";
    }
  };

  // 🔧 Format date untuk tampilan lengkap (berdasarkan bahasa)
  const formatDateLong = (dateString: string | null): string => {
    if (!dateString) return "";

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "";

      // Format berdasarkan bahasa yang dipilih
      let locale = "id-ID";
      if (currentLanguage.code === "en") locale = "en-US";
      if (currentLanguage.code === "ja") locale = "ja-JP";

      return date.toLocaleDateString(locale, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      console.error("Error formatting long date:", error);
      return "";
    }
  };

  // 🔧 Fetch date_of_birth dari API profile dengan error handling lengkap
  const fetchDateOfBirthFromAPI = async (): Promise<string | null> => {
    try {
      console.log("🔍 Memulai fetch date_of_birth dari API...");
      
      // Validasi token terlebih dahulu
      const token = validateToken();
      if (!token) {
        console.warn("⚠️ Tidak dapat fetch DOB: Token tidak valid");
        return null;
      }

      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/profile`;
      console.log("📡 Fetching dari:", apiUrl);

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        credentials: "include", // Include cookies if needed
      });

      console.log("📊 Response status:", response.status);
      console.log("📊 Response headers:", Object.fromEntries(response.headers.entries()));

      // Handle 401 Unauthorized secara spesifik
      if (response.status === 401) {
        console.error("❌ 401 Unauthorized - Token expired atau invalid");
        setTokenValid(false);
        
        // Optional: Tampilkan peringatan ke user
        const warningMessage = getTranslation("Token expired", currentLanguage.code);
        console.warn(warningMessage);
        
        // Jangan throw error, biarkan komponen tetap berfungsi
        return null;
      }

      // Handle error status lainnya
      if (!response.ok) {
        console.error(`❌ HTTP Error ${response.status}: ${response.statusText}`);
        
        // Coba parse error message dari response
        try {
          const errorData = await response.json();
          console.error("❌ Error detail:", errorData);
        } catch (parseError) {
          console.error("❌ Tidak dapat parse error response");
        }
        
        return null;
      }

      // Parse response
      const data = await response.json();
      console.log("✅ API Response berhasil:", JSON.stringify(data, null, 2));

      // Validasi struktur response
      if (!data) {
        console.warn("⚠️ Response kosong dari API");
        return null;
      }

      // Check berbagai kemungkinan struktur response
      let dateOfBirth: string | null = null;

      if (data.success && data.data && data.data.date_of_birth) {
        dateOfBirth = data.data.date_of_birth;
      } else if (data.date_of_birth) {
        dateOfBirth = data.date_of_birth;
      } else if (data.user && data.user.date_of_birth) {
        dateOfBirth = data.user.date_of_birth;
      }

      if (dateOfBirth) {
        console.log("✅ Date of birth ditemukan:", dateOfBirth);
        return dateOfBirth;
      } else {
        console.warn("⚠️ Date of birth tidak ditemukan dalam response API");
        console.warn("⚠️ Response structure:", Object.keys(data));
        return null;
      }

    } catch (error) {
      // Network error atau parsing error
      console.error("❌ Error saat fetch date of birth:", error);
      
      if (error instanceof TypeError && error.message.includes("fetch")) {
        console.error("❌ Network error - Tidak dapat terhubung ke server");
      } else {
        console.error("❌ Unexpected error:", error);
      }
      
      // Jangan throw error, biarkan komponen tetap berfungsi
      return null;
    }
  };

  // 🔧 Initialize form data ketika user data berubah
  useEffect(() => {
    const initializeFormData = async () => {
      console.log("🔄 Initializing form data...");
      console.log("👤 User props:", user);

      // Gunakan profile_photo_url jika ada, jika tidak gunakan profile_photo
      const initialPhotoUrl = user.profile_photo_url || user.profile_photo || null;
      setPhotoPreview(initialPhotoUrl);

      // Prioritas pengambilan date_of_birth:
      // 1. Dari props user (jika sudah ada)
      // 2. Dari API (jika props kosong DAN token valid)
      let dateOfBirth = user.date_of_birth;
      
      if (!dateOfBirth) {
        console.log("📅 Date of birth kosong di props, mencoba fetch dari API...");
        
        // Validasi token dulu sebelum fetch
        const token = validateToken();
        if (token) {
          dateOfBirth = await fetchDateOfBirthFromAPI();
          
          if (dateOfBirth) {
            console.log("✅ Berhasil fetch DOB dari API:", dateOfBirth);
          } else {
            console.warn("⚠️ Gagal fetch DOB dari API atau DOB tidak tersedia");
          }
        } else {
          console.warn("⚠️ Skip fetch DOB: Token tidak valid");
        }
      } else {
        console.log("✅ Date of birth sudah ada di props:", dateOfBirth);
      }

      // Set form data
      setFormData({
        full_name: user.full_name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        city: user.city || "",
        country: user.country || "",
        date_of_birth: dateOfBirth || "",
        profile_photo: user.profile_photo || "",
        profile_photo_url: user.profile_photo_url || "",
      });

      console.log("✅ Form data initialized");
    };

    initializeFormData();
  }, [user]);

  // 🔧 Clear errors ketika mode editing berubah
  useEffect(() => {
    if (!isEditing) {
      setErrors({});
      setPhotoFile(null);
    }
  }, [isEditing]);

  /** ✅ Validasi form data */
  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.full_name.trim()) {
      newErrors.full_name = getTranslation("Nama lengkap tidak boleh kosong", currentLanguage.code);
    }

    if (!formData.email.trim()) {
      newErrors.email = getTranslation("Email tidak boleh kosong", currentLanguage.code);
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = getTranslation("Format email tidak valid", currentLanguage.code);
    }

    if (formData.phone && !/^[0-9\-\+\(\)\s]+$/.test(formData.phone)) {
      newErrors.phone = getTranslation("Format nomor telepon tidak valid", currentLanguage.code);
    }

    // Validasi tanggal lahir (opsional) - hanya jika ada perubahan
    if (formData.date_of_birth && formData.date_of_birth !== user.date_of_birth) {
      const birthDate = new Date(formData.date_of_birth);
      const today = new Date();

      if (birthDate > today) {
        newErrors.date_of_birth = getTranslation("Tanggal lahir tidak boleh di masa depan", currentLanguage.code);
      }

      // Validasi usia minimal (contoh: minimal 17 tahun)
      const minAgeDate = new Date();
      minAgeDate.setFullYear(today.getFullYear() - 17);

      if (birthDate > minAgeDate) {
        newErrors.date_of_birth = getTranslation("Usia minimal 17 tahun", currentLanguage.code);
      }
    }

    if (photoFile && !photoFile.type.startsWith("image/")) {
      newErrors.photo = getTranslation("File yang dipilih harus berupa gambar", currentLanguage.code);
    }

    if (photoFile && photoFile.size > 5 * 1024 * 1024) {
      newErrors.photo = getTranslation("Ukuran file tidak boleh lebih dari 5MB", currentLanguage.code);
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /** ✅ Update input text */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Jangan izinkan perubahan untuk date_of_birth
    if (name === "date_of_birth") {
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear specific error ketika user mulai mengetik
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  /** ✅ Handle photo selection */
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    if (!file) {
      setPhotoFile(null);
      setPhotoPreview(user.profile_photo_url || user.profile_photo || null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, photo: getTranslation("File yang dipilih harus berupa gambar", currentLanguage.code) }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, photo: getTranslation("Ukuran file tidak boleh lebih dari 5MB", currentLanguage.code) }));
      return;
    }

    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.photo;
      return newErrors;
    });

    setPhotoFile(file);

    const tempUrl = URL.createObjectURL(file);
    setPhotoPreview(tempUrl);
  };

  /** ✅ Remove photo selection */
  const handleRemovePhoto = () => {
    if (photoFile && photoPreview && photoPreview.startsWith("blob:")) {
      URL.revokeObjectURL(photoPreview);
    }

    setPhotoFile(null);
    setPhotoPreview(user.profile_photo_url || user.profile_photo || null);

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }

    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.photo;
      return newErrors;
    });
  };

  /** ✅ Upload photo ke server dengan validasi token */
  const uploadPhoto = async (token: string): Promise<string | null> => {
    if (!photoFile) return null;

    try {
      console.log("📤 Memulai upload foto...");
      setUploadProgress(0);

      const formDataImg = new FormData();
      formDataImg.append("profile_photo", photoFile);

      const xhr = new XMLHttpRequest();

      return new Promise((resolve, reject) => {
        xhr.upload.addEventListener("progress", (e) => {
          if (e.lengthComputable) {
            const progress = Math.round((e.loaded / e.total) * 100);
            setUploadProgress(progress);
            console.log(`📊 Upload progress: ${progress}%`);
          }
        });

        xhr.onload = () => {
          setUploadProgress(100);
          console.log("📥 Upload response status:", xhr.status);

          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const response = JSON.parse(xhr.responseText);
              console.log("✅ Upload response:", response);

              const photoUrl = response.url || 
                               response.profile_photo_url || 
                               response.data?.url || 
                               response.data?.profile_photo_url || 
                               (response.filename ? `${process.env.NEXT_PUBLIC_API_URL}/uploads/images/${response.filename}` : null);

              if (photoUrl) {
                console.log("✅ Photo URL ditemukan:", photoUrl);
                resolve(photoUrl);
              } else {
                console.error("❌ URL foto tidak ditemukan dalam response:", response);
                reject(new Error("URL foto tidak ditemukan dalam response server"));
              }
            } catch (parseError) {
              console.error("❌ Error parsing upload response:", parseError);
              reject(new Error("Response server tidak valid"));
            }
          } else if (xhr.status === 401) {
            console.error("❌ 401 Unauthorized saat upload foto");
            setTokenValid(false);
            reject(new Error("Sesi telah berakhir. Silakan login ulang."));
          } else {
            try {
              const errorResponse = JSON.parse(xhr.responseText);
              console.error("❌ Upload error response:", errorResponse);
              reject(new Error(errorResponse.message || `Upload gagal dengan status: ${xhr.status}`));
            } catch {
              reject(new Error(`Upload failed with status: ${xhr.status}`));
            }
          }
        };

        xhr.onerror = () => {
          console.error("❌ Network error saat upload foto");
          reject(new Error("Koneksi gagal saat upload foto"));
        };

        const uploadUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/profile/upload-photo`;
        console.log("📤 Upload URL:", uploadUrl);

        xhr.open("POST", uploadUrl);
        xhr.setRequestHeader("Authorization", `Bearer ${token}`);
        xhr.send(formDataImg);
      });
    } catch (error) {
      console.error("❌ Error dalam uploadPhoto:", error);
      throw new Error("Gagal upload foto: " + (error as Error).message);
    }
  };

  /** ✅ Save biodata dan photo dengan validasi token */
  const handleSave = async () => {
    console.log("💾 Memulai proses save...");

    if (!validateForm()) {
      console.log("❌ Form validation gagal:", errors);
      return;
    }

    // Validasi token sebelum save
    const token = validateToken();
    if (!token) {
      alert(getTranslation("Token tidak ditemukan", currentLanguage.code));
      return;
    }

    try {
      setLoading(true);
      setUploadProgress(0);

      // 1️⃣ Format data untuk dikirim ke server - date_of_birth TIDAK diubah
      const cleanFormData: Partial<User> = {
        full_name: formData.full_name || undefined,
        email: formData.email || undefined,
        phone: formData.phone || undefined,
        address: formData.address || undefined,
        city: formData.city || undefined,
        country: formData.country || undefined,
        profile_photo: formData.profile_photo || undefined,
      };

      // Hapus property yang undefined
      Object.keys(cleanFormData).forEach((key) => {
        if (cleanFormData[key as keyof User] === undefined) {
          delete cleanFormData[key as keyof User];
        }
      });

      console.log("📝 Data yang akan disimpan:", cleanFormData);

      // 2️⃣ Update biodata ke endpoint PUT
      const biodataUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/profile/biodata`;
      console.log("📡 PUT request ke:", biodataUrl);

      const res = await fetch(biodataUrl, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(cleanFormData),
      });

      console.log("📊 Biodata update status:", res.status);

      if (res.status === 401) {
        console.error("❌ 401 Unauthorized saat update biodata");
        setTokenValid(false);
        throw new Error(getTranslation("Token expired", currentLanguage.code));
      }

      const biodataResponse = await res.json();
      console.log("📝 Biodata response:", biodataResponse);

      if (!res.ok) {
        throw new Error(biodataResponse.message || "Gagal update biodata");
      }

      // 3️⃣ Upload photo jika dipilih
      let photoUrl: string | null = null;
      if (photoFile) {
        try {
          photoUrl = await uploadPhoto(token);
          console.log("✅ Photo uploaded successfully:", photoUrl);
        } catch (photoError) {
          console.error("❌ Photo upload failed:", photoError);
          throw new Error("Biodata berhasil disimpan, tetapi gagal upload foto: " + (photoError as Error).message);
        }
      }

      // 4️⃣ Update final data dengan photo URL jika diupload
      const finalData: Partial<User> = { ...cleanFormData };
      if (photoUrl) {
        finalData.profile_photo_url = photoUrl;

        setFormData((prev) => ({
          ...prev,
          profile_photo_url: photoUrl,
        }));

        setPhotoPreview(photoUrl);
        setPhotoFile(null);

        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput) {
          fileInput.value = "";
        }
      }

      console.log("✅ Save completed successfully:", finalData);

      alert(getTranslation("Biodata berhasil diperbarui!", currentLanguage.code));
      onSaveSuccess(finalData);
      window.location.reload();
      
    } catch (err) {
      console.error("❌ Save error:", err);
      const errorMessage = (err as Error).message || "Terjadi kesalahan server";
      alert(`❌ ${errorMessage}`);
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  /** ✅ Cancel editing */
  const handleCancel = () => {
    console.log("🔄 Cancel editing...");

    setFormData({
      full_name: user.full_name || "",
      email: user.email || "",
      phone: user.phone || "",
      address: user.address || "",
      city: user.city || "",
      country: user.country || "",
      date_of_birth: user.date_of_birth || "",
      profile_photo: user.profile_photo || "",
      profile_photo_url: user.profile_photo_url || "",
    });

    if (photoFile && photoPreview && photoPreview.startsWith("blob:")) {
      URL.revokeObjectURL(photoPreview);
    }
    setPhotoFile(null);
    setPhotoPreview(user.profile_photo_url || user.profile_photo || null);

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }

    setErrors({});
    setUploadProgress(0);

    onCancel();
  };

  return (
    <div className="space-y-4">
      {/* Token Warning - Tampilkan jika token tidak valid */}
      {!tokenValid && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                {getTranslation("Token expired", currentLanguage.code)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Progress bar untuk photo upload */}
      {loading && uploadProgress > 0 && uploadProgress < 100 && (
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
          <p className="text-sm text-gray-600 mt-1">
            {getTranslation("Upload foto", currentLanguage.code)}: {uploadProgress}%
          </p>
        </div>
      )}

      <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Nama Lengkap */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {getTranslation("Nama Lengkap", currentLanguage.code)} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            disabled={!isEditing}
            className={`w-full border rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 ${errors.full_name ? "border-red-500" : "border-gray-300"}`}
            placeholder={getTranslation("Masukkan nama lengkap", currentLanguage.code)}
          />
          {errors.full_name && <p className="text-red-500 text-sm mt-1">{errors.full_name}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {getTranslation("Email", currentLanguage.code)} <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            disabled
            className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 bg-gray-100 cursor-not-allowed"
            placeholder={getTranslation("Email tidak dapat diubah", currentLanguage.code)}
          />
          <p className="text-xs text-gray-500 mt-1">{getTranslation("Email tidak dapat diubah", currentLanguage.code)}</p>
        </div>

        {/* Nomor Telepon */}
        <div>
          <label className="block text-sm font-medium text-gray-700">{getTranslation("Nomor Telepon", currentLanguage.code)}</label>
          <input
            type="text"
            name="phone"
            value={formData.phone ?? ""}
            onChange={handleChange}
            disabled={!isEditing}
            className={`w-full border rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 ${errors.phone ? "border-red-500" : "border-gray-300"}`}
            placeholder={getTranslation("Contoh: +62 812-3456-7890", currentLanguage.code)}
          />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
        </div>

        {/* Tanggal Lahir - TIDAK BISA DIUBAH */}
        <div>
          <label className="block text-sm font-medium text-gray-700">{getTranslation("Tanggal Lahir", currentLanguage.code)}</label>
          <div className="relative">
            {/* Input tersembunyi untuk menyimpan value */}
            <input type="hidden" name="date_of_birth" value={formData.date_of_birth || ""} />
            {/* Display-only field */}
            <div className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 bg-gray-100 cursor-not-allowed min-h-[42px] flex items-center">
              {formData.date_of_birth ? <span className="text-gray-700">{formatDateForDisplay(formData.date_of_birth)}</span> : <span className="text-gray-400">{getTranslation("Tanggal lahir belum diatur", currentLanguage.code)}</span>}
            </div>
          </div>

          {/* Informasi tambahan tentang tanggal lahir */}
          {formData.date_of_birth && (
            <div className="text-xs text-gray-500 mt-1 space-y-1">
              <p>
                <strong>{getTranslation("Format tampilan", currentLanguage.code)}:</strong> {formatDateForDisplay(formData.date_of_birth)} (mm/dd/yyyy)
              </p>
              <p>
                <strong>{getTranslation("Format lengkap", currentLanguage.code)}:</strong> {formatDateLong(formData.date_of_birth)}
              </p>
              <p className="text-blue-600 font-medium">{getTranslation("Tanggal lahir tidak dapat diubah", currentLanguage.code)}</p>
            </div>
          )}
        </div>

        {/* Alamat */}
        <div>
          <label className="block text-sm font-medium text-gray-700">{getTranslation("Alamat", currentLanguage.code)}</label>
          <input
            type="text"
            name="address"
            value={formData.address ?? ""}
            onChange={handleChange}
            disabled={!isEditing}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            placeholder={getTranslation("Masukkan alamat lengkap", currentLanguage.code)}
          />
        </div>

        {/* Kota */}
        <div>
          <label className="block text-sm font-medium text-gray-700">{getTranslation("Kota", currentLanguage.code)}</label>
          <input
            type="text"
            name="city"
            value={formData.city ?? ""}
            onChange={handleChange}
            disabled={!isEditing}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            placeholder={getTranslation("Masukkan nama kota", currentLanguage.code)}
          />
        </div>

        {/* Negara */}
        <div>
          <label className="block text-sm font-medium text-gray-700">{getTranslation("Negara", currentLanguage.code)}</label>
          <input
            type="text"
            name="country"
            value={formData.country ?? ""}
            onChange={handleChange}
            disabled={!isEditing}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            placeholder={getTranslation("Masukkan nama negara", currentLanguage.code)}
          />
        </div>

        {/* Upload Foto */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">{getTranslation("Foto Profil", currentLanguage.code)}</label>
          <div className="mt-1">
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              disabled={!isEditing}
              className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 ${errors.photo ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.photo && <p className="text-red-500 text-sm mt-1">{errors.photo}</p>}
            <p className="text-xs text-gray-500 mt-1">{getTranslation("Format: JPG, PNG, GIF. Maksimal 5MB", currentLanguage.code)}</p>
          </div>

          {/* Photo Preview */}
          {photoPreview && (
            <div className="mt-4 flex items-start space-x-4">
              <div className="relative">
                <div className="w-32 h-32 relative">
                  <Image
                    src={photoPreview}
                    alt="Preview Foto Profil"
                    fill
                    className="object-cover rounded-lg border border-gray-300 shadow-sm"
                    onError={(e) => {
                      console.error("❌ Error loading image:", photoPreview);
                      const target = e.target as HTMLImageElement;
                      target.src =
                        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04NCA2NEw3MCA3OEw1OCA3MEw0NCA4NEg4NFY2NFoiIGZpbGw9IiM5Q0EzQUYiLz4KPGNpcmNsZSBjeD0iNTgiIGN5PSI1MiIgcj0iOCIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K";
                    }}
                  />
                </div>
                {isEditing && (photoFile || photoPreview !== (user.profile_photo_url || user.profile_photo)) && (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                    title={getTranslation("Hapus foto", currentLanguage.code)}
                  >
                    ×
                  </button>
                )}
              </div>

              <div className="flex-1">
                {photoFile && (
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>
                      <strong>{getTranslation("File baru", currentLanguage.code)}:</strong> {photoFile.name}
                    </p>
                    <p>
                      <strong>{getTranslation("Ukuran", currentLanguage.code)}:</strong> {(photoFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <p>
                      <strong>{getTranslation("Tipe", currentLanguage.code)}:</strong> {photoFile.type}
                    </p>
                  </div>
                )}
                {!photoFile && (user.profile_photo_url || user.profile_photo) && (
                  <div className="text-sm text-gray-600">
                    <p>
                      <strong>{getTranslation("Foto saat ini", currentLanguage.code)}</strong>
                    </p>
                    <p className="text-xs break-all">{user.profile_photo_url || user.profile_photo}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {isEditing && (
          <div className="md:col-span-2 flex gap-3 mt-6">
            <button
              type="button"
              onClick={handleSave}
              disabled={loading || !tokenValid}
              className="flex-1 md:flex-none bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {uploadProgress > 0 && uploadProgress < 100 ? `${getTranslation("Upload foto", currentLanguage.code)} ${uploadProgress}%` : getTranslation("Menyimpan...", currentLanguage.code)}
                </div>
              ) : (
                getTranslation("Simpan Perubahan", currentLanguage.code)
              )}
            </button>

            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className="flex-1 md:flex-none bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 font-medium"
            >
              {getTranslation("Batal", currentLanguage.code)}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}