import React, { memo } from 'react';

const StatisticsCards = function({ stats }) {
  const statCards = [
    { 
      label: 'Total Events', 
      value: stats.eventsCount || 0, 
      faIcon: 'fa-solid fa-calendar-check',
      color: 'text-[#8a3004]', 
      bg: 'bg-orange-100/90 border border-orange-200' 
    },
    { 
      label: 'Upcoming Events', 
      value: stats.upcomingEvents || 0, 
      faIcon: 'fa-solid fa-clock',
      color: 'text-amber-700', 
      bg: 'bg-amber-100/90 border border-amber-200' 
    },
    { 
      label: 'New Members', 
      value: stats.newMembers || 0, 
      faIcon: 'fa-solid fa-user-plus',
      color: 'text-emerald-700', 
      bg: 'bg-emerald-100/90 border border-emerald-200' 
    },
    { 
      label: 'Total Enquiries', 
      value: stats.newContacts || 0, 
      faIcon: 'fa-solid fa-envelope-open-text',
      color: 'text-purple-700', 
      bg: 'bg-purple-100/90 border border-purple-200' 
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
      {statCards.map((stat, index) => (
        <div key={index} className="bg-white/90 backdrop-blur-xl border border-slate-200/80 p-6 rounded-[2rem] flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-all group">
          <div className={`w-14 h-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-3.5 group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
            <i className={`${stat.faIcon} text-2xl`}></i>
          </div>
          <div className="text-4xl font-black text-slate-900 tracking-tight mb-1 font-sans">{stat.value}</div>
          <div className="text-xs font-extrabold text-slate-600 uppercase tracking-widest">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}

export default memo(StatisticsCards);