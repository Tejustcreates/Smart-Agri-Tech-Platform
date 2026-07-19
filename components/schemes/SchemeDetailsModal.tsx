import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, FileText, Globe, Calendar, Share2, CheckCircle } from 'lucide-react';
import { Scheme } from '../../types/scheme';

interface SchemeDetailsModalProps {
  scheme: Scheme | null;
  onClose: () => void;
}

function splitEligibility(text: string): string[] {
  const cleaned = text.replace(/^Eligibility[:\s]*/i, '');
  const parts = cleaned.split(/;|\.|,\s*and\s+|\)\s*,\s*/).map((s) => s.trim()).filter(Boolean);
  if (parts.length <= 1) {
    return cleaned.split(/\n/).map((s) => s.trim()).filter(Boolean);
  }
  return parts;
}

const SchemeDetailsModal: React.FC<SchemeDetailsModalProps> = ({ scheme, onClose }) => {
  if (!scheme) return null;

  const eligibilityItems = splitEligibility(scheme.eligibility);

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
    <AnimatePresence>
      {scheme && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white sm:rounded-2xl shadow-2xl w-full sm:max-w-lg max-h-[92vh] sm:max-h-[85vh] overflow-y-auto rounded-t-2xl"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white px-6 pt-5 pb-4 border-b border-gray-100 flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold mb-2 ${
                  scheme.level === 'Central' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                }`}>
                  {scheme.level}
                </span>
                <h2 className="text-xl font-bold text-gray-800 leading-tight">{scheme.schemeName}</h2>
                <p className="text-sm text-gray-400 mt-1">{scheme.ministry}</p>
              </div>
              <button
                onClick={onClose}
                className="tap-target min-w-[48px] min-h-[48px] w-12 h-12 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors flex-shrink-0"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-5">
              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase mb-1.5">About this Scheme</h4>
                <p className="text-sm text-gray-700 leading-relaxed">{scheme.description}</p>
              </div>

              {/* Eligibility as checklist */}
              <div className="bg-brand-50 rounded-xl p-4">
                <h4 className="text-xs font-bold text-brand-700 uppercase mb-2">Eligibility</h4>
                <ul className="space-y-2">
                  {eligibilityItems.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle size={16} className="text-brand-500 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-blue-50 rounded-xl p-4">
                <h4 className="text-xs font-bold text-blue-700 uppercase mb-1.5">Benefits</h4>
                <p className="text-sm text-gray-700">{scheme.benefits}</p>
              </div>

              {scheme.documents.length > 0 && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="text-xs font-bold text-gray-600 uppercase mb-2 flex items-center gap-1">
                    <FileText size={12} /> Required Documents
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {scheme.documents.map((doc) => (
                      <span key={doc} className="px-2.5 py-1 bg-white rounded-lg text-xs text-gray-600 border border-gray-100">{doc}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Calendar size={12} />
                <span>Last updated: {scheme.lastUpdated}</span>
                <span className="text-gray-200">|</span>
                <Globe size={12} />
                <span>{scheme.category}</span>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-white px-6 pb-6 pt-3 border-t border-gray-100 flex items-center gap-3">
              <a
                href={scheme.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 bg-brand-600 text-white rounded-xl text-sm font-semibold text-center hover:bg-brand-700 transition-all flex items-center justify-center gap-1.5"
              >
                Apply Now <ExternalLink size={14} />
              </a>
              <button
                onClick={handleShare}
                className="tap-target py-3 px-4 bg-gray-100 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-all flex items-center gap-1.5"
              >
                <Share2 size={14} /> Share
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SchemeDetailsModal;
