"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Globe, Menu, X, ChevronDown } from "lucide-react";
import Image from "next/image";
import Swal from "sweetalert2";


interface UserProfile {
  id: number;
  full_name: string;
  email: string;
  role: string;
  foto?: string;
  profile_photo_url?: string;
}

interface ApiProfileResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    user_id: number;
    full_name: string;
    email: string;
    profile_photo_url: string;
  };
}

interface Language {
  code: string;
  name: string;
  flag: string;
}

interface NavigationItem {
  name: string;
  href: string;
  key: string; // Added key for consistent translation
}

interface TranslationSet {
  [key: string]: {
    [lang: string]: string;
  };
}

const languages: Language[] = [
  { code: "id", name: "Indonesia", flag: "🇮🇩" },
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "ja", name: "日本語", flag: "🇯🇵" }, // Fixed: consistent 'ja' code
];

// Complete static translations for all languages
const translations: TranslationSet = {
  Beranda: {
    id: "Beranda",
    en: "Home",
    ja: "ホーム",
  },
  Lowongan: {
    id: "Lowongan",
    en: "Jobs",
    ja: "求人",
  },
  Perusahaan: {
    id: "Perusahaan",
    en: "Companies",
    ja: "企業",
  },
  "Tentang Kami": {
    id: "Tentang Kami",
    en: "About Us",
    ja: "私たちについて",
  },
  Login: {
    id: "Login",
    en: "Login",
    ja: "ログイン",
  },
  Logout: {
    id: "Logout",
    en: "Logout",
    ja: "ログアウト",
  },
};

