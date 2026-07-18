import React, { memo } from 'react';

const StatisticsCards = function({ stats }) {
  const statCards = [
    { label: 'Total Events', value: stats.eventsCount, icon: 'event_available', color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Upcoming', value: stats.upcomingEvents, icon: 'schedule', color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { label: 'New Members', value: stats.newMembers, icon: 'person_add', color: 'text-green-500', bg: 'bg-green-500/10' },
    { label: 'Enquiries', value: stats.newContacts, icon: 'mark_email_unread', color: 'text-purple-500', bg: 'bg-purple-500/10' }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
      {statCards.map((stat, index) => (
        <div key={index} className="glass-panel border-white/40 p-6 rounded-[2rem] flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-all group">
          <div className={`w-14 h-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
            <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>{stat.icon}</span>
          </div>
          <div className="text-4xl font-black text-on-surface tracking-tight mb-1">{stat.value}</div>
          <div className="text-sm font-bold text-on-surface-variant uppercase tracking-wider">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}


export default memo(StatisticsCards);