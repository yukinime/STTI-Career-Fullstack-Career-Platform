"use client";

import { useState, useEffect } from "react";

type Education = {
  education_level: string;
  institution_name: string;
  major: string;
  gpa: string;
  entry_year: string;
  graduation_year: string;
};

type Props = {
  education: Education | null;
  isEditing: boolean;
  onCancel: () => void;
  onSaveSuccess: (updated: Education) => void;
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

// Translation mappings untuk form pendidikan
const translations: TranslationSet = {
  // Labels
  'Pilih Jenjang': {
    'id': 'Pilih Jenjang',
    'en': 'Select Level',
    'ja': 'レベルを選択'
  },
  'Nama Institusi': {
    'id': 'Nama Institusi',
    'en': 'Institution Name',
    'ja': '機関名'
  },
  'Jurusan': {
    'id': 'Jurusan',
    'en': 'Major',
    'ja': '専攻'
  },
  'Nilai/IPK': {
    'id': 'Nilai/IPK',
    'en': 'GPA/Score',
    'ja': 'GPA/成績'
  },
  'Tahun Masuk': {
    'id': 'Tahun Masuk',
    'en': 'Entry Year',
    'ja': '入学年'
  },
  'Tahun Keluar': {
    'id': 'Tahun Keluar',
    'en': 'Graduation Year',
    'ja': '卒業年'
  },
  
  // Placeholders dan Options
  '-- Pilih Jenjang --': {
    'id': '-- Pilih Jenjang --',
    'en': '-- Select Level --',
    'ja': '-- レベルを選択してください --'
  },
  '-- Pilih Tahun --': {
    'id': '-- Pilih Tahun --',
    'en': '-- Select Year --',
    'ja': '-- 年を選択してください --'
  },
  'Contoh: 3.75': {
    'id': 'Contoh: 3.75',
    'en': 'Example: 3.75',
    'ja': '例: 3.75'
  },
  
  // Education Levels
  'SD': {
    'id': 'SD',
    'en': 'Elementary School',
    'ja': '小学校'
  },
  'SMP': {
    'id': 'SMP',
    'en': 'Junior High School',
    'ja': '中学校'
  },
  'SMA/SMK': {
    'id': 'SMA/SMK',
    'en': 'Senior High School',
    'ja': '高等学校'
  },
  'Diploma': {
    'id': 'Diploma',
    'en': 'Diploma',
    'ja': 'ディプロマ'
  },
  'Sarjana': {
    'id': 'Sarjana',
    'en': 'Bachelor\'s Degree',
    'ja': '学士号'
  },
  
  // Buttons
  'Simpan': {
    'id': '💾 Simpan',
    'en': '💾 Save',
    'ja': '💾 保存'
  },
  'Menyimpan...': {
    'id': 'Menyimpan...',
    'en': 'Saving...',
    'ja': '保存中...'
  },
  'Batal': {
    'id': 'Batal',
    'en': 'Cancel',
    'ja': 'キャンセル'
  },
  
  // Success/Error Messages
  'Pendidikan berhasil diperbarui': {
    'id': 'Pendidikan berhasil diperbarui ✅',
    'en': 'Education updated successfully ✅',
    'ja': '教育情報が正常に更新されました ✅'
  },
  'Gagal memperbarui pendidikan': {
    'id': 'Gagal memperbarui pendidikan',
    'en': 'Failed to update education',
    'ja': '教育情報の更新に失敗しました'
  }
};

export default function Pendidikan({ education, isEditing, onCancel, onSaveSuccess }: Props) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(languages[0]);
  const [form, setForm] = useState<Education>({
    education_level: "",
    institution_name: "",
    major: "",
    gpa: "",
    entry_year: "",
    graduation_year: "",
  });
  const [loading, setLoading] = useState(false);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1970 + 1 }, (_, i) => (1970 + i).toString());

  const levels = ["SD", "SMP", "SMA/SMK", "Diploma", "Sarjana"];

  // Get translated text
  const getTranslation = (key: string, lang: string): string => {
    return translations[key]?.[lang] || key;
  };

  // Listen for language changes from Header
  useEffect(() => {
    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage) {
      const language = languages.find(lang => lang.code === savedLanguage);
      if (language) {
        setCurrentLanguage(language);
      }
    }

    // Listen for language change events from Header component
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

  // isi form dari props
  useEffect(() => {
    if (education) setForm(education);
  }, [education]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/profile/education`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();
      if (res.ok && data.success) {
        alert(getTranslation("Pendidikan berhasil diperbarui", currentLanguage.code));
        window.location.reload();
      } else {
        alert(`${getTranslation("Gagal memperbarui pendidikan", currentLanguage.code)}: ${data.message || "Unknown error"}`);
      }
    } catch (err) {
      console.error("Error update education:", err);
      alert(getTranslation("Gagal memperbarui pendidikan", currentLanguage.code));
    } finally {
      setLoading(false);
    }
  }

  function handleChange(field: keyof Education, value: string) {
    setForm({ ...form, [field]: value });
  }

  return (
    <form className="grid grid-cols-2 gap-4" onSubmit={handleSave}>
      {/* Jenjang pendidikan */}
      <div>
        <label className="block text-sm font-medium">
          {getTranslation("Pilih Jenjang", currentLanguage.code)}
        </label>
        <select
          value={form.education_level}
          disabled={!isEditing}
          onChange={(e) => handleChange("education_level", e.target.value)}
          className="w-full border rounded-lg px-3 py-2 mt-1 disabled:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
        >
          <option value="">
            {getTranslation("-- Pilih Jenjang --", currentLanguage.code)}
          </option>
          {levels.map((level) => (
            <option key={level} value={level}>
              {getTranslation(level, currentLanguage.code)}
            </option>
          ))}
        </select>
      </div>

      {/* Nama institusi */}
      <div>
        <label className="block text-sm font-medium">
          {getTranslation("Nama Institusi", currentLanguage.code)}
        </label>
        <input
          type="text"
          value={form.institution_name}
          disabled={!isEditing}
          onChange={(e) => handleChange("institution_name", e.target.value)}
          className="w-full border rounded-lg px-3 py-2 mt-1 disabled:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
        />
      </div>

      {/* Jurusan */}
      <div>
        <label className="block text-sm font-medium">
          {getTranslation("Jurusan", currentLanguage.code)}
        </label>
        <input
          type="text"
          value={form.major}
          disabled={!isEditing}
          onChange={(e) => handleChange("major", e.target.value)}
          className="w-full border rounded-lg px-3 py-2 mt-1 disabled:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
        />
      </div>

      {/* Nilai/IPK */}
      <div>
        <label className="block text-sm font-medium">
          {getTranslation("Nilai/IPK", currentLanguage.code)}
        </label>
        <input
          type="text"
          value={form.gpa}
          disabled={!isEditing}
          onChange={(e) => {
            const val = e.target.value;
            // Hanya angka, koma, titik
            if (/^[0-9.,]*$/.test(val)) {
              handleChange("gpa", val);
            }
          }}
          className="w-full border rounded-lg px-3 py-2 mt-1 disabled:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
          placeholder={getTranslation("Contoh: 3.75", currentLanguage.code)}
        />
      </div>

      {/* Tahun Masuk */}
      <div>
        <label className="block text-sm font-medium">
          {getTranslation("Tahun Masuk", currentLanguage.code)}
        </label>
        <select
          value={form.entry_year}
          disabled={!isEditing}
          onChange={(e) => handleChange("entry_year", e.target.value)}
          className="w-full border rounded-lg px-3 py-2 mt-1 disabled:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
        >
          <option value="">
            {getTranslation("-- Pilih Tahun --", currentLanguage.code)}
          </option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {/* Tahun Keluar */}
      <div>
        <label className="block text-sm font-medium">
          {getTranslation("Tahun Keluar", currentLanguage.code)}
        </label>
        <select
          value={form.graduation_year}
          disabled={!isEditing}
          onChange={(e) => handleChange("graduation_year", e.target.value)}
          className="w-full border rounded-lg px-3 py-2 mt-1 disabled:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
        >
          <option value="">
            {getTranslation("-- Pilih Tahun --", currentLanguage.code)}
          </option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {/* Tombol */}
      {isEditing && (
        <div className="col-span-2 flex gap-2 mt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {loading ? getTranslation("Menyimpan...", currentLanguage.code) : getTranslation("Simpan", currentLanguage.code)}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            {getTranslation("Batal", currentLanguage.code)}
          </button>
        </div>
      )}
    </form>
  );
}