"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Pencil,
  Trash2,
  Plus,
  X,
  WifiOff,
  CheckCircle,
  AlertCircle,
  Wifi,
  Edit,
  Upload,
} from "lucide-react";
import KeterampilanForm from "./KeterampilanForm";

interface Skill {
  id?: number | string;
  _id?: number | string;
  skill_name?: string;
  nama?: string;
  name?: string;
  skill_level?: string;
  level?: string;
  user_id?: number;
  created_at?: string;
  updated_at?: string;
  deskripsi?: string;
}

interface SkillFormData {
  nama: string;
  level?: string;
  deskripsi?: string;
}

interface FileData {
  portfolio_file: string | null;
  cv_file: string | null;
  cover_letter_file: string | null;
  portfolio_file_url?: string | null;
  cv_file_url?: string | null;
  cover_letter_file_url?: string | null;
}

// Translation object for all text in the component
const translations = {
  // Section titles
  skills: {
    id: "Keterampilan",
    en: "Skills",
    ja: "スキル",
  },
  portfolio: {
    id: "Portofolio",
    en: "Portfolio",
    ja: "ポートフォリオ",
  },
  supportingFiles: {
    id: "File Pendukung",
    en: "Supporting Files",
    ja: "サポートファイル",
  },

  // Status messages
  statusSynced: {
    id: "Tersinkron",
    en: "Synced",
    ja: "同期済み",
  },
  statusOffline: {
    id: "Mode Offline",
    en: "Offline Mode",
    ja: "オフラインモード",
  },
  statusExpired: {
    id: "Token Kedaluwarsa",
    en: "Token Expired",
    ja: "トークン期限切れ",
  },
  statusDemo: {
    id: "Mode Demo",
    en: "Demo Mode",
    ja: "デモモード",
  },
  statusChecking: {
    id: "Memeriksa...",
    en: "Checking...",
    ja: "確認中...",
  },

  // Buttons
  editSkills: {
    id: "Edit Keterampilan",
    en: "Edit Skills",
    ja: "スキルを編集",
  },
  addSkill: {
    id: "Tambah Keterampilan",
    en: "Add Skill",
    ja: "スキルを追加",
  },
  retry: {
    id: "Coba Lagi",
    en: "Try Again",
    ja: "再試行",
  },
  viewFile: {
    id: "Lihat File",
    en: "View File",
    ja: "ファイルを見る",
  },
  deleteSkill: {
    id: "Hapus skill",
    en: "Delete skill",
    ja: "スキルを削除",
  },

  // Messages
  loadingSkills: {
    id: "Memuat data keterampilan...",
    en: "Loading skills data...",
    ja: "スキルデータを読み込み中...",
  },
  noSkills: {
    id: "Belum ada keterampilan yang ditambahkan",
    en: "No skills added yet",
    ja: "まだスキルが追加されていません",
  },
  noFileUploaded: {
    id: "Belum ada file yang diunggah",
    en: "No file uploaded yet",
    ja: "まだファイルがアップロードされていません",
  },

  // Confirmation messages
  confirmDelete: {
    id: "Yakin mau hapus keterampilan ini?",
    en: "Are you sure you want to delete this skill?",
    ja: "このスキルを削除してもよろしいですか？",
  },
  confirmDeleteShort: {
    id: "Yakin ingin menghapus keterampilan ini?",
    en: "Are you sure you want to remove this skill?",
    ja: "このスキルを削除してもよろしいですか？",
  },

  // Error messages
  tokenExpired: {
    id: "Token kedaluwarsa. Silakan login ulang.",
    en: "Token expired. Please login again.",
    ja: "トークンが期限切れです。再度ログインしてください。",
  },
  accessDenied: {
    id: "Akses ditolak - periksa permissions",
    en: "Access denied - check permissions",
    ja: "アクセス拒否 - 権限を確認してください",
  },
  connectionError: {
    id: "Koneksi bermasalah - menampilkan data demo",
    en: "Connection issue - showing demo data",
    ja: "接続に問題があります - デモデータを表示中",
  },
  loadFailed: {
    id: "Gagal memuat data",
    en: "Failed to load data",
    ja: "データの読み込みに失敗しました",
  },
  tokenNotFound: {
    id: "Token tidak ditemukan",
    en: "Token not found",
    ja: "トークンが見つかりません",
  },
  deleteFailed: {
    id: "Gagal menghapus keterampilan. Silakan coba lagi.",
    en: "Failed to delete skill. Please try again.",
    ja: "スキルの削除に失敗しました。もう一度お試しください。",
  },
  deleteSuccess: {
    id: "Keterampilan berhasil dihapus",
    en: "Skill successfully deleted",
    ja: "スキルが正常に削除されました",
  },
  skillDeletedLocal: {
    id: "Skill dihapus - perubahan disimpan lokal",
    en: "Skill deleted - changes saved locally",
    ja: "スキルが削除されました - ローカルに保存されました",
  },
  changesSavedLocal: {
    id: "Perubahan disimpan lokal",
    en: "Changes saved locally",
    ja: "ローカルに保存されました",
  },
  skillAddedLocal: {
    id: "Skill ditambahkan - perubahan disimpan lokal",
    en: "Skill added - changes saved locally",
    ja: "スキルが追加されました - ローカルに保存されました",
  },
  changesSavedSuccess: {
    id: "Perubahan berhasil disimpan",
    en: "Changes saved successfully",
    ja: "変更が正常に保存されました",
  },
  saveFailed: {
    id: "Gagal menyimpan keterampilan. Silakan coba lagi.",
    en: "Failed to save skill. Please try again.",
    ja: "スキルの保存に失敗しました。もう一度お試しください。",
  },
  addSkillFailed: {
    id: "Gagal menambah keterampilan",
    en: "Failed to add skill",
    ja: "スキルの追加に失敗しました",
  },
  updateSkillFailed: {
    id: "Gagal mengupdate keterampilan",
    en: "Failed to update skill",
    ja: "スキルの更新に失敗しました",
  },

  // Help text
  loginAgain: {
    id: "Silakan login ulang untuk sinkronisasi dengan server",
    en: "Please login again to sync with server",
    ja: "サーバーと同期するには再度ログインしてください",
  },
  syncWhenOnline: {
    id: "Perubahan akan disinkronkan ketika kembali online",
    en: "Changes will be synced when back online",
    ja: "オンラインに戻ると変更が同期されます",
  },

  // File types
  portfolioFile: {
    id: "Portfolio File",
    en: "Portfolio File",
    ja: "ポートフォリオファイル",
  },
  curriculumVitae: {
    id: "Curriculum Vitae",
    en: "Curriculum Vitae",
    ja: "履歴書",
  },
  coverLetter: {
    id: "Cover Letter",
    en: "Cover Letter",
    ja: "カバーレター",
  },
};

