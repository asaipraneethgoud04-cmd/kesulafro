import { supabase } from '../lib/supabase';

export const memberService = {
  async getMembers() {
    const { data, error } = await supabase
      .from('members')
      .select('id, fullName, email, phone, address, interestArea, status, message, submittedAt')
      .order('submittedAt', { ascending: false });
    if (error) throw error;
    return data;
  },

  async updateMemberStatus(id, newStatus) {
    const { error } = await supabase
      .from('members')
      .update({ status: newStatus })
      .eq('id', id);
    if (error) throw error;
    return true;
  },

  async deleteMember(id) {
    const { error } = await supabase
      .from('members')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return true;
  }
};
