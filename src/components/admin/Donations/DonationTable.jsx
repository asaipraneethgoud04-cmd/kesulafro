import React, { memo, useState } from 'react';

const DonationTable = function({ donations, handleDeleteDonation }) {
  const [filterType, setFilterType] = useState('all');

  const formatAmount = (amt) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amt || 0);
  };

  const formatDate = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  };

  const isCrowdfunding = (d) => {
    return d.event_id || d.type === 'crowdfunding' || (d.razorpay_order_id && d.razorpay_order_id.startsWith('rcpt_cf_'));
  };

  const filteredDonations = donations.filter(d => {
    if (filterType === 'crowdfunding') return isCrowdfunding(d);
    if (filterType === 'general') return !isCrowdfunding(d);
    return true;
  });

  const totalAll = donations.reduce((sum, d) => sum + Number(d.amount || 0), 0);
  const totalCrowdfunding = donations.filter(isCrowdfunding).reduce((sum, d) => sum + Number(d.amount || 0), 0);
  const totalGeneral = donations.filter(d => !isCrowdfunding(d)).reduce((sum, d) => sum + Number(d.amount || 0), 0);

  const confirmDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this donation record? This action cannot be undone.")) {
      handleDeleteDonation(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Filter Bar */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="font-headline-lg text-2xl font-bold text-primary tracking-tight">Donations &amp; Payments</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Filter and track Razorpay payments across General vs Crowdfunding initiatives.</p>
        </div>

        {/* Filter Dropdown */}
        <div className="flex items-center gap-3">
          <label htmlFor="donation-filter" className="text-xs font-extrabold uppercase tracking-wider text-slate-600">Filter By:</label>
          <select
            id="donation-filter"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="glass-input rounded-xl px-4 py-2 text-sm font-bold text-slate-800 bg-white border border-slate-200 shadow-sm"
          >
            <option value="all">All Donations ({donations.length})</option>
            <option value="crowdfunding">Crowdfunding Only ({donations.filter(isCrowdfunding).length})</option>
            <option value="general">General Donations ({donations.filter(d => !isCrowdfunding(d)).length})</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-left">
          <span className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">Total Received (All)</span>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{formatAmount(totalAll)}</div>
        </div>
        <div className="bg-orange-50/80 p-5 rounded-2xl border border-orange-200 shadow-sm text-left">
          <span className="text-xs font-extrabold uppercase text-[#8a3004] tracking-wider">Crowdfunding Raised</span>
          <div className="text-2xl font-extrabold text-[#8a3004] mt-1">{formatAmount(totalCrowdfunding)}</div>
        </div>
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 shadow-sm text-left">
          <span className="text-xs font-extrabold uppercase text-slate-600 tracking-wider">General Donations</span>
          <div className="text-2xl font-extrabold text-slate-700 mt-1">{formatAmount(totalGeneral)}</div>
        </div>
      </div>

      {/* Donations Table */}
      <div className="glass-panel border border-white/40 rounded-3xl overflow-x-auto shadow-sm">
        <table className="w-full text-left border-collapse text-sm">
          <thead className="bg-primary/5 border-b border-secondary/10 uppercase font-bold text-on-surface-variant text-sm tracking-wider">
            <tr>
              <th className="p-4">Donor Name</th>
              <th className="p-4">Type</th>
              <th className="p-4">Email</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Payment ID</th>
              <th className="p-4">Date &amp; Time</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-secondary/10">
            {filteredDonations.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-8 text-center text-on-surface-variant italic">
                  No donation records found for this filter.
                </td>
              </tr>
            ) : (
              filteredDonations.map((d) => {
                const isCF = isCrowdfunding(d);
                return (
                  <tr key={d.id} className="hover:bg-primary/5 transition-all">
                    <td className="p-4 font-semibold text-slate-900">{d.name}</td>
                    <td className="p-4">
                      {isCF ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-orange-100 border border-orange-300 text-[#8a3004] inline-flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#8a3004]"></span> Crowdfunding
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-slate-100 border border-slate-200 text-slate-600">
                          General
                        </span>
                      )}
                    </td>
                    <td className="p-4 opacity-75">{d.email}</td>
                    <td className="p-4 font-extrabold text-[#8a3004]">{formatAmount(d.amount)}</td>
                    <td className="p-4 font-mono text-xs opacity-75">{d.razorpay_payment_id || 'N/A'}</td>
                    <td className="p-4 opacity-75">{formatDate(d.createdAt)}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => confirmDelete(d.id)}
                        className="text-red-600 hover:text-red-800 font-bold hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default memo(DonationTable);
