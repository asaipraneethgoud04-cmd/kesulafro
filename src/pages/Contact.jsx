import React, { useState } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { supabase } from '../lib/supabase';

export default function Contact() {
  useScrollReveal();

  // Contact Form State
  const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', subject: 'general', message: '' });
  const [contactSuccess, setContactSuccess] = useState(false);
  const [contactError, setContactError] = useState('');
  const [contactHoneypot, setContactHoneypot] = useState('');
  const [lastContactSubmit, setLastContactSubmit] = useState(0);

  // Membership Form State
  const [memberForm, setMemberForm] = useState({ fullName: '', email: '', phone: '', address: '', interestArea: '', message: '' });
  const [memberSuccess, setMemberSuccess] = useState(false);
  const [memberError, setMemberError] = useState('');
  const [memberHoneypot, setMemberHoneypot] = useState('');
  const [lastMemberSubmit, setLastMemberSubmit] = useState(0);

  // Donation Section State
  const [donationAmount, setDonationAmount] = useState('1000');
  const [customAmount, setCustomAmount] = useState('');
  const [showManualPayment, setShowManualPayment] = useState(false);
  const [donationForm, setDonationForm] = useState({ name: '', email: '' });
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);
  const [paymentSuccessMessage, setPaymentSuccessMessage] = useState('');

  const interestCategories = [
    'Education & Skill Development',
    'Healthcare & Wellness',
    'Livelihood & Rural Development',
    'Women, Youth & Disability Empowerment',
    'Environment & Sustainability',
    'Culture, Community & Animal Welfare'
  ];

  // Handlers
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactError('');

    if (contactHoneypot) {
      setContactError('Submission failed.');
      return;
    }

    const now = Date.now();
    if (now - lastContactSubmit < 60000) {
      setContactError('Please wait 60 seconds before submitting another enquiry.');
      return;
    }

    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      setContactError('Please fill out all required fields (Name, Email, and Message).');
      return;
    }

    try {
      const { error } = await supabase.from('contact_messages').insert([contactForm]);
      if (!error) {
        try {
          await fetch(`${import.meta.env.VITE_API_URL || ''}/api/send-enquiry-email`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: contactForm.email, name: contactForm.name, details: contactForm })
          });
        } catch (emailErr) {
          console.error("Failed to send enquiry email:", emailErr);
        }

        setContactSuccess(true);
        setContactForm({ name: '', email: '', phone: '', subject: 'general', message: '' });
        setLastContactSubmit(now);
      } else {
        setContactError(error.message || 'Submission failed.');
      }
    } catch (err) {
      setContactError('Network error. Please try again.');
    }
  };

  const handleMemberSubmit = async (e) => {
    e.preventDefault();
    setMemberError('');

    if (memberHoneypot) {
      setMemberError('Submission failed.');
      return;
    }

    const now = Date.now();
    if (now - lastMemberSubmit < 60000) {
      setMemberError('Please wait 60 seconds before submitting another application.');
      return;
    }

    if (!memberForm.fullName || !memberForm.email || !memberForm.phone) {
      setMemberError('Please fill out all required fields (Full Name, Email, and Phone).');
      return;
    }

    try {
      const { error } = await supabase.from('members').insert([memberForm]);
      if (!error) {
        // Trigger welcome email
        try {
          await fetch(`${import.meta.env.VITE_API_URL || ''}/api/send-welcome-email`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: memberForm.email, name: memberForm.fullName, details: memberForm })
          });
        } catch (emailErr) {
          console.error("Failed to send welcome email:", emailErr);
        }

        setMemberSuccess(true);
        setMemberForm({ fullName: '', email: '', phone: '', address: '', interestArea: '', message: '' });
        setLastMemberSubmit(now);
      } else {
        setMemberError(error.message || 'Submission failed.');
      }
    } catch (err) {
      setMemberError('Network error. Please try again.');
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
        body: JSON.stringify({ amount: amountToDonate })
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
                amount: amountToDonate,
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
        }
      };
      
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response){
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
      <div className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-[0.02] pointer-events-none mix-blend-multiply" style={{ backgroundImage: "url('/images/artisan_bg.png')" }}></div>
      <div className="absolute top-[5%] left-[-10%] w-[45vw] h-[45vw] rounded-full blur-[130px] opacity-10 bg-primary pointer-events-none z-0"></div>
      <div className="absolute bottom-[30%] right-[-10%] w-[50vw] h-[50vw] rounded-full blur-[140px] opacity-[0.06] bg-secondary pointer-events-none z-0"></div>
      <div className="absolute bottom-[5%] left-[-10%] w-[45vw] h-[45vw] rounded-full blur-[130px] opacity-[0.05] bg-primary pointer-events-none z-0"></div>

      {/* Hero Header */}
      <section className="relative min-h-[400px] flex items-center justify-center pt-32 pb-20 md:pt-48 md:pb-24 overflow-hidden z-10 reveal bg-cover bg-center bg-fixed" style={{ backgroundImage: "url('/images/contact_bg.png')" }}>
        <div className="absolute inset-0 bg-black/60 z-0 pointer-events-none"></div>
        <div className="relative z-10 text-center text-white px-gutter max-w-2xl mx-auto w-full">
          <span className="text-white font-extrabold text-xs uppercase tracking-[0.25em] block mb-3 text-shadow-md">Get in Touch</span>
          <h1 className="font-display-lg text-4xl sm:text-5xl md:text-headline-lg font-extrabold tracking-tight text-white text-shadow-lg mb-4">Contact &amp; Support</h1>
          <p className="font-body-lg text-white/95 font-medium text-shadow-md">We are here to answer your questions and welcome your support.</p>
        </div>
      </section>

      {/* Main Grid: Details + Contact Form */}
      <section className="py-16 max-w-container mx-auto px-gutter relative z-10 reveal overflow-hidden">
        <img src="/images/tribal_3.png" className="absolute top-[30%] -translate-y-1/2 right-[-150px] w-[550px] h-[550px] opacity-[0.35] mix-blend-multiply pointer-events-none object-contain z-0 animate-spin-vertical-centered" alt="" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start relative z-10">
          
          {/* Details column */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <h2 className="font-headline-lg text-3xl font-bold mb-4 text-primary tracking-tight">Office Address</h2>
              <p className="text-on-surface-variant leading-relaxed text-xl font-light">
                Plot No. 290, Jayakalani Nagar, Near Peddamma Thalli Temple, Chengicherla, Boduppal Municipal Corporation, Medchal–Malkajgiri District, Telangana – India
              </p>
            </div>
            <div className="border-t border-secondary/10 pt-6 space-y-4">
              <p className="text-on-surface-variant text-xl flex items-center gap-3 font-light">
                <span className="w-8 h-8 clay-badge-colored flex items-center justify-center text-primary font-bold"><span className="material-symbols-outlined text-lg">call</span></span>
                <span><strong>Mobile:</strong> +91 79012 46256</span>
              </p>
              <p className="text-on-surface-variant text-xl flex items-center gap-3 font-light">
                <span className="w-8 h-8 clay-badge-colored flex items-center justify-center text-primary font-bold"><span className="material-symbols-outlined text-lg">mail</span></span>
                <span><strong>Email:</strong> kesulatrust@gmail.com</span>
              </p>
              <p className="text-on-surface-variant text-xl flex items-center gap-3 font-light">
                <span className="w-8 h-8 clay-badge-colored flex items-center justify-center text-primary font-bold"><span className="material-symbols-outlined text-lg">public</span></span>
                <span><strong>Web:</strong> www.kesulatrust.org</span>
              </p>
            </div>
            <div className="border-t border-secondary/10 pt-6">
              <h3 className="font-headline-md text-xl font-bold mb-3 text-primary uppercase tracking-wider">Registration Profile</h3>
              <ul className="text-lg text-on-surface-variant space-y-2 font-light">
                <li>• Registered under Indian Trusts Act, 1882</li>
                <li>• 12A Registration: AAFTK6925KE20241</li>
                <li>• 80G Registration: AAFTK6925KF20241</li>
                <li>• PAN Card: AAFTK6925K</li>
              </ul>
            </div>
          </div>

          {/* Contact Form Column */}
          <div className="lg:col-span-7 glass-panel p-8 rounded-3xl border border-white/40 shadow-sm">
            <h2 className="font-headline-lg text-3xl font-bold mb-6 text-on-surface tracking-tight">Send an Enquiry</h2>
            {contactSuccess ? (
              <div className="bg-green-50 border border-green-200 text-green-800 p-8 rounded-2xl text-center">
                <span className="material-symbols-outlined text-5xl mb-2 text-green-600 block">check_circle</span>
                <h4 className="font-semibold text-2xl mb-1">Message Sent</h4>
                <p className="text-xl font-light">Thank you! Your enquiry has been received and our team will get back to you shortly.</p>
                <button onClick={() => setContactSuccess(false)} className="mt-4 text-lg font-bold text-primary hover:underline">Send another message</button>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-5">
                {/* Honeypot field - hidden from real users */}
                <div style={{ display: 'none' }} aria-hidden="true">
                  <label htmlFor="contact-website">Website</label>
                  <input type="text" id="contact-website" name="website" value={contactHoneypot} onChange={e => setContactHoneypot(e.target.value)} tabIndex="-1" autoComplete="off" />
                </div>
                {contactError && <p className="text-lg text-error font-semibold">{contactError}</p>}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex flex-col">
                    <label htmlFor="contact-name" className="text-lg font-semibold text-on-surface-variant mb-2">Your Name *</label>
                    <input
                      id="contact-name"
                      type="text"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      className="glass-input rounded-xl p-3 text-xl text-on-surface"
                      placeholder="Full name"
                      required
                    />
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="contact-email" className="text-lg font-semibold text-on-surface-variant mb-2">Email Address *</label>
                    <input
                      id="contact-email"
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className="glass-input rounded-xl p-3 text-xl text-on-surface"
                      placeholder="email@example.com"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex flex-col">
                    <label htmlFor="contact-phone" className="text-lg font-semibold text-on-surface-variant mb-2">Phone Number</label>
                    <input
                      id="contact-phone"
                      type="tel"
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                      className="glass-input rounded-xl p-3 text-xl text-on-surface"
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="contact-subject" className="text-lg font-semibold text-on-surface-variant mb-2">Enquiry Type *</label>
                    <select
                      id="contact-subject"
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                      className="glass-input rounded-xl p-3 text-xl text-on-surface appearance-none"
                    >
                      <option value="general">General Enquiry</option>
                      <option value="donate">Donation Enquiry</option>
                      <option value="volunteer">Volunteer Enquiry</option>
                    </select>
                  </div>
                </div>
                <div className="flex flex-col">
                  <label htmlFor="contact-message" className="text-lg font-semibold text-on-surface-variant mb-2">Your Message *</label>
                  <textarea
                    id="contact-message"
                    rows="4"
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    className="glass-input rounded-xl p-3 text-xl text-on-surface resize-none"
                    placeholder="How can we help you?"
                    required
                  ></textarea>
                </div>
                <button type="submit" className="clay-btn clay-btn-primary px-6 py-3 text-lg uppercase tracking-wider w-full mt-2">
                  Submit Enquiry
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* 2. Donate Section (#donate) */}
      <section id="donate" className="py-16 relative z-10 reveal overflow-hidden">
        <img src="/images/tribal_2.png" className="absolute top-1/2 -translate-y-1/2 left-[-150px] w-[550px] h-[550px] opacity-[0.35] mix-blend-multiply pointer-events-none object-contain z-0 animate-spin-vertical-centered" alt="" />
        <div className="max-w-4xl mx-auto px-gutter text-center relative z-10">
          <span className="text-primary font-bold text-xs uppercase tracking-[0.2em] block mb-2">Make a Contribution</span>
          <h2 className="font-headline-lg text-headline-lg">Support Our Operations</h2>
          <p className="font-body-md text-on-surface-variant max-w-2xl mx-auto mt-4 mb-10 leading-relaxed text-sm font-light">
            Your generous support drives value-based tribal education, critical rural health runs, environment preservation drives, and Banjara handicraft protection.
          </p>

          <div className="clay-card-colored border border-white/50 p-8 max-w-2xl mx-auto text-left shadow-sm">
            <h3 className="font-headline-md text-2xl font-bold mb-6 text-center text-primary uppercase tracking-wider">Donation Details</h3>
            
            {paymentSuccessMessage ? (
              <div className="bg-green-50 text-green-800 p-6 rounded-2xl border border-green-200 text-center flex flex-col items-center">
                <span className="material-symbols-outlined text-5xl text-green-500 mb-3 block">check_circle</span>
                <h4 className="font-bold text-xl mb-2">Thank You!</h4>
                <p>{paymentSuccessMessage}</p>
                <button
                  onClick={() => setPaymentSuccessMessage('')}
                  className="mt-6 px-6 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors"
                >
                  Make Another Donation
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="flex flex-col">
                    <label htmlFor="donor-name" className="text-lg font-semibold text-on-surface-variant mb-2">Full Name *</label>
                    <input
                      id="donor-name"
                      type="text"
                      value={donationForm.name}
                      onChange={(e) => setDonationForm({ ...donationForm, name: e.target.value })}
                      className="glass-input rounded-xl p-3 text-xl text-on-surface"
                      placeholder="Full name"
                      required
                      disabled={isVerifyingPayment}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="donor-email" className="text-lg font-semibold text-on-surface-variant mb-2">Email Address *</label>
                    <input
                      id="donor-email"
                      type="email"
                      value={donationForm.email}
                      onChange={(e) => setDonationForm({ ...donationForm, email: e.target.value })}
                      className="glass-input rounded-xl p-3 text-xl text-on-surface"
                      placeholder="For receipt"
                      required
                      disabled={isVerifyingPayment}
                    />
                  </div>
                </div>

                <h4 className="font-headline-md text-xl font-bold mb-4 text-on-surface">Select Amount</h4>
                <div className="grid grid-cols-4 gap-4 mb-6">
                  {['500', '1000', '2500', '5000'].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => { setDonationAmount(amt); setCustomAmount(''); }}
                      disabled={isVerifyingPayment}
                      className={`py-3 rounded-xl font-bold text-xl transition-all focus:outline-none ${donationAmount === amt && !customAmount ? 'clay-badge-active text-primary shadow-md' : 'clay-badge text-on-surface-variant hover:bg-white'} disabled:opacity-50`}
                    >
                      ₹{amt}
                    </button>
                  ))}
                </div>

                <div className="flex flex-col mb-6">
                  <label htmlFor="custom-amount" className="text-lg font-semibold text-on-surface-variant mb-2">Or Enter Custom Amount (INR)</label>
                  <input
                    id="custom-amount"
                    type="number"
                    value={customAmount}
                    onChange={(e) => { setCustomAmount(e.target.value); setDonationAmount(''); }}
                    className="glass-input rounded-xl p-3 text-xl text-on-surface"
                    placeholder="Enter custom amount"
                    disabled={isVerifyingPayment}
                  />
                </div>

                <button
                  onClick={handleDonateNow}
                  disabled={isVerifyingPayment}
                  className="clay-btn clay-btn-primary px-8 py-3.5 text-lg uppercase tracking-wider w-full block text-center disabled:opacity-75 relative flex justify-center items-center h-14"
                >
                  {isVerifyingPayment ? (
                    <span className="material-symbols-outlined animate-spin text-2xl absolute">autorenew</span>
                  ) : (
                    `Donate Now (₹${customAmount || donationAmount})`
                  )}
                </button>
              </>
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
                  Thank you for your generosity! Since payment gateway integrations are currently under client review, please transfer your contribution manually using the details below:
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
                  * Note: Donations to KESULA TRUST are tax-deductible under Section 80G of the Income Tax Act. Please email us your receipt for your 80G tax exemption certificate.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 3. Volunteer/Membership Form (#volunteer) */}
      <section id="volunteer" className="py-16 relative z-10 reveal overflow-hidden">
        <img src="/images/tribal_1.png" className="absolute top-1/2 -translate-y-1/2 right-[-150px] w-[550px] h-[550px] opacity-[0.35] mix-blend-multiply pointer-events-none object-contain z-0 animate-spin-vertical-centered" alt="" />
        <div className="max-w-3xl mx-auto px-gutter relative z-10">
          <div className="text-center mb-12">
            <span className="text-primary font-bold text-xs uppercase tracking-[0.2em] block mb-2">Join the Movement</span>
            <h2 className="font-headline-lg text-headline-lg">Become a Member</h2>
            <p className="font-body-md text-on-surface-variant max-w-md mx-auto mt-2 text-sm font-light">
              Lend your time, passion, or skill to empower tribal communities on the ground.
            </p>
          </div>

          <div className="glass-panel p-8 rounded-3xl border border-white/40 shadow-sm">
            {memberSuccess ? (
              <div className="bg-green-50 border border-green-200 text-green-800 p-8 rounded-2xl text-center">
                <span className="material-symbols-outlined text-5xl mb-2 text-green-600 block">verified</span>
                <h4 className="font-semibold text-2xl mb-1">Membership Application Submitted</h4>
                <p className="text-xl font-light">We appreciate your willingness to serve! Our team will review your application and reach out to you shortly.</p>
                <button onClick={() => setMemberSuccess(false)} className="mt-4 text-lg font-bold text-primary hover:underline">Apply again</button>
              </div>
            ) : (
              <form onSubmit={handleMemberSubmit} className="space-y-5">
                {/* Honeypot field */}
                <div style={{ display: 'none' }} aria-hidden="true">
                  <label htmlFor="member-website">Website</label>
                  <input type="text" id="member-website" name="website" value={memberHoneypot} onChange={e => setMemberHoneypot(e.target.value)} tabIndex="-1" autoComplete="off" />
                </div>
                {memberError && <p className="text-lg text-error font-semibold">{memberError}</p>}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex flex-col">
                    <label htmlFor="member-name" className="text-lg font-semibold text-on-surface-variant mb-2">Full Name *</label>
                    <input
                      id="member-name"
                      type="text"
                      value={memberForm.fullName}
                      onChange={(e) => setMemberForm({ ...memberForm, fullName: e.target.value })}
                      className="glass-input rounded-xl p-3 text-xl text-on-surface"
                      placeholder="Full Name"
                      required
                    />
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="member-email" className="text-lg font-semibold text-on-surface-variant mb-2">Email Address *</label>
                    <input
                      id="member-email"
                      type="email"
                      value={memberForm.email}
                      onChange={(e) => setMemberForm({ ...memberForm, email: e.target.value })}
                      className="glass-input rounded-xl p-3 text-xl text-on-surface"
                      placeholder="email@example.com"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex flex-col">
                    <label htmlFor="member-phone" className="text-lg font-semibold text-on-surface-variant mb-2">Phone Number *</label>
                    <input
                      id="member-phone"
                      type="tel"
                      value={memberForm.phone}
                      onChange={(e) => setMemberForm({ ...memberForm, phone: e.target.value })}
                      className="glass-input rounded-xl p-3 text-xl text-on-surface"
                      placeholder="Mobile number"
                      required
                    />
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="member-interest" className="text-lg font-semibold text-on-surface-variant mb-2">Area of Interest</label>
                    <select
                      id="member-interest"
                      value={memberForm.interestArea}
                      onChange={(e) => setMemberForm({ ...memberForm, interestArea: e.target.value })}
                      className="glass-input rounded-xl p-3 text-xl text-on-surface appearance-none"
                    >
                      <option value="">Select a Focus Area</option>
                      {interestCategories.map((cat, idx) => (
                        <option key={idx} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex flex-col">
                  <label htmlFor="member-address" className="text-lg font-semibold text-on-surface-variant mb-2">Residential Address</label>
                  <input
                    id="member-address"
                    type="text"
                    value={memberForm.address}
                    onChange={(e) => setMemberForm({ ...memberForm, address: e.target.value })}
                    className="glass-input rounded-xl p-3 text-xl text-on-surface"
                    placeholder="City, State, Country"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="member-message" className="text-lg font-semibold text-on-surface-variant mb-2">Why do you want to join KESULA?</label>
                  <textarea
                    id="member-message"
                    rows="3"
                    value={memberForm.message}
                    onChange={(e) => setMemberForm({ ...memberForm, message: e.target.value })}
                    className="glass-input rounded-xl p-3 text-xl text-on-surface resize-none"
                    placeholder="Tell us about yourself and how you would like to contribute."
                  ></textarea>
                </div>
                <button type="submit" className="clay-btn clay-btn-primary px-6 py-3 text-lg uppercase tracking-wider w-full mt-2">
                  Submit Application
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
