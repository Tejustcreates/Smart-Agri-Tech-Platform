import React, { useState, useEffect } from 'react';
import { Section, NewsArticle } from '../types';
import { fetchNews } from '../services/geminiService';
import { CROP_OPTIONS, INDIAN_STATES } from '../constants';

interface PersonalizedNewsArticle extends NewsArticle {
  category: string;
  relevance: number;
}

const NEWS_CATEGORIES = [
  { id: 'all', label: 'All News', icon: 'fa-globe' },
  { id: 'market', label: 'Market Prices', icon: 'fa-chart-line' },
  { id: 'weather', label: 'Weather', icon: 'fa-cloud-sun' },
  { id: 'schemes', label: 'Government Schemes', icon: 'fa-landmark' },
  { id: 'technology', label: 'Technology', icon: 'fa-microchip' },
  { id: 'tips', label: 'Farming Tips', icon: 'fa-lightbulb' },
];

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  market: ['price', 'mandi', 'rate', '₹', 'rupee', 'export', 'import', 'demand', 'supply'],
  weather: ['rain', 'monsoon', 'forecast', 'temperature', 'humidity', 'climate'],
  schemes: ['government', 'scheme', 'subsidy', 'grant', 'loan', 'pm-kisan', 'fasal'],
  technology: ['drone', 'iot', 'sensor', 'ai', 'ml', 'automation', 'app', 'digital'],
  tips: ['tip', 'advice', 'guide', 'how to', 'best practice', 'method'],
};

const News: React.FC = () => {
  const [articles, setArticles] = useState<PersonalizedNewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedCrop, setSelectedCrop] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const getNews = async () => {
      setLoading(true);
      const newsArticles = await fetchNews();
      
      const personalized: PersonalizedNewsArticle[] = newsArticles.map((article) => {
        const category = categorizeArticle(article.headline + ' ' + article.summary);
        const relevance = calculateRelevance(article.headline + ' ' + article.summary, selectedCrop, selectedState);
        
        return {
          ...article,
          category,
          relevance,
        };
      });
      
      personalized.sort((a, b) => b.relevance - a.relevance);
      setArticles(personalized);
      setLoading(false);
    };

    getNews();
  }, [selectedCrop, selectedState]);

  const categorizeArticle = (text: string): string => {
    const lowerText = text.toLowerCase();
    
    for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
      if (keywords.some(keyword => lowerText.includes(keyword))) {
        return category;
      }
    }
    
    return 'tips';
  };

  const calculateRelevance = (text: string, crop: string, state: string): number => {
    let score = 50;
    const lowerText = text.toLowerCase();
    
    if (crop && lowerText.includes(crop.toLowerCase())) {
      score += 30;
    }
    
    if (state && (lowerText.includes(state.toLowerCase()) || lowerText.includes(state.split(' ')[0].toLowerCase()))) {
      score += 20;
    }
    
    return Math.min(100, score);
  };

  const filteredArticles = selectedCategory === 'all' 
    ? articles 
    : articles.filter(a => a.category === selectedCategory);

  const getCategoryIcon = (category: string) => {
    const cat = NEWS_CATEGORIES.find(c => c.id === category);
    return cat?.icon || 'fa-newspaper';
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'market': return 'bg-green-100 text-green-700 border-green-200';
      case 'weather': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'schemes': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'technology': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'tips': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    
    if (diffHours < 24) {
      return `${diffHours}h ago`;
    }
    return dateStr;
  };

  return (
    <section id={Section.NEWS} className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800">
            Personalized <span className="text-green-600">Farmer News</span>
          </h2>
          <p className="text-gray-600 mt-4">News tailored to your location and crops</p>
        </div>

        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <i className="fas fa-sliders-h text-green-600"></i>
                Personalize Your Feed
              </h3>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="text-green-600 hover:text-green-800 font-medium text-sm"
              >
                {showFilters ? 'Hide' : 'Show'} Filters
              </button>
            </div>

            <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${showFilters ? '' : 'hidden md:grid'}`}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your State</label>
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">All States</option>
                  {INDIAN_STATES.slice(0, 15).map((state) => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Crop</label>
                <select
                  value={selectedCrop}
                  onChange={(e) => setSelectedCrop(e.target.value)}
                  className="w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">All Crops</option>
                  {CROP_OPTIONS.map((crop) => (
                    <option key={crop} value={crop}>{crop}</option>
                  ))}
                </select>
              </div>
            </div>

            {(selectedState || selectedCrop) && (
              <div className="mt-4 flex flex-wrap gap-2">
                {selectedState && (
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm flex items-center gap-1">
                    <i className="fas fa-map-marker-alt"></i>
                    {selectedState}
                  </span>
                )}
                {selectedCrop && (
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm flex items-center gap-1">
                    <i className="fas fa-seedling"></i>
                    {selectedCrop}
                  </span>
                )}
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                  {filteredArticles.length} articles
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {NEWS_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full font-medium transition-all flex items-center gap-2 ${
                selectedCategory === cat.id
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <i className={`fas ${cat.icon}`}></i>
              {cat.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <i className="fas fa-spinner fa-spin text-green-600 text-4xl mb-4"></i>
              <p className="text-lg text-gray-700">Fetching personalized news...</p>
            </div>
          </div>
        ) : filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article, index) => (
              <div 
                key={index} 
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all transform hover:-translate-y-1 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getCategoryColor(article.category)}`}>
                      <i className={`fas ${getCategoryIcon(article.category)} mr-1`}></i>
                      {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
                    </span>
                    <span className="text-xs text-gray-500">
                      <i className="fas fa-clock mr-1"></i>
                      {formatDate(article.publishedDate)}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-gray-800 mb-3 line-clamp-2 hover:text-green-600 transition-colors cursor-pointer">
                    {article.headline}
                  </h3>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {article.summary}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="text-xs text-gray-500">
                      <i className="fas fa-newspaper mr-1"></i>
                      {article.source}
                    </div>
                    
                    {article.relevance > 70 && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-semibold">
                        <i className="fas fa-star mr-1"></i>
                        Highly Relevant
                      </span>
                    )}
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-500 to-green-600 p-4">
                  <a 
                    href="#" 
                    className="text-white font-medium flex items-center justify-center gap-2 hover:underline"
                    onClick={(e) => e.preventDefault()}
                  >
                    Read Full Article
                    <i className="fas fa-arrow-right"></i>
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-lg">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-newspaper text-gray-400 text-3xl"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No News Available</h3>
            <p className="text-gray-600">
              No news articles found for your selected filters. Try adjusting your preferences.
            </p>
          </div>
        )}

        <div className="mt-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <i className="fas fa-robot text-3xl"></i>
            </div>
            <div>
              <h3 className="text-xl font-bold">Smart Personalization</h3>
              <p className="opacity-90">
                Our system analyzes your location and crop preferences to show you the most relevant agricultural news
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default News;
