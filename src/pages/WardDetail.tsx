import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  MapPin, 
  Users, 
  Ruler,
  Clock,
  Wind,
  Factory,
  TreePine,
  Car,
  Bus,
  Lightbulb
} from 'lucide-react';
import { Header } from '@/components/Header';
import { AQIGauge } from '@/components/AQIGauge';
import { AQIBadge } from '@/components/AQIBadge';
import { PollutantCard } from '@/components/PollutantCard';
import { HealthAdvisoryCard } from '@/components/HealthAdvisoryCard';
import { LiveIndicator } from '@/components/LiveIndicator';
import { getWardById, getAQIColor } from '@/data/pollutionData';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const WardDetail = () => {
  const { wardId } = useParams<{ wardId: string }>();
  const navigate = useNavigate();
  const result = getWardById(wardId || '');

  if (!result) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-display font-bold text-foreground mb-4">Ward Not Found</h1>
          <p className="text-muted-foreground mb-6">The ward you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/')}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  const { ward, city, state } = result;
  const color = getAQIColor(ward.category);

  // Pollutant limits (CPCB standards)
  const pollutantLimits = {
    pm25: 60,
    pm10: 100,
    no2: 80,
    so2: 80,
    co: 4,
    o3: 180,
  };

  // Ward-specific recommendations based on dominant source
  const getRecommendations = () => {
    const baseRecs = [
      { icon: TreePine, text: 'Plant more trees and create green buffers along roads' },
      { icon: Bus, text: 'Use public transport or carpool to reduce vehicular emissions' },
      { icon: Lightbulb, text: 'Switch to LED lights and energy-efficient appliances' },
    ];

    switch (ward.dominantSource) {
      case 'Vehicular':
        return [
          { icon: Car, text: 'Consider odd-even traffic measures during peak pollution' },
          { icon: Bus, text: 'Promote metro/bus usage with subsidized passes' },
          ...baseRecs,
        ];
      case 'Industrial':
        return [
          { icon: Factory, text: 'Ensure industrial units comply with emission norms' },
          { icon: Wind, text: 'Install proper air filtration systems in factories' },
          ...baseRecs,
        ];
      case 'Construction':
        return [
          { icon: Factory, text: 'Mandate dust barriers and water sprinkling at sites' },
          { icon: Wind, text: 'Use covered trucks for transporting construction material' },
          ...baseRecs,
        ];
      default:
        return baseRecs;
    }
  };

  const recommendations = getRecommendations();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6 flex-wrap">
          <Link to="/" className="hover:text-primary transition-colors">Dashboard</Link>
          <span>/</span>
          <Link to={`/city/${city.id}`} className="hover:text-primary transition-colors">{city.name}</Link>
          <span>/</span>
          <span className="text-foreground">{ward.name}</span>
        </div>

        {/* Ward Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8"
        >
          <div className="flex items-start gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate(-1)}
              className="mt-1"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl lg:text-4xl font-display font-bold text-foreground">
                  {ward.name}
                </h1>
                <LiveIndicator />
              </div>
              <div className="flex items-center gap-4 text-muted-foreground flex-wrap">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{city.name}, {state.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{(ward.population / 1000).toFixed(0)}K residents</span>
                </div>
                <div className="flex items-center gap-1">
                  <Ruler className="w-4 h-4" />
                  <span>{ward.area} sq km</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 p-6 rounded-xl bg-card border border-border/50">
            <AQIGauge 
              value={ward.aqi} 
              category={ward.category}
              size="md"
            />
            <div className="space-y-2">
              <AQIBadge category={ward.category} size="lg" />
              <p className="text-sm text-muted-foreground">
                Dominant: {ward.dominantSource}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Pollutant Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-xl bg-card border border-border/50 p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Wind className="w-5 h-5 text-primary" />
                <h2 className="font-display font-semibold text-foreground">Air Pollutants</h2>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                <PollutantCard 
                  name="PM2.5" 
                  value={ward.pollutants.pm25} 
                  unit="µg/m³" 
                  limit={pollutantLimits.pm25} 
                />
                <PollutantCard 
                  name="PM10" 
                  value={ward.pollutants.pm10} 
                  unit="µg/m³" 
                  limit={pollutantLimits.pm10} 
                />
                <PollutantCard 
                  name="NO₂" 
                  value={ward.pollutants.no2} 
                  unit="µg/m³" 
                  limit={pollutantLimits.no2} 
                />
                <PollutantCard 
                  name="SO₂" 
                  value={ward.pollutants.so2} 
                  unit="µg/m³" 
                  limit={pollutantLimits.so2} 
                />
                <PollutantCard 
                  name="CO" 
                  value={ward.pollutants.co} 
                  unit="mg/m³" 
                  limit={pollutantLimits.co} 
                />
                <PollutantCard 
                  name="O₃" 
                  value={ward.pollutants.o3} 
                  unit="µg/m³" 
                  limit={pollutantLimits.o3} 
                />
              </div>
            </motion.div>

            {/* Dominant Pollution Source */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-xl bg-card border border-border/50 p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Factory className="w-5 h-5 text-primary" />
                <h2 className="font-display font-semibold text-foreground">Dominant Pollution Source</h2>
              </div>
              <div 
                className="p-4 rounded-lg border-2 border-dashed"
                style={{ borderColor: `${color}50`, backgroundColor: `${color}10` }}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="p-3 rounded-full"
                    style={{ backgroundColor: `${color}20` }}
                  >
                    {ward.dominantSource === 'Vehicular' && <Car className="w-6 h-6" style={{ color }} />}
                    {ward.dominantSource === 'Industrial' && <Factory className="w-6 h-6" style={{ color }} />}
                    {ward.dominantSource === 'Construction' && <Factory className="w-6 h-6" style={{ color }} />}
                    {!['Vehicular', 'Industrial', 'Construction'].includes(ward.dominantSource) && (
                      <Wind className="w-6 h-6" style={{ color }} />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-display font-semibold text-foreground">
                      {ward.dominantSource}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Primary contributor to local air pollution
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Action Recommendations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-xl bg-card border border-border/50 p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="w-5 h-5 text-primary" />
                <h2 className="font-display font-semibold text-foreground">Recommended Actions</h2>
              </div>
              <div className="space-y-3">
                {recommendations.map((rec, index) => {
                  const Icon = rec.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30"
                    >
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Icon className="w-4 h-4 text-primary" />
                      </div>
                      <p className="text-sm text-foreground">{rec.text}</p>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Health Advisory */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <HealthAdvisoryCard category={ward.category} />
            </motion.div>

            {/* Comparison with City */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-xl bg-card border border-border/50 p-6"
            >
              <h3 className="font-display font-semibold text-foreground mb-4">Comparison with City</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{ward.name} AQI</span>
                  <span className="text-lg font-bold" style={{ color: getAQIColor(ward.category) }}>
                    {ward.aqi}
                  </span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden relative">
                  <motion.div
                    className="absolute h-full rounded-full"
                    style={{ backgroundColor: getAQIColor(ward.category) }}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((ward.aqi / 500) * 100, 100)}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{city.name} Avg AQI</span>
                  <span className="text-lg font-bold" style={{ color: getAQIColor(city.category) }}>
                    {city.aqi}
                  </span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden relative">
                  <motion.div
                    className="absolute h-full rounded-full"
                    style={{ backgroundColor: getAQIColor(city.category) }}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((city.aqi / 500) * 100, 100)}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                  />
                </div>
                
                <div className={cn(
                  'text-sm p-3 rounded-lg',
                  ward.aqi > city.aqi ? 'bg-danger/10 text-danger' : 'bg-success/10 text-success'
                )}>
                  {ward.aqi > city.aqi 
                    ? `${Math.round(((ward.aqi - city.aqi) / city.aqi) * 100)}% worse than city average`
                    : `${Math.round(((city.aqi - ward.aqi) / city.aqi) * 100)}% better than city average`
                  }
                </div>
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="rounded-xl bg-card border border-border/50 p-6"
            >
              <h3 className="font-display font-semibold text-foreground mb-4">Quick Links</h3>
              <div className="space-y-2">
                <Link 
                  to={`/city/${city.id}`}
                  className="block p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors text-sm text-foreground"
                >
                  View all {city.name} wards →
                </Link>
                <Link 
                  to="/"
                  className="block p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors text-sm text-foreground"
                >
                  Back to national dashboard →
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WardDetail;
