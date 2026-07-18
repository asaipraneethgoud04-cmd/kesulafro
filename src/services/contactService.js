import { supabase } from '../lib/supabase';

export const contactService = {
  async getContacts() {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('id, name, email, phone, subject, message, submittedAt')
      .order('submittedAt', { ascending: false });
    if (error) throw error;
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
