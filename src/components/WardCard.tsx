import { motion } from 'framer-motion';
import { MapPin, Users, ArrowRight } from 'lucide-react';
import { Ward, getAQIColor } from '@/data/pollutionData';
import { AQIBadge } from './AQIBadge';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface WardCardProps {
  ward: Ward;
  cityId: string;
  className?: string;
  delay?: number;
}

export function WardCard({ ward, cityId, className, delay = 0 }: WardCardProps) {
  const color = getAQIColor(ward.category);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
    >
      <Link
        to={`/ward/${ward.id}`}
        className={cn(
          'group block p-4 rounded-xl bg-secondary/30 border border-border/50',
          'hover:border-primary/30 hover:bg-secondary/50 transition-all duration-300',
          className
        )}
      >
        <div className="flex items-start justify-between mb-3">
          <div>
            <h4 className="font-display font-semibold text-foreground group-hover:text-primary transition-colors">
              {ward.name}
            </h4>
            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
              <Users className="w-3 h-3" />
              <span>{(ward.population / 1000).toFixed(0)}K residents</span>
            </div>
          </div>
          <div 
            className="text-2xl font-display font-bold"
            style={{ color }}
          >
            {ward.aqi}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <AQIBadge category={ward.category} size="sm" />
          <span className="text-xs text-muted-foreground">
            {ward.dominantSource}
          </span>
        </div>
        
        <div className="mt-3 pt-3 border-t border-border/30 flex items-center justify-between">
          <div className="flex gap-3 text-xs text-muted-foreground">
            <span>PM2.5: {ward.pollutants.pm25}</span>
            <span>PM10: {ward.pollutants.pm10}</span>
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
      </Link>
    </motion.div>
  );
}
