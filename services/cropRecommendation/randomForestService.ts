import { CropPrediction, PredictionResult } from '../../types/prediction';
import { SensorPayload } from '../../types/sensor';

interface CropProfile {
  name: string;
  idealN: [number, number];
  idealP: [number, number];
  idealK: [number, number];
  idealPh: [number, number];
  idealTemp: [number, number];
  idealRain: [number, number];
  idealHumidity: [number, number];
  idealMoisture: [number, number];
  seasons: string[];
  soils: string[];
  yieldPerAcre: string;
  waterReq: string;
  marketDemand: 'High' | 'Medium' | 'Low';
  profitability: 'High' | 'Medium' | 'Low';
  difficulty: 'Easy' | 'Moderate' | 'Hard';
}

const CROP_PROFILES: CropProfile[] = [
  {
    name: 'Rice', idealN: [40, 80], idealP: [20, 40], idealK: [20, 40], idealPh: [5.5, 7.0],
    idealTemp: [22, 35], idealRain: [100, 250], idealHumidity: [60, 90], idealMoisture: [50, 80],
    seasons: ['Kharif'], soils: ['Clay', 'Loamy'], yieldPerAcre: '3–5 tons',
    waterReq: 'High (1200–2000 mm)', marketDemand: 'High', profitability: 'Medium', difficulty: 'Moderate',
  },
  {
    name: 'Wheat', idealN: [40, 60], idealP: [20, 40], idealK: [20, 40], idealPh: [6.0, 7.5],
    idealTemp: [10, 25], idealRain: [40, 100], idealHumidity: [40, 70], idealMoisture: [35, 60],
    seasons: ['Rabi'], soils: ['Loamy', 'Clay'], yieldPerAcre: '1.5–3 tons',
    waterReq: 'Medium (450–650 mm)', marketDemand: 'High', profitability: 'Medium', difficulty: 'Easy',
  },
  {
    name: 'Maize', idealN: [30, 60], idealP: [15, 35], idealK: [15, 35], idealPh: [5.5, 7.5],
    idealTemp: [18, 32], idealRain: [50, 120], idealHumidity: [50, 80], idealMoisture: [40, 65],
    seasons: ['Kharif', 'Zaid'], soils: ['Loamy', 'Sandy'], yieldPerAcre: '2–4 tons',
    waterReq: 'Medium (500–800 mm)', marketDemand: 'High', profitability: 'Medium', difficulty: 'Easy',
  },
  {
    name: 'Cotton', idealN: [50, 80], idealP: [25, 50], idealK: [25, 50], idealPh: [5.5, 8.0],
    idealTemp: [20, 35], idealRain: [60, 120], idealHumidity: [50, 80], idealMoisture: [40, 65],
    seasons: ['Kharif'], soils: ['Black', 'Loamy'], yieldPerAcre: '1–2 tons',
    waterReq: 'Medium (700–1300 mm)', marketDemand: 'High', profitability: 'High', difficulty: 'Hard',
  },
  {
    name: 'Sugarcane', idealN: [60, 100], idealP: [30, 60], idealK: [30, 60], idealPh: [6.0, 8.0],
    idealTemp: [20, 38], idealRain: [80, 200], idealHumidity: [60, 90], idealMoisture: [50, 75],
    seasons: ['Kharif'], soils: ['Loamy', 'Clay', 'Black'], yieldPerAcre: '30–40 tons',
    waterReq: 'High (1500–2500 mm)', marketDemand: 'Medium', profitability: 'High', difficulty: 'Hard',
  },
  {
    name: 'Soybean', idealN: [20, 40], idealP: [15, 30], idealK: [15, 30], idealPh: [6.0, 7.0],
    idealTemp: [18, 30], idealRain: [60, 120], idealHumidity: [50, 80], idealMoisture: [40, 65],
    seasons: ['Kharif'], soils: ['Loamy', 'Black'], yieldPerAcre: '1–2 tons',
    waterReq: 'Medium (450–700 mm)', marketDemand: 'High', profitability: 'Medium', difficulty: 'Easy',
  },
  {
    name: 'Potato', idealN: [40, 70], idealP: [20, 50], idealK: [30, 60], idealPh: [5.0, 6.5],
    idealTemp: [15, 25], idealRain: [40, 80], idealHumidity: [60, 80], idealMoisture: [45, 70],
    seasons: ['Rabi'], soils: ['Sandy', 'Loamy'], yieldPerAcre: '10–15 tons',
    waterReq: 'Medium (500–700 mm)', marketDemand: 'High', profitability: 'High', difficulty: 'Moderate',
  },
  {
    name: 'Onion', idealN: [30, 50], idealP: [15, 35], idealK: [20, 45], idealPh: [6.0, 7.5],
    idealTemp: [15, 30], idealRain: [30, 70], idealHumidity: [50, 70], idealMoisture: [35, 55],
    seasons: ['Rabi'], soils: ['Loamy', 'Sandy'], yieldPerAcre: '8–12 tons',
    waterReq: 'Low–Medium (350–550 mm)', marketDemand: 'High', profitability: 'High', difficulty: 'Moderate',
  },
  {
    name: 'Tomato', idealN: [40, 60], idealP: [20, 45], idealK: [20, 45], idealPh: [6.0, 7.0],
    idealTemp: [18, 30], idealRain: [40, 80], idealHumidity: [50, 75], idealMoisture: [40, 65],
    seasons: ['Kharif', 'Rabi'], soils: ['Loamy', 'Sandy'], yieldPerAcre: '15–25 tons',
    waterReq: 'Medium (600–800 mm)', marketDemand: 'High', profitability: 'High', difficulty: 'Moderate',
  },
  {
    name: 'Mustard', idealN: [30, 50], idealP: [15, 30], idealK: [15, 30], idealPh: [6.0, 7.5],
    idealTemp: [10, 25], idealRain: [25, 60], idealHumidity: [40, 65], idealMoisture: [30, 50],
    seasons: ['Rabi'], soils: ['Loamy', 'Sandy', 'Clay'], yieldPerAcre: '0.8–1.5 tons',
    waterReq: 'Low (200–350 mm)', marketDemand: 'Medium', profitability: 'Medium', difficulty: 'Easy',
  },
  {
    name: 'Groundnut', idealN: [20, 40], idealP: [15, 30], idealK: [15, 35], idealPh: [6.0, 7.0],
    idealTemp: [22, 32], idealRain: [50, 100], idealHumidity: [50, 75], idealMoisture: [35, 55],
    seasons: ['Kharif'], soils: ['Sandy', 'Loamy'], yieldPerAcre: '1–1.5 tons',
    waterReq: 'Medium (400–600 mm)', marketDemand: 'Medium', profitability: 'Medium', difficulty: 'Easy',
  },
  {
    name: 'Moong Bean', idealN: [15, 30], idealP: [10, 25], idealK: [10, 25], idealPh: [6.0, 7.5],
    idealTemp: [20, 35], idealRain: [30, 70], idealHumidity: [40, 70], idealMoisture: [30, 50],
    seasons: ['Kharif', 'Zaid'], soils: ['Loamy', 'Sandy'], yieldPerAcre: '0.5–1 ton',
    waterReq: 'Low (300–500 mm)', marketDemand: 'Medium', profitability: 'Medium', difficulty: 'Easy',
  },
  {
    name: 'Chickpea', idealN: [15, 30], idealP: [15, 30], idealK: [15, 30], idealPh: [6.0, 8.0],
    idealTemp: [15, 28], idealRain: [30, 60], idealHumidity: [40, 65], idealMoisture: [30, 50],
    seasons: ['Rabi'], soils: ['Loamy', 'Clay'], yieldPerAcre: '0.8–1.5 tons',
    waterReq: 'Low (300–500 mm)', marketDemand: 'High', profitability: 'Medium', difficulty: 'Easy',
  },
];

