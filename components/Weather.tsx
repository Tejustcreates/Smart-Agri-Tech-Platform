import React, { useState, useCallback, useEffect } from 'react';
import { Section } from '../types';
import * as tf from '@tensorflow/tfjs';
import axios from 'axios';

interface WeatherData {
  city: string;
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  icon: string;
  rainfall: number;
  pressure: number;
  visibility: number;
  forecast: {
    day: string;
    temp: number;
    icon: string;
    rainProb: number;
  }[];
}

interface RainPrediction {
  willRain: boolean;
  confidence: number;
  recommendation: string;
}

interface CropSuggestion {
  crop: string;
  suitability: string;
  season: string;
}

const WEATHER_ICONS: Record<string, string> = {
  '01d': 'fas fa-sun',
  '01n': 'fas fa-moon',
  '02d': 'fas fa-cloud-sun',
  '02n': 'fas fa-cloud-moon',
  '03d': 'fas fa-cloud',
  '03n': 'fas fa-cloud',
  '04d': 'fas fa-cloud-meatball',
  '04n': 'fas fa-cloud-meatball',
  '09d': 'fas fa-cloud-showers-heavy',
  '09n': 'fas fa-cloud-showers-heavy',
  '10d': 'fas fa-cloud-rain',
  '10n': 'fas fa-cloud-rain',
  '11d': 'fas fa-bolt',
  '11n': 'fas fa-bolt',
  '13d': 'fas fa-snowflake',
  '13n': 'fas fa-snowflake',
  '50d': 'fas fa-smog',
  '50n': 'fas fa-smog',
};

const RECOMMENDED_CROPS: Record<string, string[]> = {
  hot: ['Rice', 'Cotton', 'Sugarcane', 'Maize'],
  warm: ['Wheat', 'Soybean', 'Mustard', 'Potato'],
  mild: ['Wheat', 'Barley', 'Onion', 'Tomato'],
  cool: ['Peas', 'Garlic', 'Lettuce', 'Cabbage'],
};

let rainModel: tf.LayersModel | null = null;

const initializeRainModel = async () => {
  if (rainModel) return rainModel;
  
  rainModel = tf.sequential({
    layers: [
      tf.layers.dense({ inputShape: [4], units: 16, activation: 'relu' }),
      tf.layers.dense({ units: 8, activation: 'relu' }),
      tf.layers.dense({ units: 1, activation: 'sigmoid' }),
    ],
  });

  rainModel.compile({
    optimizer: 'adam',
    loss: 'binaryCrossentropy',
    metrics: ['accuracy'],
  });

  const trainingData = tf.tensor2d([
    [30, 80, 1013, 10],
    [25, 85, 1010, 5],
    [20, 90, 1008, 2],
    [15, 95, 1005, 1],
    [28, 75, 1015, 15],
    [32, 70, 1018, 20],
    [22, 88, 1012, 3],
    [18, 92, 1009, 1],
    [26, 78, 1014, 8],
    [24, 82, 1011, 5],
    [35, 65, 1020, 25],
    [19, 94, 1006, 1],
    [27, 77, 1013, 7],
    [21, 89, 1010, 2],
    [23, 80, 1015, 6],
  ], [15, 4]);

  const labels = tf.tensor2d([
    [1], [1], [0], [0], [0],
    [0], [1], [0], [0], [0],
    [0], [0], [0], [0], [0],
  ], [15, 1]);

  await rainModel.fit(trainingData, labels, { epochs: 100, verbose: 0 });
  
  trainingData.dispose();
  labels.dispose();
  
  return rainModel;
};

const predictRain = async (
  temperature: number,
  humidity: number,
  pressure: number,
  windSpeed: number
): Promise<RainPrediction> => {
  try {
    const model = await initializeRainModel();
    const input = tf.tensor2d([[temperature, humidity, pressure / 1000, windSpeed / 10]]);
    const prediction = model.predict(input) as tf.Tensor;
    const probability = (await prediction.data())[0];
    input.dispose();
    prediction.dispose();

    let recommendation = '';
    if (probability > 0.7) {
      recommendation = 'Heavy rain expected. Avoid spraying pesticides or fertilizers. Delay irrigation.';
    } else if (probability > 0.5) {
      recommendation = 'Light rain possible. Postpone pesticide application. Prepare drainage.';
    } else if (probability > 0.3) {
      recommendation = 'Rain unlikely. Good time for harvesting dry crops.';
    } else {
      recommendation = 'Clear weather expected. Ideal for field work and spraying.';
    }

    return {
      willRain: probability > 0.5,
      confidence: Math.round(probability * 100),
      recommendation,
    };
  } catch {
    return {
      willRain: false,
      confidence: 50,
      recommendation: 'Unable to predict. Check local weather updates.',
    };
  }
};

