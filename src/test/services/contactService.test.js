import { describe, it, expect, vi, beforeEach } from 'vitest';
import { contactService } from '../../services/contactService';
import { supabase } from '../../lib/supabase';

vi.mock('../../lib/supabase', () => ({
  supabase: {
    from: vi.fn(),
  }
}));

describe('contactService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch contacts correctly', async () => {
    const mockData = [{ id: 1, name: 'John Doe' }];
    const mockOrder = vi.fn().mockResolvedValue({ data: mockData, error: null });
    const mockSelect = vi.fn().mockReturnValue({ order: mockOrder });
    supabase.from.mockReturnValue({ select: mockSelect });

    const result = await contactService.getContacts();

    expect(supabase.from).toHaveBeenCalledWith('contact_messages');
    expect(mockSelect).toHaveBeenCalledWith('id, name, email, phone, subject, message, submittedAt');
    expect(mockOrder).toHaveBeenCalledWith('submittedAt', { ascending: false });
    expect(result).toEqual(mockData);
  });

  it('should throw error when fetching contacts fails', async () => {
    const mockError = new Error('Database error');
    const mockOrder = vi.fn().mockResolvedValue({ data: null, error: mockError });
    const mockSelect = vi.fn().mockReturnValue({ order: mockOrder });
    supabase.from.mockReturnValue({ select: mockSelect });

    await expect(contactService.getContacts()).rejects.toThrow('Database error');
  });

  it('should delete a contact successfully', async () => {
    const mockEq = vi.fn().mockResolvedValue({ error: null });
    const mockDelete = vi.fn().mockReturnValue({ eq: mockEq });
    supabase.from.mockReturnValue({ delete: mockDelete });

    const result = await contactService.deleteContact(123);

    expect(supabase.from).toHaveBeenCalledWith('contact_messages');
    expect(mockDelete).toHaveBeenCalled();
    expect(mockEq).toHaveBeenCalledWith('id', 123);
    expect(result).toBe(true);
  });
});
