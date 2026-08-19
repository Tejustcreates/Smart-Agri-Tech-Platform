import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAgriNews } from '../../hooks/useAgriNews';
import { LiveArticle, AgriNewsCategory } from '../../services/news/newsService';
import toast from 'react-hot-toast';

const CATEGORIES = [
  { id: undefined, label: 'All News', emoji: '🌾' },
  { id: 'government' as const, label: 'Government', emoji: '🏛️' },
  { id: 'market' as const, label: 'Market Prices', emoji: '📊' },
  { id: 'weather' as const, label: 'Weather', emoji: '🌧️' },
  { id: 'technology' as const, label: 'Technology', emoji: '🤖' },
  { id: 'schemes' as const, label: 'Schemes', emoji: '📋' },
  { id: 'crop-disease' as const, label: 'Crop Disease', emoji: '🦠' },
];

const CATEGORY_COLORS: Record<string, string> = {
  government: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  market: 'bg-amber-50 text-amber-700 border border-amber-200',
  weather: 'bg-blue-50 text-blue-700 border border-blue-200',
  technology: 'bg-purple-50 text-purple-700 border border-purple-200',
  schemes: 'bg-teal-50 text-teal-700 border border-teal-200',
  'crop-disease': 'bg-red-50 text-red-700 border border-red-200',
  general: 'bg-gray-50 text-gray-700 border border-gray-200',
};

function getTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return 'Just now';
  if (hours < 24) return hours + 'h ago';
  const days = Math.floor(hours / 24);
  if (days < 7) return days + 'd ago';
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
      <div className="p-5 space-y-4">
        <div className="h-5 w-24 rounded-full bg-gray-200 animate-pulse" />
        <div className="space-y-2">
          <div className="h-5 w-full rounded bg-gray-200 animate-pulse" />
          <div className="h-5 w-3/4 rounded bg-gray-200 animate-pulse" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-full rounded bg-gray-100 animate-pulse" />
          <div className="h-4 w-5/6 rounded bg-gray-100 animate-pulse" />
        </div>
        <div className="flex items-center justify-between pt-2">
          <div className="h-4 w-28 rounded bg-gray-200 animate-pulse" />
          <div className="flex gap-2">
            <div className="h-8 w-8 rounded-full bg-gray-100 animate-pulse" />
            <div className="h-8 w-8 rounded-full bg-gray-100 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FarmerNews() {
  const navigate = useNavigate();
  const {
    articles,
    loading,
    error,
    category,
    setCategory,
    searchQuery,
    setSearchQuery,
    loadMore,
    loadingMore,
    hasMore,
    refetch,
    bookmarks,
    toggleBookmark,
    isBookmarked,
  } = useAgriNews();

  const [activeTab, setActiveTab] = useState<'all' | 'bookmarks'>('all');

  const displayArticles = useMemo(() => {
    if (activeTab === 'bookmarks') return bookmarks;
    return articles;
  }, [activeTab, articles, bookmarks]);

  const handleShare = async (article: LiveArticle) => {
    if (navigator.share) {
      try {
        await navigator.share({ title: article.title, text: article.description, url: article.link });
      } catch {
        // user cancelled
      }
    } else {
      await navigator.clipboard.writeText(article.link);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleCategoryChange = (catId: AgriNewsCategory | undefined) => {
    setCategory((catId ?? 'all') as AgriNewsCategory);
    setActiveTab('all');
  };

  return (
    <div className="min-h-screen bg-gray-50 font-['Poppins',sans-serif]">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-green-600 text-white px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 rounded-xl px-4 py-2 transition-colors text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Home
          </button>
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl font-bold">🌾 Farmer News</h1>
            <p className="text-emerald-100 text-sm mt-0.5">
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Search bar */}
        <div className="relative">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search news articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-sm placeholder:text-gray-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Toggle tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'all'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            📰 All News
            {activeTab === 'all' && (
              <span className="bg-white/20 text-xs px-2 py-0.5 rounded-full">{articles.length}</span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('bookmarks')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'bookmarks'
                ? 'bg-amber-500 text-white shadow-md shadow-amber-200'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            🔖 Bookmarks
            {activeTab === 'bookmarks' && (
              <span className="bg-white/20 text-xs px-2 py-0.5 rounded-full">{bookmarks.length}</span>
            )}
          </button>
        </div>

        {/* Category tabs */}
        {activeTab === 'all' && (
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {CATEGORIES.map((cat) => {
              const isActive = (!category && !cat.id) || category === cat.id;
              return (
                <button
                  key={cat.label}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`flex items-center gap-1.5 whitespace-nowrap px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200'
                      : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <span>{cat.emoji}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="text-5xl mb-4">⚠️</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Something went wrong</h3>
            <p className="text-gray-500 text-sm mb-6 max-w-sm">{error}</p>
            <button
              onClick={refetch}
              className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-emerald-700 transition-colors text-sm"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Skeleton loading */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && displayArticles.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="text-5xl mb-4">
              {activeTab === 'bookmarks' ? '📑' : '📭'}
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {activeTab === 'bookmarks' ? 'No bookmarks yet' : 'No articles found'}
            </h3>
            <p className="text-gray-500 text-sm max-w-sm">
              {activeTab === 'bookmarks'
                ? 'Save articles to read later by tapping the bookmark icon.'
                : searchQuery
                  ? `No results for "${searchQuery}". Try a different search term.`
                  : 'No news articles available right now. Check back later!'}
            </p>
          </div>
        )}

        {/* News grid */}
        {!loading && !error && displayArticles.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {displayArticles.map((article, idx) => {
                const catLabel = article.agriCategory ?? 'general';
                const colorClass = CATEGORY_COLORS[catLabel] ?? CATEGORY_COLORS.general;
                const bookmarked = isBookmarked(article.title);

                return (
                  <div
                    key={`${article.title}-${idx}`}
                    id={article.title}
                    className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col"
                  >
                    <div className="p-5 flex flex-col flex-1">
                      {/* Category badge */}
                      <span className={`self-start text-xs font-semibold px-3 py-1 rounded-full mb-3 ${colorClass}`}>
                        {catLabel.charAt(0).toUpperCase() + catLabel.slice(1).replace('-', ' ')}
                      </span>

                      {/* Headline */}
                      <h3 className="font-bold text-gray-900 text-base leading-snug line-clamp-2 mb-2">
                        {article.title}
                      </h3>

                      {/* Description */}
                      <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-4 flex-1">
                        {article.description}
                      </p>

                      {/* Source & time */}
                      <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
                        <span className="font-medium text-gray-500">{article.source_name}</span>
                        <span>·</span>
                        <span>{getTimeAgo(article.pubDate)}</span>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                        <a
                          href={article.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-600 text-sm font-semibold hover:text-emerald-700 transition-colors"
                        >
                          Read More →
                        </a>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => toggleBookmark(article)}
                            className={`p-2 rounded-full transition-colors ${
                              bookmarked
                                ? 'text-amber-500 bg-amber-50 hover:bg-amber-100'
                                : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
                            }`}
                            title={bookmarked ? 'Remove bookmark' : 'Bookmark article'}
                          >
                            <svg className="w-4 h-4" fill={bookmarked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleShare(article)}
                            className="p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                            title="Share article"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Load More */}
            {activeTab === 'all' && hasMore && (
              <div className="flex justify-center pt-2">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="bg-white border border-gray-200 text-gray-700 px-8 py-3 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  {loadingMore ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Loading...
                    </span>
                  ) : (
                    'Load More Articles'
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
