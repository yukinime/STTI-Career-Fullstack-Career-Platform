"use client";

import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  Users,
  UserCheck,
  Building2,
} from "lucide-react";
import Image from "next/image";

// Translation interfaces
interface TranslationSet {
  [key: string]: {
    [lang: string]: string;
  };
}

interface ReviewTranslations {
  [key: string]: {
    [lang: string]: {
      name: string;
      role: string;
      company: string;
      date: string;
      review: string;
    };
  };
}

// Language change event interface
interface LanguageChangeEvent extends CustomEvent {
  detail: {
    language: string;
    previousLanguage?: string;
  };
}

type Review = {
  id: number;
  name: string;
  role: string;
  company: string;
  date: string;
  review: string;
  avatar: string;
  rating: number;
};

// Static translations for UI elements
const translations: TranslationSet = {
  reviewTitle: {
    id: "Ulasan",
    en: "Reviews",
    ja: "レビュー",
  },
  seeMore: {
    id: "Lihat Selengkapnya",
    en: "See More",
    ja: "もっと見る",
  },
  helpedJobseekers: {
    id: "Kami Telah Membantu",
    en: "We Have Helped",
    ja: "私たちは助けました",
  },
  jobseekersHighlight: {
    id: "Pencari Kerja",
    en: "Jobseekers",
    ja: "求職者",
  },
  gainCareerOpportunities: {
    id: "Mendapatkan Peluang Karier",
    en: "Gain Career Opportunities",
    ja: "キャリアの機会を得る",
  },
  supportDescription: {
    id: "STTICAREER telah mendukung banyak pencari kerja di seluruh dunia",
    en: "STTICAREER has supported many jobseekers around the world",
    ja: "STTICAREERは世界中の多くの求職者をサポートしてきました",
  },
  registeredApplicants: {
    id: "Pelamar Terdaftar",
    en: "Registered Applicants",
    ja: "登録応募者",
  },
  activeApplicants: {
    id: "Pelamar Aktif Melamar",
    en: "Active Job Applicants",
    ja: "アクティブな応募者",
  },
  companies: {
    id: "Perusahaan",
    en: "Companies",
    ja: "企業",
  },
};

// Review content translations
const reviewTranslations: ReviewTranslations = {
  "1": {
    id: {
      name: "Agra Maesa Kusumah",
      role: "Frontend Developer",
      company: "PT Developer Groups Community",
      date: "20 Juli 2024",
      review:
        "STTICAREER membantu saya menemukan pekerjaan impian dengan cepat. Platformnya mudah digunakan dan sangat membantu!",
    },
    en: {
      name: "Agra Maesa Kusumah",
      role: "Frontend Developer",
      company: "PT Developer Groups Community",
      date: "July 20, 2024",
      review:
        "STTICAREER helped me find my dream job quickly. The platform is easy to use and very helpful!",
    },
    ja: {
      name: "Agra Maesa Kusumah",
      role: "フロントエンド開発者",
      company: "PT Developer Groups Community",
      date: "2024年7月20日",
      review:
        "STTICAREERのおかげで理想の仕事を素早く見つけることができました。プラットフォームは使いやすく、とても役立ちます！",
    },
  },
  "2": {
    id: {
      name: "Jerry Jhonatan",
      role: "Backend Engineer",
      company: "PT TechnoWorks ID",
      date: "15 Agustus 2024",
      review:
        "Saya berhasil mendapat pekerjaan dalam waktu 2 minggu setelah melamar melalui STTICAREER.",
    },
    en: {
      name: "Jerry Jhonatan",
      role: "Backend Engineer",
      company: "PT TechnoWorks ID",
      date: "August 15, 2024",
      review:
        "I successfully got a job within 2 weeks after applying through STTICAREER.",
    },
    ja: {
      name: "Jerry Jhonatan",
      role: "バックエンドエンジニア",
      company: "PT TechnoWorks ID",
      date: "2024年8月15日",
      review:
        "STTICAREERを通じて応募してから2週間以内に仕事を得ることができました。",
    },
  },
  "3": {
    id: {
      name: "Muhammad Rizal",
      role: "UI/UX Designer",
      company: "Palugada Store",
      date: "1 September 2024",
      review:
        "Desain platformnya clean dan lowongan kerja selalu up-to-date. Sangat direkomendasikan!",
    },
    en: {
      name: "Muhammad Rizal",
      role: "UI/UX Designer",
      company: "Palugada Store",
      date: "September 1, 2024",
      review:
        "The platform design is clean and job listings are always up-to-date. Highly recommended!",
    },
    ja: {
      name: "Muhammad Rizal",
      role: "UI/UXデザイナー",
      company: "Palugada Store",
      date: "2024年9月1日",
      review:
        "プラットフォームのデザインはクリーンで、求人情報は常に最新です。強くお勧めします！",
    },
  },
  "4": {
    id: {
      name: "Abdul Japar",
      role: "Data Scientist",
      company: "PT Techno Insights AI",
      date: "28 Juli 2024",
      review:
        "Banyak perusahaan besar yang membuka lowongan di sini. Saya langsung dapat interview di minggu pertama.",
    },
    en: {
      name: "Abdul Japar",
      role: "Data Scientist",
      company: "PT Techno Insights AI",
      date: "July 28, 2024",
      review:
        "Many big companies post job openings here. I got an interview in the first week.",
    },
    ja: {
      name: "Abdul Japar",
      role: "データサイエンティスト",
      company: "PT Techno Insights AI",
      date: "2024年7月28日",
      review:
        "多くの大企業がここで求人を掲載しています。最初の週に面接を受けることができました。",
    },
  },
};

