import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AutoScrollGallery = ({ items }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  // Close lightbox on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedImage(null);
    };
    if (selectedImage) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage]);

  // We only need the original items, we will render two identical blocks to loop
  
  // Helper function to render a scrolling column
  const ScrollColumn = ({ speed, direction, items }) => {
    const isUp = direction === 'up';
    const animationClass = isUp ? 'animate-scroll-up' : 'animate-scroll-down';
    
    return (
      <div className="relative h-[800px] overflow-hidden group rounded-[28px] isolate flex flex-col">
        {/* The scrolling container. Pauses only this column on hover */}
        <div 
          className={`flex flex-col w-full ${animationClass} group-hover:[animation-play-state:paused]`} 
          style={{ animationDuration: speed }}
        >
          {/* Block 1 */}
          <div className="flex flex-col gap-6 w-full pb-6">
            {items.map((item, index) => (
              <GalleryCard 
                key={`b1-${index}-${item.image}`} 
                item={item} 
                onClick={() => setSelectedImage(item.image)} 
              />
            ))}
          </div>
          {/* Block 2 (Exact Duplicate) */}
          <div className="flex flex-col gap-6 w-full pb-6">
            {items.map((item, index) => (
              <GalleryCard 
                key={`b2-${index}-${item.image}`} 
                item={item} 
                onClick={() => setSelectedImage(item.image)} 
              />
            ))}
          </div>
        </div>
      </div>
    );
  };

  const GalleryCard = ({ item, onClick }) => {
    return (
      <div 
        className="relative w-full aspect-[4/5] rounded-[28px] overflow-hidden shadow-md border-[4px] border-white cursor-pointer group/card transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)] flex-shrink-0 bg-white"
        onClick={onClick}
      >
        {/* Main Image */}
        <img 
          src={item.image} 
          loading="lazy" 
          className="w-full h-full object-cover transition-transform duration-[800ms] ease-out group-hover/card:scale-105" 
          style={item.objectPosition ? { objectPosition: item.objectPosition } : {}}
          alt="Gallery Memory" 
        />
        
        {/* Gradient Overlay & Text (Fades in from bottom) */}
        <div className="absolute inset-0 bg-gradient-to-t from-orange-900/90 via-amber-800/20 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6 z-30">
          <div className="transform translate-y-8 group-hover/card:translate-y-0 transition-transform duration-500 ease-out">
            <span className="text-white/80 font-bold text-[10px] uppercase tracking-widest mb-1 block">Kesula Trust</span>
            <span className="text-white font-headline-md font-extrabold text-xl leading-tight text-shadow-md">Moment of<br/>Impact</span>
          </div>
        </div>
      </div>
    );
  };
  // Helper to offset arrays so columns don't look identical side-by-side
  const getOffsetItems = (offset) => {
    if (!items || items.length === 0) return items;
    const splitIndex = offset % items.length;
    return [...items.slice(splitIndex), ...items.slice(0, splitIndex)];
  };

  const col1Items = items;
  const col2Items = getOffsetItems(Math.floor(items.length / 3));
  const col3Items = getOffsetItems(Math.floor((items.length * 2) / 3));

  return (
    <>
      {/* Desktop/Tablet: 3/2 Columns */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-[1200px] mx-auto py-12 px-8 h-[800px] overflow-hidden relative">
        {/* Gradient overlays to mask top and bottom edges smoothly */}
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-surface-container/30 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-surface-container/30 to-transparent z-10 pointer-events-none"></div>

         {/* Column 1 (Scrolls Up, loop baseline 80s) */}
        <ScrollColumn speed="80s" direction="up" items={col1Items} />
        
        {/* Column 2 (Scrolls Down, offset to 96s) - Hidden on tablet, shown on lg */}
        <div className="hidden lg:block">
           <ScrollColumn speed="96s" direction="down" items={col2Items} />
        </div>

        {/* Column 3 (Scrolls Up, offset to 88s) */}
        <ScrollColumn speed="88s" direction="up" items={col3Items} />
      </div>

      {/* Mobile: Horizontal Auto Scroll (Marquee) */}
      <div className="md:hidden relative w-full pb-8 flex overflow-hidden group">
        {/* Gradient overlays to mask left and right edges smoothly */}
        <div className="absolute top-0 left-0 w-12 h-full bg-gradient-to-r from-[#fff8f6] to-transparent z-10 pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-12 h-full bg-gradient-to-l from-[#fff8f6] to-transparent z-10 pointer-events-none"></div>

        <div 
          className="flex w-max animate-scroll-left group-hover:[animation-play-state:paused]"
          style={{ animationDuration: '80s' }}
        >
          {/* Block 1 */}
          <div className="flex gap-4 pr-4">
            {items.map((item, index) => (
              <div 
                key={`m1-${index}`} 
                className="flex-none w-[260px] rounded-[24px] overflow-hidden shadow-md border-[4px] border-white aspect-[4/5] relative cursor-pointer group/mobile transition-all duration-300 hover:shadow-xl"
                onClick={() => setSelectedImage(item.image)}
              >
                <img src={item.image} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover/mobile:scale-105" alt="Gallery Memory" />
                <div className="absolute inset-0 bg-gradient-to-t from-orange-900/90 via-amber-800/20 to-transparent opacity-0 group-hover/mobile:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                  <span className="text-white/80 font-bold text-[10px] uppercase tracking-widest block">Kesula Trust</span>
                  <span className="text-white font-headline-md font-bold text-lg">Moment of Impact</span>
                </div>
              </div>
            ))}
          </div>
          {/* Block 2 (Exact Duplicate) */}
          <div className="flex gap-4 pr-4">
            {items.map((item, index) => (
              <div 
                key={`m2-${index}`} 
                className="flex-none w-[260px] rounded-[24px] overflow-hidden shadow-md border-[4px] border-white aspect-[4/5] relative cursor-pointer group/mobile transition-all duration-300 hover:shadow-xl"
                onClick={() => setSelectedImage(item.image)}
              >
                <img src={item.image} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover/mobile:scale-105" alt="Gallery Memory" />
                <div className="absolute inset-0 bg-gradient-to-t from-orange-900/90 via-amber-800/20 to-transparent opacity-0 group-hover/mobile:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                  <span className="text-white/80 font-bold text-[10px] uppercase tracking-widest block">Kesula Trust</span>
                  <span className="text-white font-headline-md font-bold text-lg">Moment of Impact</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox (Framer Motion) */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 backdrop-blur-xl bg-black/60"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-5xl max-h-[90vh] w-full bg-white rounded-3xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-colors border border-white/20"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
              <img 
                src={selectedImage} 
                className="w-full h-auto max-h-[90vh] object-contain bg-black/5 mx-auto"
                alt="Enlarged Memory"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AutoScrollGallery;
