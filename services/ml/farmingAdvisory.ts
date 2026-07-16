import { CurrentWeather, DailyForecast, FarmingAdvisory } from '../../types/weather';

export function generateAdvisory(
  current: CurrentWeather,
  daily: DailyForecast[],
  rainConfidence: number
): FarmingAdvisory {
  const today = daily[0];
  const hasHeavyRain = today && today.precipitationProbabilityMax > 70;
  const hasLightRain = today && today.precipitationProbabilityMax > 30 && today.precipitationProbabilityMax <= 70;
  const isWindy = current.windSpeed > 25;
  const isHot = current.temperature > 35;
  const isHumid = current.humidity > 80;
  const isUVHigh = current.uvIndex > 7;

  const irrigation = (() => {
    if (hasHeavyRain) return { recommendation: 'Skip irrigation today — rain expected.', urgency: 'low' as const, reason: 'Rain will provide sufficient moisture' };
    if (current.humidity > 85) return { recommendation: 'Reduce irrigation — high humidity slows evaporation.', urgency: 'medium' as const, reason: 'Soil moisture retention is higher in humid conditions' };
    if (current.temperature > 35) return { recommendation: 'Irrigate early morning or evening to reduce evaporation loss.', urgency: 'high' as const, reason: 'High temperatures increase water loss' };
    if (current.humidity < 40) return { recommendation: 'Increase irrigation frequency — dry conditions detected.', urgency: 'high' as const, reason: 'Low humidity accelerates soil moisture depletion' };
    return { recommendation: 'Normal irrigation schedule — monitor soil moisture.', urgency: 'medium' as const, reason: 'Current conditions are within normal range' };
  })();

  const spraying = (() => {
    if (hasHeavyRain) return { recommendation: 'Do NOT spray — rain will wash away chemicals.', urgency: 'high' as const, reason: 'Rain within 4 hours negates pesticide effectiveness' };
    if (isWindy) return { recommendation: 'Avoid spraying — wind will cause drift and uneven coverage.', urgency: 'high' as const, reason: `Wind speed ${current.windSpeed} km/h exceeds safe spraying threshold` };
    if (isHot) return { recommendation: 'Spray in early morning or late evening to avoid evaporation.', urgency: 'medium' as const, reason: 'High temperatures cause rapid chemical evaporation' };
    if (hasLightRain) return { recommendation: 'Wait 2-3 hours after rain stops before spraying.', urgency: 'medium' as const, reason: 'Wet foliage reduces chemical absorption' };
    return { recommendation: 'Good conditions for spraying — apply in calm morning.', urgency: 'low' as const, reason: 'Favorable weather for pesticide application' };
  })();

  const harvesting = (() => {
    if (hasHeavyRain) return { recommendation: 'Complete harvest before rain — crops may be damaged.', urgency: 'high' as const, reason: 'Rain can cause grain sprouting and quality loss' };
    if (today && today.precipitationHours > 4) return { recommendation: 'Delayed harvest due to wet conditions.', urgency: 'medium' as const, reason: 'Prolonged rain affects crop quality' };
    if (isHumid && current.temperature > 25) return { recommendation: 'Harvest and dry crops quickly — humidity promotes mold.', urgency: 'medium' as const, reason: 'High humidity increases fungal growth risk post-harvest' };
    return { recommendation: 'Good conditions for harvesting and drying.', urgency: 'low' as const, reason: 'Weather is suitable for field operations' };
  })();

  const planting = (() => {
    if (hasHeavyRain) return { recommendation: 'Postpone planting — wait for soil to dry.', urgency: 'high' as const, reason: 'Waterlogged soil damages seed germination' };
    if (current.humidity > 80 && current.temperature > 20) return { recommendation: 'Good window for planting — moisture is adequate.', urgency: 'low' as const, reason: 'Warm moist conditions favor germination' };
    if (isHot) return { recommendation: 'Plant early morning — protect new seedlings from heat.', urgency: 'medium' as const, reason: 'Midday heat can kill young seedlings' };
    return { recommendation: 'Suitable conditions for planting.', urgency: 'low' as const, reason: 'Current weather supports seed germination' };
  })();

  return { irrigation, spraying, harvesting, planting };
}
