import { CurrentWeather, HourlyForecast, DailyForecast, RainPrediction } from '../../types/weather';
import { extractFeatures, featuresToArray, findCurrentHourIndex } from './featureEngineering';
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
  const nowIndex = findCurrentHourIndex(current, hourly);

  const nextRainIndex = hourly.findIndex(
    (h, i) => i >= nowIndex && (h.precipitationProbability > 50 || h.precipitation > 0)
  );
  const hoursAhead = nextRainIndex >= 0 ? nextRainIndex - nowIndex : -1;
  const forecastProbability = nextRainIndex >= 0
    ? Math.max(...hourly.slice(nextRainIndex, nextRainIndex + 3).map((h) => h.precipitationProbability)) / 100
    : 0;
  const probability = Math.max(result.probability, forecastProbability);
  const willRain = probability >= 0.5;

  let timeframe = 'No rain expected in next 48 hours';
  if (hoursAhead === 0) timeframe = 'Rain expected this hour';
  else if (hoursAhead > 0 && hoursAhead <= 3) timeframe = `Rain expected within ${hoursAhead} hours`;
  else if (hoursAhead > 3 && hoursAhead <= 12) timeframe = `Rain likely in ${hoursAhead} hours`;
  else if (hoursAhead > 12) timeframe = `Rain possible in ${Math.round(hoursAhead / 24)} day(s)`;

  let recommendation = '';
  if (willRain && probability > 0.7) {
    recommendation = 'Heavy rain likely. Delay irrigation and pesticide spraying. Ensure field drainage is clear.';
  } else if (willRain && probability > 0.5) {
    recommendation = 'Rain probable. Postpone fertilizer application. Prepare drainage channels.';
  } else if (probability > 0.3) {
    recommendation = 'Slight chance of rain. Monitor conditions before field operations.';
  } else {
    recommendation = 'Clear weather expected. Ideal for harvesting, spraying, and field work.';
  }

  return {
    willRain,
    confidence: Math.round(probability * 100),
    probability: Math.round(probability * 100),
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