const FEATURE_WEIGHTS = {
  nitrogen: 0.10,
  phosphorus: 0.08,
  potassium: 0.08,
  ph: 0.10,
  temperature: 0.15,
  rainfall: 0.12,
  humidity: 0.07,
  moisture: 0.07,
  season: 0.15,
  soil: 0.08,
};

const FEATURE_LABELS: Record<string, string> = {
  nitrogen: 'Nitrogen',
  phosphorus: 'Phosphorus',
  potassium: 'Potassium',
  ph: 'pH',
  temperature: 'Temperature',
  rainfall: 'Rainfall',
  humidity: 'Humidity',
  moisture: 'Moisture',
  season: 'Season',
  soil: 'Soil Type',
};

let modelTrained = false;

function rangeScore(value: number, [min, max]: [number, number]): number {
  const span = Math.max(max - min, 1);
  const midpoint = (min + max) / 2;
  if (value >= min && value <= max) {
    const distanceFromMid = Math.abs(value - midpoint) / (span / 2);
    return Math.round(100 - distanceFromMid * 8);
  }
  const distance = value < min ? min - value : value - max;
  const penalty = 8 + (distance / (span * 0.5)) * 92;
  return Math.max(0, Math.round(100 - penalty));
}

function parseYield(yieldPerAcre: string): { low: number; high: number; unit: string } {
  const match = yieldPerAcre.match(/([\d.]+)\s*[–-]\s*([\d.]+)\s*(.+)/);
  if (!match) return { low: 0, high: 0, unit: 'tons' };
  return { low: parseFloat(match[1]), high: parseFloat(match[2]), unit: match[3].trim() };
}

