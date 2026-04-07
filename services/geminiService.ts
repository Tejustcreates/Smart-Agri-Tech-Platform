
import { GoogleGenAI, Type } from "@google/genai";
import { NewsArticle, Scheme } from '../types';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

const MOCK_NEWS: NewsArticle[] = [
  { headline: "Government Launches New Subsidy Program for Small Farmers", summary: "The Ministry of Agriculture has announced a new subsidy program targeting small and marginal farmers across India.", source: "Agri News India", publishedDate: new Date().toLocaleDateString() },
  { headline: "Monsoon Update: Heavy Rains Expected in Central India", summary: "IMD forecasts heavy monsoon rains in Madhya Pradesh, Maharashtra, and Gujarat over the next week.", source: "Weather India", publishedDate: new Date().toLocaleDateString() },
  { headline: "MSP Hike Announced for Kharif Crops", summary: "The Cabinet has approved a 5-8% increase in Minimum Support Price for major kharif crops including rice and pulses.", source: "Farm Gate", publishedDate: new Date().toLocaleDateString() },
  { headline: "New Organic Farming Certification Process Simplified", summary: "FSSAI introduces a streamlined certification process for organic farmers to reduce paperwork and delays.", source: "Organic India", publishedDate: new Date().toLocaleDateString() },
  { headline: "PM-KISAN Scheme: Next Installment to Be Released Soon", summary: "The 15th installment of PM-KISAN scheme will be credited to farmer accounts within the next two weeks.", source: "Government Bulletin", publishedDate: new Date().toLocaleDateString() }
];

export const fetchNews = async (): Promise<NewsArticle[]> => {
  if (!ai) {
    console.warn("Gemini API key not configured. Using mock data.");
    return MOCK_NEWS;
  }
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Generate 5 recent news headlines and short summaries relevant to farmers in India. Include a plausible source and a published date for each.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              headline: { type: Type.STRING },
              summary: { type: Type.STRING },
              source: { type: Type.STRING },
              publishedDate: { type: Type.STRING, description: "e.g., October 26, 2023" }
            },
            required: ["headline", "summary", "source", "publishedDate"]
          }
        }
      }
    });

    const jsonText = response.text.trim();
    const articles = JSON.parse(jsonText);
    return articles;
  } catch (error) {
    console.error("Error fetching news from Gemini API:", error);
    return MOCK_NEWS;
  }
};

const MOCK_SCHEMES: Scheme[] = [
  { schemeName: "PM-KISAN Samman Nidhi", description: "Direct income support of Rs. 6000/year to farmer families.", eligibility: "Small & marginal farmers with cultivable land", benefits: "Rs. 6000 per year in 3 equal installments" },
  { schemeName: "Pradhan Mantri Fasal Bima Yojana", description: "Crop insurance against crop failure due to natural calamities.", eligibility: "All farmers growing notified crops", benefits: "Premium subsidized up to 90%" },
  { schemeName: "Kisan Credit Card", description: "Easy credit for agricultural and allied activities.", eligibility: "Farmers engaged in farming activities", benefits: "Credit up to Rs. 3 lakhs at subsidized interest rates" }
];

export const fetchSchemes = async (state: string): Promise<Scheme[]> => {
    if (!state) return [];
    
    if (!ai) {
      console.warn("Gemini API key not configured. Using mock data.");
      return MOCK_SCHEMES;
    }
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `List 3 major government schemes for farmers in ${state}, India. For each scheme, provide a name, a brief description, key eligibility criteria, and main benefits.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            schemeName: { type: Type.STRING },
                            description: { type: Type.STRING },
                            eligibility: { type: Type.STRING },
                            benefits: { type: Type.STRING }
                        },
                        required: ["schemeName", "description", "eligibility", "benefits"]
                    }
                }
            }
        });

        const jsonText = response.text.trim();
        const schemes = JSON.parse(jsonText);
        return schemes;
    } catch (error) {
        console.error(`Error fetching schemes for ${state}:`, error);
        return MOCK_SCHEMES;
    }
};