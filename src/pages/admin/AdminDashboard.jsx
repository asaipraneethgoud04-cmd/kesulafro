import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

// Custom Hooks
import { useEvents } from '../../hooks/useEvents';
import { useGallery } from '../../hooks/useGallery';
import { useMembers } from '../../hooks/useMembers';
import { useContacts } from '../../hooks/useContacts';

// Modular Components
import DashboardSidebar from '../../components/admin/DashboardSidebar';
import DashboardHeader from '../../components/admin/DashboardHeader';
import StatisticsCards from '../../components/admin/StatisticsCards';
import EventTable from '../../components/admin/Events/EventTable';
import EventForm from '../../components/admin/Events/EventForm';
import MemberTable from '../../components/admin/Members/MemberTable';
import ContactTable from '../../components/admin/Contacts/ContactTable';
import GalleryGrid from '../../components/admin/Gallery/GalleryGrid';
import GalleryUploader from '../../components/admin/Gallery/GalleryUploader';
import ReviewModal from '../../components/admin/Shared/ReviewModal';
import { EVENT_CATEGORIES } from '../../constants/categories';
import { useCategories } from '../../hooks/useCategories';
import CategorySection from '../../components/admin/Categories/CategorySection';
import { useDonations } from '../../hooks/useDonations';
import DonationTable from '../../components/admin/Donations/DonationTable';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const navigate = useNavigate();

  // Custom Hooks
  const { events, fetchEvents, createEvent, updateEvent, deleteEvent } = useEvents();
  const { gallery, fetchGallery, addImage, deleteImage, updateImageShape } = useGallery();
  const { members, fetchMembers, updateMemberStatus } = useMembers();
  const { donations, fetchDonations, deleteDonation } = useDonations();
  const { contacts, fetchContacts } = useContacts();
  const { 
    categories, 
    isLoading: isLoadingCategories, 
    error: categoriesError, 
    fetchCategories, 
    createCategory, 
    deleteCategory 
  } = useCategories();

  // State
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [eventFormData, setEventFormData] = useState({
    title: '', description: '', category: 'Education & Skill Development',
    tags: '', date: '', location: '', imageUrl: '', status: 'upcoming', featured: false
  });
  const [selectedSub, setSelectedSub] = useState(null);
  const [contactFilter, setContactFilter] = useState('all');
  const [selectedAdminCategory, setSelectedAdminCategory] = useState('All');

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const userStr = localStorage.getItem('adminUser');
    if (!token) {
      navigate('/admin/login');
    } else {
      if (userStr) setAdminUser(JSON.parse(userStr));
      fetchEvents();
      fetchGallery();
      fetchMembers();
      fetchContacts();
      fetchCategories();
      fetchDonations();
    }
  }, [navigate, fetchEvents, fetchGallery, fetchMembers, fetchContacts, fetchCategories, fetchDonations]);

  const stats = {
    eventsCount: events.length,
    upcomingEvents: events.filter(e => e.status === 'upcoming').length,
    newMembers: members.filter(m => m.status === 'new').length,
    newContacts: contacts.length
  };

  const filteredContacts = contactFilter === 'all' 
    ? contacts 
    : contacts.filter(c => c.subject === contactFilter);

  const filteredEvents = selectedAdminCategory === 'All'
    ? events
    : events.filter(e => e.category === selectedAdminCategory);

  const openNewEventForm = () => {
    setEditingEvent(null);
    const defaultCat = categories.length > 0 ? categories[0].name : 'Education & Skill Development';
    setEventFormData({
      title: '', description: '', category: defaultCat,
      tags: '', date: new Date().toISOString().split('T')[0], location: '',
      imageUrl: '', status: 'upcoming', featured: false
    });
    setShowEventForm(true);
  };

  const openEditEventForm = (event) => {
    setEditingEvent(event);
    
    let formattedDate = '';
    if (event.date) {
      if (event.date.includes('T')) {
        formattedDate = event.date.split('T')[0];
      } else if (event.date.includes(' ')) {
        formattedDate = event.date.split(' ')[0];
      } else {
        formattedDate = event.date;
      }
    }

    setEventFormData({
      title: event.title, description: event.description, category: event.category,
      tags: event.tags || '', date: formattedDate, location: event.location || '',
      imageUrl: event.imageUrl || '', status: event.status, featured: event.featured === 1 || event.featured === true
    });
    setShowEventForm(true);
  };

  const handleEventFormSubmit = async (e) => {
    e.preventDefault();
    
    if (eventFormData.status === 'upcoming' && eventFormData.date) {
      const selectedDate = new Date(eventFormData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        alert("An 'Upcoming' event cannot have a date in the past.");
        return;
      }
    }

    let success = false;
    if (editingEvent) {
      success = await updateEvent(editingEvent.id, eventFormData);
    } else {
      success = await createEvent(eventFormData);
    }
    if (success) {
      setShowEventForm(false);
    } else {
      alert('Failed to save event');
    }
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event? This action is permanent.')) return;
    const success = await deleteEvent(id);
    if (!success) alert('Failed to delete event');
  };

  const handleUpdateMemberStatus = async (id, newStatus) => {
    const success = await updateMemberStatus(id, newStatus);
    if (success) {
      setSelectedSub(prev => prev ? { ...prev, status: newStatus } : null);
    } else {
      alert('Failed to update status');
    }
  };

  return (
    <div className="min-h-screen bg-background flex text-on-surface font-sans selection:bg-primary/20">
      
      <DashboardSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
      />

      <main className="flex-1 min-w-0 flex flex-col h-screen overflow-y-auto bg-gradient-to-br from-background via-surface to-background">
        <DashboardHeader 
          adminUser={adminUser} 
          setIsSidebarOpen={setIsSidebarOpen} 
        />

        <div className="p-6 md:p-10 max-w-7xl mx-auto w-full space-y-10">
          
          {activeTab === 'overview' && (
            <div className="space-y-10 fade-in-up">
              <div>
                <h1 className="font-headline-lg text-3xl font-black text-primary tracking-tight mb-2">Welcome Back!</h1>
                <p className="text-on-surface-variant font-medium">Here's a quick overview of what's happening at Kesula Trust today.</p>
              </div>
              <StatisticsCards stats={stats} />
            </div>
          )}

          {activeTab === 'events' && (
            <div className="space-y-6 fade-in-up">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <h1 className="font-headline-lg text-2xl font-bold text-primary tracking-tight">Manage Events</h1>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2">
                    <label htmlFor="admin-category-filter" className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Filter:</label>
                    <select
                      id="admin-category-filter"
                      value={selectedAdminCategory}
                      onChange={(e) => setSelectedAdminCategory(e.target.value)}
                      className="glass-input rounded-xl px-3.5 py-2 text-sm text-on-surface select-arrow"
                      style={{ minWidth: '180px' }}
                    >
                      <option value="All">All Categories</option>
                      {categories.map(c => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <button onClick={openNewEventForm} className="clay-btn clay-btn-primary px-6 py-2.5 text-sm uppercase tracking-wider flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">add</span>
                    Create Event
                  </button>
                </div>
              </div>
              <EventTable 
                events={filteredEvents} 
                openEditEventForm={openEditEventForm} 
                handleDeleteEvent={handleDeleteEvent} 
              />
              <EventForm 
                showEventForm={showEventForm}
                setShowEventForm={setShowEventForm}
                editingEvent={editingEvent}
                eventFormData={eventFormData}
                setEventFormData={setEventFormData}
                handleEventFormSubmit={handleEventFormSubmit}
                categoriesList={categories.map(c => c.name)}
              />
            </div>
          )}

          {activeTab === 'categories' && (
            <div className="fade-in-up">
              <CategorySection 
                categories={categories}
                isLoading={isLoadingCategories}
                error={categoriesError}
                createCategory={createCategory}
                deleteCategory={deleteCategory}
              />
            </div>
          )}

          {activeTab === 'members' && (
            <div className="fade-in-up">
              <MemberTable 
                members={members} 
                setSelectedSub={setSelectedSub} 
              />
            </div>
          )}

          {activeTab === 'contacts' && (
            <div className="fade-in-up">
              <ContactTable 
                contacts={contacts} 
                filteredContacts={filteredContacts}
                contactFilter={contactFilter}
                setContactFilter={setContactFilter}
                setSelectedSub={setSelectedSub} 
              />
            </div>
          )}

          {activeTab === 'donations' && (
            <div className="fade-in-up">
              <DonationTable 
                donations={donations} 
                handleDeleteDonation={deleteDonation} 
              />
            </div>
          )}

          {activeTab === 'gallery' && (
            <div className="space-y-8 fade-in-up">
              <h1 className="font-headline-lg text-2xl font-bold text-primary tracking-tight">Gallery Management</h1>
              <GalleryUploader 
                onImageAdded={(data) => addImage(data)} 
              />
              <GalleryGrid 
                gallery={gallery} 
                handleDeleteImage={deleteImage} 
                handleUpdateImageShape={updateImageShape}
              />
            </div>
          )}

        </div>
      </main>

      <ReviewModal 
        selectedSub={selectedSub} 
        setSelectedSub={setSelectedSub} 
        handleUpdateMemberStatus={handleUpdateMemberStatus} 
      />
      
    </div>
  );
}
