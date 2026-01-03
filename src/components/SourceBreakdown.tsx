import { motion } from 'framer-motion';
import { Car, Factory, Construction, Flame, Wheat, Home } from 'lucide-react';
import { pollutionSources } from '@/data/pollutionData';
import { cn } from '@/lib/utils';

const iconMap: Record<string, React.ElementType> = {
  Car,
  Factory,
  Construction,
  Flame,
  Wheat,
  Home,
};

interface SourceBreakdownProps {
  className?: string;
}

export function SourceBreakdown({ className }: SourceBreakdownProps) {
  return (
    <div className={cn('space-y-4', className)}>
      <h3 className="font-display font-semibold text-foreground">Pollution Sources</h3>
      
      <div className="space-y-3">
        {pollutionSources.map((source, index) => {
          const Icon = iconMap[source.icon] || Factory;
          
          return (
            <motion.div
              key={source.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-3"
            >
              <div className="p-2 rounded-lg bg-secondary">
                <Icon className="w-4 h-4 text-muted-foreground" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-foreground">{source.name}</span>
                  <span className="text-sm font-medium text-primary">{source.percentage}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${source.percentage}%` }}
                    transition={{ delay: index * 0.1 + 0.3, duration: 0.8 }}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
