import { supabase } from '../lib/supabase';

export const contactService = {
  async getContacts() {
    let { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('submittedAt', { ascending: false });
      
    if (error) {
      // Fallback if submittedAt doesn't exist
      const res = await supabase.from('contact_messages').select('*');
      if (res.error) throw res.error;
      return res.data;
    }
    return data;
  },

  async deleteContact(id) {
    const { error } = await supabase
      .from('contact_messages')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return true;
  }
};
