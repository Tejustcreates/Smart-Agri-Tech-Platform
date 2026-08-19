import axios from 'axios';

const API_KEY = import.meta.env.VITE_NEWSDATA_API_KEY;
const BASE_URL = 'https://newsdata.io/api/1/news';
const CACHE_KEY = 'growsmart_news_cache';
const CACHE_TTL = 30 * 60 * 1000;

export type AgriNewsCategory =
  | 'government'
  | 'market'
  | 'weather'
  | 'technology'
  | 'schemes'
  | 'crop-disease'
  | 'general';

export interface LiveArticle {
  title: string;
  description: string;
  source_name: string;
  pubDate: string;
  link: string;
  image_url: string | null;
  category: string[];
  keywords: string[];
  article_id?: string;
  agriCategory?: AgriNewsCategory;
}

interface NewsApiResponse {
  status: string;
  results: LiveArticle[];
  nextPage?: string;
}

const CATEGORY_PATTERNS: [AgriNewsCategory, RegExp][] = [
  ['government', /govern|parliament|minister|policy|regulation|cabinet|central\s+government|state\s+government|ordinance/i],
  ['market', /price|mandi|market|trade|export|import|commodity|futures|bullion|modity|retail|wholesale|msp|minimum\s+support/i],
  ['weather', /monsoon|rain|flood|drought|cyclone|storm|heatwave|heat\s+wave|temperature|forecast|imd|weather|climate|el\s*nino|la\s*nina/i],
  ['technology', /drone|ai\b|iot|robot|sensor|automation|biotech|gps|satellite|app\s+tech|digital|smart\s+farm|precision/i],
  ['schemes', /scheme|subsid|pm-?kisan|pmfby|soil\s+health|kcc|kisan\s+credit|nabard|benefit|transfer|installment|yojana|program/i],
  ['crop-disease', /pest|disease|fungus|bacteria|virus|insect|bollworm|blight|rust|mildew|infestation|spray|herbicide|fungicide|insecticide|weedic/i],
];

export function classifyAgriCategory(text: string): AgriNewsCategory {
  for (const [cat, re] of CATEGORY_PATTERNS) {
    if (re.test(text)) return cat;
  }
  return 'general';
}

interface CachePayload {
  articles: LiveArticle[];
  fetchedAt: number;
}

function readCache(): CachePayload | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const payload: CachePayload = JSON.parse(raw);
    if (Date.now() - payload.fetchedAt > CACHE_TTL) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

function writeCache(articles: LiveArticle[]): void {
  try {
    const payload: CachePayload = { articles, fetchedAt: Date.now() };
    localStorage.setItem(CACHE_KEY, JSON.stringify(payload));
  } catch {
    // storage full or unavailable – silently ignore
  }
}

export function clearNewsCache(): void {
  try {
    localStorage.removeItem(CACHE_KEY);
  } catch {
    // ignore
  }
}

function tagArticles(articles: LiveArticle[]): LiveArticle[] {
  return articles.map((a) => ({
    ...a,
    agriCategory: a.agriCategory ?? classifyAgriCategory(`${a.title} ${a.description} ${(a.keywords ?? []).join(' ')}`),
  }));
}

export async function fetchAgriNews(
  page?: string,
): Promise<{ articles: LiveArticle[]; nextPage?: string }> {
  // Return cached results when not paginating and cache is still fresh
  if (!page) {
    const cached = readCache();
    if (cached) {
      return { articles: cached.articles };
    }
  }

  if (!API_KEY || API_KEY === 'YOUR_API_KEY_HERE' || API_KEY === 'placeholder') {
    return { articles: tagArticles(getMockArticles()) };
  }

  try {
    const params: Record<string, string> = {
      apiKey: API_KEY,
      q: 'agriculture OR farmer OR crop OR MSP OR monsoon OR farming OR mandi OR scheme',
      country: 'in',
      language: 'en',
      size: '20',
      image: '1',
    };
    if (page) params.page = page;

    const { data } = await axios.get<NewsApiResponse>(BASE_URL, { params });

    if (data.status === 'success' && data.results?.length > 0) {
      const tagged = tagArticles(data.results);
      if (!page) writeCache(tagged);
      return { articles: tagged, nextPage: data.nextPage };
    }

    return { articles: tagArticles(getMockArticles()) };
  } catch {
    return { articles: tagArticles(getMockArticles()) };
  }
}

