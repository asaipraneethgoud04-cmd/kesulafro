import React, { memo } from 'react';

const DonationTable = function({ donations, handleDeleteDonation }) {
  const formatAmount = (amt) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amt);
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

  const confirmDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this donation record? This action cannot be undone.")) {
      handleDeleteDonation(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="font-headline-lg text-2xl font-bold text-primary tracking-tight">Donations &amp; Payments</h1>
      </div>

      <div className="glass-panel border border-white/40 rounded-3xl overflow-x-auto shadow-sm">
        <table className="w-full text-left border-collapse text-sm">
          <thead className="bg-primary/5 border-b border-secondary/10 uppercase font-bold text-on-surface-variant text-sm tracking-wider">
            <tr>
              <th className="p-4">Donor Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Payment ID</th>
              <th className="p-4">Order ID</th>
              <th className="p-4">Date &amp; Time</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-secondary/10">
            {donations.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-8 text-center text-on-surface-variant italic">No donation records found.</td>
              </tr>
            ) : (
              donations.map((d) => (
                <tr key={d.id} className="hover:bg-primary/5 transition-all">
                  <td className="p-4 font-semibold">{d.name}</td>
                  <td className="p-4 opacity-75">{d.email}</td>
                  <td className="p-4 font-extrabold text-primary">{formatAmount(d.amount)}</td>
                  <td className="p-4 font-mono text-xs opacity-75">{d.razorpay_payment_id}</td>
                  <td className="p-4 font-mono text-xs opacity-75">{d.razorpay_order_id}</td>
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
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default memo(DonationTable);
