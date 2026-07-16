const API_KEY = import.meta.env.VITE_NEWSDATA_API_KEY;
const BASE_URL = 'https://newsdata.io/api/1/news';

export interface LiveArticle {
  title: string;
  description: string;
  source_name: string;
  pubDate: string;
  link: string;
  image_url: string | null;
  category: string[];
  keywords: string[];
}

interface NewsApiResponse {
  status: string;
  results: LiveArticle[];
  nextPage?: string;
}

const AGRI_KEYWORDS = [
  'agriculture', 'farmer', 'farming', 'crop', 'MSP', 'monsoon',
  'government schemes', 'organic farming', 'agri tech', 'harvest',
  'irrigation', 'fertilizer', 'pesticide', 'mandi', 'rural',
];

let cachedResults: LiveArticle[] = [];
let lastFetchTime = 0;
const CACHE_TTL = 5 * 60 * 1000;

export async function fetchAgriNews(page?: string): Promise<{ articles: LiveArticle[]; nextPage?: string }> {
  if (cachedResults.length > 0 && !page && Date.now() - lastFetchTime < CACHE_TTL) {
    return { articles: cachedResults };
  }

  if (!API_KEY) {
    return { articles: getMockArticles() };
  }

  try {
    const params = new URLSearchParams({
      apiKey: API_KEY,
      q: 'agriculture OR farmer OR crop OR MSP OR monsoon OR farming',
      country: 'in',
      language: 'en',
      size: '12',
      image: '1',
    });
    if (page) params.set('page', page);

    const res = await fetch(`${BASE_URL}?${params}`);
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const data: NewsApiResponse = await res.json();

    if (data.status === 'success' && data.results?.length > 0) {
      if (!page) {
        cachedResults = data.results;
        lastFetchTime = Date.now();
      }
      return { articles: data.results, nextPage: data.nextPage };
    }
    return { articles: getMockArticles() };
  } catch {
    return { articles: getMockArticles() };
  }
}

function getMockArticles(): LiveArticle[] {
  const now = Date.now();
  const day = 86400000;
  return [
    { title: 'Government Launches New Subsidy Program for Small Farmers', description: 'The Ministry of Agriculture has announced a new subsidy program targeting small and marginal farmers across India with direct benefit transfers.', source_name: 'Agri News India', pubDate: new Date(now - day).toISOString(), link: '#', image_url: null, category: ['politics', 'business'], keywords: ['government', 'scheme', 'subsidy', 'farmer'] },
    { title: 'Monsoon Update: Heavy Rains Expected in Central India', description: 'IMD forecasts heavy monsoon rains in Madhya Pradesh, Maharashtra, and Gujarat over the next week. Farmers advised to take precautions.', source_name: 'Weather India', pubDate: new Date(now - day * 2).toISOString(), link: '#', image_url: null, category: ['environment', 'weather'], keywords: ['rain', 'monsoon', 'forecast', 'weather'] },
    { title: 'MSP Hike Announced for Kharif Crops 2025-26', description: 'The Cabinet has approved a 5-8% increase in Minimum Support Price for major kharif crops including rice, pulses, and oilseeds.', source_name: 'Farm Gate', pubDate: new Date(now - day * 3).toISOString(), link: '#', image_url: null, category: ['business'], keywords: ['MSP', 'price', 'kharif', 'crops'] },
    { title: 'New Organic Farming Certification Process Simplified', description: 'FSSAI introduces a streamlined certification process for organic farmers to reduce paperwork and processing delays significantly.', source_name: 'Organic India', pubDate: new Date(now - day * 4).toISOString(), link: '#', image_url: null, category: ['lifestyle'], keywords: ['organic', 'farming', 'certification'] },
    { title: 'PM-KISAN Scheme: Next Installment to Be Released Soon', description: 'The 15th installment of PM-KISAN scheme will be credited to farmer accounts within the next two weeks. Check eligibility online.', source_name: 'Government Bulletin', pubDate: new Date(now - day * 5).toISOString(), link: '#', image_url: null, category: ['politics'], keywords: ['PM-KISAN', 'government', 'scheme', 'subsidy'] },
    { title: 'Drone Technology Transforming Crop Spraying in India', description: 'Modern drone technology is helping farmers spray pesticides more efficiently, reducing costs by 30% and improving crop health outcomes.', source_name: 'Agri Tech Today', pubDate: new Date(now - day * 6).toISOString(), link: '#', image_url: null, category: ['technology'], keywords: ['drone', 'technology', 'spray', 'agri tech'] },
    { title: 'Tomato Prices Surge 40% Due to Supply Shortage', description: 'Tomato prices have jumped sharply in major mandis across India due to delayed monsoon affecting supply from key producing regions.', source_name: 'Market Watch', pubDate: new Date(now - day * 7).toISOString(), link: '#', image_url: null, category: ['business'], keywords: ['price', 'tomato', 'mandi', 'supply'] },
    { title: 'Wheat Sowing Advisory Issued for Rabi Season', description: 'Agricultural experts advise farmers on optimal wheat sowing time, seed variety selection, and soil preparation for the upcoming rabi season.', source_name: 'Krishi Vigyan', pubDate: new Date(now - day * 8).toISOString(), link: '#', image_url: null, category: ['science'], keywords: ['wheat', 'sowing', 'rabi', 'crop'] },
    { title: 'New Pest Warning for Cotton Farmers in Gujarat', description: 'Entomologists have warned of rising pink bollworm infestation in cotton fields across Gujarat. Immediate action recommended.', source_name: 'Pest Alert India', pubDate: new Date(now - day * 9).toISOString(), link: '#', image_url: null, category: ['science'], keywords: ['pest', 'cotton', 'bollworm', 'warning'] },
    { title: 'Soil Health Card Scheme Benefits 2 Crore Farmers', description: 'The Soil Health Card Scheme has now reached over 2 crore farmers, providing personalized fertilizer recommendations for improved yields.', source_name: 'Soil Science Journal', pubDate: new Date(now - day * 10).toISOString(), link: '#', image_url: null, category: ['science'], keywords: ['soil', 'health', 'scheme', 'farmer'] },
    { title: 'Solar-Powered Irrigation Systems Gain Popularity', description: 'Solar pump installations have doubled in the last year as farmers seek sustainable and cost-effective irrigation solutions.', source_name: 'Green Energy India', pubDate: new Date(now - day * 11).toISOString(), link: '#', image_url: null, category: ['science', 'technology'], keywords: ['solar', 'irrigation', 'technology', 'farming'] },
    { title: 'Rice Export Ban Lifted: Boost for Indian Farmers', description: 'The government has lifted the ban on non-basmati rice exports, providing relief to rice farmers facing lower domestic prices.', source_name: 'Trade Today', pubDate: new Date(now - day * 12).toISOString(), link: '#', image_url: null, category: ['business'], keywords: ['rice', 'export', 'trade', 'price'] },
  ];
}
