import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import TiltCard from '../components/ui/TiltCard';
import CircularGallery from '../components/ui/CircularGallery';
import AutoScrollGallery from '../components/ui/AutoScrollGallery';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { supabase } from '../lib/supabase';

export default function Home() {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [activeTab, setActiveTab] = useState('milestones');
  const [selectedMedia, setSelectedMedia] = useState(null);
  const carouselRef = useRef(null);

  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = 360;
      carouselRef.current.scrollBy({
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
          setUpcomingEvents(upcoming);
        }
      });

    // Fetch latest gallery images from Supabase
    supabase.from('gallery')
      .select('id, imageUrl, gridShape')
      .order('createdAt', { ascending: true })
      .then(({ data, error }) => {
        if (error) {
          console.error('Could not load latest gallery items', error);
        } else if (data && data.length > 0) {
          const formatted = data.map(item => ({ image: item.imageUrl, text: '' }));
          // Keep all images (both initial static and fetched from Supabase)
          setGalleryImages(prev => {
            // Prevent duplicates if component re-mounts
            const newUrls = formatted.filter(f => !prev.some(p => p.image === f.image));
            return [...prev, ...newUrls];
          });
        }
      });
  }, []);

  const milestones = [
    { year: '2018', title: 'Where It All Started', desc: 'A small group of us got together and said — let\'s do something real. We started by recording folk stories and art from five tribal communities before they were lost forever.' },
    { year: '2020', title: 'Our First School', desc: 'We opened the Tribal Roots school and welcomed 200+ kids. They learn in their mother tongue and in Hindi, and the elders come in to teach what textbooks can\'t.' },
    { year: '2022', title: 'People Noticed', desc: 'We received the Heritage Guardian Award for helping keep Banjara textile arts alive. That felt good — not for the trophy, but because the artisans felt seen.' },
    { year: '2024', title: 'Still Growing', desc: 'Today we\'re in 25+ communities. Over 2,00,000 people have been part of our healthcare camps, schools, and livelihood workshops. There\'s still so much to do.' }
  ];

  const awards = [
    { title: 'Heritage Excellence', date: 'State Govt, 2021', icon: 'workspace_premium', desc: 'For our work in recording tribal folk songs, oral stories, and endangered languages before they fade away.' },
    { title: 'Community Catalyst', date: 'NGO Excellence, 2022', icon: 'volunteer_activism', desc: 'For helping over 500 tribal women start their own small businesses and earn a steady living.' },
    { title: 'Inclusive Education', date: 'Educational Impact, 2023', icon: 'school', desc: 'For taking mobile learning vans into remote areas where schools have never reached.' }
  ];

  const successStories = [
    {
      name: 'Lakshmi Devi',
      role: 'Artisan, Banjara Community',
      quote: 'They didn\'t just hand us things. They sat with us, learned our craft, and then helped us sell our weaves for what they\'re truly worth. My daughters now say they want to carry this forward.',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDDA_T-ozQyuKkb0P_BBnyAyEj77Q0rn4pquDGrRWuwqN6h1_8iBZXRbWY4Gs9DszdFhEGvTLSrQnsC_DMO8gvvr1CXeLcmSmk7KHf1lXeyT_V4dI4YhszdazxVy3vwBE6OojXjQlNZZ2d0tBJ2u5lAgOUhGanVWOKVZECFvYed6K3xQWHGs2CXe8dxzhtM3RFYToIOzxUNIc81ManEk_NzaXDzntXohoCsQtgtjt4AUFCQuGd_XfL-CAW12vK3sA4hpPGnqsbkfxo'
    },
    {
      name: 'Rajesh Kumar',
      role: 'Scholarship Recipient',
      quote: 'Nobody in my family had ever been to college. When the mobile library van first came to our village, I thought it was a joke. Now I\'m studying environmental science.',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC8Ja6xHuPTJLJS81vU2Cq4V2v_G-YHBqK0jWyo7hlwL4ijSdZ-CHjFmQ1JfBg5vAkK39Zx3HR5QFmwexDg-CS3_8KV3rlEkrR9GyCqSWQoWXjSMiLUsY8GI15USL__w5MO8f4xn4_rrNLzZAtKBeJ2hAbbneliaYKQ9wnzcfr3_pSRxE-DRD4vkxsdsHNZ08VkH8VzFpkMcafxVlm-H_jxUHtQOdz7fkp-qFBAD7xahzD4uhuuLnGFy49ag8f09_JRgRtiPP4MSaA'
    }
  ];

  const mediaClips = [
    { outlet: 'Sakshi News • Oct 2023', title: 'Preserving Tribal Heritage in the Modern Age', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDlrUiAm3LIjt1IW6YFj8mGgtMOJwQFmD23m6i05lVlNlcyL16pmM4BnMzdojV25Z8urQeJj0NwLDs_bjnvM_dV8ipvX-PBfMj2x6L3LRi0zSavtGx-TeW6pm7uRbcktC1cx17FPzoQNkkP9GN7_iuAp2weYKyz7y_zEaaN_5iJO-htDsetEVh5LqJONtKoTflHtrmCsmB7xlbeYfxR4QXiDX9rji6lDN7IXlyRr1MjdKieiQ5_UramffxS84IWDZm-HIVG_NWu3sQ' },
    { outlet: 'The Hindu • Aug 2023', title: 'Healthcare Reaches the Remote Hinterlands', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuASuqZnvBfu_i4Xe3vAyhgUGVU7UtO727urOwiLeLOVJLIXxl5FH2walVxM0bYjw5mTMpjdhPui8NMeifm0NHBgI20e0Zdb2y7HubpjZYShL9IYlGG1uV2fcD9bFe7M7rA387sJ5i7fvSHZ-5zqHRKcuUVCX03IyqiUIumupymxT_KO_c8Bwq3lUJMafmG1DrDhXFu9xC2YQqZBIljVS1p3PIzWl3kPSsTIVJ_Ce2iYeuL9usljHJVGsOeGLuR8S5cHrqTLpt_H1k0' },
    { outlet: 'Dainik Jagran • Jan 2024', title: 'Empowering Tribal Youth through Skill Hubs', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCxwpVmmrTt4RNG2qqaIbHy9_UriP7vze78XRiGzODCLHAUxTwm9NItTeNgeP3Rs3caXThPAwj3YWcKdWm6C3ff2Tlpw9ImVLhdGeYyOco4qzJlHARpXcINn5_5RWBTO_IKnYDGW6GU477MpOfzWgArctNgRhQbslv31zHQ8aQupsnyIqpb2AD05i0s9RVzFSUj0TSKhm3kB0Lgfus0xeutF_Ea5RYlyULd6eJ0S96-d_OOxtcqUnOi1fq-M1dWefUSbhpsc3qDLAg' }
  ];

  return (
    <div className="relative overflow-hidden bg-background text-on-surface">
      {/* Removed continuous rangoli background */}
      {/* Glowing background gradient blobs for premium minimalist depth */}
      <div className="absolute top-[5%] right-[-10%] w-[50vw] h-[50vw] rounded-full blur-[130px] opacity-10 bg-primary pointer-events-none z-0 animate-float"></div>
      <div className="absolute top-[25%] left-[-15%] w-[40vw] h-[40vw] rounded-full blur-[130px] opacity-[0.08] bg-accent pointer-events-none z-0 animate-float-delayed"></div>
      <div className="absolute bottom-[20%] right-[-10%] w-[45vw] h-[45vw] rounded-full blur-[140px] opacity-[0.08] bg-secondary pointer-events-none z-0 animate-float"></div>

      {/* HeroSection */}
      <section className="relative h-screen flex items-end pb-24 z-10 reveal overflow-hidden">
        {/* Background Video */}
        <div className="absolute inset-0 w-full h-full z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            poster="/images/nature_bg.png"
            className="w-full h-full object-cover"
          >
            <source src="/videos/hero.mp4" type="video/mp4" />
          </video>
        </div>

        <div className="max-w-container mx-auto px-gutter grid md:grid-cols-2 gap-12 items-center relative z-10 w-full -mt-[5%]">
          <div className="order-2 md:order-1 relative z-10">
            <h1 className="text-[44px] md:text-[56px] lg:text-[72px] font-bold mb-8 leading-[1.05] tracking-tight text-white text-shadow-lg">
              Empowering <br />
              <span className="text-white font-medium text-shadow-lg underline decoration-primary decoration-4 underline-offset-4">Tribal Hearts.</span> <br />
              Building Futures.
            </h1>
            <p className="text-base md:text-lg text-white max-w-xl mb-10 leading-relaxed font-medium text-shadow-md">
              We walk alongside tribal and rural communities — helping with schools, health camps, jobs, and keeping their traditions alive. That's what Kesula Trust is about.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/contact#donate" className="clay-btn clay-btn-primary px-12 py-5 text-base uppercase tracking-wider text-center inline-block">
                Donate Now
              </Link>
              <Link to="/contact#volunteer" className="clay-btn clay-btn-secondary px-12 py-5 text-base uppercase tracking-wider text-center inline-block bg-white/90">
                Join Us
              </Link>
            </div>
          </div>

          <div className="order-1 md:order-2 relative z-10 h-full flex items-end justify-end pb-10">
            {/* Hero image or spacing can go here if needed, keeping this container empty for layout balance */}
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="py-section-gap pb-[360px] md:pb-[280px] relative z-10 overflow-hidden bg-cover bg-center bg-fixed" style={{ backgroundImage: "url('/images/nature_bg.png')" }}>
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/70 z-0 pointer-events-none"></div>
        <div className="relative z-10 max-w-container mx-auto px-gutter grid md:grid-cols-2 gap-16 items-center">
          <div className="relative w-full aspect-square pb-10 md:pb-0 reveal-left">
            {/* Top Left Image */}
            <div className="absolute top-0 left-0 w-[55%] aspect-square rounded-3xl overflow-hidden shadow-xl z-10 hover:z-30 hover:shadow-2xl transition-all duration-500 img-zoom-container">
              <img alt="Plantation & Environment" loading="lazy" className="w-full h-full object-cover"
                src="/images/plantation.jpeg" />
            </div>

            {/* Top Right Image */}
            <div className="absolute top-[15%] right-0 w-[45%] aspect-square rounded-3xl overflow-hidden shadow-lg z-0 hover:z-30 hover:shadow-2xl transition-all duration-500 img-zoom-container">
              <img alt="Cultural Celebrations" loading="lazy" className="w-full h-full object-cover"
                src="/images/cultural.jpg" />
            </div>

            {/* Bottom Middle Image */}
            <div className="absolute bottom-0 left-[10%] md:left-[15%] w-[75%] md:w-[70%] aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl z-20 hover:z-30 hover:shadow-2xl transition-all duration-500 img-zoom-container">
              <img alt="Educational Programs" loading="lazy" className="w-full h-full object-cover"
                src="/images/education.jpg" />
            </div>
          </div>
          <div className="reveal-right">
            <span className="text-white text-shadow-md font-extrabold text-xs uppercase tracking-[0.2em] mb-3 block">Our Foundation</span>
            <h2 className="text-4xl md:text-5xl text-white text-shadow-lg mb-6 leading-tight font-bold">Rooted in Love, Driven by Service</h2>
            <p className="font-body-md text-white text-shadow-md leading-relaxed mb-6 font-thin">
              Kesula Trust started because of one simple belief — the teachings of <strong>Sant Shri Sevalal Maharaj</strong> are not just words, they're a way of living. We took those teachings and turned them into action.
            </p>
            <p className="font-body-md text-white text-shadow-md leading-relaxed mb-8 font-thin">
              We run health camps in villages that have no hospital nearby. We teach kids in their own language. We help families grow food and earn a livelihood. And we make sure their culture doesn't get left behind.
            </p>
            <Link to="/about" className="clay-btn clay-btn-secondary px-6 py-3 text-xs uppercase tracking-wider inline-block shadow-xl border-white/20">
              Learn More About Us
            </Link>
          </div>
        </div>
      </section>

      {/* Focus Areas - Arched Cards */}
      <div className="relative z-30 w-full md:h-0">
        <div className="md:absolute w-full top-0 left-0 md:transform md:-translate-y-1/2 pointer-events-none -mt-8 md:mt-0">
          <div className="max-w-container mx-auto px-gutter relative z-10 pointer-events-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <TiltCard elementType={Link} to="/about" className="bg-[#fff1ec] p-8 rounded-3xl border-2 !border-[#8a3004] shadow-sm transition-all duration-300 group block relative overflow-hidden reveal-top">
                <div className="absolute -bottom-16 -right-16 w-72 h-72 opacity-[0.40] mix-blend-multiply pointer-events-none transition-transform duration-700 group-hover:scale-110 z-0">
                  <img src="/images/tribal_2.png" loading="lazy" className="w-full h-full object-contain animate-spin-clockwise" alt="" />
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -mr-10 -mt-10 transition-all group-hover:bg-primary/10 z-0"></div>
                <div className="flex items-center gap-4 mb-4 relative z-10">
                  <div className="w-10 h-10 clay-card-colored flex items-center justify-center text-primary shadow-inner rounded-full">
                    <span className="material-symbols-outlined text-xl">visibility</span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-extrabold text-primary">Our Vision</h3>
                </div>
                <p className="font-body-md text-on-surface-variant font-light line-clamp-3 relative z-10">
                  To carry forward the spirit of Sant Shri Sevalal Maharaj — his kindness, his love for people, and his belief that everyone deserves dignity — through real work on the ground.
                </p>
                <div className="mt-6 flex items-center text-primary text-xs font-bold uppercase tracking-wider group-hover:gap-2 transition-all relative z-10">
                  Read full vision <span className="material-symbols-outlined text-sm ml-1">arrow_forward</span>
                </div>
              </TiltCard>

              <TiltCard elementType={Link} to="/about" className="bg-[#fff1ec] p-8 rounded-3xl border-2 !border-[#8a3004] shadow-sm transition-all duration-300 group block relative overflow-hidden reveal-bottom">
                <div className="absolute -bottom-16 -right-16 w-72 h-72 opacity-[0.40] mix-blend-multiply pointer-events-none transition-transform duration-700 group-hover:scale-110 z-0">
                  <img src="/images/tribal_2.png" loading="lazy" className="w-full h-full object-contain animate-spin-clockwise" alt="" />
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -mr-10 -mt-10 transition-all group-hover:bg-primary/10 z-0"></div>
                <div className="flex items-center gap-4 mb-4 relative z-10">
                  <div className="w-10 h-10 clay-card-colored flex items-center justify-center text-primary shadow-inner rounded-full">
                    <span className="material-symbols-outlined text-xl">track_changes</span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-extrabold text-primary">Our Mission</h3>
                </div>
                <p className="font-body-md text-on-surface-variant font-light line-clamp-3 relative z-10">
                  To make a real difference in the daily lives of tribal families — through better schools, health support, honest livelihoods, and by making sure their voices are heard.
                </p>
                <div className="mt-6 flex items-center text-primary text-xs font-bold uppercase tracking-wider group-hover:gap-2 transition-all relative z-10">
                  Read full mission <span className="material-symbols-outlined text-sm ml-1">arrow_forward</span>
                </div>
              </TiltCard>
            </div>
          </div>
        </div>
      </div>

      {/* Stats - Minimalist line art */}
      <section className="pt-44 md:pt-[300px] pb-44 relative z-10 overflow-hidden bg-cover bg-center bg-fixed" style={{ backgroundImage: "url('/images/artisan_bg.png')" }}>
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/60 z-0"></div>
        <div className="relative z-10 max-w-container mx-auto px-gutter">
          <div className="text-center mb-16 reveal-top">
            <span className="text-white text-shadow-md font-extrabold text-xs uppercase tracking-[0.2em] block mb-3">Our Work</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white text-shadow-lg mb-4">What We Do</h2>
            <p className="text-white/80 max-w-3xl mx-auto text-sm sm:text-base leading-relaxed font-light drop-shadow-md">
              We go where the roads end. We sit with families, listen to what they actually need, and then we build it together — schools, health camps, farming support, and cultural programmes. No jargon, just honest work.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 reveal-bottom">
            {[
              { id: 'education', name: 'Education & Skill Development', icon: 'school' },
              { id: 'healthcare', name: 'Healthcare & Wellness', icon: 'medication' },
              { id: 'livelihood', name: 'Livelihood & Rural Development', icon: 'engineering' },
              { id: 'empowerment', name: 'Women, Youth & Disability Empowerment', icon: 'diversity_3' },
              { id: 'environment', name: 'Environment & Sustainability', icon: 'eco' },
              { id: 'culture', name: 'Culture, Community & Animal Welfare', icon: 'brush' }
            ].map(activity => (
              <Link to="/activities" key={activity.id} className="group relative rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl block">
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
                    <span>Learn More</span>
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
        <img src="/images/tribal_1.png" loading="lazy" className="absolute top-1/2 -translate-y-1/2 left-0 w-[650px] h-[650px] opacity-[0.25] mix-blend-overlay pointer-events-none object-contain animate-spin-vertical-centered" alt="" />
        <div className="max-w-container mx-auto px-gutter text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-12 reveal-top">Our Collective Impact</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 reveal-bottom">
            <TiltCard className="glass-panel p-8 border-2 !border-primary rounded-3xl relative overflow-hidden group">
              <div className="relative z-10 font-headline-lg text-primary text-4xl font-extrabold mb-2.5">200K+</div>
              <div className="relative z-10 text-on-surface-variant font-bold text-xs uppercase tracking-widest">Lives Impacted</div>
            </TiltCard>
            <TiltCard className="glass-panel p-8 border-2 !border-primary rounded-3xl relative overflow-hidden group">
              <div className="relative z-10 font-headline-lg text-primary text-4xl font-extrabold mb-2.5">50+</div>
              <div className="relative z-10 text-on-surface-variant font-bold text-xs uppercase tracking-widest">Villages Reached</div>
            </TiltCard>
            <TiltCard className="glass-panel p-8 border-2 !border-primary rounded-3xl relative overflow-hidden group">
              <div className="relative z-10 font-headline-lg text-primary text-4xl font-extrabold mb-2.5">1,000+</div>
              <div className="relative z-10 text-on-surface-variant font-bold text-xs uppercase tracking-widest">Active Volunteers</div>
            </TiltCard>
            <TiltCard className="glass-panel p-8 border-2 !border-primary rounded-3xl relative overflow-hidden group">
              <div className="relative z-10 font-headline-lg text-primary text-4xl font-extrabold mb-2.5">6+ Years</div>
              <div className="relative z-10 text-on-surface-variant font-bold text-xs uppercase tracking-widest">Dedicated Service</div>
            </TiltCard>
          </div>
        </div>
      </section>

      {/* Upcoming Events Preview Section */}
      {upcomingEvents.length > 0 && (
        <section className="py-44 relative z-10 overflow-hidden bg-white/80 backdrop-blur-sm border-t border-white/50">
          {/* Zig-Zag Tribal Art (Right) */}
          <img src="/images/tribal_2.png" loading="lazy" className="absolute top-1/2 -translate-y-1/2 right-0 w-[650px] h-[650px] opacity-[0.40] mix-blend-multiply pointer-events-none object-contain animate-spin-vertical-centered" alt="" />
          <div className="max-w-container mx-auto px-gutter">
            <div className="flex items-center justify-between gap-4 mb-10 reveal-top">
              <h2 className="text-4xl md:text-5xl font-extrabold text-primary">Upcoming Events</h2>
              <div className="flex items-center gap-3 flex-1 justify-end">
                {upcomingEvents.length > 3 && (
                  <div className="flex gap-2">
                    <button 
                      onClick={() => scrollCarousel('left')}
                      className="w-10 h-10 rounded-full border border-secondary/15 flex items-center justify-center text-primary hover:bg-[#8a3004] hover:text-white transition-all shadow-sm focus:outline-none"
                    >
                      <span className="material-symbols-outlined text-xl">arrow_back</span>
                    </button>
                    <button 
                      onClick={() => scrollCarousel('right')}
                      className="w-10 h-10 rounded-full border border-secondary/15 flex items-center justify-center text-primary hover:bg-[#8a3004] hover:text-white transition-all shadow-sm focus:outline-none"
                    >
                      <span className="material-symbols-outlined text-xl">arrow_forward</span>
                    </button>
                  </div>
                )}
                <div className="h-[1px] w-20 md:w-40 bg-secondary/15"></div>
              </div>
            </div>

            {upcomingEvents.length > 3 ? (
              <div 
                ref={carouselRef}
                className="flex gap-6 overflow-x-auto pb-8 scrollbar-none scroll-smooth snap-x snap-mandatory"
              >
                {upcomingEvents.map((event) => {
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
                            Register
                          </Link>
                        </div>
                      </TiltCard>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-6 reveal-bottom">
                {upcomingEvents.map((event) => {
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
                          Register
                        </Link>
                      </div>
                    </TiltCard>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Photo Gallery Section - Circular Animation */}
      <section className="pt-44 pb-24 relative z-10 overflow-hidden bg-surface-container/30">
        <img src="/images/rangoli_bg.png" loading="lazy" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] md:w-[800px] h-auto opacity-[0.25] mix-blend-multiply pointer-events-none object-contain z-0 animate-spin-centered" alt="" />
        <div className="max-w-container mx-auto px-gutter relative z-10">
          <div className="text-center mb-16 reveal-top">
            <span className="text-primary font-extrabold text-xs uppercase tracking-[0.2em] block mb-3">Our Memories</span>
            <h2 className="text-4xl md:text-5xl font-bold text-on-surface mb-6">Moments of Impact</h2>
          </div>

          <div className="reveal-bottom pb-12 w-full">
            <AutoScrollGallery items={galleryImages} />
          </div>

          <div className="text-center mt-2 reveal-bottom">
            <Link
              to="/gallery"
              className="bg-[#8a3004] hover:bg-[#a0420b] text-white text-xs font-bold uppercase tracking-widest px-8 py-4 rounded-2xl inline-flex items-center justify-center gap-2 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#8a3004]/25"
            >
              <span>View Gallery</span>
              <span className="material-symbols-outlined text-sm">photo_library</span>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Banner - Premium Glassmorphic Overlay over Dark Background */}
      <section className="max-w-container mx-auto px-gutter mb-44 relative z-10 reveal">
        <div className="rounded-3xl p-12 md:p-16 border border-white/10 shadow-2xl relative overflow-hidden text-center text-white bg-cover bg-center" style={{ backgroundImage: "url('/images/be.png')" }}>
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/50 z-0 pointer-events-none"></div>
          <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-primary/30 blur-[90px] pointer-events-none z-0"></div>
          <div className="absolute -bottom-24 -right-24 w-64 h-64 rounded-full bg-secondary/30 blur-[90px] pointer-events-none z-0"></div>

          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl text-white text-shadow-lg mb-6 font-extrabold max-w-2xl mx-auto leading-[1.2]">Be the change for a better tomorrow.</h2>
            <p className="font-body-lg text-body-lg text-white text-shadow-md max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
              Even a small contribution goes a long way. It could mean a child going to school, a family getting medical care, or an elder seeing their craft celebrated again.
            </p>
            <div className="flex flex-wrap justify-center items-center gap-5">
              <Link to="/contact#donate" className="bg-gradient-to-r from-primary to-amber-600 hover:from-amber-600 hover:to-primary text-white text-sm font-bold uppercase tracking-widest px-8 py-4 rounded-2xl flex items-center justify-center gap-2 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/25">
                <span>Donate Now</span>
                <span className="material-symbols-outlined text-lg leading-none">favorite</span>
              </Link>
              <Link to="/contact#volunteer" className="bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40 text-sm font-bold uppercase tracking-widest px-8 py-4 rounded-2xl flex items-center justify-center gap-2 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">
                <span>Become a Volunteer</span>
                <span className="material-symbols-outlined text-lg leading-none">volunteer_activism</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}