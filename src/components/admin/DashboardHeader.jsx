import React, { memo } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';

const DashboardHeader = function({ adminUser, setIsSidebarOpen }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  return (
    <header className="bg-surface/50 backdrop-blur-md border-b border-secondary/10 sticky top-0 z-30 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="lg:hidden p-2 -ml-2 text-on-surface hover:bg-secondary/10 rounded-xl transition-colors"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:block text-right">
          <p className="text-sm font-bold text-on-surface">{adminUser?.email || 'Admin User'}</p>
          <p className="text-xs text-on-surface-variant">Administrator</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
        </div>
        <button 
          onClick={handleLogout}
          className="ml-2 p-2.5 text-error hover:bg-error/10 rounded-xl transition-colors group flex items-center gap-2"
          title="Logout"
        >
          <span className="material-symbols-outlined group-hover:scale-110 transition-transform">logout</span>
        </button>
      </div>
    </header>
  );
}


export default memo(DashboardHeader);