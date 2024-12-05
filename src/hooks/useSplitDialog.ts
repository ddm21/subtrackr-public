import { useState, useEffect } from 'react';
import type { Subscription, SplitParticipant } from '@/types/subscription';

export function useSplitDialog(subscription: Subscription | null) {
  const [participants, setParticipants] = useState<SplitParticipant[]>([
    { phoneNumber: '', hasPaid: false },
  ]);

  // Reset participants when subscription changes
  useEffect(() => {
    setParticipants([{ phoneNumber: '', hasPaid: false }]);
  }, [subscription?.id]); // Reset when subscription ID changes

  const addParticipant = () => {
    if (participants.length < 5) {
      setParticipants([...participants, { phoneNumber: '', hasPaid: false }]);
    }
  };

  const removeParticipant = (index: number) => {
    if (participants.length > 1) {
      setParticipants(participants.filter((_, i) => i !== index));
    }
  };

  const updateParticipant = (index: number, phoneNumber: string) => {
    const updated = [...participants];
    updated[index] = { ...updated[index], phoneNumber };
    setParticipants(updated);
  };

  const resetParticipants = () => {
    setParticipants([{ phoneNumber: '', hasPaid: false }]);
  };

  return {
    participants,
    addParticipant,
    removeParticipant,
    updateParticipant,
    resetParticipants,
  };
}