const getCropSuggestions = (temp: number, humidity: number, season: string): CropSuggestion[] => {
  const tempCategory = temp > 30 ? 'hot' : temp > 20 ? 'warm' : temp > 10 ? 'mild' : 'cool';
  const crops = RECOMMENDED_CROPS[tempCategory] || RECOMMENDED_CROPS.mild;
  
  const currentMonth = new Date().getMonth();
  const currentSeason = currentMonth >= 2 && currentMonth <= 4 ? 'Summer' 
    : currentMonth >= 5 && currentMonth <= 7 ? 'Monsoon'
    : currentMonth >= 8 && currentMonth <= 10 ? 'Autumn'
    : 'Winter';

  return crops.map(crop => ({
    crop,
    suitability: humidity > 70 ? 'High' : humidity > 50 ? 'Medium' : 'Low',
    season: currentSeason,
  }));
};

const Weather: React.FC = () => {
  const [city, setCity] = useState('');
  const [location, setLocation] = useState('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [rainPrediction, setRainPrediction] = useState<RainPrediction | null>(null);
  const [cropSuggestions, setCropSuggestions] = useState<CropSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [modelLoading, setModelLoading] = useState(false);

  const fetchWeatherData = useCallback(async () => {
    const trimmedCity = city.trim();
    if (!trimmedCity) {
      setError('Please enter a city name.');
      return;
    }
    setLoading(true);
    setError('');
    setWeatherData(null);
    setRainPrediction(null);
    setCropSuggestions([]);

    try {
      const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY || 'demo';
      
      if (apiKey === 'demo' || !apiKey) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        const temp = 25 + (trimmedCity.length % 15);
        const humidity = 60 + (trimmedCity.length % 30);
        const mockData: WeatherData = {
          city: trimmedCity.charAt(0).toUpperCase() + trimmedCity.slice(1),
          temperature: temp,
          description: 'Partly Cloudy',
          humidity,
          windSpeed: 15 + (trimmedCity.length % 10),
          icon: '04d',
          rainfall: trimmedCity.length % 2 === 0 ? 0 : 5,
          pressure: 1013,
          visibility: 10,
          forecast: (() => {
            const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const today = new Date().getDay();
            return [
              { day: days[(today + 1) % 7], temp: temp + 2, icon: '01d', rainProb: 10 },
              { day: days[(today + 2) % 7], temp: temp - 1, icon: '10d', rainProb: 70 },
              { day: days[(today + 3) % 7], temp: temp + 1, icon: '04d', rainProb: 30 },
              { day: days[(today + 4) % 7], temp: temp + 3, icon: '01d', rainProb: 5 },
              { day: days[(today + 5) % 7], temp: temp, icon: '02d', rainProb: 20 },
            ];
          })(),
        };
        setWeatherData(mockData);
        setLocation(trimmedCity);
      } else {
        const weatherResponse = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(trimmedCity)},IN&units=metric&appid=${apiKey}`
        );
        const forecastResponse = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(trimmedCity)},IN&units=metric&appid=${apiKey}`
        );

        const data = weatherResponse.data;
        const forecastList = forecastResponse.data.list.slice(0, 5);

        const weather: WeatherData = {
          city: data.name,
          temperature: Math.round(data.main.temp),
          description: data.weather[0].description,
          icon: data.weather[0].icon,
          humidity: data.main.humidity,
          windSpeed: Math.round(data.wind.speed * 3.6),
          rainfall: data.rain?.['1h'] || 0,
          pressure: data.main.pressure,
          visibility: Math.round((data.visibility || 10000) / 1000),
          forecast: forecastList.map((f: any, i: number) => ({
            day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'][i] || `Day ${i + 1}`,
            temp: Math.round(f.main.temp),
            icon: f.weather[0].icon,
            rainProb: Math.round((f.pop || 0) * 100),
          })),
        };

        setWeatherData(weather);
        setLocation(data.name);
      }
    } catch (err) {
      setError('Failed to fetch weather data. Please check the city name.');
      console.error('Weather API error:', err);
    } finally {
      setLoading(false);
    }
  }, [city]);

  useEffect(() => {
    if (weatherData) {
      const getPredictions = async () => {
        setModelLoading(true);
        const rain = await predictRain(
          weatherData.temperature,
          weatherData.humidity,
          weatherData.pressure,
          weatherData.windSpeed
        );
        setRainPrediction(rain);
        
        const crops = getCropSuggestions(
          weatherData.temperature,
          weatherData.humidity,
          'current'
        );
        setCropSuggestions(crops);
        setModelLoading(false);
      };
      getPredictions();
    }
  }, [weatherData]);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'rain': return 'fa-cloud-showers-heavy text-blue-500';
      case 'temperature': return 'fa-thermometer-half text-red-500';
      case 'wind': return 'fa-wind text-gray-500';
      case 'humidity': return 'fa-water text-cyan-500';
      default: return 'fa-info-circle text-green-500';
    }
  };

  const generateAlerts = () => {
    if (!weatherData) return [];
    
    const alerts: { type: string; message: string; severity: 'low' | 'medium' | 'high' }[] = [];
    
    if (rainPrediction?.willRain) {
      alerts.push({
        type: 'rain',
        message: `${rainPrediction.recommendation}`,
        severity: rainPrediction.confidence > 70 ? 'high' : 'medium',
      });
    }
    
    if (weatherData.temperature > 35) {
      alerts.push({
        type: 'temperature',
        message: 'High temperature alert! Increase irrigation frequency and provide shade for sensitive crops.',
        severity: 'high',
      });
    } else if (weatherData.temperature > 30) {
      alerts.push({
        type: 'temperature',
        message: 'Warm conditions. Monitor soil moisture levels closely.',
        severity: 'medium',
      });
    }
    
    if (weatherData.windSpeed > 30) {
      alerts.push({
        type: 'wind',
        message: 'Strong winds expected. Avoid spraying pesticides and secure loose structures.',
        severity: 'high',
      });
    }
    
    if (weatherData.humidity > 85) {
      alerts.push({
        type: 'humidity',
        message: 'High humidity! Risk of fungal diseases. Ensure proper ventilation in greenhouses.',
        severity: 'medium',
      });
    }
    
    return alerts;
  };

  return (
    <section id={Section.WEATHER} className="py-16 md:py-24 bg-gradient-to-b from-blue-50/60 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 rounded-full px-4 py-1.5 text-sm font-medium mb-4">
            <i className="fas fa-cloud-sun text-xs"></i>
            Weather Intelligence
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            Smart Weather <span className="text-green-600">Predictions</span>
          </h2>
          <p className="text-gray-500 mt-3 max-w-lg mx-auto">ML-powered weather forecasts and farming recommendations for your area</p>
        </div>

        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-xl p-6 md:p-8">
          {(() => {
            const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
            const isDemo = !apiKey || apiKey === 'your_openweathermap_api_key_here';
            return isDemo ? (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-700 flex items-center gap-2">
                <i className="fas fa-info-circle"></i>
                <span>Demo Mode — Add <code className="bg-yellow-100 px-1 rounded">VITE_OPENWEATHER_API_KEY</code> to <code className="bg-yellow-100 px-1 rounded">.env.local</code> for real weather data</span>
              </div>
            ) : null;
          })()}
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter your city (e.g., Pune, Delhi)"
              className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              onKeyDown={(e) => e.key === 'Enter' && fetchWeatherData()}
            />
            <button
              onClick={fetchWeatherData}
              disabled={loading}
              className="px-8 py-3 text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-green-400 transition-colors font-semibold flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Fetching...
                </>
              ) : (
                <>
                  <i className="fas fa-search"></i>
                  Get Weather
                </>
              )}
            </button>
          </div>
          {error && (
            <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
              <i className="fas fa-exclamation-circle mr-2"></i>
              {error}
            </div>
          )}
        </div>

        {weatherData && (
          <div className="mt-8 space-y-6">
            <div className="bg-white rounded-xl shadow-xl p-6 md:p-8 animate-fade-in-up">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
                    <i className="fas fa-map-marker-alt text-green-600"></i>
                    {weatherData.city}
                  </h3>
                  <p className="text-gray-500 capitalize">{weatherData.description}</p>
                </div>
                <div className="flex items-center gap-4 mt-4 md:mt-0">
                  <i className={`${WEATHER_ICONS[weatherData.icon] || 'fas fa-cloud'} text-5xl md:text-6xl text-yellow-400`}></i>
                  <p className="text-5xl md:text-6xl font-bold text-gray-800">{weatherData.temperature}°C</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <i className="fas fa-tint text-blue-500 text-xl mb-2"></i>
                  <p className="text-2xl font-bold text-gray-800">{weatherData.humidity}%</p>
                  <p className="text-sm text-gray-500">Humidity</p>
                </div>
                <div className="bg-gray-100 rounded-lg p-4 text-center">
                  <i className="fas fa-wind text-gray-500 text-xl mb-2"></i>
                  <p className="text-2xl font-bold text-gray-800">{weatherData.windSpeed} km/h</p>
                  <p className="text-sm text-gray-500">Wind Speed</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <i className="fas fa-cloud-rain text-blue-500 text-xl mb-2"></i>
                  <p className="text-2xl font-bold text-gray-800">{weatherData.rainfall} mm</p>
                  <p className="text-sm text-gray-500">Rainfall</p>
                </div>
                <div className="bg-gray-100 rounded-lg p-4 text-center">
                  <i className="fas fa-tachometer-alt text-gray-500 text-xl mb-2"></i>
                  <p className="text-2xl font-bold text-gray-800">{weatherData.pressure}</p>
                  <p className="text-sm text-gray-500">Pressure (hPa)</p>
                </div>
              </div>

              <h4 className="text-lg font-semibold text-gray-700 mb-4">5-Day Forecast</h4>
              <div className="flex justify-around overflow-x-auto pb-2">
                {weatherData.forecast.map((day, index) => (
                  <div key={index} className="flex flex-col items-center min-w-[80px]">
                    <p className="font-semibold text-gray-600">{day.day}</p>
                    <i className={`${WEATHER_ICONS[day.icon] || 'fas fa-cloud'} text-2xl text-gray-500 my-2`}></i>
                    <p className="font-bold text-gray-800">{day.temp}°C</p>
                    <p className="text-xs text-blue-500 mt-1">
                      <i className="fas fa-umbrella mr-1"></i>
                      {day.rainProb}%
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {modelLoading && (
              <div className="bg-blue-50 rounded-xl p-6 text-center">
                <i className="fas fa-brain text-blue-500 text-3xl mb-3 animate-pulse"></i>
                <p className="text-gray-600">Loading prediction models...</p>
              </div>
            )}

            {rainPrediction && (
              <div className={`rounded-xl p-6 animate-fade-in-up ${
                rainPrediction.willRain 
                  ? rainPrediction.confidence > 70 
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                    : 'bg-gradient-to-r from-blue-400 to-blue-500 text-white'
                  : 'bg-gradient-to-r from-green-500 to-green-600 text-white'
              }`}>
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                    rainPrediction.willRain ? 'bg-white/20' : 'bg-white/20'
                  }`}>
                    <i className={`${rainPrediction.willRain ? 'fas fa-cloud-showers-heavy' : 'fas fa-sun'} text-3xl`}></i>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold">Rain Prediction</h4>
                    <p className="text-sm opacity-90 mt-1">
                      {rainPrediction.willRain 
                        ? `Rain expected with ${rainPrediction.confidence}% confidence`
                        : `Clear weather predicted with ${100 - rainPrediction.confidence}% confidence`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm opacity-75">ML Confidence</p>
                    <p className="text-2xl font-bold">{rainPrediction.confidence}%</p>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-white/20 rounded-lg backdrop-blur-sm">
                  <i className="fas fa-lightbulb mr-2"></i>
                  <span className="font-medium">{rainPrediction.recommendation}</span>
                </div>
              </div>
            )}

            {generateAlerts().length > 0 && (
              <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-lg p-6">
                <h4 className="text-lg font-bold text-yellow-800 flex items-center gap-2 mb-4">
                  <i className="fas fa-exclamation-triangle"></i>
                  Smart Farming Alerts
                </h4>
                <div className="space-y-3">
                  {generateAlerts().map((alert, index) => (
                    <div 
                      key={index}
                      className={`flex items-start gap-3 p-3 rounded-lg ${
                        alert.severity === 'high' ? 'bg-red-100' : 'bg-yellow-100'
                      }`}
                    >
                      <i className={`${getAlertIcon(alert.type)} text-xl mt-1`}></i>
                      <p className={`text-sm ${alert.severity === 'high' ? 'text-red-800' : 'text-yellow-800'}`}>
                        {alert.message}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {cropSuggestions.length > 0 && (
              <div className="bg-green-50 rounded-xl p-6">
                <h4 className="text-lg font-bold text-green-800 flex items-center gap-2 mb-4">
                  <i className="fas fa-seedling"></i>
                  Recommended Crops for Current Weather
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {cropSuggestions.map((suggestion, index) => (
                    <div 
                      key={index}
                      className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-semibold text-gray-800">{suggestion.crop}</h5>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          suggestion.suitability === 'High' 
                            ? 'bg-green-200 text-green-800'
                            : suggestion.suitability === 'Medium'
                            ? 'bg-yellow-200 text-yellow-800'
                            : 'bg-orange-200 text-orange-800'
                        }`}>
                          {suggestion.suitability}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        <i className="fas fa-calendar-alt mr-1"></i>
                        Best for: {suggestion.season}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {!weatherData && !loading && (
          <div className="mt-12 text-center">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
              <i className="fas fa-satellite-dish text-green-600 text-5xl mb-4"></i>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Real-Time Weather Data</h3>
              <p className="text-gray-600 mb-4">
                Get accurate weather forecasts integrated with ML predictions for smart farming decisions
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full">
                  <i className="fas fa-cloud mr-2"></i>Weather Forecast
                </span>
                <span className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full">
                  <i className="fas fa-brain mr-2"></i>Rain Prediction
                </span>
                <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full">
                  <i className="fas fa-seedling mr-2"></i>Crop Suggestions
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Weather;