function formatNumber(value: number): string {
  if (value >= 10) return String(Math.round(value));
  return String(Math.round(value * 10) / 10);
}

function computeScores(crop: CropProfile, sensor: SensorPayload, season: string, soilType: string) {
  const featureScores: Record<string, number> = {
    nitrogen: rangeScore(sensor.nitrogen, crop.idealN),
    phosphorus: rangeScore(sensor.phosphorus, crop.idealP),
    potassium: rangeScore(sensor.potassium, crop.idealK),
    ph: rangeScore(sensor.ph, crop.idealPh),
    temperature: rangeScore(sensor.temperature, crop.idealTemp),
    rainfall: rangeScore(sensor.rainfall, crop.idealRain),
    humidity: rangeScore(sensor.humidity, crop.idealHumidity),
    moisture: rangeScore(sensor.moisture, crop.idealMoisture),
    season: crop.seasons.includes(season) ? 100 : 25,
    soil: crop.soils.includes(soilType) ? 100 : 40,
  };

  const environmentalScore = (Object.keys(FEATURE_WEIGHTS) as (keyof typeof FEATURE_WEIGHTS)[])
    .filter((key) => key !== 'season' && key !== 'soil')
    .reduce((sum, key) => sum + featureScores[key] * FEATURE_WEIGHTS[key], 0);

  const weightedScore = (Object.keys(FEATURE_WEIGHTS) as (keyof typeof FEATURE_WEIGHTS)[])
    .reduce((sum, key) => sum + featureScores[key] * FEATURE_WEIGHTS[key], 0);

  let confidence = weightedScore * (0.4 + 0.6 * (environmentalScore / 77));

  if (featureScores.season < 100) confidence = Math.min(confidence, 55);
  if (featureScores.soil < 100) confidence = Math.min(confidence, 78);
  if (environmentalScore < 30) confidence = Math.min(confidence, 35);

  return {
    featureScores,
    environmentalScore,
    confidence: Math.max(2, Math.min(98, Math.round(confidence))),
  };
}

function generateReason(crop: CropProfile, sensor: SensorPayload, featureScores: Record<string, number>): string {
  const matches: string[] = [];
  const issues: string[] = [];

  const values: Record<string, number> = {
    nitrogen: sensor.nitrogen,
    phosphorus: sensor.phosphorus,
    potassium: sensor.potassium,
    ph: sensor.ph,
    temperature: sensor.temperature,
    rainfall: sensor.rainfall,
    humidity: sensor.humidity,
    moisture: sensor.moisture,
  };
  const idealRanges: Record<string, [number, number]> = {
    nitrogen: crop.idealN,
    phosphorus: crop.idealP,
    potassium: crop.idealK,
    ph: crop.idealPh,
    temperature: crop.idealTemp,
    rainfall: crop.idealRain,
    humidity: crop.idealHumidity,
    moisture: crop.idealMoisture,
  };

  Object.keys(values).forEach((key) => {
    if (featureScores[key] >= 90) matches.push(FEATURE_LABELS[key].toLowerCase());
    else if (featureScores[key] < 50) {
      const ideal = idealRanges[key];
      issues.push(`${FEATURE_LABELS[key].toLowerCase()} ${values[key] < ideal[0] ? 'low' : 'high'}`);
    }
  });

  if (featureScores.season === 100) matches.push('season');
  else issues.push('season');
  if (featureScores.soil === 100) matches.push('soil type');
  else issues.push('soil type');

  if (matches.length === 0 && issues.length === 0) return 'General suitability based on soil and climate.';
  const parts: string[] = [];
  if (matches.length > 0) parts.push(`Matches: ${matches.slice(0, 4).join(', ')}`);
  if (issues.length > 0) parts.push(`Needs attention: ${issues.slice(0, 4).join(', ')}`);
  return parts.join(' · ');
}

