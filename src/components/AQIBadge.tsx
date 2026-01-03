import { AQICategory, getAQILabel } from '@/data/pollutionData';
import { cn } from '@/lib/utils';

interface AQIBadgeProps {
  category: AQICategory;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
  lg: 'px-4 py-1.5 text-base',
};

const categoryClasses: Record<AQICategory, string> = {
  'good': 'bg-aqi-good/20 text-aqi-good border-aqi-good/30',
  'satisfactory': 'bg-aqi-satisfactory/20 text-aqi-satisfactory border-aqi-satisfactory/30',
  'moderate': 'bg-aqi-moderate/20 text-aqi-moderate border-aqi-moderate/30',
  'poor': 'bg-aqi-poor/20 text-aqi-poor border-aqi-poor/30',
  'very-poor': 'bg-aqi-very-poor/20 text-aqi-very-poor border-aqi-very-poor/30',
  'severe': 'bg-aqi-severe/20 text-aqi-severe border-aqi-severe/30',
};

export function AQIBadge({ category, size = 'md', className }: AQIBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full border',
        sizeClasses[size],
        categoryClasses[category],
        className
      )}
    >
      {getAQILabel(category)}
    </span>
  );
}
