import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import TiltCard from '../components/ui/TiltCard';
import CircularGallery from '../components/ui/CircularGallery';
import AutoScrollGallery from '../components/ui/AutoScrollGallery';
import CrowdfundingBanner from '../components/ui/CrowdfundingBanner';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../context/LanguageContext';

export default function Home() {
  const { t } = useLanguage();
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [activeTab, setActiveTab] = useState('milestones');
  const [selectedMedia, setSelectedMedia] = useState(null);
  const upcomingCarouselRef = useRef(null);
  const featuredCarouselRef = useRef(null);

  const scrollCarousel = (direction, ref) => {
    if (ref && ref.current) {
      const scrollAmount = 360;
      ref.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };
  const [galleryImages, setGalleryImages] = useState([
    { image: '/images/hs1.webp', text: '' },
    { image: '/images/hs2.webp', text: '' },
    { image: '/images/hs3.webp', text: '' },
    { image: '/images/hs4.webp', text: '' },
    { image: '/images/hs5.webp', text: '' },
    { image: '/images/hs6.webp', text: '' },
    { image: '/images/hs7.webp', text: '' },
    { image: '/images/hs8.webp', text: '' },
    { image: '/images/memories_1.webp', text: '' },
    { image: '/images/memories_2.webp', text: '' },
    { image: '/images/memories_3.webp', text: '' },
    { image: '/images/memories_4.webp', text: '' },
    { image: '/images/memories_5.webp', text: '' }
  ]);

  // Scroll reveal trigger
  useScrollReveal(activeTab);

  useEffect(() => {
    // Fetch upcoming events from Supabase
    supabase.from('events')
      .select('id, title, date, category, imageUrl, status, featured')
      .order('date', { ascending: false })
      .order('createdAt', { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          console.error('Error fetching upcoming events:', error);
        } else if (data) {
          const todayStr = new Date().toISOString().split('T')[0];
          
          const upcoming = data.filter(e => e.status === 'upcoming' && (!e.date || e.date >= todayStr));
          const featured = data.filter(e => e.featured === true || e.featured === 1);
          
          setUpcomingEvents(upcoming);
          setFeaturedEvents(featured);
        }
      });

    // Fetch latest gallery images from Supabase
    supabase.from('gallery')
      .select('*')
      .order('createdAt', { ascending: true })
      .then(({ data, error }) => {
        if (error) {
          console.error('Could not load latest gallery items', error);
        } else if (data && data.length > 0) {
          const formatted = data.map(item => ({ 
            image: item.imageUrl, 
            text: '',
            objectPosition: item.objectPosition 
          }));
          // Keep all images (both initial static and fetched from Supabase)
          setGalleryImages(prev => {
            // Prevent duplicates if component re-mounts
            const newUrls = formatted.filter(f => !prev.some(p => p.image === f.image));
            return [...prev, ...newUrls];
          });
        }
      });
  }, []);

  return (
    <div className="relative overflow-hidden bg-background text-on-surface">
      {/* Glowing background gradient blobs for premium minimalist depth */}
      <div className="absolute top-[5%] right-[-10%] w-[50vw] h-[50vw] rounded-full blur-[130px] opacity-10 bg-primary pointer-events-none z-0 animate-float"></div>
      <div className="absolute top-[25%] left-[-15%] w-[40vw] h-[40vw] rounded-full blur-[130px] opacity-[0.08] bg-accent pointer-events-none z-0 animate-float-delayed"></div>
      <div className="absolute bottom-[20%] right-[-10%] w-[45vw] h-[45vw] rounded-full blur-[140px] opacity-[0.08] bg-secondary pointer-events-none z-0 animate-float"></div>

      {/* HeroSection */}
      <section className="relative min-h-[100svh] md:h-screen flex items-end pb-16 md:pb-24 z-10 reveal overflow-hidden">
        {/* Background Video (Desktop) */}
        <div className="absolute inset-0 w-full h-full z-0 hidden md:block">
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            poster="/images/nature_bg.webp"
            className="w-full h-full object-cover"
          >
            <source src="/videos/hero.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Background Video (Mobile) */}
        <div className="absolute inset-0 w-full h-full z-0 block md:hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            poster="/images/nature_bg.webp"
            className="w-full h-full object-cover"
          >
            <source src="/videos/hero m.mp4" type="video/mp4" />
          </video>
        </div>

        <div className="max-w-container mx-auto px-gutter grid md:grid-cols-2 gap-12 items-center relative z-10 w-full -mt-[5%]">
          <div className="order-2 md:order-1 relative z-10">
            <span className="inline-block bg-primary/20 backdrop-blur-md text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4 border border-white/20">
              {t('hero.badge')}
            </span>
            <h1 className="text-[38px] md:text-[52px] lg:text-[64px] font-bold mb-6 leading-[1.1] tracking-tight text-white text-shadow-lg">
              {t('hero.title')}
            </h1>
            <p className="text-base md:text-lg text-white max-w-xl mb-10 leading-relaxed font-medium text-shadow-md">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/contact#donate" className="clay-btn clay-btn-primary px-10 py-4 text-sm uppercase tracking-wider text-center inline-block">
                {t('hero.donateBtn')}
              </Link>
              <Link to="/activities" className="clay-btn clay-btn-secondary px-10 py-4 text-sm uppercase tracking-wider text-center inline-block bg-white/90">
                {t('hero.exploreBtn')}
              </Link>
            </div>
          </div>

          <div className="order-1 md:order-2 relative z-10 h-full flex items-end justify-end pb-10">
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="py-section-gap relative z-10 overflow-hidden bg-cover bg-center bg-fixed" style={{ backgroundImage: "url('/images/nature_bg.webp')" }}>
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/70 z-0 pointer-events-none"></div>
        <div className="relative z-10 max-w-container mx-auto px-gutter grid md:grid-cols-2 gap-16 items-center">
          <div className="relative w-full aspect-square pb-10 md:pb-0 reveal-left">
            {/* Top Left Image */}
            <div className="absolute top-0 left-0 w-[55%] aspect-square rounded-3xl overflow-hidden shadow-xl z-10 hover:z-30 hover:shadow-2xl transition-all duration-500 img-zoom-container">
              <img alt="Plantation & Environment" loading="lazy" className="w-full h-full object-cover"
                src="/images/plantation.webp" />
            </div>

            {/* Top Right Image */}
            <div className="absolute top-[15%] right-0 w-[45%] aspect-square rounded-3xl overflow-hidden shadow-lg z-0 hover:z-30 hover:shadow-2xl transition-all duration-500 img-zoom-container">
              <img alt="Cultural Celebrations" loading="lazy" className="w-full h-full object-cover"
                src="/images/cultural.webp" />
            </div>

            {/* Bottom Middle Image */}
            <div className="absolute bottom-0 left-[10%] md:left-[15%] w-[75%] md:w-[70%] aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl z-20 hover:z-30 hover:shadow-2xl transition-all duration-500 img-zoom-container">
              <img alt="Educational Programs" loading="lazy" className="w-full h-full object-cover"
                src="/images/education.webp" />
            </div>
          </div>
          <div className="reveal-right">
            <span className="text-white text-shadow-md font-extrabold text-xs uppercase tracking-[0.2em] mb-3 block">{t('foundation.tag')}</span>
            <h2 className="text-4xl md:text-5xl text-white text-shadow-lg mb-6 leading-tight font-bold">{t('foundation.title')}</h2>
            <p className="font-body-md text-white text-shadow-md leading-relaxed mb-6 font-thin">
              {t('foundation.p1')}
            </p>
            <p className="font-body-md text-white text-shadow-md leading-relaxed mb-8 font-thin">
              {t('foundation.p2')}
            </p>
            <Link to="/about" className="clay-btn clay-btn-secondary px-6 py-3 text-xs uppercase tracking-wider inline-block shadow-xl border-white/20">
              {t('foundation.learnMore')}
            </Link>
          </div>
        </div>
      </section>

      {/* Focus Areas & What We Do Section - With Image Background */}
      <section className="relative z-10 overflow-hidden bg-cover bg-center bg-fixed" style={{ backgroundImage: "url('/images/bg.webp')" }}>
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/60 z-0"></div>

        {/* Focus Areas - Arched Cards */}
        <div className="relative z-30 w-full pt-16 md:pt-24">
          <div className="max-w-container mx-auto px-4 md:px-gutter relative z-10 pointer-events-auto">
            {/* Horizontal scroll on mobile, grid on desktop */}
            <div className="flex overflow-x-auto md:grid md:grid-cols-2 gap-5 md:gap-8 snap-x snap-mandatory scrollbar-none -mx-4 px-4 md:mx-0 md:px-0">
              <TiltCard elementType={Link} to="/about" className="min-w-[85vw] md:min-w-0 snap-center bg-[#fff1ec] p-8 rounded-3xl border-2 !border-[#8a3004] shadow-sm transition-all duration-300 group block relative overflow-hidden reveal-top">
                <div className="absolute -bottom-16 -right-16 w-72 h-72 opacity-[0.40] mix-blend-multiply pointer-events-none transition-transform duration-700 group-hover:scale-110 z-0">
                  <img src="/images/tribal_2.webp" loading="lazy" className="w-full h-full object-contain animate-spin-clockwise" alt="" />
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -mr-10 -mt-10 transition-all group-hover:bg-primary/10 z-0"></div>
                <div className="flex items-center gap-4 mb-4 relative z-10">
                  <div className="w-10 h-10 clay-card-colored flex items-center justify-center text-primary shadow-inner rounded-full">
                    <span className="material-symbols-outlined text-xl">visibility</span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-extrabold text-primary">{t('vision.title')}</h3>
                </div>
                <p className="font-body-md text-on-surface-variant font-light line-clamp-3 relative z-10">
                  {t('vision.desc')}
                </p>
                <div className="mt-6 flex items-center text-primary text-xs font-bold uppercase tracking-wider group-hover:gap-2 transition-all relative z-10">
                  {t('vision.readMore')} <span className="material-symbols-outlined text-sm ml-1">arrow_forward</span>
                </div>
              </TiltCard>

              <TiltCard elementType={Link} to="/about" className="min-w-[85vw] md:min-w-0 snap-center bg-[#fff1ec] p-8 rounded-3xl border-2 !border-[#8a3004] shadow-sm transition-all duration-300 group block relative overflow-hidden reveal-bottom">
                <div className="absolute -bottom-16 -right-16 w-72 h-72 opacity-[0.40] mix-blend-multiply pointer-events-none transition-transform duration-700 group-hover:scale-110 z-0">
                  <img src="/images/tribal_2.webp" loading="lazy" className="w-full h-full object-contain animate-spin-clockwise" alt="" />
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -mr-10 -mt-10 transition-all group-hover:bg-primary/10 z-0"></div>
                <div className="flex items-center gap-4 mb-4 relative z-10">
                  <div className="w-10 h-10 clay-card-colored flex items-center justify-center text-primary shadow-inner rounded-full">
                    <span className="material-symbols-outlined text-xl">track_changes</span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-extrabold text-primary">{t('missionCard.title')}</h3>
                </div>
                <p className="font-body-md text-on-surface-variant font-light line-clamp-3 relative z-10">
                  {t('missionCard.desc')}
                </p>
                <div className="mt-6 flex items-center text-primary text-xs font-bold uppercase tracking-wider group-hover:gap-2 transition-all relative z-10">
                  {t('missionCard.readMore')} <span className="material-symbols-outlined text-sm ml-1">arrow_forward</span>
                </div>
              </TiltCard>
            </div>
          </div>
        </div>

        {/* Crowdfunding Banner (Only renders if active campaign exists) */}
        <CrowdfundingBanner />

        <div className="relative z-10 max-w-container mx-auto px-gutter pt-20 md:pt-32 pb-32 md:pb-44">
          <div className="text-center mb-16 reveal-top">
            <span className="text-white text-shadow-md font-extrabold text-xs uppercase tracking-[0.2em] block mb-3">{t('work.tag')}</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white text-shadow-lg mb-4">{t('work.title')}</h2>
            <p className="text-white/80 max-w-3xl mx-auto text-sm sm:text-base leading-relaxed font-light drop-shadow-md">
              {t('work.desc')}
            </p>
          </div>
          <div className="flex overflow-x-auto md:grid md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8 pb-8 md:pb-0 snap-x snap-mandatory scrollbar-none -mx-4 px-4 md:mx-0 md:px-0 reveal-bottom">
            {[
              { id: 'education', name: t('work.activities.education'), icon: 'school' },
              { id: 'healthcare', name: t('work.activities.healthcare'), icon: 'medication' },
              { id: 'livelihood', name: t('work.activities.livelihood'), icon: 'engineering' },
              { id: 'empowerment', name: t('work.activities.empowerment'), icon: 'diversity_3' },
              { id: 'environment', name: t('work.activities.environment'), icon: 'eco' },
              { id: 'culture', name: t('work.activities.culture'), icon: 'brush' }
            ].map(activity => (
              <Link to="/activities" key={activity.id} className="min-w-[85vw] md:min-w-0 snap-center flex-shrink-0 group relative rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl block">
                {/* Card Background (Turns pure white on hover) */}
                <div className="absolute inset-0 bg-black/70 backdrop-blur-xl border border-white/[0.15] rounded-2xl transition-all duration-500 group-hover:bg-white group-hover:border-white"></div>
                {/* Animated bottom accent line */}
                <div className="absolute bottom-0 left-0 h-[3px] w-0 bg-gradient-to-r from-primary via-amber-400 to-primary rounded-full transition-all duration-500 group-hover:w-full"></div>
                {/* Content */}
                <div className="relative z-10 p-7">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/40 to-primary/15 border border-primary/30 flex items-center justify-center flex-shrink-0 transition-all duration-500 group-hover:from-slate-900 group-hover:to-slate-950 group-hover:border-transparent group-hover:shadow-lg group-hover:scale-110">
                      <span className="material-symbols-outlined text-2xl text-white drop-shadow-md">{activity.icon}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-headline-md text-base font-bold leading-snug text-white drop-shadow-lg group-hover:text-black transition-colors duration-300">{activity.name}</h3>
                    </div>
                  </div>
                  <div className="mt-6 flex items-center gap-1.5 text-primary text-xs font-bold uppercase tracking-wider group-hover:text-black transition-all duration-300">
                    <span>{t('work.learnMoreBtn')}</span>
                    <span className="material-symbols-outlined text-sm transition-transform duration-300 group-hover:translate-x-1.5">arrow_forward</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Stats - Claymorphic Grid */}
      <section className="py-44 relative z-10 overflow-hidden">
        {/* Zig-Zag Tribal Art (Left) */}
        <img src="/images/tribal_1.webp" loading="lazy" className="absolute top-1/2 -translate-y-1/2 left-0 w-[650px] h-[650px] opacity-[0.25] mix-blend-overlay pointer-events-none object-contain animate-spin-vertical-centered" alt="" />
        <div className="max-w-container mx-auto px-gutter text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4 reveal-top">{t('stats.title')}</h2>
          <p className="text-on-surface-variant max-w-2xl mx-auto text-sm md:text-base mb-12 reveal-top">{t('stats.subtitle')}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 reveal-bottom">
            <TiltCard className="glass-panel p-8 border-2 !border-primary rounded-3xl relative overflow-hidden group">
              <div className="relative z-10 font-headline-lg text-primary text-4xl font-extrabold mb-2.5">{t('stats.stat1')}</div>
              <div className="relative z-10 text-on-surface-variant font-bold text-xs uppercase tracking-widest">{t('stats.label1')}</div>
            </TiltCard>
            <TiltCard className="glass-panel p-8 border-2 !border-primary rounded-3xl relative overflow-hidden group">
              <div className="relative z-10 font-headline-lg text-primary text-4xl font-extrabold mb-2.5">{t('stats.stat2')}</div>
              <div className="relative z-10 text-on-surface-variant font-bold text-xs uppercase tracking-widest">{t('stats.label2')}</div>
            </TiltCard>
            <TiltCard className="glass-panel p-8 border-2 !border-primary rounded-3xl relative overflow-hidden group">
              <div className="relative z-10 font-headline-lg text-primary text-4xl font-extrabold mb-2.5">{t('stats.stat3')}</div>
              <div className="relative z-10 text-on-surface-variant font-bold text-xs uppercase tracking-widest">{t('stats.label3')}</div>
            </TiltCard>
            <TiltCard className="glass-panel p-8 border-2 !border-primary rounded-3xl relative overflow-hidden group">
              <div className="relative z-10 font-headline-lg text-primary text-4xl font-extrabold mb-2.5">{t('stats.stat4')}</div>
              <div className="relative z-10 text-on-surface-variant font-bold text-xs uppercase tracking-widest">{t('stats.label4')}</div>
            </TiltCard>
          </div>
        </div>
      </section>

      {/* Reusable Event Section Renderer */}
      {(() => {
        const renderEventSection = (events, title, ref) => {
          if (events.length === 0) return null;
          return (
            <section className="py-24 relative z-10 overflow-hidden bg-white/80 backdrop-blur-sm border-t border-white/50">
              <img src="/images/tribal_2.webp" loading="lazy" className="absolute top-1/2 -translate-y-1/2 right-0 w-[650px] h-[650px] opacity-[0.40] mix-blend-multiply pointer-events-none object-contain animate-spin-vertical-centered" alt="" />
              <div className="max-w-container mx-auto px-gutter">
                <div className="flex items-center justify-between gap-4 mb-10 reveal-top">
                  <h2 className="text-4xl md:text-5xl font-extrabold text-primary">{title}</h2>
                  <div className="flex items-center gap-3 flex-1 justify-end">
                    {events.length > 3 && (
                      <div className="flex gap-2">
                        <button 
                          onClick={() => scrollCarousel('left', ref)}
                          className="w-10 h-10 rounded-full border border-secondary/15 flex items-center justify-center text-primary hover:bg-[#8a3004] hover:text-white transition-all shadow-sm focus:outline-none"
                        >
                          <span className="material-symbols-outlined text-xl">arrow_back</span>
                        </button>
                        <button 
                          onClick={() => scrollCarousel('right', ref)}
                          className="w-10 h-10 rounded-full border border-secondary/15 flex items-center justify-center text-primary hover:bg-[#8a3004] hover:text-white transition-all shadow-sm focus:outline-none"
                        >
                          <span className="material-symbols-outlined text-xl">arrow_forward</span>
                        </button>
                      </div>
                    )}
                    <div className="h-[1px] w-20 md:w-40 bg-secondary/15"></div>
                  </div>
                </div>

                {events.length > 3 ? (
                  <div 
                    ref={ref}
                    className="flex gap-6 overflow-x-auto pb-8 scrollbar-none scroll-smooth snap-x snap-mandatory"
                  >
                    {events.map((event) => {
                      const eventDate = new Date(event.date);
                      const day = eventDate.getDate();
                      const month = eventDate.toLocaleString('default', { month: 'short' });
                      return (
                        <div key={event.id} className="snap-center min-w-[280px] sm:min-w-[340px] flex-shrink-0">
                          <TiltCard className="flex flex-col justify-between p-6 glass-panel rounded-3xl border border-white/40 h-[220px] relative group">
                            <div className="flex items-start gap-4 mb-6">
                              <div className="clay-card-colored p-3 shadow-sm text-center border-t-2 border-accent min-w-[65px] h-[75px] flex flex-col justify-center rounded-xl bg-white/50">
                                <span className="block text-2xl font-extrabold text-accent leading-none">{day || '15'}</span>
                                <span className="text-xs font-bold uppercase opacity-60 text-accent mt-1">{month || 'Aug'}</span>
                              </div>
                              <div className="flex-1 min-w-0 text-left">
                                <h6 className="font-headline-md text-lg font-bold text-on-surface leading-snug break-words line-clamp-2">{event.title}</h6>
                                <p className="text-sm text-on-surface-variant flex items-center gap-1 mt-2 font-medium">
                                  <span className="material-symbols-outlined text-base text-accent">location_on</span>
                                  <span className="truncate">{event.location || 'Chengicherla, Telangana'}</span>
                                </p>
                              </div>
                            </div>
                            <div className="w-full mt-auto">
                              <Link to="/activities" className="clay-btn clay-btn-accent w-full py-2.5 text-xs font-bold uppercase tracking-wider text-center block">
                                {t('events.register')}
                              </Link>
                            </div>
                          </TiltCard>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="grid md:grid-cols-3 gap-6 reveal-bottom">
                    {events.map((event) => {
                      const eventDate = new Date(event.date);
                      const day = eventDate.getDate();
                      const month = eventDate.toLocaleString('default', { month: 'short' });
                      return (
                        <TiltCard key={event.id} className="flex flex-col justify-between p-6 glass-panel rounded-3xl border border-white/40 h-full relative group">
                          <div className="flex items-start gap-4 mb-6">
                            <div className="clay-card-colored p-3 shadow-sm text-center border-t-2 border-accent min-w-[65px] h-[75px] flex flex-col justify-center rounded-xl bg-white/50">
                              <span className="block text-2xl font-extrabold text-accent leading-none">{day || '15'}</span>
                              <span className="text-xs font-bold uppercase opacity-60 text-accent mt-1">{month || 'Aug'}</span>
                            </div>
                            <div className="flex-1 min-w-0 text-left">
                              <h6 className="font-headline-md text-lg font-bold text-on-surface leading-snug break-words line-clamp-2">{event.title}</h6>
                              <p className="text-sm text-on-surface-variant flex items-center gap-1 mt-2 font-medium">
                                <span className="material-symbols-outlined text-base text-accent">location_on</span>
                                <span className="truncate">{event.location || 'Chengicherla, Telangana'}</span>
                              </p>
                            </div>
                          </div>
                          <div className="w-full mt-auto">
                            <Link to="/activities" className="clay-btn clay-btn-accent w-full py-2.5 text-xs font-bold uppercase tracking-wider text-center block">
                              {t('events.register')}
                            </Link>
                          </div>
                        </TiltCard>
                      );
                    })}
                  </div>
                )}
              </div>
            </section>
          );
        };

        return (
          <>
            {renderEventSection(featuredEvents, t('events.featured'), featuredCarouselRef)}
            {renderEventSection(upcomingEvents, t('events.upcoming'), upcomingCarouselRef)}
          </>
        );
      })()}

      {/* Photo Gallery Section - Circular Animation */}
      <section className="pt-16 md:pt-24 pb-24 relative z-10 overflow-hidden bg-surface-container/30">
        <img src="/images/rangoli_bg.webp" loading="lazy" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] md:w-[800px] h-auto opacity-[0.25] mix-blend-multiply pointer-events-none object-contain z-0 animate-spin-centered" alt="" />
        <div className="max-w-container mx-auto px-gutter relative z-10">
          <div className="text-center mb-16 reveal-top">
            <span className="text-primary font-extrabold text-xs uppercase tracking-[0.2em] block mb-3">{t('memories.tag')}</span>
            <h2 className="text-4xl md:text-5xl font-bold text-on-surface mb-6">{t('memories.title')}</h2>
          </div>

          <div className="reveal-bottom pb-12 w-full">
            <AutoScrollGallery items={galleryImages} />
          </div>

          <div className="text-center mt-2 reveal-bottom">
            <Link
              to="/gallery"
              className="bg-[#8a3004] hover:bg-[#a0420b] text-white text-xs font-bold uppercase tracking-widest px-8 py-4 rounded-2xl inline-flex items-center justify-center gap-2 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#8a3004]/25"
            >
              <span>{t('memories.viewBtn')}</span>
              <span className="material-symbols-outlined text-sm">photo_library</span>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Banner - Premium Glassmorphic Overlay over Dark Background */}
      <section className="max-w-container mx-auto px-gutter mb-16 md:mb-24 relative z-10 reveal">
        <div className="rounded-3xl p-12 md:p-16 border border-white/10 shadow-2xl relative overflow-hidden text-center text-white bg-cover bg-center" style={{ backgroundImage: "url('/images/be.webp')" }}>
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/50 z-0 pointer-events-none"></div>
          <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-primary/30 blur-[90px] pointer-events-none z-0"></div>
          <div className="absolute -bottom-24 -right-24 w-64 h-64 rounded-full bg-secondary/30 blur-[90px] pointer-events-none z-0"></div>

          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl text-white text-shadow-lg mb-6 font-extrabold max-w-2xl mx-auto leading-[1.2]">{t('cta.title')}</h2>
            <p className="font-body-lg text-body-lg text-white text-shadow-md max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
              {t('cta.subtitle')}
            </p>
            <div className="flex flex-wrap justify-center items-center gap-5">
              <Link to="/contact#donate" className="bg-gradient-to-r from-primary to-amber-600 hover:from-amber-600 hover:to-primary text-white text-sm font-bold uppercase tracking-widest px-8 py-4 rounded-2xl flex items-center justify-center gap-2 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/25">
                <span>{t('cta.donateNow')}</span>
                <span className="material-symbols-outlined text-lg leading-none">favorite</span>
              </Link>
              <Link to="/contact#volunteer" className="bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40 text-sm font-bold uppercase tracking-widest px-8 py-4 rounded-2xl flex items-center justify-center gap-2 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">
                <span>{t('cta.becomeMember')}</span>
                <span className="material-symbols-outlined text-lg leading-none">volunteer_activism</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}