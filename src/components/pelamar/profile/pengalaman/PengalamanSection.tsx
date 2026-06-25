// src/components/pelamar/profile/pengalaman/PengalamanSection.tsx
"use client";

import { useState, useEffect } from "react";
import PengalamanForm from "./PengalamanForm";

type Pengalaman = {
  id?: string | number;
  posisi: string;
  perusahaan: string;
  deskripsi: string;
  tahunMasuk: string;
  tahunKeluar: string;
  isCurrentJob?: boolean;
};

// Type sesuai API
interface ApiWorkExperience {
  id: number;
  position: string;
  company_name: string;
  start_date: string;
  end_date?: string | null;
  job_description: string;
  is_current: number;
}

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

// Translation mappings for the section
const translations: TranslationSet = {
  // Section title
  'Pengalaman Kerja': {
    'id': 'Pengalaman Kerja',
    'en': 'Work Experience',
    'ja': '職歴'
  },
  
  // Buttons
  'Tambah': {
    'id': 'Tambah',
    'en': 'Add',
    'ja': '追加'
  },
  'Edit': {
    'id': 'Edit',
    'en': 'Edit',
    'ja': '編集'
  },
  
  // Status messages
  'Memuat data...': {
    'id': 'Memuat data...',
    'en': 'Loading data...',
    'ja': 'データを読み込み中...'
  },
  'Gagal memuat data pengalaman kerja': {
    'id': 'Gagal memuat data pengalaman kerja',
    'en': 'Failed to load work experience data',
    'ja': '職歴データの読み込みに失敗しました'
  },
  'Token tidak ditemukan. Silakan login kembali.': {
    'id': 'Token tidak ditemukan. Silakan login kembali.',
    'en': 'Token not found. Please login again.',
    'ja': 'トークンが見つかりません。再度ログインしてください。'
  },
  'Terjadi kesalahan saat memuat data': {
    'id': 'Terjadi kesalahan saat memuat data',
    'en': 'An error occurred while loading data',
    'ja': 'データの読み込み中にエラーが発生しました'
  },
  
  // Empty state
  'Belum ada pengalaman kerja. Klik \'Tambah Pengalaman\' untuk menambahkan.': {
    'id': 'Belum ada pengalaman kerja. Klik \'Tambah\' untuk menambahkan.',
    'en': 'No work experience yet. Click \'Add\' to add one.',
    'ja': 'まだ職歴がありません。「追加」をクリックして追加してください。'
  },
  
  // Date display
  'Sekarang': {
    'id': 'Sekarang',
    'en': 'Present',
    'ja': '現在'
  }
};

export default function PengalamanSection() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(languages[0]);
  const [pengalaman, setPengalaman] = useState<Pengalaman[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editData, setEditData] = useState<Pengalaman | null>(null);

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

  const getToken = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token") || sessionStorage.getItem("token");
    }
    return null;
  };

  const fetchPengalaman = async () => {
    setIsLoading(true);
    setError("");

    try {
      const token = getToken();
      const lang = currentLanguage.code;
      
      if (!token) {
        setError(getTranslation("Token tidak ditemukan. Silakan login kembali.", lang));
        setIsLoading(false);
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/profile`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(getTranslation("Gagal memuat data pengalaman kerja", lang));
      }

      const result = await response.json();
      const transformed: Pengalaman[] =
        result.data?.work_experiences?.map((exp: ApiWorkExperience) => ({
          id: exp.id,
          posisi: exp.position,
          perusahaan: exp.company_name,
          tahunMasuk: exp.start_date
            ? new Date(exp.start_date).getFullYear().toString()
            : "",
          tahunKeluar: exp.is_current
            ? ""
            : exp.end_date
            ? new Date(exp.end_date).getFullYear().toString()
            : "",
          deskripsi: exp.job_description,
          isCurrentJob: Boolean(exp.is_current),
        })) || [];

      setPengalaman(transformed);
    } catch (err) {
      const lang = currentLanguage.code;
      setError(
        err instanceof Error 
          ? err.message 
          : getTranslation("Terjadi kesalahan saat memuat data", lang)
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPengalaman();
  }, []);

  const handleAdd = () => {
    setEditData(null);
    setIsFormOpen(true);
  };

  const handleEdit = (item: Pengalaman) => {
    setEditData(item);
    setIsFormOpen(true);
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditData(null);
  };

  const handleSave = (values: Pengalaman) => {
    // Update state setelah save
    if (editData) {
      setPengalaman((prev) =>
        prev.map((p) => (p.id === values.id ? values : p))
      );
    } else {
      setPengalaman((prev) => [...prev, values]);
    }
    setIsFormOpen(false);
    setEditData(null);
  };

  const handleDelete = (id: string | number) => {
    setPengalaman((prev) => prev.filter((p) => p.id !== id));
  };

  const lang = currentLanguage.code;

  return (
    <div className="p-4 bg-white rounded shadow-sm space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-base font-semibold text-gray-800">
          {getTranslation("Pengalaman Kerja", lang)}
        </h2>
        <button
          onClick={handleAdd}
          className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          {getTranslation("Tambah", lang)}
        </button>
      </div>

      {isLoading && (
        <p className="text-sm text-gray-500">
          {getTranslation("Memuat data...", lang)}
        </p>
      )}
      
      {error && (
        <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded p-3 flex items-center gap-2">
          <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      {!isLoading && pengalaman.length === 0 && !error && (
        <div className="text-center py-8 text-gray-500">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2h8zm-8 0h8m-8 0H8m8 0h8" />
            </svg>
          </div>
          <p className="text-sm">
            {getTranslation("Belum ada pengalaman kerja. Klik 'Tambah Pengalaman' untuk menambahkan.", lang)}
          </p>
        </div>
      )}

      <div className="space-y-3">
        {pengalaman.map((item, index) => (
          <div
            key={item.id || `pengalaman-${index}`}
            className="border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow bg-gray-50"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-800 mb-1">
                      {item.posisi}
                    </h3>
                    <p className="text-xs text-blue-600 font-medium">
                      {item.perusahaan}
                    </p>
                  </div>
                  {item.isCurrentJob && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1"></div>
                      {getTranslation("Sekarang", lang)}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center text-xs text-gray-500 mb-2">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  {item.tahunMasuk} - {item.isCurrentJob ? getTranslation("Sekarang", lang) : item.tahunKeluar}
                </div>
                
                <p className="text-xs text-gray-700 leading-relaxed">
                  {item.deskripsi}
                </p>
              </div>
              
              <div className="flex flex-col gap-1 ml-4">
                <button
                  onClick={() => handleEdit(item)}
                  className="text-xs text-blue-600 hover:text-blue-800 hover:underline font-medium px-2 py-1 rounded transition-colors"
                  title={getTranslation("Edit", lang)}
                >
                  {getTranslation("Edit", lang)}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isFormOpen && (
        <PengalamanForm
          mode={editData ? "edit" : "add"}
          data={editData || undefined}
          onSave={handleSave}
          onCancel={handleCancel}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}