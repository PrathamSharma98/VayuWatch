import { motion } from 'framer-motion';
import { AQICategory, getAQIColor, getAQILabel } from '@/data/pollutionData';
import { cn } from '@/lib/utils';

interface AQIGaugeProps {
  value: number;
  category: AQICategory;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

const sizeConfig = {
  sm: { width: 100, height: 60, strokeWidth: 8, fontSize: 'text-lg' },
  md: { width: 160, height: 90, strokeWidth: 10, fontSize: 'text-3xl' },
  lg: { width: 220, height: 120, strokeWidth: 12, fontSize: 'text-4xl' },
};

export function AQIGauge({ value, category, size = 'md', showLabel = true, className }: AQIGaugeProps) {
  const config = sizeConfig[size];
  const color = getAQIColor(category);
  
  // Calculate arc parameters
  const radius = (config.width - config.strokeWidth) / 2;
  const circumference = Math.PI * radius;
  const percentage = Math.min(value / 500, 1); // Max AQI is 500
  const offset = circumference * (1 - percentage);

  return (
    <div className={cn('flex flex-col items-center', className)}>
      <svg
        width={config.width}
        height={config.height}
        viewBox={`0 0 ${config.width} ${config.height}`}
        className="overflow-visible"
      >
        {/* Background arc */}
        <path
          d={`M ${config.strokeWidth / 2} ${config.height - 5} 
              A ${radius} ${radius} 0 0 1 ${config.width - config.strokeWidth / 2} ${config.height - 5}`}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={config.strokeWidth}
          strokeLinecap="round"
        />
        
        {/* Animated progress arc */}
        <motion.path
          d={`M ${config.strokeWidth / 2} ${config.height - 5} 
              A ${radius} ${radius} 0 0 1 ${config.width - config.strokeWidth / 2} ${config.height - 5}`}
          fill="none"
          stroke={color}
          strokeWidth={config.strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          style={{
            filter: `drop-shadow(0 0 8px ${color}50)`,
          }}
        />
      </svg>
      
      {/* Value display */}
      <div className="relative -mt-8">
        <motion.span
          className={cn('font-display font-bold', config.fontSize)}
          style={{ color }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          {value}
        </motion.span>
      </div>
      
      {showLabel && (
        <motion.span
          className="text-sm text-muted-foreground mt-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {getAQILabel(category)}
        </motion.span>
      )}
    </div>
  );
}
