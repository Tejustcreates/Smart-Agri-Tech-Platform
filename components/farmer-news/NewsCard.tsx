import React, { useState } from 'react';
import { LiveArticle } from '../../services/news/newsService';

interface NewsCardProps {
  article: LiveArticle;
  index: number;
}

const getCategoryMeta = (cats: string[], keywords: string[]) => {
  const all = [...cats, ...keywords].join(' ').toLowerCase();
  if (all.includes('msp') || all.includes('price') || all.includes('mandi')) return { label: 'Market', color: 'bg-brand-100 text-brand-700', icon: 'fas fa-chart-line', fallbackBg: 'from-brand-50 to-emerald-50' };
  if (all.includes('rain') || all.includes('monsoon') || all.includes('weather')) return { label: 'Weather', color: 'bg-blue-100 text-blue-700', icon: 'fas fa-cloud-sun', fallbackBg: 'from-blue-50 to-sky-50' };
  if (all.includes('scheme') || all.includes('government') || all.includes('subsidy')) return { label: 'Govt Scheme', color: 'bg-purple-100 text-purple-700', icon: 'fas fa-landmark', fallbackBg: 'from-purple-50 to-violet-50' };
  if (all.includes('drone') || all.includes('technology') || all.includes('iot')) return { label: 'Technology', color: 'bg-gray-100 text-gray-700', icon: 'fas fa-tractor', fallbackBg: 'from-gray-50 to-slate-50' };
  if (all.includes('pest') || all.includes('disease') || all.includes('bollworm')) return { label: 'Disease Alert', color: 'bg-red-100 text-red-700', icon: 'fas fa-bug', fallbackBg: 'from-red-50 to-rose-50' };
  return { label: 'Agriculture', color: 'bg-amber-100 text-amber-700', icon: 'fas fa-wheat-awn', fallbackBg: 'from-amber-50 to-orange-50' };
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
  const meta = getCategoryMeta(article.category, article.keywords);
  const [imgFailed, setImgFailed] = useState(false);
  const showFallback = !article.image_url || imgFailed;

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group flex flex-col"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Image */}
      <div className={`h-44 bg-gradient-to-br ${meta.fallbackBg} relative overflow-hidden`}>
        {!showFallback && (
          <img
            src={article.image_url}
            alt=""
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgFailed(true)}
          />
        )}
        {showFallback && (
          <div className="w-full h-full flex items-center justify-center">
            <i className={`${meta.icon} text-4xl text-gray-300`} />
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${meta.color}`}>{meta.label}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-base font-bold text-gray-800 mb-2 line-clamp-2 leading-snug group-hover:text-brand-600 transition-colors">
          {article.title}
        </h3>
        <p className="text-gray-500 text-xs mb-4 line-clamp-2 leading-relaxed flex-1">
          {article.description}
        </p>

        {/* Full-row clickable Read More */}
        <a
          href={article.link}
          target="_blank"
          rel="noopener noreferrer"
          className="tap-target -mx-5 -mb-5 px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between hover:bg-brand-50 transition-colors rounded-b-2xl"
        >
          <div className="flex items-center gap-2 text-[11px] text-gray-400">
            <span className="font-medium text-gray-600">{article.source_name}</span>
            <span>·</span>
            <span>{getTimeAgo(article.pubDate)}</span>
          </div>
          <span className="text-brand-600 text-xs font-semibold flex items-center gap-1">
            Read More <i className="fas fa-arrow-right text-[10px]" />
          </span>
        </a>
      </div>
    </div>
  );
};

export default NewsCard;
