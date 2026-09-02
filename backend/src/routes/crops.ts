import { Router, Response } from 'express';
import { z } from 'zod';
import prisma from '../config/database';
import { authenticate, AuthRequest } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router();

// ─── Crop Recommendation Data ───────────────────────────────
// Rule-based scoring against known crop requirement ranges.
// Designed to be swappable with a Python ML microservice later.

interface CropProfile {
  name: string;
  nameHi: string;
  nameMr: string;
  nRange: [number, number];   // Nitrogen kg/ha
  pRange: [number, number];   // Phosphorus kg/ha
  kRange: [number, number];   // Potassium kg/ha
  tempRange: [number, number]; // Temperature °C
  humidityRange: [number, number];
  phRange: [number, number];
  rainfallRange: [number, number]; // mm
}

const CROP_PROFILES: CropProfile[] = [
  { name: 'Wheat', nameHi: 'गेहूं', nameMr: 'गहू', nRange: [40, 80], pRange: [20, 40], kRange: [20, 40], tempRange: [10, 25], humidityRange: [40, 70], phRange: [6.0, 7.5], rainfallRange: [400, 1000] },
  { name: 'Rice', nameHi: 'चावल', nameMr: 'तांदूळ', nRange: [60, 120], pRange: [20, 50], kRange: [30, 60], tempRange: [20, 35], humidityRange: [60, 90], phRange: [5.5, 7.0], rainfallRange: [1000, 2000] },
  { name: 'Maize', nameHi: 'मक्का', nameMr: 'मका', nRange: [60, 100], pRange: [30, 60], kRange: [20, 50], tempRange: [18, 32], humidityRange: [50, 80], phRange: [5.8, 7.0], rainfallRange: [500, 1200] },
  { name: 'Soybean', nameHi: 'सोयाबीन', nameMr: 'सोयाबीन', nRange: [20, 40], pRange: [30, 60], kRange: [20, 50], tempRange: [20, 30], humidityRange: [50, 80], phRange: [6.0, 7.0], rainfallRange: [600, 1000] },
  { name: 'Cotton', nameHi: 'कपास', nameMr: 'कापूस', nRange: [40, 80], pRange: [20, 40], kRange: [20, 40], tempRange: [25, 35], humidityRange: [50, 80], phRange: [6.0, 8.0], rainfallRange: [600, 1200] },
  { name: 'Sugarcane', nameHi: 'गन्ना', nameMr: 'ऊस', nRange: [80, 150], pRange: [30, 60], kRange: [40, 80], tempRange: [20, 38], humidityRange: [60, 85], phRange: [6.0, 7.5], rainfallRange: [1000, 2000] },
  { name: 'Potato', nameHi: 'आलू', nameMr: 'बटाटा', nRange: [80, 140], pRange: [40, 80], kRange: [80, 140], tempRange: [15, 25], humidityRange: [60, 80], phRange: [5.0, 6.5], rainfallRange: [500, 1000] },
  { name: 'Onion', nameHi: 'प्याज', nameMr: 'कांदा', nRange: [40, 80], pRange: [30, 60], kRange: [30, 60], tempRange: [15, 30], humidityRange: [50, 70], phRange: [6.0, 7.5], rainfallRange: [400, 800] },
  { name: 'Tomato', nameHi: 'टमाटर', nameMr: 'टोमॅटो', nRange: [60, 120], pRange: [40, 80], kRange: [40, 80], tempRange: [18, 30], humidityRange: [50, 75], phRange: [6.0, 7.0], rainfallRange: [400, 800] },
  { name: 'Mustard', nameHi: 'सरसों', nameMr: 'मोहरी', nRange: [20, 60], pRange: [20, 40], kRange: [10, 30], tempRange: [10, 25], humidityRange: [40, 70], phRange: [6.0, 7.5], rainfallRange: [300, 600] },
  { name: 'Chickpea', nameHi: 'चना', nameMr: 'हरभरा', nRange: [10, 30], pRange: [20, 50], kRange: [15, 40], tempRange: [15, 30], humidityRange: [40, 70], phRange: [6.0, 7.5], rainfallRange: [400, 700] },
  { name: 'Groundnut', nameHi: 'मूंगफली', nameMr: 'भुईमूग', nRange: [10, 30], pRange: [15, 40], kRange: [15, 40], tempRange: [25, 35], humidityRange: [50, 80], phRange: [6.0, 7.0], rainfallRange: [500, 1000] },
  { name: 'Mango', nameHi: 'आम', nameMr: 'आंबा', nRange: [40, 80], pRange: [15, 30], kRange: [20, 50], tempRange: [24, 38], humidityRange: [50, 75], phRange: [5.5, 7.5], rainfallRange: [750, 1500] },
  { name: 'Banana', nameHi: 'केला', nameMr: 'केळं', nRange: [100, 200], pRange: [30, 60], kRange: [80, 150], tempRange: [25, 35], humidityRange: [60, 90], phRange: [6.0, 7.5], rainfallRange: [1000, 2500] },
  { name: 'Pigeon Pea', nameHi: 'तूर', nameMr: 'तूर', nRange: [10, 30], pRange: [20, 50], kRange: [15, 40], tempRange: [20, 35], humidityRange: [50, 75], phRange: [6.0, 7.5], rainfallRange: [600, 1200] },
];

