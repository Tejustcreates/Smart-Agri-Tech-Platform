import { CurrentWeather, DailyForecast, DiseaseRiskAssessment } from '../../types/weather';

interface DiseaseProfile {
  name: string;
  humidityThreshold: number;
  tempRange: [number, number];
  wetnessRequired: boolean;
  riskFactors: string[];
}

const DISEASE_PROFILES: DiseaseProfile[] = [
  { name: 'Bacterial Leaf Blight', humidityThreshold: 80, tempRange: [25, 35], wetnessRequired: true, riskFactors: ['High humidity', 'Warm temperatures', 'Standing water'] },
  { name: 'Powdery Mildew', humidityThreshold: 60, tempRange: [15, 28], wetnessRequired: false, riskFactors: ['Moderate humidity', 'Mild temperatures', 'Poor ventilation'] },
  { name: 'Late Blight', humidityThreshold: 85, tempRange: [10, 25], wetnessRequired: true, riskFactors: ['High humidity', 'Cool weather', 'Prolonged leaf wetness'] },
  { name: 'Root Rot', humidityThreshold: 75, tempRange: [20, 32], wetnessRequired: true, riskFactors: ['Overwatering', 'Poor drainage', 'Warm moist soil'] },
  { name: 'Rust Disease', humidityThreshold: 70, tempRange: [15, 30], wetnessRequired: true, riskFactors: ['Morning dew', 'Moderate humidity', 'Temperature fluctuations'] },
  { name: 'Anthracnose', humidityThreshold: 75, tempRange: [22, 32], wetnessRequired: true, riskFactors: ['Rain splash', 'Warm wet conditions', 'Dense canopy'] },
];

export function assessDiseaseRisk(
  current: CurrentWeather,
  daily: DailyForecast[]
): DiseaseRiskAssessment[] {
  const hasRain = daily.slice(0, 3).some((d) => d.rainSum > 5);
  const avgTemp = daily.length > 0
    ? daily.slice(0, 3).reduce((s, d) => s + (d.temperatureMax + d.temperatureMin) / 2, 0) / Math.min(daily.length, 3)
    : current.temperature;

  return DISEASE_PROFILES.map((disease) => {
    let probability = 0;
    const activeFactors: string[] = [];

    if (current.humidity >= disease.humidityThreshold) {
      probability += 35;
      activeFactors.push(disease.riskFactors[0]);
    } else if (current.humidity >= disease.humidityThreshold - 15) {
      probability += 15;
    }

    if (avgTemp >= disease.tempRange[0] && avgTemp <= disease.tempRange[1]) {
      probability += 30;
      activeFactors.push(disease.riskFactors[1]);
    } else {
      probability += 5;
    }

    if (disease.wetnessRequired && hasRain) {
      probability += 30;
      activeFactors.push(disease.riskFactors[2]);
    } else if (disease.wetnessRequired && current.humidity > 85) {
      probability += 15;
    }

    probability = Math.min(95, probability);

    let risk: 'high' | 'medium' | 'low' = 'low';
    if (probability >= 60) risk = 'high';
    else if (probability >= 35) risk = 'medium';

    return { disease: disease.name, risk, probability, factors: activeFactors };
  })
  .sort((a, b) => b.probability - a.probability)
  .slice(0, 4);
}
