import { supabase } from '../lib/supabase';

export const galleryService = {
  async getGallery() {
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .order('createdAt', { ascending: true });
    if (error) throw error;
    return data;
  },

  async addImage(imageData) {
    const { data, error } = await supabase
      .from('gallery')
      .insert([imageData]);
    if (error) throw error;
    return data;
  },

  async updateImage(id, updateData) {
    const { data, error } = await supabase
      .from('gallery')
      .update(updateData)
      .eq('id', id);
    if (error) throw error;
    return data;
  },

  async deleteImage(id) {
    const { error } = await supabase
      .from('gallery')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return true;
  }
};