// Utility functions
const getCurrentLanguage = (): string => {
  if (typeof window !== "undefined") {
    try {
      return localStorage.getItem("selectedLanguage") || "id";
    } catch (error) {
      console.error("Error reading current language:", error);
      return "id";
    }
  }
  return "id";
};

const getTranslation = (key: string, lang: string): string => {
  return translations[key]?.[lang] || translations[key]?.["id"] || key;
};

const getReviewTranslation = (reviewId: string, lang: string) => {
  return (
    reviewTranslations[reviewId]?.[lang] ||
    reviewTranslations[reviewId]?.["id"] ||
    null
  );
};

export default function Review() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentLanguage, setCurrentLanguage] = useState<string>("id");
  const itemsPerSlide = 3;

  // Create translated reviews based on current language
  const getTranslatedReviews = (): Review[] => {
    const baseReviews = [
      {
        id: 1,
        avatar: "/agra.jpg",
        rating: 5,
      },
      {
        id: 2,
        avatar: "/jery.jpg",
        rating: 4,
      },
      {
        id: 3,
        avatar: "/rizal.jpg",
        rating: 5,
      },
      {
        id: 4,
        avatar: "/japar.jpg",
        rating: 5,
      },
    ];

    return baseReviews.map((baseReview) => {
      const translation = getReviewTranslation(
        baseReview.id.toString(),
        currentLanguage
      );
      return {
        ...baseReview,
        name: translation?.name || `User ${baseReview.id}`,
        role: translation?.role || "Employee",
        company: translation?.company || "Company",
        date: translation?.date || new Date().toLocaleDateString(),
        review: translation?.review || "Great platform!",
      };
    });
  };

  const reviews = getTranslatedReviews();

  // Handle language change
  useEffect(() => {
    const handleLanguageChange = (e: CustomEvent) => {
      if (e.detail && e.detail.language) {
        setCurrentLanguage(e.detail.language);
        // Reset slider to first slide when language changes to prevent layout issues
        setCurrentIndex(0);
      }
    };

    // Set initial language
    setCurrentLanguage(getCurrentLanguage());

    // Listen for language changes
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

  const nextSlide = () => {
    if (currentIndex + itemsPerSlide < reviews.length) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <section className="px-8 py-16 bg-white">
      {/* ===== ULASAN ===== */}
      <div className="mb-16">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">
            {getTranslation("reviewTitle", currentLanguage)}{" "}
            <span className="text-blue-700">STTICAREER</span>
          </h2>
          <a href="#" className="text-blue-600 hover:underline text-sm">
            {getTranslation("seeMore", currentLanguage)}
          </a>
        </div>

        {/* Slider */}
        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="flex gap-6 transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${
                  currentIndex * (100 / itemsPerSlide)
                }%)`,
                width: `${(reviews.length / itemsPerSlide) * 100}%`,
              }}
            >
              {reviews.map((r) => (
                <div
                  key={`${r.id}-${currentLanguage}`}
                  className="bg-white border p-6 rounded-xl shadow-sm flex flex-col justify-between min-h-[260px] w-1/3"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <Image
                        src={r.avatar}
                        alt={r.name}
                        width={48}
                        height={48}
                        className="rounded-full object-cover"
                      />

                      <div>
                        <h3 className="font-semibold">{r.name}</h3>
                        <p className="text-sm text-gray-600">
                          {r.company} – {r.role}
                        </p>
                        <p className="text-xs text-gray-400">{r.date}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-4">
                      {r.review}
                    </p>
                  </div>
                  <div className="flex text-yellow-500 mt-auto">
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <Star key={i} size={16} fill="currentColor" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Controls */}
          {currentIndex > 0 && (
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-white border rounded-full p-2 shadow hover:shadow-md transition-shadow"
              aria-label="Previous reviews"
            >
              <ChevronLeft size={20} />
            </button>
          )}
          {currentIndex + itemsPerSlide < reviews.length && (
            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-white border rounded-full p-2 shadow hover:shadow-md transition-shadow"
              aria-label="Next reviews"
            >
              <ChevronRight size={20} />
            </button>
          )}
        </div>
      </div>

      {/* ===== STATISTIK ===== */}
      <div className="bg-gradient-to-r from-[#0A1FB5] to-[#0A18E0] text-white rounded-2xl px-10 py-12">
        <h2 className="text-2xl font-bold mb-2">
          {getTranslation("helpedJobseekers", currentLanguage)}{" "}
          <span className="text-green-400">
            {getTranslation("jobseekersHighlight", currentLanguage)}
          </span>{" "}
          {getTranslation("gainCareerOpportunities", currentLanguage)}
        </h2>
        <p className="text-sm text-gray-200 mb-10">
          {getTranslation("supportDescription", currentLanguage)}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <Users className="mx-auto mb-3 w-10 h-10" />
            <p className="text-2xl font-bold">100.000</p>
            <p className="text-sm">
              {getTranslation("registeredApplicants", currentLanguage)}
            </p>
          </div>
          <div>
            <UserCheck className="mx-auto mb-3 w-10 h-10" />
            <p className="text-2xl font-bold">10.000</p>
            <p className="text-sm">
              {getTranslation("activeApplicants", currentLanguage)}
            </p>
          </div>
          <div>
            <Building2 className="mx-auto mb-3 w-10 h-10" />
            <p className="text-2xl font-bold">10.000</p>
            <p className="text-sm">
              {getTranslation("companies", currentLanguage)}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
