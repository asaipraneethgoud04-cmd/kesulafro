import React, { useState, useEffect } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { supabase } from '../lib/supabase';
import TiltCard from '../components/ui/TiltCard';

export default function Activities() {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [expandedCategory, setExpandedCategory] = useState(null);

  useScrollReveal(allEvents);

  useEffect(() => {
    // Fetch upcoming events for the top strip
    supabase.from('events')
      .select('*')
      .eq('status', 'upcoming')
      .order('date', { ascending: false })
      .order('createdAt', { ascending: false })
      .then(({ data, error }) => {
        if (error) console.error('Error fetching upcoming events:', error);
        else setUpcomingEvents(data);
      });

    // Fetch all events to filter by category
    supabase.from('events')
      .select('*')
      .order('date', { ascending: false })
      .order('createdAt', { ascending: false })
      .then(({ data, error }) => {
        if (error) console.error('Error fetching all events:', error);
        else setAllEvents(data);
      });
  }, []);

  const categories = [
    {
      id: 'education',
      name: 'Education & Skill Development',
      icon: 'school',
      description: 'Opening doors to modern, quality education for tribal youth while integrating indigenous wisdom and cultural roots. We support children with essential school supplies, learning aids, and digital literacy tools.',
      thematicAreas: ['Literacy and Education', 'Vocational and Skill Development Training', 'Life Skills & Soft Skills Training for Beggars']
    },
    {
      id: 'healthcare',
      name: 'Healthcare & Wellness',
      icon: 'medication',
      description: 'Bringing vital medical support, checkup camps, and wellness initiatives directly to remote tribal hamlets. We conduct health awareness drives, family planning guidance, elderly care, and drug de-addiction campaigns.',
      thematicAreas: ['Health Care', 'Family Planning and Reproductive Health', 'Old Age Home and Elderly Care', 'Drug De-Addiction and Awareness Campaigns']
    },
    {
      id: 'livelihood',
      name: 'Livelihood & Rural Development',
      icon: 'engineering',
      description: 'Creating economic resilience through vocational training, micro-enterprises, and distribution programs. We help develop local handicraft hubs to ensure sustainable income generation and self-reliance.',
      thematicAreas: ['Livelihood Enhancement', 'Handicraft Development Programs', 'Distribution Programs']
    },
    {
      id: 'empowerment',
      name: 'Women, Youth & Disability Empowerment',
      icon: 'diversity_3',
      description: 'Building self-reliance and defending human rights by organizing women into Self-Help Groups (SHGs) and offering vocational training. We provide legal aid and welfare programs for youth and physically disabled individuals.',
      thematicAreas: ['Handicapped Welfare Program', 'Advocacy and Human Rights', 'Legal Aid and Support Services']
    },
    {
      id: 'environment',
      name: 'Environment & Sustainability',
      icon: 'eco',
      description: 'Protecting the environment and securing vital resources in tribal areas through massive tree plantation drives, reforestation campaigns, water conservation, sanitation upgrades, and road safety education.',
      thematicAreas: ['Environment Conservation', 'Tree Plantation Drives', 'Water, Sanitation and Hygiene', 'Road Safety Awareness Programs']
    },
    {
      id: 'culture',
      name: 'Culture, Community & Animal Welfare',
      icon: 'brush',
      description: 'Preserving, documenting, and celebrating the unique heritage, music, and ritual art of the tribal communities (including Teej and Sevalal Maharaj festivals) while promoting animal care and welfare.',
      thematicAreas: ['Cultural & Traditional Festival Celebrations', 'Animal Welfare']
    }
  ];

  const toggleCategory = (catName) => {
    if (expandedCategory === catName) {
      setExpandedCategory(null);
    } else {
      setExpandedCategory(catName);
    }
  };

  return (
    <div className="relative overflow-hidden bg-background text-on-surface min-h-screen">
      {/* Background glow blobs */}
      <div className="absolute top-[5%] right-[-10%] w-[45vw] h-[45vw] rounded-full blur-[130px] opacity-10 bg-primary pointer-events-none z-0 animate-float"></div>
      <div className="absolute bottom-[20%] left-[-10%] w-[50vw] h-[50vw] rounded-full blur-[140px] opacity-[0.06] bg-secondary pointer-events-none z-0 animate-float-delayed"></div>

      {/* Page Header */}
      <section className="relative min-h-[400px] flex items-center justify-center pt-32 pb-20 md:pt-48 md:pb-24 z-10 reveal overflow-hidden bg-cover bg-center bg-fixed" style={{ backgroundImage: "url('/images/nature_bg.png')" }}>
        <div className="absolute inset-0 bg-black/60 z-0 pointer-events-none"></div>
        <div className="max-w-container mx-auto px-gutter text-center relative z-10 w-full">
          <span className="text-white font-extrabold text-xs uppercase tracking-[0.2em] block mb-3 text-shadow-md">Our Work</span>
          <h1 className="font-display-lg text-4xl sm:text-5xl md:text-display-lg text-white font-extrabold tracking-tight text-shadow-lg mb-6">Programs &amp; Initiatives</h1>
          <p className="text-white/95 max-w-xl mx-auto mt-3 text-lg font-medium text-shadow-md leading-relaxed">
            Bridging tribal traditions with modern opportunities through target-driven developmental focus.
          </p>
        </div>
      </section>

      {/* 1. Upcoming Events Strip at Top */}
      {upcomingEvents.length > 0 && (
        <section id="events" className="max-w-container mx-auto px-4 mt-16 mb-12 relative z-10 reveal">
          <div className="glass-panel border border-white/40 p-6 md:p-8 rounded-3xl shadow-sm">
            <div className="flex items-center gap-2.5 mb-6">
              <span className="material-symbols-outlined text-primary text-2xl font-bold">event</span>
              <h2 className="font-bold text-lg uppercase tracking-wider text-primary">Upcoming Scheduled Events</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map(event => (
                <div key={event.id} className="glass-panel border border-white/50 p-5 rounded-2xl shadow-sm flex flex-col justify-between hover:scale-[1.01] transition-transform duration-300">
                  <div>
                    <span className="clay-badge-colored text-primary text-sm font-bold uppercase px-2.5 py-1">{event.category}</span>
                    <h3 className="font-headline-md text-xl font-bold mt-4 mb-2 leading-snug">{event.title}</h3>
                    <p className="text-base text-on-surface-variant flex items-center gap-1 mb-1 font-semibold">
                      <span className="material-symbols-outlined text-lg text-primary">calendar_today</span> {event.date}
                    </p>
                    <p className="text-base text-on-surface-variant flex items-center gap-1 mb-3.5 font-semibold">
                      <span className="material-symbols-outlined text-lg text-primary">location_on</span> {event.location}
                    </p>
                    <p className="text-lg text-on-surface-variant line-clamp-2 leading-relaxed font-light">{event.description}</p>
                  </div>
                  <div className="mt-5 border-t border-secondary/10 pt-3 flex justify-between items-center">
                    <span className="text-sm font-bold text-secondary">Tags: {event.tags || 'General'}</span>
                    <button className="clay-btn clay-btn-primary px-4 py-1.5 text-sm uppercase tracking-wider">
                      Register
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 2. Category Sections with Interactive Event Listing */}
      <section className="py-12 relative z-10 reveal overflow-hidden">
        <img src="/images/tribal_1.png" className="absolute top-[25%] -translate-y-1/2 right-[-150px] w-[550px] h-[550px] opacity-[0.35] mix-blend-multiply pointer-events-none object-contain z-0 animate-spin-vertical-centered" alt="" />
        <img src="/images/tribal_2.png" className="absolute bottom-[20%] left-[-150px] w-[550px] h-[550px] opacity-[0.35] mix-blend-multiply pointer-events-none object-contain z-0 animate-spin-clockwise" alt="" />
        <div className="max-w-container mx-auto px-gutter relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {categories.map((cat, index) => {
              const catEvents = allEvents.filter(e => e.category === cat.name);
              const isExpanded = expandedCategory === cat.name;

              return (
                <div
                  key={cat.id}
                  className={`glass-panel border border-white/40 rounded-3xl p-6 transition-all duration-300 shadow-sm flex flex-col justify-between ${isExpanded ? 'border-primary/30 md:col-span-2 shadow-md' : 'hover:border-primary/20'} reveal-${index % 2 === 0 ? 'left' : 'right'}`}
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start gap-4 mb-5">
                      <div className="w-12 h-12 clay-card-colored flex items-center justify-center text-primary shadow-inner">
                        <span className="material-symbols-outlined text-2xl font-bold">{cat.icon}</span>
                      </div>
                      <div>
                        <h2 className="font-headline-md text-2xl font-bold text-on-surface leading-tight">{cat.name}</h2>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {cat.thematicAreas.slice(0, 2).map((tag, i) => (
                            <span key={i} className="clay-badge px-2 py-0.5 text-sm font-bold uppercase text-secondary">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <p className="font-body-md text-on-surface-variant text-xl leading-relaxed mb-6 font-light">
                      {cat.description}
                    </p>
                  </div>

                  {/* Actions & Events Panel */}
                  <div>
                    <div className="flex items-center justify-between border-t border-secondary/10 pt-4 mt-2">
                      <span className="text-base text-on-surface-variant font-bold uppercase tracking-wider">
                        {catEvents.length} Event{catEvents.length !== 1 ? 's' : ''} Listed
                      </span>
                      <button
                        onClick={() => toggleCategory(cat.name)}
                        className="text-primary font-bold text-base flex items-center gap-1 hover:underline focus:outline-none transition-all"
                      >
                        {isExpanded ? 'Hide Events' : 'View Events'}
                        <span className="material-symbols-outlined text-sm font-bold">
                          {isExpanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
                        </span>
                      </button>
                    </div>

                    {/* Expanded Events Listing */}
                    {isExpanded && (
                      <div className="mt-6 border-t border-secondary/10 pt-6">
                        {catEvents.length === 0 ? (
                          <p className="text-lg text-on-surface-variant italic text-center py-4 bg-white/40 rounded-2xl border border-secondary/5 font-light">
                            No event reports or upcoming programs listed in this category yet.
                          </p>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {catEvents.map(event => (
                              <div key={event.id} className="glass-panel border border-white/50 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between bg-white/20">
                                {/* Image if available */}
                                {event.imageUrl && (
                                  <div className="h-40 overflow-hidden bg-black/5 rounded-t-2xl p-1">
                                    <img className="w-full h-full object-cover rounded-xl grayscale hover:grayscale-0 transition-all duration-300" src={event.imageUrl} alt={event.title} />
                                  </div>
                                )}
                                <div className="p-5 flex-grow flex flex-col justify-between">
                                  <div>
                                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-sm font-bold uppercase ${event.status === 'upcoming' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-secondary/10 text-secondary'}`}>
                                      {event.status}
                                    </span>
                                    <h4 className="font-headline-md text-xl font-bold mt-3 mb-2 leading-snug">{event.title}</h4>
                                    
                                    <p className="text-sm text-on-surface-variant flex items-center gap-1 mb-0.5 font-semibold">
                                      <span className="material-symbols-outlined text-base text-primary">calendar_today</span> {event.date || 'No Date'}
                                    </p>
                                    <p className="text-sm text-on-surface-variant flex items-center gap-1 mb-3.5 font-semibold">
                                      <span className="material-symbols-outlined text-base text-primary">location_on</span> {event.location || 'Telangana'}
                                    </p>
                                    <p className="text-lg text-on-surface-variant leading-relaxed mb-4 line-clamp-3 font-light">{event.description}</p>
                                  </div>
                                  <div className="border-t border-secondary/10 pt-2 flex justify-between items-center text-sm font-bold text-secondary">
                                    <span>Tags: {event.tags || 'None'}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
