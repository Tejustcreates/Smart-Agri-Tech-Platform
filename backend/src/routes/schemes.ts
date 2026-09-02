import { Router, Response } from 'express';
import { z } from 'zod';
import prisma from '../config/database';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// ─── Eligibility rules for matching ─────────────────────────

interface EligibilityRule {
  field: string;
  operator: 'eq' | 'in' | 'gte' | 'lte' | 'contains';
  value: any;
}

interface SchemeData {
  name: string;
  description: string;
  eligibility: any;
  benefits: string;
  requiredDocuments: string;
  state?: string;
  applicationLink: string;
}

const GOVT_SCHEMES: SchemeData[] = [
  {
    name: 'PM-KISAN',
    description: 'Pradhan Mantri Kisan Samman Nidhi provides income support of ₹6,000 per year to small and marginal farmer families through direct benefit transfer.',
    eligibility: { farmerCategory: ['SMALL', 'MARGINAL'], landholdingMax: 5 },
    benefits: '₹6,000 per year in 3 equal installments of ₹2,000 each',
    requiredDocuments: 'Aadhaar card, Bank account details, Land records',
    applicationLink: 'https://pmkisan.gov.in',
  },
  {
    name: 'PMFBY - Crop Insurance',
    description: 'Pradhan Mantri Fasal Bima Yojana provides crop insurance to protect farmers against crop loss due to natural calamities, pests, and diseases.',
    eligibility: { farmerCategory: ['SMALL', 'MARGINAL', 'LARGE'] },
    benefits: 'Insurance coverage for crop loss; premium: 1.5-5% of sum insured depending on crop',
    requiredDocuments: 'Aadhaar card, Bank passbook, Land records, Sowing certificate',
    applicationLink: 'https://pmfby.gov.in',
  },
  {
    name: 'KCC - Kisan Credit Card',
    description: 'Provides affordable credit to farmers for agricultural and allied activities at subsidized interest rates.',
    eligibility: { farmerCategory: ['SMALL', 'MARGINAL', 'LARGE'] },
    benefits: 'Crop loan at 4% p.a. (after subvention), up to ₹3 lakh; 3% additional subvention for prompt repayment',
    requiredDocuments: 'Aadhaar card, Land documents, Passport-size photos, Income certificate',
    applicationLink: 'https://www.india.gov.in/programmes/pradhan-mantri-kisan-samman-nidhi',
  },
  {
    name: 'Soil Health Card Scheme',
    description: 'Provides soil health cards to farmers with crop-wise recommendations on nutrients and fertilizers.',
    eligibility: { farmerCategory: ['SMALL', 'MARGINAL', 'LARGE'] },
    benefits: 'Free soil testing and nutrient recommendations for optimal fertilizer use',
    requiredDocuments: 'Aadhaar card, Land records',
    applicationLink: 'https://soilhealth.dac.gov.in',
  },
  {
    name: 'PM Krishi Sinchai Yojana',
    description: 'Ensures water to every farm (Har Khet Ko Pani) through micro-irrigation, watershed development, and water management.',
    eligibility: { farmerCategory: ['SMALL', 'MARGINAL', 'LARGE'], hasIrrigation: false },
    benefits: '55% subsidy on micro-irrigation for small/marginal farmers, 45% for others',
    requiredDocuments: 'Aadhaar card, Bank account, Land records, Water source details',
    applicationLink: 'https://pmksy.gov.in',
  },
  {
    name: 'e-NAM - National Agriculture Market',
    description: 'Online trading platform for agricultural commodities linking APMC mandis across India.',
    eligibility: { farmerCategory: ['SMALL', 'MARGINAL', 'LARGE'] },
    benefits: 'Access to pan-India market, transparent price discovery, reduced intermediaries',
    requiredDocuments: 'Aadhaar card, Bank account, Farmer registration at local APMC',
    applicationLink: 'https://enam.gov.in',
  },
  {
    name: 'PM Kisan Maandhan Yojana',
    description: 'Pension scheme for small and marginal farmers providing ₹3,000/month after age 60.',
    eligibility: { farmerCategory: ['SMALL', 'MARGINAL'], ageMin: 18, ageMax: 40 },
    benefits: 'Guaranteed pension of ₹3,000/month after age 60; government matches contribution',
    requiredDocuments: 'Aadhaar card, Bank account, Age proof',
    applicationLink: 'https://maandhan.in',
  },
  {
    name: 'Paramparagat Krishi Vikas Yojana',
    description: 'Promotes organic farming through cluster approach and PGS certification.',
    eligibility: { farmerCategory: ['SMALL', 'MARGINAL', 'LARGE'], interestIn: 'organic' },
    benefits: '₹50,000/hectare over 3 years for organic farming inputs and certification',
    requiredDocuments: 'Aadhaar card, Bank account, Land records, Group registration',
    applicationLink: 'https://pgsindia-ncof.gov.in',
  },
  {
    name: 'Sub-Mission on Agricultural Mechanization',
    description: 'Provides subsidies on purchase of agricultural machinery and equipment.',
    eligibility: { farmerCategory: ['SMALL', 'MARGINAL', 'LARGE'] },
    benefits: '40-50% subsidy on farm machinery purchases (varies by equipment and category)',
    requiredDocuments: 'Aadhaar card, Bank account, Land records, Machine quotation',
    applicationLink: 'https://agriwelfare.gov.in',
  },
  {
    name: 'Rashtriya Krishi Vikas Yojana',
    description: 'State-centric scheme to incentivize states to increase public investment in agriculture.',
    eligibility: { farmerCategory: ['SMALL', 'MARGINAL', 'LARGE'] },
    benefits: 'Funding for innovative state agriculture projects, infrastructure development',
    requiredDocuments: 'State-specific requirements vary',
    applicationLink: 'https://rkvy.nic.in',
  },
];

