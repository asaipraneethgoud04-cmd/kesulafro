import React, { memo } from 'react';

const GalleryGrid = function({ gallery, handleDeleteImage }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {gallery.map(img => (
        <div key={img.id} className="glass-panel p-2 rounded-2xl relative group overflow-hidden border border-white/40">
          <div className="aspect-square rounded-xl overflow-hidden bg-black/5">
            <img src={img.imageUrl} alt="Gallery" className="w-full h-full object-cover" />
          </div>
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
            <button
              onClick={() => handleDeleteImage(img.id)}
              className="bg-red-600 text-white w-10 h-10 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
              title="Delete Image"
            >
              <span className="material-symbols-outlined text-lg">delete</span>
            </button>
          </div>
        </div>
      ))}
      {gallery.length === 0 && (
        <div className="col-span-full py-12 text-center text-on-surface-variant italic">
          No images in the gallery yet.
        </div>
      )}
    </div>
  );
}


export default memo(GalleryGrid);