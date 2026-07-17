import React from 'react';
import { LiveArticle } from '../../services/news/newsService';

interface FeaturedNewsProps {
  article: LiveArticle;
}

const getCategoryBadge = (cats: string[], keywords: string[]) => {
  const all = [...cats, ...keywords].join(' ').toLowerCase();
  if (all.includes('msp') || all.includes('price') || all.includes('mandi')) return { label: 'Market', color: 'bg-green-100 text-green-700' };
  if (all.includes('rain') || all.includes('monsoon') || all.includes('weather')) return { label: 'Weather', color: 'bg-blue-100 text-blue-700' };
  if (all.includes('scheme') || all.includes('government') || all.includes('subsidy')) return { label: 'Govt Scheme', color: 'bg-purple-100 text-purple-700' };
  if (all.includes('drone') || all.includes('technology') || all.includes('iot')) return { label: 'Technology', color: 'bg-gray-100 text-gray-700' };
  if (all.includes('pest') || all.includes('disease') || all.includes('bollworm')) return { label: 'Disease Alert', color: 'bg-red-100 text-red-700' };
  return { label: 'Agriculture', color: 'bg-amber-100 text-amber-700' };
};

const FeaturedNews: React.FC<FeaturedNewsProps> = ({ article }) => {
  const badge = getCategoryBadge(article.category, article.keywords);
  const timeAgo = getTimeAgo(article.pubDate);

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6 border border-gray-100 hover:shadow-md transition-shadow duration-300">
      <div className="md:flex">
        <div className="md:w-2/5 h-56 md:h-auto bg-gradient-to-br from-green-100 to-emerald-50 flex items-center justify-center relative overflow-hidden">
          {article.image_url ? (
            <img
              src={article.image_url}
              alt=""
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          ) : null}
          {(!article.image_url) && (
            <span className="text-7xl opacity-60">📰</span>
          )}
          <div className="absolute top-4 left-4">
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${badge.color}`}>{badge.label}</span>
          </div>
        </div>
        <div className="md:w-3/5 p-6 md:p-8 flex flex-col justify-center">
          <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 leading-tight hover:text-green-600 transition-colors cursor-pointer">
            {article.title}
          </h3>
          <p className="text-gray-500 text-sm mb-5 leading-relaxed line-clamp-3">
            {article.description}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span className="font-medium text-gray-600">{article.source_name}</span>
              <span>·</span>
              <span>{timeAgo}</span>
            </div>
            <a
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 font-semibold text-sm hover:text-green-800 transition-colors flex items-center gap-1"
            >
              Read Full Article <span>→</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

function getTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export default FeaturedNews;
