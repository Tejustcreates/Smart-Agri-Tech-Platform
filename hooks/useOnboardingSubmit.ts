import { useCallback, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import type { OnboardingValues } from '../components/auth/OnboardingForm';

/** Shared submit handler for the onboarding form (used by AuthModal and the standalone Onboarding page). */
export function useOnboardingSubmit(onSuccess: (user: any) => void) {
  const { updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = useCallback(async (values: OnboardingValues) => {
    setError('');
    setLoading(true);
    try {
      const { user } = await api.updateProfile({
        village: values.village,
        taluka: values.taluka,
        district: values.district,
        state: values.state,
        landholdingSize: values.landholdingSize,
        farmerCategory: values.farmerCategory,
      });
      updateUser(user);
      onSuccess(user);
    } catch (err: any) {
      setError(err.message || 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  }, [updateUser, onSuccess]);

  return { submit, loading, error };
}
