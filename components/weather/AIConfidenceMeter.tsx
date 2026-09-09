import React from 'react';
import CircularProgress from '../shared/CircularProgress';

interface AIConfidenceMeterProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
  showValue?: boolean;
}

const AIConfidenceMeter: React.FC<AIConfidenceMeterProps> = ({
  value,
  size = 80,
  strokeWidth = 6,
  color = '#16a34a',
  label,
  showValue = true,
}) => (
  <CircularProgress
    value={value}
    size={size}
    strokeWidth={strokeWidth}
    strokeColor={color}
    label={label}
    showValue={showValue}
  />
);

export default AIConfidenceMeter;
