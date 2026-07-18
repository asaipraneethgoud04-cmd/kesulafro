import { useState, useCallback } from 'react';
import { eventService } from '../services/eventService';

export const useEvents = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEvents = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await eventService.getEvents();
      setEvents(data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createEvent = async (eventData) => {
    try {
      await eventService.createEvent(eventData);
      await fetchEvents();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const updateEvent = async (id, eventData) => {
    try {
      await eventService.updateEvent(id, eventData);
      await fetchEvents();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const deleteEvent = async (id) => {
    try {
      await eventService.deleteEvent(id);
      await fetchEvents();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  return {
    events,
    isLoading,
    error,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent
  };
};
