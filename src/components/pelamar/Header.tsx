"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";

type HeaderProps = {
  title: string;
  name?: string;
  role?: string;
  avatarUrl?: string | null;
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

const translations: TranslationSet = {
  "Data Pribadi": { id: "Data Pribadi", en: "Personal Data", ja: "個人データ" },
  Profile: { id: "Profil", en: "Profile", ja: "プロフィール" },
  Dashboard: { id: "Dashboard", en: "Dashboard", ja: "ダッシュボード" },
  Settings: { id: "Pengaturan", en: "Settings", ja: "設定" },
  "Simpan Lowongan": { id: "Simpan Lowongan", en: "Saved Jobs", ja: "保存した求人" },
  "Lamaran saya": { id: "Lamaran saya", en: "My Applications", ja: "私の応募" },
  pelamar: { id: "Pelamar", en: "Applicant", ja: "応募者" },
  admin: { id: "Admin", en: "Admin", ja: "管理者" },
  hr: { id: "HR", en: "HR", ja: "人事" },
  user: { id: "Pengguna", en: "User", ja: "ユーザー" },
  perusahaan: { id: "Perusahaan", en: "Company", ja: "企業" },
};

export default function Header({ title, name, role, avatarUrl }: HeaderProps) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(languages[0]);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const languageDropdownRef = useRef<HTMLDivElement>(null);

  const initial = name ? name.charAt(0).toUpperCase() : "?";

  const getTranslation = (key: string, lang: string): string => {
    return translations[key]?.[lang] || key;
  };

  const handleLanguageChange = (language: Language) => {
    const previousLanguage = currentLanguage.code;
    setCurrentLanguage(language);
    localStorage.setItem("selectedLanguage", language.code);
    setIsLanguageDropdownOpen(false);

    const event = new CustomEvent("languageChanged", {
      detail: { language: language.code, previousLanguage },
    });
    window.dispatchEvent(event);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        languageDropdownRef.current &&
        !languageDropdownRef.current.contains(event.target as Node)
      ) {
        setIsLanguageDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const savedLanguage = localStorage.getItem("selectedLanguage");
    if (savedLanguage) {
      const language = languages.find((lang) => lang.code === savedLanguage);
      if (language) setCurrentLanguage(language);
    }

    const handleLangChange = (event: CustomEvent) => {
      const language = languages.find(
        (lang) => lang.code === event.detail.language
      );
      if (language) setCurrentLanguage(language);
    };

    window.addEventListener("languageChanged", handleLangChange as EventListener);
    return () =>
      window.removeEventListener("languageChanged", handleLangChange as EventListener);
  }, []);

  const translatedTitle = getTranslation(title, currentLanguage.code);
  const translatedRole = role ? getTranslation(role, currentLanguage.code) : "";

  return (
    <header className="flex justify-between items-center">
      <h1 className="text-2xl font-bold">{translatedTitle}</h1>

      <div className="flex items-center gap-4">
        {/* Language Dropdown */}
        <div className="relative" ref={languageDropdownRef}>
          <button
            onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
            className="flex items-center space-x-1 hover:bg-gray-100 transition-colors px-2 py-1 rounded-md border border-gray-200"
          >
            <span className="text-lg">{currentLanguage.flag}</span>
            <span className="text-sm font-medium text-gray-700">
              {currentLanguage.code.toUpperCase()}
            </span>
            <ChevronDown
              size={16}
              className={`transform transition-transform text-gray-500 ${
                isLanguageDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isLanguageDropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageChange(language)}
                  className={`w-full px-4 py-2 text-left flex items-center space-x-2 hover:bg-gray-100 transition-colors text-gray-800 ${
                    currentLanguage.code === language.code
                      ? "bg-blue-50 text-blue-600"
                      : ""
                  }`}
                >
                  <span className="text-lg">{language.flag}</span>
                  <span>{language.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* User Info */}
        {name && role && (
          <div className="flex items-center gap-3">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt={name}
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                }}
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center text-white font-bold">
                {initial}
              </div>
            )}

            <div className="text-left">
              <p className="font-semibold">{name}</p>
              <p className="text-sm text-gray-500 capitalize">{translatedRole}</p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
