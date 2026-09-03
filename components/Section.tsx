import React from 'react';
import SectionHeader from './SectionHeader';

interface SectionProps {
  id: string;
  eyebrow: string;
  icon: string;
  title: string;
  subtitle?: string;
  tone?: 'green' | 'amber' | 'sky' | 'rose' | 'violet' | 'teal';
  bgFrom?: string;
  bgTo?: string;
  children: React.ReactNode;
  className?: string;
}

const TONES: Record<string, { bg: string; chip: string; text: string; divider: string }> = {
  green:  { bg: 'from-emerald-50/60', chip: 'bg-emerald-100',    text: 'text-emerald-700', divider: 'from-emerald-500 to-green-400' },
  amber:  { bg: 'from-amber-50/60',   chip: 'bg-amber-100',      text: 'text-amber-700',   divider: 'from-amber-500 to-orange-400' },
  sky:    { bg: 'from-sky-50/60',     chip: 'bg-sky-100',        text: 'text-sky-700',     divider: 'from-sky-500 to-blue-400' },
  rose:   { bg: 'from-rose-50/60',    chip: 'bg-rose-100',       text: 'text-rose-700',    divider: 'from-rose-500 to-red-400' },
  violet: { bg: 'from-violet-50/60',  chip: 'bg-violet-100',     text: 'text-violet-700',  divider: 'from-violet-500 to-purple-400' },
  teal:   { bg: 'from-teal-50/60',    chip: 'bg-teal-100',       text: 'text-teal-700',    divider: 'from-teal-500 to-cyan-400' },
};

export default function Section({ id, eyebrow, icon, title, subtitle, tone = 'green', children, className = '' }: SectionProps) {
  const t = TONES[tone];
  return (
    <section id={id} className={`snap-section border-t border-slate-200/70 scroll-mt-16 ${className}`}>
      <div className={`w-full bg-gradient-to-b ${t.bg} via-white to-white`}>
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
          <div className="text-center mb-10 max-w-3xl mx-auto">
            <div className={`inline-flex items-center gap-2 ${t.chip} ${t.text} border border-black/5 rounded-full px-4 py-1 text-xs font-extrabold mb-3 shadow-xs`}>
              <i className={`${icon} text-[11px]`}></i>
              <span>{eyebrow}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">{title}</h2>
            <div className={`h-1 w-16 bg-gradient-to-r ${t.divider} rounded-full my-3.5 mx-auto`}></div>
            {subtitle && <p className="text-slate-600 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">{subtitle}</p>}
          </div>
          {children}
        </div>
      </div>
    </section>
  );
}
