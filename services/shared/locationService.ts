export interface GpsLocation {
  lat: number;
  lng: number;
  address: string;
  village: string;
  pincode: string;
  state: string;
  district: string;
}

export async function reverseGeocode(lat: number, lng: number): Promise<GpsLocation> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=16&addressdetails=1`,
      { headers: { 'Accept-Language': 'en' } }
    );
    const data = await res.json();
    const addr = data.address || {};
    return {
      lat,
      lng,
      address: data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
      village: addr.village || addr.town || addr.city || addr.suburb || addr.county || '',
      pincode: addr.postcode || '',
      state: addr.state || '',
      district: addr.county || addr.district || addr.state_district || '',
    };
  } catch {
    return { lat, lng, address: `${lat.toFixed(4)}, ${lng.toFixed(4)}`, village: '', pincode: '', state: '', district: '' };
  }
}
