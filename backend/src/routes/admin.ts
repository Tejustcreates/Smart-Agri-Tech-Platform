import { Router, Response } from 'express';
import { z } from 'zod';
import prisma from '../config/database';
import { authenticate, requireRole, AuthRequest } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router();

// All admin routes require admin or field_officer role
router.use(authenticate, requireRole('ADMIN', 'FIELD_OFFICER'));

// ─── Users ──────────────────────────────────────────────────

router.get('/users', async (req: AuthRequest, res: Response) => {
  const users = await prisma.user.findMany({
    select: {
      id: true, name: true, mobileNumber: true, email: true, role: true,
      district: true, state: true, farmerCategory: true, isOnboarded: true,
      isActive: true, createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ users });
});

// ─── Government Schemes CRUD ────────────────────────────────

const schemeSchema = z.object({
  schemeName: z.string().min(2),
  description: z.string().min(10),
  eligibilityJson: z.any(),
  benefits: z.string(),
  requiredDocuments: z.string(),
  state: z.string().optional(),
  applicationLink: z.string().url().optional(),
});

router.get('/schemes', async (_req, res: Response) => {
  const schemes = await prisma.governmentScheme.findMany({ orderBy: { createdAt: 'desc' } });
  res.json({ schemes });
});

router.post('/schemes', validate(schemeSchema), async (req, res: Response) => {
  const scheme = await prisma.governmentScheme.create({ data: req.body });
  res.status(201).json({ scheme });
});

router.put('/schemes/:id', validate(schemeSchema.partial()), async (req, res: Response) => {
  const scheme = await prisma.governmentScheme.update({
    where: { id: req.params.id as string },
    data: req.body as any,
  });
  res.json({ scheme });
});

router.delete('/schemes/:id', async (req, res: Response) => {
  await prisma.governmentScheme.delete({ where: { id: req.params.id as string } });
  res.json({ message: 'Scheme deleted' });
});

// ─── News CRUD ──────────────────────────────────────────────

const newsSchema = z.object({
  title: z.string().min(2),
  summary: z.string().min(10),
  content: z.string().optional(),
  category: z.string(),
  language: z.string().default('en'),
  source: z.string().optional(),
  imageUrl: z.string().url().optional(),
});

router.get('/news', async (_req, res: Response) => {
  const articles = await prisma.newsArticle.findMany({ orderBy: { publishedAt: 'desc' } });
  res.json({ articles });
});

router.post('/news', validate(newsSchema), async (req, res: Response) => {
  const article = await prisma.newsArticle.create({
    data: {
      ...req.body,
      language: req.body.language as string || 'en',
      source: req.body.source as string | undefined,
      imageUrl: req.body.imageUrl as string | undefined,
    },
  });
  res.status(201).json({ article });
});

router.put('/news/:id', validate(newsSchema.partial()), async (req, res: Response) => {
  const article = await prisma.newsArticle.update({
    where: { id: req.params.id as string },
    data: {
      ...req.body,
      language: req.body.language as string | undefined,
      source: req.body.source as string | undefined,
      imageUrl: req.body.imageUrl as string | undefined,
    },
  });
  res.json({ article });
});

router.delete('/news/:id', async (req, res: Response) => {
  await prisma.newsArticle.delete({ where: { id: req.params.id as string } });
  res.json({ message: 'Article deleted' });
});

// ─── Equipment CRUD ─────────────────────────────────────────

router.get('/equipment', async (_req, res: Response) => {
  const listings = await prisma.equipmentListing.findMany({
    include: { owner: { select: { id: true, name: true, mobileNumber: true } } },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ listings });
});

router.put('/equipment/:id', async (req, res: Response) => {
  const listing = await prisma.equipmentListing.update({
    where: { id: req.params.id },
    data: req.body,
  });
  res.json({ listing });
});

router.delete('/equipment/:id', async (req, res: Response) => {
  await prisma.equipmentListing.delete({ where: { id: req.params.id } });
  res.json({ message: 'Listing deleted' });
});

// ─── Mandi Prices CRUD ──────────────────────────────────────

const mandiSchema = z.object({
  cropName: z.string(),
  mandiName: z.string(),
  district: z.string(),
  state: z.string(),
  pricePerQuintal: z.number().positive(),
  priceDate: z.string().transform(d => new Date(d)),
});

router.get('/mandi-prices', async (_req, res: Response) => {
  const prices = await prisma.mandiPrice.findMany({ orderBy: { priceDate: 'desc' }, take: 100 });
  res.json({ prices });
});

router.post('/mandi-prices', validate(mandiSchema), async (req, res: Response) => {
  const price = await prisma.mandiPrice.create({ data: req.body });
  res.status(201).json({ price });
});

// ─── Stats ──────────────────────────────────────────────────

router.get('/stats', async (_req, res: Response) => {
  const [users, farms, schemes, news, equipment, mandiPrices] = await Promise.all([
    prisma.user.count(),
    prisma.farm.count(),
    prisma.governmentScheme.count(),
    prisma.newsArticle.count(),
    prisma.equipmentListing.count(),
    prisma.mandiPrice.count(),
  ]);

  res.json({ users, farms, schemes, news, equipment, mandiPrices });
});

export default router;
