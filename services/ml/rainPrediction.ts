import { CurrentWeather, HourlyForecast, DailyForecast, RainPrediction } from '../../types/weather';
import { extractFeatures, featuresToArray } from './featureEngineering';
import { getModel, predictRain } from './randomForest';

export function predictRainFromWeather(
  current: CurrentWeather,
  hourly: HourlyForecast[],
  daily: DailyForecast[]
): RainPrediction {
  const features = extractFeatures(current, hourly, daily);
  const featureArray = featuresToArray(features);
  const model = getModel();
  const result = predictRain(model, featureArray);

  const nextRainHour = hourly.findIndex(
    (h, i) => i > 0 && (h.precipitationProbability > 50 || h.precipitation > 0)
  );

  let timeframe = 'No rain expected in next 48 hours';
  if (nextRainHour > 0) {
    if (nextRainHour <= 3) timeframe = `Rain expected within ${nextRainHour} hours`;
    else if (nextRainHour <= 12) timeframe = `Rain likely in ${nextRainHour} hours`;
    else timeframe = `Rain possible in ${Math.round(nextRainHour / 24)} day(s)`;
  }

  let recommendation = '';
  if (result.willRain && result.probability > 0.7) {
    recommendation = 'Heavy rain likely. Delay irrigation and pesticide spraying. Ensure field drainage is clear.';
  } else if (result.willRain && result.probability > 0.5) {
    recommendation = 'Rain probable. Postpone fertilizer application. Prepare drainage channels.';
  } else if (result.probability > 0.3) {
    recommendation = 'Slight chance of rain. Monitor conditions before field operations.';
  } else {
    recommendation = 'Clear weather expected. Ideal for harvesting, spraying, and field work.';
  }

  return {
    willRain: result.willRain,
    confidence: Math.round(result.probability * 100),
    probability: Math.round(result.probability * 100),
    recommendation,
    timeframe,
  };
}

export function getDailyRainForecast(daily: DailyForecast[]): { date: string; probability: number; amount: number }[] {
  return daily.map((d) => ({
    date: d.date,
    probability: d.precipitationProbabilityMax,
    amount: d.rainSum,
  }));
}
