import React, { memo, useState, useRef, useEffect } from 'react';

const GalleryGrid = function({ gallery, handleDeleteImage, handleUpdateImageShape }) {
  const [editingImage, setEditingImage] = useState(null);
  const [selectedShape, setSelectedShape] = useState(null);
  
  // Panning state
  const [panX, setPanX] = useState(50);
  const [panY, setPanY] = useState(50);
  
  // Dragging state
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const shapes = [
    { value: 'default', label: 'Auto Mix', icon: 'auto_awesome', desc: 'Dynamic sizing' },
    { value: 'col-span-1 row-span-1', label: 'Small', icon: 'crop_square', desc: '1x1 Square' },
    { value: 'col-span-1 row-span-2', label: 'Tall', icon: 'crop_portrait', desc: '1x2 Vertical' },
    { value: 'col-span-2 row-span-1', label: 'Wide', icon: 'crop_landscape', desc: '2x1 Horizontal' },
    { value: 'col-span-2 row-span-2', label: 'Huge', icon: 'aspect_ratio', desc: '2x2 Hero' }
  ];

  const openEditor = (img) => {
    setEditingImage(img);
    setSelectedShape(img.gridShape || 'default');
    
    // Parse existing objectPosition if any
    if (img.objectPosition) {
      const parts = img.objectPosition.split(' ');
      if (parts.length === 2) {
        setPanX(parseFloat(parts[0]) || 50);
        setPanY(parseFloat(parts[1]) || 50);
      }
    } else {
      setPanX(50);
      setPanY(50);
    }
  };

  const handleSave = async () => {
    if (editingImage) {
      const success = await handleUpdateImageShape(editingImage.id, selectedShape, `${Math.round(panX)}% ${Math.round(panY)}%`);
      if (!success) {
        alert("Failed to save! Please make sure you ran the SQL command to add the objectPosition column and disable RLS.");
      }
      setEditingImage(null);
    }
  };

  // --- Drag to Pan Logic ---
  const handleDragStart = (clientX, clientY) => {
    setIsDragging(true);
    setDragStart({ x: clientX, y: clientY });
  };

  const handleDragMove = (clientX, clientY) => {
    if (!isDragging) return;
    
    const deltaX = clientX - dragStart.x;
    const deltaY = clientY - dragStart.y;
    
    // Sensitivity factor determines how fast the image pans relative to mouse movement
    const sensitivity = 0.5; 
    
    // For object-position, 0% is top/left, 100% is bottom/right.
    // When dragging mouse RIGHT (positive deltaX), we want the image to move RIGHT.
    // To make image move right, we must DECREASE object-position X.
    setPanX(prev => Math.max(0, Math.min(100, prev - (deltaX * sensitivity))));
    setPanY(prev => Math.max(0, Math.min(100, prev - (deltaY * sensitivity))));
    
    setDragStart({ x: clientX, y: clientY });
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };
  
  // Setup global event listeners for smooth drag even outside the div
  useEffect(() => {
    if (!isDragging) return;
    
    const onMouseMove = (e) => handleDragMove(e.clientX, e.clientY);
    const onTouchMove = (e) => handleDragMove(e.touches[0].clientX, e.touches[0].clientY);
    
    const onMouseUp = handleDragEnd;
    
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onMouseUp);
    
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onMouseUp);
    };
  }, [isDragging, dragStart]);


  const getPreviewClasses = (shape) => {
    switch (shape) {
      case 'col-span-1 row-span-1': return 'aspect-square w-48 md:w-56';
      case 'col-span-1 row-span-2': return 'aspect-[1/2] h-[40vh] md:h-[50vh]';
      case 'col-span-2 row-span-1': return 'aspect-[2/1] w-[80%] md:w-[90%]';
      case 'col-span-2 row-span-2': return 'aspect-square w-[70%] md:w-[80%]';
      default: return 'aspect-auto max-h-[40vh] md:max-h-[50vh] max-w-[90%]';
    }
  };

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {gallery.map(img => (
          <div key={img.id} className="glass-panel p-2 rounded-2xl relative group overflow-hidden border border-white/40">
            <div className="aspect-square rounded-xl overflow-hidden bg-black/5">
              <img 
                src={img.imageUrl} 
                alt="Gallery" 
                className="w-full h-full object-cover" 
                style={img.objectPosition ? { objectPosition: img.objectPosition } : {}}
              />
            </div>
            
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-2xl">
              <div className="flex gap-4">
                <button
                  onClick={() => openEditor(img)}
                  className="bg-white/10 hover:bg-primary text-white backdrop-blur-md border border-white/20 w-12 h-12 rounded-full flex items-center justify-center hover:scale-110 transition-all shadow-lg"
                  title="Resize Image"
                >
                  <span className="material-symbols-outlined text-xl">aspect_ratio</span>
                </button>
                <button
                  onClick={() => handleDeleteImage(img.id)}
                  className="bg-white/10 hover:bg-red-600 text-white backdrop-blur-md border border-white/20 w-12 h-12 rounded-full flex items-center justify-center hover:scale-110 transition-all shadow-lg"
                  title="Delete Image"
                >
                  <span className="material-symbols-outlined text-xl">delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
        {gallery.length === 0 && (
          <div className="col-span-full py-16 text-center text-on-surface-variant italic bg-white/30 rounded-3xl border border-white/40 shadow-sm">
            No images in the gallery yet.
          </div>
        )}
      </div>

      {/* Premium Edit Modal */}
      {editingImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 opacity-0 animate-[fadeIn_0.3s_ease-out_forwards]">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setEditingImage(null)}></div>
          
          <div className="relative w-full max-w-5xl bg-surface/95 backdrop-blur-xl border border-white/40 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row transform transition-all scale-95 animate-[scaleIn_0.3s_ease-out_forwards]">
            
            {/* Left Side: Image Preview */}
            <div className="w-full md:w-1/2 bg-black/5 p-8 flex flex-col items-center justify-center relative overflow-hidden min-h-[40vh] md:min-h-[60vh]">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 to-transparent pointer-events-none"></div>
              
              <div 
                className={`relative z-10 transition-[width,height,aspect-ratio] duration-300 ease-in-out overflow-hidden rounded-2xl shadow-xl border border-white/20 ${getPreviewClasses(selectedShape)}`}
                style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
                onMouseDown={(e) => { e.preventDefault(); handleDragStart(e.clientX, e.clientY); }}
                onTouchStart={(e) => handleDragStart(e.touches[0].clientX, e.touches[0].clientY)}
              >
                <img 
                  src={editingImage.imageUrl} 
                  alt="Preview" 
                  draggable={false}
                  className={`w-full h-full pointer-events-none ${selectedShape === 'default' ? 'object-contain' : 'object-cover'}`}
                  style={{ objectPosition: `${panX}% ${panY}%` }}
                />
              </div>
              
              {selectedShape !== 'default' && (
                <div className="absolute top-6 bg-black/50 backdrop-blur-md text-white/90 text-sm px-4 py-2 rounded-full z-20 shadow-sm font-medium tracking-wide border border-white/10 flex items-center gap-2 pointer-events-none animate-pulse">
                  <span className="material-symbols-outlined text-[18px]">drag_pan</span>
                  Click and drag to adjust focus
                </div>
              )}

              <div className="absolute bottom-6 bg-black/40 backdrop-blur-md text-white/90 text-xs px-4 py-1.5 rounded-full z-20 shadow-sm font-medium tracking-wide border border-white/10 flex items-center gap-2 pointer-events-none">
                <span className="material-symbols-outlined text-[14px]">visibility</span>
                Live Preview
              </div>
            </div>

            {/* Right Side: Options */}
            <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-between">
              <div>
                <div className="mb-6">
                  <h2 className="text-3xl font-black text-primary tracking-tight mb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-3xl">crop</span>
                    Frame Image
                  </h2>
                  <p className="text-on-surface-variant text-sm font-medium">Choose a shape and drag the image on the left to perfectly center it.</p>
                </div>

                {/* Shape Selection */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
                  {shapes.map(s => (
                    <button
                      key={s.value}
                      onClick={() => setSelectedShape(s.value)}
                      className={`flex flex-col items-center p-3 rounded-xl border-2 text-center transition-all outline-none group ${
                        selectedShape === s.value 
                          ? 'bg-primary/5 border-primary shadow-sm transform scale-[1.02]' 
                          : 'bg-white/50 border-transparent hover:border-primary/30 hover:bg-white text-on-surface-variant'
                      }`}
                    >
                      <span className={`material-symbols-outlined text-2xl mb-1 transition-transform duration-300 ${selectedShape === s.value ? 'text-primary scale-110' : 'text-on-surface-variant group-hover:text-primary'}`}>
                        {s.icon}
                      </span>
                      <span className={`text-xs font-extrabold tracking-wide ${selectedShape === s.value ? 'text-primary' : 'text-on-surface'}`}>
                        {s.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-4 mt-8 pt-6 border-t border-secondary/10">
                <button 
                  onClick={() => setEditingImage(null)} 
                  className="flex-1 py-3 px-6 rounded-xl font-bold text-sm tracking-wider uppercase text-on-surface-variant hover:bg-secondary/10 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave} 
                  className="flex-[2] clay-btn clay-btn-primary py-3 px-6 font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">save</span>
                  Save Framing
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.95) translateY(10px); opacity: 0; }
          to { transform: scale(1) translateY(0); opacity: 1; }
        }
      `}} />
    </>
  );
}

export default memo(GalleryGrid);