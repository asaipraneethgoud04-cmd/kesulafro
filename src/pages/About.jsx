import React from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function About() {
  useScrollReveal();

  const focusAreas = [
    'Education & Skill Development',
    'Entrepreneurship & Employment Generation',
    'Tribal & Rural Development',
    'Women & Youth Empowerment',
    'Disability Inclusion',
    'Healthcare & Nutrition',
    'Environmental Conservation & Water Sustainability',
    'Animal Welfare',
    'Community Development & Social Innovation'
  ];

  return (
    <div className="relative overflow-hidden bg-background text-on-surface">
      {/* Background glow blobs */}
      <div className="absolute top-[5%] left-[-10%] w-[45vw] h-[45vw] rounded-full blur-[130px] opacity-10 bg-primary pointer-events-none z-0"></div>
      <div className="absolute top-[35%] right-[-15%] w-[40vw] h-[40vw] rounded-full blur-[130px] opacity-[0.08] bg-secondary pointer-events-none z-0"></div>
      <div className="absolute bottom-[10%] left-[-10%] w-[50vw] h-[50vw] rounded-full blur-[140px] opacity-[0.06] bg-primary pointer-events-none z-0"></div>

      {/* Hero Section */}
      <section className="relative min-h-[500px] flex items-center justify-center pt-32 pb-20 md:pt-48 md:pb-24 z-10 reveal overflow-hidden bg-cover bg-center bg-fixed" style={{ backgroundImage: "url('/images/artisan_bg.png')" }}>
        <div className="absolute inset-0 bg-black/60 z-0 pointer-events-none"></div>
        <div className="max-w-container mx-auto px-gutter text-center relative z-10 w-full">
          <span className="text-white font-extrabold text-xs uppercase tracking-[0.25em] block mb-3 text-shadow-md">Our Roots &amp; Heritage</span>
          <h1 className="font-display-lg text-4xl sm:text-5xl md:text-display-lg text-white mb-6 leading-tight tracking-tight max-w-4xl mx-auto text-shadow-lg">
            Preserving the Soul of <br className="md:hidden" />
            <span className="text-white underline decoration-primary decoration-4 underline-offset-4 font-extrabold">Tribal Communities</span>
          </h1>
          <p className="font-body-lg text-body-lg text-white/95 max-w-2xl mx-auto leading-relaxed font-medium text-shadow-md">
            Founded on the principles of respect, dignity, and cultural preservation, Kesula Charitable Trust works as a bridge between ancestral wisdom and modern progress.
          </p>
        </div>
      </section>

      {/* Narrative Section - The Genesis of Kesula */}
      <section className="py-section-gap relative z-10 reveal overflow-hidden">
        <img src="/images/tribal_2.png" className="absolute top-0 right-0 w-[600px] opacity-[0.35] mix-blend-multiply pointer-events-none animate-float-delayed z-20" alt="" />
        <div className="max-w-container mx-auto px-gutter relative z-10">
          <div className="grid md:grid-cols-12 gap-16 items-center">
            <div className="md:col-span-5 relative">
              <div>
                <h2 className="font-headline-lg text-3xl md:text-headline-lg mb-6 tracking-tight">The Genesis of Kesula</h2>
                <p className="font-body-md text-on-surface-variant mb-6 leading-relaxed font-light">
                  Our journey began in the heart of tribal belts, where we witnessed the incredible resilience and rich artistic heritage of indigenous peoples, juxtaposed against the challenges of marginalization and disappearing traditions.
                </p>
                <p className="font-body-md text-on-surface-variant mb-8 leading-relaxed font-light">
                  Kesula, named after the sacred Flame of the Forest (<strong className="font-bold text-primary">Butea monosperma</strong>), symbolizes the fire of knowledge and the endurance of nature. We are not just an NGO; we are a movement dedicated to ensuring that tribal identity is not lost in the rush toward modernization.
                </p>
                <div className="flex items-center gap-8">
                  <div className="clay-card p-4 border border-secondary/5 text-center min-w-[110px]">
                    <span className="block font-headline-lg text-primary text-3xl font-extrabold">6+ Years</span>
                    <span className="text-[7px] font-bold uppercase tracking-wider text-on-surface-variant opacity-75">Active Impact</span>
                  </div>
                  <div className="h-10 w-[1px] bg-secondary/15"></div>
                  <div className="clay-card p-4 border border-secondary/5 text-center min-w-[110px]">
                    <span className="block font-headline-lg text-primary text-3xl font-extrabold">200K+</span>
                    <span className="text-[7px] font-bold uppercase tracking-wider text-on-surface-variant opacity-75">Lives Touched</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Grid as Glass Frames */}
            <div className="md:col-span-7 grid grid-cols-2 gap-6">
              <div className="space-y-6 pt-12">
                <div className="aspect-[3/4] rounded-3xl overflow-hidden glass-panel p-2 shadow-md hover:scale-[1.02] transition-transform duration-300">
                  <img className="w-full h-full object-cover rounded-2xl" alt="Tribal Gathering"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDh3ri4OZetI710qXOaUZkS3CVFQtmYk7_sJ3834aOEsk82RYkVagfnkiVa0JWvZMJvkgcqkt_E6kqotk0U3RRG5JGEFebSzjm6NMUaFamq5nOuY0XERmPvHzQa833wtEaq69sx-wgSgQ26V46czprYJd_VMPcdSRZ4tzKcq-8jKqytCKUKYPnztPThlCiPAv5U34EfX0F8akoejOE2BBH-A49fdYV_bO7s5m0ncLvQ7XHGxx6Ly2gtHeD-s3ZyV8jNHeBcKrJDVDQ" />
                </div>
                <div className="aspect-square rounded-3xl overflow-hidden glass-panel p-2 shadow-md hover:scale-[1.02] transition-transform duration-300">
                  <img className="w-full h-full object-cover rounded-2xl" alt="Artisan Hands Weaving"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAUJLDtBj7TBni1nXgBi5gO8BYGGH_mIhMS8ZqsBE4PR2or7cdejX_LZ3eMkTM6Jr-ya1wSc6i6nmii31cbUBVzkIaxwNDD6CpmbRdchWPgKGpK9GHUoUVP495lUGBcUPMFkzBKM_R6THQHTG5V_m6Rl3UShdGDtRNzi8V2YG67zisnxt6D4stx9pC35XZAlPbbrXClLPZ1DASTjZS_6a6VLSOYLV5Cgvtbgn6pyvy3BKAW95iwaTQbRBjBm64Y2SLuOVaWMwQK3gI" />
                </div>
              </div>
              <div className="space-y-6">
                <div className="aspect-square rounded-3xl overflow-hidden glass-panel p-2 shadow-md hover:scale-[1.02] transition-transform duration-300">
                  <img className="w-full h-full object-cover rounded-2xl" alt="School children"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBhR6xU6vF3eABcF_NhsPKm9nGg-_i9KEXX2D2sgw88UB69LuAZzhgbLZXiuvVyUQNVwpN9mmOsq4lVH5K1q5mhBj58V2_gs2j4ESmDNP9nSCXjV_inLUs3bsbonb6z-A7ruEJINzVEjXircc_gLd6KMYfozGcesKZKYeikgY9GPXqK74AZc_owaiORT5hLvKZnanYEtg3hH-rxZWCztZuCNDzeAZaUoz0DT3jjofXbDzRi_OCb32lDIj-StQDNG6X-TppOhFZOKes" />
                </div>
                <div className="aspect-[3/4] rounded-3xl overflow-hidden glass-panel p-2 shadow-md hover:scale-[1.02] transition-transform duration-300">
                  <img className="w-full h-full object-cover rounded-2xl" alt="Forest and Nature"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuA1CkUIynGkNRNeVridYrc54zB4Tj0DJeIriw06Q9PSzbb0CKTnhYAIQ7LGWlsGGAOOxA4wdl0G1nWiM8H9zYcs_51Oxcj9wQDaQxnPO5dipl6ktF7B2goGj8GLBu3uiMG7yIR3HWhwpioCnw7w9q402xtPfofrLg-VosWe1Elj_CWAEXRvF7h28ngs38cm2Wu6dSF07Zoy3SVlJmfWf_wYKDKfNPUXIJmejQSRBF0wnO1PLCsDJclrnvht3FlOttnjsGmKbsEmQgY" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission - Sant Shri Sevalal Maharaj Framing */}
      <section className="py-section-gap relative z-10 reveal overflow-hidden">
        <img src="/images/tribal_1.png" className="absolute top-1/2 -translate-y-1/2 left-[-150px] w-[550px] h-[550px] opacity-[0.35] mix-blend-multiply pointer-events-none object-contain z-20 animate-spin-vertical-centered" alt="" />
        <div className="max-w-container mx-auto px-gutter relative z-10">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Vision Card */}
            <div className="glass-panel p-10 rounded-3xl border border-white/40 shadow-sm hover:scale-[1.01] transition-transform duration-300 flex flex-col items-start">
              <div className="w-12 h-12 clay-card-colored flex items-center justify-center mb-6 text-primary shadow-inner">
                <span className="material-symbols-outlined text-2xl font-bold">visibility</span>
              </div>
              <h3 className="font-headline-lg text-2xl font-extrabold mb-4 text-primary tracking-tight">Our Vision</h3>
              <p className="font-body-md text-on-surface-variant leading-relaxed font-light">
                To promote the ideals, teachings, and timeless message of <strong className="font-bold text-primary">Sant Shri Sevalal Maharaj</strong> by empowering tribal communities and society through education, social justice, sustainable livelihoods, environmental conservation, healthcare, and selfless service, building an inclusive, compassionate, and self-reliant nation.
              </p>
            </div>

            {/* Mission Card */}
            <div className="glass-panel p-10 rounded-3xl border border-white/40 shadow-sm hover:scale-[1.01] transition-transform duration-300 flex flex-col items-start">
              <div className="w-12 h-12 clay-card-colored flex items-center justify-center mb-6 text-primary shadow-inner">
                <span className="material-symbols-outlined text-2xl font-bold">track_changes</span>
              </div>
              <h3 className="font-headline-lg text-2xl font-extrabold mb-4 text-primary tracking-tight">Our Mission</h3>
              <p className="font-body-md text-on-surface-variant leading-relaxed font-light">
                To preserve and spread the philosophy of <strong className="font-bold text-primary">Sant Shri Sevalal Maharaj</strong> through impactful community development programmes. Kesula Charitable Trust is committed to improving the lives of tribal and marginalized communities by providing quality education, skill development, healthcare, environmental protection, women and youth empowerment, rural development, and humanitarian services while promoting equality, unity, and sustainable progress.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Profile Section - Refined minimal layout */}
      <section className="py-section-gap relative z-10 reveal overflow-hidden">
        <img src="/images/tribal_3.png" className="absolute top-1/2 -translate-y-1/2 right-[-150px] w-[550px] h-[550px] opacity-[0.35] mix-blend-multiply pointer-events-none object-contain z-20 animate-spin-vertical-centered" alt="" />
        <div className="max-w-container mx-auto px-gutter relative z-10">
          <div className="text-center mb-16">
            <span className="text-primary font-bold text-xs uppercase tracking-[0.2em] block mb-3">Our Leadership</span>
            <h2 className="font-headline-lg text-3xl md:text-headline-lg text-on-surface">Founder &amp; Managing Trustee</h2>
          </div>

          <div className="glass-panel border border-white/40 rounded-3xl p-8 md:p-12 grid md:grid-cols-12 gap-12 items-center max-w-5xl mx-auto shadow-sm">
            <div className="md:col-span-4 flex flex-col items-center">
              <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-white shadow-md mb-6 p-1 bg-white/40 backdrop-blur-md">
                <img className="w-full h-full object-cover rounded-full" alt="Founder Manzeelal Dharavath"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB72WIaWrJI76th6mrzTvf1_1giOAZhXQ-Djgbbcd-xYDlkwXN47lseP_FJInUf39XgXA0yqzaQSN4agVgGxm_gN5ZNeOY1dB5SiSvYcTN7AVuZuK78yMB2FElY1DaACvmTX_Noy7HoEAR3Dpn5WMak-WAK8sgql-NqNzG9pGqBPxQGcvrCqFNpN_FFwQirKLYkyC2LFtncR_wrVWuu6MpJEn5oJ16mAJ4mKyFiI-ALSRqrTf5HwZJDDgj1s0qJ2BfVAvPJO_SUugA" />
              </div>
              <h3 className="font-headline-md text-xl font-bold text-on-surface text-center tracking-tight">Manzeelal Dharavath</h3>
              <p className="text-[8px] text-secondary font-bold uppercase tracking-widest text-center mt-2.5">Founder &amp; Managing Trustee</p>
            </div>
            <div className="md:col-span-8">
              <h4 className="font-headline-md text-lg font-bold text-primary mb-4">Founder's Vision</h4>
              <p className="font-body-md text-on-surface-variant leading-relaxed mb-8 italic font-light">
                "Manzeelal Dharavath is a social entrepreneur and the Founder & Managing Trustee of Kesula Charitable Trust. He is committed to creating sustainable social impact by empowering tribal, rural, and underserved communities. His work focuses on education, healthcare, livelihood generation, entrepreneurship, environmental conservation, women and youth empowerment, disability inclusion, and animal welfare. Through innovative community-based initiatives and strategic partnerships, he strives to build self-reliant communities and promote inclusive, long-term development across society."
              </p>
              <div className="border-t border-secondary/10 pt-6">
                <h5 className="font-label-md text-xs uppercase tracking-widest text-primary font-bold mb-4">Key Focus Areas</h5>
                <div className="flex flex-wrap gap-2.5">
                  {focusAreas.map((area, idx) => (
                    <span key={idx} className="clay-badge-colored px-3.5 py-1.5 text-xs font-semibold text-on-surface-variant transition-all hover:bg-white cursor-default">
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
