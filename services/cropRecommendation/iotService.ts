import { SensorPayload, SensorStatus } from '../../types/sensor';

type Subscriber = (data: SensorPayload) => void;

let intervalId: ReturnType<typeof setInterval> | null = null;
let subscribers: Subscriber[] = [];
let latestData: SensorPayload | null = null;

function randomInRange(min: number, max: number): number {
  return Math.round((min + Math.random() * (max - min)) * 100) / 100;
}

function generateSensorData(): SensorPayload {
  const prev = latestData;
  const drift = (current: number, min: number, max: number, maxDelta: number) => {
    const delta = (Math.random() - 0.5) * maxDelta * 2;
    return Math.round(Math.max(min, Math.min(max, (prev ? current + delta : randomInRange(min, max)))) * 100) / 100;
  };

  const n = drift(prev?.nitrogen ?? 50, 20, 90, 2);
  const p = drift(prev?.phosphorus ?? 35, 10, 60, 1.5);
  const k = drift(prev?.potassium ?? 35, 15, 60, 1.5);
  const moisture = drift(prev?.moisture ?? 55, 25, 80, 1);
  const temp = drift(prev?.temperature ?? 27, 18, 38, 0.5);
  const humidity = drift(prev?.humidity ?? 65, 40, 90, 1.5);
  const rainfall = prev ? Math.max(0, prev.rainfall + (Math.random() - 0.4) * 3) : randomInRange(0, 250);
  const ph = drift(prev?.ph ?? 6.5, 4.5, 8.5, 0.05);
  const light = drift(prev?.light ?? 800, 300, 1200, 15);
  const ec = drift(prev?.ec ?? 1.2, 0.3, 2.5, 0.05);

  latestData = { nitrogen: n, phosphorus: p, potassium: k, moisture, temperature: temp, humidity, rainfall, ph, light, ec, timestamp: Date.now() };
  return latestData;
}

export const iotService = {
  connect(): SensorStatus {
    return { connected: true, battery: 78 + Math.floor(Math.random() * 20), wifi: 60 + Math.floor(Math.random() * 40), lastSync: Date.now() };
  },

  disconnect(): SensorStatus {
    if (intervalId) { clearInterval(intervalId); intervalId = null; }
    return { connected: false, battery: 0, wifi: 0, lastSync: null };
  },

  sync(): SensorPayload {
    const data = generateSensorData();
    subscribers.forEach(fn => fn(data));
    return data;
  },

  getLatestSensorData(): SensorPayload {
    return latestData ?? generateSensorData();
  },

  startLiveUpdates(intervalMs: number = 3000): void {
    if (intervalId) clearInterval(intervalId);
    latestData = generateSensorData();
    subscribers.forEach(fn => fn(latestData!));
    intervalId = setInterval(() => {
      const data = generateSensorData();
      subscribers.forEach(fn => fn(data));
    }, intervalMs);
  },

  stopLiveUpdates(): void {
    if (intervalId) { clearInterval(intervalId); intervalId = null; }
  },

  subscribe(fn: Subscriber): () => void {
    subscribers.push(fn);
    return () => { subscribers = subscribers.filter(s => s !== fn); };
  },
};
