import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getAQICategory, getAQIColor } from '@/data/pollutionData';
import { cn } from '@/lib/utils';

interface TrendData {
  label: string;
  aqi: number;
}

interface AQITrendChartProps {
  data: TrendData[];
  title?: string;
  className?: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const aqi = payload[0].value;
    const category = getAQICategory(aqi);
    const color = getAQIColor(category);
    
    return (
      <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-lg font-bold" style={{ color }}>
          AQI: {aqi}
        </p>
      </div>
    );
  }
  return null;
};

export function AQITrendChart({ data, title, className }: AQITrendChartProps) {
  const avgAqi = data.reduce((sum, d) => sum + d.aqi, 0) / data.length;
  const gradientColor = getAQIColor(getAQICategory(avgAqi));
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('p-6 rounded-xl bg-card border border-border/50', className)}
    >
      {title && (
        <h3 className="font-display font-semibold text-foreground mb-4">{title}</h3>
      )}
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="aqiGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={gradientColor} stopOpacity={0.3} />
                <stop offset="95%" stopColor={gradientColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="label" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              domain={[0, 'dataMax + 50']}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="aqi"
              stroke={gradientColor}
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#aqiGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