export default function KeterampilanSection() {
  const [showForm, setShowForm] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [authStatus, setAuthStatus] = useState("checking");
  const [portfolioLinks, setPortfolioLinks] = useState<string[]>([]);
  const [files, setFiles] = useState<FileData>({
    portfolio_file: null,
    cv_file: null,
    cover_letter_file: null,
    portfolio_file_url: null,
    cv_file_url: null,
    cover_letter_file_url: null,
  });
  const [currentLanguage, setCurrentLanguage] = useState("id");

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  // Translation helper function
  const t = (key: keyof typeof translations): string => {
    return (
      translations[key]?.[currentLanguage as "id" | "en" | "ja"] ||
      translations[key]?.["id"] ||
      key
    );
  };

  // Listen for language changes from Header
  useEffect(() => {
    const handleLanguageChange = (event: CustomEvent) => {
      setCurrentLanguage(event.detail.language);
    };

    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem("selectedLanguage");
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    }

    window.addEventListener(
      "languageChanged",
      handleLanguageChange as EventListener
    );

    return () => {
      window.removeEventListener(
        "languageChanged",
        handleLanguageChange as EventListener
      );
    };
  }, []);

  const getAuthToken = (): string | null => {
    if (typeof window === "undefined") return null;

    const possibleKeys = ["jwt_token", "token", "authToken", "accessToken"];
    for (const key of possibleKeys) {
      const token = localStorage.getItem(key);
      if (token && token !== "YOUR_JWT_TOKEN" && token.length > 10) {
        return token;
      }
    }
    return null;
  };

  const isAuthenticated = (): boolean => {
    const token = getAuthToken();
    return !!(token && token !== "YOUR_JWT_TOKEN" && token.length > 10);
  };

  const clearAuthTokens = (): void => {
    if (typeof window === "undefined") return;

    const possibleKeys = ["jwt_token", "token", "authToken", "accessToken"];
    possibleKeys.forEach((key) => localStorage.removeItem(key));
  };

  const loadDummyData = (scenario: string): void => {
    const dummySkills: Skill[] = [
      { id: 1, skill_name: "JavaScript", skill_level: "Advanced" },
      { id: 2, skill_name: "React", skill_level: "Intermediate" },
      { id: 3, skill_name: "TypeScript", skill_level: "Intermediate" },
    ];

    const dummyPortfolioLinks = [
      "https://github.com/example",
      "https://portfolio.example.com",
    ];

    switch (scenario) {
      case "expired":
        setSkills(dummySkills);
        setPortfolioLinks(dummyPortfolioLinks);
        setAuthStatus("expired");
        break;
      case "no-permission":
        setSkills(dummySkills.slice(0, 2));
        setPortfolioLinks([dummyPortfolioLinks[0]]);
        setAuthStatus("unauthenticated");
        break;
      case "error":
        setSkills(dummySkills);
        setPortfolioLinks(dummyPortfolioLinks);
        setAuthStatus("unauthenticated");
        break;
      default:
        setSkills(dummySkills);
        setPortfolioLinks(dummyPortfolioLinks);
        setAuthStatus("unauthenticated");
    }
  };

  const fetchSkills = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      const token = getAuthToken();

      if (!token || !isAuthenticated()) {
        console.warn("No valid token found");
        loadDummyData("no-permission");
        setLoading(false);
        return;
      }

      console.log("Fetching profile data from:", `${API_BASE_URL}/api/profile`);

      const response = await fetch(`${API_BASE_URL}/api/profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      console.log("Response status:", response.status);

      if (response.status === 401) {
        console.warn("Authentication token expired or invalid");
        clearAuthTokens();
        loadDummyData("expired");
        setError(t("tokenExpired"));
        setLoading(false);
        return;
      }

      if (response.status === 403) {
        setError(t("accessDenied"));
        setAuthStatus("unauthenticated");
        loadDummyData("no-permission");
        setLoading(false);
        return;
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(
          `HTTP error! status: ${response.status} - ${response.statusText}`
        );
      }

      const result = await response.json();
      console.log("Profile data received:", result);

      if (!result.success || !result.data) {
        throw new Error("Invalid response format");
      }

      const profileData = result.data;
      setAuthStatus("authenticated");
      setError(null);

      if (profileData.skills && Array.isArray(profileData.skills)) {
        const skillsArray = profileData.skills.map((skill: Skill) => ({
          id: skill.id,
          user_id: skill.user_id,
          skill_name: skill.skill_name,
          skill_level: skill.skill_level,
          nama: skill.skill_name,
          level: skill.skill_level,
          created_at: skill.created_at,
          updated_at: skill.updated_at,
          deskripsi: skill.deskripsi || "",
        }));

        setSkills(skillsArray);
        console.log("Skills loaded:", skillsArray.length, "items");
      } else {
        setSkills([]);
        console.log("No skills found in profile");
      }

      const fileData: FileData = {
        portfolio_file: profileData.portfolio_file,
        cv_file: profileData.cv_file,
        cover_letter_file: profileData.cover_letter_file,
        portfolio_file_url: profileData.portfolio_file_url,
        cv_file_url: profileData.cv_file_url,
        cover_letter_file_url: profileData.cover_letter_file_url,
      };

      setFiles(fileData);
      console.log("Files loaded:", fileData);

      setPortfolioLinks([]);
    } catch (err: unknown) {
      console.error("Error fetching profile:", err);

      if (err instanceof Error) {
        if (
          err.name === "NetworkError" ||
          err.message.includes("Failed to fetch")
        ) {
          setError(t("connectionError"));
          setIsOnline(false);
        } else {
          setError(`${t("loadFailed")}: ${err.message}`);
        }
      } else {
        // Jika err bukan Error (misal string/objek lain)
        setError(t("loadFailed"));
      }

      loadDummyData("error");
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL, currentLanguage]);

  const addSkill = async (skillData: SkillFormData): Promise<boolean> => {
    try {
      const token = getAuthToken();

      if (!token) {
        throw new Error(t("tokenNotFound"));
      }

      console.log("Adding skill:", skillData);

      const response = await fetch(`${API_BASE_URL}/api/profile/skill`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify({
          skill_name: skillData.nama,
          skill_level: skillData.level || "Beginner",
        }),
      });

      console.log("Add skill response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error("Add skill error:", errorData);
        throw new Error(
          errorData?.message || `HTTP error! status: ${response.status}`
        );
      }

      const result = await response.json();
      console.log("Skill added successfully:", result);

      await fetchSkills();
      return true;
    } catch (err: unknown) {
      console.error("Error adding skill:", err);

      if (err instanceof Error) {
        setError(`${t("addSkillFailed")}: ${err.message}`);
      } else {
        setError(t("addSkillFailed"));
      }

      return false;
    }
  };

  const updateSkill = async (
    skillId: string | number,
    skillData: SkillFormData
  ): Promise<boolean> => {
    try {
      const token = getAuthToken();

      if (!token) {
        throw new Error(t("tokenNotFound"));
      }

      console.log("Updating skill:", skillId, skillData);

      const response = await fetch(
        `${API_BASE_URL}/api/profile/skill/${skillId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          body: JSON.stringify({
            skill_name: skillData.nama,
            skill_level: skillData.level || "Beginner",
          }),
        }
      );

      console.log("Update skill response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error("Update skill error:", errorData);
        throw new Error(
          errorData?.message || `HTTP error! status: ${response.status}`
        );
      }

      const result = await response.json();
      console.log("Skill updated successfully:", result);

      setError(null);
      setAuthStatus("authenticated");

      await fetchSkills();

      return true;
    } catch (err: unknown) {
      console.error("Error updating skill:", err);

      if (err instanceof Error) {
        setError(`${t("updateSkillFailed")}: ${err.message}`);
      } else {
        setError(t("updateSkillFailed"));
      }

      return false;
    }
  };

  const deleteSkill = async (skillId: string | number): Promise<boolean> => {
    try {
      const token = getAuthToken();

      if (!token) {
        throw new Error(t("tokenNotFound"));
      }

      console.log("Deleting skill:", skillId);

      const response = await fetch(
        `${API_BASE_URL}/api/profile/skill/${skillId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      console.log("Delete skill response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error("Delete skill error:", errorData);
        throw new Error(
          errorData?.message || `HTTP error! status: ${response.status}`
        );
      }

      const result = await response.json();
      console.log("Skill deleted successfully:", result);

      await fetchSkills();
      return true;
    } catch (err: unknown) {
      console.error("Error deleting skill:", err);

      if (err instanceof Error) {
        setError(`${t("updateSkillFailed")}: ${err.message}`);
      } else {
        setError(t("updateSkillFailed"));
      }

      return false;
    }
  };

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (authStatus === "unauthenticated" && isAuthenticated()) {
        fetchSkills();
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [authStatus, fetchSkills]);

  const handleEditClick = (): void => {
    setEditMode(true);
    setShowForm(true);
  };

  const handleEdit = (idx: number): void => {
    setEditIndex(idx);
    setShowForm(true);
    setEditMode(true);
  };

  const handleDelete = async (idx: number): Promise<void> => {
    if (confirm(t("confirmDelete"))) {
      const skill = skills[idx];

      if (isOnline && isAuthenticated() && skill.id) {
        const success = await deleteSkill(skill.id);
        if (!success) {
          alert(t("deleteFailed"));
        } else {
          setError(t("deleteSuccess"));
          setTimeout(() => setError(null), 2000);
        }
      } else {
        const newSkills = skills.filter((_, index) => index !== idx);
        setSkills(newSkills);
        setError(t("skillDeletedLocal"));
      }
    }
  };

  const handleAddSkill = (): void => {
    setEditIndex(null);
    setShowForm(true);
    setEditMode(true);
  };

  const handleCancel = (): void => {
    setShowForm(false);
    setEditMode(false);
    setEditIndex(null);
  };

  const handleSave = async (data: SkillFormData): Promise<void> => {
    let success = false;

    if (editIndex !== null) {
      const skill = skills[editIndex];
      if (isOnline && isAuthenticated() && skill.id) {
        success = await updateSkill(skill.id, data);
      } else {
        const newSkills = [...skills];
        newSkills[editIndex] = {
          ...newSkills[editIndex],
          skill_name: data.nama,
          nama: data.nama,
          skill_level: data.level,
          level: data.level,
          deskripsi: data.deskripsi,
        };
        setSkills(newSkills);
        success = true;
        setError(t("changesSavedLocal"));
      }
    } else {
      if (isOnline && isAuthenticated()) {
        success = await addSkill(data);
      } else {
        const newSkill: Skill = {
          id: Date.now(),
          skill_name: data.nama,
          nama: data.nama,
          skill_level: data.level || "Beginner",
          level: data.level || "Beginner",
          deskripsi: data.deskripsi,
        };
        setSkills([...skills, newSkill]);
        success = true;
        setError(t("skillAddedLocal"));
      }
    }

    if (success) {
      setShowForm(false);
      setEditMode(false);
      setEditIndex(null);

      if (isOnline && isAuthenticated()) {
        const originalError = error;
        setError(t("changesSavedSuccess"));
        setTimeout(() => {
          setError(originalError);
        }, 2000);
      }
    } else {
      alert(t("saveFailed"));
    }
  };

  const removeSkill = async (skillToRemove: Skill): Promise<void> => {
    if (!confirm(t("confirmDeleteShort"))) {
      return;
    }

    if (isOnline && isAuthenticated() && skillToRemove.id) {
      const success = await deleteSkill(skillToRemove.id);
      if (!success) {
        alert(t("deleteFailed"));
      }
    } else {
      const updatedSkills = skills.filter((skill) => skill !== skillToRemove);
      setSkills(updatedSkills);
      setError(t("skillDeletedLocal"));
    }
  };

  const handleRetry = (): void => {
    setError(null);
    fetchSkills();
  };

  const getStatusInfo = () => {
    if (!isOnline) {
      return {
        type: "offline",
        message: t("statusOffline"),
        icon: WifiOff,
        color: "orange",
      };
    }

    switch (authStatus) {
      case "authenticated":
        return {
          type: "success",
          message: t("statusSynced"),
          icon: CheckCircle,
          color: "green",
        };
      case "expired":
        return {
          type: "warning",
          message: t("statusExpired"),
          icon: AlertCircle,
          color: "yellow",
        };
      case "unauthenticated":
        return {
          type: "info",
          message: t("statusDemo"),
          icon: AlertCircle,
          color: "blue",
        };
      default:
        return {
          type: "info",
          message: t("statusChecking"),
          icon: Wifi,
          color: "gray",
        };
    }
  };

  const statusInfo = getStatusInfo();

  if (loading) {
    return (
      <div className="mt-3">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-center items-center py-8">
            <div className="text-gray-500 flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
              {t("loadingSkills")}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-3">
      <div className="max-w-5xl mx-auto">
        {showForm ? (
          <KeterampilanForm
            mode={editIndex === null ? "add" : "edit"}
            initialData={
              editIndex !== null
                ? {
                    nama:
                      skills[editIndex]?.skill_name ||
                      skills[editIndex]?.nama ||
                      "",
                    level:
                      skills[editIndex]?.skill_level ||
                      skills[editIndex]?.level,
                    deskripsi: skills[editIndex]?.deskripsi || "",
                  }
                : undefined
            }
            onCancel={handleCancel}
            onSave={handleSave}
          />
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold text-gray-900">
                  {t("skills")}
                </h2>
                <div
                  className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    statusInfo.color === "green"
                      ? "bg-green-100 text-green-800"
                      : statusInfo.color === "yellow"
                      ? "bg-yellow-100 text-yellow-800"
                      : statusInfo.color === "orange"
                      ? "bg-orange-100 text-orange-800"
                      : statusInfo.color === "blue"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <statusInfo.icon className="w-3 h-3 mr-1" />
                  {statusInfo.message}
                </div>
              </div>
              <button
                onClick={handleEditClick}
                className="inline-flex items-center bg-blue-600 text-white px-4 py-2 text-sm rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-colors"
              >
                <Edit className="w-4 h-4 mr-2" />
                {t("editSkills")}
              </button>
            </div>

            {error && (
              <div
                className={`mb-4 p-3 rounded-md flex items-start justify-between ${
                  error.includes("berhasil") ||
                  error.includes("successfully") ||
                  error.includes("正常")
                    ? "bg-green-100 border border-green-300"
                    : error.includes("offline") ||
                      error.includes("Offline") ||
                      error.includes("オフライン")
                    ? "bg-orange-100 border border-orange-300"
                    : error.includes("kedaluwarsa") ||
                      error.includes("expired") ||
                      error.includes("期限切れ")
                    ? "bg-yellow-100 border border-yellow-300"
                    : error.includes("demo") ||
                      error.includes("Demo") ||
                      error.includes("デモ")
                    ? "bg-blue-100 border border-blue-300"
                    : "bg-red-100 border border-red-300"
                }`}
              >
                <div>
                  <p
                    className={`text-sm font-medium ${
                      error.includes("berhasil") ||
                      error.includes("successfully") ||
                      error.includes("正常")
                        ? "text-green-800"
                        : error.includes("offline") ||
                          error.includes("Offline") ||
                          error.includes("オフライン")
                        ? "text-orange-800"
                        : error.includes("kedaluwarsa") ||
                          error.includes("expired") ||
                          error.includes("期限切れ")
                        ? "text-yellow-800"
                        : error.includes("demo") ||
                          error.includes("Demo") ||
                          error.includes("デモ")
                        ? "text-blue-800"
                        : "text-red-800"
                    }`}
                  >
                    {error}
                  </p>
                  {(error.includes("kedaluwarsa") ||
                    error.includes("expired") ||
                    error.includes("期限切れ")) && (
                    <p className="text-xs text-yellow-600 mt-1">
                      {t("loginAgain")}
                    </p>
                  )}
                  {(error.includes("offline") ||
                    error.includes("Offline") ||
                    error.includes("オフライン")) && (
                    <p className="text-xs text-orange-600 mt-1">
                      {t("syncWhenOnline")}
                    </p>
                  )}
                </div>
                {(error.includes("Gagal") ||
                  error.includes("Failed") ||
                  error.includes("失敗") ||
                  error.includes("bermasalah") ||
                  error.includes("issue") ||
                  error.includes("問題")) && (
                  <button
                    onClick={handleRetry}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {t("retry")}
                  </button>
                )}
              </div>
            )}

            <div className="mb-6">
              <div className="flex flex-wrap gap-2 mb-3">
                {skills.length > 0 ? (
                  skills.map((skill, index) => (
                    <span
                      key={skill.id || index}
                      className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200 hover:bg-blue-200 transition-colors"
                    >
                      <span className="font-semibold">
                        {skill.skill_name || skill.nama}
                      </span>
                      <span className="mx-1.5 text-xs text-blue-600">•</span>
                      <span className="text-xs">
                        {skill.skill_level || skill.level || "Beginner"}
                      </span>
                      <button
                        onClick={() => removeSkill(skill)}
                        className="ml-2 hover:text-blue-600 transition-colors"
                        title={t("deleteSkill")}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))
                ) : (
                  <div className="text-gray-500 text-sm italic">
                    {t("noSkills")}
                  </div>
                )}
              </div>

              <button
                onClick={handleAddSkill}
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors"
              >
                + {t("addSkill")}
              </button>
            </div>

            {portfolioLinks.length > 0 && (
              <div className="mb-6">
                <h3 className="text-base font-semibold text-gray-900 mb-3">
                  {t("portfolio")}
                </h3>
                <div className="space-y-2">
                  {portfolioLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 hover:underline block break-all transition-colors"
                    >
                      {link}
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-4">
                {t("supportingFiles")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    title: t("portfolioFile"),
                    key: "portfolio_file",
                    urlKey: "portfolio_file_url",
                  },
                  {
                    title: t("curriculumVitae"),
                    key: "cv_file",
                    urlKey: "cv_file_url",
                  },
                  {
                    title: t("coverLetter"),
                    key: "cover_letter_file",
                    urlKey: "cover_letter_file_url",
                  },
                ].map((item, idx) => {
                  const fileName = files[item.key as keyof FileData];
                  const fileUrl = files[item.urlKey as keyof FileData];

                  return (
                    <div
                      key={idx}
                      className="border border-gray-200 rounded-lg p-4 bg-gray-50 text-center hover:bg-gray-100 transition-colors"
                    >
                      <h4 className="font-medium text-gray-900 mb-3 text-sm">
                        {item.title}
                      </h4>
                      <div className="flex flex-col items-center justify-center py-6">
                        <div className="w-12 h-12 bg-gray-300 rounded-lg flex items-center justify-center mb-3">
                          <Upload className="w-6 h-6 text-gray-500" />
                        </div>
                        {fileName && fileUrl ? (
                          <div className="text-center">
                            <p className="text-xs text-green-600 font-medium mb-2">
                              {fileName}
                            </p>
                            <a
                              href={fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:underline"
                            >
                              {t("viewFile")}
                            </a>
                          </div>
                        ) : fileName ? (
                          <p className="text-xs text-green-600 font-medium">
                            {fileName}
                          </p>
                        ) : (
                          <p className="text-xs text-gray-500">
                            {t("noFileUploaded")}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
