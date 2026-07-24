import React, { useState, useEffect } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { supabase } from '../lib/supabase';
import { categoryService } from '../services/categoryService';
import { useLanguage } from '../context/LanguageContext';
import MembershipCardModal from '../components/ui/MembershipCardModal';

export default function Contact() {
  const { t } = useLanguage();
  useScrollReveal();

  // Contact Form State
  const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', subject: 'general', message: '' });
  const [contactSuccess, setContactSuccess] = useState(false);
  const [contactError, setContactError] = useState('');
  const [contactHoneypot, setContactHoneypot] = useState('');
  const [lastContactSubmit, setLastContactSubmit] = useState(0);
  const [isContactSubmitting, setIsContactSubmitting] = useState(false);

  // Membership Form State
  const [memberForm, setMemberForm] = useState({ fullName: '', email: '', phone: '', address: '', interestArea: '', message: '', photoUrl: '' });
  const [memberSuccess, setMemberSuccess] = useState(false);
  const [memberError, setMemberError] = useState('');
  const [memberHoneypot, setMemberHoneypot] = useState('');
  const [lastMemberSubmit, setLastMemberSubmit] = useState(0);
  const [isMemberSubmitting, setIsMemberSubmitting] = useState(false);
  const [submittedMemberData, setSubmittedMemberData] = useState(null);
  const [showIdCardModal, setShowIdCardModal] = useState(false);
  const [isCompressingPhoto, setIsCompressingPhoto] = useState(false);
  const [photoCompressionStats, setPhotoCompressionStats] = useState(null);

  const handleMemberPhotoUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    setIsCompressingPhoto(true);
    const origSizeKB = (file.size / 1024).toFixed(1);
    const origSizeText = file.size > 1024 * 1024 ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` : `${origSizeKB} KB`;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxSize = 300;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxSize) {
            height = Math.round((height * maxSize) / width);
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = Math.round((width * maxSize) / height);
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.82);

        const compressedBytes = Math.round((dataUrl.length * 3) / 4);
        const compressedSizeText = `${(compressedBytes / 1024).toFixed(1)} KB`;

        setMemberForm(prev => ({ ...prev, photoUrl: dataUrl }));
        setPhotoCompressionStats({ original: origSizeText, compressed: compressedSizeText });
        setIsCompressingPhoto(false);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Donation Section State
  const [donationAmount, setDonationAmount] = useState('1000');
  const [customAmount, setCustomAmount] = useState('');
  const [showManualPayment, setShowManualPayment] = useState(false);
  const [donationForm, setDonationForm] = useState({ name: '', email: '' });
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);
  const [paymentSuccessMessage, setPaymentSuccessMessage] = useState('');

  const [interestCategories, setInterestCategories] = useState([]);

  useEffect(() => {
    categoryService.getCategories().then(data => {
      setInterestCategories(data.map(c => c.name));
    }).catch(err => {
      console.error('Error fetching categories in Contact page:', err);
    });
  }, []);

  // Handlers
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactError('');

    if (contactHoneypot) {
      setContactError('Submission failed.');
      return;
    }

    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      setContactError('Please fill out all required fields (Name, Email, and Message).');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactForm.email)) {
      setContactError('Please enter a valid email address.');
      return;
    }

    const phoneRegex = /^\d{10}$/;
    if (contactForm.phone && !phoneRegex.test(contactForm.phone)) {
      setContactError('Please enter a valid 10-digit phone number.');
      return;
    }

    setIsContactSubmitting(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/submit-contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm)
      });
      
      const data = await res.json();
      if (res.ok && data.success) {
        setContactSuccess(true);
        setContactForm({ name: '', email: '', phone: '', subject: 'general', message: '' });
        setLastContactSubmit(now);
      } else {
        setContactError(data.error || 'Submission failed.');
      }
    } catch (err) {
      setContactError('Network error. Please try again.');
    } finally {
      setIsContactSubmitting(false);
    }
  };

  const handleMemberSubmit = async (e) => {
    e.preventDefault();
    setMemberError('');

    if (memberHoneypot) {
      setMemberError('Submission failed.');
      return;
    }

    if (!memberForm.fullName || !memberForm.email || !memberForm.phone) {
      setMemberError('Please fill out all required fields (Full Name, Email, and Phone).');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(memberForm.email)) {
      setMemberError('Please enter a valid email address.');
      return;
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(memberForm.phone)) {
      setMemberError('Please enter a valid 10-digit phone number.');
      return;
    }

    setIsMemberSubmitting(true);
    try {
      const cleanEmail = memberForm.email.toLowerCase().trim();
      const cleanPhone = memberForm.phone.trim();

      // 1. Check for existing email in database
      const { data: existingEmail } = await supabase
        .from('members')
        .select('id')
        .eq('email', cleanEmail)
        .limit(1);

      if (existingEmail && existingEmail.length > 0) {
        setMemberError('A membership application has already been submitted with this email address.');
        setIsMemberSubmitting(false);
        return;
      }

      // 2. Check for existing phone number in database
      const { data: existingPhone } = await supabase
        .from('members')
        .select('id')
        .eq('phone', cleanPhone)
        .limit(1);

      if (existingPhone && existingPhone.length > 0) {
        setMemberError('A membership application has already been submitted with this phone number.');
        setIsMemberSubmitting(false);
        return;
      }

      const payload = { ...memberForm, email: cleanEmail, phone: cleanPhone, photo_url: memberForm.photoUrl };
      let { data: insertedData, error } = await supabase.from('members').insert([payload]).select();

      // Fallback if photoUrl column does not exist yet in Supabase members schema cache
      if (error && (error.message.includes('photoUrl') || error.message.includes('photo_url') || error.message.includes('schema cache'))) {
        console.warn('DB missing photoUrl/photo_url column, retrying insert without photoUrl field:', error.message);
        const { photoUrl, photo_url, ...strippedForm } = payload;
        const retryResult = await supabase.from('members').insert([strippedForm]).select();
        insertedData = retryResult.data;
        error = retryResult.error;
      }

      if (!error) {
        // Trigger welcome email
        try {
          await fetch(`${import.meta.env.VITE_API_URL || ''}/api/send-welcome-email`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: cleanEmail, name: memberForm.fullName, details: memberForm })
          });
        } catch (emailErr) {
          console.error("Failed to send welcome email:", emailErr);
        }

        setMemberSuccess(true);
        setMemberForm({ fullName: '', email: '', phone: '', address: '', interestArea: '', message: '', photoUrl: '' });
        setLastMemberSubmit(now);
      } else {
        setMemberError(error.message || 'Submission failed.');
      }
    } catch (err) {
      setMemberError('Network error. Please try again.');
    } finally {
      setIsMemberSubmitting(false);
    }
  };

  const handleDonateNow = async (e) => {
    e.preventDefault();
    const amountToDonate = customAmount || donationAmount;

    if (!amountToDonate || isNaN(amountToDonate) || Number(amountToDonate) <= 0) {
      alert("Please enter a valid donation amount.");
      return;
    }

    if (!donationForm.name || !donationForm.email) {
      alert("Please enter your name and email so we can send you a receipt.");
      return;
    }

    try {
      // 1. Create order on backend
      const orderResponse = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: Number(amountToDonate) })
      });

      const orderData = await orderResponse.json();

      if (orderData.error) {
        console.error(orderData.error);
        alert("Could not initialize payment. Please try again later.");
        return;
      }

      // 2. Initialize Razorpay
      const options = {
        key: orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Kesula Charitable Trust",
        description: "Donation",
        order_id: orderData.id,
        handler: async function (response) {
          // 3. Verify payment on backend
          setIsVerifyingPayment(true);
          try {
            const verifyResponse = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/verify-payment`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                amount: Number(amountToDonate),
                email: donationForm.email,
                name: donationForm.name
              })
            });

            const verifyData = await verifyResponse.json();
            setIsVerifyingPayment(false);
            if (verifyData.success) {
              setPaymentSuccessMessage("Payment successful! Thank you for your donation. A confirmation email has been sent.");
              setDonationForm({ name: '', email: '' }); // reset form
            } else {
              alert("Payment verification failed.");
            }
          } catch (err) {
            console.error(err);
            setIsVerifyingPayment(false);
            alert("Payment verification failed due to network error.");
          }
        },
        prefill: {
          name: donationForm.name,
          email: donationForm.email
        },
        theme: {
          color: "#D97706" // Primary color
        },
        modal: {
          ondismiss: function () {
            setIsVerifyingPayment(false);
            // Optionally check if we should show a message
            alert("Payment window closed. If your payment was deducted, please wait for the confirmation email.");
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        alert("Payment failed. " + response.error.description);
      });
      rzp.open();

    } catch (error) {
      console.error("Error initiating payment:", error);
      // Fallback to manual payment
      setShowManualPayment(true);
    }
  };

  return (
    <div className="relative overflow-hidden bg-background text-on-surface min-h-screen">
      {/* Background fixed image and glow blobs */}
      <div className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-[0.02] pointer-events-none mix-blend-multiply" style={{ backgroundImage: "url('/images/artisan_bg.webp')" }}></div>
      <div className="absolute top-[5%] left-[-10%] w-[45vw] h-[45vw] rounded-full blur-[130px] opacity-10 bg-primary pointer-events-none z-0"></div>
      <div className="absolute bottom-[30%] right-[-10%] w-[50vw] h-[50vw] rounded-full blur-[140px] opacity-[0.06] bg-secondary pointer-events-none z-0"></div>
      <div className="absolute bottom-[5%] left-[-10%] w-[45vw] h-[45vw] rounded-full blur-[130px] opacity-[0.05] bg-primary pointer-events-none z-0"></div>

      {/* Hero Header */}
      <section className="relative min-h-[500px] md:min-h-[600px] lg:min-h-[800px] flex items-center justify-center pt-32 pb-20 md:pt-48 md:pb-24 overflow-hidden z-10 reveal bg-cover bg-center bg-fixed" style={{ backgroundImage: "url('/images/contact2.webp')" }}>
        <div className="absolute inset-0 bg-black/60 z-0 pointer-events-none"></div>
        <div className="relative z-10 text-center text-white px-gutter max-w-2xl mx-auto w-full">
          <span className="text-white font-extrabold text-xs uppercase tracking-[0.25em] block mb-3 text-shadow-md">{t('nav.contact')}</span>
          <h1 className="font-display-lg text-4xl sm:text-5xl md:text-headline-lg font-extrabold tracking-tight text-white text-shadow-lg mb-4">{t('contact.title')}</h1>
          <p className="font-body-lg text-white/95 font-medium text-shadow-md">{t('contact.subtitle')}</p>
        </div>
      </section>

      {/* Main Grid: Details + Contact Form */}
      <section className="py-12 md:py-20 max-w-container mx-auto px-4 md:px-gutter relative z-10 reveal overflow-hidden">
        <img src="/images/tribal_3.webp" className="absolute top-[30%] -translate-y-1/2 right-[-150px] w-[550px] h-[550px] opacity-[0.35] mix-blend-multiply pointer-events-none object-contain z-0 animate-spin-vertical-centered" alt="" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start relative z-10">

          {/* Details column — Premium Card */}
          <div className="lg:col-span-5 space-y-0">
            {/* Address Card */}
            <div className="bg-white rounded-t-[24px] md:rounded-t-[32px] p-6 md:p-8 pb-7 border border-slate-100 shadow-[0_4px_40px_rgba(138,48,4,0.06)]">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#8a3004] to-[#c5621a] flex items-center justify-center shadow-md">
                  <span className="material-symbols-outlined text-white text-xl">location_on</span>
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">{t('contactPage.officeAddress')}</h2>
              </div>
              <p className="text-slate-600 leading-relaxed text-[15px]">
                {t('contact.address')}
              </p>
            </div>
            
            {/* Contact Info Card */}
            <div className="bg-[#faf8f5] px-6 md:px-8 py-7 border-x border-slate-100 space-y-5">
              {[
                { icon: 'call', label: 'Mobile', value: '+91 79012 46256' },
                { icon: 'mail', label: 'Email', value: 'kesulatrust@gmail.com' },
                { icon: 'public', label: 'Web', value: 'www.kesulatrust.org' }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 group cursor-default">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm group-hover:border-[#8a3004]/30 group-hover:shadow-md transition-all duration-300">
                    <span className="material-symbols-outlined text-[#8a3004] text-lg">{item.icon}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400 block">{item.label}</span>
                    <span className="text-slate-800 font-medium text-[15px]">{item.value}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Registration Card */}
            <div className="bg-white rounded-b-[24px] md:rounded-b-[32px] px-6 md:px-8 py-7 border border-slate-100 shadow-[0_4px_40px_rgba(138,48,4,0.06)]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#8a3004] to-[#c5621a] flex items-center justify-center shadow-md">
                  <span className="material-symbols-outlined text-white text-xl">verified</span>
                </div>
                <h3 className="text-lg font-extrabold text-slate-900 uppercase tracking-wider">Registration</h3>
              </div>
              <div className="space-y-2.5">
                {[
                  { k: 'Status', v: 'Indian Trusts Act, 1882' },
                  { k: '12A Reg', v: 'AAFTK6925KE20241' },
                  { k: '80G Reg', v: 'AAFTK6925KF20241' },
                  { k: 'PAN', v: 'AAFTK6925K' }
                ].map((r, i) => (
                  <div key={i} className="flex justify-between items-center py-2 border-b border-dashed border-slate-100 last:border-0">
                    <span className="text-slate-500 text-sm font-medium">{r.k}</span>
                    <span className="text-slate-800 text-sm font-bold font-mono tracking-wide">{r.v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form Column — Premium Elevated Card */}
          <div className="lg:col-span-7 bg-white rounded-[24px] md:rounded-[32px] p-6 md:p-10 border border-slate-100 shadow-[0_8px_60px_rgba(138,48,4,0.08)] relative overflow-hidden">
            {/* Decorative corner glow */}
            <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-[#8a3004]/5 blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-amber-500/5 blur-3xl pointer-events-none"></div>
            
            <div className="flex items-center gap-3 mb-8 relative z-10">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#8a3004] to-[#c5621a] flex items-center justify-center shadow-md">
                <span className="material-symbols-outlined text-white text-xl">edit_note</span>
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">{t('contactPage.sendEnquiry')}</h2>
                <p className="text-xs text-slate-400 font-medium">{t('contactPage.respondTime')}</p>
              </div>
            </div>
            
            {contactSuccess ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-10 rounded-2xl text-center relative z-10">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-4xl text-emerald-600">check_circle</span>
                </div>
                <h4 className="font-bold text-2xl mb-2 text-emerald-900">We Got Your Message!</h4>
                <p className="text-emerald-700 font-light">Thanks for writing to us. Someone from our team will get back to you soon.</p>
                <button onClick={() => setContactSuccess(false)} className="mt-6 text-sm font-bold text-emerald-700 hover:text-emerald-900 underline underline-offset-4 transition-colors">Send another message</button>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-6 relative z-10">
                {/* Honeypot */}
                <div style={{ display: 'none' }} aria-hidden="true">
                  <label htmlFor="contact-website">Website</label>
                  <input type="text" id="contact-website" name="website" value={contactHoneypot} onChange={e => setContactHoneypot(e.target.value)} tabIndex="-1" autoComplete="off" />
                </div>
                {contactError && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-2"><span className="material-symbols-outlined text-lg">error</span>{contactError}</div>}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="contact-name" className="text-sm font-bold text-slate-700 flex items-center gap-1.5"><span className="material-symbols-outlined text-[15px] text-[#8a3004]">person</span>{t('contactPage.yourName')} <span className="text-red-400">*</span></label>
                    <input id="contact-name" type="text" autoComplete="name" aria-required="true" value={contactForm.name} onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-base text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#8a3004] focus:ring-2 focus:ring-2 focus:ring-[#8a3004] focus:ring-offset-1 focus:outline-none transition-all duration-200" placeholder={t('contactPage.namePlaceholder')} required />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="contact-email" className="text-sm font-bold text-slate-700 flex items-center gap-1.5"><span className="material-symbols-outlined text-[15px] text-[#8a3004]">mail</span>{t('contactPage.email')} <span className="text-red-400">*</span></label>
                    <input id="contact-email" type="email" autoComplete="email" aria-required="true" value={contactForm.email} onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-base text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#8a3004] focus:ring-2 focus:ring-2 focus:ring-[#8a3004] focus:ring-offset-1 focus:outline-none transition-all duration-200" placeholder={t('contactPage.emailPlaceholder')} required />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="contact-phone" className="text-sm font-bold text-slate-700 flex items-center gap-1.5"><span className="material-symbols-outlined text-[15px] text-[#8a3004]">call</span>{t('contactPage.phone')}</label>
                    <input id="contact-phone" type="tel" autoComplete="tel" value={contactForm.phone} onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-base text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#8a3004] focus:ring-2 focus:ring-2 focus:ring-[#8a3004] focus:ring-offset-1 focus:outline-none transition-all duration-200" placeholder="+91 XXXXX XXXXX" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="contact-subject" className="text-sm font-bold text-slate-700 flex items-center gap-1.5"><span className="material-symbols-outlined text-[15px] text-[#8a3004]">category</span>{t('contactPage.enquiryType')} <span className="text-red-400">*</span></label>
                    <select id="contact-subject" aria-required="true" value={contactForm.subject} onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-base text-slate-900 focus:bg-white focus:border-[#8a3004] focus:ring-2 focus:ring-2 focus:ring-[#8a3004] focus:ring-offset-1 focus:outline-none transition-all duration-200 appearance-none cursor-pointer">
                      <option value="general">{t('contactPage.generalEnquiry')}</option>
                      <option value="donate">{t('contactPage.donationEnquiry')}</option>
                      <option value="volunteer">{t('contactPage.volunteerEnquiry')}</option>
                      <option value="other">{t('contactPage.other')}</option>
                    </select>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="contact-message" className="text-sm font-bold text-slate-700 flex items-center gap-1.5"><span className="material-symbols-outlined text-[15px] text-[#8a3004]">chat</span>{t('contactPage.message')} <span className="text-red-400">*</span></label>
                  <textarea id="contact-message" aria-required="true" value={contactForm.message} onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })} rows="4" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-base text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#8a3004] focus:ring-2 focus:ring-2 focus:ring-[#8a3004] focus:ring-offset-1 focus:outline-none transition-all duration-200 resize-none" placeholder={t('contactPage.messagePlaceholder')} required></textarea>
                </div>
                <button type="submit" disabled={isContactSubmitting} className="w-full bg-gradient-to-r from-[#8a3004] to-[#b5470a] hover:from-[#a03c08] hover:to-[#c55010] text-white font-bold text-sm uppercase tracking-[0.15em] px-8 py-4.5 rounded-2xl flex justify-center items-center gap-2.5 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#8a3004]/20 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none">
                  {isContactSubmitting ? (<><span className="material-symbols-outlined animate-spin text-lg">autorenew</span>{t('contactPage.submitting')}</>) : (<><span className="material-symbols-outlined text-lg">send</span>{t('contactPage.submitBtn')}</>)}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* 2. Donate Section (#donate) */}
      <section id="donate" className="py-16 relative z-10 reveal overflow-hidden">
        <img src="/images/tribal_2.webp" className="absolute top-1/2 -translate-y-1/2 left-[-150px] w-[550px] h-[550px] opacity-[0.35] mix-blend-multiply pointer-events-none object-contain z-0 animate-spin-vertical-centered" alt="" />
        <div className="max-w-4xl mx-auto px-gutter text-center relative z-10">
          <span className="text-primary font-bold text-xs uppercase tracking-[0.2em] block mb-2">{t('contactPage.supportWork')}</span>
          <h2 className="font-headline-lg text-headline-lg">{t('contactPage.helpKeepGoing')}</h2>
          <p className="font-body-md text-on-surface-variant max-w-2xl mx-auto mt-4 mb-10 leading-relaxed text-sm font-light">
            {t('contactPage.donationDesc')}
          </p>

          <div className="bg-white rounded-[32px] p-8 md:p-10 max-w-2xl mx-auto text-left border border-slate-100 shadow-[0_8px_60px_rgba(138,48,4,0.08)] relative overflow-hidden">
            {/* Decorative glow */}
            <div className="absolute -top-16 -right-16 w-36 h-36 rounded-full bg-amber-400/10 blur-3xl pointer-events-none"></div>
            
            <div className="flex items-center gap-3 mb-8 relative z-10">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#8a3004] to-[#c5621a] flex items-center justify-center shadow-md">
                <span className="material-symbols-outlined text-white text-xl">favorite</span>
              </div>
              <div>
                <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">{t('contactPage.donationDetails')}</h3>
                <p className="text-xs text-slate-400 font-medium">100% goes to community projects</p>
              </div>
            </div>

            {paymentSuccessMessage ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-10 rounded-2xl text-center flex flex-col items-center relative z-10">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-4xl text-emerald-600">check_circle</span>
                </div>
                <h4 className="font-bold text-2xl mb-2 text-emerald-900">Thank You!</h4>
                <p className="text-emerald-700">{paymentSuccessMessage}</p>
                <button onClick={() => setPaymentSuccessMessage('')} className="mt-6 px-6 py-2.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors text-sm">Make Another Donation</button>
              </div>
            ) : (
              <div className="relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-7">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="donor-name" className="text-sm font-bold text-slate-700 flex items-center gap-1.5"><span className="material-symbols-outlined text-[15px] text-[#8a3004]">person</span>{t('contactPage.yourName')} <span className="text-red-400">*</span></label>
                    <input id="donor-name" type="text" autoComplete="name" aria-required="true" value={donationForm.name} onChange={(e) => setDonationForm({ ...donationForm, name: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-[15px] text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#8a3004] focus:ring-2 focus:ring-2 focus:ring-[#8a3004] focus:ring-offset-1 focus:outline-none transition-all duration-200" placeholder={t('contactPage.namePlaceholder')} required disabled={isVerifyingPayment} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="donor-email" className="text-sm font-bold text-slate-700 flex items-center gap-1.5"><span className="material-symbols-outlined text-[15px] text-[#8a3004]">mail</span>{t('contactPage.email')} <span className="text-red-400">*</span></label>
                    <input id="donor-email" type="email" autoComplete="email" aria-required="true" value={donationForm.email} onChange={(e) => setDonationForm({ ...donationForm, email: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-[15px] text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#8a3004] focus:ring-2 focus:ring-2 focus:ring-[#8a3004] focus:ring-offset-1 focus:outline-none transition-all duration-200" placeholder={t('contactPage.emailPlaceholder')} required disabled={isVerifyingPayment} />
                  </div>
                </div>

                <div className="mb-7">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-1.5 mb-3"><span className="material-symbols-outlined text-[15px] text-[#8a3004]">payments</span>{t('contactPage.selectAmount')}</label>
                  <div className="grid grid-cols-4 gap-3">
                    {['500', '1000', '2500', '5000'].map((amt) => (
                      <button key={amt} onClick={() => { setDonationAmount(amt); setCustomAmount(''); }} disabled={isVerifyingPayment} className={`py-3.5 rounded-xl font-bold text-base transition-all duration-200 focus:outline-none border-2 ${donationAmount === amt && !customAmount ? 'bg-[#8a3004] text-white border-[#8a3004] shadow-lg shadow-[#8a3004]/20 scale-[1.03]' : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-[#8a3004]/40 hover:bg-white'} disabled:opacity-50`}>₹{amt}</button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2 mb-7">
                  <label htmlFor="custom-amount" className="text-sm font-bold text-slate-700 flex items-center gap-1.5"><span className="material-symbols-outlined text-[15px] text-[#8a3004]">edit</span>{t('contactPage.customAmount')}</label>
                  <input id="custom-amount" type="number" value={customAmount} onChange={(e) => { setCustomAmount(e.target.value); setDonationAmount(''); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-[15px] text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#8a3004] focus:ring-2 focus:ring-2 focus:ring-[#8a3004] focus:ring-offset-1 focus:outline-none transition-all duration-200" placeholder="Enter amount" disabled={isVerifyingPayment} />
                </div>

                <button onClick={handleDonateNow} disabled={isVerifyingPayment} className="w-full bg-gradient-to-r from-[#8a3004] to-[#b5470a] hover:from-[#a03c08] hover:to-[#c55010] text-white font-bold text-sm uppercase tracking-[0.15em] px-8 py-4.5 rounded-2xl flex justify-center items-center gap-2.5 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#8a3004]/20 disabled:opacity-60 disabled:cursor-not-allowed h-14">
                  {isVerifyingPayment ? (<span className="material-symbols-outlined animate-spin text-2xl">autorenew</span>) : (<><span className="material-symbols-outlined text-lg">favorite</span>{`${t('contactPage.donateNow')} (₹${customAmount || donationAmount})`}</>)}
                </button>
              </div>
            )}

            {/* UPI & Bank Manual Details Panel */}
            {showManualPayment && (
              <div className="mt-8 glass-panel p-6 rounded-2xl border border-white/50 space-y-4">
                <div className="flex justify-between items-center border-b border-secondary/15 pb-2">
                  <h4 className="font-bold text-xl text-primary flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-lg">payments</span> Manual Payment Details
                  </h4>
                  <button onClick={() => setShowManualPayment(false)} className="text-lg text-on-surface-variant hover:text-on-surface font-semibold">Close</button>
                </div>

                <p className="text-lg text-on-surface-variant leading-relaxed font-light">
                  Thanks for wanting to donate! Our online payment gateway is being set up, so for now, please transfer directly using the details below. We really appreciate it.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-lg">
                  <div className="clay-card p-5 border border-secondary/5 space-y-1.5">
                    <h5 className="font-bold text-secondary uppercase tracking-wider mb-1.5 text-sm">Bank Transfer (NEFT/IMPS)</h5>
                    <p><strong>Beneficiary:</strong> KESULA CHARITABLE TRUST</p>
                    <p><strong>Bank:</strong> State Bank of India (SBI)</p>
                    <p><strong>A/C No:</strong> 42091246256 (Placeholder)</p>
                    <p><strong>IFSC Code:</strong> SBIN0020123 (Placeholder)</p>
                  </div>
                  <div className="clay-card p-5 border border-secondary/5 flex flex-col justify-center items-center text-center">
                    <h5 className="font-bold text-secondary uppercase tracking-wider mb-2.5 text-sm">UPI Scan &amp; Pay</h5>
                    <span className="material-symbols-outlined text-4xl text-primary mb-1 font-bold">qr_code_2</span>
                    <p className="font-bold text-on-surface mt-1">kesulatrust@upi</p>
                    <p className="text-sm text-on-surface-variant opacity-75 mt-0.5">Scan via GPay, PhonePe, or Paytm</p>
                  </div>
                </div>
                <p className="text-sm text-on-surface-variant text-center italic mt-2 font-light">
                  * Your donation is eligible for 50% tax deduction under Section 80G. Just email us your receipt and we'll send you the certificate.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 3. Volunteer/Membership Form (#volunteer) */}
      <section id="volunteer" className="py-16 relative z-10 reveal overflow-hidden">
        <img src="/images/tribal_1.webp" className="absolute top-1/2 -translate-y-1/2 right-[-150px] w-[550px] h-[550px] opacity-[0.35] mix-blend-multiply pointer-events-none object-contain z-0 animate-spin-vertical-centered" alt="" />
        <div className="max-w-3xl mx-auto px-gutter relative z-10">
          <div className="text-center mb-12">
            <span className="text-primary font-bold text-xs uppercase tracking-[0.2em] block mb-2">{t('membership.tag')}</span>
            <h2 className="font-headline-lg text-headline-lg">{t('membership.title')}</h2>
            <p className="font-body-md text-on-surface-variant max-w-md mx-auto mt-2 text-sm font-light">
              {t('membership.subtitle')}
            </p>
          </div>

          <div className="bg-white rounded-[32px] p-8 md:p-10 border border-slate-100 shadow-[0_8px_60px_rgba(138,48,4,0.08)] relative overflow-hidden">
            {/* Decorative glow */}
            <div className="absolute -top-16 -left-16 w-36 h-36 rounded-full bg-[#8a3004]/5 blur-3xl pointer-events-none"></div>
            
            <div className="flex items-center gap-3 mb-8 relative z-10">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#8a3004] to-[#c5621a] flex items-center justify-center shadow-md">
                <span className="material-symbols-outlined text-white text-xl">group_add</span>
              </div>
              <div>
                <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">{t('membership.cardTitle')}</h3>
                <p className="text-xs text-slate-400 font-medium">{t('membership.cardSubtitle')}</p>
              </div>
            </div>
            
            {memberSuccess ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-10 rounded-2xl text-center relative z-10">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-4xl text-emerald-600">verified</span>
                </div>
                <h4 className="font-bold text-2xl mb-2 text-emerald-900">Application Submitted!</h4>
                <p className="text-emerald-700 font-medium max-w-md mx-auto">
                  Thank you for applying. Your membership application is under review by our admin team. Upon approval, your <strong>Official Digital Membership ID Card</strong> will be sent to your email.
                </p>
                <button onClick={() => setMemberSuccess(false)} className="mt-6 text-sm font-bold text-emerald-700 hover:text-emerald-900 underline underline-offset-4 transition-colors">Submit another application</button>
              </div>
            ) : (
              <form onSubmit={handleMemberSubmit} className="space-y-6 relative z-10">
                {/* Honeypot */}
                <div style={{ display: 'none' }} aria-hidden="true">
                  <label htmlFor="member-website">Website</label>
                  <input type="text" id="member-website" name="website" value={memberHoneypot} onChange={e => setMemberHoneypot(e.target.value)} tabIndex="-1" autoComplete="off" />
                </div>
                {memberError && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-2"><span className="material-symbols-outlined text-lg">error</span>{memberError}</div>}
                
                {/* Member Photo Upload */}
                <div className="flex flex-col items-center justify-center p-6 bg-orange-50/70 border-2 border-dashed border-orange-300/80 rounded-2xl text-center space-y-3 relative group hover:border-[#8a3004] transition-all">
                  <div className="relative w-24 h-24 rounded-full border-3 border-[#8a3004] overflow-hidden bg-white shadow-md flex items-center justify-center ring-4 ring-orange-100">
                    {isCompressingPhoto ? (
                      <div className="flex flex-col items-center justify-center text-[#8a3004] text-xs font-bold gap-1 p-1">
                        <span className="material-symbols-outlined animate-spin text-2xl">autorenew</span>
                        <span>Compressing...</span>
                      </div>
                    ) : memberForm.photoUrl ? (
                      <img src={memberForm.photoUrl} alt="Member Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span className="material-symbols-outlined text-4xl text-[#8a3004]/60">add_a_photo</span>
                    )}
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center gap-2">
                      <label htmlFor="member-photo-upload" className="cursor-pointer text-xs font-extrabold uppercase tracking-wider text-white bg-gradient-to-r from-[#8a3004] to-[#b5470a] px-5 py-2.5 rounded-xl shadow-md hover:from-[#a03c08] hover:to-[#c55010] transition-all inline-flex items-center gap-2">
                        <span className="material-symbols-outlined text-base">folder_open</span>
                        {memberForm.photoUrl ? 'Browse & Change Photo' : 'Browse & Upload Photo'}
                      </label>
                      {memberForm.photoUrl && (
                        <button 
                          type="button" 
                          onClick={() => { setMemberForm(prev => ({ ...prev, photoUrl: '' })); setPhotoCompressionStats(null); }}
                          className="text-xs font-bold text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-xl transition-all"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <input 
                      id="member-photo-upload" 
                      type="file" 
                      accept="image/*" 
                      onChange={handleMemberPhotoUpload} 
                      className="hidden" 
                    />
                    
                    {photoCompressionStats ? (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold rounded-full mt-1">
                        <span className="material-symbols-outlined text-sm text-emerald-600">compress</span>
                        Auto-Compressed: <span className="line-through opacity-75">{photoCompressionStats.original}</span> ➔ <span className="text-emerald-700 font-extrabold">{photoCompressionStats.compressed}</span>
                      </div>
                    ) : (
                      <p className="text-[11px] text-slate-500 font-medium mt-1">Browse any image — auto-compressed instantly for ID Card generation</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="member-name" className="text-sm font-bold text-slate-700 flex items-center gap-1.5"><span className="material-symbols-outlined text-[15px] text-[#8a3004]">person</span>{t('membership.fullName')} <span className="text-red-400">*</span></label>
                    <input id="member-name" type="text" autoComplete="name" aria-required="true" value={memberForm.fullName} onChange={(e) => setMemberForm({ ...memberForm, fullName: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-[15px] text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#8a3004] focus:ring-2 focus:ring-2 focus:ring-[#8a3004] focus:ring-offset-1 focus:outline-none transition-all duration-200" placeholder={t('membership.namePlaceholder')} required />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="member-email" className="text-sm font-bold text-slate-700 flex items-center gap-1.5"><span className="material-symbols-outlined text-[15px] text-[#8a3004]">mail</span>{t('membership.email')} <span className="text-red-400">*</span></label>
                    <input id="member-email" type="email" autoComplete="email" aria-required="true" value={memberForm.email} onChange={(e) => setMemberForm({ ...memberForm, email: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-[15px] text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#8a3004] focus:ring-2 focus:ring-2 focus:ring-[#8a3004] focus:ring-offset-1 focus:outline-none transition-all duration-200" placeholder={t('membership.emailPlaceholder')} required />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="member-phone" className="text-sm font-bold text-slate-700 flex items-center gap-1.5"><span className="material-symbols-outlined text-[15px] text-[#8a3004]">call</span>{t('membership.phone')} <span className="text-red-400">*</span></label>
                    <input id="member-phone" type="tel" autoComplete="tel" aria-required="true" value={memberForm.phone} onChange={(e) => setMemberForm({ ...memberForm, phone: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-[15px] text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#8a3004] focus:ring-2 focus:ring-2 focus:ring-[#8a3004] focus:ring-offset-1 focus:outline-none transition-all duration-200" placeholder="+91 XXXXX XXXXX" required />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="member-interest" className="text-sm font-bold text-slate-700 flex items-center gap-1.5"><span className="material-symbols-outlined text-[15px] text-[#8a3004]">interests</span>{t('membership.areaOfInterest')}</label>
                    <select id="member-interest" value={memberForm.interestArea} onChange={(e) => setMemberForm({ ...memberForm, interestArea: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-[15px] text-slate-900 focus:bg-white focus:border-[#8a3004] focus:ring-2 focus:ring-2 focus:ring-[#8a3004] focus:ring-offset-1 focus:outline-none transition-all duration-200 appearance-none cursor-pointer">
                      <option value="">{t('membership.selectFocusArea')}</option>
                      {interestCategories.map((cat, idx) => (<option key={idx} value={cat}>{cat}</option>))}
                    </select>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="member-address" className="text-sm font-bold text-slate-700 flex items-center gap-1.5"><span className="material-symbols-outlined text-[15px] text-[#8a3004]">home</span>{t('membership.address')}</label>
                  <input id="member-address" type="text" autoComplete="street-address" value={memberForm.address} onChange={(e) => setMemberForm({ ...memberForm, address: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-[15px] text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#8a3004] focus:ring-2 focus:ring-2 focus:ring-[#8a3004] focus:ring-offset-1 focus:outline-none transition-all duration-200" placeholder={t('membership.addressPlaceholder')} />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="member-message" className="text-sm font-bold text-slate-700 flex items-center gap-1.5"><span className="material-symbols-outlined text-[15px] text-[#8a3004]">chat</span>{t('membership.whyJoin')}</label>
                  <textarea id="member-message" rows="4" value={memberForm.message} onChange={(e) => setMemberForm({ ...memberForm, message: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-[15px] text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#8a3004] focus:ring-2 focus:ring-2 focus:ring-[#8a3004] focus:ring-offset-1 focus:outline-none transition-all duration-200 resize-none" placeholder={t('membership.whyJoinPlaceholder')}></textarea>
                </div>
                <button type="submit" disabled={isMemberSubmitting} className="w-full bg-gradient-to-r from-[#8a3004] to-[#b5470a] hover:from-[#a03c08] hover:to-[#c55010] text-white font-bold text-sm uppercase tracking-[0.15em] px-8 py-4.5 rounded-2xl flex justify-center items-center gap-2.5 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#8a3004]/20 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none">
                  {isMemberSubmitting ? (<><span className="material-symbols-outlined animate-spin text-lg">autorenew</span>{t('membership.submitting')}</>) : (<><span className="material-symbols-outlined text-lg">how_to_reg</span>{t('membership.submitBtn')}</>)}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Membership ID Card Modal */}
      <MembershipCardModal
        member={submittedMemberData}
        isOpen={showIdCardModal}
        onClose={() => setShowIdCardModal(false)}
      />
    </div>
  );
}
