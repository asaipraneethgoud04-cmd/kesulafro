import React, { useState, useEffect } from 'react';
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
      .select('*')
      .eq('status', 'upcoming')
      .order('date', { ascending: false })
      .order('createdAt', { ascending: false })
      .limit(3)
      .then(({ data, error }) => {
        if (error) {
          console.error('Error fetching upcoming events:', error);
        } else if (data) {
          setUpcomingEvents(data);
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
    { year: '2018', title: 'Foundational Roots', desc: 'Kesula Trust was established with a focus on documenting oral histories and traditional tribal art forms in five core communities.' },
    { year: '2020', title: 'Education Initiative', desc: 'Launched the first \'Tribal Roots\' school, providing bilingual education to 200+ children, merging modern curricula with ancestral knowledge.' },
    { year: '2022', title: 'National Recognition', desc: 'Received the Heritage Guardian Award for our work in preserving the endangered Banjara textile arts and craft techniques.' },
    { year: '2024', title: 'Global Outreach', desc: 'Expanding our footprint to 25+ communities, impacting over 2,00,000 lives through integrated healthcare and livelihood programs.' }
  ];

  const awards = [
    { title: 'Heritage Excellence', date: 'Awarded by State Govt 2021', icon: 'workspace_premium', desc: 'Recognized for outstanding contribution to the documentation of tribal oral traditions and languages.' },
    { title: 'Community Catalyst', date: 'NGO Excellence 2022', icon: 'volunteer_activism', desc: 'For pioneering sustainable livelihood models that empowered over 500 tribal women entrepreneurs.' },
    { title: 'Inclusive Education', date: 'Educational Impact 2023', icon: 'school', desc: 'Honored for bridging the digital divide in remote tribal districts through mobile learning units.' }
  ];

  const successStories = [
    {
      name: 'Lakshmi Devi',
      role: 'Artisan, Banjara Community',
      quote: 'The Kesula Trust didn\'t just give us resources; they gave us our pride back. By helping us market our traditional weaves, they ensured our children stay rooted while progressing.',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDDA_T-ozQyuKkb0P_BBnyAyEj77Q0rn4pquDGrRWuwqN6h1_8iBZXRbWY4Gs9DszdFhEGvTLSrQnsC_DMO8gvvr1CXeLcmSmk7KHf1lXeyT_V4dI4YhszdazxVy3vwBE6OojXjQlNZZ2d0tBJ2u5lAgOUhGanVWOKVZECFvYed6K3xQWHGs2CXe8dxzhtM3RFYToIOzxUNIc81ManEk_NzaXDzntXohoCsQtgtjt4AUFCQuGd_XfL-CAW12vK3sA4hpPGnqsbkfxo'
    },
    {
      name: 'Rajesh Kumar',
      role: 'Scholarship Recipient',
      quote: 'Education was a distant dream until the mobile library came to our village. Today, I am the first in my family to pursue a degree in environmental science.',
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
            className="w-full h-full object-cover"
          >
            <source src="/videos/hero.mp4" type="video/mp4" />
          </video>
        </div>

        <div className="max-w-container mx-auto px-gutter grid md:grid-cols-2 gap-12 items-center relative z-10 w-full">
          <div className="order-2 md:order-1 relative z-10">
            <h1 className="text-[40px] font-medium mb-8 leading-[1.1] tracking-tight text-white text-shadow-lg">
              Empowering <br />
              <span className="text-white font-medium text-shadow-lg underline decoration-primary decoration-4 underline-offset-4">Tribal Hearts.</span> <br />
              Building Futures.
            </h1>
            <p className="font-body-lg text-body-lg text-white max-w-lg mb-10 leading-relaxed font-medium text-shadow-md">
              Kesula Charitable Trust works for the holistic development and upliftment of tribal and marginalized communities through culture, education, healthcare, and livelihood generation.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/contact#donate" className="clay-btn clay-btn-primary px-8 py-3.5 text-xs uppercase tracking-wider text-center inline-block">
                Donate Now ♡
              </Link>
              <Link to="/contact#volunteer" className="clay-btn clay-btn-secondary px-8 py-3.5 text-xs uppercase tracking-wider text-center inline-block bg-white/90">
                Join Us 👤
              </Link>
            </div>
          </div>

          <div className="order-1 md:order-2 relative z-10 h-full flex items-end justify-end pb-10">
            {/* Hero image or spacing can go here if needed, keeping this container empty for layout balance */}
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="py-section-gap pb-[240px] md:pb-[160px] relative z-10 overflow-hidden bg-cover bg-center bg-fixed" style={{ backgroundImage: "url('/images/nature_bg.png')" }}>
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/70 z-0 pointer-events-none"></div>
        <div className="relative z-10 max-w-container mx-auto px-gutter grid md:grid-cols-2 gap-16 items-center">
          <div className="relative w-full aspect-square pb-10 md:pb-0 reveal-left">
            {/* Top Left Image */}
            <div className="absolute top-0 left-0 w-[55%] aspect-square rounded-3xl overflow-hidden shadow-xl z-10 hover:z-30 hover:shadow-2xl transition-all duration-500 img-zoom-container">
              <img alt="Community Impact" loading="lazy" className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB7Sbje4mvc1gWM2R3C5oUDF0etQaSjhaeIiG_8WJpPuTlvlfawUIozgiWvVNo5nD6_lkvfgIWFsgvlSB8UeYHRgYz7b1CAgtY-FaF23owWNShiMzCRCemt-OBBjJRwjv9heoK2aqTPcMAA03jtFJwTAPbDnd7orKP56sJGmFLSE-lEwfZ-FzHHQNovpftUoi-XjL0TY1u72u9q4_YAAF5X6AuUrrZZesZsB4mahMFYhtMhBYZNY5vVzgTFv9XYiHLA-NqAMRwUO-Q" />
            </div>

            {/* Top Right Image */}
            <div className="absolute top-[15%] right-0 w-[45%] aspect-square rounded-3xl overflow-hidden shadow-lg z-0 hover:z-30 hover:shadow-2xl transition-all duration-500 img-zoom-container">
              <img alt="Healthcare Initiatives" loading="lazy" className="w-full h-full object-cover"
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" />
            </div>

            {/* Bottom Middle Image */}
            <div className="absolute bottom-0 left-[10%] md:left-[15%] w-[75%] md:w-[70%] aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl z-20 hover:z-30 hover:shadow-2xl transition-all duration-500 img-zoom-container">
              <img alt="Educational Programs" loading="lazy" className="w-full h-full object-cover"
                src="https://images.unsplash.com/photo-1509062522246-3755977927d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" />
            </div>
          </div>
          <div className="reveal-right">
            <span className="text-white text-shadow-md font-extrabold text-xs uppercase tracking-[0.2em] mb-3 block">Our Foundation</span>
            <h2 className="font-headline-lg text-headline-lg text-white text-shadow-lg mb-6 leading-tight">Spreading Love and Selfless Service</h2>
            <p className="font-body-md text-white text-shadow-md leading-relaxed mb-6 font-thin">
              Founded to promote the teachings and message of <strong>Sant Shri Sevalal Maharaj</strong>, Kesula Charitable Trust is dedicated to improving the lives of tribal and marginalized communities.
            </p>
            <p className="font-body-md text-white text-shadow-md leading-relaxed mb-8 font-thin">
              We focus on delivering primary healthcare, value-based bilingual education, vocational livelihood programs, and traditional cultural preservation to remote tribal lands.
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
                  <h3 className="font-headline-lg text-xl font-extrabold text-primary">Our Vision</h3>
                </div>
                <p className="font-body-md text-on-surface-variant font-light line-clamp-3 relative z-10">
                  To promote the ideals, teachings, and timeless message of Sant Shri Sevalal Maharaj by empowering tribal communities and society through education, healthcare, and selfless service.
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
                  <h3 className="font-headline-lg text-xl font-extrabold text-primary">Our Mission</h3>
                </div>
                <p className="font-body-md text-on-surface-variant font-light line-clamp-3 relative z-10">
                  To preserve and spread the philosophy of Sant Shri Sevalal Maharaj through impactful community development programmes, improving the lives of tribal and marginalized communities.
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
      <section className="pt-16 md:pt-[180px] pb-16 relative z-10 overflow-hidden bg-cover bg-center bg-fixed" style={{ backgroundImage: "url('/images/artisan_bg.png')" }}>
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/60 z-0"></div>
        {/* Zig-Zag Tribal Art (Right) */}
        <img src="/images/tribal_3.png" loading="lazy" className="absolute top-1/2 -translate-y-1/2 right-0 w-[650px] h-[650px] opacity-[0.40] mix-blend-multiply pointer-events-none object-contain z-0 animate-spin-vertical-centered" alt="" />
        <div className="relative z-10 max-w-container mx-auto px-gutter">
          <div className="text-center mb-12 reveal-top">
            <span className="text-white text-shadow-md font-extrabold text-xs uppercase tracking-[0.2em] block mb-3">Our Work</span>
            <h2 className="font-headline-lg text-headline-lg text-white text-shadow-lg">What We Do</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 reveal-bottom">
            {[
              { id: 'education', name: 'Education & Skill Development', icon: 'school', desc: 'Empowering tribal youth through bilingual education, digital literacy, and vocational skill training programs.' },
              { id: 'healthcare', name: 'Healthcare & Wellness', icon: 'medication', desc: 'Delivering primary healthcare, mobile medical camps, and wellness programs to remote tribal communities.' },
              { id: 'livelihood', name: 'Livelihood & Rural Development', icon: 'engineering', desc: 'Creating sustainable livelihood models through agriculture, artisan support, and rural infrastructure.' },
              { id: 'empowerment', name: 'Women, Youth & Disability Empowerment', icon: 'diversity_3', desc: 'Building self-reliance through Self-Help Groups, vocational training, and human rights advocacy.' },
              { id: 'environment', name: 'Environment & Sustainability', icon: 'eco', desc: 'Protecting natural resources through tree plantations, water conservation, and sanitation programs.' },
              { id: 'culture', name: 'Culture, Community & Animal Welfare', icon: 'brush', desc: 'Preserving tribal heritage, celebrating traditional festivals, and promoting animal welfare.' }
            ].map(activity => (
              <Link to="/activities" key={activity.id} className="group relative rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
                {/* Card Background */}
                <div className="absolute inset-0 bg-black/70 backdrop-blur-xl border border-white/[0.15] rounded-2xl transition-all duration-500 group-hover:bg-black/80 group-hover:border-white/[0.30]"></div>
                {/* Animated bottom accent line */}
                <div className="absolute bottom-0 left-0 h-[3px] w-0 bg-gradient-to-r from-primary via-amber-400 to-primary rounded-full transition-all duration-500 group-hover:w-full"></div>
                {/* Content */}
                <div className="relative z-10 p-7">
                  <div className="flex items-start gap-5 mb-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/40 to-primary/15 border border-primary/30 flex items-center justify-center flex-shrink-0 transition-all duration-500 group-hover:from-primary/60 group-hover:to-primary/25 group-hover:shadow-lg group-hover:shadow-primary/20 group-hover:scale-110">
                      <span className="material-symbols-outlined text-2xl text-white drop-shadow-md">{activity.icon}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-headline-md text-base font-bold leading-snug text-white drop-shadow-lg mb-1 group-hover:text-primary transition-colors duration-300">{activity.name}</h3>
                    </div>
                  </div>
                  <p className="text-white/90 text-sm leading-relaxed mb-5">{activity.desc}</p>
                  <div className="flex items-center gap-1.5 text-primary text-xs font-bold uppercase tracking-wider group-hover:text-amber-400 transition-all duration-300">
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
      <section className="py-16 relative z-10 overflow-hidden">
        {/* Zig-Zag Tribal Art (Left) */}
        <img src="/images/tribal_1.png" loading="lazy" className="absolute top-1/2 -translate-y-1/2 left-0 w-[650px] h-[650px] opacity-[0.25] mix-blend-overlay pointer-events-none object-contain animate-spin-vertical-centered" alt="" />
        <div className="max-w-container mx-auto px-gutter text-center">
          <h2 className="font-headline-lg text-headline-lg text-primary mb-12 reveal-top">Our Collective Impact</h2>
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
      <section className="py-16 relative z-10 overflow-hidden bg-white/80 backdrop-blur-sm border-t border-white/50">
        {/* Zig-Zag Tribal Art (Right) */}
        <img src="/images/tribal_2.png" loading="lazy" className="absolute top-1/2 -translate-y-1/2 right-0 w-[650px] h-[650px] opacity-[0.40] mix-blend-multiply pointer-events-none object-contain animate-spin-vertical-centered" alt="" />
        <div className="max-w-container mx-auto px-gutter">
          <div className="flex items-center gap-4 mb-10 reveal-top">
            <h3 className="font-headline-lg text-headline-lg text-primary font-extrabold">Upcoming Events</h3>
            <div className="h-[1px] flex-1 bg-secondary/15"></div>
          </div>

          {upcomingEvents.length === 0 ? (
            <div className="glass-panel p-10 rounded-3xl border border-white/40 text-center max-w-lg mx-auto shadow-sm">
              <span className="material-symbols-outlined text-primary text-5xl mb-4 opacity-75">event_note</span>
              <h4 className="font-headline-md text-lg mb-2 font-bold">No Scheduled Events</h4>
              <p className="text-on-surface-variant text-sm mb-6 leading-relaxed font-light">
                All scheduled activities are currently ongoing. Click below to explore our detailed programs.
              </p>
              <Link to="/activities" className="clay-btn clay-btn-accent px-6 py-2.5 text-xs uppercase tracking-wider inline-block mt-4">
                Explore Our Activities
              </Link>
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
                      <div className="flex-1 min-w-0">
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

      {/* Photo Gallery Section - Circular Animation */}
      <section className="py-16 relative z-10 overflow-hidden bg-surface-container/30">
        <img src="/images/rangoli_bg.png" loading="lazy" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] md:w-[800px] h-auto opacity-[0.25] mix-blend-multiply pointer-events-none object-contain z-0 animate-spin-centered" alt="" />
        <div className="max-w-container mx-auto px-gutter relative z-10">
          <div className="text-center mb-16 reveal-top">
            <span className="text-primary font-extrabold text-xs uppercase tracking-[0.2em] block mb-3">Our Memories</span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-6">Moments of Impact</h2>
          </div>

          <div className="reveal-bottom pb-12 w-full">
            <AutoScrollGallery items={galleryImages} />
          </div>
        </div>
      </section>

      {/* CTA Banner - Premium Glassmorphic Overlay over Dark Background */}
      <section className="max-w-container mx-auto px-gutter mb-20 relative z-10 reveal">
        <div className="rounded-3xl p-12 md:p-16 border border-white/10 shadow-2xl relative overflow-hidden text-center text-white bg-cover bg-center" style={{ backgroundImage: "url('/images/artisan_bg.png')" }}>
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/50 z-0 pointer-events-none"></div>
          <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-primary/30 blur-[90px] pointer-events-none z-0"></div>
          <div className="absolute -bottom-24 -right-24 w-64 h-64 rounded-full bg-secondary/30 blur-[90px] pointer-events-none z-0"></div>

          <div className="relative z-10">
            <h2 className="font-headline-lg text-headline-lg text-white text-shadow-lg mb-6 font-extrabold max-w-2xl mx-auto leading-[1.2]">Be the change for a better tomorrow.</h2>
            <p className="font-body-lg text-body-lg text-white text-shadow-md max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
              Your support can bring hope, education, and opportunities to tribal communities. Let's build a brighter, inclusive future together.
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