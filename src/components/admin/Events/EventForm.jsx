import React, { memo } from 'react';
import { storageService } from '../../../services/storageService';

const EventForm = function({ 
  showEventForm, 
  setShowEventForm, 
  editingEvent, 
  eventFormData, 
  setEventFormData, 
  handleEventFormSubmit, 
  categoriesList 
}) {
  if (!showEventForm) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-panel border-white/45 max-w-lg w-full rounded-3xl p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button onClick={() => setShowEventForm(false)} className="absolute top-4 right-4 bg-white/70 hover:bg-white text-on-surface w-8 h-8 rounded-full flex items-center justify-center shadow-md focus:outline-none">
          <span className="material-symbols-outlined text-base">close</span>
        </button>
        
        <h3 className="font-headline-lg text-lg font-bold mb-6 text-primary uppercase tracking-wider">
          {editingEvent ? 'Edit Event Details' : 'Create New Event'}
        </h3>

        <form onSubmit={handleEventFormSubmit} className="space-y-4">
          <div className="flex flex-col">
            <label htmlFor="event-title" className="text-sm font-semibold text-on-surface-variant mb-1.5">Event Title *</label>
            <input
              id="event-title"
              type="text"
              value={eventFormData.title}
              onChange={(e) => setEventFormData({ ...eventFormData, title: e.target.value })}
              className="glass-input rounded-xl p-3 text-sm text-on-surface"
              placeholder="e.g. Tree Plantation Drive"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label htmlFor="event-category" className="text-sm font-semibold text-on-surface-variant mb-1.5">Category *</label>
              <select
                id="event-category"
                value={eventFormData.category}
                onChange={(e) => setEventFormData({ ...eventFormData, category: e.target.value })}
                className="glass-input rounded-xl p-3 text-sm text-on-surface appearance-none"
              >
                {categoriesList.map((cat, i) => (
                  <option key={i} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col">
              <label htmlFor="event-tags" className="text-sm font-semibold text-on-surface-variant mb-1.5">Tags</label>
              <input
                id="event-tags"
                type="text"
                value={eventFormData.tags}
                onChange={(e) => setEventFormData({ ...eventFormData, tags: e.target.value })}
                className="glass-input rounded-xl p-3 text-sm text-on-surface"
                placeholder="e.g. Environment, Youth"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label htmlFor="event-date" className="text-sm font-semibold text-on-surface-variant mb-1.5">Date</label>
              <input
                id="event-date"
                type="date"
                value={eventFormData.date}
                onChange={(e) => setEventFormData({ ...eventFormData, date: e.target.value })}
                className="glass-input rounded-xl p-3 text-sm text-on-surface"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="event-location" className="text-sm font-semibold text-on-surface-variant mb-1.5">Location</label>
              <input
                id="event-location"
                type="text"
                value={eventFormData.location}
                onChange={(e) => setEventFormData({ ...eventFormData, location: e.target.value })}
                className="glass-input rounded-xl p-3 text-sm text-on-surface"
                placeholder="Chengicherla, Telangana"
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold text-on-surface-variant mb-1.5">Event Image (Auto-Compress)</label>
            <div className="flex items-center gap-4">
              {eventFormData.imageUrl && (
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-black/5 flex-shrink-0 border border-secondary/20 shadow-sm">
                  <img src={eventFormData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
              <input
                id="event-image"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    const img = new Image();
                    img.onload = () => {
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

                      storageService.uploadCanvasToSupabase(canvas, 'events')
                        .then(url => {
                          setEventFormData({ ...eventFormData, imageUrl: url });
                        })
                        .catch(err => {
                          console.error('Upload failed:', err);
                          alert('Failed to upload image. Please try again.');
                        });
                    };
                    img.src = event.target.result;
                  };
                  reader.readAsDataURL(file);
                }}
                className="w-full px-4 py-2.5 rounded-xl bg-white/50 border border-secondary/20 focus:outline-none focus:border-primary text-sm file:mr-4 file:py-2 file:px-5 file:rounded-full file:border-0 file:text-sm file:uppercase file:tracking-wider file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer transition-all"
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label htmlFor="event-description" className="text-sm font-semibold text-on-surface-variant mb-1.5">Description *</label>
            <textarea
              id="event-description"
              rows="4"
              value={eventFormData.description}
              onChange={(e) => setEventFormData({ ...eventFormData, description: e.target.value })}
              className="glass-input rounded-xl p-3 text-sm text-on-surface resize-none"
              placeholder="Detail report or upcoming event overview"
              required
            ></textarea>
          </div>

          <div className="flex gap-8 items-center pt-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="form-featured"
                checked={eventFormData.featured}
                onChange={(e) => setEventFormData({ ...eventFormData, featured: e.target.checked })}
                className="w-4 h-4 text-primary focus:ring-primary border-secondary/30 rounded"
              />
              <label htmlFor="form-featured" className="text-sm font-semibold text-on-surface-variant">Featured on Home Page</label>
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="event-status" className="text-sm font-semibold text-on-surface-variant">Status:</label>
              <select
                id="event-status"
                value={eventFormData.status}
                onChange={(e) => setEventFormData({ ...eventFormData, status: e.target.value })}
                className="glass-input rounded-xl px-3 py-1.5 text-sm text-on-surface appearance-none"
              >
                <option value="upcoming">Upcoming</option>
                <option value="past">Past</option>
              </select>
            </div>
          </div>

          <button type="submit" className="clay-btn clay-btn-primary px-6 py-3.5 text-sm uppercase tracking-wider w-full mt-4">
            Save Event
          </button>
        </form>
      </div>
    </div>
  );
}


export default memo(EventForm);