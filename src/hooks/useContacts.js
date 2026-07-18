import { useState, useCallback } from 'react';
import { contactService } from '../services/contactService';

export const useContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchContacts = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await contactService.getContacts();
      setContacts(data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteContact = async (id) => {
    try {
      await contactService.deleteContact(id);
      await fetchContacts();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  return {
    contacts,
    isLoading,
    error,
    fetchContacts,
    deleteContact
  };
};
