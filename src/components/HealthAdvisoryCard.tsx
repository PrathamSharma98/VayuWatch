import { motion } from 'framer-motion';
import { Heart, AlertTriangle, TreePine } from 'lucide-react';
import { AQICategory, getHealthAdvisory, getAQIColor } from '@/data/pollutionData';
import { cn } from '@/lib/utils';

interface HealthAdvisoryCardProps {
  category: AQICategory;
  className?: string;
}

export function HealthAdvisoryCard({ category, className }: HealthAdvisoryCardProps) {
  const advisory = getHealthAdvisory(category);
  const color = getAQIColor(category);
  const isSevere = category === 'very-poor' || category === 'severe';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'p-6 rounded-xl border',
        isSevere ? 'bg-danger/10 border-danger/30' : 'bg-card border-border/50',
        className
      )}
    >
      <div className="flex items-center gap-2 mb-4">
        {isSevere ? (
          <AlertTriangle className="w-5 h-5 text-danger" />
        ) : (
          <Heart className="w-5 h-5 text-primary" />
        )}
        <h3 className="font-display font-semibold text-foreground">Health Advisory</h3>
      </div>
      
      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">General Population</p>
          <p className="text-sm text-foreground">{advisory.general}</p>
        </div>
        
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">Sensitive Groups</p>
          <p className="text-sm text-foreground">{advisory.sensitive}</p>
        </div>
        
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">Outdoor Activities</p>
          <p className="text-sm text-foreground">{advisory.outdoor}</p>
        </div>
      </div>
      
      {isSevere && (
        <div className="mt-4 pt-4 border-t border-danger/20">
          <div className="flex items-center gap-2 text-danger text-sm font-medium">
            <AlertTriangle className="w-4 h-4" />
            <span>Emergency measures in effect</span>
          </div>
        </div>
      )}
    </motion.div>
  );
}
