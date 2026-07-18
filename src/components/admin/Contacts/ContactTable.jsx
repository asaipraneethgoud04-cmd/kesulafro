import React, { memo } from 'react';

const ContactTable = function({ contacts, filteredContacts, contactFilter, setContactFilter, setSelectedSub }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <h1 className="font-headline-lg text-2xl font-bold text-primary tracking-tight">Enquiries Inbox</h1>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {['all', 'general', 'donate', 'volunteer'].map((filter) => (
            <button
              key={filter}
              onClick={() => setContactFilter(filter)}
              className={`px-3.5 py-1.5 transition-all text-sm uppercase tracking-wider focus:outline-none ${contactFilter === filter ? 'clay-badge-active text-primary shadow-sm font-bold' : 'clay-badge text-on-surface-variant/80 hover:bg-white'}`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="glass-panel border border-white/40 rounded-3xl overflow-x-auto shadow-sm">
        <table className="w-full text-left border-collapse text-sm">
          <thead className="bg-primary/5 border-b border-secondary/10 uppercase font-bold text-on-surface-variant text-sm tracking-wider">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Phone</th>
              <th className="p-4">Type</th>
              <th className="p-4">Submitted Date</th>
              <th className="p-4 text-right">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-secondary/10">
            {filteredContacts.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-on-surface-variant italic">No enquiries found in this category.</td>
              </tr>
            ) : (
              filteredContacts.map((c) => (
                <tr key={c.id} className="hover:bg-primary/5 transition-all">
                  <td className="p-4 font-semibold">{c.name}</td>
                  <td className="p-4 opacity-75">{c.email}</td>
                  <td className="p-4 opacity-75">{c.phone || '—'}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${c.subject === 'donate' ? 'bg-orange-50 border border-orange-200 text-orange-700' : 'bg-secondary/10 text-secondary'}`}>
                      {c.subject.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4 opacity-60">{c.submittedAt ? c.submittedAt.split('T')[0] : '—'}</td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => setSelectedSub({ ...c, type: 'contact' })}
                      className="text-primary hover:underline font-bold"
                    >
                      Open View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}


export default memo(ContactTable);