export default function Navbar() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentLanguage, setCurrentLanguage] = useState<Language>(
    languages[0]
  );
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [isMobileLanguageDropdownOpen, setIsMobileLanguageDropdownOpen] =
    useState(false);

  const languageDropdownRef = useRef<HTMLDivElement>(null);
  const mobileLanguageDropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  // Navigation items with translation keys
  const navigationItems: NavigationItem[] = [
    { name: "Beranda", href: "/", key: "Beranda" },
    { name: "Lowongan", href: "/lowongan", key: "Lowongan" },
    { name: "Perusahaan", href: "/perusahaan", key: "Perusahaan" },
    { name: "Tentang Kami", href: "/tentang", key: "Tentang Kami" },
  ];

  // Get translated text
  const getTranslation = (key: string, lang: string): string => {
    return translations[key]?.[lang] || key;
  };

  // Get translated navigation items
  const getTranslatedNavigation = (lang: string) => {
    return navigationItems.map((item) => ({
      ...item,
      name: getTranslation(item.key, lang),
    }));
  };

  // Fetch profile data from API
  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/profile`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const result: ApiProfileResponse = await response.json();

        if (result.success && result.data) {
          const userData: UserProfile = {
            id: result.data.user_id,
            full_name: result.data.full_name,
            email: result.data.email,
            role: "pelamar",
            profile_photo_url: result.data.profile_photo_url,
          };

          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));
        }
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      fallbackToLocalStorage();
    } finally {
      setLoading(false);
    }
  };

  // Fallback to localStorage data
  const fallbackToLocalStorage = () => {
    try {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        const parsed: UserProfile = JSON.parse(savedUser);
        if (parsed.role === "pelamar") {
          setUser(parsed);
        }
      }
    } catch {
      localStorage.removeItem("user");
      setUser(null);
    }
  };

  // Handle language change
  const handleLanguageChange = (language: Language) => {
    const previousLanguage = currentLanguage.code;
    setCurrentLanguage(language);
    localStorage.setItem("selectedLanguage", language.code);
    setIsLanguageDropdownOpen(false);
    setIsMobileLanguageDropdownOpen(false);

    // Dispatch custom event to notify other components
    const event = new CustomEvent("languageChanged", {
      detail: {
        language: language.code,
        previousLanguage: previousLanguage,
      },
    });
    window.dispatchEvent(event);

    console.log("Language changed to:", language.code);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        languageDropdownRef.current &&
        !languageDropdownRef.current.contains(event.target as Node)
      ) {
        setIsLanguageDropdownOpen(false);
      }
      if (
        mobileLanguageDropdownRef.current &&
        !mobileLanguageDropdownRef.current.contains(event.target as Node)
      ) {
        setIsMobileLanguageDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
  const token = localStorage.getItem("token");

  // Load saved language
  const savedLanguage = localStorage.getItem("selectedLanguage");
  if (savedLanguage) {
    const language = languages.find((lang) => lang.code === savedLanguage);
    if (language) {
      setCurrentLanguage(language);
    }
  }

  // Kalau ada token, ambil data profil
  if (token) {
    fallbackToLocalStorage();
    fetchProfileData();
  } else {
    console.log("⚠️ Tidak ada token, user dianggap belum login.");
    setUser(null);
    setLoading(false);
  }
}, []);


const handleLogout = async () => {
  const confirm = await Swal.fire({
    title: "Yakin ingin logout?",
    text: "Kamu akan keluar dari akun ini.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Ya, logout",
    cancelButtonText: "Batal",
    reverseButtons: true,
  });

  if (confirm.isConfirmed) {
    try {
      const refreshToken = localStorage.getItem("refreshToken");

      // Logout API
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      // Hapus data lokal
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");

      setUser(null);

      // Tampilkan notifikasi sukses
      Swal.fire({
        icon: "success",
        title: "Logout Berhasil",
        text: "Kamu telah keluar dari akun.",
        showConfirmButton: false,
        timer: 1500,
      });

      setTimeout(() => router.push("/login"), 1500);
    } catch (err) {
      console.error("Gagal logout:", err);
      Swal.fire({
        icon: "error",
        title: "Gagal Logout",
        text: "Terjadi kesalahan. Silakan coba lagi.",
      });
    }
  }
};


  const isActiveLink = (href: string) => pathname === href;

  // Get profile photo URL
  const getProfilePhotoUrl = () => {
    if (!user) return null;
    return user.profile_photo_url || user.foto || null;
  };

  const profilePhotoUrl = getProfilePhotoUrl();
  const translatedNavigation = getTranslatedNavigation(currentLanguage.code);

  return (
    <nav className="fixed top-0 left-0 w-full bg-gradient-to-r from-[#0A1FB5] to-[#0A18E0] text-white shadow-md z-50">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Brand */}
        <Link
          href="/"
          className="text-xl font-bold hover:text-yellow-400 transition-colors"
        >
          STTICAREER
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6">
          {translatedNavigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`hover:text-yellow-400 transition-colors whitespace-nowrap ${
                isActiveLink(item.href) ? "text-yellow-400" : ""
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Right side - Desktop */}
        <div className="hidden md:flex items-center space-x-4">
          {loading ? (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gray-400 animate-pulse"></div>
              <div className="w-20 h-4 bg-gray-400 rounded animate-pulse"></div>
            </div>
          ) : !user ? (
            <Link
              href="/login"
              className="bg-yellow-400 text-blue-900 px-6 py-2 rounded-lg font-medium hover:bg-yellow-500 transition-colors whitespace-nowrap"
            >
              {getTranslation("Login", currentLanguage.code)}
            </Link>
          ) : (
            <div className="flex items-center space-x-4">
              {/* Profile */}
              <Link
                href={`/pelamar/profile/${user.id}`}
                className="flex items-center space-x-2 hover:text-yellow-400 transition-colors"
              >
                {profilePhotoUrl ? (
                  <Image
                    src={profilePhotoUrl}
                    alt={`${user.full_name} profile`}
                    width={40}
                    height={40}
                    className="w-8 h-8 rounded-full border-2 border-white object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow-400 text-blue-900 font-bold">
                    {user.full_name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="max-w-32 truncate">{user.full_name}</span>
              </Link>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors whitespace-nowrap"
              >
                {getTranslation("Logout", currentLanguage.code)}
              </button>
            </div>
          )}

          {/* Language Dropdown - Desktop */}
          <div className="relative" ref={languageDropdownRef}>
            <button
              onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
              className="flex items-center space-x-1 hover:text-yellow-400 transition-colors px-2 py-1 rounded-md"
            >
              <span className="text-lg">{currentLanguage.flag}</span>
              <span className="text-sm">
                {currentLanguage.code.toUpperCase()}
              </span>
              <ChevronDown
                size={16}
                className={`transform transition-transform ${
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
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden px-6 pb-4 border-t border-blue-600">
          <div className="flex flex-col space-y-2 mt-4">
            {translatedNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md hover:bg-blue-700 transition-colors ${
                  isActiveLink(item.href) ? "text-yellow-400 bg-blue-700" : ""
                }`}
              >
                {item.name}
              </Link>
            ))}

            <div className="border-t border-blue-600 pt-4 mt-4 space-y-2">
              {loading ? (
                <div className="flex items-center space-x-2 px-3 py-2">
                  <div className="w-8 h-8 rounded-full bg-gray-400 animate-pulse"></div>
                  <div className="w-20 h-4 bg-gray-400 rounded animate-pulse"></div>
                </div>
              ) : !user ? (
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block bg-yellow-400 text-blue-900 px-3 py-2 rounded-md font-medium text-center hover:bg-yellow-500 transition-colors"
                >
                  {getTranslation("Login", currentLanguage.code)}
                </Link>
              ) : (
                <>
                  {/* Profile mobile */}
                  <Link
                    href={`/pelamar/profile/${user.id}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    {profilePhotoUrl ? (
                      <Image
                        src={profilePhotoUrl}
                        alt={`${user.full_name} profile`}
                        width={40}
                        height={40}
                        className="w-8 h-8 rounded-full border-2 border-white object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow-400 text-blue-900 font-bold">
                        {user.full_name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="truncate">{user.full_name}</span>
                  </Link>

                  {/* Logout mobile */}
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-left bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600 transition-colors"
                  >
                    {getTranslation("Logout", currentLanguage.code)}
                  </button>
                </>
              )}

              {/* Language Dropdown Mobile */}
              <div className="relative" ref={mobileLanguageDropdownRef}>
                <button
                  onClick={() =>
                    setIsMobileLanguageDropdownOpen(
                      !isMobileLanguageDropdownOpen
                    )
                  }
                  className="w-full flex items-center justify-between px-3 py-2 hover:bg-blue-700 rounded-md transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{currentLanguage.flag}</span>
                    <span>{currentLanguage.name}</span>
                  </div>
                  <ChevronDown
                    size={16}
                    className={`transform transition-transform ${
                      isMobileLanguageDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isMobileLanguageDropdownOpen && (
                  <div className="mt-2 bg-blue-800 rounded-md py-1 ml-4">
                    {languages.map((language) => (
                      <button
                        key={language.code}
                        onClick={() => handleLanguageChange(language)}
                        className={`w-full px-4 py-2 text-left flex items-center space-x-2 hover:bg-blue-700 transition-colors ${
                          currentLanguage.code === language.code
                            ? "bg-blue-700 text-yellow-400"
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
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
