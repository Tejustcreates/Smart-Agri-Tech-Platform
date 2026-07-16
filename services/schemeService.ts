import { Scheme, FarmerProfile } from '../types/scheme';

const DATA_GOV_KEY = import.meta.env.VITE_DATA_GOV_API_KEY;

const POPULAR_SCHEMES: Scheme[] = [
  {
    id: 'pm-kisan', schemeName: 'PM-KISAN Samman Nidhi', ministry: 'Ministry of Agriculture & Farmers Welfare',
    level: 'Central', description: 'Direct income support of ₹6,000 per year to farmer families, transferred in 3 equal installments of ₹2,000 each.',
    eligibility: 'All landholding farmer families with cultivable land', benefits: '₹6,000/year direct bank transfer',
    documents: ['Aadhaar Card', 'Bank Account Details', 'Land Records'], website: 'https://pmkisan.gov.in/',
    lastUpdated: '2025-01-15', category: 'Financial Support', matchScore: 95,
  },
  {
    id: 'pmfby', schemeName: 'Pradhan Mantri Fasal Bima Yojana', ministry: 'Ministry of Agriculture & Farmers Welfare',
    level: 'Central', description: 'Comprehensive crop insurance against crop failure due to natural calamities, pests, and diseases.',
    eligibility: 'All farmers growing notified crops in notified areas', benefits: 'Low premium rates — 2% kharif, 1.5% rabi',
    documents: ['Aadhaar Card', 'Land Records', 'Sowing Certificate'], website: 'https://pmfby.gov.in/',
    lastUpdated: '2025-02-01', category: 'Insurance', matchScore: 90,
  },
  {
    id: 'kcc', schemeName: 'Kisan Credit Card', ministry: 'Ministry of Agriculture & Farmers Welfare',
    level: 'Central', description: 'Easy credit access for farmers at subsidized interest rates for agricultural and allied activities.',
    eligibility: 'All farmers — individual or joint owners of cultivable land', benefits: 'Credit up to ₹3 lakhs at 4% interest',
    documents: ['Aadhaar Card', 'Land Records', 'Passport Photo'], website: 'https://www.myscheme.gov.in/search/kisan%20credit%20card',
    lastUpdated: '2025-01-20', category: 'Credit', matchScore: 88,
  },
  {
    id: 'shc', schemeName: 'Soil Health Card Scheme', ministry: 'Ministry of Agriculture & Farmers Welfare',
    level: 'Central', description: 'Free soil testing and issuance of Soil Health Cards with crop-wise nutrient recommendations.',
    eligibility: 'All farmers with agricultural land holdings', benefits: 'Free soil testing and personalized recommendations',
    documents: ['Aadhaar Card', 'Land Records'], website: 'https://soilhealth.dac.gov.in/',
    lastUpdated: '2024-11-10', category: 'Advisory', matchScore: 85,
  },
  {
    id: 'aif', schemeName: 'Agriculture Infrastructure Fund', ministry: 'Ministry of Agriculture & Farmers Welfare',
    level: 'Central', description: 'Long-term debt financing facility for post-harvest management infrastructure and community farming assets.',
    eligibility: 'Farmers, FPOs, Agri-entrepreneurs, cooperatives', benefits: '3% interest subvention, loan up to ₹2 crore',
    documents: ['Aadhaar Card', 'Project Report', 'Land Records'], website: 'https://agriinfra.dac.gov.in/',
    lastUpdated: '2025-03-01', category: 'Infrastructure', matchScore: 82,
  },
  {
    id: 'nmnf', schemeName: 'National Mission on Natural Farming', ministry: 'Ministry of Agriculture & Farmers Welfare',
    level: 'Central', description: 'Promotes natural farming practices to reduce chemical input costs and improve soil health.',
    eligibility: 'All farmers willing to adopt natural farming', benefits: '₹15,000/ha support for natural farming',
    documents: ['Aadhaar Card', 'Land Records'], website: 'https://nmnf.dac.gov.in/',
    lastUpdated: '2025-02-15', category: 'Organic Farming', matchScore: 80,
  },
  {
    id: 'enam', schemeName: 'e-NAM (National Agriculture Market)', ministry: 'Ministry of Agriculture & Farmers Welfare',
    level: 'Central', description: 'Pan-India electronic trading portal linking existing APMC mandis to create a unified national market.',
    eligibility: 'All farmers and traders registered at APMC', benefits: 'Better price discovery, transparent trading',
    documents: ['Aadhaar Card', 'Bank Account', 'APMC Registration'], website: 'https://enam.gov.in/',
    lastUpdated: '2025-01-05', category: 'Market', matchScore: 78,
  },
  {
    id: 'pkvy', schemeName: 'Paramparagat Krishi Vikas Yojana', ministry: 'Ministry of Agriculture & Farmers Welfare',
    level: 'Central', description: 'Promotes organic farming through cluster approach with assistance of ₹50,000/ha over 3 years.',
    eligibility: 'All farmers, minimum 50 farmers per cluster', benefits: '₹50,000/ha over 3 years for organic farming',
    documents: ['Aadhaar Card', 'Land Records', 'Bank Account'], website: 'https://pkvy.gov.in/',
    lastUpdated: '2024-12-20', category: 'Organic Farming', matchScore: 76,
  },
  {
    id: 'br', schemeName: 'Blue Revolution — Integrated Development', ministry: 'Ministry of Fisheries, Animal Husbandry & Dairying',
    level: 'Central', description: 'Comprehensive scheme for fisheries sector development with focus on inland and deep sea fishing.',
    eligibility: 'Fish farmers, fishers, entrepreneurs', benefits: 'Up to 60% subsidy on aquaculture infrastructure',
    documents: ['Aadhaar Card', 'Land/Water Body Records', 'Project Report'], website: 'https://蓝色revolution.gov.in/',
    lastUpdated: '2024-10-15', category: 'Fisheries', matchScore: 72,
  },
  {
    id: 'nfsm', schemeName: 'National Food Security Mission', ministry: 'Ministry of Agriculture & Farmers Welfare',
    level: 'Central', description: 'Aims to increase production of rice, wheat, pulses, coarse cereals, and commercial crops through area expansion.',
    eligibility: 'All farmers in identified districts', benefits: 'Seed distribution, technology transfer, input subsidy',
    documents: ['Aadhaar Card', 'Land Records'], website: 'https://nfsm.gov.in/',
    lastUpdated: '2025-01-25', category: 'Food Security', matchScore: 75,
  },
];

