import React, { createContext, useContext, useState } from 'react';
import { translations } from '../i18n/translations';

type Language = 'en' | 'pt' | 'pt-PT' | 'es' | 'ja' | 'zh' | 'id' | 'fr' | 'de' | 'ar' | 'ko' | 'hi' | 'it' | 'ru' | 'tr' | 'nl' | 'pl' | 'sv' | 'vi' | 'th' | 'uk' | 'cs' | 'da' | 'no' | 'fi' | 'hu' | 'el' | 'he' | 'ro' | 'sk' | 'bg' | 'lt' | 'lv' | 'et' | 'sl' | 'haw';
type Translations = typeof translations.en;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const value = {
    language,
    setLanguage,
    t: translations[language],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}