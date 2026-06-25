"use client";

import { useEffect, useState } from "react";

type TabsProps = {
  activeTab: string;
  onTabChange: (tab: string) => void;
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

// Translation mappings untuk tabs
const translations: TranslationSet = {
  'Biodata': {
    'id': 'Biodata',
    'en': 'Personal Info',
    'ja': '個人情報'
  },
  'Pendidikan': {
    'id': 'Pendidikan',
    'en': 'Education',
    'ja': '学歴'
  },
  'Pengalaman': {
    'id': 'Pengalaman',
    'en': 'Experience',
    'ja': '経験'
  },
  'Sertifikat': {
    'id': 'Sertifikat',
    'en': 'Certificates',
    'ja': '証明書'
  },
  'Keterampilan': {
    'id': 'Keterampilan',
    'en': 'Skills',
    'ja': 'スキル'
  }
};

const tabs = [
  { name: "Biodata", key: "biodata" },
  { name: "Pendidikan", key: "pendidikan" },
  { name: "Pengalaman", key: "pengalaman" },
  { name: "Sertifikat", key: "sertifikat" },
  { name: "Keterampilan", key: "keterampilan" },
];

export default function Tabs({ activeTab, onTabChange }: TabsProps) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(languages[0]);

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

  return (
    <div className="flex gap-6 border-b mb-4 overflow-x-auto whitespace-nowrap">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onTabChange(tab.key)}
          className={`pb-2 ${
            activeTab === tab.key
              ? "border-b-2 border-blue-600 font-medium text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {getTranslation(tab.name, currentLanguage.code)}
        </button>
      ))}
    </div>
  );
}