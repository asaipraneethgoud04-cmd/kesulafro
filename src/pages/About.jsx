import React from 'react';
import { motion } from 'framer-motion';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useLanguage } from '../context/LanguageContext';

export default function About() {
  const { t } = useLanguage();
  useScrollReveal();

  return (
    <div className="relative overflow-hidden bg-background text-on-surface">
      {/* Background glow blobs */}
      <div className="absolute top-[5%] left-[-10%] w-[45vw] h-[45vw] rounded-full blur-[130px] opacity-10 bg-primary pointer-events-none z-0"></div>
      <div className="absolute top-[35%] right-[-15%] w-[40vw] h-[40vw] rounded-full blur-[130px] opacity-[0.08] bg-secondary pointer-events-none z-0"></div>
      <div className="absolute bottom-[10%] left-[-10%] w-[50vw] h-[50vw] rounded-full blur-[140px] opacity-[0.06] bg-primary pointer-events-none z-0"></div>

      {/* Hero Section */}
      <section className="relative min-h-[500px] md:min-h-[600px] lg:min-h-[800px] flex items-center justify-center pt-32 pb-20 md:pt-48 md:pb-24 z-10 reveal overflow-hidden bg-cover bg-center bg-fixed" style={{ backgroundImage: "url('/images/contact1.webp')" }}>
        <div className="absolute inset-0 bg-black/60 z-0 pointer-events-none"></div>
        <div className="max-w-container mx-auto px-gutter text-center relative z-10 w-full">
          <span className="text-white font-extrabold text-xs uppercase tracking-[0.25em] block mb-3 text-shadow-md">{t('nav.about')}</span>
          <h1 className="text-[44px] md:text-[56px] lg:text-[72px] font-bold text-white mb-6 leading-[1.05] tracking-tight max-w-4xl mx-auto text-shadow-lg">
            {t('about.title')}
          </h1>
          <p className="text-base md:text-lg text-white/95 max-w-2xl mx-auto leading-relaxed font-medium text-shadow-md">
            {t('about.subtitle')}
          </p>
        </div>
      </section>

      {/* Narrative Section - The Genesis of Kesula */}
      <section className="py-section-gap relative z-10 reveal overflow-hidden">
        <img src="/images/tribal_2.webp" className="absolute top-0 right-0 w-[600px] opacity-[0.35] mix-blend-multiply pointer-events-none animate-float-delayed z-20" alt="" />
        <div className="max-w-container mx-auto px-gutter relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-5 relative">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">{t('aboutPage.genesisTitle')}</h2>
                <p className="font-body-md text-on-surface-variant mb-6 leading-relaxed font-light">
                  {t('aboutPage.p1')}
                </p>
                <p className="font-body-md text-on-surface-variant mb-8 leading-relaxed font-light">
                  {t('aboutPage.p2')}
                </p>
                <p className="font-body-md text-on-surface-variant mb-8 leading-relaxed font-light">
                  {t('aboutPage.p3')}
                </p>
                <div className="flex items-center gap-8">
                  <div className="clay-card p-4 border border-secondary/5 text-center min-w-[110px]">
                    <span className="block text-4xl font-extrabold text-primary">6+ Years</span>
                    <span className="text-[15px] font-bold uppercase tracking-wider text-on-surface-variant opacity-75">{t('aboutPage.activeImpact')}</span>
                  </div>
                  <div className="h-10 w-[1px] bg-secondary/15"></div>
                  <div className="clay-card p-4 border border-secondary/5 text-center min-w-[110px]">
                    <span className="block text-4xl font-extrabold text-primary">200K+</span>
                    <span className="text-[15px] font-bold uppercase tracking-wider text-on-surface-variant opacity-75">{t('aboutPage.livesTouched')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Grid as Glass Frames */}
            <div className="lg:col-span-7 grid grid-cols-2 gap-4 sm:gap-6 mt-8 lg:mt-0">
              <div className="space-y-6 pt-12">
                <div className="aspect-[3/4] rounded-3xl overflow-hidden glass-panel p-2 shadow-md hover:scale-[1.02] transition-transform duration-300">
                  <img className="w-full h-full object-cover rounded-2xl" alt="Tribal Gathering"
                    src="/images/ab1.webp" />
                </div>
                <div className="aspect-square rounded-3xl overflow-hidden glass-panel p-2 shadow-md hover:scale-[1.02] transition-transform duration-300">
                  <img className="w-full h-full object-cover rounded-2xl" alt="Artisan Hands Weaving"
                    src="/images/ab2.webp" />
                </div>
              </div>
              <div className="space-y-6">
                <div className="aspect-square rounded-3xl overflow-hidden glass-panel p-2 shadow-md hover:scale-[1.02] transition-transform duration-300">
                  <img className="w-full h-full object-cover rounded-2xl" alt="School children"
                    src="/images/ab3.webp" />
                </div>
                <div className="aspect-[3/4] rounded-3xl overflow-hidden glass-panel p-2 shadow-md hover:scale-[1.02] transition-transform duration-300">
                  <img className="w-full h-full object-cover rounded-2xl" alt="Forest and Nature"
                    src="/images/ab4.webp" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Spiritual Philosophy Section - Sant Shri Sevalal Maharaj */}
      <section className="py-24 relative z-10 bg-[#fffbfa] border-y border-orange-100/50 overflow-hidden">
        {/* Decorative tribal background elements */}
        <div className="absolute top-[20%] right-[-10%] w-[35vw] h-[35vw] rounded-full blur-[130px] opacity-10 bg-primary pointer-events-none z-0"></div>

        <div className="max-w-container mx-auto px-gutter relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

            {/* Left Column: Creative Editorial Image Frame (Arched window shape with decorative shadows) */}
            <div className="lg:col-span-5 flex justify-center relative">
              {/* Outer decorative tribal glow ring */}
              <div className="absolute inset-0 -m-8 rounded-[48px] border border-orange-200/40 bg-gradient-to-br from-orange-50/50 to-transparent pointer-events-none z-0"></div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.6 }}
                className="relative w-[300px] h-[420px] sm:w-[340px] sm:h-[480px] rounded-t-full overflow-hidden border-[8px] border-white shadow-[0_30px_60px_-15px_rgba(138,48,4,0.18)] bg-white z-10"
              >
                <img
                  src="/images/Sant Shri Sevalal Maharaj.webp"
                  className="w-full h-full object-cover transition-transform duration-[2s] hover:scale-105"
                  alt="Sant Shri Sevalal Maharaj"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
              </motion.div>
            </div>

            {/* Right Column: Philosophic Text & Teachings */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <span className="text-[#8a3004] font-extrabold text-xs uppercase tracking-[0.3em] block mb-2 font-mono">
                {t('aboutPage.sevalalTag')}
              </span>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 font-serif leading-tight">
                {t('aboutPage.sevalalTitle')}
              </h2>
              <p className="text-lg text-slate-700 font-light leading-relaxed">
                {t('aboutPage.sevalalP1')}
              </p>

              <div className="border-l-4 border-[#8a3004] pl-6 py-2 my-8">
                <p className="font-serif italic text-xl text-slate-800 leading-relaxed">
                  {t('aboutPage.sevalalQuote')}
                </p>
                <span className="text-xs uppercase tracking-widest font-extrabold text-slate-500 block mt-3 font-mono">
                  {t('aboutPage.sevalalQuoteAuthor')}
                </span>
              </div>

              <p className="text-base text-slate-600 font-light leading-relaxed">
                {t('aboutPage.sevalalP2')}
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Vision & Mission - Sant Shri Sevalal Maharaj Framing */}
      <section className="py-section-gap relative z-10 reveal overflow-hidden">
        <img src="/images/tribal_1.webp" className="absolute top-1/2 -translate-y-1/2 left-[-150px] w-[550px] h-[550px] opacity-[0.35] mix-blend-multiply pointer-events-none object-contain z-20 animate-spin-vertical-centered" alt="" />
        <div className="max-w-container mx-auto px-gutter relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Vision Card */}
            <div className="glass-panel p-10 rounded-3xl border border-white/40 shadow-sm hover:scale-[1.01] transition-transform duration-300 flex flex-col items-start">
              <div className="w-12 h-12 clay-card-colored flex items-center justify-center mb-6 text-primary shadow-inner">
                <span className="material-symbols-outlined text-2xl font-bold">visibility</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-extrabold mb-4 text-primary tracking-tight">{t('vision.title')}</h3>
              <p className="font-body-md text-on-surface-variant leading-relaxed font-light">
                {t('vision.desc')}
              </p>
            </div>

            {/* Mission Card */}
            <div className="glass-panel p-10 rounded-3xl border border-white/40 shadow-sm hover:scale-[1.01] transition-transform duration-300 flex flex-col items-start">
              <div className="w-12 h-12 clay-card-colored flex items-center justify-center mb-6 text-primary shadow-inner">
                <span className="material-symbols-outlined text-2xl font-bold">track_changes</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-extrabold mb-4 text-primary tracking-tight">{t('missionCard.title')}</h3>
              <p className="font-body-md text-on-surface-variant leading-relaxed font-light">
                {t('missionCard.desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Profile Section - Refined minimal layout */}
      <section className="py-section-gap relative z-10 reveal overflow-hidden">
        <img src="/images/tribal_3.webp" className="absolute top-1/2 -translate-y-1/2 right-[-150px] w-[550px] h-[550px] opacity-[0.35] mix-blend-multiply pointer-events-none object-contain z-20 animate-spin-vertical-centered" alt="" />
        <div className="max-w-container mx-auto px-gutter relative z-10">
          <div className="text-center mb-16">
            <span className="text-primary font-bold text-xs uppercase tracking-[0.2em] block mb-3">{t('aboutPage.leadershipTag')}</span>
            <h2 className="text-4xl md:text-5xl font-bold text-on-surface">{t('aboutPage.leadershipTitle')}</h2>
          </div>

          <div className="glass-panel border border-white/40 rounded-3xl p-8 md:p-12 grid md:grid-cols-12 gap-12 items-center max-w-5xl mx-auto shadow-sm">
            <div className="md:col-span-4 flex flex-col items-center">
              <div className="w-64 h-64 sm:w-72 sm:h-72 rounded-3xl overflow-hidden border-4 border-white shadow-md mb-6 p-1 bg-white/40 backdrop-blur-md">
                <img className="w-full h-full object-cover rounded-2xl" alt="Founder Manzeelal Dharavath"
                  src="/images/manzelal.webp" />
              </div>
              <h3 className="text-2xl font-bold text-on-surface text-center tracking-tight">{t('aboutPage.founderName')}</h3>
              <p className="text-[15px] text-secondary font-bold uppercase tracking-widest text-center mt-2.5">{t('aboutPage.founderRole')}</p>
            </div>
            <div className="md:col-span-8">
              <h4 className="text-xl md:text-2xl font-bold text-primary mb-4">{t('aboutPage.founderVisionTitle')}</h4>
              <p className="font-body-md text-on-surface-variant leading-relaxed mb-0 italic font-light">
                {t('aboutPage.founderBio')}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
