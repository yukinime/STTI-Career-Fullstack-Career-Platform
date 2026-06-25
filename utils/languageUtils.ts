// utils/languageUtils.ts
export interface LanguageChangeEvent extends CustomEvent {
  detail: {
    language: string;
    previousLanguage?: string;
  };
}

// Dispatch language change event to notify other components
export const dispatchLanguageChange = (newLanguage: string, previousLanguage?: string) => {
  const event: LanguageChangeEvent = new CustomEvent('languageChanged', {
    detail: {
      language: newLanguage,
      previousLanguage
    }
  });
  
  window.dispatchEvent(event);
};

// Get current language from localStorage
export const getCurrentLanguage = (): string => {
  try {
    return localStorage.getItem('selectedLanguage') || 'id';
  } catch (error) {
    console.error('Error reading current language:', error);
    return 'id';
  }
};

// Set language and notify components
export const setLanguage = (language: string) => {
  const previousLanguage = getCurrentLanguage();
  localStorage.setItem('selectedLanguage', language);
  dispatchLanguageChange(language, previousLanguage);
};

// Hook for listening to language changes
export const useLanguageChange = (callback: (language: string) => void) => {
  if (typeof window !== 'undefined') {
    const handleLanguageChange = (e: CustomEvent) => {
      if (e.detail && e.detail.language) {
        callback(e.detail.language);
      }
    };

    window.addEventListener('languageChanged', handleLanguageChange as EventListener);
    
    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange as EventListener);
    };
  }
  
  return () => {};
};