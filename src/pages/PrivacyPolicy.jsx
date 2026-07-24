import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function PrivacyPolicy() {
  const { t } = useLanguage();
  return (
    <div className="relative overflow-hidden bg-background text-on-surface min-h-screen pt-20">
      {/* Background glow blobs */}
      <div className="absolute top-[5%] left-[-10%] w-[45vw] h-[45vw] rounded-full blur-[130px] opacity-10 bg-primary pointer-events-none z-0"></div>
      <div className="absolute bottom-[10%] right-[-10%] w-[45vw] h-[45vw] rounded-full blur-[130px] opacity-[0.05] bg-secondary pointer-events-none z-0"></div>

      <div className="max-w-[800px] mx-auto px-gutter py-16 relative z-10">
        <h1 className="font-headline-lg text-4xl font-extrabold text-primary mb-8 border-b-2 border-primary/10 pb-4">{t('footer.privacyPolicy')}</h1>
        
        <p className="text-on-surface-variant text-sm mb-6 leading-relaxed">
          Effective Date: August 1, 2024
        </p>

        <section className="mb-8">
          <h2 className="font-headline-md text-xl font-bold mb-4 text-secondary">1. Introduction</h2>
          <p className="text-on-surface-variant text-base leading-relaxed mb-4">
            Kesula Charitable Trust ("we", "our", "us") values your privacy. This Privacy Policy details how we collect, use, store, and protect your personal information when you visit our website, register for events, volunteer, or make a donation.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="font-headline-md text-xl font-bold mb-4 text-secondary">2. Information We Collect</h2>
          <p className="text-on-surface-variant text-base leading-relaxed mb-4">
            We collect personal information that you voluntarily provide to us, including:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-on-surface-variant text-base mb-4">
            <li><strong>Donor Information:</strong> Name, email address, phone number, physical address, PAN card details (required for issuing 80G tax exemption certificates under Indian Income Tax regulations).</li>
            <li><strong>Transactional Information:</strong> Payment details processed securely through our authorized payment gateway partners (e.g. Razorpay). We do not store card numbers or banking passwords on our servers.</li>
            <li><strong>Volunteer & Member Details:</strong> Full name, contact information, background, and specific areas of interest.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="font-headline-md text-xl font-bold mb-4 text-secondary">3. How We Use Your Information</h2>
          <p className="text-on-surface-variant text-base leading-relaxed mb-4">
            The information collected is used for:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-on-surface-variant text-base mb-4">
            <li>Processing donations and generating official digital donation receipts.</li>
            <li>Submitting tax-exemption records (Form 10BD) to the Income Tax Department of India for your 80G benefits.</li>
            <li>Sending newsletters, updates on campaigns, or event registrations.</li>
            <li>Communicating about community impact activities and volunteer opportunities.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="font-headline-md text-xl font-bold mb-4 text-secondary">4. Data Sharing & Security</h2>
          <p className="text-on-surface-variant text-base leading-relaxed mb-4">
            We do not sell, rent, or trade your personal information. We share details only with payment processors and government regulators (as required by law). We employ industry-standard secure socket layer (SSL) encryption to guarantee transaction privacy.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="font-headline-md text-xl font-bold mb-4 text-secondary">5. Contact Information</h2>
          <p className="text-on-surface-variant text-base leading-relaxed">
            If you have questions or concerns about your data privacy, contact us at:
            <br />
            <strong>Kesula Charitable Trust</strong>
            <br />
            Plot No. 290, Jayakalani Nagar, Chengicherla, Medchal–Malkajgiri District, Telangana – India
            <br />
            Email: <a href="mailto:kesulatrust@gmail.com" className="text-primary hover:underline">kesulatrust@gmail.com</a>
            <br />
            Phone: +91 79012 46256
          </p>
        </section>
      </div>
    </div>
  );
}
