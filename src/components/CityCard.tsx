import { motion } from 'framer-motion';
import { MapPin, ArrowRight } from 'lucide-react';
import { City, getAQIColor } from '@/data/pollutionData';
import { AQIBadge } from './AQIBadge';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface CityCardProps {
  city: City;
  rank?: number;
  className?: string;
  delay?: number;
}

export function CityCard({ city, rank, className, delay = 0 }: CityCardProps) {
  const color = getAQIColor(city.category);
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.4 }}
    >
      <Link
        to={`/city/${city.id}`}
        className={cn(
          'group flex items-center gap-4 p-4 rounded-xl bg-card border border-border/50',
          'hover:border-primary/30 hover:bg-card/80 transition-all duration-300',
          className
        )}
      >
        {rank && (
          <div 
            className="flex items-center justify-center w-8 h-8 rounded-full font-display font-bold text-sm"
            style={{ 
              backgroundColor: `${color}20`,
              color: color 
            }}
          >
            {rank}
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-display font-semibold text-foreground truncate">
              {city.name}
            </h3>
            <MapPin className="w-3 h-3 text-muted-foreground flex-shrink-0" />
          </div>
          <p className="text-sm text-muted-foreground">{city.state}</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p 
              className="text-2xl font-display font-bold"
              style={{ color }}
            >
              {city.aqi}
            </p>
            <AQIBadge category={city.category} size="sm" />
          </div>
          
          <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
        </div>
      </Link>
    </motion.div>
  );
}