function getMockArticles(): LiveArticle[] {
  const now = Date.now();
  const day = 86_400_000;
  return [
    {
      title: 'Government Launches New Subsidy Program for Small Farmers',
      description: 'The Ministry of Agriculture has announced a new subsidy program targeting small and marginal farmers across India with direct benefit transfers.',
      source_name: 'Agri News India',
      pubDate: new Date(now - day).toISOString(),
      link: '#',
      image_url: null,
      category: ['politics', 'business'],
      keywords: ['government', 'scheme', 'subsidy', 'farmer'],
      agriCategory: 'government',
    },
    {
      title: 'Monsoon Update: Heavy Rains Expected in Central India',
      description: 'IMD forecasts heavy monsoon rains in Madhya Pradesh, Maharashtra, and Gujarat over the next week. Farmers advised to take precautions.',
      source_name: 'Weather India',
      pubDate: new Date(now - day * 2).toISOString(),
      link: '#',
      image_url: null,
      category: ['environment', 'weather'],
      keywords: ['rain', 'monsoon', 'forecast', 'weather'],
      agriCategory: 'weather',
    },
    {
      title: 'MSP Hike Announced for Kharif Crops 2025-26',
      description: 'The Cabinet has approved a 5-8% increase in Minimum Support Price for major kharif crops including rice, pulses, and oilseeds.',
      source_name: 'Farm Gate',
      pubDate: new Date(now - day * 3).toISOString(),
      link: '#',
      image_url: null,
      category: ['business'],
      keywords: ['MSP', 'price', 'kharif', 'crops'],
      agriCategory: 'market',
    },
    {
      title: 'New Organic Farming Certification Process Simplified',
      description: 'FSSAI introduces a streamlined certification process for organic farmers to reduce paperwork and processing delays significantly.',
      source_name: 'Organic India',
      pubDate: new Date(now - day * 4).toISOString(),
      link: '#',
      image_url: null,
      category: ['lifestyle'],
      keywords: ['organic', 'farming', 'certification'],
      agriCategory: 'general',
    },
    {
      title: 'PM-KISAN Scheme: Next Installment to Be Released Soon',
      description: 'The 15th installment of PM-KISAN scheme will be credited to farmer accounts within the next two weeks. Check eligibility online.',
      source_name: 'Government Bulletin',
      pubDate: new Date(now - day * 5).toISOString(),
      link: '#',
      image_url: null,
      category: ['politics'],
      keywords: ['PM-KISAN', 'government', 'scheme', 'subsidy'],
      agriCategory: 'schemes',
    },
    {
      title: 'Drone Technology Transforming Crop Spraying in India',
      description: 'Modern drone technology is helping farmers spray pesticides more efficiently, reducing costs by 30% and improving crop health outcomes.',
      source_name: 'Agri Tech Today',
      pubDate: new Date(now - day * 6).toISOString(),
      link: '#',
      image_url: null,
      category: ['technology'],
      keywords: ['drone', 'technology', 'spray', 'agri tech'],
      agriCategory: 'technology',
    },
    {
      title: 'Tomato Prices Surge 40% Due to Supply Shortage',
      description: 'Tomato prices have jumped sharply in major mandis across India due to delayed monsoon affecting supply from key producing regions.',
      source_name: 'Market Watch',
      pubDate: new Date(now - day * 7).toISOString(),
      link: '#',
      image_url: null,
      category: ['business'],
      keywords: ['price', 'tomato', 'mandi', 'supply'],
      agriCategory: 'market',
    },
    {
      title: 'Wheat Sowing Advisory Issued for Rabi Season',
      description: 'Agricultural experts advise farmers on optimal wheat sowing time, seed variety selection, and soil preparation for the upcoming rabi season.',
      source_name: 'Krishi Vigyan',
      pubDate: new Date(now - day * 8).toISOString(),
      link: '#',
      image_url: null,
      category: ['science'],
      keywords: ['wheat', 'sowing', 'rabi', 'crop'],
      agriCategory: 'general',
    },
    {
      title: 'New Pest Warning for Cotton Farmers in Gujarat',
      description: 'Entomologists have warned of rising pink bollworm infestation in cotton fields across Gujarat. Immediate action recommended.',
      source_name: 'Pest Alert India',
      pubDate: new Date(now - day * 9).toISOString(),
      link: '#',
      image_url: null,
      category: ['science'],
      keywords: ['pest', 'cotton', 'bollworm', 'warning'],
      agriCategory: 'crop-disease',
    },
    {
      title: 'Soil Health Card Scheme Benefits 2 Crore Farmers',
      description: 'The Soil Health Card Scheme has now reached over 2 crore farmers, providing personalized fertilizer recommendations for improved yields.',
      source_name: 'Soil Science Journal',
      pubDate: new Date(now - day * 10).toISOString(),
      link: '#',
      image_url: null,
      category: ['science'],
      keywords: ['soil', 'health', 'scheme', 'farmer'],
      agriCategory: 'schemes',
    },
    {
      title: 'Solar-Powered Irrigation Systems Gain Popularity',
      description: 'Solar pump installations have doubled in the last year as farmers seek sustainable and cost-effective irrigation solutions.',
      source_name: 'Green Energy India',
      pubDate: new Date(now - day * 11).toISOString(),
      link: '#',
      image_url: null,
      category: ['science', 'technology'],
      keywords: ['solar', 'irrigation', 'technology', 'farming'],
      agriCategory: 'technology',
    },
    {
      title: 'Rice Export Ban Lifted: Boost for Indian Farmers',
      description: 'The government has lifted the ban on non-basmati rice exports, providing relief to rice farmers facing lower domestic prices.',
      source_name: 'Trade Today',
      pubDate: new Date(now - day * 12).toISOString(),
      link: '#',
      image_url: null,
      category: ['business'],
      keywords: ['rice', 'export', 'trade', 'price'],
      agriCategory: 'market',
    },
  ];
}
