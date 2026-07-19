import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useVelocity, useSpring } from 'framer-motion';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { supabase } from '../lib/supabase';
import { categoryService } from '../services/categoryService';

// Parallax Card Component: Translates image inside the card frame relative to card viewport entrance/exit
function ParallaxEventCard({ event, idx, isActive, fallbackImages, skewSpring, scaleSpring }) {
  const cardRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"]
  });

  // Parallax: Shift image vertically inside frame as card travels through viewport
  const imageY = useTransform(scrollYProgress, [0, 1], [-50, 50]);
  const eventImg = event.imageUrl;

  return (
    <div
      ref={cardRef}
      className="event-sticky-fig sticky top-[130px] h-[calc(100vh-240px)] flex flex-col justify-start items-center z-10 pt-2"
    >
      <motion.div 
        style={{ skewY: skewSpring, scale: scaleSpring }}
        whileHover={{ scale: 1.04 }}
        animate={{ 
          boxShadow: isActive ? "0 25px 50px -12px rgba(138, 48, 4, 0.15)" : "0 20px 25px -5px rgba(0,0,0,0.05)",
          borderColor: isActive ? "rgba(138, 48, 4, 0.2)" : "rgba(226, 232, 240, 0.6)"
        }}
        transition={{ duration: 0.6 }}
        className={`relative overflow-hidden rounded-[48px] border w-[360px] h-[480px] sm:w-[480px] sm:h-[640px] transition-all cursor-pointer group origin-center ${eventImg ? 'bg-white' : 'bg-gradient-to-br from-[#8a3004] via-[#752601] to-[#4c1600]'}`}
      >
        {/* Parallax Container with 120% Image Height */}
        <div className="absolute inset-0 overflow-hidden">
          {eventImg ? (
            <>
              <motion.img
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                src={eventImg}
                alt={event.title}
                className="w-full h-full object-cover group-hover:brightness-95 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none"></div>
            </>
          ) : (
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] opacity-10"></div>
          )}
        </div>

        {/* Floating Thematic Label bottom left */}
        <div className="absolute bottom-8 left-8 right-8 space-y-2.5 text-left pointer-events-none">
          <span className="px-4 py-2 rounded-full text-[10px] sm:text-xs font-extrabold uppercase tracking-widest bg-[#8a3004] text-white inline-block shadow-md">
            {event.category}
          </span>
          <h4 className="text-white font-black text-xl sm:text-3xl leading-tight line-clamp-2 group-hover:text-[#c5a880] transition-colors duration-300 drop-shadow-md">
            {event.title}
          </h4>
        </div>
      </motion.div>
    </div>
  );
}

