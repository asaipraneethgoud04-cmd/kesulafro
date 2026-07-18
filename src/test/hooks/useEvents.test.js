import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useEvents } from '../../hooks/useEvents';
import { eventService } from '../../services/eventService';

// Mock the event service
vi.mock('../../services/eventService', () => ({
  eventService: {
    getEvents: vi.fn(),
    createEvent: vi.fn(),
    updateEvent: vi.fn(),
    deleteEvent: vi.fn(),
  }
}));

describe('useEvents', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useEvents());
    expect(result.current.events).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('should fetch events successfully', async () => {
    const mockEvents = [{ id: 1, title: 'Event 1' }];
    eventService.getEvents.mockResolvedValue(mockEvents);

    const { result } = renderHook(() => useEvents());
    
    await act(async () => {
      await result.current.fetchEvents();
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.events).toEqual(mockEvents);
    expect(result.current.error).toBe(null);
    expect(eventService.getEvents).toHaveBeenCalledTimes(1);
  });

  it('should handle fetch events error', async () => {
    eventService.getEvents.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useEvents());
    
    await act(async () => {
      await result.current.fetchEvents();
    });

    expect(result.current.events).toEqual([]);
    expect(result.current.error).toBe('Network error');
  });

  it('should create event successfully', async () => {
    eventService.createEvent.mockResolvedValue({ id: 2 });
    eventService.getEvents.mockResolvedValue([{ id: 2 }]);

    const { result } = renderHook(() => useEvents());
    
    let success;
    await act(async () => {
      success = await result.current.createEvent({ title: 'New' });
    });

    expect(success).toBe(true);
    expect(eventService.createEvent).toHaveBeenCalledWith({ title: 'New' });
    expect(eventService.getEvents).toHaveBeenCalledTimes(1);
  });
});
