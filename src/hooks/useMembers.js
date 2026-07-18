import { useState, useCallback } from 'react';
import { memberService } from '../services/memberService';

export const useMembers = () => {
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMembers = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await memberService.getMembers();
      setMembers(data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateMemberStatus = async (id, newStatus) => {
    try {
      await memberService.updateMemberStatus(id, newStatus);
      await fetchMembers();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const deleteMember = async (id) => {
    try {
      await memberService.deleteMember(id);
      await fetchMembers();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  return {
    members,
    isLoading,
    error,
    fetchMembers,
    updateMemberStatus,
    deleteMember
  };
};
