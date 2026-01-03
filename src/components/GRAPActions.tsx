import { motion } from 'framer-motion';
import { AlertTriangle, Shield, CheckCircle } from 'lucide-react';
import { grapActions, AQICategory } from '@/data/pollutionData';
import { cn } from '@/lib/utils';

interface GRAPActionsProps {
  currentCategory: AQICategory;
  className?: string;
}

const getActiveStage = (category: AQICategory): number => {
  switch (category) {
    case 'poor': return 1;
    case 'very-poor': return 2;
    case 'severe': return 4;
    default: return 0;
  }
};

export function GRAPActions({ currentCategory, className }: GRAPActionsProps) {
  const activeStage = getActiveStage(currentCategory);
  
  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center gap-2">
        <Shield className="w-5 h-5 text-primary" />
        <h3 className="font-display font-semibold text-foreground">GRAP Actions</h3>
      </div>
      
      <p className="text-sm text-muted-foreground">
        Graded Response Action Plan for Delhi-NCR region
      </p>
      
      <div className="space-y-3">
        {grapActions.map((grap, index) => {
          const isActive = grap.stage <= activeStage;
          
          return (
            <motion.div
              key={grap.stage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                'p-4 rounded-lg border',
                isActive 
                  ? 'bg-danger/10 border-danger/30' 
                  : 'bg-secondary/30 border-border/50'
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={cn(
                    'px-2 py-0.5 rounded text-xs font-medium',
                    isActive ? 'bg-danger text-white' : 'bg-muted text-muted-foreground'
                  )}>
                    Stage {grap.stage}
                  </span>
                  <span className="text-sm text-muted-foreground">{grap.trigger}</span>
                </div>
                {isActive && (
                  <AlertTriangle className="w-4 h-4 text-danger" />
                )}
              </div>
              
              <ul className="space-y-1">
                {grap.actions.slice(0, 3).map((action, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <CheckCircle className={cn(
                      'w-3 h-3 mt-1 flex-shrink-0',
                      isActive ? 'text-danger' : 'text-muted-foreground'
                    )} />
                    <span className={cn(
                      isActive ? 'text-foreground' : 'text-muted-foreground'
                    )}>
                      {action}
                    </span>
                  </li>
                ))}
                {grap.actions.length > 3 && (
                  <li className="text-xs text-muted-foreground ml-5">
                    +{grap.actions.length - 3} more actions
                  </li>
                )}
              </ul>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
