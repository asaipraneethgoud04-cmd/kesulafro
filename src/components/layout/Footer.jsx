import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#1a1210] text-white/80 border-t border-white/10 pt-20 pb-10 relative overflow-hidden mt-16 font-thin">
      {/* Background glow blobs */}
      <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full blur-[120px] opacity-20 bg-primary/30 pointer-events-none"></div>
      
      <div className="max-w-container mx-auto px-gutter relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10 md:gap-12 mb-16">
          {/* Org Info */}
          <div className="col-span-2 md:col-span-1">
            <h2 className="text-4xl text-inverse-primary font-extrabold mb-6">Kesula Trust</h2>
            <p className="text-white/70 text-sm mb-8 leading-relaxed">
              Keeping tribal traditions alive while building a better tomorrow — one village at a time.
            </p>
            <div className="flex gap-4">
              <a className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center text-white/70 hover:bg-inverse-primary hover:text-[#1a1210] hover:border-inverse-primary transition-all"
                href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <i className="fa-brands fa-facebook-f text-sm"></i>
              </a>
              <a className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center text-white/70 hover:bg-inverse-primary hover:text-[#1a1210] hover:border-inverse-primary transition-all"
                href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <i className="fa-brands fa-instagram text-sm"></i>
              </a>
              <a className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center text-white/70 hover:bg-inverse-primary hover:text-[#1a1210] hover:border-inverse-primary transition-all"
                href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                <i className="fa-brands fa-youtube text-sm"></i>
              </a>
              <a className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center text-white/70 hover:bg-inverse-primary hover:text-[#1a1210] hover:border-inverse-primary transition-all"
                href="mailto:kesulatrust@gmail.com" aria-label="Mail">
                <i className="fa-regular fa-envelope text-sm"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm uppercase text-inverse-primary font-extrabold mb-6 tracking-widest">Quick Links</h4>
            <ul className="space-y-4 text-sm">
              <li><Link className="text-white font-bold hover:text-inverse-primary hover:underline transition-colors" to="/">Home</Link></li>
              <li><Link className="text-white/70 hover:text-inverse-primary hover:underline transition-colors" to="/about">About Us</Link></li>
              <li><Link className="text-white/70 hover:text-inverse-primary hover:underline transition-colors" to="/activities">Our Activities</Link></li>
              <li><Link className="text-white/70 hover:text-inverse-primary hover:underline transition-colors" to="/contact">Contact Us</Link></li>
              <li><Link className="text-white/70 hover:text-inverse-primary hover:underline transition-colors" to="/#achievements">Achievements</Link></li>
              <li><Link className="text-white/70 hover:text-inverse-primary hover:underline transition-colors" to="/contact#volunteer">Become a Member</Link></li>
            </ul>
          </div>

          {/* Registration Info */}
          <div>
            <h4 className="text-sm uppercase text-inverse-primary font-extrabold mb-6 tracking-widest">NGO Profile</h4>
            <ul className="space-y-2 text-white/70 text-sm">
              <li><strong>Registration:</strong> Indian Trusts Act, 1882</li>
              <li><strong>PAN:</strong> AAFTK6925K</li>
              <li><strong>12A Reg:</strong> AAFTK6925KE20241</li>
              <li><strong>80G Reg:</strong> AAFTK6925KF20241</li>
              <li className="pt-2 text-xs opacity-75 leading-relaxed">Donations are 50% Tax Exempt under Section 80G.</li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="col-span-2 md:col-span-1">
            <h4 className="text-sm uppercase text-inverse-primary font-extrabold mb-6 tracking-widest">Contact Us</h4>
            <p className="text-white/70 text-sm mb-4 leading-relaxed">
              Plot No. 290, Jayakalani Nagar, Near Peddamma Thalli Temple, Chengicherla, Boduppal Municipal Corporation, Medchal–Malkajgiri District, Telangana – India
            </p>
            <p className="text-white/70 text-sm mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm text-inverse-primary">call</span> +91 79012 46256
            </p>
            <p className="text-white/70 text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-sm text-inverse-primary">mail</span> kesulatrust@gmail.com
            </p>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <div className="flex flex-col gap-1 items-center md:items-start">
            <p className="text-white/50 text-[11px] md:text-sm">© 2024 KESULA CHARITABLE TRUST. Standing with our people.</p>
            <p className="text-white/40 text-[10px] md:text-xs">
              Developed by <a href="https://techyarts.com" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-inverse-primary hover:underline transition-colors font-medium">Techyarts.com</a>
            </p>
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-2 md:gap-6 justify-center">
            <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" className="text-[10px] md:text-xs text-white/40 hover:text-inverse-primary uppercase tracking-wider md:tracking-widest transition-colors">Sitemap</a>
            <Link className="text-[10px] md:text-xs text-white/40 hover:text-inverse-primary uppercase tracking-wider md:tracking-widest transition-colors" to="/privacy-policy">Privacy Policy</Link>
            <Link className="text-[10px] md:text-xs text-white/40 hover:text-inverse-primary uppercase tracking-wider md:tracking-widest transition-colors" to="/terms-conditions">Terms &amp; Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
