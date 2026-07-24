import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function TermsConditions() {
  const { t } = useLanguage();
  return (
    <div className="relative overflow-hidden bg-background text-on-surface min-h-screen pt-20">
      {/* Background glow blobs */}
      <div className="absolute top-[5%] left-[-10%] w-[45vw] h-[45vw] rounded-full blur-[130px] opacity-10 bg-primary pointer-events-none z-0"></div>
      <div className="absolute bottom-[10%] right-[-10%] w-[45vw] h-[45vw] rounded-full blur-[130px] opacity-[0.05] bg-secondary pointer-events-none z-0"></div>

      <div className="max-w-[800px] mx-auto px-gutter py-16 relative z-10">
        <h1 className="font-headline-lg text-4xl font-extrabold text-primary mb-8 border-b-2 border-primary/10 pb-4">{t('footer.termsConditions')}</h1>
        
        <p className="text-on-surface-variant text-sm mb-6 leading-relaxed">
          Last Updated: August 1, 2024
        </p>

        <section className="mb-8">
          <h2 className="font-headline-md text-xl font-bold mb-4 text-secondary">1. Agreement to Terms</h2>
          <p className="text-on-surface-variant text-base leading-relaxed mb-4">
            By accessing or using the Kesula Charitable Trust website, you agree to comply with and be bound by these Terms &amp; Conditions. If you do not agree, please do not use our services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="font-headline-md text-xl font-bold mb-4 text-secondary">2. Voluntary Donations</h2>
          <p className="text-on-surface-variant text-base leading-relaxed mb-4">
            All donations made to Kesula Charitable Trust are voluntary. The donor agrees that donations are given freely to support our charitable activities. Donors must ensure that payment credentials used are their own or that they have legal authorization.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="font-headline-md text-xl font-bold mb-4 text-secondary">3. Tax Benefits</h2>
          <p className="text-on-surface-variant text-base leading-relaxed mb-4">
            Kesula Charitable Trust is registered under Section 80G of the Indian Income Tax Act. Donors seeking tax exemptions must submit accurate PAN numbers at the time of donation. We bear no liability for tax-benefit rejection if inaccurate information is provided.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="font-headline-md text-xl font-bold mb-4 text-secondary">4. Governing Law</h2>
          <p className="text-on-surface-variant text-base leading-relaxed mb-4">
            These terms shall be governed by and interpreted under the laws of the Republic of India. Any disputes arising out of your use of the site or transaction processing shall be subject to the exclusive jurisdiction of the competent courts in Hyderabad, Telangana, India.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="font-headline-md text-xl font-bold mb-4 text-secondary">5. Modifications</h2>
          <p className="text-on-surface-variant text-base leading-relaxed mb-4">
            We reserve the right to revise or update these terms at any time. Your continued use of the website following changes constitutes acceptance of the new Terms &amp; Conditions.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="font-headline-md text-xl font-bold mb-4 text-secondary">6. Contact Us</h2>
          <p className="text-on-surface-variant text-base leading-relaxed">
            If you have questions regarding these Terms &amp; Conditions, please contact us at:
            <br />
            <strong>Kesula Charitable Trust</strong>
            <br />
            Plot No. 290, Jayakalani Nagar, Chengicherla, Medchal–Malkajgiri District, Telangana – India
            <br />
            Email: <a href="mailto:kesulatrust@gmail.com" className="text-primary hover:underline">kesulatrust@gmail.com</a>
          </p>
        </section>
      </div>
    </div>
  );
}
