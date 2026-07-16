import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // If token exists, direct to dashboard
    const token = localStorage.getItem('adminToken');
    if (token) {
      navigate('/admin');
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (!authError && data.session) {
        localStorage.setItem('adminToken', data.session.access_token);
        localStorage.setItem('adminUser', JSON.stringify(data.user));
        navigate('/admin');
      } else {
        setError(authError?.message || 'Invalid credentials.');
      }
    } catch (err) {
      setError('Connection failed. Please check if the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-background flex items-center justify-center px-gutter font-body-md overflow-hidden">
      {/* Background glow blobs */}
      <div className="absolute top-[10%] left-[10%] w-[40vw] h-[40vw] rounded-full blur-[130px] opacity-10 bg-primary pointer-events-none z-0"></div>
      <div className="absolute bottom-[10%] right-[10%] w-[40vw] h-[40vw] rounded-full blur-[130px] opacity-[0.08] bg-secondary pointer-events-none z-0"></div>

      <div className="glass-panel max-w-md w-full p-8 rounded-3xl border border-white/40 shadow-xl relative z-10">
        
        {/* Title */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 clay-card-colored flex items-center justify-center mx-auto mb-4 text-primary shadow-inner">
            <span className="material-symbols-outlined text-2xl font-bold">admin_panel_settings</span>
          </div>
          <h1 className="font-headline-lg text-2xl font-extrabold text-on-surface tracking-tight">Admin Portal</h1>
          <p className="text-xs text-on-surface-variant mt-2 font-light">Kesula Charitable Trust Management Console</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-error p-3.5 rounded-xl text-xs font-semibold mb-5 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-on-surface-variant mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="glass-input rounded-xl p-3 outline-none text-sm text-on-surface"
              placeholder="admin@kesulatrust.org"
              required
            />
          </div>
          
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-on-surface-variant mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="glass-input rounded-xl p-3 outline-none text-sm text-on-surface"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="clay-btn clay-btn-primary px-6 py-3.5 text-xs uppercase tracking-wider w-full mt-4 disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center mt-6">
          <a href="/" className="text-xs text-secondary hover:text-primary hover:underline font-bold transition-all">← Return to Public Site</a>
        </div>

      </div>
    </div>
  );
}
