import React from 'react';
import { Progress } from 'antd';

export interface CircularProgressProps {
  /** 0-100 */
  value: number;
  size?: number;
  /** unit: percentage of canvas radius, same scale antd's Progress uses (roughly 4-10 for a typical ring) */
  strokeWidth?: number;
  strokeColor?: string;
  trailColor?: string;
  label?: string;
  showValue?: boolean;
  valueClassName?: string;
  /** Custom center content; receives the clamped 0-100 value. Overrides the default "N%" text. */
  formatValue?: (value: number) => React.ReactNode;
  className?: string;
}

/**
 * Shared circular progress ring used wherever the app shows a 0-100 score or
 * confidence meter (previously three separate hand-rolled SVG implementations
 * with duplicated circumference/offset math: weather's HealthScore and
 * AIConfidenceMeter, and FarmerDashboard's CircularProgress).
 */
const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  size = 80,
  strokeWidth = 6,
  strokeColor = '#16a34a',
  trailColor = 'rgba(0,0,0,0.06)',
  label,
  showValue = true,
  valueClassName = 'text-sm font-bold text-gray-800',
  formatValue,
  className = '',
}) => {
  const percent = Math.max(0, Math.min(100, value));

  return (
    <div className={`flex flex-col items-center gap-1 ${className}`}>
      <Progress
        type="circle"
        percent={percent}
        size={size}
        strokeWidth={strokeWidth}
        strokeColor={strokeColor}
        trailColor={trailColor}
        format={
          showValue
            ? () => (formatValue ? formatValue(percent) : <span className={valueClassName}>{Math.round(percent)}%</span>)
            : () => null
        }
      />
      {label && <span className="text-xs font-medium text-gray-500">{label}</span>}
    </div>
  );
};

export default CircularProgress;
