import React, { memo } from 'react';

const DashboardSidebar = function({ activeTab, setActiveTab, isOpen, setIsOpen }) {
  const navItems = [
    { id: 'overview', icon: 'dashboard', label: 'Overview' },
    { id: 'events', icon: 'event', label: 'Events' },
    { id: 'categories', icon: 'category', label: 'Categories' },
    { id: 'gallery', icon: 'image', label: 'Gallery' },
    { id: 'members', icon: 'groups', label: 'Members' },
    { id: 'contacts', icon: 'forum', label: 'Enquiries' },
    { id: 'donations', icon: 'payments', label: 'Donations' }
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 w-72 bg-surface border-r border-secondary/10 z-50 transform transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="h-full flex flex-col p-6">
          <div className="flex items-center gap-3 mb-10 px-2 pt-2">
            <span className="material-symbols-outlined text-primary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>admin_panel_settings</span>
            <div>
              <h2 className="font-sans text-xl font-black text-on-surface tracking-tight leading-tight">Admin</h2>
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest opacity-80">Portal</p>
            </div>
          </div>

          <nav className="flex-1 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-200 ${
                  activeTab === item.id 
                    ? 'bg-primary text-white shadow-md shadow-primary/20 scale-[1.02] font-bold' 
                    : 'text-on-surface-variant hover:bg-secondary/10 hover:text-primary font-semibold'
                }`}
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: activeTab === item.id ? "'FILL' 1" : "'FILL' 0" }}>
                  {item.icon}
                </span>
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}


export default memo(DashboardSidebar);