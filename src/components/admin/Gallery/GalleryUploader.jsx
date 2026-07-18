import React, { useState, memo } from 'react';
import { storageService } from '../../../services/storageService';

const GalleryUploader = function({ onImageAdded }) {
  const [newImageShape, setNewImageShape] = useState('default');

  const handleUpload = async (e) => {
    e.preventDefault();
    const fileInput = e.target.elements.imageFile;
    if (!fileInput.files || fileInput.files.length === 0) return;
    
    const file = fileInput.files[0];
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        try {
          const uploadedUrl = await storageService.uploadCanvasToSupabase(canvas, 'gallery');

          const insertPayload = { imageUrl: uploadedUrl };
          if (newImageShape && newImageShape !== 'default') {
            insertPayload.gridShape = newImageShape;
          }
          
          await onImageAdded(insertPayload);
          fileInput.value = '';
          setNewImageShape('default');
        } catch (err) {
          alert('Failed to upload compressed image: ' + err.message);
        }
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="glass-panel border-white/40 p-6 rounded-2xl shadow-sm mb-8">
      <h3 className="font-headline-md text-base font-bold text-on-surface mb-4">Add New Image (Auto-Compress)</h3>
      <form onSubmit={handleUpload} className="flex flex-col gap-5 items-start w-full">
        <input
          type="file"
          name="imageFile"
          accept="image/*"
          className="w-full px-4 py-2.5 rounded-xl bg-white/50 border border-secondary/20 focus:outline-none focus:border-primary text-sm file:mr-4 file:py-2 file:px-5 file:rounded-full file:border-0 file:text-sm file:uppercase file:tracking-wider file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer transition-all"
          required
        />
        
        <div className="w-full space-y-4 pt-2">
          <label className="text-sm font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">dashboard_customize</span>
            Select Grid Shape
          </label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 w-full">
            {[
              { value: 'default', label: 'Auto Mix', icon: 'auto_awesome', desc: 'Dynamic' },
              { value: 'col-span-1 row-span-1', label: 'Small', icon: 'crop_square', desc: '1x1 Square' },
              { value: 'col-span-1 row-span-2', label: 'Tall', icon: 'crop_portrait', desc: '1x2 Vertical' },
              { value: 'col-span-2 row-span-1', label: 'Wide', icon: 'crop_landscape', desc: '2x1 Horizontal' },
              { value: 'col-span-2 row-span-2', label: 'Huge', icon: 'aspect_ratio', desc: '2x2 Hero' }
            ].map(shape => (
              <button
                key={shape.value}
                type="button"
                onClick={() => setNewImageShape(shape.value)}
                className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all outline-none ${
                  newImageShape === shape.value 
                    ? 'bg-primary/5 border-primary text-primary shadow-sm transform scale-[1.02]' 
                    : 'bg-white/60 border-transparent hover:border-primary/30 text-on-surface-variant hover:bg-white hover:text-primary shadow-sm hover:shadow-md'
                }`}
              >
                <span className={`material-symbols-outlined text-3xl transition-transform duration-300 ${newImageShape === shape.value ? 'scale-110' : ''}`}>
                  {shape.icon}
                </span>
                <div className="text-center">
                  <div className="text-sm font-extrabold tracking-wide">{shape.label}</div>
                  <div className="text-[11px] opacity-70 font-semibold uppercase tracking-wider mt-0.5">{shape.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
          
        <button type="submit" className="clay-btn clay-btn-primary px-8 py-3.5 text-sm uppercase tracking-wider font-bold w-full md:w-auto self-end shadow-md mt-2 flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-sm">cloud_upload</span>
          Upload to Gallery
        </button>
      </form>
    </div>
  );
}


export default memo(GalleryUploader);