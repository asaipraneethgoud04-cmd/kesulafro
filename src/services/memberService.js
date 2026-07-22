import { supabase } from '../lib/supabase';

export const memberService = {
  async getMembers() {
    let { data, error } = await supabase
      .from('members')
      .select('*')
      .order('submittedAt', { ascending: false });
      
    if (error) {
      // Fallback if submittedAt doesn't exist
      const res = await supabase.from('members').select('*');
      if (res.error) throw res.error;
      return res.data;
    }
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
