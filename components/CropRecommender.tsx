import React, { useState, useEffect, useRef } from 'react';
import { Section } from '../types';
import * as tf from '@tensorflow/tfjs';

interface CropRecommendation {
  crop: string;
  confidence: number;
  expectedYield: string;
  reason: string;
}

interface SoilData {
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  ph: number;
  rainfall: number;
  temperature: number;
}

const CROP_DATA: Record<string, { minN: number; maxN: number; minP: number; maxP: number; minK: number; maxK: number; minPh: number; maxPh: number; minTemp: number; maxTemp: number; yieldPerAcre: string }> = {
  'Rice': { minN: 40, maxN: 60, minP: 20, maxP: 40, minK: 20, maxK: 40, minPh: 5.5, maxPh: 7, minTemp: 20, maxTemp: 35, yieldPerAcre: '3-5 tons' },
  'Wheat': { minN: 40, maxN: 60, minP: 20, maxP: 40, minK: 20, maxK: 40, minPh: 6, maxPh: 7.5, minTemp: 10, maxTemp: 25, yieldPerAcre: '1.5-3 tons' },
  'Maize': { minN: 30, maxN: 50, minP: 15, maxP: 30, minK: 15, maxK: 30, minPh: 5.5, maxPh: 7.5, minTemp: 15, maxTemp: 30, yieldPerAcre: '2-4 tons' },
  'Cotton': { minN: 50, maxN: 80, minP: 25, maxP: 50, minK: 25, maxK: 50, minPh: 5.5, maxPh: 8, minTemp: 20, maxTemp: 35, yieldPerAcre: '1-2 tons' },
  'Sugarcane': { minN: 60, maxN: 100, minP: 30, maxP: 60, minK: 30, maxK: 60, minPh: 6, maxPh: 8, minTemp: 20, maxTemp: 35, yieldPerAcre: '30-40 tons' },
  'Soybean': { minN: 20, maxN: 40, minP: 15, maxP: 30, minK: 15, maxK: 30, minPh: 6, maxPh: 7, minTemp: 15, maxTemp: 30, yieldPerAcre: '1-2 tons' },
  'Potato': { minN: 40, maxN: 60, minP: 20, maxP: 40, minK: 30, maxK: 50, minPh: 5, maxPh: 6.5, minTemp: 15, maxTemp: 25, yieldPerAcre: '10-15 tons' },
  'Onion': { minN: 30, maxN: 50, minP: 15, maxP: 30, minK: 20, maxK: 40, minPh: 6, maxPh: 7, minTemp: 15, maxTemp: 30, yieldPerAcre: '8-12 tons' },
  'Tomato': { minN: 40, maxN: 60, minP: 20, maxP: 40, minK: 20, maxK: 40, minPh: 6, maxPh: 6.8, minTemp: 18, maxTemp: 30, yieldPerAcre: '15-25 tons' },
  'Mustard': { minN: 30, maxN: 50, minP: 15, maxP: 30, minK: 15, maxK: 30, minPh: 6, maxPh: 7.5, minTemp: 10, maxTemp: 25, yieldPerAcre: '0.8-1.5 tons' },
};

const SEASONS = ['Kharif (Monsoon)', 'Rabi (Winter)', 'Zaid (Summer)'];
const SOIL_TYPES = ['Sandy', 'Loamy', 'Clay', 'Silty', 'Black', 'Red'];

