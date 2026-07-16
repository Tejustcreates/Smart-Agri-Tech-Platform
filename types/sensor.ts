export interface SensorPayload {
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  moisture: number;
  temperature: number;
  humidity: number;
  rainfall: number;
  ph: number;
  light: number;
  ec: number;
  timestamp: number;
}

export interface SensorStatus {
  connected: boolean;
  battery: number;
  wifi: number;
  lastSync: number | null;
}
