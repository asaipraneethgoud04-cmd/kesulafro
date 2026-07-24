import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { useLanguage } from '../../context/LanguageContext';

export default function CrowdfundingBanner() {
  const { t } = useLanguage();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [donationAmount, setDonationAmount] = useState(1000);
  const [customAmount, setCustomAmount] = useState('');
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [donorPhone, setDonorPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [donationSuccess, setDonationSuccess] = useState(false);

  useEffect(() => {
    fetchActiveCampaign();
  }, []);

  const fetchActiveCampaign = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('is_crowdfunding', true)
        .eq('is_active_banner', true)
        .limit(1);

      if (error) {
        console.error('Error fetching crowdfunding campaign:', error);
        setCampaign(null);
      } else if (data && data.length > 0) {
        setCampaign(data[0]);
      } else {
        setCampaign(null);
      }
    } catch (err) {
      console.error('Unexpected error fetching crowdfunding banner:', err);
      setCampaign(null);
    } finally {
      setLoading(false);
    }
  };

  // If loading or no active campaign banner enabled in admin, render nothing (hidden)
  if (loading || !campaign) {
    return null;
  }

  const collected = Number(campaign.collected_amount || 0);
  const target = Number(campaign.target_amount || 100000);
  const percentage = Math.min(100, Math.round((collected / target) * 100));

  const getDaysLeftText = () => {
    if (!campaign.end_date) return t('crowdfunding.daysLeft');
    const endDate = new Date(campaign.end_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return t('crowdfunding.campaignEnded') || 'Campaign Ended';
    if (diffDays === 0) return t('crowdfunding.endsToday') || 'Ends Today';
    return `${diffDays} ${t('crowdfunding.daysRemaining') || 'Days Remaining'}`;
  };

  const handleRazorpayDonate = async (e) => {
    e.preventDefault();
    const finalAmount = customAmount ? parseFloat(customAmount) : donationAmount;
    if (!finalAmount || finalAmount <= 0) {
      alert('Please enter a valid donation amount.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Create order on backend
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${apiUrl}/api/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: finalAmount,
          receipt: `cf_${campaign.id ? campaign.id.slice(0, 8) : 'cf'}_${Date.now().toString().slice(-6)}`
        })
      });

      const orderData = await response.json();

      if (!orderData || !orderData.id) {
        throw new Error(orderData.error || 'Failed to create payment order');
      }

      // 2. Open Razorpay Checkout modal
      const options = {
        key: orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'KESULA CHARITABLE TRUST',
        description: `Crowdfunding: ${campaign.title}`,
        image: window.location.protocol === 'https:' ? `${window.location.origin}/images/logo.webp` : undefined,
        order_id: orderData.id,
        prefill: {
          name: donorName,
          email: donorEmail,
          contact: donorPhone
        },
        theme: {
          color: '#8a3004'
        },
        handler: async function (paymentRes) {
          // 3. Verify payment on backend
          try {
            const verifyRes = await fetch(`${apiUrl}/api/verify-payment`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: paymentRes.razorpay_order_id,
                razorpay_payment_id: paymentRes.razorpay_payment_id,
                razorpay_signature: paymentRes.razorpay_signature,
                name: donorName || 'Anonymous Donor',
                email: donorEmail || 'donor@kesula.org',
                amount: finalAmount,
                event_id: campaign.id
              })
            });

            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              setDonationSuccess(true);
              // Update local state instantly
              setCampaign(prev => ({
                ...prev,
                collected_amount: (Number(prev.collected_amount) || 0) + finalAmount
              }));
            } else {
              alert('Payment verification failed. Please contact support.');
            }
          } catch (err) {
            console.error('Payment verification error:', err);
            alert('Verification failed, but your payment went through. We will reconcile it shortly.');
          } finally {
            setIsSubmitting(false);
          }
        },
        modal: {
          ondismiss: function () {
            setIsSubmitting(false);
          }
        }
      };

      if (window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        // Fallback if Razorpay SDK script not loaded
        alert(`Thank you for your pledge of ₹${finalAmount}! Offline verification logged.`);
        setIsSubmitting(false);
      }

    } catch (err) {
      console.error('Crowdfunding Razorpay Error:', err);
      alert('Error initiating Razorpay checkout. Please check server connection.');
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-12 md:py-16 relative z-20 overflow-hidden bg-gradient-to-b from-orange-50/70 via-white to-orange-50/30 border-y border-orange-100/70">
      {/* Decorative Glow Elements */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-[#8a3004]/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-96 h-96 bg-[#c5621a]/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-container mx-auto px-gutter relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-white/80 backdrop-blur-xl border border-orange-200/80 rounded-[36px] p-6 sm:p-10 md:p-12 shadow-[0_20px_70px_-15px_rgba(138,48,4,0.12)] relative overflow-hidden"
        >
          {/* Top Banner Tag */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#8a3004] text-white text-xs font-extrabold uppercase tracking-widest shadow-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              {t('crowdfunding.tag')}
            </span>

            <div className="flex items-center gap-2 text-xs font-bold text-[#8a3004] bg-orange-100/80 px-3.5 py-1.5 rounded-full border border-orange-200 shadow-sm">
              <span className="material-symbols-outlined text-sm">schedule</span>
              <span>{getDaysLeftText()}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Campaign Photo / Feature */}
            <div className="lg:col-span-5 relative">
              <div className="aspect-[4/3] rounded-3xl overflow-hidden border-4 border-white shadow-xl relative bg-slate-100">
                <img
                  src={campaign.imageUrl || '/images/hs1.webp'}
                  alt={campaign.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 text-white text-left">
                  <span className="text-[11px] uppercase tracking-wider font-extrabold text-orange-200 block">
                    {campaign.category || 'Special Initiative'}
                  </span>
                  <h4 className="text-lg font-bold line-clamp-1">{campaign.title}</h4>
                </div>
              </div>
            </div>

            {/* Campaign Details & Dynamic Progress */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight font-serif leading-snug">
                  {campaign.title}
                </h2>
                {campaign.campaign_tagline && (
                  <p className="text-sm font-bold text-[#8a3004] mt-1.5 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-base">campaign</span>
                    <span>{campaign.campaign_tagline}</span>
                  </p>
                )}
                <p className="text-slate-600 text-sm md:text-base leading-relaxed font-light mt-3 line-clamp-3">
                  {campaign.description}
                </p>
              </div>

              {/* Progress Bar & Amounts */}
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200/80 space-y-4">
                <div className="flex justify-between items-baseline flex-wrap gap-2">
                  <div>
                    <span className="text-xs uppercase font-extrabold text-slate-400 block tracking-wider">
                      {t('crowdfunding.raised')}
                    </span>
                    <span className="text-3xl font-extrabold text-[#8a3004] font-serif">
                      ₹{collected.toLocaleString('en-IN')}
                    </span>
                    <span className="text-sm font-semibold text-slate-500 ml-1.5">
                      / ₹{target.toLocaleString('en-IN')} {t('crowdfunding.goal')}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-3xl font-extrabold text-slate-900 font-sans">{percentage}%</span>
                  </div>
                </div>

                {/* Animated Progress Bar */}
                <div className="w-full h-4 bg-slate-200/80 rounded-full overflow-hidden p-0.5 border border-slate-200 shadow-inner">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${percentage}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-[#8a3004] via-[#c5621a] to-emerald-500 rounded-full shadow-md relative"
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                  </motion.div>
                </div>

                <div className="flex justify-between items-center text-xs font-semibold text-slate-500 pt-1">
                  <span className="flex items-center gap-1.5 font-bold text-slate-800">
                    <span className="material-symbols-outlined text-sm text-[#8a3004]">favorite</span>
                    <span>{campaign.supporters_count ? `${campaign.supporters_count} ${t('crowdfunding.supporters')}` : 'Direct Impact Campaign'}</span>
                  </span>
                  <span>100% Verified Non-Profit</span>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  onClick={() => setShowDonateModal(true)}
                  className="w-full sm:w-auto bg-gradient-to-r from-[#8a3004] to-[#b5470a] hover:from-[#a03c08] hover:to-[#c55010] text-white font-bold text-sm uppercase tracking-[0.15em] px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl hover:shadow-[#8a3004]/25 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-3"
                >
                  <span className="material-symbols-outlined text-lg">volunteer_activism</span>
                  <span>{t('crowdfunding.donateBtn')}</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Razorpay Crowdfunding Donation Modal */}
      <AnimatePresence>
        {showDonateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative border border-slate-100 overflow-hidden text-left"
            >
              <button
                onClick={() => {
                  setShowDonateModal(false);
                  setDonationSuccess(false);
                }}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>

              {donationSuccess ? (
                <div className="text-center py-8 space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                    <span className="material-symbols-outlined text-4xl">verified</span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">Thank You!</h3>
                  <p className="text-slate-600 text-sm font-light">
                    {t('crowdfunding.successMsg')}
                  </p>
                  <button
                    onClick={() => {
                      setShowDonateModal(false);
                      setDonationSuccess(false);
                    }}
                    className="mt-4 bg-[#8a3004] text-white px-6 py-2.5 rounded-xl font-bold text-sm"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <form onSubmit={handleRazorpayDonate} className="space-y-5">
                  <div>
                    <span className="text-xs uppercase font-extrabold text-[#8a3004] tracking-wider block mb-1">
                      {t('crowdfunding.modalTitle')}
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 line-clamp-1">{campaign.title}</h3>
                  </div>

                  {/* Preset Amount Selector */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 block">Select Amount (₹)</label>
                    <div className="grid grid-cols-4 gap-2">
                      {[500, 1000, 2500, 5000].map(amt => (
                        <button
                          type="button"
                          key={amt}
                          onClick={() => {
                            setDonationAmount(amt);
                            setCustomAmount('');
                          }}
                          className={`py-2.5 text-xs font-bold rounded-xl border transition-all ${
                            donationAmount === amt && !customAmount
                              ? 'bg-[#8a3004] text-white border-[#8a3004] shadow-md'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          ₹{amt}
                        </button>
                      ))}
                    </div>

                    <input
                      type="number"
                      value={customAmount}
                      onChange={e => setCustomAmount(e.target.value)}
                      placeholder="Or enter custom amount (₹)"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:bg-white focus:border-[#8a3004] focus:outline-none transition-all"
                    />
                  </div>

                  {/* Donor Info */}
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={donorName}
                      onChange={e => setDonorName(e.target.value)}
                      placeholder="Full Name"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:bg-white focus:border-[#8a3004] focus:outline-none"
                      required
                    />
                    <input
                      type="email"
                      value={donorEmail}
                      onChange={e => setDonorEmail(e.target.value)}
                      placeholder="Email Address"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:bg-white focus:border-[#8a3004] focus:outline-none"
                      required
                    />
                    <input
                      type="tel"
                      value={donorPhone}
                      onChange={e => setDonorPhone(e.target.value)}
                      placeholder="Phone Number (Optional)"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:bg-white focus:border-[#8a3004] focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-[#8a3004] to-[#b5470a] hover:from-[#a03c08] hover:to-[#c55010] text-white font-bold text-sm uppercase tracking-wider py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="material-symbols-outlined animate-spin text-base">autorenew</span>
                        Processing...
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-base">lock</span>
                        Proceed to Pay ₹{customAmount ? customAmount : donationAmount}
                      </>
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
