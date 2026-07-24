import { supabase } from '../lib/supabase';

export const storageService = {
  async uploadCanvasToSupabase(canvas, folderPath) {
    return new Promise((resolve) => {
      canvas.toBlob(async (blob) => {
        if (!blob) {
          // Fallback to Data URL if blob generation fails
          return resolve(canvas.toDataURL('image/webp', 0.8));
        }

        try {
          const filename = `${folderPath}/${Date.now()}-${Math.floor(Math.random() * 10000)}.webp`;
          const { error } = await supabase.storage.from('images').upload(filename, blob, {
            contentType: 'image/webp',
            cacheControl: '3600',
            upsert: false
          });

          if (error) {
            console.warn('Supabase storage RLS policy prevented upload, using compressed DataURL fallback:', error.message);
            // Fallback to compressed WebP Data URL
            return resolve(canvas.toDataURL('image/webp', 0.8));
          }
          
          const { data: publicUrlData } = supabase.storage.from('images').getPublicUrl(filename);
          resolve(publicUrlData.publicUrl);
        } catch (err) {
          console.warn('Storage upload error, using compressed DataURL fallback:', err.message);
          resolve(canvas.toDataURL('image/webp', 0.8));
        }
      }, 'image/webp', 0.8);
    });
  }
};
