import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../context/LanguageContext';

import './Gallery.css';

export default function Gallery() {
  const { t } = useLanguage();
  const [galleryImages, setGalleryImages] = useState([]);
  const observerRef = useRef(null);

  const spanPattern = [
    'col-span-1 row-span-2',
    'col-span-1 row-span-2',
    'col-span-1 row-span-1',
    'col-span-1 row-span-2',
    'col-span-2 row-span-2',
    'col-span-1 row-span-1',
    'col-span-1 row-span-2',
    'col-span-2 row-span-2',
    'col-span-1 row-span-1'
  ];

  useEffect(() => {
    supabase.from('gallery')
      .select('*')
      .order('createdAt', { ascending: true })
      .then(({ data, error }) => {
        if (error) {
          console.error("Failed to load backend gallery images", error);
        } else if (data) {
          setGalleryImages(data);
        }
      });
  }, []);

  const allImages = galleryImages;

  useEffect(() => {
    if (allImages.length === 0) return;

    // Setup intersection observer for fade-in effects on scroll
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    const gridItems = document.querySelectorAll('.gallery-grid-item');
    gridItems.forEach(item => observerRef.current.observe(item));

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [galleryImages]);

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[600px] md:min-h-[80vh] lg:min-h-[95vh] flex items-center justify-center pt-32 pb-20 md:pt-48 md:pb-24 z-10 reveal overflow-hidden bg-cover bg-center bg-fixed" style={{ backgroundImage: "url('/images/gallery.webp')" }}>
        <div className="absolute inset-0 bg-black/60 z-0 pointer-events-none"></div>
        <div className="max-w-container mx-auto px-gutter text-center relative z-10 w-full">
          <span className="text-white font-extrabold text-xs uppercase tracking-[0.2em] block mb-3 reveal-top text-shadow-md">{t('nav.gallery')}</span>
          <h1 className="text-[44px] md:text-[56px] lg:text-[72px] font-bold text-white mb-6 leading-[1.05] tracking-tight max-w-4xl mx-auto text-shadow-lg reveal-top">{t('gallery.title')}</h1>
          <p className="text-base md:text-lg text-white/95 max-w-2xl mx-auto leading-relaxed font-medium text-shadow-md reveal-top">
            {t('gallery.subtitle')}
          </p>
        </div>
      </section>

      {/* Masonry Grid Section */}
      <section className="py-20 relative z-10 overflow-hidden">
        <img src="/images/rangoli_bg.webp" className="absolute top-[-100px] left-[-100px] w-[550px] h-auto opacity-[0.35] mix-blend-multiply pointer-events-none object-contain z-0 animate-spin-clockwise" alt="" />
        <img src="/images/tribal_2.webp" className="absolute top-[30%] -translate-y-1/2 right-[-150px] w-[500px] h-[500px] opacity-[0.35] mix-blend-multiply pointer-events-none object-contain z-0 animate-spin-vertical-centered" alt="" />
        <img src="/images/tribal_1.webp" className="absolute bottom-[20%] left-[-150px] w-[500px] h-[500px] opacity-[0.35] mix-blend-multiply pointer-events-none object-contain z-0 animate-spin-clockwise" alt="" />
        <div className="max-w-container mx-auto px-gutter relative z-10">
          <div className="gallery-masonry-grid">
            {allImages.map((img, index) => {
              // Use database specific shape if provided, else fallback to pattern
              const spanClass = (img.gridShape && img.gridShape !== 'default') 
                ? img.gridShape 
                : spanPattern[index % spanPattern.length];
                
              return (
                <div 
                  key={img.id} 
                  className={`gallery-grid-item ${spanClass} relative group overflow-hidden rounded-3xl clay-card`}
                  style={{ animationDelay: `${(index % 10) * 0.1}s` }}
                >
                  <img 
                    src={img.imageUrl} 
                    alt="Gallery Moment" 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    style={img.objectPosition ? { objectPosition: img.objectPosition } : {}}
                  />
                </div>
              );
            })}
          </div>
          {allImages.length === 0 && (
            <div className="text-center py-20 text-on-surface-variant">
              No images found in the gallery.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