const recommendSchema = z.object({
  nitrogen: z.number().min(0).max(200),
  phosphorus: z.number().min(0).max(200),
  potassium: z.number().min(0).max(200),
  temperature: z.number().min(-10).max(55),
  humidity: z.number().min(0).max(100),
  soilPh: z.number().min(3).max(10),
  rainfall: z.number().min(0).max(5000),
});

// POST /api/crops/recommend — rank crops based on soil/climate inputs
router.post('/recommend', validate(recommendSchema), async (req, res: Response) => {
  const { nitrogen, phosphorus, potassium, temperature, humidity, soilPh, rainfall } = req.body;

  const scored = CROP_PROFILES.map(crop => {
    const nScore = scoreRange(nitrogen, crop.nRange);
    const pScore = scoreRange(phosphorus, crop.pRange);
    const kScore = scoreRange(potassium, crop.kRange);
    const tempScore = scoreRange(temperature, crop.tempRange);
    const humidScore = scoreRange(humidity, crop.humidityRange);
    const phScore = scoreRange(soilPh, crop.phRange);
    const rainScore = scoreRange(rainfall, crop.rainfallRange);

    // Weighted average (NPK + environment)
    const score = (
      nScore * 0.15 +
      pScore * 0.12 +
      kScore * 0.12 +
      tempScore * 0.20 +
      humidScore * 0.10 +
      phScore * 0.13 +
      rainScore * 0.18
    );

    return {
      name: crop.name,
      nameHi: crop.nameHi,
      nameMr: crop.nameMr,
      score: Math.round(score * 100),
      suitability: getSuitabilityLabel(score),
      breakdown: {
        nitrogen: Math.round(nScore * 100),
        phosphorus: Math.round(pScore * 100),
        potassium: Math.round(kScore * 100),
        temperature: Math.round(tempScore * 100),
        humidity: Math.round(humidScore * 100),
        soilPh: Math.round(phScore * 100),
        rainfall: Math.round(rainScore * 100),
      },
    };
  });

  scored.sort((a, b) => b.score - a.score);
  const topCrops = scored.slice(0, 8);

  res.json({ recommendations: topCrops, allScores: scored });
});

// GET /api/crops/profiles — list available crop profiles
router.get('/profiles', (_req, res: Response) => {
  res.json({
    crops: CROP_PROFILES.map(c => ({
      name: c.name,
      nameHi: c.nameHi,
      nameMr: c.nameMr,
      nitrogenRange: c.nRange,
      phosphorusRange: c.pRange,
      potassiumRange: c.kRange,
      tempRange: c.tempRange,
      humidityRange: c.humidityRange,
      phRange: c.phRange,
      rainfallRange: c.rainfallRange,
    })),
  });
});

// ─── IoT Sensor Data ────────────────────────────────────────

const sensorSchema = z.object({
  farmId: z.string().uuid(),
  deviceId: z.string().optional(),
  nitrogen: z.number().optional(),
  phosphorus: z.number().optional(),
  potassium: z.number().optional(),
  temperature: z.number().optional(),
  humidity: z.number().optional(),
  soilPh: z.number().optional(),
  rainfall: z.number().optional(),
});

router.post('/sensor-data', authenticate, validate(sensorSchema), async (req: AuthRequest, res: Response) => {
  const sensorData = await prisma.sensorData.create({
    data: {
      farmId: req.body.farmId,
      deviceId: req.body.deviceId as string | undefined,
      nitrogen: req.body.nitrogen,
      phosphorus: req.body.phosphorus,
      potassium: req.body.potassium,
      temperature: req.body.temperature,
      humidity: req.body.humidity,
      soilPh: req.body.soilPh,
      rainfall: req.body.rainfall,
    },
  });

  res.status(201).json({ sensorData });
});

// GET /api/crops/sensor-data/:farmId
router.get('/sensor-data/:farmId', authenticate, async (req: AuthRequest, res: Response) => {
  const data = await prisma.sensorData.findMany({
    where: { farmId: req.params.farmId as string },
    orderBy: { recordedAt: 'desc' },
    take: 50,
  });

  res.json({ sensorData: data });
});

// ─── Farm Management ────────────────────────────────────────

const farmSchema = z.object({
  farmName: z.string().min(1).max(100),
  areaAcres: z.number().positive(),
  soilType: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

router.post('/farms', authenticate, validate(farmSchema), async (req: AuthRequest, res: Response) => {
  const farm = await prisma.farm.create({
    data: {
      userId: req.user!.id,
      farmName: req.body.farmName,
      areaAcres: req.body.areaAcres,
      soilType: req.body.soilType,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
    },
  });

  res.status(201).json({ farm });
});

router.get('/farms', authenticate, async (req: AuthRequest, res: Response) => {
  const farms = await prisma.farm.findMany({
    where: { userId: req.user!.id },
    include: { cropRecords: true },
    orderBy: { createdAt: 'desc' },
  });

  res.json({ farms });
});

function scoreRange(value: number, range: [number, number]): number {
  const [min, max] = range;
  if (value >= min && value <= max) return 1.0;
  // How far outside the range (penalize proportionally)
  const rangeSize = max - min;
  const distance = value < min ? min - value : value - max;
  const penalty = Math.min(distance / rangeSize, 1);
  return Math.max(0, 1 - penalty * 1.5);
}

function getSuitabilityLabel(score: number): string {
  if (score >= 0.8) return 'Highly Suitable';
  if (score >= 0.6) return 'Suitable';
  if (score >= 0.4) return 'Moderately Suitable';
  return 'Less Suitable';
}

export default router;
