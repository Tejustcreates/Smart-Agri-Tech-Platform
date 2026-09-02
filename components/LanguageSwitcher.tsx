import React from 'react';
import { useTranslation } from 'react-i18next';
import { setLanguage } from '../i18n';

const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { code: 'mr', label: 'Marathi', native: 'मराठी' },
];

export default function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { i18n } = useTranslation();

  return (
    <div className={`flex ${compact ? 'gap-1' : 'gap-2'}`}>
      {LANGUAGES.map((lang) => (
        <button
          key={lang.code}
          onClick={() => setLanguage(lang.code)}
          className={`tap-target px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
            i18n.language === lang.code
              ? 'bg-agri-green text-white shadow-md'
              : 'bg-white text-gray-600 hover:bg-green-50 border border-gray-200'
          }`}
        >
          {lang.native}
        </button>
      ))}
    </div>
  );
}
