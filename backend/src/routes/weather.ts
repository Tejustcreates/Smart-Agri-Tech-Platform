import { Router, Response } from 'express';
import { z } from 'zod';
import prisma from '../config/database';
import { cacheGet, cacheSet } from '../config/redis';
import { authenticate, AuthRequest } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router();

const weatherQuerySchema = z.object({
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
});

// GET /api/weather — fetch weather from Open-Meteo with caching
router.get('/', validate(weatherQuerySchema, 'query'), async (req, res: Response) => {
  const { latitude, longitude } = req.query as any;

  // Check Redis cache first (1hr TTL)
  const cacheKey = `weather:${latitude}:${longitude}`;
  const cached = await cacheGet(cacheKey);
  if (cached) {
    res.json({ ...(cached as object), cached: true });
    return;
  }

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,rain,weather_code,wind_speed_10m,wind_direction_10m,uv_index,cloud_cover&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max&timezone=Asia/Kolkata&forecast_days=7`;

    const response = await fetch(url);
    if (!response.ok) throw new Error(`Open-Meteo API error: ${response.status}`);
    const data = await response.json();

    // Generate farming insights based on conditions
    const insights = generateFarmingInsights(data);

    const result = { ...(data as object), insights };

    // Cache for 1 hour
    await cacheSet(cacheKey, result, 3600);

    res.json({ ...(result as object), cached: false });
  } catch (error: any) {
    console.error('[Weather] Error fetching weather:', error.message);
    res.status(502).json({ error: 'Failed to fetch weather data', code: 'WEATHER_API_ERROR' });
  }
});

// GET /api/weather/insights — generate farming insights from weather
router.get('/insights', validate(weatherQuerySchema, 'query'), async (req, res: Response) => {
  const { latitude, longitude } = req.query as any;

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,rain,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max&timezone=Asia/Kolkata&forecast_days=5`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Weather API failed');
    const data = await response.json();
    const insights = generateFarmingInsights(data as any);

    res.json({ insights });
  } catch (error: any) {
    res.status(502).json({ error: 'Failed to generate insights', code: 'INSIGHT_ERROR' });
  }
});

function generateFarmingInsights(weather: any): string[] {
  const insights: string[] = [];
  const current = weather.current;
  const daily = weather.daily;

  if (!current || !daily) return insights;

  // Rain forecast
  const next3DaysRain = daily.precipitation_probability_max?.slice(0, 3) || [];
  const hasRainSoon = next3DaysRain.some((p: number) => p > 50);
  if (hasRainSoon) {
    insights.push('🌧️ Rain expected in next 3 days — delay pesticide spraying');
  }

  // Temperature extremes
  if (current.temperature_2m > 38) {
    insights.push('🌡️ High temperature alert — ensure adequate irrigation and mulching');
  }
  if (daily.temperature_2m_min?.[0] < 5) {
    insights.push('❄️ Frost risk tonight — protect sensitive crops with covers');
  }

  // Humidity
  if (current.relative_humidity_2m > 85) {
    insights.push('💧 High humidity — watch for fungal diseases, improve air circulation');
  }

  // Wind
  if (current.wind_speed_10m > 30) {
    insights.push('💨 Strong winds — avoid spraying, secure loose structures');
  }

  // General
  if (current.rain > 0) {
    insights.push('🌧️ Currently raining — no irrigation needed today');
  } else if (current.temperature_2m > 30 && current.relative_humidity_2m < 40) {
    insights.push('☀️ Hot and dry — irrigate crops, preferably in early morning or evening');
  }

  if (insights.length === 0) {
    insights.push('✅ Good conditions for field work today');
  }

  return insights;
}

export default router;