export default function Activities() {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeEvent, setActiveEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const carouselRef = useRef(null);

  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = 420;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };
  
  // Parallax ref for hero section
  const heroRef = useRef(null);
  const { scrollY } = useScroll();
  const heroBgY = useTransform(scrollY, [0, 800], [0, 250]);
  const heroTextY = useTransform(scrollY, [0, 800], [0, -120]);
  const heroTextOpacity = useTransform(scrollY, [0, 600], [1, 0]);

  // Scroll tracking container for dynamic timeline dot and velocity skews
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  // Calculate scroll velocity to trigger dynamic skewing elements
  const scrollVelocity = useVelocity(scrollY);
  const skewY = useTransform(scrollVelocity, [-2000, 2000], [-5, 5]);
  const skewSpring = useSpring(skewY, { stiffness: 300, damping: 25 });
  
  // Dynamic scale factor based on scroll velocity (subtle breathing effect when moving fast)
  const scaleSpeed = useTransform(scrollVelocity, [-2000, 2000], [0.98, 1.02]);
  const scaleSpring = useSpring(scaleSpeed, { stiffness: 350, damping: 28 });

  // Map scroll progress (0 to 1) to dot vertical position (0px to 240px)
  const dotY = useTransform(scrollYProgress, [0, 1], [0, 240]);

  useScrollReveal(allEvents);

  useEffect(() => {
    // Fetch categories
    categoryService.getCategories().then(data => {
      setCategories(data.map(c => c.name));
    }).catch(err => {
      console.error('Error fetching categories in Activities:', err);
    });

    // Fetch all events and filter them into upcoming and past dynamically
    supabase.from('events')
      .select('*')
      .order('date', { ascending: false })
      .order('createdAt', { ascending: false })
      .then(({ data, error }) => {
        setIsLoading(false);
        if (error) {
          console.error('Error fetching events:', error);
        } else {
          const eventsList = data || [];
          const todayStr = new Date().toISOString().split('T')[0];

          // Segregate: upcoming shows only if status is upcoming and date is today or future (or no date)
          const upcoming = eventsList.filter(e => 
            e.status === 'upcoming' && (!e.date || e.date >= todayStr)
          );

          // Segregate: past/categories shows if status is past or date is in the past
          const past = eventsList.filter(e => 
            e.status === 'past' || (e.date && e.date < todayStr)
          );

          setUpcomingEvents(upcoming);
          setAllEvents(past);
          
          if (past.length > 0) {
            setActiveEvent(past[0].id);
          }
        }
      });
  }, []);

  // Fallback local public images array
  const fallbackImages = [
    '/images/img1.webp',
    '/images/img5.webp',
    '/images/img6.webp',
    '/images/img7.webp',
    '/images/img8.webp',
    '/images/img9.webp',
    '/images/hs1.webp',
    '/images/hs2.webp',
    '/images/hs3.webp',
    '/images/hs4.webp',
    '/images/hs5.webp',
    '/images/hs6.webp'
  ];

  // Dynamic Filtering: ONLY show categories that have events loaded in the database
  const activeCategories = categories.filter(catName => 
    allEvents.some(event => event.category === catName)
  );

  const filterCategories = ['All', ...activeCategories];

  // Filter events by chosen category
  const filteredEvents = selectedCategory === 'All' 
    ? allEvents 
    : allEvents.filter(e => e.category === selectedCategory);

  // Sync scroll spy observer using non-sticky trigger markers (resolves bottom-to-top stacking intersection lag)
  useEffect(() => {
    if (filteredEvents.length === 0) return;

    // Set first event active by default when changing filter
    setActiveEvent(filteredEvents[0].id);

    const observerOptions = {
      root: null,
      rootMargin: '-48% 0px -48% 0px', // Target horizontal center line of the screen
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const eventId = entry.target.getAttribute('data-event-id');
          if (eventId) {
            setActiveEvent(eventId);
          }
        }
      });
    }, observerOptions);

    const timer = setTimeout(() => {
      const triggers = document.querySelectorAll('.event-scroll-trigger');
      triggers.forEach(t => observer.observe(t));
    }, 100);

    return () => {
      clearTimeout(timer);
      const cards = document.querySelectorAll('.event-scroll-trigger');
      cards.forEach(card => observer.unobserve(card));
    };
  }, [selectedCategory, allEvents, filteredEvents.length]);

  const activeEventData = allEvents.find(e => e.id === activeEvent) || filteredEvents[0];
  const titleWords = "Programs & Initiatives".split(" ");

  // Stagger configurations
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.25, ease: "easeOut" } }
  };

  return (
    <div className="relative bg-[#faf8f5] text-slate-800 min-h-screen overflow-x-clip font-sans">
      {/* Decorative Dynamic Background Glows */}
      <div className="absolute top-[10%] left-[-15%] w-[60vw] h-[60vw] rounded-full blur-[160px] opacity-10 bg-gradient-to-br from-[#8a3004]/20 to-transparent pointer-events-none z-0"></div>
      <div className="absolute bottom-[20%] right-[-15%] w-[60vw] h-[60vw] rounded-full blur-[180px] opacity-10 bg-gradient-to-br from-[#c5a880]/30 to-transparent pointer-events-none z-0"></div>

      {/* Cinematic Parallax Hero Section */}
      <section ref={heroRef} className="relative h-[100svh] md:h-[90vh] min-h-[500px] md:min-h-[650px] flex items-center justify-center z-10 overflow-hidden bg-[#eae6e1]">
        <motion.div style={{ y: heroBgY }} className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-white/20 z-10 pointer-events-none"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#faf8f5] via-white/5 to-white/40 z-10 pointer-events-none"></div>
          <img 
            src="/images/nature_bg.webp" 
            className="w-full h-full object-cover scale-105 pointer-events-none filter brightness-95" 
            alt="" 
          />
        </motion.div>
        
        <motion.div style={{ y: heroTextY, opacity: heroTextOpacity }} className="max-w-container mx-auto px-gutter text-center relative z-10 w-full flex flex-col items-center">
          <motion.span 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-[#8a3004] font-extrabold text-xs uppercase tracking-[0.4em] block mb-6 text-shadow-sm"
          >
            OUR WORK ON THE GROUND
          </motion.span>
          
          <h1 className="text-[52px] sm:text-[72px] md:text-[96px] font-extrabold text-slate-900 tracking-tighter leading-[0.95] max-w-5xl mx-auto mb-8 flex flex-wrap justify-center gap-x-4">
            {titleWords.map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 50, rotateX: 30 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 1, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="inline-block origin-bottom"
              >
                {word}
              </motion.span>
            ))}
          </h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.6 }}
            className="text-base sm:text-lg md:text-xl text-slate-950 max-w-2xl mx-auto font-normal leading-relaxed"
          >
            A look at what we've been up to — the events, the drives, the camps, and the people behind them.
          </motion.p>
        </motion.div>

        {/* Scroll Journey Indicator */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 0.7, y: 0 }}
          transition={{ duration: 1, delay: 1, repeat: Infinity, repeatType: "reverse" }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-slate-600"
        >
          <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#8a3004]">Begin Journey</span>
          <div className="w-5 h-9 border-2 border-slate-300 rounded-full flex justify-center p-1 bg-white/40">
            <motion.div 
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-1 h-2 bg-[#8a3004] rounded-full"
            />
          </div>
        </motion.div>
      </section>

      {/* 1. Horizontal Snapping Showcase for Upcoming Scheduled Events */}
      {upcomingEvents.length > 0 && (
        <section className="py-32 relative z-10 border-b border-slate-200/50 bg-[#faf8f5]">
          <div className="max-w-container mx-auto px-gutter mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <motion.span 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="text-[#8a3004] font-bold text-xs uppercase tracking-[0.25em] block mb-3"
              >
                WHAT'S COMING UP
              </motion.span>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 font-serif"
              >
                Events You Can Join
              </motion.h2>
            </div>
            
            {upcomingEvents.length > 3 ? (
              <div className="flex gap-2">
                <button 
                  onClick={() => scrollCarousel('left')}
                  className="w-10 h-10 rounded-full border border-slate-200/80 flex items-center justify-center text-primary hover:bg-[#8a3004] hover:text-white transition-all shadow-sm focus:outline-none"
                >
                  <span className="material-symbols-outlined text-xl">arrow_back</span>
                </button>
                <button 
                  onClick={() => scrollCarousel('right')}
                  className="w-10 h-10 rounded-full border border-slate-200/80 flex items-center justify-center text-primary hover:bg-[#8a3004] hover:text-white transition-all shadow-sm focus:outline-none"
                >
                  <span className="material-symbols-outlined text-xl">arrow_forward</span>
                </button>
              </div>
            ) : (
              <span className="text-xs text-slate-500 tracking-wider flex items-center gap-2">
                Join our upcoming initiatives <span className="material-symbols-outlined text-sm animate-pulse">volunteer_activism</span>
              </span>
            )}
          </div>

          {/* Draggable/Scrollable Deck */}
          <div className="max-w-container mx-auto px-gutter">
            {upcomingEvents.length > 3 ? (
              <motion.div 
                ref={carouselRef}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="flex gap-8 overflow-x-auto snap-x snap-mandatory pb-10 pt-4 scrollbar-none scroll-smooth"
              >
                {upcomingEvents.map((event, idx) => {
                  const upcomingImg = event.imageUrl;
                  return (
                    <motion.div
                      key={event.id}
                      whileHover={{ y: -10, scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className={`relative overflow-hidden rounded-[32px] flex flex-col justify-end min-w-[300px] md:min-w-[400px] h-[480px] md:h-[540px] snap-center border border-slate-200/60 shadow-xl flex-shrink-0 group cursor-grab active:cursor-grabbing text-left p-6 md:p-8 ${upcomingImg ? 'bg-white' : 'bg-gradient-to-br from-[#8a3004] via-[#752601] to-[#4c1600]'}`}
                    >
                      {/* Photo with zoom effect */}
                      <div className="absolute inset-0 z-0">
                        {upcomingImg ? (
                          <>
                            <img
                              className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                              src={upcomingImg}
                              alt={event.title}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                          </>
                        ) : (
                          <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] opacity-10"></div>
                        )}
                      </div>

                      <div className="relative z-10 flex flex-col justify-between h-full w-full">
                        <div className="flex justify-between items-center">
                          <span className="px-4 py-2 rounded-full text-xs font-extrabold uppercase tracking-widest bg-[#8a3004] text-white">
                            {event.category}
                          </span>
                        </div>

                        <div className="space-y-3">
                          <h3 className="text-xl md:text-2xl font-black text-white leading-tight group-hover:text-[#c5a880] transition-colors duration-300 drop-shadow-md">
                            {event.title}
                          </h3>
                          
                          <div className="bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-white/90 text-sm space-y-2">
                            <p className="flex items-center gap-3">
                              <span className="material-symbols-outlined text-base text-[#c5a880]">calendar_today</span>
                              <span>{event.date}</span>
                            </p>
                            <p className="flex items-center gap-3">
                              <span className="material-symbols-outlined text-base text-[#c5a880]">location_on</span>
                              <span>{event.location}</span>
                            </p>
                          </div>

                          <div className="pt-1.5">
                            <span className="text-xs text-white/70 tracking-wider font-semibold">TAGS: {event.tags || 'General'}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center"
              >
                {upcomingEvents.map((event, idx) => {
                  const upcomingImg = event.imageUrl;
                  return (
                    <motion.div
                      key={event.id}
                      whileHover={{ y: -10, scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className={`relative overflow-hidden rounded-[32px] flex flex-col justify-end h-[480px] md:h-[540px] border border-slate-200/60 shadow-xl group text-left p-6 md:p-8 ${upcomingImg ? 'bg-white' : 'bg-gradient-to-br from-[#8a3004] via-[#752601] to-[#4c1600]'}`}
                    >
                      {/* Photo with zoom effect */}
                      <div className="absolute inset-0 z-0">
                        {upcomingImg ? (
                          <>
                            <img
                              className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                              src={upcomingImg}
                              alt={event.title}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                          </>
                        ) : (
                          <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] opacity-10"></div>
                        )}
                      </div>

                      <div className="relative z-10 flex flex-col justify-between h-full w-full">
                        <div className="flex justify-between items-center">
                          <span className="px-4 py-2 rounded-full text-xs font-extrabold uppercase tracking-widest bg-[#8a3004] text-white">
                            {event.category}
                          </span>
                        </div>

                        <div className="space-y-3">
                          <h3 className="text-xl md:text-2xl font-black text-white leading-tight group-hover:text-[#c5a880] transition-colors duration-300 drop-shadow-md">
                            {event.title}
                          </h3>
                          
                          <div className="bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-white/90 text-sm space-y-2">
                            <p className="flex items-center gap-3">
                              <span className="material-symbols-outlined text-base text-[#c5a880]">calendar_today</span>
                              <span>{event.date}</span>
                            </p>
                            <p className="flex items-center gap-3">
                              <span className="material-symbols-outlined text-base text-[#c5a880]">location_on</span>
                              <span>{event.location}</span>
                            </p>
                          </div>

                          <div className="pt-1.5">
                            <span className="text-xs text-white/70 tracking-wider font-semibold">TAGS: {event.tags || 'General'}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </div>
        </section>
      )}

      {/* 2. Interactive Stacking Event Images Showcase Grid */}
      <section id="events-start" className="py-24 relative z-10 bg-white border-t border-slate-100">
        
        {/* Horizontal Filters Row (Scrolls away naturally, not sticky) */}
        {activeCategories.length > 0 && (
          <div className="border-b border-slate-100 py-6 mb-16">
            <div className="max-w-container mx-auto px-gutter flex overflow-x-auto gap-8 items-center whitespace-nowrap scrollbar-none justify-start lg:justify-center">
              {filterCategories.map((catName, index) => {
                const isActive = selectedCategory === catName;
                return (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedCategory(catName);
                      const el = document.getElementById('events-start');
                      if (el) {
                        const yOffset = -180;
                        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
                        window.scrollTo({ top: y, behavior: 'smooth' });
                      }
                    }}
                    className={`relative py-3 text-[11px] font-extrabold uppercase tracking-[0.2em] transition-all duration-300 flex items-center gap-2 flex-shrink-0 group ${
                      isActive ? 'text-[#8a3004]' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <span>{catName}</span>
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#8a3004] rounded-full animate-fade-in"></span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="max-w-container mx-auto px-gutter py-32 text-center text-slate-500">
            <div className="w-12 h-12 rounded-full border-4 border-slate-200 border-t-[#8a3004] animate-spin mx-auto mb-4"></div>
            <p className="text-sm font-light">Hang on, loading our latest events...</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="max-w-container mx-auto px-gutter py-24 text-center text-slate-500">
            <span className="material-symbols-outlined text-6xl opacity-30 text-[#8a3004] mb-4">layers_clear</span>
            <h3 className="text-xl font-bold text-slate-800">Nothing Here Yet</h3>
            <p className="text-sm font-light mt-1">We haven't added any events from the admin dashboard yet. Check back soon!</p>
          </div>
        ) : (
          <>
            {/* Desktop View (lg and up) */}
            <div ref={containerRef} className="hidden lg:grid max-w-container mx-auto px-gutter grid-cols-2 gap-16 items-start relative">
              
              {/* Invisible Trigger Elements in Normal Document Flow for Observer Scroll Spy (Calculates bidirectional triggers perfectly) */}
              <div className="absolute left-0 top-0 w-full h-full pointer-events-none z-0 overflow-hidden">
                {filteredEvents.map((event) => (
                  <div
                    key={`trigger-${event.id}`}
                    data-event-id={event.id}
                    className="event-scroll-trigger h-[calc(100vh-240px)]"
                  />
                ))}
              </div>

              {/* Left Column: Stacking Event Cover Images with Top Alignment & Scroll Velocity Skewing + Sub-Parallax image movement */}
              <div className="grid gap-2 relative z-10">
                {filteredEvents.map((event, idx) => {
                  const isActive = activeEventData?.id === event.id;

                  return (
                    <ParallaxEventCard
                      key={event.id}
                      event={event}
                      idx={idx}
                      isActive={isActive}
                      fallbackImages={fallbackImages}
                      skewSpring={skewSpring}
                      scaleSpring={scaleSpring}
                    />
                  );
                })}
              </div>

              {/* Right Column: Pinned Sticky Event Details (Fixed static position, centered vertically while scrolling) */}
              <div className="sticky top-[130px] h-[calc(100vh-240px)] flex gap-8 text-left pl-4 lg:pl-12 z-10 pt-2 items-center">
                
                {/* Permanent Continuous Vertical Timeline Thread */}
                <div className="w-1 flex flex-col items-center relative select-none pointer-events-none hidden sm:flex h-[260px]">
                  <div className="w-[2px] bg-slate-200/60 h-full rounded-full absolute top-0 bottom-0"></div>
                  
                  {/* Scroll-driven moving dot indicator */}
                  <motion.div 
                    style={{ y: dotY }}
                    className="w-3.5 h-3.5 rounded-full bg-[#8a3004] border-2 border-white shadow-[0_0_12px_rgba(138,48,4,0.4)] z-10 absolute left-[-5px]"
                  />
                </div>

                {/* Dynamic Event Details Content (Fade/morph transition) */}
                <motion.div 
                  style={{ skewY: skewSpring }}
                  className="flex-1 max-w-lg origin-left"
                >
                  <AnimatePresence mode="wait">
                    {activeEventData ? (
                      <motion.div
                        key={activeEventData.id}
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        exit="hidden"
                        className="space-y-4"
                      >
                        {/* Editorial Typographical Block */}
                        <motion.div variants={itemVariants} className="space-y-2">
                          <span className="text-[#8a3004] font-extrabold text-xs uppercase tracking-[0.3em] block mb-1 font-mono">
                            {activeEventData.category}
                          </span>
                          
                          {/* Staggered Word Reveal Heading */}
                          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tighter text-slate-900 font-serif leading-tight mb-1">
                            {activeEventData.title.split(" ").map((word, i) => (
                              <span key={i} className="inline-block overflow-hidden mr-3">
                                <motion.span
                                  initial={{ y: "100%" }}
                                  animate={{ y: 0 }}
                                  transition={{ duration: 0.7, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                                  className="inline-block"
                                >
                                  {word}
                                </motion.span>
                              </span>
                            ))}
                          </h2>

                          {/* Giant Date & Location Typographic Block */}
                          <div className="border-t border-slate-200/80 pt-4 space-y-1">
                            <span className="text-xl sm:text-2xl font-serif italic text-slate-800 block leading-none">
                              {activeEventData.date}
                            </span>
                            <span className="text-[10px] uppercase tracking-[0.2em] font-extrabold text-[#c5a880] block">
                              {activeEventData.location}
                            </span>
                          </div>
                        </motion.div>

                        {/* Editorial Description Text */}
                        <motion.p 
                          variants={itemVariants} 
                          className="text-[15px] text-slate-700 font-light leading-relaxed font-sans"
                        >
                          {activeEventData.description}
                        </motion.p>

                        {/* Minimalist Editorial Tags Separated by Slashes */}
                        {activeEventData.tags && (
                          <motion.div 
                            variants={itemVariants}
                            className="pt-6 border-t border-slate-100 text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500 leading-relaxed"
                          >
                            {activeEventData.tags.split(',').map((tag, i) => (
                              <span key={i}>
                                {i > 0 && <span className="text-slate-300 mx-3">/</span>}
                                <span className="hover:text-[#8a3004] transition-colors duration-200 cursor-default">
                                  {tag.trim()}
                                </span>
                              </span>
                            ))}
                          </motion.div>
                        )}
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </motion.div>

              </div>

            </div>

            {/* Mobile/Tablet view: Horizontal Carousel Slider */}
            <div className="lg:hidden w-full relative">
              {/* Floating Navigation Controls */}
              {filteredEvents.length > 1 && (
                <div className="flex justify-end gap-2 mb-6 px-gutter max-w-container mx-auto">
                  <button 
                    onClick={() => {
                      const carousel = document.getElementById('mobile-past-events-carousel');
                      if (carousel) {
                        carousel.scrollBy({ left: -carousel.clientWidth * 0.8, behavior: 'smooth' });
                      }
                    }}
                    className="w-10 h-10 rounded-full border border-slate-200 bg-white shadow-sm flex items-center justify-center text-primary hover:bg-[#faf8f5] transition-all"
                  >
                    <span className="material-symbols-outlined text-base font-bold">arrow_back</span>
                  </button>
                  <button 
                    onClick={() => {
                      const carousel = document.getElementById('mobile-past-events-carousel');
                      if (carousel) {
                        carousel.scrollBy({ left: carousel.clientWidth * 0.8, behavior: 'smooth' });
                      }
                    }}
                    className="w-10 h-10 rounded-full border border-slate-200 bg-white shadow-sm flex items-center justify-center text-primary hover:bg-[#faf8f5] transition-all"
                  >
                    <span className="material-symbols-outlined text-base font-bold">arrow_forward</span>
                  </button>
                </div>
              )}

              {/* Horizontal Scroll Container */}
              <div 
                id="mobile-past-events-carousel"
                className="flex overflow-x-auto snap-x snap-mandatory gap-6 scrollbar-none pb-8 px-gutter"
              >
                {filteredEvents.map((event) => {
                  const eventImg = event.imageUrl;
                  
                  return (
                    <div 
                      key={`mobile-${event.id}`}
                      className="w-[85vw] sm:w-[460px] flex-shrink-0 snap-center bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-md flex flex-col"
                    >
                      {/* Image header */}
                      <div className="w-full aspect-[16/11] relative bg-slate-50">
                        {eventImg ? (
                          <img 
                            src={eventImg} 
                            className="w-full h-full object-cover" 
                            alt={event.title} 
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-[#8a3004] via-[#752601] to-[#4c1600] flex items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
                            <span className="material-symbols-outlined text-5xl text-white/20">event</span>
                          </div>
                        )}
                        <span className="absolute bottom-4 left-4 bg-[#8a3004] text-white text-[10px] uppercase font-extrabold tracking-widest px-3 py-1.5 rounded-full shadow-md">
                          {event.category}
                        </span>
                      </div>

                      {/* Content body */}
                      <div className="p-6 flex flex-col flex-grow text-left space-y-4">
                        <div className="border-b border-slate-100 pb-3 flex flex-wrap gap-x-4 gap-y-1 items-center">
                          <div className="flex items-center gap-1 text-[11px] font-bold text-[#c5a880] tracking-wider uppercase">
                            <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                            <span>{event.date}</span>
                          </div>
                          {event.location && (
                            <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400 tracking-wider uppercase">
                              <span className="material-symbols-outlined text-[14px]">location_on</span>
                              <span>{event.location}</span>
                            </div>
                          )}
                        </div>

                        <h3 className="text-xl font-bold text-slate-800 tracking-tight font-serif leading-snug line-clamp-2">
                          {event.title}
                        </h3>

                        <p className="text-[13px] text-slate-500 leading-relaxed font-light line-clamp-4">
                          {event.description}
                        </p>

                        {event.tags && (
                          <div className="pt-2 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 flex flex-wrap gap-x-2 gap-y-1">
                            {event.tags.split(',').map((tag, i) => (
                              <span key={i} className="bg-slate-50 px-2 py-1 rounded">
                                {tag.trim()}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </section>

    </div>
  );
}
