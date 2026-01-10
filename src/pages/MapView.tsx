import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { Header } from '@/components/Header';
import { IndiaMap } from '@/components/IndiaMap';
import { AQIBadge } from '@/components/AQIBadge';
import { allIndiaStates } from '@/data/indiaStatesData';
import { State, City } from '@/data/pollutionData';
import { useNavigate } from 'react-router-dom';

const MapView = () => {
  const navigate = useNavigate();
  const [selectedState, setSelectedState] = useState<State | null>(null);

  const handleStateClick = (state: State | null) => {
    setSelectedState(state);
  };

  const handleCityClick = (city: City) => {
    navigate(`/city/${city.id}`);
  };

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
            <MapPin className="w-6 h-6 text-primary" />
            <h1 className="text-2xl lg:text-3xl font-display font-bold text-foreground">
              India AQI Map
            </h1>
          </div>
          <p className="text-muted-foreground">
            Interactive map showing real-time air quality across India. Click on states to drill down to cities. Covers all 28 States and 8 Union Territories.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Map */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-3 rounded-xl bg-card border border-border/50 overflow-hidden"
          >
            <IndiaMap
              onStateClick={handleStateClick}
              onCityClick={handleCityClick}
              selectedStateId={selectedState?.id}
              className="h-[500px] lg:h-[700px]"
            />
          </motion.div>

          {/* State/City List */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-xl bg-card border border-border/50 p-4 h-fit"
          >
            <h2 className="font-display font-semibold text-foreground mb-4">
              {selectedState ? `${selectedState.name} Cities` : 'States'}
            </h2>
            
            <div className="space-y-2 max-h-[600px] overflow-y-auto scrollbar-thin">
              {selectedState ? (
                // Show cities
                selectedState.cities.map((city) => (
                  <button
                    key={city.id}
                    onClick={() => navigate(`/city/${city.id}`)}
                    className="w-full flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors text-left"
                  >
                    <span className="font-medium text-foreground">{city.name}</span>
                    <AQIBadge category={city.category} size="sm" />
                  </button>
                ))
              ) : (
                // Show states
                allIndiaStates.map((state) => (
                  <button
                    key={state.id}
                    onClick={() => handleStateClick(state)}
                    className="w-full flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors text-left"
                  >
                    <div>
                      <span className="font-medium text-foreground">{state.name}</span>
                      <span className="text-xs text-muted-foreground ml-2">
                        ({state.cities.length} cities)
                      </span>
                    </div>
                    <AQIBadge category={state.category} size="sm" />
                  </button>
                ))
              )}
            </div>
            
            {selectedState && (
              <button
                onClick={() => setSelectedState(null)}
                className="w-full mt-4 p-2 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Back to all states
              </button>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default MapView;
