import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Section } from '../types';
import { SensorPayload } from '../types/sensor';
import { PredictionResult } from '../types/prediction';
import { trainModel, predict } from '../services/cropRecommendation/randomForestService';
import { iotService } from '../services/cropRecommendation/iotService';
import ManualInput from './crop/ManualInput';
import IoTDashboard from './crop/IoTDashboard';
import RecommendationCard from './crop/RecommendationCard';
import PredictionAnalytics from './crop/PredictionAnalytics';
import { Loader2 } from 'lucide-react';

type TabKey = 'manual' | 'iot';

const defaultSensor: SensorPayload = {
  nitrogen: 50, phosphorus: 30, potassium: 30,
  moisture: 55, temperature: 25, humidity: 65,
  rainfall: 100, ph: 6.5, light: 800, ec: 1.2,
  timestamp: Date.now(),
};

const CropRecommender: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('manual');
  const [modelReady, setModelReady] = useState(false);
  const [sensorData, setSensorData] = useState<SensorPayload>(defaultSensor);
  const [season, setSeason] = useState('Kharif');
  const [soilType, setSoilType] = useState('Loamy');
  const [landSize, setLandSize] = useState(1);
  const [predicting, setPredicting] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);

  // IoT state
  const [iotConnected, setIotConnected] = useState(false);
  const [iotBattery, setIotBattery] = useState(85);
  const [iotWifi, setIotWifi] = useState(75);
  const [iotLastSync, setIotLastSync] = useState<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => { trainModel(); setModelReady(true); }, 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (activeTab !== 'iot') {
      iotService.stopLiveUpdates();
      return;
    }
    const unsub = iotService.subscribe((data) => {
      setSensorData(data);
    });
    if (iotConnected) {
      iotService.startLiveUpdates(3000);
    }
    return () => { unsub(); iotService.stopLiveUpdates(); };
  }, [activeTab, iotConnected]);

  const handlePredict = useCallback(async () => {
    if (!modelReady) return;
    setPredicting(true);
    await new Promise(r => setTimeout(r, 600));
    const res = predict(sensorData, season, soilType);
    setResult(res);
    setPredicting(false);
  }, [modelReady, sensorData, season, soilType]);

  const handleIoTConnect = () => {
    const status = iotService.connect();
    setIotConnected(true);
    setIotBattery(status.battery);
    setIotWifi(status.wifi);
    iotService.startLiveUpdates(3000);
  };

  const handleIoTDisconnect = () => {
    iotService.disconnect();
    setIotConnected(false);
    iotService.stopLiveUpdates();
  };

  const handleIoTSync = () => {
    const data = iotService.sync();
    setSensorData(data);
    setIotLastSync(data.timestamp);
  };

  const handleIoTPredict = async () => {
    handleIoTSync();
    await handlePredict();
  };

  const tabs = [
    { key: 'manual' as TabKey, label: 'Manual Soil Analysis', icon: '🔬' },
    { key: 'iot' as TabKey, label: 'IoT Smart Farm', icon: '📡' },
  ];

  return (
    <section id={Section.CROP_RECOMMENDER} className="snap-section min-h-screen flex flex-col justify-center items-center border-t border-gray-100 bg-gradient-to-b from-green-50/40 to-white">
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 rounded-full px-4 py-1.5 text-sm font-medium mb-4">
            Crop Advisor
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            Smart Crop <span className="text-green-600">Recommendation</span>
          </h2>
          <p className="text-gray-500 mt-3 max-w-lg mx-auto">
            {activeTab === 'manual'
              ? 'Enter your soil data to get AI-powered crop suggestions based on Random Forest analysis'
              : 'Connect your ESP32 sensor hub for real-time soil monitoring and smart predictions'}
          </p>
        </div>

        {!modelReady && (
          <div className="mb-6 p-4 bg-blue-50 rounded-xl flex items-center gap-3 max-w-xl mx-auto">
            <Loader2 size={18} className="animate-spin text-blue-500" />
            <span className="text-blue-700 text-sm font-medium">Training prediction model...</span>
          </div>
        )}

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-100 rounded-2xl p-1.5 flex gap-1.5">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                  activeTab === tab.key
                    ? 'bg-white text-green-700 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Input */}
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100">
            <AnimatePresence mode="wait">
              {activeTab === 'manual' ? (
                <motion.div key="manual" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                  <h3 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2">
                    <span className="text-xl">🔬</span>
                    Enter Soil & Climate Data
                  </h3>
                  <ManualInput
                    sensorData={sensorData}
                    onChange={setSensorData}
                    season={season}
                    onSeasonChange={setSeason}
                    soilType={soilType}
                    onSoilTypeChange={setSoilType}
                    landSize={landSize}
                    onLandSizeChange={setLandSize}
                    onPredict={handlePredict}
                    predicting={predicting}
                  />
                </motion.div>
              ) : (
                <motion.div key="iot" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                  <h3 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2">
                    <span className="text-xl">📡</span>
                    IoT Smart Farm Dashboard
                  </h3>
                  <IoTDashboard
                    sensorData={sensorData}
                    connected={iotConnected}
                    battery={iotBattery}
                    wifi={iotWifi}
                    lastSync={iotLastSync}
                    onConnect={handleIoTConnect}
                    onDisconnect={handleIoTDisconnect}
                    onSync={handleIoTSync}
                    onRunPrediction={handleIoTPredict}
                    predicting={predicting}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right: Results */}
          <div className="flex flex-col">
            {result ? (
              <div className="space-y-4 flex-1">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  🏆 Top Recommended Crops
                </h3>
                {result.predictions.map((pred, i) => (
                  <RecommendationCard key={pred.crop} prediction={pred} rank={i} landSize={landSize} />
                ))}

                <div className="mt-6">
                  <PredictionAnalytics result={result} />
                </div>

                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl p-6 mt-4">
                  <h4 className="font-bold text-base mb-2">💡 Pro Tip</h4>
                  <p className="text-sm opacity-90">
                    Rotate crops seasonally to maintain soil health. Legumes like Soybean and Moong fix nitrogen
                    naturally, benefiting subsequent crops like Wheat and Cotton.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-100 flex-1 flex flex-col items-center justify-center">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">🌱</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Ready for Recommendations</h3>
                <p className="text-gray-500 mb-6">
                  {activeTab === 'manual'
                    ? 'Enter your soil data on the left and click "Get Crop Recommendation"'
                    : 'Connect your ESP32 device or tap "Run Prediction" with simulated data'}
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {['Rice', 'Wheat', 'Cotton', 'Sugarcane', 'Potato'].map((crop) => (
                    <span key={crop} className="px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-xs font-medium">{crop}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CropRecommender;
