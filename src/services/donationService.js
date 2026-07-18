import { supabase } from '../lib/supabase';

export const donationService = {
  async getDonations() {
    const { data, error } = await supabase
      .from('donations')
      .select('id, name, email, amount, razorpay_order_id, razorpay_payment_id, createdAt')
      .order('createdAt', { ascending: false });
    if (error) throw error;
    return data;
  },

  async deleteDonation(id) {
    const { error } = await supabase
      .from('donations')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return true;
  }
};
