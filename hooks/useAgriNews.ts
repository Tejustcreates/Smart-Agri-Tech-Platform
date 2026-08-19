import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { fetchAgriNews, LiveArticle, AgriNewsCategory } from '../services/news/newsService';

const BOOKMARKS_KEY = 'growsmart_bookmarks';
const REFRESH_INTERVAL = 30 * 60 * 1000;

function loadBookmarks(): LiveArticle[] {
  try {
    const raw = localStorage.getItem(BOOKMARKS_KEY);
    return raw ? (JSON.parse(raw) as LiveArticle[]) : [];
  } catch {
    return [];
  }
}

function saveBookmarks(bookmarks: LiveArticle[]): void {
  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
}

interface UseAgriNewsReturn {
  articles: LiveArticle[];
  loading: boolean;
  error: string | null;
  category: AgriNewsCategory;
  setCategory: (cat: AgriNewsCategory) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  loadMore: () => Promise<void>;
  loadingMore: boolean;
  hasMore: boolean;
  refetch: () => Promise<void>;
  bookmarks: LiveArticle[];
  toggleBookmark: (article: LiveArticle) => void;
  isBookmarked: (id: string) => boolean;
}

export function useAgriNews(initialCategory?: AgriNewsCategory): UseAgriNewsReturn {
  const [articles, setArticles] = useState<LiveArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<AgriNewsCategory>(initialCategory ?? 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [bookmarks, setBookmarks] = useState<LiveArticle[]>(loadBookmarks);

  const fetchNews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchAgriNews();
      setArticles(result.articles);
      setNextPage(result.nextPage ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch news');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMore = useCallback(async () => {
    if (!nextPage || loadingMore) return;
    setLoadingMore(true);
    try {
      const result = await fetchAgriNews(nextPage);
      setArticles((prev) => [...prev, ...result.articles]);
      setNextPage(result.nextPage ?? null);
    } catch (err) {
      toast.error('Failed to load more articles');
    } finally {
      setLoadingMore(false);
    }
  }, [nextPage, loadingMore]);

  const toggleBookmark = useCallback(
    (article: LiveArticle) => {
      setBookmarks((prev) => {
        const exists = prev.some((b) => b.title === article.title);
        const next = exists
          ? prev.filter((b) => b.title !== article.title)
          : [...prev, article];
        saveBookmarks(next);
        toast.success(exists ? 'Bookmark removed' : 'Article bookmarked');
        return next;
      });
    },
    [],
  );

  const isBookmarked = useCallback(
    (id: string): boolean => {
      return bookmarks.some((b) => b.title === id);
    },
    [bookmarks],
  );

  const filteredArticles = articles.filter((article) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      article.title.toLowerCase().includes(q) ||
      article.description.toLowerCase().includes(q)
    );
  });

  // Refetch on category change
  useEffect(() => {
    fetchNews();
  }, [category, fetchNews]);

  // Auto-refresh every 30 minutes
  useEffect(() => {
    const timer = setInterval(fetchNews, REFRESH_INTERVAL);
    return () => clearInterval(timer);
  }, [fetchNews]);

  return {
    articles: filteredArticles,
    loading,
    error,
    category,
    setCategory,
    searchQuery,
    setSearchQuery,
    loadMore,
    loadingMore,
    hasMore: !!nextPage,
    refetch: fetchNews,
    bookmarks,
    toggleBookmark,
    isBookmarked,
  };
}
