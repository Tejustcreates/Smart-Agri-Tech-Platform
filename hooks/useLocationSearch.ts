import { useState, useCallback, useRef, useEffect } from 'react';
import { GeoLocation } from '../types/weather';
import { searchLocationsMulti } from '../services/weather/geocoding';

export function useLocationSearch() {
  const [searchResults, setSearchResults] = useState<GeoLocation[]>([]);
  const [searching, setSearching] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const queryRef = useRef('');

  const search = useCallback((query: string) => {
    queryRef.current = query;
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (query.length < 2) {
      setSearchResults([]);
      setSearching(false);
      return;
    }

    setSearching(true);
    debounceRef.current = setTimeout(async () => {
      const results = await searchLocationsMulti(query);
      if (queryRef.current === query) {
        setSearchResults(results);
        setSearching(false);
      }
    }, 350);
  }, []);

  const clearResults = useCallback(() => {
    setSearchResults([]);
    setSearching(false);
  }, []);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return { searchResults, searching, search, clearResults };
}
