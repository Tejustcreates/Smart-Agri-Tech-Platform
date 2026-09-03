import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function BackToTop() {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className={`back-to-top w-12 h-12 rounded-full bg-agri-green text-white shadow-lg hover:bg-agri-dark flex items-center justify-center transition-all ${visible ? 'visible' : ''}`}
      aria-label={t('nav.backToTop', 'Back to top')}
    >
      <i className="fas fa-arrow-up"></i>
    </button>
  );
}
