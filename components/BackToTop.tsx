import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowUp } from 'lucide-react';

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
      className={`fixed right-4 lg:right-6 z-40 w-11 h-11 rounded-full bg-brand-600 text-white shadow-lg hover:bg-brand-800 flex items-center justify-center transition-all duration-300
        bottom-[calc(64px+env(safe-area-inset-bottom)+16px)] lg:bottom-6
        ${visible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-2 pointer-events-none'}`}
      aria-label={t('nav.backToTop', 'Back to top')}
    >
      <ArrowUp size={18} />
    </button>
  );
}
