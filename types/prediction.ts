export interface CropPrediction {
  crop: string;
  confidence: number;
  expectedYield: string;
  estimatedYield: string;
  reason: string;
  suitableSeason: string;
  suitableSoil: string;
  waterRequirement: string;
  marketDemand: 'High' | 'Medium' | 'Low';
  profitability: 'High' | 'Medium' | 'Low';
  difficultyLevel: 'Easy' | 'Moderate' | 'Hard';
}

export interface PredictionResult {
  predictions: CropPrediction[];
  featureImportance: Record<string, number>;
  npkBalance: { nitrogen: number; phosphorus: number; potassium: number };
  radarData: { feature: string; actual: number; ideal: number }[];
}
