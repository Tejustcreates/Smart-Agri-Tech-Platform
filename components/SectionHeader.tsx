import React from 'react';
import ScrollReveal from './ScrollReveal';

interface SectionHeaderProps {
  icon: string;
  title: string;
  subtitle?: string;
  eyebrow?: string;
  tone?: 'green' | 'amber' | 'sky' | 'rose' | 'violet' | 'teal';
  center?: boolean;
}

const TONES: Record<string, { bg: string; text: string; chip: string; divider: string }> = {
  green: { bg: 'bg-emerald-50', text: 'text-emerald-700', chip: 'bg-emerald-100', divider: 'from-emerald-400 to-green-500' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-700', chip: 'bg-amber-100', divider: 'from-amber-400 to-orange-400' },
  sky: { bg: 'bg-sky-50', text: 'text-sky-700', chip: 'bg-sky-100', divider: 'from-sky-400 to-blue-500' },
  rose: { bg: 'bg-rose-50', text: 'text-rose-700', chip: 'bg-rose-100', divider: 'from-rose-400 to-red-400' },
  violet: { bg: 'bg-violet-50', text: 'text-violet-700', chip: 'bg-violet-100', divider: 'from-violet-400 to-purple-500' },
  teal: { bg: 'bg-teal-50', text: 'text-teal-700', chip: 'bg-teal-100', divider: 'from-teal-400 to-cyan-500' },
};

export default function SectionHeader({ icon, title, subtitle, eyebrow, tone = 'green', center = true }: SectionHeaderProps) {
  const t = TONES[tone];
  return (
    <ScrollReveal className={center ? 'text-center' : ''}>
      {eyebrow && (
        <div className={`inline-flex items-center gap-2 ${t.chip} ${t.text} rounded-full px-4 py-1.5 text-xs font-semibold mb-3`}>
          <i className={`${icon} text-[11px]`}></i> {eyebrow}
        </div>
      )}
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900">{title}</h2>
      <div className={`h-1 w-16 bg-gradient-to-r ${t.divider} rounded-full my-3 ${center ? 'mx-auto' : ''}`}></div>
      {subtitle && <p className={`text-gray-500 text-sm sm:text-base max-w-xl leading-relaxed ${center ? 'mx-auto' : ''}`}>{subtitle}</p>}
    </ScrollReveal>
  );
}
