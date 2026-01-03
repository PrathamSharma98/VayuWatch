import { motion } from 'framer-motion';
import { AlertTriangle, Bell, Clock, MapPin } from 'lucide-react';
import { Header } from '@/components/Header';
import { AQIBadge } from '@/components/AQIBadge';
import { statesData, getAllCities, getAQIColor } from '@/data/pollutionData';

const Alerts = () => {
  const allCities = getAllCities();
  const severeCities = allCities.filter(c => c.category === 'severe' || c.category === 'very-poor');
  const poorCities = allCities.filter(c => c.category === 'poor');

  const alerts = [
    ...severeCities.map(city => ({
      id: city.id,
      type: 'severe' as const,
      title: `Severe Air Quality Alert - ${city.name}`,
      description: `AQI has reached ${city.aqi}. Emergency measures recommended.`,
      location: `${city.name}, ${city.state}`,
      time: '10 mins ago',
      aqi: city.aqi,
      category: city.category,
    })),
    ...poorCities.map(city => ({
      id: city.id,
      type: 'warning' as const,
      title: `Poor Air Quality Warning - ${city.name}`,
      description: `AQI is ${city.aqi}. Sensitive groups should limit outdoor exposure.`,
      location: `${city.name}, ${city.state}`,
      time: '25 mins ago',
      aqi: city.aqi,
      category: city.category,
    })),
  ].sort((a, b) => b.aqi - a.aqi);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center gap-2 mb-2">
            <Bell className="w-6 h-6 text-primary" />
            <h1 className="text-2xl lg:text-3xl font-display font-bold text-foreground">
              Air Quality Alerts
            </h1>
          </div>
          <p className="text-muted-foreground">
            Real-time alerts for poor and severe air quality conditions across India
          </p>
        </motion.div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-4 rounded-xl bg-danger/10 border border-danger/30"
          >
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-danger" />
              <span className="font-medium text-danger">Severe Alerts</span>
            </div>
            <p className="text-3xl font-display font-bold text-danger">{severeCities.length}</p>
            <p className="text-sm text-muted-foreground">Cities with AQI &gt; 300</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-4 rounded-xl bg-warning/10 border border-warning/30"
          >
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-warning" />
              <span className="font-medium text-warning">Warnings</span>
            </div>
            <p className="text-3xl font-display font-bold text-warning">{poorCities.length}</p>
            <p className="text-sm text-muted-foreground">Cities with AQI 201-300</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-4 rounded-xl bg-card border border-border/50"
          >
            <div className="flex items-center gap-2 mb-2">
              <Bell className="w-5 h-5 text-primary" />
              <span className="font-medium text-foreground">Total Alerts</span>
            </div>
            <p className="text-3xl font-display font-bold text-foreground">{alerts.length}</p>
            <p className="text-sm text-muted-foreground">Active alerts</p>
          </motion.div>
        </div>

        {/* Alert List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-xl bg-card border border-border/50 overflow-hidden"
        >
          <div className="p-4 border-b border-border/50">
            <h2 className="font-display font-semibold text-foreground">Active Alerts</h2>
          </div>
          
          <div className="divide-y divide-border/50">
            {alerts.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No active alerts at this time
              </div>
            ) : (
              alerts.map((alert, index) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 hover:bg-secondary/30 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div 
                      className="p-2 rounded-lg"
                      style={{ 
                        backgroundColor: `${getAQIColor(alert.category)}20`,
                      }}
                    >
                      <AlertTriangle 
                        className="w-5 h-5" 
                        style={{ color: getAQIColor(alert.category) }}
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-foreground">{alert.title}</h3>
                        <AQIBadge category={alert.category} size="sm" />
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{alert.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span>{alert.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{alert.time}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div 
                      className="text-2xl font-display font-bold"
                      style={{ color: getAQIColor(alert.category) }}
                    >
                      {alert.aqi}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Alerts;
