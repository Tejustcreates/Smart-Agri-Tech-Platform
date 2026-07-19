import React, { useState } from 'react';
import { LiveArticle } from '../../services/news/newsService';

interface FeaturedNewsProps {
  article: LiveArticle;
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

const FeaturedNews: React.FC<FeaturedNewsProps> = ({ article }) => {
  const meta = getCategoryMeta(article.category, article.keywords);
  const timeAgo = getTimeAgo(article.pubDate);
  const [imgFailed, setImgFailed] = useState(false);
  const showFallback = !article.image_url || imgFailed;

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6 border border-gray-100 hover:shadow-md transition-shadow duration-300">
      <div className="md:flex">
        <div className={`md:w-2/5 h-56 md:h-auto bg-gradient-to-br ${meta.fallbackBg} flex items-center justify-center relative overflow-hidden`}>
          {!showFallback && (
            <img
              src={article.image_url}
              alt=""
              className="w-full h-full object-cover"
              onError={() => setImgFailed(true)}
            />
          )}
          {showFallback && (
            <i className={`${meta.icon} text-5xl text-gray-300`} />
          )}
          <div className="absolute top-4 left-4">
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${meta.color}`}>{meta.label}</span>
          </div>
        </div>
        <div className="md:w-3/5 p-6 md:p-8 flex flex-col justify-center">
          <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 leading-tight group-hover:text-brand-600 transition-colors">
            {article.title}
          </h3>
          <p className="text-gray-500 text-sm mb-5 leading-relaxed line-clamp-2">
            {article.description}
          </p>

          {/* Full-row clickable Read Full Article */}
          <a
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="tap-target -mx-6 md:-mx-8 -mb-6 md:-mb-8 px-6 md:px-8 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between hover:bg-brand-50 transition-colors"
          >
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span className="font-medium text-gray-600">{article.source_name}</span>
              <span>·</span>
              <span>{timeAgo}</span>
            </div>
            <span className="text-brand-600 font-semibold text-sm flex items-center gap-1.5">
              Read Full Article <i className="fas fa-arrow-right text-xs" />
            </span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default FeaturedNews;
