import { Router, Response } from 'express';
import { z } from 'zod';
import prisma from '../config/database';
import { cacheGet, cacheSet } from '../config/redis';
import { validate } from '../middleware/validate';

const router = Router();

const mandiQuerySchema = z.object({
  crop: z.string().optional(),
  district: z.string().optional(),
  state: z.string().optional(),
});

// GET /api/mandi/prices — list mandi prices with filters
router.get('/prices', validate(mandiQuerySchema, 'query'), async (req, res: Response) => {
  const { crop, district, state } = req.query as any;

  const where: any = {};
  if (crop) where.cropName = { contains: crop, mode: 'insensitive' };
  if (district) where.district = { contains: district, mode: 'insensitive' };
  if (state) where.state = { contains: state, mode: 'insensitive' };

  const prices = await prisma.mandiPrice.findMany({
    where,
    orderBy: [{ cropName: 'asc' }, { pricePerQuintal: 'desc' }],
    take: 100,
  });

  res.json({ prices });
});

// GET /api/mandi/compare/:crop — compare prices across mandis
router.get('/compare/:crop', async (req, res: Response) => {
  const { crop } = req.params;

  const cacheKey = `mandi:compare:${crop}`;
  const cached = await cacheGet(cacheKey);
  if (cached) {
    res.json({ ...(cached as object), cached: true });
    return;
  }

  const prices = await prisma.mandiPrice.findMany({
    where: { cropName: { contains: crop, mode: 'insensitive' } },
    orderBy: { pricePerQuintal: 'desc' },
  });

  // Group by mandi and get latest price per mandi
  const mandiMap = new Map<string, any>();
  for (const p of prices) {
    const existing = mandiMap.get(p.mandiName);
    if (!existing || new Date(p.priceDate) > new Date(existing.priceDate)) {
      mandiMap.set(p.mandiName, p);
    }
  }

  const mandis = Array.from(mandiMap.values()).sort((a, b) => b.pricePerQuintal - a.pricePerQuintal);

  const best = mandis[0];
  const result = {
    crop,
    mandis,
    bestMandi: best ? { name: best.mandiName, price: best.pricePerQuintal, district: best.district } : null,
    avgPrice: mandis.length ? Math.round(mandis.reduce((s, m) => s + m.pricePerQuintal, 0) / mandis.length) : 0,
  };

  await cacheSet(cacheKey, result, 1800); // cache 30 min
  res.json({ ...result, cached: false });
});

// GET /api/mandi/crops — list available crops
router.get('/crops', async (_req, res: Response) => {
  const crops = await prisma.mandiPrice.findMany({
    select: { cropName: true },
    distinct: ['cropName'],
    orderBy: { cropName: 'asc' },
  });
  res.json({ crops: crops.map(c => c.cropName) });
});

// GET /api/mandi/mandis — list available mandis
router.get('/mandis', async (_req, res: Response) => {
  const mandis = await prisma.mandiPrice.findMany({
    select: { mandiName: true, district: true, state: true },
    distinct: ['mandiName'],
    orderBy: { mandiName: 'asc' },
  });
  res.json({ mandis });
});

export default router;
