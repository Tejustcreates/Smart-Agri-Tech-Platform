import { useState, useCallback } from 'react';
import { reverseGeocode, GpsLocation } from '../services/shared/locationService';

export type GpsStatus = 'idle' | 'loading' | 'granted' | 'denied';

export function useGpsLocation(autoDetect = false) {
  const [location, setLocation] = useState<GpsLocation | null>(null);
  const [status, setStatus] = useState<GpsStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const detect = useCallback(() => {
    if (!navigator.geolocation) {
      setStatus('denied');
      setError('Geolocation is not supported by your browser');
      return;
    }
    setStatus('loading');
    setError(null);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const geo = await reverseGeocode(lat, lng);
        setLocation(geo);
        setStatus('granted');
      },
      () => {
        setStatus('denied');
        setError('GPS permission denied. Please allow location access or select manually.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  const setManual = useCallback(async (lat: number, lng: number) => {
    setStatus('loading');
    const geo = await reverseGeocode(lat, lng);
    setLocation(geo);
    setStatus('granted');
  }, []);

  const reset = useCallback(() => {
    setLocation(null);
    setStatus('idle');
    setError(null);
  }, []);

  return { location, status, error, detect, setManual, reset };
}
