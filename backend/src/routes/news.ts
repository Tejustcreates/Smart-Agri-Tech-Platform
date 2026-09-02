import { Router, Response } from 'express';
import { z } from 'zod';
import prisma from '../config/database';

const router = Router();

const newsQuerySchema = z.object({
  category: z.string().optional(),
  language: z.string().optional(),
  limit: z.coerce.number().min(1).max(50).default(20),
});

// GET /api/news — list articles with filters
router.get('/', async (req, res: Response) => {
  const { category, language, limit } = req.query as any;

  const where: any = {};
  if (category) where.category = category;
  if (language) where.language = language;

  const articles = await prisma.newsArticle.findMany({
    where,
    orderBy: { publishedAt: 'desc' },
    take: limit,
  });

  res.json({ articles });
});

// GET /api/news/categories
router.get('/categories', async (_req, res: Response) => {
  const categories = await prisma.newsArticle.findMany({
    select: { category: true },
    distinct: ['category'],
    orderBy: { category: 'asc' },
  });
  res.json({ categories: categories.map(c => c.category) });
});

export default router;
