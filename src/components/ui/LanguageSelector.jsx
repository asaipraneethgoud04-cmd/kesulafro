import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';

export default function LanguageSelector({ variant = 'default' }) {
  const { language, changeLanguage, currentLanguageObj, LANGUAGES } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code) => {
    changeLanguage(code);
    setIsOpen(false);
  };

  if (variant === 'mobile') {
    return (
      <div className="w-full py-2 border-t border-secondary/10 mt-2">
        <label className="text-xs font-bold uppercase tracking-wider text-on-surface/60 mb-2 block px-4">
          Select Language / ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ
        </label>
        <div className="grid grid-cols-2 gap-2 px-2">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleSelect(lang.code)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                language === lang.code
                  ? 'bg-primary text-white font-bold shadow-sm'
                  : 'bg-surface/50 text-on-surface/80 hover:bg-primary/10'
              }`}
            >
              <span className="text-sm">{lang.flag}</span>
              <span>{lang.nativeName}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/60 hover:bg-white/90 border border-primary/20 hover:border-primary/40 text-on-surface text-xs font-semibold shadow-sm transition-all duration-200"
        title="Change Language"
      >
        <span className="material-symbols-outlined text-primary text-base">language</span>
        <span className="font-bold">{currentLanguageObj.nativeName}</span>
        <span className="material-symbols-outlined text-xs transition-transform duration-200 text-on-surface/60">
          {isOpen ? 'expand_less' : 'expand_more'}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white shadow-xl ring-1 ring-black/5 divide-y divide-gray-100 focus:outline-none z-50 animate-in fade-in zoom-in-95 duration-150 p-1.5 border border-primary/15">
          <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-primary/70 border-b border-gray-100">
            Languages / ಭಾಷೆಗಳು
          </div>
          <div className="py-1">
            {LANGUAGES.map((lang) => {
              const isSelected = language === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => handleSelect(lang.code)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl transition-colors ${
                    isSelected
                      ? 'bg-primary/10 text-primary font-bold'
                      : 'text-on-surface/80 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span>{lang.flag}</span>
                    <span>{lang.nativeName}</span>
                  </div>
                  {isSelected && (
                    <span className="material-symbols-outlined text-sm text-primary">check</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
