const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

interface ApiOptions extends RequestInit {
  token?: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getToken(): string | null {
    return localStorage.getItem('growsmart_access_token');
  }

  private async request<T = any>(endpoint: string, options: ApiOptions = {}): Promise<T> {
    const { token, ...fetchOptions } = options;
    const authToken = token || this.getToken();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(fetchOptions.headers as Record<string, string>),
    };

    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...fetchOptions,
      headers,
    });

    if (response.status === 401) {
      // Try refresh
      const refreshed = await this.tryRefresh();
      if (refreshed && authToken) {
        headers['Authorization'] = `Bearer ${this.getToken()}`;
        const retryResponse = await fetch(`${this.baseUrl}${endpoint}`, { ...fetchOptions, headers });
        if (!retryResponse.ok) {
          const error = await retryResponse.json().catch(() => ({ error: 'Request failed' }));
          throw new Error(error.error || `HTTP ${retryResponse.status}`);
        }
        return retryResponse.json();
      }
      // Clear tokens and redirect to login
      localStorage.removeItem('growsmart_access_token');
      localStorage.removeItem('growsmart_refresh_token');
      window.location.href = '/login';
      throw new Error('Session expired');
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  private async tryRefresh(): Promise<boolean> {
    const refreshToken = localStorage.getItem('growsmart_refresh_token');
    if (!refreshToken) return false;

    try {
      const response = await fetch(`${this.baseUrl}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) return false;

      const data = await response.json();
      localStorage.setItem('growsmart_access_token', data.accessToken);
      localStorage.setItem('growsmart_refresh_token', data.refreshToken);
      return true;
    } catch {
      return false;
    }
  }

  // Auth
  async requestOtp(mobileNumber: string, purpose: string = 'LOGIN') {
    return this.request('/auth/request-otp', {
      method: 'POST',
      body: JSON.stringify({ mobileNumber, purpose }),
    });
  }

  async verifyOtp(mobileNumber: string, otp: string, purpose: string = 'LOGIN') {
    const data = await this.request<{
      message: string;
      user?: any;
      accessToken?: string;
      refreshToken?: string;
      verified?: boolean;
    }>('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ mobileNumber, otp, purpose }),
    });

    if (data.accessToken) {
      localStorage.setItem('growsmart_access_token', data.accessToken);
      localStorage.setItem('growsmart_refresh_token', data.refreshToken!);
    }

    return data;
  }

  async signup(data: any) {
    const result = await this.request<{
      message: string;
      user: any;
      accessToken: string;
      refreshToken: string;
    }>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    localStorage.setItem('growsmart_access_token', result.accessToken);
    localStorage.setItem('growsmart_refresh_token', result.refreshToken);

    return result;
  }

  async pinLogin(mobileNumber: string, pin: string) {
    const data = await this.request<{
      message: string;
      user: any;
      accessToken: string;
      refreshToken: string;
    }>('/auth/pin-login', {
      method: 'POST',
      body: JSON.stringify({ mobileNumber, pin }),
    });

    localStorage.setItem('growsmart_access_token', data.accessToken);
    localStorage.setItem('growsmart_refresh_token', data.refreshToken);

    return data;
  }

  async setPin(pin: string) {
    return this.request('/auth/set-pin', { method: 'POST', body: JSON.stringify({ pin }) });
  }

  async logout() {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } finally {
      localStorage.removeItem('growsmart_access_token');
      localStorage.removeItem('growsmart_refresh_token');
      localStorage.removeItem('growsmart_user');
    }
  }

  async getMe() {
    return this.request<{ user: any }>('/auth/me');
  }

  async updateProfile(data: any) {
    return this.request<{ user: any }>('/auth/profile', { method: 'PUT', body: JSON.stringify(data) });
  }

  // Weather
  async getWeather(latitude: number, longitude: number) {
    return this.request(`/weather?latitude=${latitude}&longitude=${longitude}`);
  }

  // Crops
  async recommendCrops(data: any) {
    return this.request('/crops/recommend', { method: 'POST', body: JSON.stringify(data) });
  }

  async getCropProfiles() {
    return this.request('/crops/profiles');
  }

  async getFarms() {
    return this.request('/crops/farms');
  }

  async createFarm(data: any) {
    return this.request('/crops/farms', { method: 'POST', body: JSON.stringify(data) });
  }

  // Disease
  async detectDisease(image: File, farmId?: string) {
    const formData = new FormData();
    formData.append('image', image);
    if (farmId) formData.append('farmId', farmId);

    const token = this.getToken();
    const response = await fetch(`${this.baseUrl}/disease/detect`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });

    if (!response.ok) throw new Error('Detection failed');
    return response.json();
  }

  async getDiseaseHistory() {
    return this.request('/disease/history');
  }

  // Mandi
  async getMandiPrices(crop?: string, district?: string) {
    const params = new URLSearchParams();
    if (crop) params.set('crop', crop);
    if (district) params.set('district', district);
    return this.request(`/mandi/prices?${params}`);
  }

  async compareMandiPrices(crop: string) {
    return this.request(`/mandi/compare/${crop}`);
  }

  async getMandiCrops() {
    return this.request('/mandi/crops');
  }

  // Equipment
  async getEquipment(params?: { category?: string; available?: boolean; lat?: number; lng?: number }) {
    const query = new URLSearchParams();
    if (params?.category) query.set('category', params.category);
    if (params?.available) query.set('available', 'true');
    if (params?.lat) query.set('lat', String(params.lat));
    if (params?.lng) query.set('lng', String(params.lng));
    return this.request(`/equipment?${query}`);
  }

  async getEquipmentById(id: string) {
    return this.request(`/equipment/${id}`);
  }

  async bookEquipment(id: string, data: { startDate: string; endDate: string; notes?: string }) {
    return this.request(`/equipment/${id}/book`, { method: 'POST', body: JSON.stringify(data) });
  }

  // Schemes
  async getSchemes() {
    return this.request('/schemes');
  }

  async getMatchedSchemes() {
    return this.request('/schemes/match');
  }

  // News
  async getNews(category?: string, language?: string) {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (language) params.set('language', language);
    return this.request(`/news?${params}`);
  }

  async getNewsCategories() {
    return this.request('/news/categories');
  }

  // Dashboard
  async getDashboard() {
    return this.request('/dashboard');
  }

  // Admin
  async getAdminStats() {
    return this.request('/admin/stats');
  }

  async getAdminUsers() {
    return this.request('/admin/users');
  }
}

export const api = new ApiClient(API_BASE);
export default api;
