import React, { memo } from 'react';

const EventTable = function({ events, openEditEventForm, handleDeleteEvent }) {
  return (
    <div className="glass-panel border border-white/40 rounded-3xl overflow-x-auto shadow-sm">
      <table className="w-full text-left border-collapse text-sm">
        <thead className="bg-primary/5 border-b border-secondary/10 uppercase font-bold text-on-surface-variant text-sm tracking-wider">
          <tr>
            <th className="p-4">Title</th>
            <th className="p-4">Category</th>
            <th className="p-4">Date</th>
            <th className="p-4">Status</th>
            <th className="p-4">Crowdfunding</th>
            <th className="p-4">Featured</th>
            <th className="p-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-secondary/10">
          {events.length === 0 ? (
            <tr>
              <td colSpan="7" className="p-8 text-center text-on-surface-variant italic">No events found in database.</td>
            </tr>
          ) : (
            events.map((e) => (
              <tr key={e.id} className="hover:bg-primary/5 transition-all">
                <td className="p-4 font-semibold">
                  <div>{e.title}</div>
                  {e.is_active_banner && (
                    <span className="inline-block mt-1 px-2 py-0.5 rounded bg-orange-100 border border-orange-300 text-[#8a3004] text-[10px] font-extrabold uppercase">
                      Home Banner Active
                    </span>
                  )}
                </td>
                <td className="p-4 opacity-75">{e.category}</td>
                <td className="p-4 opacity-75">{e.date || 'No date'}</td>
                <td className="p-4">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${e.status === 'upcoming' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-secondary/10 text-secondary'}`}>
                    {e.status}
                  </span>
                </td>
                <td className="p-4">
                  {e.is_crowdfunding ? (
                    <div className="text-xs">
                      <span className="font-bold text-[#8a3004]">
                        ₹{(e.collected_amount || 0).toLocaleString('en-IN')}
                      </span>
                      <span className="text-slate-400"> / ₹{(e.target_amount || 0).toLocaleString('en-IN')}</span>
                      <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1 border border-slate-200">
                        <div
                          className="h-full bg-gradient-to-r from-[#8a3004] to-[#c5621a]"
                          style={{ width: `${Math.min(100, Math.round(((e.collected_amount || 0) / (e.target_amount || 1)) * 100))}%` }}
                        ></div>
                      </div>
                    </div>
                  ) : (
                    <span className="opacity-30">—</span>
                  )}
                </td>
                <td className="p-4">
                  {e.featured === 1 || e.featured === true ? (
                    <span className="material-symbols-outlined text-yellow-500 text-base" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  ) : (
                    <span className="opacity-30">—</span>
                  )}
                </td>
                <td className="p-4 text-right space-x-3">
                  <button onClick={() => openEditEventForm(e)} className="text-primary hover:underline font-bold">Edit</button>
                  <button onClick={() => handleDeleteEvent(e.id)} className="text-error hover:underline font-bold">Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}


export default memo(EventTable);