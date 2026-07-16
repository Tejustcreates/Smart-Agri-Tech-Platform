import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, FileText, Globe, Calendar, Share2 } from 'lucide-react';
import { Scheme } from '../../types/scheme';

interface SchemeDetailsModalProps {
  scheme: Scheme | null;
  onClose: () => void;
}

const SchemeDetailsModal: React.FC<SchemeDetailsModalProps> = ({ scheme, onClose }) => {
  if (!scheme) return null;

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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="px-6 pt-6 pb-4 border-b border-gray-100">
              <div className="flex items-start justify-between gap-3">
                <div>
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
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors flex-shrink-0"
                >
                  <X size={18} className="text-gray-500" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-5">
              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase mb-1.5">About this Scheme</h4>
                <p className="text-sm text-gray-700 leading-relaxed">{scheme.description}</p>
              </div>

              <div className="bg-green-50 rounded-xl p-4">
                <h4 className="text-xs font-bold text-green-700 uppercase mb-1.5">Eligibility</h4>
                <p className="text-sm text-gray-700">{scheme.eligibility}</p>
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
            <div className="px-6 pb-6 flex items-center gap-3">
              <a
                href={scheme.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 bg-green-600 text-white rounded-xl text-sm font-semibold text-center hover:bg-green-700 transition-all flex items-center justify-center gap-1.5"
              >
                Apply Now <ExternalLink size={14} />
              </a>
              <button
                onClick={handleShare}
                className="py-3 px-4 bg-gray-100 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-all flex items-center gap-1.5"
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
