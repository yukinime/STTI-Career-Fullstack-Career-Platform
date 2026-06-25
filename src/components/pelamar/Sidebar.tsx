"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Home,
  BriefcaseBusiness,
  FileText,
  Settings,
  Menu,
  X,
  type LucideIcon,
} from "lucide-react";

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

interface MenuItem {
  name: string;
  href: string;
  icon: LucideIcon;
  key: string; // Added key for consistent translation
}

const languages: Language[] = [
  { code: "id", name: "Indonesia", flag: "🇮🇩" },
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
];

// Complete static translations for all languages
const translations: TranslationSet = {
  "Data Pribadi": {
    id: "Data Pribadi",
    en: "Personal Data",
    ja: "個人データ",
  },
  "Simpan Lowongan": {
    id: "Simpan Lowongan",
    en: "Saved Jobs",
    ja: "保存した求人",
  },
  "Lamaran saya": {
    id: "Lamaran saya",
    en: "My Applications",
    ja: "私の応募",
  },
  Pengaturan: {
    id: "Pengaturan",
    en: "Settings",
    ja: "設定",
  },
};

const menuItems: MenuItem[] = [
  {
    key: "Data Pribadi",
    name: "Data Pribadi",
    href: "/pelamar/profile/{id}",
    icon: Home,
  },
  {
    key: "Simpan Lowongan",
    name: "Simpan Lowongan",
    href: "/pelamar/lowongan",
    icon: BriefcaseBusiness,
  },
  {
    key: "Lamaran saya",
    name: "Lamaran saya",
    href: "/pelamar/lamaran",
    icon: FileText,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<Language>(
    languages[0]
  );

  // Get translated text
  const getTranslation = (key: string, lang: string): string => {
    return translations[key]?.[lang] || key;
  };

  // Get translated menu items
  const getTranslatedMenuItems = (lang: string) => {
    return menuItems.map((item) => ({
      ...item,
      name: getTranslation(item.key, lang),
    }));
  };

  // Load saved language and listen for language changes
  useEffect(() => {
    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem("selectedLanguage");
    if (savedLanguage) {
      const language = languages.find((lang) => lang.code === savedLanguage);
      if (language) {
        setCurrentLanguage(language);
      }
    }

    // Listen for language change events from Header or Navbar
    const handleLanguageChange = (event: CustomEvent) => {
      const language = languages.find(
        (lang) => lang.code === event.detail.language
      );
      if (language) {
        setCurrentLanguage(language);
      }
    };

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

  const translatedMenuItems = getTranslatedMenuItems(currentLanguage.code);
  const translatedSettings = getTranslation("Pengaturan", currentLanguage.code);

  return (
    <>
      {/* ✅ Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-[#0C1E6F] text-white min-h-screen flex-col">
        {/* Logo + Back Button */}
        <div className="flex items-center gap-3 p-6">
          <button
            onClick={() => router.push("/")}
            className="flex items-center"
          >
            <Image
              src="/back.png"
              alt="Back"
              width={24}
              height={24}
              className="w-6 h-6"
            />
          </button>

          <Image
            src="/logo-stti.png"
            alt="Logo"
            width={40}
            height={40}
            className="w-10 h-10"
            priority
          />
          <span className="font-bold text-lg">STTICAREER</span>
        </div>

        {/* Menu Tengah */}
        <nav className="flex flex-col flex-grow justify-center space-y-2">
          {translatedMenuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={`${item.href}-${index}`}
                href={item.href}
                className={`flex items-center gap-3 px-6 py-2 rounded-lg transition-colors
                  ${isActive ? "bg-[#1C2E9E]" : "hover:bg-[#1C2E9E]/50"}`}
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Menu Bawah */}
        <div className="p-6">
          <Link
            href="/pelamar/pengaturan"
            className={`flex items-center gap-3 px-6 py-2 rounded-lg transition-colors
              ${
                pathname === "/pelamar/pengaturan"
                  ? "bg-[#1C2E9E]"
                  : "hover:bg-[#1C2E9E]/50"
              }`}
          >
            <Settings size={20} />
            <span>{translatedSettings}</span>
          </Link>
        </div>
      </aside>

      {/* ✅ Mobile Navbar */}
      <div className="md:hidden bg-[#0C1E6F] text-white">
        <div className="flex justify-between items-center p-4">
          <div className="flex items-center gap-2">
            <button onClick={() => window.history.back()}>
              <Image
                src="/back.png"
                alt="Back"
                width={24}
                height={24}
                className="w-6 h-6"
              />
            </button>
            <Image
              src="/logo-stti.png"
              alt="Logo"
              width={32}
              height={32}
              className="w-8 h-8"
            />
            <span className="font-bold text-base">STTICAREER</span>
          </div>

          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isOpen && (
          <nav className="flex flex-col space-y-2 px-4 pb-4">
            {translatedMenuItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={`${item.href}-mobile-${index}`}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors
                    ${isActive ? "bg-[#1C2E9E]" : "hover:bg-[#1C2E9E]/50"}`}
                  onClick={() => setIsOpen(false)}
                >
                  <Icon size={18} />
                  <span>{item.name}</span>
                </Link>
              );
            })}

            <Link
              href="/pelamar/pengaturan"
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors
                ${
                  pathname === "/pelamar/pengaturan"
                    ? "bg-[#1C2E9E]"
                    : "hover:bg-[#1C2E9E]/50"
                }`}
              onClick={() => setIsOpen(false)}
            >
              <Settings size={18} />
              <span>{translatedSettings}</span>
            </Link>
          </nav>
        )}
      </div>
    </>
  );
}
