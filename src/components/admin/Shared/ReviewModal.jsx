import React from 'react';

const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'active': return 'bg-green-50 border border-green-200 text-green-700';
    case 'rejected': return 'bg-red-50 border border-red-200 text-red-700';
    case 'contacted': return 'bg-yellow-50 border border-yellow-200 text-yellow-700';
    default: return 'bg-blue-50 border border-blue-200 text-blue-700'; // pending/new
  }
};

export default function ReviewModal({ selectedSub, setSelectedSub, handleUpdateMemberStatus }) {
  if (!selectedSub) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-surface border border-secondary/20 max-w-lg w-full rounded-[2rem] p-8 shadow-2xl relative">
        <button onClick={() => setSelectedSub(null)} className="absolute top-6 right-6 bg-secondary/10 hover:bg-secondary/20 text-on-surface w-10 h-10 rounded-full flex items-center justify-center transition-colors focus:outline-none">
          <span className="material-symbols-outlined">close</span>
        </button>

        <div className="flex items-center gap-3 mb-8 border-b border-secondary/10 pb-4">
          <span className="material-symbols-outlined text-primary text-3xl font-bold">folder_shared</span>
          <h3 className="font-sans text-2xl font-extrabold text-on-surface tracking-tight">
            {selectedSub.type === 'member' ? 'Member Application' : 'Enquiry Detail'}
          </h3>
        </div>

        <div className="space-y-6 font-sans">
          <div>
            <div className="text-sm uppercase font-bold text-on-surface-variant/70 tracking-wider mb-1">Submitted By</div>
            <div className="text-xl font-bold text-on-surface">{selectedSub.fullName || selectedSub.name}</div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="text-sm uppercase font-bold text-on-surface-variant/70 tracking-wider mb-1">Email Address</div>
              <div className="font-semibold text-primary text-lg truncate"><a href={`mailto:${selectedSub.email}`}>{selectedSub.email}</a></div>
            </div>
            <div>
              <div className="text-sm uppercase font-bold text-on-surface-variant/70 tracking-wider mb-1">Phone Number</div>
              <div className="font-semibold text-on-surface text-lg">{selectedSub.phone || '—'}</div>
            </div>
          </div>

          {selectedSub.type === 'member' ? (
            <>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-sm uppercase font-bold text-on-surface-variant/70 tracking-wider mb-1">Focus Area</div>
                  <div className="font-bold text-secondary text-base">{selectedSub.interestArea || 'None selected'}</div>
                </div>
                <div>
                  <div className="text-sm uppercase font-bold text-on-surface-variant/70 tracking-wider mb-1">Current Status</div>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-extrabold uppercase mt-1 ${getStatusBadgeClass(selectedSub.status)}`}>
                    {selectedSub.status}
                  </span>
                </div>
              </div>
              <div>
                <div className="text-sm uppercase font-bold text-on-surface-variant/70 tracking-wider mb-1">Full Address</div>
                <div className="text-on-surface-variant text-base leading-relaxed font-medium bg-secondary/5 p-3 rounded-xl">{selectedSub.address || '—'}</div>
              </div>
            </>
          ) : (
            <div>
              <div className="text-sm uppercase font-bold text-on-surface-variant/70 tracking-wider mb-1">Enquiry Topic</div>
              <span className="inline-block bg-secondary/10 text-secondary text-sm font-bold uppercase px-3 py-1 rounded-lg mt-1">
                {selectedSub.subject}
              </span>
            </div>
          )}

          <div>
            <div className="text-sm uppercase font-bold text-on-surface-variant/70 tracking-wider mb-2">Message / Cover Note</div>
            <div className="bg-secondary/5 p-5 rounded-2xl border border-secondary/10 text-on-surface-variant text-base leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap font-medium">
              {selectedSub.message ? `"${selectedSub.message}"` : 'No message provided.'}
            </div>
          </div>

          {/* Workflow actions for Membership Applications */}
          {selectedSub.type === 'member' && (
            <div className="border-t border-secondary/15 pt-6 mt-6">
              <div className="text-sm uppercase font-bold text-on-surface-variant/70 tracking-wider mb-3">Update Application Workflow</div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => handleUpdateMemberStatus(selectedSub.id, 'contacted')}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold bg-yellow-400 text-yellow-950 hover:bg-yellow-500 transition-colors shadow-sm"
                >
                  Set Contacted
                </button>
                <button
                  onClick={() => handleUpdateMemberStatus(selectedSub.id, 'active')}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold bg-green-600 text-white hover:bg-green-700 transition-colors shadow-sm flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[18px]">check_circle</span>
                  Mark Active
                </button>
                <button
                  onClick={() => handleUpdateMemberStatus(selectedSub.id, 'rejected')}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold bg-red-100 text-red-700 hover:bg-red-200 transition-colors ml-auto"
                >
                  Reject
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
