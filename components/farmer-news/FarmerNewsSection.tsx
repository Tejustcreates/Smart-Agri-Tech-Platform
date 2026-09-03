import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { LiveArticle, fetchAgriNews } from '../../services/news/newsService';
import Section from '../../components/Section';
import NewsFilters from './NewsFilters';
import FeaturedNews from './FeaturedNews';
import NewsCard from './NewsCard';
import QuickAlerts from './QuickAlerts';
import { SkeletonGrid } from './SkeletonNewsCard';
import EmptyState from './EmptyState';
import ErrorState from './ErrorState';

const INITIAL_COUNT = 6;
const LOAD_MORE_COUNT = 6;

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  market: ['price', 'mandi', 'rate', 'msp', 'export', 'import', 'demand', 'supply', 'rupee'],
  weather: ['rain', 'monsoon', 'forecast', 'temperature', 'humidity', 'climate', 'weather'],
  schemes: ['government', 'scheme', 'subsidy', 'grant', 'loan', 'pm-kisan', 'fasal', 'pm kisan'],
  crops: ['wheat', 'rice', 'cotton', 'crop', 'sowing', 'harvest', 'rabi', 'kharif'],
  disease: ['pest', 'disease', 'bollworm', 'fungus', 'blight', 'insect', 'infestation'],
  technology: ['drone', 'iot', 'sensor', 'automation', 'app', 'digital', 'solar', 'technology'],
  msp: ['msp', 'minimum support price', 'procurement', 'price hike'],
};

function categorizeArticle(article: LiveArticle): string {
  const text = (article.title + ' ' + article.description + ' ' + article.keywords.join(' ')).toLowerCase();
  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((kw) => text.includes(kw))) return cat;
  }
  return 'crops';
}

function calculateRelevance(text: string, crop: string, state: string): number {
  let score = 50;
  const lower = text.toLowerCase();
  if (crop && lower.includes(crop.toLowerCase())) score += 30;
  if (state && lower.includes(state.toLowerCase())) score += 20;
  return Math.min(100, score);
}

const FarmerNewsSection: React.FC = () => {
  const [articles, setArticles] = useState<LiveArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  const [nextPage, setNextPage] = useState<string | undefined>();
  const [loadingMore, setLoadingMore] = useState(false);

  const loadNews = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const { articles: data, nextPage: np } = await fetchAgriNews();
      setArticles(data);
      setNextPage(np);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadNews(); }, [loadNews]);

  const categorizedArticles = useMemo(() => {
    return articles.map((a) => ({
      ...a,
      _category: categorizeArticle(a),
      _relevance: calculateRelevance(a.title + ' ' + a.description, selectedCrop, selectedState),
    })).sort((a, b) => b._relevance - a._relevance);
  }, [articles, selectedCrop, selectedState]);

  const filteredArticles = useMemo(() => {
    if (selectedCategory === 'all') return categorizedArticles;
    return categorizedArticles.filter((a) => a._category === selectedCategory);
  }, [categorizedArticles, selectedCategory]);

  const displayedArticles = filteredArticles.slice(0, visibleCount);
  const featured = displayedArticles[0];
  const gridArticles = displayedArticles.slice(1);
  const hasMore = visibleCount < filteredArticles.length;

  const handleLoadMore = useCallback(async () => {
    if (nextPage) {
      setLoadingMore(true);
      try {
        const { articles: more, nextPage: np } = await fetchAgriNews(nextPage);
        setArticles((prev) => [...prev, ...more]);
        setNextPage(np);
      } catch { /* ignore */ }
      setLoadingMore(false);
    }
    setVisibleCount((c) => c + LOAD_MORE_COUNT);
  }, [nextPage]);

  return (
          <Section
        id="news"
        tone="green"
        icon="fas fa-newspaper"
        eyebrow="Personalized Farmer News"
        title="Farmer News, Alerts & Updates"
        subtitle="Stay updated with the latest agriculture, farming, crop, market, weather and government scheme news tailored to your interests."
      >
      <div className="w-full">
        {/* Filters */}
        <div className="max-w-5xl mx-auto">
          <NewsFilters
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            selectedState={selectedState}
            onStateChange={setSelectedState}
            selectedCrop={selectedCrop}
            onCropChange={setSelectedCrop}
            articleCount={filteredArticles.length}
            showMobile={showMobileFilters}
            onToggleMobile={() => setShowMobileFilters(!showMobileFilters)}
          />
        </div>

        {/* Content */}
        <div className="max-w-5xl mx-auto">
          {loading ? (
            <SkeletonGrid />
          ) : error ? (
            <ErrorState onRetry={loadNews} />
          ) : filteredArticles.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              {/* Featured */}
              {featured && <FeaturedNews article={featured} />}

              {/* Quick Alerts */}
              <QuickAlerts />

              {/* Grid */}
              {gridArticles.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
                  {gridArticles.map((article, i) => (
                    <NewsCard key={article.link + i} article={article} index={i} />
                  ))}
                </div>
              )}

              {/* Load More */}
              {hasMore && (
                <div className="text-center">
                  <button
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className="tap-target px-8 py-3 bg-brand-600 text-white rounded-xl font-semibold text-sm hover:bg-brand-700 transition-all shadow-sm shadow-brand-200 disabled:opacity-60"
                  >
                    {loadingMore ? 'Loading...' : 'Load More News'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Section>
  );
};

export default FarmerNewsSection;
