  "use client";

  import { useEffect, useState, useCallback } from "react";
  import { Search, MapPin } from "lucide-react";
  import Link from "next/link";

  // Work type
  const workTypeMap: Record<string, string> = {
    on_site: "onSite",
    remote: "remote",
    hybrid: "hybrid",
    field: "field",
  };

  // Work time
  const workTimeMap: Record<string, string> = {
    full_time: "fulltime",
    part_time: "partTime",
    freelance: "freelance",
    internship: "internship",
    contract: "contract",
    volunteer: "volunteer",
    seasonal: "seasonal",
  };

  // Job interface
  interface Job {
    id: number;
    job_title: string;
    company_id: number;
    company_name?: string; // optional
    company_logo?: string | null; // ✅ tambah ini
    job_description: string;
    salary_min?: number | null;
    salary_max?: number | null;
    location?: string | null;
    work_type?: string | null; // ✅ Tambah ini
    work_time?: string | null; // ✅ Dan ini
  }

  // Translated job interface (update)
  interface TranslatedJob extends Job {
    translated_job_title?: string;
    translated_job_description?: string;
    translated_location?: string | null;
    translated_company_name?: string;
  }

  // Translation interface
  interface JobTranslations {
    [key: string]: {
      findOpportunity: string;
      jobPlaceholder: string;
      locationPlaceholder: string;
      findJobBtn: string;
      featuredJobs: string;
      companyPrefix: string;
      fulltime: string;
      remote: string;
      partTime: string;
      onSite: string;
      salaryNotSpecified: string;
      applyNow: string;
      noJobsFound: string;
      loading: string;
      prev: string;
      next: string;
      translating: string;
    };
  }

  // Static translations
  const jobTranslations: JobTranslations = {
    id: {
      findOpportunity: "Temukan Peluang Karir Selanjutnya",
      jobPlaceholder: "Pekerjaan, Posisi, Kata Kunci atau Perusahaan",
      locationPlaceholder: "Kota, Provinsi, atau Wilayah",
      findJobBtn: "Cari Pekerjaan",
      featuredJobs: "Lowongan Pekerjaan Unggulan",
      companyPrefix: "Perusahaan #",
      fulltime: "Penuh Waktu",
      remote: "Remote",
      partTime: "Paruh Waktu",
      onSite: "Di Kantor",
      salaryNotSpecified: "Gaji tidak disebutkan",
      applyNow: "Lamar Sekarang",
      noJobsFound: "Tidak ada lowongan ditemukan",
      loading: "Memuat...",
      prev: "Sebelumnya",
      next: "Selanjutnya",
      translating: "Menerjemahkan...",
    },
    en: {
      findOpportunity: "Find Your Next Opportunity",
      jobPlaceholder: "Job, Title, Keyword or Company",
      locationPlaceholder: "City, Province, or Region",
      findJobBtn: "Find Job",
      featuredJobs: "Featured Job Listings",
      companyPrefix: "Company #",
      fulltime: "Fulltime",
      remote: "Remote",
      partTime: "Part-time",
      onSite: "On-site",
      salaryNotSpecified: "Salary not specified",
      applyNow: "Apply Now",
      noJobsFound: "No jobs found",
      loading: "Loading...",
      prev: "Previous",
      next: "Next",
      translating: "Translating...",
    },
    ja: {
      findOpportunity: "次のキャリア機会を見つけよう",
      jobPlaceholder: "職種、役職、キーワードまたは企業",
      locationPlaceholder: "市、県、または地域",
      findJobBtn: "求人検索",
      featuredJobs: "注目の求人情報",
      companyPrefix: "企業 #",
      fulltime: "フルタイム",
      remote: "リモート",
      partTime: "パートタイム",
      onSite: "オフィス勤務",
      salaryNotSpecified: "給与未記載",
      applyNow: "今すぐ応募",
      noJobsFound: "求人が見つかりません",
      loading: "読み込み中...",
      prev: "前",
      next: "次",
      translating: "翻訳中...",
    },
  };

  // Enhanced translation dictionary with more comprehensive mappings
  const enhancedTranslations: { [key: string]: { [word: string]: string } } = {
    en: {
      // Job titles and positions
      Pekerjaan: "Job",
      Lowongan: "Position",
      Perusahaan: "Company",
      Gaji: "Salary",
      Lokasi: "Location",
      Alamat: "Address",
      Pengalaman: "Experience",
      Pendidikan: "Education",
      Keterampilan: "Skills",
      "Tanggung jawab": "Responsibilities",
      Persyaratan: "Requirements",
      Kualifikasi: "Qualifications",
      Manfaat: "Benefits",
      Deskripsi: "Description",

      // Job types
      Developer: "Developer",
      Manager: "Manager",
      Analyst: "Analyst",
      Engineer: "Engineer",
      Designer: "Designer",
      Konsultan: "Consultant",
      Direktur: "Director",
      Supervisor: "Supervisor",
      Koordinator: "Coordinator",
      Asisten: "Assistant",
      Spesialis: "Specialist",
      Teknisi: "Technician",
      Operator: "Operator",
      Administrator: "Administrator",
      Sales: "Sales",
      Marketing: "Marketing",
      Keuangan: "Finance",
      Akuntansi: "Accounting",
      "Sumber Daya Manusia": "Human Resources",
      Operasional: "Operations",
      Produksi: "Production",
      Logistik: "Logistics",
      "Layanan Pelanggan": "Customer Service",

      // Locations
      Jakarta: "Jakarta",
      Bandung: "Bandung",
      Surabaya: "Surabaya",
      Medan: "Medan",
      Semarang: "Semarang",
      Makassar: "Makassar",
      Palembang: "Palembang",
      Depok: "Depok",
      Tangerang: "Tangerang",
      Bekasi: "Bekasi",
      Bogor: "Bogor",
      Yogyakarta: "Yogyakarta",
      Solo: "Solo",
      Malang: "Malang",
      Denpasar: "Denpasar",
      Balikpapan: "Balikpapan",
      Batam: "Batam",
      Pekanbaru: "Pekanbaru",
      Banjarmasin: "Banjarmasin",
      Samarinda: "Samarinda",
      Indonesia: "Indonesia",

      // Common phrases
      dan: "and",
      atau: "or",
      dengan: "with",
      untuk: "for",
      dalam: "in",
      pada: "at",
      dari: "from",
      ke: "to",
      yang: "that",
      ini: "this",
      itu: "that",
      adalah: "is",
      akan: "will",
      dapat: "can",
      harus: "must",
      bisa: "could",
      sudah: "already",
      belum: "not yet",
      tahun: "years",
      bulan: "months",
      hari: "days",
      jam: "hours",
      menit: "minutes",
      minimal: "minimum",
      maksimal: "maximum",
      diperlukan: "required",
      diutamakan: "preferred",
      wajib: "mandatory",
      opsional: "optional",
    },
    ja: {
      // Job titles and positions
      Pekerjaan: "仕事",
      Lowongan: "ポジション",
      Perusahaan: "会社",
      Gaji: "給与",
      Lokasi: "場所",
      Alamat: "住所",
      Pengalaman: "経験",
      Pendidikan: "教育",
      Keterampilan: "スキル",
      "Tanggung jawab": "責任",
      Persyaratan: "要件",
      Kualifikasi: "資格",
      Manfaat: "福利厚生",
      Deskripsi: "説明",

      // Job types
      Developer: "開発者",
      Manager: "マネージャー",
      Analyst: "アナリスト",
      Engineer: "エンジニア",
      Designer: "デザイナー",
      Konsultan: "コンサルタント",
      Direktur: "ディレクター",
      Supervisor: "スーパーバイザー",
      Koordinator: "コーディネーター",
      Asisten: "アシスタント",
      Spesialis: "スペシャリスト",
      Teknisi: "技術者",
      Operator: "オペレーター",
      Administrator: "管理者",
      Sales: "営業",
      Marketing: "マーケティング",
      Keuangan: "財務",
      Akuntansi: "会計",
      "Sumber Daya Manusia": "人事",
      Operasional: "運営",
      Produksi: "生産",
      Logistik: "物流",
      "Layanan Pelanggan": "カスタマーサービス",

      // Locations
      Jakarta: "ジャカルタ",
      Bandung: "バンドゥン",
      Surabaya: "スラバヤ",
      Medan: "メダン",
      Semarang: "スマラン",
      Makassar: "マカッサル",
      Palembang: "パレンバン",
      Depok: "デポック",
      Tangerang: "タンゲラン",
      Bekasi: "ブカシ",
      Bogor: "ボゴール",
      Yogyakarta: "ジョグジャカルタ",
      Solo: "ソロ",
      Malang: "マラン",
      Denpasar: "デンパサール",
      Balikpapan: "バリクパパン",
      Batam: "バタム",
      Pekanbaru: "プカンバル",
      Banjarmasin: "バンジャルマシン",
      Samarinda: "サマリンダ",
      Indonesia: "インドネシア",

      // Common phrases
      dan: "と",
      atau: "または",
      dengan: "と一緒に",
      untuk: "のために",
      dalam: "中で",
      pada: "で",
      dari: "から",
      ke: "へ",
      yang: "の",
      ini: "この",
      itu: "その",
      adalah: "です",
      akan: "します",
      dapat: "できる",
      harus: "必要",
      bisa: "できる",
      sudah: "もう",
      belum: "まだ",
      tahun: "年",
      bulan: "月",
      hari: "日",
      jam: "時間",
      menit: "分",
      minimal: "最小",
      maksimal: "最大",
      diperlukan: "必要",
      diutamakan: "優遇",
      wajib: "必須",
      opsional: "オプション",
    },
  };

  export default function Job() {
    // State management
    const [jobs, setJobs] = useState<TranslatedJob[]>([]);
    const [originalJobs, setOriginalJobs] = useState<Job[]>([]);
    const [page, setPage] = useState(1);
    const [itemsPerPage] = useState(6);
    const [loading, setLoading] = useState(true);
    const [translating, setTranslating] = useState(false);
    const [currentLanguage, setCurrentLanguage] = useState("id");
    const [translations, setTranslations] = useState(jobTranslations["id"]);

    // Enhanced translation function with better pattern matching
    const translateTextWithPatterns = useCallback((text: string, targetLang: string): string => {
      if (targetLang === "id" || !text) return text;

      const translationMap = enhancedTranslations[targetLang];
      if (!translationMap) return text;

      let translatedText = text;

      // Sort by length (longest first) to avoid partial replacements
      const sortedEntries = Object.entries(translationMap).sort((a, b) => b[0].length - a[0].length);

      sortedEntries.forEach(([original, translated]) => {
        // Use word boundaries to avoid partial matches
        const regex = new RegExp(`\\b${original.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "gi");
        translatedText = translatedText.replace(regex, translated);
      });

      return translatedText;
    }, []);

    // Server-side translation function (recommended approach)
    const translateViaServer = async (text: string, targetLang: string): Promise<string> => {
      try {
        // This should call your own API endpoint that handles translation
        const response = await fetch("/api/translate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text,
            targetLang,
            sourceLang: "id",
          }),
        });

        if (response.ok) {
          const result = await response.json();
          return result.translatedText || text;
        }
      } catch (error) {
        console.warn("Server translation failed, using pattern-based fallback:", error);
      }

      // Fallback to pattern-based translation
      return translateTextWithPatterns(text, targetLang);
    };

    // Main translation function
    const translateText = useCallback(
      async (text: string, targetLang: string): Promise<string> => {
        if (!text || text.trim() === "" || targetLang === "id") return text;

        // Try server-side translation first, fallback to pattern-based
        try {
          return await translateViaServer(text, targetLang);
        } catch (error) {
          console.warn("Translation failed, using pattern-based fallback");
          return translateTextWithPatterns(text, targetLang);
        }
      },
      [translateTextWithPatterns]
    );

    // Translate jobs function with improved error handling
    const translateJobs = useCallback(
      async (jobsToTranslate: Job[], targetLang: string): Promise<TranslatedJob[]> => {
        if (targetLang === "id") {
          return jobsToTranslate.map((job) => ({ ...job }));
        }

        setTranslating(true);
        console.log(`Starting translation of ${jobsToTranslate.length} jobs to ${targetLang}`);

        try {
          const translatedJobs = await Promise.all(
            jobsToTranslate.map(async (job) => {
              try {
                const [translatedTitle, translatedDescription, translatedLocation] = await Promise.all([
                  translateText(job.job_title, targetLang),
                  translateText(job.job_description, targetLang),
                  job.location ? translateText(job.location, targetLang) : Promise.resolve(job.location),
                ]);

                return {
                  ...job,
                  translated_job_title: translatedTitle,
                  translated_job_description: translatedDescription,
                  translated_location: translatedLocation,
                };
              } catch (error) {
                console.error(`Failed to translate job ${job.id}:`, error);
                // Return job with pattern-based fallback translation
                return {
                  ...job,
                  translated_job_title: translateTextWithPatterns(job.job_title, targetLang),
                  translated_job_description: translateTextWithPatterns(job.job_description, targetLang),
                  translated_location: job.location ? translateTextWithPatterns(job.location, targetLang) : job.location,
                };
              }
            })
          );

          console.log(`Translation completed for ${translatedJobs.length} jobs`);
          return translatedJobs;
        } catch (error) {
          console.error("Batch translation failed:", error);
          // Return jobs with pattern-based translations
          return jobsToTranslate.map((job) => ({
            ...job,
            translated_job_title: translateTextWithPatterns(job.job_title, targetLang),
            translated_job_description: translateTextWithPatterns(job.job_description, targetLang),
            translated_location: job.location ? translateTextWithPatterns(job.location, targetLang) : job.location,
          }));
        } finally {
          setTranslating(false);
        }
      },
      [translateText, translateTextWithPatterns]
    );

    // Language change effect
    useEffect(() => {
      const getSavedLanguage = () => {
        try {
          if (typeof window !== "undefined") {
            return localStorage.getItem("selectedLanguage") || "id";
          }
          return "id";
        } catch (error) {
          console.error("Error reading saved language:", error);
          return "id";
        }
      };

      const updateTranslations = async (langCode: string) => {
        const translation = jobTranslations[langCode] || jobTranslations["id"];
        setTranslations(translation);

        if (langCode !== currentLanguage) {
          setCurrentLanguage(langCode);

          // Re-translate jobs if we have original jobs and language changed
          if (originalJobs.length > 0) {
            const translatedJobs = await translateJobs(originalJobs, langCode);
            setJobs(translatedJobs);
          }
        }
      };

      // Set initial language
      const initialLanguage = getSavedLanguage();
      updateTranslations(initialLanguage);

      // Listen for language changes
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === "selectedLanguage" && e.newValue) {
          updateTranslations(e.newValue);
        }
      };

      const handleLanguageChange = (e: CustomEvent) => {
        if (e.detail && e.detail.language) {
          updateTranslations(e.detail.language);
        }
      };

      if (typeof window !== "undefined") {
        window.addEventListener("storage", handleStorageChange);
        window.addEventListener("languageChanged", handleLanguageChange as EventListener);

        return () => {
          window.removeEventListener("storage", handleStorageChange);
          window.removeEventListener("languageChanged", handleLanguageChange as EventListener);
        };
      }
    }, [currentLanguage, originalJobs, translateJobs]);

    // Fetch jobs effect
    useEffect(() => {
      const fetchJobs = async () => {
        try {
          setLoading(true);
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs`);
          const json = await res.json();

          if (json.success && Array.isArray(json.data)) {
            const fetchedJobs = json.data;
            setOriginalJobs(fetchedJobs);

            // Translate jobs to current language if not Indonesian
            const translatedJobs = await translateJobs(fetchedJobs, currentLanguage);
            setJobs(translatedJobs);
          } else {
            setJobs([]);
            setOriginalJobs([]);
          }
        } catch (error) {
          console.error("Error fetching jobs:", error);
          setJobs([]);
          setOriginalJobs([]);
        } finally {
          setLoading(false);
        }
      };

      fetchJobs();
    }, []); // Only run on mount

    // Pagination logic
    const totalPages = Math.ceil(jobs.length / itemsPerPage);
    const startIdx = (page - 1) * itemsPerPage;
    const currentJobs = jobs.slice(startIdx, startIdx + itemsPerPage);

    // Visible pages logic
    const windowSize = 3;
    let startPage = Math.max(1, page - 1);
    let endPage = startPage + windowSize - 1;
    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - windowSize + 1);
    }
    const visiblePages = [];
    for (let i = startPage; i <= endPage; i++) {
      visiblePages.push(i);
    }

    // Format salary
  const formatSalary = (min?: number | null, max?: number | null) => {
    if (min == null && max == null) return "Negotiable";

    if (min != null && max != null) {
      const currency = currentLanguage === "ja" ? "¥" : "Rp";
      const locale =
        currentLanguage === "ja"
          ? "ja-JP"
          : currentLanguage === "en"
          ? "en-US"
          : "id-ID";

      return `${currency} ${min.toLocaleString(locale)} - ${currency} ${max.toLocaleString(locale)}`;
    }

    return translations.salaryNotSpecified;
  };


    // Get display text for job fields
    const getJobTitle = (job: TranslatedJob) => {
      return job.translated_job_title || job.job_title;
    };

    const getJobDescription = (job: TranslatedJob) => {
      return job.translated_job_description || job.job_description;
    };

    const getJobLocation = (job: TranslatedJob) => {
      return job.translated_location || job.location || "Indonesia";
    };

    return (
      <section className="min-h-screen px-4 sm:px-8 py-12 bg-gray-50">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className={`font-semibold transition-all duration-300 ${currentLanguage === "ja" ? "text-xl sm:text-2xl" : "text-2xl sm:text-3xl"}`}>{translations.findOpportunity}</h1>

          {/* Translation status indicator */}
          {translating && (
            <div className="mt-2 text-blue-600 text-sm flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              {translations.translating}
            </div>
          )}
        </div>

        {/* Search bar */}
        <div className="flex flex-col sm:flex-row justify-center gap-2 mb-12 max-w-4xl mx-auto">
          <div className="flex items-center bg-white px-4 py-2 rounded-lg shadow-md flex-1 sm:max-w-md">
            <Search className="w-5 h-5 text-gray-400 mr-2 flex-shrink-0" />
            <input type="text" placeholder={translations.jobPlaceholder} className="w-full focus:outline-none text-sm" />
          </div>
          <div className="flex items-center bg-white px-4 py-2 rounded-lg shadow-md flex-1 sm:max-w-xs">
            <MapPin className="w-5 h-5 text-gray-400 mr-2 flex-shrink-0" />
            <input type="text" placeholder={translations.locationPlaceholder} className="w-full focus:outline-none text-sm" />
          </div>
          <button className={`bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition-colors whitespace-nowrap ${currentLanguage === "ja" ? "text-sm" : ""}`}>{translations.findJobBtn}</button>
        </div>

        {/* Featured Job Listings */}
        <div className="max-w-7xl mx-auto">
          <h2 className={`font-semibold mb-6 ${currentLanguage === "ja" ? "text-lg sm:text-xl" : "text-xl sm:text-2xl"}`}>{translations.featuredJobs}</h2>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-gray-500 flex items-center gap-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-500"></div>
                {translations.loading}
              </div>
            </div>
          ) : currentJobs.length === 0 ? (
            <div className="text-center py-20 text-gray-500">{translations.noJobsFound}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentJobs.map((job) => (
                <div key={`${job.id}-${currentLanguage}`} className={`bg-white p-6 rounded-2xl shadow hover:shadow-lg transition-all duration-300 flex flex-col justify-between min-h-[320px] ${translating ? "opacity-70" : ""}`}>
                  {/* Header */}
                  <div className="flex items-start gap-3 mb-4">
                    {job.company_logo ? (
                    <img
                      src={job.company_logo.startsWith("http")
                        ? job.company_logo
                        : `${process.env.NEXT_PUBLIC_API_URL}/uploads/company_logos/${job.company_logo}`}
                      alt={job.company_name || "company logo"}
                      className="w-12 h-12 rounded-full object-cover flex-shrink-0 border border-gray-200"
                    />
                  ) : (
    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 border border-gray-300">
      <span className="text-gray-500 text-sm font-medium">C</span>
    </div>
  )}

                    <div className="min-w-0">
                      <h3 className={`font-semibold line-clamp-2 transition-all duration-300 ${currentLanguage === "ja" ? "text-base" : "text-lg"}`}>{getJobTitle(job)}</h3>
                  <p className="text-gray-600 text-sm truncate">
    {job.company_name || `${translations.companyPrefix}${job.company_id}`}
  </p>

                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-500 text-sm mb-4 line-clamp-3 flex-grow transition-all duration-300">{getJobDescription(job)}</p>

              {/* Tags */}
  <div className="flex gap-2 flex-wrap mb-4">
    {job.work_time && (
      <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
      {translations[workTimeMap[job.work_time] as keyof typeof translations] || job.work_time}
      </span>
    )}

    {job.work_type && (
      <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">
        {translations[workTypeMap[job.work_type] as keyof typeof translations] || job.work_type}
      </span>
    )}
  </div>

                  {/* Salary */}
                  <div className="mb-4">
                    <span className={`text-xs bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full ${currentLanguage === "ja" ? "text-xs" : ""}`}>{formatSalary(job.salary_min, job.salary_max)}</span>
                  </div>

                  {/* Footer: location + button */}
                  <div className="flex justify-between items-center">
                    <p className="text-gray-600 text-sm truncate mr-2 transition-all duration-300">{getJobLocation(job)}</p>
                    <Link href={`/lowongan/${job.id}`} className={`bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors whitespace-nowrap ${currentLanguage === "ja" ? "text-xs" : "text-sm"}`}>
                      {translations.applyNow}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-10 flex-wrap">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                className="px-3 py-2 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                disabled={page === 1 || translating}
                title={translations.prev}
              >
                &lt;
              </button>

              {visiblePages.map((num) => (
                <button
                  key={num}
                  className={`px-3 py-2 rounded text-sm transition-colors ${page === num ? "bg-blue-600 text-white" : "hover:bg-gray-200"} ${translating ? "opacity-50 cursor-not-allowed" : ""}`}
                  onClick={() => !translating && setPage(num)}
                  disabled={translating}
                >
                  {num}
                </button>
              ))}

              <button
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                className="px-3 py-2 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                disabled={page === totalPages || translating}
                title={translations.next}
              >
                &gt;
              </button>
            </div>
          )}
        </div>
      </section>
    );
  }
