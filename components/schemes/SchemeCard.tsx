import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Share2, Bookmark, ChevronDown, ChevronUp, FileText, Globe, Calendar } from 'lucide-react';
import { Scheme } from '../../types/scheme';

interface SchemeCardProps {
  scheme: Scheme;
  rank: number;
}

const levelColor = {
  Central: 'bg-blue-100 text-blue-700',
  State: 'bg-purple-100 text-purple-700',
};

const matchColor = (score: number) => {
  if (score >= 85) return 'bg-green-500';
  if (score >= 70) return 'bg-emerald-500';
  if (score >= 55) return 'bg-amber-500';
  return 'bg-gray-400';
};

const SchemeCard: React.FC<SchemeCardProps> = ({ scheme, rank }) => {
  const [expanded, setExpanded] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: scheme.schemeName, text: scheme.description, url: scheme.website });
      } catch { /* cancelled */ }
    } else {
      navigator.clipboard?.writeText(`${scheme.schemeName}\n${scheme.description}\n${scheme.website}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.06 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
    >
      {/* Header */}
      <div className="px-5 pt-5 pb-3">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${matchColor(scheme.matchScore)} text-white text-sm font-bold`}>
              {scheme.matchScore}%
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-bold text-gray-800 leading-tight truncate">{scheme.schemeName}</h3>
              <p className="text-xs text-gray-400 mt-0.5 truncate">{scheme.ministry}</p>
            </div>
          </div>
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold flex-shrink-0 ${levelColor[scheme.level]}`}>
            {scheme.level}
          </span>
        </div>

        <p className="text-sm text-gray-500 mb-3 line-clamp-2">{scheme.description}</p>

        {/* Quick Info */}
        <div className="flex flex-wrap gap-2 text-[11px] text-gray-400">
          <span className="flex items-center gap-1"><Calendar size={11} /> Updated {scheme.lastUpdated}</span>
          <span className="flex items-center gap-1"><Globe size={11} /> {scheme.category}</span>
        </div>
      </div>

      {/* Expandable Details */}
      <div className="px-5">
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between py-2.5 text-xs font-semibold text-green-600 hover:text-green-700 transition-colors"
        >
          {expanded ? 'Hide Details' : 'View Eligibility & Benefits'}
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="pb-4 space-y-3"
          >
            <div className="bg-green-50 rounded-xl p-3.5">
              <p className="text-xs font-bold text-green-700 uppercase mb-1">Eligibility</p>
              <p className="text-sm text-gray-700">{scheme.eligibility}</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-3.5">
              <p className="text-xs font-bold text-blue-700 uppercase mb-1">Benefits</p>
              <p className="text-sm text-gray-700">{scheme.benefits}</p>
            </div>
            {scheme.documents.length > 0 && (
              <div className="bg-gray-50 rounded-xl p-3.5">
                <p className="text-xs font-bold text-gray-600 uppercase mb-1.5 flex items-center gap-1">
                  <FileText size={11} /> Required Documents
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {scheme.documents.map((doc) => (
                    <span key={doc} className="px-2 py-0.5 bg-white rounded text-[11px] text-gray-600 border border-gray-100">{doc}</span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="px-5 pb-4 flex items-center gap-2">
        <a
          href={scheme.website}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-2.5 bg-green-600 text-white rounded-xl text-xs font-semibold text-center hover:bg-green-700 transition-all flex items-center justify-center gap-1.5"
        >
          Apply Now <ExternalLink size={12} />
        </a>
        <a
          href={scheme.website}
          target="_blank"
          rel="noopener noreferrer"
          className="py-2.5 px-3 bg-gray-100 text-gray-600 rounded-xl text-xs font-semibold hover:bg-gray-200 transition-all"
        >
          <Globe size={14} />
        </a>
        <button
          onClick={() => setSaved(!saved)}
          className={`py-2.5 px-3 rounded-xl text-xs font-semibold transition-all ${
            saved ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Bookmark size={14} fill={saved ? 'currentColor' : 'none'} />
        </button>
        <button
          onClick={handleShare}
          className="py-2.5 px-3 bg-gray-100 text-gray-600 rounded-xl text-xs font-semibold hover:bg-gray-200 transition-all"
        >
          <Share2 size={14} />
        </button>
      </div>
    </motion.div>
  );
};

export default SchemeCard;
