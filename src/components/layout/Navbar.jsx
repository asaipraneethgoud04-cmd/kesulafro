import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    if (mobileMenuOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    return () => document.removeEventListener('keydown', handleEscape);
  }, [mobileMenuOpen]);


  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Our Activities', path: '/activities' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact', path: '/contact' },
  ];

  const activeStyle = "font-body-md text-body-md tracking-wider text-primary font-semibold link-underline pb-1";
  const inactiveStyle = "font-body-md text-body-md tracking-wider text-on-surface/70 hover:text-primary transition-colors link-underline pb-1";

  // Silent background request to wake up the Render server
  const wakeUpBackend = () => {
    fetch(`${import.meta.env.VITE_API_URL || ''}/api/ping`).catch(() => { });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-24 md:h-28 w-full px-4 py-2 md:py-3">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-white p-3 rounded-xl z-[100] outline-none ring-2 ring-white">
        Skip to content
      </a>
      <nav className="glass-panel flex justify-between items-center px-6 md:px-8 w-full h-full rounded-2xl relative">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 md:gap-4">
          <div className="w-16 h-16 md:w-20 md:h-20 clay-badge-colored flex items-center justify-center overflow-hidden p-0.5 md:p-1">
            <img src="/images/logo.webp" alt="Kesula Trust Logo" className="w-full h-full object-contain rounded-full mix-blend-multiply" />
          </div>
          <span className="font-headline-md text-headline-md font-bold text-primary text-2xl md:text-3xl tracking-tight">Kesula Trust</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => isActive ? activeStyle : inactiveStyle}
            >
              {link.name}
            </NavLink>
          ))}
        </div>

        {/* Donate Button (Desktop) */}
        <div className="hidden lg:block">
          <Link
            to="/contact#donate"
            onClick={wakeUpBackend}
            className="bg-gradient-to-r from-primary to-amber-600 hover:from-amber-600 hover:to-primary text-white text-xs font-bold uppercase tracking-widest px-5 py-2.5 rounded-xl flex items-center justify-center gap-1.5 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
          >
            <span>Donate Now</span>

          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-expanded={mobileMenuOpen}
          aria-label="Toggle navigation menu"
          className="lg:hidden text-primary focus:outline-none focus:ring-2 focus:ring-primary w-12 h-12 rounded-xl flex items-center justify-center hover:bg-primary/5 transition-all"
        >
          <span className="material-symbols-outlined text-2xl">
            {mobileMenuOpen ? 'close' : 'menu'}
          </span>
        </button>

        {/* Mobile Drawer Menu */}
        {mobileMenuOpen && (
          <div className="absolute top-24 left-0 w-full bg-[#fdfaf8] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] lg:hidden flex flex-col p-6 gap-4 z-50 border border-secondary/20">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block py-2.5 px-4 rounded-xl font-body-md text-body-md tracking-wider transition-all ${isActive ? 'bg-primary/5 text-primary font-semibold' : 'text-on-surface/80 hover:bg-primary/5'}`
                }
              >
                {link.name}
              </NavLink>
            ))}
            <Link
              to="/contact#donate"
              onClick={() => {
                setMobileMenuOpen(false);
                wakeUpBackend();
              }}
              className="bg-gradient-to-r from-primary to-amber-600 hover:from-amber-600 hover:to-primary text-white text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-xl flex items-center justify-center gap-1.5 shadow-md mt-2 w-full"
            >
              <span>Donate Now</span>
              <span className="material-symbols-outlined text-sm leading-none">favorite</span>
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