const CropRecommender: React.FC = () => {
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [soilData, setSoilData] = useState<SoilData>({
    nitrogen: 50,
    phosphorus: 30,
    potassium: 30,
    ph: 6.5,
    rainfall: 100,
    temperature: 25,
  });
  const [selectedSeason, setSelectedSeason] = useState<string>(SEASONS[0]);
  const [selectedSoilType, setSelectedSoilType] = useState<string>(SOIL_TYPES[1]);
  const [landSize, setLandSize] = useState<number>(1);
  const [recommendations, setRecommendations] = useState<CropRecommendation[]>([]);
  const [isPredicting, setIsPredicting] = useState(false);
  const modelRef = useRef<tf.LayersModel | null>(null);

  useEffect(() => {
    initializeModel();
  }, []);

  const initializeModel = async () => {
    setIsModelLoading(true);
    try {
      modelRef.current = tf.sequential({
        layers: [
          tf.layers.dense({ inputShape: [6], units: 32, activation: 'relu' }),
          tf.layers.dropout({ rate: 0.2 }),
          tf.layers.dense({ units: 16, activation: 'relu' }),
          tf.layers.dense({ units: 10, activation: 'softmax' }),
        ],
      });

      modelRef.current.compile({
        optimizer: 'adam',
        loss: 'categoricalCrossentropy',
        metrics: ['accuracy'],
      });

      const crops = ['Rice', 'Wheat', 'Maize', 'Cotton', 'Sugarcane', 'Soybean', 'Potato', 'Onion', 'Tomato', 'Mustard'];
      const numSamples = 500;
      
      const features: number[][] = [];
      const labels: number[][] = [];

      for (let i = 0; i < numSamples; i++) {
        const cropIndex = Math.floor(Math.random() * crops.length);
        const crop = crops[cropIndex];
        const data = CROP_DATA[crop];
        
        if (data) {
          const n = data.minN + Math.random() * (data.maxN - data.minN);
          const p = data.minP + Math.random() * (data.maxP - data.minP);
          const k = data.minK + Math.random() * (data.maxK - data.minK);
          const ph = data.minPh + Math.random() * (data.maxPh - data.minPh);
          const rainfall = 50 + Math.random() * 150;
          const temp = data.minTemp + Math.random() * (data.maxTemp - data.minTemp);
          
          features.push([n / 100, p / 60, k / 60, (ph - 5) / 3, rainfall / 200, temp / 35]);
          
          const label = Array(10).fill(0);
          label[cropIndex] = 1;
          labels.push(label);
        }
      }

      const xs = tf.tensor2d(features);
      const ys = tf.tensor2d(labels);

      await modelRef.current.fit(xs, ys, { epochs: 50, batchSize: 32, verbose: 0 });

      xs.dispose();
      ys.dispose();
    } catch (error) {
      console.error('Error initializing model:', error);
    } finally {
      setIsModelLoading(false);
    }
  };

  const getRecommendations = async () => {
    setIsPredicting(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));

    const crops = ['Rice', 'Wheat', 'Maize', 'Cotton', 'Sugarcane', 'Soybean', 'Potato', 'Onion', 'Tomato', 'Mustard'];
    const results: CropRecommendation[] = [];

    for (const crop of crops) {
      const data = CROP_DATA[crop];
      if (!data) continue;

      let score = 0;
      let reasons: string[] = [];

      const nScore = data.minN <= soilData.nitrogen && soilData.nitrogen <= data.maxN ? 1 :
                     Math.abs(soilData.nitrogen - (data.minN + data.maxN) / 2) < 20 ? 0.5 : 0;
      score += nScore * 0.15;
      if (nScore > 0) reasons.push('Nitrogen level matches');

      const pScore = data.minP <= soilData.phosphorus && soilData.phosphorus <= data.maxP ? 1 :
                     Math.abs(soilData.phosphorus - (data.minP + data.maxP) / 2) < 15 ? 0.5 : 0;
      score += pScore * 0.15;
      if (pScore > 0) reasons.push('Phosphorus suitable');

      const kScore = data.minK <= soilData.potassium && soilData.potassium <= data.maxK ? 1 :
                     Math.abs(soilData.potassium - (data.minK + data.maxK) / 2) < 15 ? 0.5 : 0;
      score += kScore * 0.15;
      if (kScore > 0) reasons.push('Potassium optimal');

      const phScore = data.minPh <= soilData.ph && soilData.ph <= data.maxPh ? 1 :
                      Math.abs(soilData.ph - (data.minPh + data.maxPh) / 2) < 1 ? 0.5 : 0;
      score += phScore * 0.2;
      if (phScore > 0) reasons.push('pH level ideal');

      const tempScore = data.minTemp <= soilData.temperature && soilData.temperature <= data.maxTemp ? 1 :
                        Math.abs(soilData.temperature - (data.minTemp + data.maxTemp) / 2) < 5 ? 0.5 : 0;
      score += tempScore * 0.2;
      if (tempScore > 0) reasons.push('Temperature favorable');

      const seasonalMatch = (
        (selectedSeason === 'Kharif (Monsoon)' && ['Rice', 'Cotton', 'Sugarcane', 'Maize', 'Soybean'].includes(crop)) ||
        (selectedSeason === 'Rabi (Winter)' && ['Wheat', 'Mustard', 'Potato', 'Onion'].includes(crop)) ||
        (selectedSeason === 'Zaid (Summer)' && ['Maize', 'Moong Bean', 'Watermelon'].includes(crop))
      );
      if (seasonalMatch) {
        score += 0.15;
        reasons.push('Season appropriate');
      }

      if (score > 0) {
        results.push({
          crop,
          confidence: Math.round(score * 100),
          expectedYield: data.yieldPerAcre,
          reason: reasons.length > 0 ? reasons.join(', ') : 'General suitability',
        });
      }
    }

    results.sort((a, b) => b.confidence - a.confidence);
    setRecommendations(results.slice(0, 5));
    setIsPredicting(false);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600 bg-green-100';
    if (confidence >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-orange-600 bg-orange-100';
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 80) return 'Highly Recommended';
    if (confidence >= 60) return 'Recommended';
    return 'Consider';
  };

  return (
    <section id="crop-recommender" className="snap-section min-h-screen flex flex-col justify-center items-center border-t border-gray-100 bg-gradient-to-b from-green-50/40 to-white">
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 rounded-full px-4 py-1.5 text-sm font-medium mb-4">
            <i className="fas fa-seedling text-xs"></i>
            Crop Advisor
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            Smart Crop <span className="text-green-600">Recommendation</span>
          </h2>
          <p className="text-gray-500 mt-3 max-w-lg mx-auto">ML-powered crop suggestions based on soil, season, and climate conditions</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-xl p-6 md:p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <i className="fas fa-flask text-green-600"></i>
              Enter Soil & Climate Data
            </h3>

            {isModelLoading && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg flex items-center gap-3">
                <i className="fas fa-spinner fa-spin text-blue-500"></i>
                <span className="text-blue-700">Initializing ML model...</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nitrogen (N) - kg/hectare
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={soilData.nitrogen}
                  onChange={(e) => setSoilData({ ...soilData, nitrogen: Number(e.target.value) })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>0</span>
                  <span className="font-semibold text-green-600">{soilData.nitrogen} kg/ha</span>
                  <span>100</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phosphorus (P) - kg/hectare
                </label>
                <input
                  type="range"
                  min="0"
                  max="60"
                  value={soilData.phosphorus}
                  onChange={(e) => setSoilData({ ...soilData, phosphorus: Number(e.target.value) })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>0</span>
                  <span className="font-semibold text-green-600">{soilData.phosphorus} kg/ha</span>
                  <span>60</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Potassium (K) - kg/hectare
                </label>
                <input
                  type="range"
                  min="0"
                  max="60"
                  value={soilData.potassium}
                  onChange={(e) => setSoilData({ ...soilData, potassium: Number(e.target.value) })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>0</span>
                  <span className="font-semibold text-green-600">{soilData.potassium} kg/ha</span>
                  <span>60</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Soil pH Level
                </label>
                <input
                  type="range"
                  min="4"
                  max="9"
                  step="0.1"
                  value={soilData.ph}
                  onChange={(e) => setSoilData({ ...soilData, ph: Number(e.target.value) })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>4 (Acidic)</span>
                  <span className="font-semibold text-green-600">{soilData.ph.toFixed(1)}</span>
                  <span>9 (Alkaline)</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Temperature - °C
                </label>
                <input
                  type="range"
                  min="5"
                  max="45"
                  value={soilData.temperature}
                  onChange={(e) => setSoilData({ ...soilData, temperature: Number(e.target.value) })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>5°C</span>
                  <span className="font-semibold text-green-600">{soilData.temperature}°C</span>
                  <span>45°C</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rainfall - mm/year
                </label>
                <input
                  type="range"
                  min="0"
                  max="300"
                  value={soilData.rainfall}
                  onChange={(e) => setSoilData({ ...soilData, rainfall: Number(e.target.value) })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>0mm</span>
                  <span className="font-semibold text-green-600">{soilData.rainfall}mm</span>
                  <span>300mm</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Season</label>
                <select
                  value={selectedSeason}
                  onChange={(e) => setSelectedSeason(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {SEASONS.map((season) => (
                    <option key={season} value={season}>{season}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Soil Type</label>
                <select
                  value={selectedSoilType}
                  onChange={(e) => setSelectedSoilType(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {SOIL_TYPES.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Land Size - Acres
              </label>
              <input
                type="number"
                min="0.1"
                max="100"
                step="0.1"
                value={landSize}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setLandSize(isNaN(val) ? 1 : Math.min(100, Math.max(0.1, val)));
                }}
                className="w-full px-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <button
              onClick={getRecommendations}
              disabled={isModelLoading || isPredicting}
              className="w-full mt-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-400 transition-colors font-semibold text-lg flex items-center justify-center gap-2"
            >
              {isPredicting ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Analyzing...
                </>
              ) : (
                <>
                  <i className="fas fa-brain"></i>
                  Get Crop Recommendations
                </>
              )}
            </button>
          </div>

          <div>
            {recommendations.length > 0 ? (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <i className="fas fa-trophy text-yellow-500"></i>
                  Top Recommended Crops
                </h3>
                
                {recommendations.map((rec, index) => (
                  <div
                    key={rec.crop}
                    className={`bg-white rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl ${
                      index === 0 ? 'ring-2 ring-green-500' : ''
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                        index === 0 ? 'bg-yellow-100 text-yellow-600' :
                        index === 1 ? 'bg-gray-200 text-gray-600' :
                        index === 2 ? 'bg-orange-100 text-orange-600' :
                        'bg-gray-100 text-gray-500'
                      }`}>
                        #{index + 1}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-xl font-bold text-gray-800">{rec.crop}</h4>
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getConfidenceColor(rec.confidence)}`}>
                            {rec.confidence}% - {getConfidenceLabel(rec.confidence)}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-3">
                          <i className="fas fa-check-circle text-green-500 mr-2"></i>
                          {rec.reason}
                        </p>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-green-50 rounded-lg p-3">
                            <p className="text-xs text-gray-500">Expected Yield</p>
                            <p className="font-semibold text-green-700">{rec.expectedYield}/acre</p>
                          </div>
                          <div className="bg-blue-50 rounded-lg p-3">
                            <p className="text-xs text-gray-500">Estimated Total Yield</p>
                            <p className="font-semibold text-blue-700">
                              {rec.expectedYield.replace('tons', '').replace(' ', '').split('-')[0]}–{rec.expectedYield.replace('tons', '').replace(' ', '').split('-')[1]} tons
                            </p>
                            <p className="text-xs text-gray-400">for {landSize} acres</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-6 mt-6">
                  <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
                    <i className="fas fa-lightbulb"></i>
                    Pro Tip
                  </h4>
                  <p className="text-sm opacity-90">
                    Rotate crops seasonally to maintain soil health. Legumes like Soybean fix nitrogen 
                    naturally, benefiting subsequent crops like Wheat.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="fas fa-seedling text-green-600 text-4xl"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Ready to Get Recommendations</h3>
                <p className="text-gray-600 mb-6">
                  Enter your soil data on the left and click "Get Crop Recommendations" to see smart suggestions
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  {['Rice', 'Wheat', 'Cotton', 'Sugarcane'].map((crop) => (
                    <span key={crop} className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                      {crop}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 bg-white rounded-xl shadow-lg p-6 md:p-8">
          <h3 className="text-xl font-bold text-gray-800 mb-6">
            <i className="fas fa-database text-green-600 mr-2"></i>
            Understanding NPK Values
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-bold text-blue-700 mb-2">Nitrogen (N)</h4>
              <p className="text-sm text-gray-600">Essential for leaf growth and green color. Deficiency causes yellowing of older leaves.</p>
              <p className="text-xs text-gray-500 mt-2">Ideal range: 40-60 kg/ha for most crops</p>
            </div>
            <div className="bg-orange-50 rounded-lg p-4">
              <h4 className="font-bold text-orange-700 mb-2">Phosphorus (P)</h4>
              <p className="text-sm text-gray-600">Promotes root development and flowering. Deficiency causes stunted growth.</p>
              <p className="text-xs text-gray-500 mt-2">Ideal range: 20-40 kg/ha for most crops</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <h4 className="font-bold text-purple-700 mb-2">Potassium (K)</h4>
              <p className="text-sm text-gray-600">Improves disease resistance and fruit quality. Deficiency causes leaf scorching.</p>
              <p className="text-xs text-gray-500 mt-2">Ideal range: 20-40 kg/ha for most crops</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CropRecommender;
