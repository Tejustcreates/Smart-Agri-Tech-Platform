import { CurrentWeather, DailyForecast, CropRecommendation } from '../../types/weather';

interface CropProfile {
  name: string;
  idealTempMin: number;
  idealTempMax: number;
  idealHumidityMin: number;
  idealHumidityMax: number;
  waterNeed: 'low' | 'medium' | 'high';
  season: string[];
  icon: string;
}

const CROP_PROFILES: CropProfile[] = [
  { name: 'Rice', idealTempMin: 20, idealTempMax: 35, idealHumidityMin: 60, idealHumidityMax: 100, waterNeed: 'high', season: ['monsoon', 'kharif'], icon: '🌾' },
  { name: 'Wheat', idealTempMin: 10, idealTempMax: 25, idealHumidityMin: 40, idealHumidityMax: 70, waterNeed: 'medium', season: ['winter', 'rabi'], icon: '🌾' },
  { name: 'Cotton', idealTempMin: 25, idealTempMax: 35, idealHumidityMin: 50, idealHumidityMax: 80, waterNeed: 'medium', season: ['monsoon', 'kharif'], icon: '🌿' },
  { name: 'Maize', idealTempMin: 18, idealTempMax: 32, idealHumidityMin: 50, idealHumidityMax: 80, waterNeed: 'medium', season: ['monsoon', 'summer'], icon: '🌽' },
  { name: 'Sugarcane', idealTempMin: 20, idealTempMax: 38, idealHumidityMin: 60, idealHumidityMax: 90, waterNeed: 'high', season: ['year-round'], icon: '🎋' },
  { name: 'Soybean', idealTempMin: 20, idealTempMax: 30, idealHumidityMin: 50, idealHumidityMax: 80, waterNeed: 'medium', season: ['monsoon', 'kharif'], icon: '🫘' },
  { name: 'Potato', idealTempMin: 15, idealTempMax: 25, idealHumidityMin: 60, idealHumidityMax: 80, waterNeed: 'medium', season: ['winter', 'rabi'], icon: '🥔' },
  { name: 'Onion', idealTempMin: 13, idealTempMax: 28, idealHumidityMin: 50, idealHumidityMax: 75, waterNeed: 'medium', season: ['winter', 'rabi'], icon: '🧅' },
  { name: 'Tomato', idealTempMin: 18, idealTempMax: 30, idealHumidityMin: 50, idealHumidityMax: 80, waterNeed: 'medium', season: ['year-round'], icon: '🍅' },
  { name: 'Mustard', idealTempMin: 10, idealTempMax: 25, idealHumidityMin: 40, idealHumidityMax: 70, waterNeed: 'low', season: ['winter', 'rabi'], icon: '🌼' },
  { name: 'Chickpea', idealTempMin: 15, idealTempMax: 28, idealHumidityMin: 40, idealHumidityMax: 65, waterNeed: 'low', season: ['winter', 'rabi'], icon: '🌱' },
  { name: 'Groundnut', idealTempMin: 22, idealTempMax: 32, idealHumidityMin: 50, idealHumidityMax: 75, waterNeed: 'medium', season: ['monsoon', 'kharif', 'summer'], icon: '🥜' },
  { name: 'Moong Bean', idealTempMin: 20, idealTempMax: 35, idealHumidityMin: 40, idealHumidityMax: 70, waterNeed: 'low', season: ['monsoon', 'kharif', 'summer'], icon: '🫘' },
];

function getCurrentSeason(): string {
  const month = new Date().getMonth();
  if (month >= 5 && month <= 9) return 'monsoon';
  if (month >= 10 && month <= 2) return 'winter';
  return 'summer';
}

export function getCropRecommendations(
  current: CurrentWeather,
  daily: DailyForecast[]
): CropRecommendation[] {
  const season = getCurrentSeason();
  const avgTemp = daily.length > 0
    ? daily.slice(0, 3).reduce((s, d) => s + (d.temperatureMax + d.temperatureMin) / 2, 0) / Math.min(daily.length, 3)
    : current.temperature;
  const rain7 = daily.slice(0, 7).reduce((sum, day) => sum + day.rainSum, 0);

  return CROP_PROFILES.map((crop) => {
    let score = 0;
    const reasons: string[] = [];

    if (avgTemp >= crop.idealTempMin && avgTemp <= crop.idealTempMax) {
      score += 35;
      reasons.push('Temperature ideal');
    } else {
      const dist = avgTemp < crop.idealTempMin
        ? crop.idealTempMin - avgTemp
        : avgTemp - crop.idealTempMax;
      if (dist <= 5) { score += 18; reasons.push('Temperature acceptable'); }
      else { score += 5; reasons.push('Temperature not ideal'); }
    }

    if (current.humidity >= crop.idealHumidityMin && current.humidity <= crop.idealHumidityMax) {
      score += 25;
      reasons.push('Humidity ideal');
    } else {
      score += 10;
      reasons.push('Humidity marginal');
    }

    const seasonMatch = crop.season.includes(season) || crop.season.includes('year-round');
    if (seasonMatch) { score += 25; reasons.push('In-season crop'); }
    else { score += 5; reasons.push('Off-season'); }

    if (crop.waterNeed === 'high') {
      if (rain7 >= 40) { score += 15; reasons.push('Rainfall supports high water need'); }
      else if (rain7 >= 15) { score += 8; reasons.push('Supplemental irrigation needed'); }
      else reasons.push('High irrigation required');
    } else if (crop.waterNeed === 'medium') {
      if (rain7 >= 10 && rain7 <= 70) { score += 15; reasons.push('Rainfall matches water need'); }
      else if (rain7 > 70) { score += 6; reasons.push('Excess rain may waterlog fields'); }
      else { score += 8; reasons.push('Moderate irrigation needed'); }
    } else if (rain7 <= 30) { score += 15; reasons.push('Low water need suits current rain'); }
    else { score += 5; reasons.push('Too wet for low-water crop'); }

    score = Math.min(100, score);

    let suitability: 'high' | 'medium' | 'low' = 'low';
    if (score >= 70) suitability = 'high';
    else if (score >= 45) suitability = 'medium';

    return {
      crop: crop.name,
      suitability,
      reason: reasons.join('. '),
      icon: crop.icon,
    };
  })
  .sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.suitability] - order[b.suitability];
  })
  .slice(0, 6);
}
