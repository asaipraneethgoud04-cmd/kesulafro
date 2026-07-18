import { supabase } from '../lib/supabase';

export const eventService = {
  async getEvents() {
    const { data, error } = await supabase
      .from('events')
      .select('id, title, description, category, tags, date, location, imageUrl, status, featured, createdAt')
      .order('date', { ascending: false });
    if (error) throw error;
    return data;
  },

  async getEventById(id) {
    const { data, error } = await supabase
      .from('events')
      .select('id, title, description, category, tags, date, location, imageUrl, status, featured, createdAt')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  async createEvent(eventData) {
    const { data, error } = await supabase
      .from('events')
      .insert([eventData]);
    if (error) throw error;
    return data;
  },

  async updateEvent(id, eventData) {
    const { data, error } = await supabase
      .from('events')
      .update(eventData)
      .eq('id', id);
    if (error) throw error;
    return data;
  },

  async deleteEvent(id) {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return true;
  }
};
