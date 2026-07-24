import { supabase } from '../lib/supabase';

export const donationService = {
  async getDonations() {
    try {
      // Single clean query to fetch donations table
      const { data, error } = await supabase
        .from('donations')
        .select('*');
      
      if (error) {
        console.warn('Supabase donations query info:', error.message || error);
        return [];
      }

      if (!data || data.length === 0) {
        return [];
      }

      // Sort in memory by timestamp/date/id descending to avoid URL order column mismatches
      const sorted = [...data].sort((a, b) => {
        const timeA = new Date(a.created_at || a.createdAt || a.date || 0).getTime();
        const timeB = new Date(b.created_at || b.createdAt || b.date || 0).getTime();
        return timeB - timeA;
      });

      // Normalize fields for admin UI components
      return sorted.map(d => ({
        id: d.id || `don_${Math.random()}`,
        name: d.name || d.full_name || d.donor_name || 'Anonymous Donor',
        email: d.email || d.donor_email || 'N/A',
        amount: Number(d.amount || d.total_amount || 0),
        razorpay_payment_id: d.razorpay_payment_id || d.payment_id || d.razorpay_order_id || 'N/A',
        razorpay_order_id: d.razorpay_order_id || null,
        type: d.type || (d.event_id || (d.razorpay_order_id && String(d.razorpay_order_id).includes('cf')) ? 'crowdfunding' : 'general'),
        event_id: d.event_id || d.eventId || null,
        createdAt: d.createdAt || d.created_at || d.date || d.timestamp || new Date().toISOString()
      }));
    } catch (err) {
      console.warn('Unhandled error fetching donations:', err);
      return [];
    }
  },

  async deleteDonation(id) {
    try {
      const { error } = await supabase
        .from('donations')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Error deleting donation record:', err);
      return false;
    }
  }
};