// GET /api/schemes — list all active schemes
router.get('/', async (_req, res: Response) => {
  const dbSchemes = await prisma.governmentScheme.findMany({
    where: { isActive: true },
    orderBy: { schemeName: 'asc' },
  });

  // Merge seeded DB schemes with built-in schemes
  const allSchemes = [
    ...GOVT_SCHEMES.map((s, i) => ({ id: `builtin-${i}`, ...s, source: 'builtin' })),
    ...dbSchemes.map(s => ({
      id: s.id,
      name: s.schemeName,
      description: s.description,
      eligibility: s.eligibilityJson,
      benefits: s.benefits,
      requiredDocuments: s.requiredDocuments,
      state: s.state,
      applicationLink: s.applicationLink || '',
      source: 'database',
    })),
  ];

  res.json({ schemes: allSchemes });
});

// GET /api/schemes/match — personalized scheme recommendations
router.get('/match', authenticate, async (req: AuthRequest, res: Response) => {
  const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  const matched = GOVT_SCHEMES.map(scheme => {
    const eligibility = scheme.eligibility;
    let score = 0;
    let totalRules = 0;
    const reasons: string[] = [];

    // Check farmer category
    if (eligibility.farmerCategory) {
      totalRules++;
      if (eligibility.farmerCategory.includes(user.farmerCategory)) {
        score++;
        reasons.push(`Eligible for ${user.farmerCategory?.toLowerCase()} farmers`);
      }
    }

    // Check landholding
    if (eligibility.landholdingMax && user.landholdingSize) {
      totalRules++;
      if (user.landholdingSize <= eligibility.landholdingMax) {
        score++;
        reasons.push(`Landholding ${user.landholdingSize} acres ≤ ${eligibility.landholdingMax} acres limit`);
      }
    }

    // Check state
    if (scheme.state && user.state) {
      totalRules++;
      if (scheme.state === user.state) {
        score++;
        reasons.push(`Available in ${user.state}`);
      }
    }

    // Base relevance (everyone is somewhat eligible for general schemes)
    if (totalRules === 0) score = 0.5;

    const matchScore = totalRules > 0 ? Math.round((score / totalRules) * 100) : 50;

    return {
      id: scheme.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      name: scheme.name,
      description: scheme.description,
      benefits: scheme.benefits,
      requiredDocuments: scheme.requiredDocuments,
      applicationLink: scheme.applicationLink,
      matchScore,
      matchReasons: reasons.length > 0 ? reasons : ['General eligibility — check details for specific requirements'],
    };
  });

  matched.sort((a, b) => b.matchScore - a.matchScore);

  res.json({ schemes: matched });
});

// GET /api/schemes/:id
router.get('/:id', async (req, res: Response) => {
  const builtin = GOVT_SCHEMES.find(s => s.name.toLowerCase().replace(/[^a-z0-9]/g, '-') === req.params.id);
  if (builtin) {
    res.json({ scheme: { id: req.params.id, ...builtin, source: 'builtin' } });
    return;
  }

  const dbScheme = await prisma.governmentScheme.findUnique({ where: { id: req.params.id as string } });
  if (dbScheme) {
    res.json({ scheme: dbScheme });
    return;
  }

  res.status(404).json({ error: 'Scheme not found' });
});

export default router;
