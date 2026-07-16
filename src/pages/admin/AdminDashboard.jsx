import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const navigate = useNavigate();

  // Statistics
  const [stats, setStats] = useState({ eventsCount: 0, upcomingEvents: 0, newMembers: 0, newContacts: 0 });

  // Data lists
  const [events, setEvents] = useState([]);
  const [members, setMembers] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImageShape, setNewImageShape] = useState('default');

  // Event form modal / state
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null); // null if new, object if editing
  const [eventFormData, setEventFormData] = useState({
    title: '',
    description: '',
    category: 'Education & Skill Development',
    tags: '',
    date: '',
    location: '',
    imageUrl: '',
    status: 'upcoming',
    featured: false
  });

  // Selected Submission Lightbox
  const [selectedSub, setSelectedSub] = useState(null);

  // Filter state for contacts
  const [contactFilter, setContactFilter] = useState('all');

  const categoriesList = [
    'Education & Skill Development',
    'Healthcare & Wellness',
    'Livelihood & Rural Development',
    'Women, Youth & Disability Empowerment',
    'Environment & Sustainability',
    'Culture, Community & Animal Welfare'
  ];

  // Auth check
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const userStr = localStorage.getItem('adminUser');
    if (!token) {
      navigate('/admin/login');
    } else {
      if (userStr) setAdminUser(JSON.parse(userStr));
      fetchDashboardData();
    }
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      // Fetch Events
      const { data: evData, error: evError } = await supabase.from('events').select('*').order('date', { ascending: false });
      
      // Fetch Members
      const { data: mbData, error: mbError } = await supabase.from('members').select('*').order('submittedAt', { ascending: false });

      // Fetch Contacts
      const { data: ctData, error: ctError } = await supabase.from('contact_messages').select('*').order('submittedAt', { ascending: false });

      // Fetch Gallery
      const { data: glData, error: glError } = await supabase.from('gallery').select('*').order('createdAt', { ascending: true });

      if (!evError && !mbError && !ctError && !glError) {
        setEvents(evData || []);
        setMembers(mbData || []);
        setContacts(ctData || []);
        setGallery(glData || []);

        // Compile Stats
        const upcomingCount = (evData || []).filter(e => e.status === 'upcoming').length;
        const newMembersCount = (mbData || []).filter(m => m.status === 'new').length;
        const newContactsCount = (ctData || []).length; // messages total

        setStats({
          eventsCount: (evData || []).length,
          upcomingEvents: upcomingCount,
          newMembers: newMembersCount,
          newContacts: newContactsCount
        });
      } else {
        console.error('Error fetching data from Supabase');
      }
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  // ----- EVENTS CRUD HANDLERS -----
  const openNewEventForm = () => {
    setEditingEvent(null);
    setEventFormData({
      title: '',
      description: '',
      category: 'Education & Skill Development',
      tags: '',
      date: new Date().toISOString().split('T')[0],
      location: '',
      imageUrl: '',
      status: 'upcoming',
      featured: false
    });
    setShowEventForm(true);
  };

  const openEditEventForm = (event) => {
    setEditingEvent(event);
    setEventFormData({
      title: event.title,
      description: event.description,
      category: event.category,
      tags: event.tags || '',
      date: event.date || '',
      location: event.location || '',
      imageUrl: event.imageUrl || '',
      status: event.status,
      featured: event.featured === 1
    });
    setShowEventForm(true);
  };

  const handleEventFormSubmit = async (e) => {
    e.preventDefault();
    try {
      let error;
      if (editingEvent) {
        const { error: updateError } = await supabase.from('events').update(eventFormData).eq('id', editingEvent.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase.from('events').insert([eventFormData]);
        error = insertError;
      }

      if (!error) {
        setShowEventForm(false);
        fetchDashboardData();
      } else {
        alert(error?.message || 'Failed to save event');
      }
    } catch (err) {
      alert('Network error saving event.');
    }
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event? This action is permanent.')) return;
    try {
      const { data, error } = await supabase.from('events').delete().eq('id', id).select();
      if (error) {
        alert('Failed to delete event: ' + error.message);
        console.error('Delete event error:', error);
      } else if (!data || data.length === 0) {
        alert('Failed to delete: You do not have permission or event does not exist.');
      } else {
        fetchDashboardData();
      }
    } catch (err) {
      alert('Error connecting to backend.');
    }
  };

  // ----- MEMBERS WORKFLOW HANDLERS -----
  const handleUpdateMemberStatus = async (id, newStatus) => {
    try {
      const { error } = await supabase.from('members').update({ status: newStatus }).eq('id', id);
      if (!error) {
        // If status changed to active, send email
        if (newStatus === 'active') {
          const memberToUpdate = members.find(m => m.id === id) || selectedSub;
          if (memberToUpdate && memberToUpdate.email) {
            try {
              await fetch(`${import.meta.env.VITE_API_URL || ''}/api/send-active-email`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: memberToUpdate.email, name: memberToUpdate.fullName })
              });
            } catch (emailErr) {
              console.error("Failed to send active email:", emailErr);
            }
          }
        }
        
        fetchDashboardData();
        if (selectedSub && selectedSub.id === id) {
          setSelectedSub(prev => ({ ...prev, status: newStatus }));
        }
      } else {
        alert('Failed to update status.');
      }
    } catch (err) {
      alert('Error updating status.');
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'new': return 'bg-blue-50 border border-blue-200 text-blue-700';
      case 'contacted': return 'bg-yellow-50 border border-yellow-200 text-yellow-700';
      case 'active': return 'bg-green-50 border border-green-200 text-green-700';
      case 'rejected': return 'bg-red-50 border border-red-200 text-red-700';
      default: return 'bg-secondary/10 text-secondary';
    }
  };

  const filteredContacts = contacts.filter(c => {
    if (contactFilter === 'all') return true;
    return c.subject === contactFilter;
  });

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row font-body-md text-on-surface relative overflow-hidden">
      {/* Background glow blobs */}
      <div className="absolute top-[10%] right-[10%] w-[40vw] h-[40vw] rounded-full blur-[135px] opacity-[0.06] bg-primary pointer-events-none z-0"></div>
      <div className="absolute bottom-[10%] left-[20%] w-[45vw] h-[45vw] rounded-full blur-[135px] opacity-[0.06] bg-secondary pointer-events-none z-0"></div>

      {/* Mobile Top Bar */}
      <div className="lg:hidden flex-none h-20 glass-panel border-b border-white/40 flex items-center justify-between px-6 z-40 relative">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 clay-card-colored flex items-center justify-center text-primary shadow-inner overflow-hidden p-0.5">
            <img src="/images/logo.jpeg" alt="Logo" className="w-full h-full object-contain rounded-full mix-blend-multiply" />
          </div>
          <span className="font-headline-md text-lg font-extrabold text-primary">Admin Panel</span>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-primary focus:outline-none w-12 h-12 flex items-center justify-center bg-primary/10 rounded-xl">
          <span className="material-symbols-outlined text-2xl">{isSidebarOpen ? 'close' : 'menu'}</span>
        </button>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 w-64 glass-panel rounded-r-3xl border-r border-white/40 flex flex-col justify-between p-6 z-50 shadow-2xl lg:shadow-lg transition-transform duration-300 ease-in-out`}>
        <div>
          <div className="flex items-center gap-2.5 mb-8 border-b border-secondary/10 pb-4">
            <div className="w-8 h-8 clay-card-colored flex items-center justify-center text-primary shadow-inner overflow-hidden p-0.5">
              <img src="/images/logo.jpeg" alt="Logo" className="w-full h-full object-contain rounded-full mix-blend-multiply" />
            </div>
            <span className="font-headline-md text-base font-extrabold text-primary">Console Panel</span>
          </div>
          
          <nav className="space-y-2">
            <button
              onClick={() => { setActiveTab('overview'); fetchDashboardData(); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm uppercase tracking-wider font-semibold transition-all focus:outline-none ${activeTab === 'overview' ? 'clay-badge-active text-primary shadow-sm' : 'text-on-surface-variant hover:bg-primary/5'}`}
            >
              <span className="material-symbols-outlined text-lg">dashboard</span>
              Dashboard
            </button>
            <button
              onClick={() => { setActiveTab('events'); fetchDashboardData(); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm uppercase tracking-wider font-semibold transition-all focus:outline-none ${activeTab === 'events' ? 'clay-badge-active text-primary shadow-sm' : 'text-on-surface-variant hover:bg-primary/5'}`}
            >
              <span className="material-symbols-outlined text-lg">event_note</span>
              Events
            </button>
            <button
              onClick={() => { setActiveTab('members'); fetchDashboardData(); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm uppercase tracking-wider font-semibold transition-all focus:outline-none ${activeTab === 'members' ? 'clay-badge-active text-primary shadow-sm' : 'text-on-surface-variant hover:bg-primary/5'}`}
            >
              <span className="material-symbols-outlined text-lg">diversity_3</span>
              Members
            </button>
            <button
              onClick={() => { setActiveTab('contacts'); fetchDashboardData(); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm uppercase tracking-wider font-semibold transition-all focus:outline-none ${activeTab === 'contacts' ? 'clay-badge-active text-primary shadow-sm' : 'text-on-surface-variant hover:bg-primary/5'}`}
            >
              <span className="material-symbols-outlined text-lg">inbox</span>
              Enquiries
            </button>
            <button
              onClick={() => { setActiveTab('gallery'); fetchDashboardData(); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm uppercase tracking-wider font-semibold transition-all focus:outline-none ${activeTab === 'gallery' ? 'clay-badge-active text-primary shadow-sm' : 'text-on-surface-variant hover:bg-primary/5'}`}
            >
              <span className="material-symbols-outlined text-lg">collections</span>
              Gallery
            </button>
          </nav>
        </div>

        <div className="border-t border-secondary/10 pt-4 space-y-4">
          <div className="text-sm text-on-surface-variant/80 font-bold truncate">
            Logged in as: <br /><span className="text-primary tracking-wide text-sm">{adminUser?.email || 'Administrator'}</span>
          </div>
          <button
            onClick={handleLogout}
            className="clay-btn clay-btn-primary px-4 py-2.5 text-sm uppercase tracking-wider w-full flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">logout</span> Logout
          </button>
        </div>
      </aside>

      {/* Main Console Content */}
      <main className="flex-1 min-w-0 p-4 lg:p-8 overflow-y-auto h-full lg:max-h-screen relative z-10">
        
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <h1 className="font-headline-lg text-2xl font-bold text-primary tracking-tight">Overview Dashboard</h1>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="glass-panel border-white/40 p-6 rounded-2xl shadow-sm flex items-center gap-4 hover:scale-[1.01] transition-transform">
                <div className="w-12 h-12 clay-card-colored flex items-center justify-center text-primary shadow-inner">
                  <span className="material-symbols-outlined text-2xl font-bold">database</span>
                </div>
                <div>
                  <div className="text-sm font-bold uppercase tracking-wider text-on-surface-variant opacity-75">Total Events</div>
                  <div className="text-2xl font-extrabold text-on-surface mt-0.5">{stats.eventsCount}</div>
                </div>
              </div>
              
              <div className="glass-panel border-white/40 p-6 rounded-2xl shadow-sm flex items-center gap-4 hover:scale-[1.01] transition-transform">
                <div className="w-12 h-12 clay-card-colored flex items-center justify-center text-primary shadow-inner">
                  <span className="material-symbols-outlined text-2xl font-bold">event</span>
                </div>
                <div>
                  <div className="text-sm font-bold uppercase tracking-wider text-on-surface-variant opacity-75">Upcoming Strip</div>
                  <div className="text-2xl font-extrabold text-green-700 mt-0.5">{stats.upcomingEvents}</div>
                </div>
              </div>
              
              <div className="glass-panel border-white/40 p-6 rounded-2xl shadow-sm flex items-center gap-4 hover:scale-[1.01] transition-transform">
                <div className="w-12 h-12 clay-card-colored flex items-center justify-center text-primary shadow-inner">
                  <span className="material-symbols-outlined text-2xl font-bold">mark_as_unread</span>
                </div>
                <div>
                  <div className="text-sm font-bold uppercase tracking-wider text-on-surface-variant opacity-75">New Members</div>
                  <div className="text-2xl font-extrabold text-blue-700 mt-0.5">{stats.newMembers}</div>
                </div>
              </div>
              
              <div className="glass-panel border-white/40 p-6 rounded-2xl shadow-sm flex items-center gap-4 hover:scale-[1.01] transition-transform">
                <div className="w-12 h-12 clay-card-colored flex items-center justify-center text-primary shadow-inner">
                  <span className="material-symbols-outlined text-2xl font-bold">mail</span>
                </div>
                <div>
                  <div className="text-sm font-bold uppercase tracking-wider text-on-surface-variant opacity-75">Total Enquiries</div>
                  <div className="text-2xl font-extrabold text-on-surface mt-0.5">{stats.newContacts}</div>
                </div>
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="glass-panel p-8 rounded-3xl border-white/40 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="font-headline-md text-base font-bold mb-3 text-primary tracking-tight">Event Administration</h3>
                  <p className="text-sm text-on-surface-variant leading-relaxed mb-6 font-light">Create new scheduled events or update past details to drive updates instantly to the public activities strips.</p>
                </div>
                <button onClick={openNewEventForm} className="clay-btn clay-btn-primary px-5 py-2.5 text-sm uppercase tracking-wider self-start shadow-sm">
                  + Create New Event
                </button>
              </div>

              <div className="glass-panel p-8 rounded-3xl border-white/40 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="font-headline-md text-base font-bold mb-3 text-primary tracking-tight">Database Access</h3>
                  <p className="text-sm text-on-surface-variant leading-relaxed mb-6 font-light">View, approve, or filter applications and donation enquiries dynamically as they come in via the contact page.</p>
                </div>
                <div className="flex flex-wrap gap-4">
                  <button onClick={() => setActiveTab('members')} className="clay-btn clay-btn-secondary px-4 py-2 text-sm uppercase tracking-wider shadow-sm">
                    Members Inbox
                  </button>
                  <button onClick={() => setActiveTab('contacts')} className="clay-btn clay-btn-secondary px-4 py-2 text-sm uppercase tracking-wider shadow-sm">
                    View Enquiries
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Events Tab */}
        {activeTab === 'events' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="font-headline-lg text-2xl font-bold text-primary tracking-tight">Manage Events</h1>
              <button onClick={openNewEventForm} className="clay-btn clay-btn-primary px-5 py-2.5 text-sm uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                <span className="material-symbols-outlined text-sm font-bold">add</span> Create Event
              </button>
            </div>

            {/* Events List Table */}
            <div className="glass-panel border border-white/40 rounded-3xl overflow-x-auto shadow-sm">
              <table className="w-full text-left border-collapse text-sm">
                <thead className="bg-primary/5 border-b border-secondary/10 uppercase font-bold text-on-surface-variant text-sm tracking-wider">
                  <tr>
                    <th className="p-4">Title</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Featured</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-secondary/10">
                  {events.length === 0 ? (
                    <tr>
                      <td colspan="6" className="p-8 text-center text-on-surface-variant italic">No events found in database. Create one to get started.</td>
                    </tr>
                  ) : (
                    events.map((e) => (
                      <tr key={e.id} className="hover:bg-primary/5 transition-all">
                        <td className="p-4 font-semibold">{e.title}</td>
                        <td className="p-4 opacity-75">{e.category}</td>
                        <td className="p-4 opacity-75">{e.date || 'No date'}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${e.status === 'upcoming' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-secondary/10 text-secondary'}`}>
                            {e.status}
                          </span>
                        </td>
                        <td className="p-4">
                          {e.featured === 1 ? (
                            <span className="material-symbols-outlined text-yellow-500 text-base" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                          ) : (
                            <span className="opacity-30">—</span>
                          )}
                        </td>
                        <td className="p-4 text-right space-x-3">
                          <button onClick={() => openEditEventForm(e)} className="text-primary hover:underline font-bold">Edit</button>
                          <button onClick={() => handleDeleteEvent(e.id)} className="text-error hover:underline font-bold">Delete</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Event Form Modal */}
            {showEventForm && (
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
                      <label htmlFor="event-image" className="text-sm font-semibold text-on-surface-variant mb-1.5">Image URL</label>
                      <input
                        id="event-image"
                        type="url"
                        value={eventFormData.imageUrl}
                        onChange={(e) => setEventFormData({ ...eventFormData, imageUrl: e.target.value })}
                        className="glass-input rounded-xl p-3 text-sm text-on-surface"
                        placeholder="https://example.com/image.jpg"
                      />
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
            )}
          </div>
        )}

        {/* Members Inbox Tab */}
        {activeTab === 'members' && (
          <div className="space-y-6">
            <h1 className="font-headline-lg text-2xl font-bold text-primary tracking-tight">Membership Applications</h1>
            
            <div className="glass-panel border border-white/40 rounded-3xl overflow-x-auto shadow-sm">
              <table className="w-full text-left border-collapse text-sm">
                <thead className="bg-primary/5 border-b border-secondary/10 uppercase font-bold text-on-surface-variant text-sm tracking-wider">
                  <tr>
                    <th className="p-4">Name</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Phone</th>
                    <th className="p-4">Area of Interest</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-secondary/10">
                  {members.length === 0 ? (
                    <tr>
                      <td colspan="6" className="p-8 text-center text-on-surface-variant italic">No applications found in database.</td>
                    </tr>
                  ) : (
                    members.map((m) => (
                      <tr key={m.id} className="hover:bg-primary/5 transition-all">
                        <td className="p-4 font-semibold">{m.fullName}</td>
                        <td className="p-4 opacity-75">{m.email}</td>
                        <td className="p-4 opacity-75">{m.phone}</td>
                        <td className="p-4 opacity-75">{m.interestArea || 'None selected'}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${getStatusBadgeClass(m.status)}`}>
                            {m.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => setSelectedSub({ ...m, type: 'member' })}
                            className="text-primary hover:underline font-bold"
                          >
                            Open Review
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Enquiries Inbox Tab */}
        {activeTab === 'contacts' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <h1 className="font-headline-lg text-2xl font-bold text-primary tracking-tight">Enquiries Inbox</h1>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {['all', 'general', 'donate', 'volunteer'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setContactFilter(filter)}
                    className={`px-3.5 py-1.5 transition-all text-sm uppercase tracking-wider focus:outline-none ${contactFilter === filter ? 'clay-badge-active text-primary shadow-sm font-bold' : 'clay-badge text-on-surface-variant/80 hover:bg-white'}`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            <div className="glass-panel border border-white/40 rounded-3xl overflow-x-auto shadow-sm">
              <table className="w-full text-left border-collapse text-sm">
                <thead className="bg-primary/5 border-b border-secondary/10 uppercase font-bold text-on-surface-variant text-sm tracking-wider">
                  <tr>
                    <th className="p-4">Name</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Phone</th>
                    <th className="p-4">Type</th>
                    <th className="p-4">Submitted Date</th>
                    <th className="p-4 text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-secondary/10">
                  {filteredContacts.length === 0 ? (
                    <tr>
                      <td colspan="6" className="p-8 text-center text-on-surface-variant italic">No enquiries found in this category.</td>
                    </tr>
                  ) : (
                    filteredContacts.map((c) => (
                      <tr key={c.id} className="hover:bg-primary/5 transition-all">
                        <td className="p-4 font-semibold">{c.name}</td>
                        <td className="p-4 opacity-75">{c.email}</td>
                        <td className="p-4 opacity-75">{c.phone || '—'}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${c.subject === 'donate' ? 'bg-orange-50 border border-orange-200 text-orange-700' : 'bg-secondary/10 text-secondary'}`}>
                            {c.subject.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-4 opacity-60">{c.submittedAt ? c.submittedAt.split('T')[0] : '—'}</td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => setSelectedSub({ ...c, type: 'contact' })}
                            className="text-primary hover:underline font-bold"
                          >
                            Open View
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Gallery Tab */}
        {activeTab === 'gallery' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h1 className="font-headline-lg text-2xl font-bold text-primary tracking-tight">Gallery Management</h1>
            </div>

            <div className="glass-panel border-white/40 p-6 rounded-2xl shadow-sm">
              <h3 className="font-headline-md text-base font-bold text-on-surface mb-4">Add New Image (Auto-Compress)</h3>
              <form onSubmit={async (e) => {
                e.preventDefault();
                const fileInput = e.target.elements.imageFile;
                if (!fileInput.files || fileInput.files.length === 0) return;
                
                const file = fileInput.files[0];
                
                // Read the file
                const reader = new FileReader();
                reader.onload = (event) => {
                  const img = new Image();
                  img.onload = async () => {
                    // Create canvas for compression
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 1200;
                    const MAX_HEIGHT = 1200;
                    let width = img.width;
                    let height = img.height;

                    // Calculate new dimensions
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

                    // Convert to WebP with 0.8 quality (usually yields ~100kb for 1200px images)
                    const base64WebP = canvas.toDataURL('image/webp', 0.8);

                    try {
                      const insertPayload = { imageUrl: base64WebP };
                      if (newImageShape && newImageShape !== 'default') {
                        insertPayload.gridShape = newImageShape;
                      }
                      
                      const { error } = await supabase.from('gallery').insert([insertPayload]);
                      if (!error) {
                        fileInput.value = '';
                        setNewImageShape('default');
                        fetchDashboardData();
                      } else {
                        alert('Failed to upload compressed image');
                      }
                    } catch (err) {
                      alert('Error connecting to backend');
                    }
                  };
                  img.src = event.target.result;
                };
                reader.readAsDataURL(file);
              }} className="flex flex-col gap-5 items-start w-full">
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

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {gallery.map(img => (
                <div key={img.id} className="glass-panel p-2 rounded-2xl relative group overflow-hidden border border-white/40">
                  <div className="aspect-square rounded-xl overflow-hidden bg-black/5">
                    <img src={img.imageUrl} alt="Gallery" className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
                    <button
                      onClick={async () => {
                        if (!window.confirm('Delete this image from gallery?')) return;
                        try {
                          const { data, error } = await supabase.from('gallery').delete().eq('id', img.id).select();
                          if (error) {
                            alert('Failed to delete: ' + error.message);
                            console.error('Delete error:', error);
                          } else if (!data || data.length === 0) {
                            alert('Failed to delete: You do not have permission or image does not exist.');
                          } else {
                            fetchDashboardData();
                          }
                        } catch (err) {
                          alert('Error connecting to backend');
                          console.error(err);
                        }
                      }}
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
          </div>
        )}

        {/* Review Submission Lightbox Modal */}
        {selectedSub && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-surface border border-secondary/20 max-w-lg w-full rounded-[2rem] p-8 shadow-2xl relative">
              <button onClick={() => setSelectedSub(null)} className="absolute top-6 right-6 bg-secondary/10 hover:bg-secondary/20 text-on-surface w-10 h-10 rounded-full flex items-center justify-center transition-colors focus:outline-none">
                <span className="material-symbols-outlined">close</span>
              </button>

              <div className="flex items-center gap-3 mb-8 border-b border-secondary/10 pb-4">
                <span className="material-symbols-outlined text-primary text-3xl font-bold">folder_shared</span>
                <h3 className="font-sans text-2xl font-extrabold text-on-surface tracking-tight">
                  {selectedSub.type === 'member' ? 'Member Application' : 'Enquiry Detail'}
                </h3>
              </div>

              <div className="space-y-6 font-sans">
                <div>
                  <div className="text-sm uppercase font-bold text-on-surface-variant/70 tracking-wider mb-1">Submitted By</div>
                  <div className="text-xl font-bold text-on-surface">{selectedSub.fullName || selectedSub.name}</div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="text-sm uppercase font-bold text-on-surface-variant/70 tracking-wider mb-1">Email Address</div>
                    <div className="font-semibold text-primary text-lg truncate"><a href={`mailto:${selectedSub.email}`}>{selectedSub.email}</a></div>
                  </div>
                  <div>
                    <div className="text-sm uppercase font-bold text-on-surface-variant/70 tracking-wider mb-1">Phone Number</div>
                    <div className="font-semibold text-on-surface text-lg">{selectedSub.phone || '—'}</div>
                  </div>
                </div>

                {selectedSub.type === 'member' ? (
                  <>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <div className="text-sm uppercase font-bold text-on-surface-variant/70 tracking-wider mb-1">Focus Area</div>
                        <div className="font-bold text-secondary text-base">{selectedSub.interestArea || 'None selected'}</div>
                      </div>
                      <div>
                        <div className="text-sm uppercase font-bold text-on-surface-variant/70 tracking-wider mb-1">Current Status</div>
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-extrabold uppercase mt-1 ${getStatusBadgeClass(selectedSub.status)}`}>
                          {selectedSub.status}
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm uppercase font-bold text-on-surface-variant/70 tracking-wider mb-1">Full Address</div>
                      <div className="text-on-surface-variant text-base leading-relaxed font-medium bg-secondary/5 p-3 rounded-xl">{selectedSub.address || '—'}</div>
                    </div>
                  </>
                ) : (
                  <div>
                    <div className="text-sm uppercase font-bold text-on-surface-variant/70 tracking-wider mb-1">Enquiry Topic</div>
                    <span className="inline-block bg-secondary/10 text-secondary text-sm font-bold uppercase px-3 py-1 rounded-lg mt-1">
                      {selectedSub.subject}
                    </span>
                  </div>
                )}

                <div>
                  <div className="text-sm uppercase font-bold text-on-surface-variant/70 tracking-wider mb-2">Message / Cover Note</div>
                  <div className="bg-secondary/5 p-5 rounded-2xl border border-secondary/10 text-on-surface-variant text-base leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap font-medium">
                    {selectedSub.message ? `"${selectedSub.message}"` : 'No message provided.'}
                  </div>
                </div>

                {/* Workflow actions for Membership Applications */}
                {selectedSub.type === 'member' && (
                  <div className="border-t border-secondary/15 pt-6 mt-6">
                    <div className="text-sm uppercase font-bold text-on-surface-variant/70 tracking-wider mb-3">Update Application Workflow</div>
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => handleUpdateMemberStatus(selectedSub.id, 'contacted')}
                        className="px-5 py-2.5 rounded-xl text-sm font-bold bg-yellow-400 text-yellow-950 hover:bg-yellow-500 transition-colors shadow-sm"
                      >
                        Set Contacted
                      </button>
                      <button
                        onClick={() => handleUpdateMemberStatus(selectedSub.id, 'active')}
                        className="px-5 py-2.5 rounded-xl text-sm font-bold bg-green-600 text-white hover:bg-green-700 transition-colors shadow-sm flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[18px]">check_circle</span>
                        Mark Active
                      </button>
                      <button
                        onClick={() => handleUpdateMemberStatus(selectedSub.id, 'rejected')}
                        className="px-5 py-2.5 rounded-xl text-sm font-bold bg-red-100 text-red-700 hover:bg-red-200 transition-colors ml-auto"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
