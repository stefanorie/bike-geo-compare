import { useState, useEffect } from 'react';
import type { RiderProfile } from '../data/types';

const STORAGE_KEY = 'bike-geo-rider-profile';

export function useRiderProfile() {
  const [profile, setProfileState] = useState<RiderProfile>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  }, [profile]);

  const setProfile = (patch: Partial<RiderProfile>) => {
    setProfileState((prev) => ({ ...prev, ...patch }));
  };

  return { profile, setProfile };
}
