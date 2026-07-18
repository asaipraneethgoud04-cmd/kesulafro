import React, { memo } from 'react';

const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'active': return 'bg-green-50 border border-green-200 text-green-700';
    case 'rejected': return 'bg-red-50 border border-red-200 text-red-700';
    case 'contacted': return 'bg-yellow-50 border border-yellow-200 text-yellow-700';
    default: return 'bg-blue-50 border border-blue-200 text-blue-700'; // pending/new
  }
};

const MemberTable = function({ members, setSelectedSub }) {
  return (
    <div className="space-y-6">
      <h1 className="font-headline-lg text-2xl font-bold text-primary tracking-tight">Membership Applications</h1>
      
      <div className="glass-panel border border-white/40 rounded-3xl overflow-x-auto shadow-sm">
        <table className="w-full text-left border-collapse text-sm">
          <thead className="bg-primary/5 border-b border-secondary/10 uppercase font-bold text-on-surface-variant text-sm tracking-wider">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Phone</th>
              <th className="p-4">Area of Interest</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-secondary/10">
            {members.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-on-surface-variant italic">No applications found in database.</td>
              </tr>
            ) : (
              members.map((m) => (
                <tr key={m.id} className="hover:bg-primary/5 transition-all">
                  <td className="p-4 font-semibold">{m.fullName}</td>
                  <td className="p-4 opacity-75">{m.email}</td>
                  <td className="p-4 opacity-75">{m.phone}</td>
                  <td className="p-4 opacity-75">{m.interestArea || 'None selected'}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${getStatusBadgeClass(m.status)}`}>
                      {m.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => setSelectedSub({ ...m, type: 'member' })}
                      className="text-primary hover:underline font-bold"
                    >
                      Open Review
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


export default memo(MemberTable);