import { cn } from '@/lib/utils';

export function AQIScaleLegend({ className }: { className?: string }) {
  const scales = [
    { range: '0-50', label: 'Good', color: 'bg-aqi-good', description: 'Minimal impact' },
    { range: '51-100', label: 'Satisfactory', color: 'bg-aqi-satisfactory', description: 'Minor breathing discomfort to sensitive people' },
    { range: '101-200', label: 'Moderate', color: 'bg-aqi-moderate', description: 'Breathing discomfort to people with lung disease' },
    { range: '201-300', label: 'Poor', color: 'bg-aqi-poor', description: 'Breathing discomfort to most on prolonged exposure' },
    { range: '301-400', label: 'Very Poor', color: 'bg-aqi-very-poor', description: 'Respiratory illness on prolonged exposure' },
    { range: '401-500', label: 'Severe', color: 'bg-aqi-severe', description: 'Affects healthy people. Serious impact on sensitive groups' },
  ];

  return (
    <div className={cn('p-4 rounded-xl bg-card border border-border/50', className)}>
      <h3 className="font-display font-semibold text-foreground mb-3">AQI Scale (CPCB India)</h3>
      <div className="space-y-2">
        {scales.map((scale) => (
          <div key={scale.range} className="flex items-center gap-3">
            <div className={cn('w-4 h-4 rounded', scale.color)} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">{scale.label}</span>
                <span className="text-xs text-muted-foreground">({scale.range})</span>
              </div>
              <p className="text-xs text-muted-foreground truncate">{scale.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