function buildFeatureImportance(featureScores: Record<string, number>): Record<string, number> {
  const raw: Record<string, number> = {};
  (Object.keys(FEATURE_WEIGHTS) as (keyof typeof FEATURE_WEIGHTS)[]).forEach((key) => {
    raw[FEATURE_LABELS[key]] = featureScores[key] * FEATURE_WEIGHTS[key];
  });
  const total = Object.values(raw).reduce((sum, value) => sum + value, 0) || 1;
  const importance: Record<string, number> = {};
  Object.keys(raw).forEach((key) => {
    importance[key] = Math.round((raw[key] / total) * 1000) / 10;
  });
  return importance;
}

function buildRadarData(sensor: SensorPayload, crop: CropProfile): { feature: string; actual: number; ideal: number }[] {
  const scale = (value: number, min: number, max: number) =>
    Math.max(0, Math.min(100, Math.round(((value - min) / (max - min)) * 100)));
  const ideal = (value: number, min: number, max: number) => scale(value, min, max);

  return [
    { feature: 'N', actual: scale(sensor.nitrogen, 0, 100), ideal: ideal((crop.idealN[0] + crop.idealN[1]) / 2, 0, 100) },
    { feature: 'P', actual: scale(sensor.phosphorus, 0, 60), ideal: ideal((crop.idealP[0] + crop.idealP[1]) / 2, 0, 60) },
    { feature: 'K', actual: scale(sensor.potassium, 0, 60), ideal: ideal((crop.idealK[0] + crop.idealK[1]) / 2, 0, 60) },
    { feature: 'pH', actual: scale(sensor.ph, 4, 9), ideal: ideal((crop.idealPh[0] + crop.idealPh[1]) / 2, 4, 9) },
    { feature: 'Temp', actual: scale(sensor.temperature, 5, 45), ideal: ideal((crop.idealTemp[0] + crop.idealTemp[1]) / 2, 5, 45) },
    { feature: 'Rain', actual: scale(sensor.rainfall, 0, 300), ideal: ideal((crop.idealRain[0] + crop.idealRain[1]) / 2, 0, 300) },
    { feature: 'Humidity', actual: scale(sensor.humidity, 20, 100), ideal: ideal((crop.idealHumidity[0] + crop.idealHumidity[1]) / 2, 20, 100) },
    { feature: 'Moisture', actual: scale(sensor.moisture, 0, 100), ideal: ideal((crop.idealMoisture[0] + crop.idealMoisture[1]) / 2, 0, 100) },
  ];
}

export function trainModel(): void {
  modelTrained = true;
}

export function predict(sensor: SensorPayload, season: string, soilType: string): PredictionResult {
  if (!modelTrained) trainModel();

  const scored = CROP_PROFILES.map((crop) => ({
    crop,
    ...computeScores(crop, sensor, season, soilType),
  })).sort((a, b) => b.confidence - a.confidence);

  const top = scored[0];
  const topCrop = top.crop;
  const predictions: CropPrediction[] = scored.slice(0, 5).map(({ crop, confidence, featureScores }) => {
    const yieldInfo = parseYield(crop.yieldPerAcre);
    const factor = 0.6 + 0.35 * (confidence / 100);
    return {
      crop: crop.name,
      confidence,
      expectedYield: crop.yieldPerAcre,
      estimatedYield: `${formatNumber(yieldInfo.low * factor)}–${formatNumber(yieldInfo.high * factor)} ${yieldInfo.unit}/acre`,
      yieldRange: [Math.round(yieldInfo.low * factor * 10) / 10, Math.round(yieldInfo.high * factor * 10) / 10],
      yieldUnit: yieldInfo.unit,
      reason: generateReason(crop, sensor, featureScores),
      suitableSeason: crop.seasons.join(', '),
      suitableSoil: crop.soils.join(', '),
      waterRequirement: crop.waterReq,
      marketDemand: crop.marketDemand,
      profitability: crop.profitability,
      difficultyLevel: crop.difficulty,
    };
  });

  return {
    predictions,
    featureImportance: buildFeatureImportance(top.featureScores),
    npkBalance: {
      nitrogen: top.featureScores.nitrogen,
      phosphorus: top.featureScores.phosphorus,
      potassium: top.featureScores.potassium,
    },
    radarData: buildRadarData(sensor, topCrop),
  };
}

export { CROP_PROFILES };
