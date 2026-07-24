import React, { useState, useRef } from 'react';

export default function MembershipCardModal({ member, isOpen, onClose }) {
  const [activeSide, setActiveSide] = useState('front'); // 'front' | 'back'
  const cardRef = useRef(null);

  if (!isOpen || !member) return null;

  const memberId = member.id 
    ? `KCT-${String(member.id).slice(0, 8).toUpperCase()}` 
    : `KCT-MEM-${Math.floor(100000 + Math.random() * 900000)}`;

  const memberName = member.fullName || member.full_name || member.name || 'Valued Member';
  const memberEmail = member.email || 'N/A';
  const memberPhone = member.phone || member.phone_number || 'N/A';
  const interest = member.interestArea || member.interest_area || 'Community Empowerment';
  const joinDate = member.createdAt || member.created_at 
    ? new Date(member.createdAt || member.created_at).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
    : new Date().toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });

  const memberAddress = member.address || 'Telangana, India';

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(`https://www.kesulatrust.org/verify-member?id=${memberId}&name=${encodeURIComponent(memberName)}`)}&color=8a3004`;

  const handlePrint = () => {
    const windowUrl = 'about:blank';
    const uniqueName = new Date().getTime();
    const windowName = 'Print' + uniqueName;
    const printWindow = window.open(windowUrl, windowName, 'left=100,top=100,width=950,height=900');

    const frontHtml = `
      <div style="width:285px; height:500px; border-radius:16px; background:linear-gradient(to bottom, #fff7ed, #ffffff, #fef3c7); position:relative; overflow:hidden; display:flex; flex-direction:column; justify-content:space-between; border:1px solid #cbd5e1; box-shadow:0 10px 15px -3px rgba(0,0,0,0.1); font-family:sans-serif;">
        <div style="position:absolute; inset:0; display:flex; align-items:center; justify-content:center; pointer-events:none; opacity:0.15; z-index:0;">
          <img src="/images/logo.webp" style="width:240px; height:240px; object-fit:contain; border-radius:9999px;" />
        </div>
        <div style="width:100%; background-color:#8a3004; padding:10px 14px; color:white; display:flex; align-items:center; justify-content:space-between; position:relative; z-index:10; box-sizing:border-box;">
          <div style="display:flex; align-items:center; gap:8px;">
            <img src="/images/logo.webp" style="width:28px; height:28px; border-radius:9999px; background-color:white; padding:2px;" />
            <div style="text-align:left; line-height:1.2;">
              <div style="font-weight:800; font-size:11px; text-transform:uppercase; letter-spacing:0.05em; color:#fcd34d;">KESULA TRUST</div>
              <div style="font-size:7px; color:#fef3c7; text-transform:uppercase; letter-spacing:0.1em; font-weight:500;">Charitable Foundation</div>
            </div>
          </div>
          <span style="font-size:7.5px; font-weight:800; text-transform:uppercase; letter-spacing:0.1em; padding:2px 8px; border-radius:4px; background-color:rgba(251,191,36,0.2); color:#fde68a; border:1px solid rgba(251,191,36,0.4);">Member Pass</span>
        </div>
        <div style="padding:14px; flex:1; display:flex; flex-direction:column; justify-content:space-between; align-items:center; text-align:center; position:relative; z-index:10; box-sizing:border-box;">
          <div style="display:flex; flex-direction:column; align-items:center; gap:6px; width:100%; margin:auto 0;">
            <div style="position:relative; display:flex; flex-direction:column; align-items:center;">
              <div style="width:112px; height:144px; padding:4px; background:linear-gradient(to top right, #fbbf24, #8a3004, #fde68a); border-radius:16px; box-shadow:0 10px 15px -3px rgba(0,0,0,0.1);">
                <div style="width:100%; height:100%; border-radius:12px; background-color:white; overflow:hidden; position:relative;">
                  ${member.photoUrl || member.photo_url 
                    ? `<img src="${member.photoUrl || member.photo_url}" style="width:100%; height:100%; object-fit:cover;" />`
                    : `<div style="width:100%; height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; background-color:#fff7ed; color:#8a3004;"><span style="font-size:48px;">👤</span></div>`
                  }
                </div>
              </div>
              <div style="margin-top:-10px; z-index:10; display:inline-flex; align-items:center; gap:4px; padding:2px 12px; border-radius:9999px; background-color:#059669; color:white; font-size:7.5px; font-weight:900; text-transform:uppercase; letter-spacing:0.1em; border:1px solid #6ee7b7;">Verified Member</div>
            </div>
            <div style="width:100%; padding-top:4px;">
              <h2 style="font-size:18px; font-weight:900; color:#0f172a; letter-spacing:-0.025em; text-transform:uppercase; margin:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${memberName}</h2>
              <div style="margin-top:4px; display:inline-block; padding:2px 14px; border-radius:9999px; background:linear-gradient(to right, #4a1802, #8a3004, #4a1802); color:#fcd34d; font-size:8.5px; font-weight:800; text-transform:uppercase; letter-spacing:0.1em; border:1px solid rgba(251,191,36,0.3);">${interest}</div>
            </div>
          </div>
          <div style="width:100%; background-color:rgba(255,255,255,0.95); border:2px solid rgba(253,230,138,0.8); border-top:4px solid #8a3004; border-radius:12px; padding:10px; text-align:left; font-size:9px; font-weight:500; box-shadow:0 4px 6px -1px rgba(0,0,0,0.05); box-sizing:border-box;">
            <div style="display:flex; justify-content:space-between; align-items:center; padding-bottom:4px; border-bottom:1px solid #fef3c7;">
              <span style="color:#64748b; font-weight:800; text-transform:uppercase; font-size:7.5px; letter-spacing:0.05em;">MEMBER ID</span>
              <span style="font-weight:900; color:#8a3004; font-family:monospace; font-size:9px; background-color:#fff7ed; padding:2px 8px; border-radius:4px; border:1px solid #fde68a;">${memberId}</span>
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center; padding-bottom:4px; border-bottom:1px solid #fef3c7;">
              <span style="color:#64748b; font-weight:800; text-transform:uppercase; font-size:7.5px; letter-spacing:0.05em;">EMAIL</span>
              <span style="font-weight:600; color:#1e293b; font-size:8.5px; overflow:hidden; text-overflow:ellipsis; max-width:145px; white-space:nowrap;">${memberEmail}</span>
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center; padding-bottom:4px; border-bottom:1px solid #fef3c7;">
              <span style="color:#64748b; font-weight:800; text-transform:uppercase; font-size:7.5px; letter-spacing:0.05em;">PHONE</span>
              <span style="font-weight:600; color:#1e293b; font-size:8.5px;">${memberPhone}</span>
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span style="color:#64748b; font-weight:800; text-transform:uppercase; font-size:7.5px; letter-spacing:0.05em;">ISSUED ON</span>
              <span style="font-weight:600; color:#1e293b; font-size:8.5px;">${joinDate}</span>
            </div>
          </div>
        </div>
        <div style="width:100%; background:linear-gradient(to right, #4a1802, #8a3004, #4a1802); color:#fde68a; display:flex; align-items:center; justify-content:space-between; padding:6px 14px; font-size:8px; font-weight:800; letter-spacing:0.05em; border-top:1px solid rgba(251,191,36,0.4); position:relative; z-index:10; box-sizing:border-box;">
          <span style="color:#fcd34d;">VERIFIED IDENTITY</span>
          <span style="color:rgba(254,243,199,0.9); font-family:monospace; text-transform:lowercase; font-size:7.5px;">www.kesulatrust.org</span>
        </div>
      </div>
    `;

    const backHtml = `
      <div style="width:285px; height:500px; border-radius:16px; background:linear-gradient(to bottom, #fff7ed, #ffffff, #fff7ed); position:relative; overflow:hidden; display:flex; flex-direction:column; justify-content:space-between; border:1px solid #cbd5e1; box-shadow:0 10px 15px -3px rgba(0,0,0,0.1); font-family:sans-serif;">
        <div style="position:absolute; inset:0; display:flex; align-items:center; justify-content:center; pointer-events:none; opacity:0.15; z-index:0;">
          <img src="/images/logo.webp" style="width:240px; height:240px; object-fit:contain; border-radius:9999px;" />
        </div>
        <div style="width:100%; background-color:#8a3004; padding:10px 14px; color:white; display:flex; align-items:center; justify-content:space-between; position:relative; z-index:10; box-sizing:border-box;">
          <div style="display:flex; align-items:center; gap:8px;">
            <img src="/images/logo.webp" style="width:28px; height:28px; border-radius:9999px; background-color:white; padding:2px;" />
            <div style="text-align:left; line-height:1.2;">
              <div style="font-weight:800; font-size:11px; text-transform:uppercase; letter-spacing:0.05em; color:#fcd34d;">KESULA TRUST</div>
              <div style="font-size:7px; color:#fef3c7; text-transform:uppercase; letter-spacing:0.1em; font-weight:500;">Verification Pass</div>
            </div>
          </div>
          <span style="font-size:7.5px; font-weight:800; text-transform:uppercase; letter-spacing:0.1em; padding:2px 8px; border-radius:4px; background-color:rgba(251,191,36,0.2); color:#fde68a; border:1px solid rgba(251,191,36,0.4);">Official</span>
        </div>
        <div style="padding:14px; flex:1; display:flex; flex-direction:column; justify-content:space-between; align-items:center; text-align:center; position:relative; z-index:10; box-sizing:border-box;">
          <div style="width:100%; background-color:rgba(255,255,255,0.95); border:1px solid #fde68a; border-radius:12px; padding:12px; display:flex; flex-direction:column; align-items:center; margin:auto 0; box-shadow:0 1px 2px 0 rgba(0,0,0,0.05); box-sizing:border-box;">
            <div style="padding:6px; background-color:white; border:2px solid rgba(138,48,4,0.3); border-radius:12px;">
              <img src="${qrUrl}" style="width:96px; height:96px; object-fit:contain; border-radius:6px;" />
            </div>
            <p style="margin-top:8px; font-size:8.5px; color:#8a3004; font-weight:900; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:0;">Scan to Verify Membership</p>
          </div>
          <div style="width:100%; background-color:rgba(254,243,199,0.8); border:1px solid rgba(253,230,138,0.9); border-radius:12px; padding:10px; text-align:left; font-size:8px; color:#334155; margin:auto 0; box-sizing:border-box;">
            <h4 style="font-weight:800; color:#8a3004; text-transform:uppercase; letter-spacing:0.05em; font-size:8.5px; padding-bottom:2px; border-bottom:1px solid #fde68a; margin:0 0 4px 0;">Terms & Guidelines</h4>
            <p style="margin:0 0 2px 0; line-height:1.2;">• Certifies official volunteer status with Kesula Charitable Trust.</p>
            <p style="margin:0 0 2px 0; line-height:1.2;">• Property of Kesula Trust. Non-transferable identity pass.</p>
            <p style="margin:0; line-height:1.2;">• If found, please return to Head Office or contact us.</p>
          </div>
          <div style="width:100%; padding-top:4px; display:flex; justify-content:space-between; align-items:flex-end; border-top:1px solid #e2e8f0; text-align:left; background-color:rgba(255,255,255,0.6); padding:4px; border-radius:8px; box-sizing:border-box;">
            <div style="font-size:7.5px; color:#64748b; line-height:1.2;">
              <p style="font-weight:700; color:#334155; margin:0;">Head Office: Telangana, India</p>
              <p style="margin:0;">Contact: info@kesulatrust.org</p>
              <p style="color:#8a3004; font-weight:700; margin:0;">www.kesulatrust.org</p>
            </div>
            <div style="text-align:right;">
              <div style="font-family:serif; font-style:italic; font-size:12px; font-weight:900; color:#8a3004;">Praneeth Goud</div>
              <p style="font-size:6.5px; font-weight:800; text-transform:uppercase; color:#64748b; margin:0;">Authorized Trustee</p>
            </div>
          </div>
        </div>
        <div style="width:100%; background-color:#8a3004; color:#fde68a; font-size:7.5px; font-weight:800; text-transform:uppercase; letter-spacing:0.1em; text-align:center; padding:6px 0; border-top:1px solid rgba(251,191,36,0.3); position:relative; z-index:10; box-sizing:border-box;">
          Official Volunteer Identity Pass • Non-Transferable
        </div>
      </div>
    `;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Membership ID Card - ${memberName}</title>
          <style>
            @media print {
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            }
            body { font-family: sans-serif; background-color: #f3f4f6; margin: 0; padding: 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; }
            .card-grid { display: flex; flex-wrap: wrap; gap: 30px; justify-content: center; align-items: center; }
            .card-wrapper { display: flex; flex-direction: column; align-items: center; }
            .card-label { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: #475569; margin-bottom: 8px; }
          </style>
        </head>
        <body>
          <div class="card-grid">
            <div class="card-wrapper">
              <div class="card-label">Front Side</div>
              ${frontHtml}
            </div>
            <div class="card-wrapper">
              <div class="card-label">Back Side</div>
              ${backHtml}
            </div>
          </div>
          <script>
            setTimeout(() => { window.print(); window.close(); }, 600);
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md fade-in overflow-y-auto">
      <div className="bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border border-amber-500/30 rounded-3xl p-4 sm:p-6 max-w-md w-full shadow-2xl relative text-white flex flex-col items-center max-h-[95vh] overflow-y-auto scrollbar-thin">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-all z-20"
        >
          <span className="material-symbols-outlined text-lg">close</span>
        </button>

        {/* Header */}
        <div className="text-center mb-3">
          <span className="bg-amber-500/20 text-amber-400 text-[9.5px] font-extrabold uppercase tracking-widest px-3 py-0.5 rounded-full border border-amber-500/30">
            Official Digital ID Card
          </span>
          <h2 className="text-lg sm:text-xl font-black text-white mt-1 tracking-tight">
            Kesula Member Card
          </h2>
        </div>

        {/* Side Selector Tabs */}
        <div className="flex items-center gap-2 mb-3 bg-white/5 p-1 rounded-xl border border-white/10">
          <button
            onClick={() => setActiveSide('front')}
            className={`px-4 py-1 rounded-lg text-xs font-bold transition-all ${activeSide === 'front' ? 'bg-[#8a3004] text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            Front Side
          </button>
          <button
            onClick={() => setActiveSide('back')}
            className={`px-4 py-1 rounded-lg text-xs font-bold transition-all ${activeSide === 'back' ? 'bg-[#8a3004] text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            Back Side
          </button>
        </div>

        {/* ID CARD CONTAINER */}
        <div ref={cardRef} className="w-[285px] sm:w-[295px] h-[500px] rounded-2xl bg-white text-slate-900 shadow-2xl relative overflow-hidden flex flex-col border border-slate-300 select-none font-sans shrink-0">
          
          {activeSide === 'front' ? (
            /* FRONT SIDE OF ID CARD (Rich Layered Official Pass Structure) */
            <div className="w-full h-full flex flex-col justify-between relative bg-gradient-to-b from-orange-50/80 via-white to-amber-50/60 overflow-hidden">
              
              {/* Layer 1: Background Visible Watermark Logo */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-15 z-0">
                <img src="/images/logo.webp" alt="" className="w-60 h-60 object-contain rounded-full" />
              </div>

              {/* Executive Brand Top Banner */}
              <div className="w-full bg-[#8a3004] px-3.5 py-2.5 text-white flex items-center justify-between shadow-md relative z-10 shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full p-0.5 bg-white/90 shadow-sm shrink-0">
                    <img src="/images/logo.webp" alt="Logo" className="w-full h-full rounded-full object-cover" />
                  </div>
                  <div className="text-left leading-tight">
                    <h3 className="font-extrabold text-[11px] uppercase tracking-wider text-amber-300">KESULA TRUST</h3>
                    <p className="text-[7px] text-amber-100/90 uppercase tracking-widest font-medium">Charitable Foundation</p>
                  </div>
                </div>
                <span className="text-[7.5px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded bg-amber-400/20 text-amber-200 border border-amber-400/40">
                  Member Pass
                </span>
              </div>

              {/* Layer 2: Decorative Curved Wave Accent */}
              <div className="w-full h-3 bg-gradient-to-b from-[#8a3004] to-transparent opacity-15 relative z-10 shrink-0"></div>

              {/* Main Content Area */}
              <div className="p-3.5 flex-1 flex flex-col justify-between items-center text-center relative z-10">
                
                {/* Member Portrait Photo & Name Header Block */}
                <div className="flex flex-col items-center space-y-1.5 w-full my-auto">
                  
                  {/* Layered Gold & Terracotta Photo Frame */}
                  <div className="relative flex flex-col items-center">
                    <div className="w-28 h-36 p-1 bg-gradient-to-tr from-amber-400 via-[#8a3004] to-amber-200 rounded-2xl shadow-lg ring-4 ring-amber-100/80">
                      <div className="w-full h-full rounded-xl bg-white border border-amber-200 overflow-hidden relative">
                        {member.photoUrl || member.photo_url ? (
                          <img src={member.photoUrl || member.photo_url} alt={memberName} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-amber-50/60 text-[#8a3004]">
                            <span className="material-symbols-outlined text-5xl opacity-80">person</span>
                          </div>
                        )}
                      </div>
                    </div>
                    {/* Layered Status Badge */}
                    <div className="-mt-2.5 z-10 inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-emerald-600 text-white text-[7.5px] font-black uppercase tracking-widest shadow-md border border-emerald-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                      Verified Member
                    </div>
                  </div>

                  {/* Member Name & Layered Designation Pill */}
                  <div className="w-full pt-1">
                    <h2 className="text-lg font-black text-slate-900 tracking-tight leading-tight uppercase truncate">
                      {memberName}
                    </h2>
                    <div className="mt-1 inline-block px-3.5 py-0.5 rounded-full bg-gradient-to-r from-[#4a1802] via-[#8a3004] to-[#4a1802] text-amber-300 text-[8.5px] font-extrabold uppercase tracking-widest shadow-xs border border-amber-400/30">
                      {interest}
                    </div>
                  </div>

                </div>

                {/* Layered Key-Value Details Card Table */}
                <div className="w-full bg-white/95 backdrop-blur-sm border-2 border-amber-200/80 rounded-xl p-2.5 text-left text-[9px] space-y-1 font-medium shadow-md mt-auto border-t-4 border-t-[#8a3004]">
                  <div className="flex justify-between items-center pb-0.5 border-b border-amber-100">
                    <span className="text-slate-500 font-extrabold uppercase text-[7.5px] tracking-wider">MEMBER ID</span>
                    <span className="font-black text-[#8a3004] font-mono text-[9px] bg-amber-50 px-2 py-0.5 rounded border border-amber-300">{memberId}</span>
                  </div>
                  <div className="flex justify-between items-center pb-0.5 border-b border-amber-100">
                    <span className="text-slate-500 font-extrabold uppercase text-[7.5px] tracking-wider">EMAIL</span>
                    <span className="font-semibold text-slate-800 truncate max-w-[145px] text-[8.5px]">{memberEmail}</span>
                  </div>
                  <div className="flex justify-between items-center pb-0.5 border-b border-amber-100">
                    <span className="text-slate-500 font-extrabold uppercase text-[7.5px] tracking-wider">PHONE</span>
                    <span className="font-semibold text-slate-800 text-[8.5px]">{memberPhone}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-extrabold uppercase text-[7.5px] tracking-wider">ISSUED ON</span>
                    <span className="font-semibold text-slate-800 text-[8.5px]">{joinDate}</span>
                  </div>
                </div>

              </div>

              {/* Bottom Hologram Security Strip */}
              <div className="w-full bg-gradient-to-r from-[#4a1802] via-[#8a3004] to-[#4a1802] text-amber-200 flex items-center justify-between px-3.5 py-1.5 text-[8px] font-extrabold tracking-wider border-t border-amber-400/40 relative z-10 shrink-0">
                <span className="flex items-center gap-1 text-amber-300">
                  <span className="material-symbols-outlined text-xs">verified</span>
                  VERIFIED IDENTITY
                </span>
                <span className="text-amber-100/90 text-[7.5px] font-mono lowercase">www.kesulatrust.org</span>
              </div>

            </div>
          ) : (
            /* BACK SIDE OF ID CARD (Verification & Security Terms with Watermark) */
            <div className="w-full h-full flex flex-col justify-between relative bg-gradient-to-b from-amber-50/40 via-white to-orange-50/30 overflow-hidden">
              
              {/* Background Watermark Logo Layer */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-15 z-0">
                <img src="/images/logo.webp" alt="" className="w-60 h-60 object-contain rounded-full" />
              </div>

              {/* Executive Top Banner */}
              <div className="w-full bg-[#8a3004] px-3.5 py-2.5 text-white flex items-center justify-between shadow-md relative z-10 shrink-0">
                <div className="flex items-center gap-2">
                  <img src="/images/logo.webp" alt="Logo" className="w-7 h-7 rounded-full bg-white p-0.5 object-cover" />
                  <div className="text-left leading-tight">
                    <h3 className="font-extrabold text-[11px] uppercase tracking-wider text-amber-300">KESULA TRUST</h3>
                    <p className="text-[7px] text-amber-100/90 uppercase tracking-widest font-medium">Verification Pass</p>
                  </div>
                </div>
                <span className="text-[7.5px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded bg-amber-400/20 text-amber-200 border border-amber-400/40">
                  Official
                </span>
              </div>

              {/* Body Content */}
              <div className="p-3.5 flex-1 flex flex-col justify-between items-center text-center relative z-10">
                
                {/* Scannable Verification QR Code Box */}
                <div className="w-full bg-white/95 backdrop-blur-sm border border-amber-200 rounded-xl p-3 shadow-sm flex flex-col items-center my-auto">
                  <div className="p-1.5 bg-white border-2 border-[#8a3004]/30 rounded-xl shadow-xs">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(`https://www.kesulatrust.org/verify-member?id=${memberId}&name=${encodeURIComponent(memberName)}`)}&color=8a3004`} 
                      alt="Scannable Verification QR Code" 
                      className="w-24 h-24 object-contain rounded-md" 
                    />
                  </div>
                  <p className="mt-2 text-[8.5px] text-[#8a3004] font-black uppercase tracking-wider flex items-center justify-center gap-1">
                    <span className="material-symbols-outlined text-xs">qr_code_scanner</span>
                    Scan to Verify Membership
                  </p>
                </div>

                {/* Terms and Conditions Box */}
                <div className="w-full bg-amber-50/80 backdrop-blur-sm border border-amber-200/90 rounded-xl p-2.5 text-left text-[8px] text-slate-700 space-y-1 my-auto">
                  <h4 className="font-extrabold text-[#8a3004] uppercase tracking-wider text-[8.5px] pb-0.5 border-b border-amber-200">
                    Terms & Guidelines
                  </h4>
                  <p className="leading-tight">• Certifies official volunteer status with Kesula Charitable Trust.</p>
                  <p className="leading-tight">• Property of Kesula Trust. Non-transferable identity pass.</p>
                  <p className="leading-tight">• If found, please return to Head Office or contact us.</p>
                </div>

                {/* Head Office & Signatory */}
                <div className="w-full pt-1 flex justify-between items-end border-t border-slate-200 text-left bg-white/60 p-1 rounded-lg">
                  <div className="text-[7.5px] text-slate-500 leading-tight">
                    <p className="font-bold text-slate-700">Head Office: Telangana, India</p>
                    <p>Contact: info@kesulatrust.org</p>
                    <p className="text-[#8a3004] font-bold">www.kesulatrust.org</p>
                  </div>
                  <div className="text-right">
                    <div className="font-serif italic text-xs font-extrabold text-[#8a3004]">
                      Praneeth Goud
                    </div>
                    <p className="text-[6.5px] font-extrabold uppercase text-slate-500">Authorized Trustee</p>
                  </div>
                </div>

              </div>

              {/* Bottom Footer Banner */}
              <div className="w-full bg-[#8a3004] text-amber-200 text-[7.5px] font-extrabold uppercase tracking-widest text-center py-1.5 border-t border-amber-400/30 relative z-10 shrink-0">
                Official Volunteer Identity Pass • Non-Transferable
              </div>

            </div>
          )}

        </div>

        {/* ACTION BUTTONS */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 w-full max-w-xs">
          <button
            onClick={handlePrint}
            className="flex-1 clay-btn clay-btn-primary py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider font-extrabold flex items-center justify-center gap-2 shadow-lg"
          >
            <span className="material-symbols-outlined text-[18px]">print</span>
            Print ID Card
          </button>
          
          <button
            onClick={onClose}
            className="py-2.5 px-5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs uppercase tracking-wider font-bold transition-all border border-white/10"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
