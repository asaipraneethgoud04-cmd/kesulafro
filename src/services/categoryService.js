import { supabase } from '../lib/supabase';
import { EVENT_CATEGORIES } from '../constants/categories';

export const categoryService = {
  async getCategories() {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name, createdAt')
        .order('name', { ascending: true });

      if (error) {
        console.warn('Supabase categories fetch failed, using default fallback categories:', error.message);
        return EVENT_CATEGORIES.map((name, index) => ({ id: `static-${index}`, name }));
      }
      
      // If table exists but has no categories, seed them or return defaults
      if (!data || data.length === 0) {
        return EVENT_CATEGORIES.map((name, index) => ({ id: `static-${index}`, name }));
      }
      
      return data;
    } catch (err) {
      console.warn('Failed to fetch categories, falling back to static categories:', err);
      return EVENT_CATEGORIES.map((name, index) => ({ id: `static-${index}`, name }));
    }
  },

  async createCategory(name) {
    const { data, error } = await supabase
      .from('categories')
      .insert([{ name }]);
    if (error) throw error;
    return data;
  },

  async deleteCategory(id) {
    if (typeof id === 'string' && id.startsWith('static-')) {
      throw new Error('Default static categories cannot be deleted from database. Please run the SQL migration first.');
    }
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return true;
  }
};
