import { useState, useCallback } from 'react';
import { donationService } from '../services/donationService';

export const useDonations = () => {
  const [donations, setDonations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDonations = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await donationService.getDonations();
      setDonations(data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteDonation = async (id) => {
    try {
      await donationService.deleteDonation(id);
      await fetchDonations();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  return {
    donations,
    isLoading,
    error,
    fetchDonations,
    deleteDonation
  };
};
