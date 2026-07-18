import React, { useState, useEffect, Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Layout from './components/layout/Layout.jsx'
import Home from './pages/Home.jsx'
import PageSkeleton from './components/layout/PageSkeleton.jsx'

// Lazy loaded routes
const About = lazy(() => import('./pages/About.jsx'))
const Activities = lazy(() => import('./pages/Activities.jsx'))
const Contact = lazy(() => import('./pages/Contact.jsx'))
const Gallery = lazy(() => import('./pages/Gallery.jsx'))
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy.jsx'))
const TermsConditions = lazy(() => import('./pages/TermsConditions.jsx'))
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin.jsx'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard.jsx'))

export default function App() {
  const [showIntro, setShowIntro] = useState(() => {
    // Skip intro on admin portal paths
    return !window.location.pathname.startsWith('/admin');
  });

  const handleIntroComplete = () => {
    setShowIntro(false);
  };

  useEffect(() => {
    if (!showIntro) return;
    const timer = setTimeout(() => {
      handleIntroComplete();
    }, 4000);
    return () => clearTimeout(timer);
  }, [showIntro]);

  return (
    <>
      <AnimatePresence>
        {showIntro && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ 
              opacity: 0, 
              scale: 1.05,
              transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
            }}
            className="fixed inset-0 z-[99999] bg-[#faf8f5] overflow-hidden select-none pointer-events-auto"
          >
            {/* Top Tribal Art Border */}
            <div className="absolute top-0 left-0 right-0 h-20 tribal-border-image-top z-[100000]"></div>

            {/* Bottom Tribal Art Border */}
            <div className="absolute bottom-0 left-0 right-0 h-20 tribal-border-image-bottom z-[100000]"></div>

            {/* Center Grid aligned to Hero Section margins */}
            <div className="w-full h-full flex flex-col justify-center items-center gap-4 md:grid md:grid-cols-2 md:gap-0 items-center">
              {/* Left Column: Branded Typography */}
              <div className="flex flex-col items-center justify-center p-4 z-10 text-center md:text-left md:items-start order-2 md:order-1 w-full md:h-full">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                  className="space-y-3 w-full max-w-[600px] md:ml-auto px-gutter md:pr-12"
                >
                  <h1 className="text-4xl sm:text-5xl font-black text-[#8a3004] tracking-tight font-serif">
                    Kesula
                  </h1>
                  <p className="text-xs sm:text-sm font-extrabold text-[#c5a880] tracking-[0.4em] pl-[0.4em]">
                    Charitable Trust
                  </p>

                  {/* Subtle progress loading line */}
                  <div className="w-36 h-[2px] bg-slate-200/80 rounded-full mt-4 overflow-hidden relative mx-auto md:mx-0">
                    <motion.div 
                      initial={{ left: "-50%" }}
                      animate={{ left: "100%" }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute top-0 bottom-0 w-16 bg-gradient-to-r from-transparent via-[#8a3004] to-transparent"
                    />
                  </div>
                </motion.div>
              </div>

              {/* Right Column: Loading Video */}
              <div className="relative w-full h-[25vh] md:h-full order-1 md:order-2 flex items-center justify-center bg-[#faf8f5]">
                <video
                  ref={(el) => {
                    if (el) el.playbackRate = 2.0;
                  }}
                  src="/videos/loading.webm"
                  autoPlay
                  muted
                  playsInline
                  loop
                  className="w-full h-full object-cover md:object-contain"
                >
                  <source src="/videos/loading.webm" type="video/webm" />
                </video>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Router>
        <Suspense fallback={<PageSkeleton />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Layout />}>
              {/* Home is NOT lazy loaded for LCP performance */}
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="activities" element={<Activities />} />
              <Route path="gallery" element={<Gallery />} />
              <Route path="contact" element={<Contact />} />
              <Route path="privacy-policy" element={<PrivacyPolicy />} />
              <Route path="terms-conditions" element={<TermsConditions />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/*" element={<AdminDashboard />} />
          </Routes>
        </Suspense>
      </Router>
    </>
  )
}
