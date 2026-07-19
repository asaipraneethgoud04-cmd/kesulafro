import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  const setCookie = (name, value, days) => {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/`;
  };

  useEffect(() => {
    const consent = getCookie('kesula_cookie_consent');
    if (!consent) {
      setShow(true);
    }
  }, []);

  const handleAccept = () => {
    setCookie('kesula_cookie_consent', 'accepted', 365);
    setShow(false);
  };

  const handleDecline = () => {
    setCookie('kesula_cookie_consent', 'declined', 365);
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 animate-slide-up">
      <div className="max-w-4xl mx-auto glass-panel p-6 rounded-2xl border border-white/40 shadow-2xl flex flex-col sm:flex-row items-center gap-6 justify-between relative overflow-hidden bg-white/90">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
        <div className="flex-1">
          <h4 className="font-headline-md text-lg font-bold text-on-surface mb-2">We value your privacy</h4>
          <p className="text-sm text-on-surface-variant font-light leading-relaxed">
            We use cookies to improve your experience on our site and analyze traffic. By clicking "Accept", you consent to our use of cookies.
            Read our <Link to="/privacy-policy" className="text-primary hover:underline font-bold">Privacy Policy</Link> for more details.
          </p>
        </div>
        <div className="flex gap-3 flex-shrink-0 w-full sm:w-auto">
          <button 
            onClick={handleDecline}
            className="flex-1 sm:flex-none clay-btn clay-btn-secondary px-6 py-2.5 text-xs font-bold uppercase tracking-wider"
          >
            Decline
          </button>
          <button 
            onClick={handleAccept}
            className="flex-1 sm:flex-none clay-btn clay-btn-primary px-6 py-2.5 text-xs font-bold uppercase tracking-wider"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
