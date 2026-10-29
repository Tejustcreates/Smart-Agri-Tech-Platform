import { Router, Response } from 'express';
import prisma from '../config/database';
import { authenticate, AuthRequest } from '../middleware/auth';
import { matchSchemesForUser } from './schemes';

const router = Router();

// GET /api/dashboard — farmer dashboard summary
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;

  const [user, farms, recentDetections, notifications] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true, preferredLanguage: true, district: true, state: true,
        farmerCategory: true, landholdingSize: true,
      },
    }),
    prisma.farm.findMany({
      where: { userId },
      include: { cropRecords: true },
    }),
    prisma.diseaseDetection.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 3,
    }),
    prisma.notification.findMany({
      where: { userId, isRead: false },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
  ]);

  // Count the schemes this farmer currently qualifies for. This is derived
  // from the same rules as GET /api/schemes/match so the dashboard is never
  // stuck at zero just because no scheme_match rows have been persisted yet.
  const schemeMatches = user ? matchSchemesForUser(user) : [];

  res.json({
    user,
    farms,
    recentDetections,
    notifications,
    schemeMatches: schemeMatches.length,
    matchedSchemes: schemeMatches.slice(0, 3),
    summary: {
      totalFarms: farms.length,
      totalArea: farms.reduce((sum, f) => sum + f.areaAcres, 0),
      activeCrops: farms.reduce((sum, f) => sum + f.cropRecords.filter(c => c.status === 'GROWING').length, 0),
    },
  });
});

// GET /api/dashboard/stats
router.get('/stats', authenticate, async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;

  const [farmCount, detectionCount, bookingCount] = await Promise.all([
    prisma.farm.count({ where: { userId } }),
    prisma.diseaseDetection.count({ where: { userId } }),
    prisma.equipmentBooking.count({ where: { farmerId: userId } }),
  ]);

  res.json({ farmCount, detectionCount, bookingCount });
});

export default router;
