import { supabase } from '../lib/supabase';

export const storageService = {
  async uploadCanvasToSupabase(canvas, folderPath) {
    return new Promise((resolve, reject) => {
      canvas.toBlob(async (blob) => {
        if (!blob) return reject(new Error('Canvas compression failed'));
        try {
          const filename = `${folderPath}/${Date.now()}-${Math.floor(Math.random() * 10000)}.webp`;
          const { error } = await supabase.storage.from('images').upload(filename, blob, {
            contentType: 'image/webp',
            cacheControl: '3600',
            upsert: false
          });
          if (error) throw error;
          
          const { data: publicUrlData } = supabase.storage.from('images').getPublicUrl(filename);
          resolve(publicUrlData.publicUrl);
        } catch (err) {
          reject(err);
        }
      }, 'image/webp', 0.8);
    });
  }
};
