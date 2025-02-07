import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Globe } from 'lucide-react';

const LANGUAGE_NAMES = {
  en: 'English',
  pt: 'Português (BR)',
  'pt-PT': 'Português (PT)',
  es: 'Español',
  ja: '日本語',
  zh: '中文',
  id: 'Bahasa Indonesia',
  fr: 'Français',
  de: 'Deutsch',
  ar: 'العربية',
  ko: '한국어',
  hi: 'हिन्दी',
  it: 'Italiano',
  ru: 'Русский',
  tr: 'Türkçe',
  nl: 'Nederlands',
  pl: 'Polski',
  sv: 'Svenska',
  vi: 'Tiếng Việt',
  th: 'ไทย',
  uk: 'Українська',
  cs: 'Čeština',
  da: 'Dansk',
  no: 'Norsk',
  fi: 'Suomi',
  haw: 'Ōlelo Hawai',
};

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      <Globe className="w-5 h-5 text-gray-500" />
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as typeof language)}
        className="bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-700 hover:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
      >
        {Object.entries(LANGUAGE_NAMES).map(([code, name]) => (
          <option key={code} value={code}>
            {name}
          </option>
        ))}
      </select>
    </div>
  );
}