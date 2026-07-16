import { GeoLocation } from '../../types/weather';

const searchCache = new Map<string, GeoLocation[]>();
let currentRequestId = 0;

export async function searchLocationsMulti(query: string): Promise<GeoLocation[]> {
  const key = query.toLowerCase().trim();
  if (searchCache.has(key)) return searchCache.get(key)!;

  const requestId = ++currentRequestId;

  // Provider 1: Open-Meteo Geocoding (primary)
  try {
    const res = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=8&language=en&format=json`
    );
    const data = await res.json();
    if (requestId !== currentRequestId) return [];
    if (data.results && data.results.length > 0) {
      const results: GeoLocation[] = data.results.map((r: any) => ({
        name: r.name,
        latitude: r.latitude,
        longitude: r.longitude,
        country: r.country || 'India',
        admin1: r.admin1 || '',
      }));
      searchCache.set(key, results);
      return results;
    }
  } catch { /* fall through */ }

  // Provider 2: Nominatim / OpenStreetMap (fallback for villages)
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query + ', India')}&format=json&limit=8&addressdetails=1`,
      { headers: { 'Accept': 'application/json' } }
    );
    const data = await res.json();
    if (requestId !== currentRequestId) return [];
    if (data.length > 0) {
      const results: GeoLocation[] = data.map((r: any) => ({
        name: r.address?.village || r.address?.town || r.address?.city || r.display_name.split(',')[0],
        latitude: parseFloat(r.lat),
        longitude: parseFloat(r.lon),
        country: r.address?.country || 'India',
        admin1: r.address?.state || r.address?.county || '',
      }));
      searchCache.set(key, results);
      return results;
    }
  } catch { /* fall through */ }

  // Provider 3: Geoapify (final fallback)
  try {
    const res = await fetch(
      `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(query + ', India')}&limit=8&apiKey=demo`,
    );
    const data = await res.json();
    if (requestId !== currentRequestId) return [];
    if (data.features && data.features.length > 0) {
      const results: GeoLocation[] = data.features.map((f: any) => ({
        name: f.properties.name || f.properties.formatted?.split(',')[0] || query,
        latitude: f.geometry.coordinates[1],
        longitude: f.geometry.coordinates[0],
        country: f.properties.country || 'India',
        admin1: f.properties.state || f.properties.county || '',
      }));
      searchCache.set(key, results);
      return results;
    }
  } catch { /* fall through */ }

  return [];
}
