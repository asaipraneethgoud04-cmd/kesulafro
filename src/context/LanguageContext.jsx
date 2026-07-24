import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, LANGUAGES } from '../i18n/translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('app_language') || 'en';
  });

  const changeLanguage = (langCode) => {
    if (translations[langCode]) {
      setLanguage(langCode);
      localStorage.setItem('app_language', langCode);
    }
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  // Helper function to resolve nested keys like 'hero.title'
  const t = (path, fallback = '') => {
    const keys = path.split('.');
    let current = translations[language] || translations.en;
    
    for (const key of keys) {
      if (current && current[key] !== undefined) {
        current = current[key];
      } else {
        // Fallback to English if key missing in selected language
        let fallbackObj = translations.en;
        for (const fKey of keys) {
          if (fallbackObj && fallbackObj[fKey] !== undefined) {
            fallbackObj = fallbackObj[fKey];
          } else {
            return fallback || path;
          }
        }
        return typeof fallbackObj === 'string' ? fallbackObj : (fallback || path);
      }
    }
    
    return typeof current === 'string' ? current : (fallback || path);
  };

  const currentLanguageObj = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t, currentLanguageObj, LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
