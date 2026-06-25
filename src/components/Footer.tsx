'use client';

import { useState, useEffect } from "react";
import Link from "next/link";

// Translation interfaces
interface TranslationSet {
  [key: string]: {
    [lang: string]: string;
  };
}

const translations: TranslationSet = {
  platformDescription: {
    id: "Platform untuk mencari lowongan kerja dan melamar dengan mudah.",
    en: "Platform for finding job vacancies and applying easily.",
    ja: "求人情報を簡単に検索し、応募できるプラットフォーム。"
  },
  navigation: { id: "Navigasi", en: "Navigation", ja: "ナビゲーション" },
  home: { id: "Beranda", en: "Home", ja: "ホーム" },
  jobs: { id: "Lowongan", en: "Jobs", ja: "求人" },
  companies: { id: "Perusahaan", en: "Companies", ja: "企業" },
  aboutUs: { id: "Tentang Kami", en: "About Us", ja: "私たちについて" },
  contact: { id: "Kontak", en: "Contact", ja: "お問い合わせ" },
  email: {
    id: "Email: info@stticareer.com",
    en: "Email: info@stticareer.com",
    ja: "メール: info@stticareer.com"
  },
  phone: {
    id: "Telp: +62 812-3456-7890",
    en: "Phone: +62 812-3456-7890",
    ja: "電話: +62 812-3456-7890"
  },
  allRightsReserved: {
    id: "Semua hak dilindungi.",
    en: "All rights reserved.",
    ja: "全著作権所有。"
  }
};

// Helper functions
const getCurrentLanguage = (): string => {
  if (typeof window !== "undefined") {
    try {
      return localStorage.getItem("selectedLanguage") || "id";
    } catch {
      return "id";
    }
  }
  return "id";
};

const getTranslation = (key: string, lang: string): string => {
  return translations[key]?.[lang] || translations[key]?.id || key;
};

export default function Footer() {
  const [currentLanguage, setCurrentLanguage] = useState("id");
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    // Sync language
    const handleLanguageChange = (e: CustomEvent) => {
      if (e.detail?.language) setCurrentLanguage(e.detail.language);
    };

    setCurrentLanguage(getCurrentLanguage());
    setYear(new Date().getFullYear());

    window.addEventListener("languageChanged", handleLanguageChange as EventListener);
    return () => {
      window.removeEventListener("languageChanged", handleLanguageChange as EventListener);
    };
  }, []);

  return (
    <footer className="bg-gradient-to-r from-[#0A1FB5] to-[#0A18E0] text-white">
      <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-8">
        {/* Brand & Description */}
        <div>
          <h2 className="text-lg font-bold">STTICAREER</h2>
          <p className="text-sm text-gray-300 mt-2">
            {getTranslation("platformDescription", currentLanguage)}
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="font-semibold mb-3">
            {getTranslation("navigation", currentLanguage)}
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/" className="hover:text-yellow-400 transition-colors">
                {getTranslation("home", currentLanguage)}
              </Link>
            </li>
            <li>
              <Link href="/lowongan" className="hover:text-yellow-400 transition-colors">
                {getTranslation("jobs", currentLanguage)}
              </Link>
            </li>
            <li>
              <Link href="/perusahaan" className="hover:text-yellow-400 transition-colors">
                {getTranslation("companies", currentLanguage)}
              </Link>
            </li>
            <li>
              <Link href="/tentang" className="hover:text-yellow-400 transition-colors">
                {getTranslation("aboutUs", currentLanguage)}
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact / Social */}
        <div>
          <h3 className="font-semibold mb-3">
            {getTranslation("contact", currentLanguage)}
          </h3>
          <p className="text-sm text-gray-300">
            {getTranslation("email", currentLanguage)}
          </p>
          <p className="text-sm text-gray-300">
            {getTranslation("phone", currentLanguage)}
          </p>
          <div className="flex space-x-4 mt-3">
            <a href="#" className="hover:text-yellow-400 transition-colors text-sm">Facebook</a>
            <a href="#" className="hover:text-yellow-400 transition-colors text-sm">LinkedIn</a>
            <a href="#" className="hover:text-yellow-400 transition-colors text-sm">Instagram</a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-blue-700 py-4 text-center text-sm text-gray-400">
        © {year ?? "----"} STTICAREER. {getTranslation("allRightsReserved", currentLanguage)}
      </div>
    </footer>
  );
}
