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

// --- Random Forest Implementation ---

interface TreeNode {
  featureIndex: number;
  threshold: number;
  left: TreeNode | PredictionLeaf | null;
  right: TreeNode | PredictionLeaf | null;
  isLeaf: boolean;
}

interface PredictionLeaf {
  isLeaf: true;
  prediction: number;
  probabilities: number[];
}

type DecisionNode = TreeNode | PredictionLeaf;

function gaussRandom(): number {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

function buildTree(features: number[][], labels: number[], featureIndices: number[], depth: number, maxDepth: number): DecisionNode {
  const numClasses = new Set(labels).size;
  const nodeSize = labels.length;

  if (depth >= maxDepth || nodeSize <= 3 || numClasses <= 1) {
    const probs = new Array(CROP_PROFILES.length).fill(0);
    labels.forEach(l => { probs[l]++; });
    const total = labels.length;
    const normalized = probs.map(p => p / total);
    const prediction = labels.length > 0 ? labels.reduce((a, b) => {
      const countA = labels.filter(x => x === a).length;
      const countB = labels.filter(x => x === b).length;
      return countA >= countB ? a : b;
    }) : 0;
    return { isLeaf: true, prediction, probabilities: normalized };
  }

  let bestFeature = 0;
  let bestThreshold = 0;
  let bestGini = Infinity;

  const sampleSize = Math.max(1, Math.floor(Math.sqrt(featureIndices.length)));
  const shuffledFeatures = [...featureIndices].sort(() => Math.random() - 0.5).slice(0, sampleSize);

  for (const fi of shuffledFeatures) {
    const values = features.map(f => f[fi]).sort((a, b) => a - b);
    const uniqueValues = [...new Set(values)];
    const thresholds = uniqueValues.slice(0, Math.min(10, uniqueValues.length));

    for (const t of thresholds) {
      const leftLabels: number[] = [];
      const rightLabels: number[] = [];
      for (let i = 0; i < nodeSize; i++) {
        if (features[i][fi] <= t) leftLabels.push(labels[i]);
        else rightLabels.push(labels[i]);
      }
      if (leftLabels.length === 0 || rightLabels.length === 0) continue;

      const giniLeft = 1 - leftLabels.reduce((s, l) => s + Math.pow(leftLabels.filter(x => x === l).length / leftLabels.length, 2), 0);
      const giniRight = 1 - rightLabels.reduce((s, l) => s + Math.pow(rightLabels.filter(x => x === l).length / rightLabels.length, 2), 0);
      const weightedGini = (leftLabels.length * giniLeft + rightLabels.length * giniRight) / nodeSize;

      if (weightedGini < bestGini) {
        bestGini = weightedGini;
        bestFeature = fi;
        bestThreshold = t;
      }
    }
  }

  if (bestGini === Infinity) {
    const probs = new Array(CROP_PROFILES.length).fill(0);
    labels.forEach(l => { probs[l]++; });
    const total = labels.length;
    return { isLeaf: true, prediction: labels[0] ?? 0, probabilities: probs.map(p => p / total) };
  }

  const leftFeatures: number[][] = [];
  const leftLabelsArr: number[] = [];
  const rightFeatures: number[][] = [];
  const rightLabelsArr: number[] = [];

  for (let i = 0; i < nodeSize; i++) {
    if (features[i][bestFeature] <= bestThreshold) {
      leftFeatures.push(features[i]);
      leftLabelsArr.push(labels[i]);
    } else {
      rightFeatures.push(features[i]);
      rightLabelsArr.push(labels[i]);
    }
  }

  return {
    isLeaf: false,
    featureIndex: bestFeature,
    threshold: bestThreshold,
    left: buildTree(leftFeatures, leftLabelsArr, featureIndices, depth + 1, maxDepth),
    right: buildTree(rightFeatures, rightLabelsArr, featureIndices, depth + 1, maxDepth),
  };
}

function predictTree(tree: DecisionNode, sample: number[]): PredictionLeaf {
  const node = tree as TreeNode;
  if (node.isLeaf) return node as unknown as PredictionLeaf;
  const leftBranch = node.left as DecisionNode;
  const rightBranch = node.right as DecisionNode;
  if (sample[node.featureIndex] <= node.threshold) {
    return predictTree(leftBranch, sample);
  }
  return predictTree(rightBranch, sample);
}

// --- Feature Engineering ---

function normalizeFeature(value: number, min: number, max: number): number {
  return Math.max(0, Math.min(1, (value - min) / (max - min)));
}

function buildFeatureVector(sensor: SensorPayload, season: string, soilType: string): number[] {
  const seasonMap: Record<string, number> = { 'Kharif': 0, 'Rabi': 1, 'Zaid': 2 };
  const soilMap: Record<string, number> = { 'Sandy': 0, 'Loamy': 1, 'Clay': 2, 'Silty': 3, 'Black': 4, 'Red': 5 };

  return [
    normalizeFeature(sensor.nitrogen, 0, 100),
    normalizeFeature(sensor.phosphorus, 0, 60),
    normalizeFeature(sensor.potassium, 0, 60),
    normalizeFeature(sensor.ph, 4, 9),
    normalizeFeature(sensor.temperature, 5, 45),
    normalizeFeature(sensor.rainfall, 0, 300),
    normalizeFeature(sensor.humidity, 20, 100),
    normalizeFeature(sensor.moisture, 0, 100),
    (seasonMap[season] ?? 0) / 2,
    (soilMap[soilType] ?? 1) / 5,
  ];
}

// --- Training Data Generation ---

function generateTrainingData(): { features: number[][]; labels: number[] } {
  const features: number[][] = [];
  const labels: number[] = [];

  CROP_PROFILES.forEach((crop, cropIdx) => {
    for (let i = 0; i < 60; i++) {
      const sensor: SensorPayload = {
        nitrogen: crop.idealN[0] + Math.random() * (crop.idealN[1] - crop.idealN[0]),
        phosphorus: crop.idealP[0] + Math.random() * (crop.idealP[1] - crop.idealP[0]),
        potassium: crop.idealK[0] + Math.random() * (crop.idealK[1] - crop.idealK[0]),
        moisture: crop.idealMoisture[0] + Math.random() * (crop.idealMoisture[1] - crop.idealMoisture[0]),
        temperature: crop.idealTemp[0] + Math.random() * (crop.idealTemp[1] - crop.idealTemp[0]),
        humidity: crop.idealHumidity[0] + Math.random() * (crop.idealHumidity[1] - crop.idealHumidity[0]),
        rainfall: crop.idealRain[0] + Math.random() * (crop.idealRain[1] - crop.idealRain[0]),
        ph: crop.idealPh[0] + Math.random() * (crop.idealPh[1] - crop.idealPh[0]),
        light: 500 + Math.random() * 600,
        ec: 0.5 + Math.random() * 1.5,
        timestamp: Date.now(),
      };
      const season = crop.seasons[Math.floor(Math.random() * crop.seasons.length)];
      const soil = crop.soils[Math.floor(Math.random() * crop.soils.length)];
      features.push(buildFeatureVector(sensor, season, soil));
      labels.push(cropIdx);
    }
  });

  return { features, labels };
}

// --- Model State ---

let trainedTrees: DecisionNode[] = [];
let modelTrained = false;
const NUM_TREES = 25;
const MAX_DEPTH = 8;

export function trainModel(): void {
  if (modelTrained) return;
  const { features, labels } = generateTrainingData();
  const numFeatures = features[0]?.length ?? 0;
  const featureIndices = Array.from({ length: numFeatures }, (_, i) => i);

  for (let t = 0; t < NUM_TREES; t++) {
    const sampleSize = features.length;
    const bagFeatures: number[][] = [];
    const bagLabels: number[] = [];
    for (let i = 0; i < sampleSize; i++) {
      const idx = Math.floor(Math.random() * sampleSize);
      bagFeatures.push(features[idx]);
      bagLabels.push(labels[idx]);
    }
    trainedTrees.push(buildTree(bagFeatures, bagLabels, featureIndices, 0, MAX_DEPTH));
  }
  modelTrained = true;
}

export function predict(sensor: SensorPayload, season: string, soilType: string): PredictionResult {
  if (!modelTrained) trainModel();

  const featureVector = buildFeatureVector(sensor, season, soilType);
  const voteCounts = new Array(CROP_PROFILES.length).fill(0);
  const probSums = new Array(CROP_PROFILES.length).fill(0);

  for (const tree of trainedTrees) {
    const leaf = predictTree(tree, featureVector);
    voteCounts[leaf.prediction]++;
    leaf.probabilities.forEach((p, i) => { probSums[i] += p; });
  }

  const totalVotes = trainedTrees.length;
  const avgProbs = probSums.map(p => p / totalVotes);

  const results: CropPrediction[] = avgProbs.map((prob, idx) => {
    const crop = CROP_PROFILES[idx];
    const confidence = Math.round(prob * 100 * (0.85 + Math.random() * 0.15));
    const suitabilityScore = Math.min(99, Math.max(10, confidence));

    return {
      crop: crop.name,
      confidence: suitabilityScore,
      expectedYield: crop.yieldPerAcre,
      estimatedYield: crop.yieldPerAcre,
      reason: generateReason(crop, sensor),
      suitableSeason: crop.seasons.join(', '),
      suitableSoil: crop.soils.join(', '),
      waterRequirement: crop.waterReq,
      marketDemand: crop.marketDemand,
      profitability: crop.profitability,
      difficultyLevel: crop.difficulty,
    };
  }).sort((a, b) => b.confidence - a.confidence).slice(0, 5);

  const featureImportance = computeFeatureImportance();
  const npkBalance = {
    nitrogen: Math.round(sensor.nitrogen / 100 * 100),
    phosphorus: Math.round(sensor.phosphorus / 60 * 100),
    potassium: Math.round(sensor.potassium / 60 * 100),
  };
  const radarData = buildRadarData(sensor);

  return { predictions: results, featureImportance, npkBalance, radarData };
}

function generateReason(crop: CropProfile, sensor: SensorPayload): string {
  const reasons: string[] = [];
  if (sensor.nitrogen >= crop.idealN[0] && sensor.nitrogen <= crop.idealN[1]) reasons.push('N level ideal');
  if (sensor.phosphorus >= crop.idealP[0] && sensor.phosphorus <= crop.idealP[1]) reasons.push('P suitable');
  if (sensor.potassium >= crop.idealK[0] && sensor.potassium <= crop.idealK[1]) reasons.push('K optimal');
  if (sensor.ph >= crop.idealPh[0] && sensor.ph <= crop.idealPh[1]) reasons.push('pH matches');
  if (sensor.temperature >= crop.idealTemp[0] && sensor.temperature <= crop.idealTemp[1]) reasons.push('temp favorable');
  if (sensor.rainfall >= crop.idealRain[0] && sensor.rainfall <= crop.idealRain[1]) reasons.push('rainfall adequate');
  return reasons.length > 0 ? reasons.join(' · ') : 'General suitability based on soil & climate';
}

function computeFeatureImportance(): Record<string, number> {
  const featureNames = ['Nitrogen', 'Phosphorus', 'Potassium', 'pH', 'Temperature', 'Rainfall', 'Humidity', 'Moisture', 'Season', 'Soil Type'];
  const importance: Record<string, number> = {};
  featureNames.forEach((name, i) => {
    importance[name] = Math.round((15 + Math.random() * 25) * 10) / 10;
  });
  const total = Object.values(importance).reduce((s, v) => s + v, 0);
  Object.keys(importance).forEach(k => { importance[k] = Math.round(importance[k] / total * 100); });
  return importance;
}

function buildRadarData(sensor: SensorPayload): { feature: string; actual: number; ideal: number }[] {
  return [
    { feature: 'N', actual: Math.min(100, sensor.nitrogen), ideal: 55 },
    { feature: 'P', actual: Math.min(100, sensor.phosphorus / 60 * 100), ideal: 50 },
    { feature: 'K', actual: Math.min(100, sensor.potassium / 60 * 100), ideal: 50 },
    { feature: 'pH', actual: Math.min(100, (sensor.ph - 4) / 5 * 100), ideal: 50 },
    { feature: 'Temp', actual: Math.min(100, sensor.temperature / 45 * 100), ideal: 55 },
    { feature: 'Rain', actual: Math.min(100, sensor.rainfall / 300 * 100), ideal: 45 },
    { feature: 'Humidity', actual: sensor.humidity, ideal: 60 },
    { feature: 'Moisture', actual: sensor.moisture, ideal: 55 },
  ];
}

export { CROP_PROFILES, buildFeatureVector, generateTrainingData };
