import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { statesData, getAQIColor, State, City } from '@/data/pollutionData';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface IndiaMapProps {
  onStateClick?: (state: State) => void;
  onCityClick?: (city: City) => void;
  selectedStateId?: string;
  className?: string;
}

export function IndiaMap({ onStateClick, onCityClick, selectedStateId, className }: IndiaMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const [isTokenSet, setIsTokenSet] = useState(false);
  const [inputToken, setInputToken] = useState('');

  const initializeMap = (token: string) => {
    if (!mapContainer.current || map.current) return;

    mapboxgl.accessToken = token;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [78.9629, 22.5937], // Center of India
      zoom: 4,
      minZoom: 3,
      maxZoom: 12,
    });

    map.current.addControl(
      new mapboxgl.NavigationControl({ visualizePitch: false }),
      'top-right'
    );

    map.current.on('load', () => {
      addMarkers();
    });
  };

  const addMarkers = () => {
    if (!map.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    const statesToShow = selectedStateId 
      ? statesData.filter(s => s.id === selectedStateId)
      : statesData;

    statesToShow.forEach(state => {
      if (selectedStateId) {
        // Show cities when a state is selected
        state.cities.forEach(city => {
          const color = getAQIColor(city.category);
          
          const el = document.createElement('div');
          el.className = 'city-marker';
          el.innerHTML = `
            <div class="relative cursor-pointer group">
              <div class="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg transition-transform group-hover:scale-110" 
                   style="background-color: ${color}; box-shadow: 0 0 15px ${color}80;">
                ${city.aqi}
              </div>
              <div class="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-medium text-white bg-black/70 px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                ${city.name}
              </div>
            </div>
          `;
          
          const marker = new mapboxgl.Marker(el)
            .setLngLat(city.coordinates)
            .addTo(map.current!);
          
          el.addEventListener('click', () => {
            onCityClick?.(city);
          });
          
          markersRef.current.push(marker);
        });
      } else {
        // Show states
        const color = getAQIColor(state.category);
        
        const el = document.createElement('div');
        el.className = 'state-marker';
        el.innerHTML = `
          <div class="relative cursor-pointer group">
            <div class="w-14 h-14 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-lg transition-transform group-hover:scale-110" 
                 style="background-color: ${color}; box-shadow: 0 0 20px ${color}80;">
              ${state.aqi}
            </div>
            <div class="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-medium text-white bg-black/70 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
              ${state.name}
            </div>
          </div>
        `;
        
        const marker = new mapboxgl.Marker(el)
          .setLngLat(state.coordinates)
          .addTo(map.current!);
        
        el.addEventListener('click', () => {
          onStateClick?.(state);
          if (map.current) {
            map.current.flyTo({
              center: state.coordinates,
              zoom: 7,
              duration: 1500,
            });
          }
        });
        
        markersRef.current.push(marker);
      }
    });
  };

  useEffect(() => {
    if (isTokenSet && mapboxToken) {
      initializeMap(mapboxToken);
    }

    return () => {
      markersRef.current.forEach(marker => marker.remove());
      map.current?.remove();
      map.current = null;
    };
  }, [isTokenSet, mapboxToken]);

  useEffect(() => {
    if (map.current && map.current.isStyleLoaded()) {
      addMarkers();
      
      if (!selectedStateId && map.current) {
        map.current.flyTo({
          center: [78.9629, 22.5937],
          zoom: 4,
          duration: 1500,
        });
      }
    }
  }, [selectedStateId]);

  const handleTokenSubmit = () => {
    if (inputToken.trim()) {
      setMapboxToken(inputToken.trim());
      setIsTokenSet(true);
    }
  };

  if (!isTokenSet) {
    return (
      <div className={cn('flex flex-col items-center justify-center p-8 rounded-xl bg-card border border-border/50', className)}>
        <div className="text-center max-w-md">
          <h3 className="font-display font-semibold text-foreground mb-2">Mapbox Token Required</h3>
          <p className="text-sm text-muted-foreground mb-4">
            To display the interactive map, please enter your Mapbox public token. 
            Get one free at{' '}
            <a 
              href="https://mapbox.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              mapbox.com
            </a>
          </p>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Enter Mapbox public token"
              value={inputToken}
              onChange={(e) => setInputToken(e.target.value)}
              className="flex-1"
              onKeyDown={(e) => e.key === 'Enter' && handleTokenSubmit()}
            />
            <Button onClick={handleTokenSubmit} disabled={!inputToken.trim()}>
              Load Map
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('relative rounded-xl overflow-hidden', className)}>
      <div ref={mapContainer} className="w-full h-full min-h-[400px]" />
      
      {/* AQI Legend */}
      <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm border border-border/50 rounded-lg p-3">
        <p className="text-xs font-medium text-muted-foreground mb-2">AQI Scale (CPCB)</p>
        <div className="flex gap-1">
          {[
            { label: 'Good', color: 'bg-aqi-good' },
            { label: 'Satisfactory', color: 'bg-aqi-satisfactory' },
            { label: 'Moderate', color: 'bg-aqi-moderate' },
            { label: 'Poor', color: 'bg-aqi-poor' },
            { label: 'Very Poor', color: 'bg-aqi-very-poor' },
            { label: 'Severe', color: 'bg-aqi-severe' },
          ].map((item) => (
            <div key={item.label} className="flex flex-col items-center">
              <div className={cn('w-6 h-3 rounded-sm', item.color)} />
              <span className="text-[10px] text-muted-foreground mt-1 hidden lg:block">
                {item.label.split(' ')[0]}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      {selectedStateId && (
        <Button
          variant="secondary"
          size="sm"
          className="absolute top-4 left-4"
          onClick={() => {
            onStateClick?.(undefined as any);
          }}
        >
          ← Back to India
        </Button>
      )}
    </div>
  );
}