let cachedSchemes: Scheme[] | null = null;

function computeMatch(scheme: Scheme, profile: FarmerProfile): number {
  let score = 60;

  if (profile.category === 'Small' || profile.category === 'Marginal') {
    if (['pm-kisan', 'kcc', 'shc'].includes(scheme.id)) score += 15;
  }
  if (profile.category === 'Medium' || profile.category === 'Large') {
    if (['pmfby', 'aif', 'enam'].includes(scheme.id)) score += 12;
  }

  if (profile.irrigation === 'Rainfed') {
    if (['pmfby', 'shc', 'nmnf'].includes(scheme.id)) score += 10;
  }

  if (profile.farmerType === 'Organic Farmer') {
    if (['nmnf', 'pkvy'].includes(scheme.id)) score += 15;
  }
  if (profile.farmerType === 'FPO') {
    if (['aif', 'enam'].includes(scheme.id)) score += 12;
  }

  const income = parseInt(profile.annualIncome);
  if (!isNaN(income) && income < 100000) {
    if (['pm-kisan', 'kcc'].includes(scheme.id)) score += 10;
  }

  return Math.min(98, score);
}

export async function searchSchemes(profile: FarmerProfile): Promise<Scheme[]> {
  if (DATA_GOV_KEY) {
    try {
      const params = new URLSearchParams({
        'api-key': DATA_GOV_KEY,
        format: 'json',
        'filters[sector]': 'Agriculture',
        limit: '20',
      });
      const res = await fetch(`https://api.data.gov.in/resource?${params}`);
      if (res.ok) {
        const data = await res.json();
        if (data.records?.length) {
          cachedSchemes = data.records.map((r: any, i: number) => ({
            id: r.id || `datagov-${i}`,
            schemeName: r.title || r.scheme_name || 'Government Scheme',
            ministry: r.ministry || r.department || 'Ministry of Agriculture',
            level: (r.level || 'Central') as 'Central' | 'State',
            description: r.description || r.details || '',
            eligibility: r.eligibility || r.target_beneficiaries || 'All farmers',
            benefits: r.benefits || r.scheme_benefits || '',
            documents: r.documents ? r.documents.split(',').map((d: string) => d.trim()) : ['Aadhaar Card'],
            website: r.url || r.website || 'https://www.myscheme.gov.in/',
            lastUpdated: r.last_updated || r.updated_at || new Date().toISOString().split('T')[0],
            category: r.category || r.scheme_category || 'General',
            matchScore: 0,
          }));
        }
      }
    } catch { /* fall through to mock */ }
  }

  const schemes = (cachedSchemes || POPULAR_SCHEMES).map((s) => ({
    ...s,
    matchScore: computeMatch(s, profile),
  }));

  schemes.sort((a, b) => b.matchScore - a.matchScore);
  return schemes;
}

export function getPopularSchemes(): Scheme[] {
  return POPULAR_SCHEMES;
}

export function getSchemeDetails(id: string): Scheme | undefined {
  return POPULAR_SCHEMES.find((s) => s.id === id);
}
