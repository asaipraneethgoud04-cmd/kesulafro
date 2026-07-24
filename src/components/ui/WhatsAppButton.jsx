import React from 'react';

export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/917901246256"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-[9999] bg-[#25D366] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg shadow-black/20 hover:scale-110 hover:shadow-xl hover:shadow-[#25D366]/40 transition-all duration-300"
      aria-label="Chat on WhatsApp"
    >
      <i className="fa-brands fa-whatsapp text-3xl"></i>
    </a>
  );
}
