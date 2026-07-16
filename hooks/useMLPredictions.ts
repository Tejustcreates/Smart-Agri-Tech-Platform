import { useMemo } from 'react';
import { WeatherData, MLPredictionResult, WeatherAlert } from '../types/weather';
import { predictRainFromWeather, getCropRecommendations, assessDiseaseRisk, generateAdvisory } from '../services/ml';

function generateAlerts(data: WeatherData): WeatherAlert[] {
  const alerts: WeatherAlert[] = [];
  const { current, daily } = data;
  const today = daily[0];

  if (today && today.precipitationProbabilityMax > 80) {
    alerts.push({
      id: 'heavy-rain',
      type: 'rain',
      severity: 'high',
      title: 'Heavy Rain Alert',
      message: `${today.precipitationProbabilityMax}% chance of rain today. Expected ${today.rainSum.toFixed(1)}mm precipitation.`,
    });
  }

  if (current.windSpeed > 30) {
    alerts.push({
      id: 'high-wind',
      type: 'wind',
      severity: 'high',
      title: 'High Wind Warning',
      message: `Wind speeds of ${current.windSpeed} km/h detected. Avoid spraying and secure loose structures.`,
    });
  }

  if (current.temperature > 40) {
    alerts.push({
      id: 'extreme-heat',
      type: 'heat',
      severity: 'high',
      title: 'Extreme Heat Warning',
      message: `Temperature at ${current.temperature}°C. Increase irrigation and provide shade for crops.`,
    });
  }

  if (current.uvIndex > 8) {
    alerts.push({
      id: 'high-uv',
      type: 'uv',
      severity: 'medium',
      title: 'High UV Index',
      message: `UV index at ${current.uvIndex}. Avoid prolonged field exposure during midday.`,
    });
  }

  if (current.humidity > 90 && current.temperature > 20 && current.temperature < 30) {
    alerts.push({
      id: 'disease-risk',
      type: 'rain',
      severity: 'medium',
      title: 'Disease Risk Elevated',
      message: 'High humidity with mild temperatures creates favorable conditions for fungal diseases.',
    });
  }

  if (today && today.temperatureMin < 5) {
    alerts.push({
      id: 'frost-risk',
      type: 'cold',
      severity: 'high',
      title: 'Frost Risk',
      message: `Temperature dropping to ${today.temperatureMin}°C tonight. Protect sensitive crops.`,
    });
  }

  return alerts;
}

function computeHealthScore(data: WeatherData, rainConfidence: number): number {
  let score = 70;
  const { current, daily } = data;
  const today = daily[0];

  if (current.temperature >= 18 && current.temperature <= 32) score += 5;
  else if (current.temperature >= 10 && current.temperature <= 38) score += 2;
  else score -= 5;

  if (current.humidity >= 40 && current.humidity <= 80) score += 5;
  else if (current.humidity >= 30 && current.humidity <= 90) score += 2;
  else score -= 3;

  if (current.windSpeed < 20) score += 3;
  else if (current.windSpeed > 40) score -= 5;

  if (today && today.precipitationProbabilityMax > 80) score -= 5;
  if (today && today.precipitationProbabilityMax < 20) score += 2;

  if (current.uvIndex > 10) score -= 3;

  if (!rainConfidence || rainConfidence < 30) score += 5;

  return Math.max(0, Math.min(100, Math.round(score)));
}

export function useMLPredictions(weatherData: WeatherData | null): MLPredictionResult | null {
  return useMemo(() => {
    if (!weatherData) return null;

    const rainPrediction = predictRainFromWeather(
      weatherData.current,
      weatherData.hourly,
      weatherData.daily
    );

    const cropRecommendations = getCropRecommendations(weatherData.current, weatherData.daily);
    const diseaseRisks = assessDiseaseRisk(weatherData.current, weatherData.daily);
    const advisory = generateAdvisory(weatherData.current, weatherData.daily, rainPrediction.confidence);
    const alerts = generateAlerts(weatherData);
    const agricultureHealthScore = computeHealthScore(weatherData, rainPrediction.confidence);

    return {
      rainPrediction,
      cropRecommendations,
      diseaseRisks,
      advisory,
      alerts,
      agricultureHealthScore,
    };
  }, [weatherData]);
}
