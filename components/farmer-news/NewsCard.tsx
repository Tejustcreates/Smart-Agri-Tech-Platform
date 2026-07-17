import React from 'react';
import { LiveArticle } from '../../services/news/newsService';

interface NewsCardProps {
  article: LiveArticle;
  index: number;
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

function getTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

const NewsCard: React.FC<NewsCardProps> = ({ article, index }) => {
  const badge = getCategoryBadge(article.category, article.keywords);

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Image */}
      <div className="h-44 bg-gradient-to-br from-green-50 to-emerald-50 relative overflow-hidden">
        {article.image_url ? (
          <img
            src={article.image_url}
            alt=""
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        ) : null}
        {(!article.image_url) && (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-5xl opacity-40">📰</span>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${badge.color}`}>{badge.label}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-base font-bold text-gray-800 mb-2 line-clamp-2 leading-snug group-hover:text-green-600 transition-colors cursor-pointer">
          {article.title}
        </h3>
        <p className="text-gray-500 text-xs mb-4 line-clamp-2 leading-relaxed">
          {article.description}
        </p>
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2 text-[11px] text-gray-400">
            <span className="font-medium text-gray-600">{article.source_name}</span>
            <span>·</span>
            <span>{getTimeAgo(article.pubDate)}</span>
          </div>
          <a
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-600 text-xs font-semibold hover:text-green-800 transition-colors"
          >
            Read More →
          </a>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
