import { Router, Response } from 'express';
import { z } from 'zod';
import prisma from '../config/database';
import { authenticate, AuthRequest } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router();

// GET /api/equipment — list equipment
router.get('/', async (req, res: Response) => {
  const { category, available, lat, lng, radius } = req.query as any;

  const where: any = {};
  if (category) where.category = { contains: category, mode: 'insensitive' };
  if (available === 'true') where.availabilityStatus = 'AVAILABLE';

  let listings = await prisma.equipmentListing.findMany({
    where,
    include: { owner: { select: { id: true, name: true, mobileNumber: true } } },
    orderBy: { createdAt: 'desc' },
  });

  // If location provided, sort by distance (Haversine)
  if (lat && lng) {
    const userLat = parseFloat(lat);
    const userLng = parseFloat(lng);
    const maxRadius = radius ? parseFloat(radius) : 50; // default 50km

    listings = listings
      .map(l => ({
        ...l,
        distance: haversineDistance(userLat, userLng, l.latitude || 0, l.longitude || 0),
      }))
      .filter((l: any) => l.distance <= maxRadius)
      .sort((a: any, b: any) => a.distance - b.distance);
  }

  res.json({ listings });
});

// GET /api/equipment/:id — equipment detail
router.get('/:id', async (req, res: Response) => {
  const listing = await prisma.equipmentListing.findUnique({
    where: { id: req.params.id as string },
    include: { owner: { select: { id: true, name: true, mobileNumber: true } } },
  });

  if (!listing) {
    res.status(404).json({ error: 'Equipment not found' });
    return;
  }

  res.json({ listing });
});

// POST /api/equipment — create listing (owner)
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  const schema = z.object({
    equipmentName: z.string().min(2),
    category: z.string(),
    rentalRate: z.number().positive(),
    rentalUnit: z.string().default('day'),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    description: z.string().optional(),
    imageUrl: z.string().url().optional(),
    contactPhone: z.string().optional(),
  });

  const data = schema.parse(req.body);
  const listing = await prisma.equipmentListing.create({
    data: {
      ownerId: req.user!.id,
      equipmentName: data.equipmentName,
      category: data.category,
      rentalRate: data.rentalRate,
      rentalUnit: data.rentalUnit,
      latitude: data.latitude,
      longitude: data.longitude,
      description: data.description,
      imageUrl: data.imageUrl,
      contactPhone: data.contactPhone,
    },
  });

  res.status(201).json({ listing });
});

// POST /api/equipment/:id/book — request rental
router.post('/:id/book', authenticate, validate(z.object({
  startDate: z.string().transform(d => new Date(d)),
  endDate: z.string().transform(d => new Date(d)),
  notes: z.string().optional(),
})), async (req: AuthRequest, res: Response) => {
  const equipment = await prisma.equipmentListing.findUnique({ where: { id: req.params.id as string } });

  if (!equipment) {
    res.status(404).json({ error: 'Equipment not found' });
    return;
  }

  if (equipment.availabilityStatus !== 'AVAILABLE') {
    res.status(400).json({ error: 'Equipment is not available for rental' });
    return;
  }

  const booking = await prisma.equipmentBooking.create({
    data: {
      equipmentId: req.params.id as string,
      farmerId: req.user!.id,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      notes: req.body.notes as string | undefined,
    },
  });

  res.status(201).json({ booking, message: 'Rental request submitted. Waiting for owner confirmation.' });
});

// GET /api/equipment/bookings/mine — my bookings
router.get('/bookings/mine', authenticate, async (req: AuthRequest, res: Response) => {
  const bookings = await prisma.equipmentBooking.findMany({
    where: { farmerId: req.user!.id },
    include: { equipment: true },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ bookings });
});

// Haversine distance in km
function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

export default router;
