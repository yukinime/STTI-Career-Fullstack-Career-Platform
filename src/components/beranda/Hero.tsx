"use client";

import { useEffect, useState } from "react";

interface HeroTranslations {
  [key: string]: {
    title1: string;
    title2: string;
    brandName: string;
  };
}

// Static translations for Hero section
const heroTranslations: HeroTranslations = {
  'id': {
    title1: "Mudah Menemukan",
    title2: "Pekerjaan Impian Anda di",
    brandName: "STTICAREER"
  },
  'en': {
    title1: "It's Easy to Find",
    title2: "Your Dream Job at",
    brandName: "STTICAREER"
  },
  'ja': {
    title1: "簡単に見つけられます",
    title2: "あなたの夢の仕事を",
    brandName: "STTICAREER"
  }
};

export default function Hero() {
  const [currentLanguage, setCurrentLanguage] = useState('id');
  const [translations, setTranslations] = useState(heroTranslations['id']);

  useEffect(() => {
    const getSavedLanguage = () => {
      try {
        const savedLanguage = localStorage.getItem('selectedLanguage');
        return savedLanguage || 'id';
      } catch (error) {
        console.error('Error reading saved language:', error);
        return 'id';
      }
    };

    const updateTranslations = (langCode: string) => {
      const translation = heroTranslations[langCode] || heroTranslations['id'];
      setTranslations(translation);
      setCurrentLanguage(langCode);
    };

    const initialLanguage = getSavedLanguage();
    updateTranslations(initialLanguage);

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'selectedLanguage' && e.newValue) {
        updateTranslations(e.newValue);
      }
    };

    const handleLanguageChange = (e: CustomEvent) => {
      if (e.detail && e.detail.language) {
        updateTranslations(e.detail.language);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('languageChanged', handleLanguageChange as EventListener);

    const pollInterval = setInterval(() => {
      const currentSavedLanguage = getSavedLanguage();
      if (currentSavedLanguage !== currentLanguage) {
        updateTranslations(currentSavedLanguage);
      }
    }, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('languageChanged', handleLanguageChange as EventListener);
      clearInterval(pollInterval);
    };
  }, [currentLanguage]);

  // Dynamic classes based on language and content length
  const getTextClasses = () => {
    const baseClasses = {
      desktop: {
        container: "w-3/5 flex flex-col justify-center pl-8 lg:pl-16 pb-20 lg:pb-40",
        spacing: "gap-y-2 lg:gap-y-4",
        title1: {
          'id': "text-4xl lg:text-6xl xl:text-7xl 2xl:text-8xl leading-tight",
          'en': "text-3xl lg:text-5xl xl:text-6xl 2xl:text-7xl leading-tight",
          'ja': "text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl leading-relaxed"
        },
        title2: {
          'id': "text-3xl lg:text-5xl xl:text-6xl 2xl:text-7xl leading-tight",
          'en': "text-2xl lg:text-4xl xl:text-5xl 2xl:text-6xl leading-tight", 
          'ja': "text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl leading-relaxed"
        },
        brand: {
          'id': "text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl leading-tight",
          'en': "text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl leading-tight",
          'ja': "text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl leading-relaxed"
        }
      },
      mobile: {
        container: "relative z-20 flex flex-col items-center justify-center text-center px-4 sm:px-6 h-full",
        wrapper: "flex flex-col gap-y-2 sm:gap-y-3 text-[#0A1FB5] max-w-xs sm:max-w-md lg:max-w-lg mx-auto",
        title1: {
          'id': "text-2xl sm:text-3xl md:text-4xl leading-tight",
          'en': "text-xl sm:text-2xl md:text-3xl leading-tight",
          'ja': "text-lg sm:text-xl md:text-2xl leading-relaxed"
        },
        title2: {
          'id': "text-xl sm:text-2xl md:text-3xl leading-tight",
          'en': "text-lg sm:text-xl md:text-2xl leading-tight",
          'ja': "text-base sm:text-lg md:text-xl leading-relaxed"
        },
        brand: {
          'id': "text-xl sm:text-2xl md:text-3xl leading-tight",
          'en': "text-xl sm:text-2xl md:text-3xl leading-tight",
          'ja': "text-lg sm:text-xl md:text-2xl leading-relaxed"
        }
      }
    };

    return baseClasses;
  };

  const classes = getTextClasses();

  return (
    <section className="relative h-screen overflow-hidden">
      {/* ================= Desktop ================= */}
      <div className="hidden md:block relative bg-gradient-to-r from-[#0A1FB5] to-[#0A18E0] h-full">
        {/* Background layers */}
        <div className="absolute top-0 left-0 w-full h-full flex">
          {/* Left white background */}
          <div className="w-3/5 h-[90%] bg-white rounded-br-[40px]"></div>

          {/* Right white background with image */}
          <div className="w-2/5 h-full relative">
            <div className="left-0 bottom-10 w-3/4 h-full flex flex-col relative">
              {/* Top white area */}
              <div className="h-[65%] w-full bg-white relative z-0"></div>

              {/* Image overlap area */}
              <div className="flex-1 flex items-end justify-center relative z-10">
                <img
                  src="/Group 61.png"
                  alt="foto group"
                  className="w-full object-contain relative z-20 -mt-60 lg:-mt-80"
                />
              </div>
            </div>

            {/* Right corner white box */}
            <div className="absolute right-0 bottom-[10%] w-1/4 h-[90%] bg-white rounded-bl-[40px]"></div>
          </div>
        </div>

        {/* Main content */}
        <div className="relative z-10 flex h-full">
          <div className={classes.desktop.container}>
            <div className={`flex flex-col ${classes.desktop.spacing} transition-all duration-500 ease-in-out`}>
              <h1 className={`font-bold transition-all duration-500 ease-in-out ${
                classes.desktop.title1[currentLanguage as keyof typeof classes.desktop.title1]
              }`}>
                {translations.title1}
              </h1>
              <h2 className={`font-bold transition-all duration-500 ease-in-out ${
                classes.desktop.title2[currentLanguage as keyof typeof classes.desktop.title2]
              }`}>
                {translations.title2}
              </h2>
              <p className={`font-bold bg-gradient-to-r from-[#0A1FB5] to-[#2C6CF6] bg-clip-text text-transparent transition-all duration-500 ease-in-out ${
                classes.desktop.brand[currentLanguage as keyof typeof classes.desktop.brand]
              }`}>
                {translations.brandName}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ================= Mobile ================= */}
      <div className="block md:hidden relative bg-gradient-to-r from-[#0A1FB5] to-[#0A18E0] h-full overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 flex">
          {/* Left white */}
          <div className="w-1/5 h-[80%] bg-white rounded-br-[40px]"></div>

          {/* Center white with image */}
          <div className="flex-1 flex flex-col">
            <div className="h-[60%] sm:h-[65%] w-full bg-white flex items-end justify-center relative">
              <img
                src="/Group 61.png"
                alt="foto group"
                className="w-full max-w-xs sm:max-w-sm object-contain relative z-10 -mb-32 sm:-mb-40"
              />
            </div>
            <div className="flex-1"></div>
          </div>

          {/* Right white */}
          <div className="w-1/5 h-[80%] bg-white rounded-bl-[40px]"></div>
        </div>

        {/* Main content - adaptive positioning */}
        <div className={classes.mobile.container}>
          <div className={`${classes.mobile.wrapper} transition-all duration-500 ease-in-out`}>
            <h1 className={`font-bold transition-all duration-500 ease-in-out ${
              classes.mobile.title1[currentLanguage as keyof typeof classes.mobile.title1]
            }`}>
              {translations.title1}
            </h1>
            <h2 className={`font-bold transition-all duration-500 ease-in-out ${
              classes.mobile.title2[currentLanguage as keyof typeof classes.mobile.title2]
            }`}>
              {translations.title2}
            </h2>
            <p className={`font-bold bg-gradient-to-r from-[#0A1FB5] to-[#2C6CF6] bg-clip-text text-transparent transition-all duration-500 ease-in-out ${
              classes.mobile.brand[currentLanguage as keyof typeof classes.mobile.brand]
            }`}>
              {translations.brandName}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}