// India Pollution Data - CPCB Standards
// AQI Categories: Good (0-50), Satisfactory (51-100), Moderate (101-200), Poor (201-300), Very Poor (301-400), Severe (401-500)

export type AQICategory = 'good' | 'satisfactory' | 'moderate' | 'poor' | 'very-poor' | 'severe';

export interface PollutantData {
  pm25: number;
  pm10: number;
  no2: number;
  so2: number;
  co: number;
  o3: number;
  nh3?: number;
  pb?: number;
}

export interface HealthAdvisory {
  general: string;
  sensitive: string;
  outdoor: string;
}

export interface Ward {
  id: string;
  name: string;
  aqi: number;
  category: AQICategory;
  pollutants: PollutantData;
  population: number;
  area: number; // sq km
  dominantSource: string;
  coordinates: [number, number];
}

export interface City {
  id: string;
  name: string;
  state: string;
  aqi: number;
  category: AQICategory;
  pollutants: PollutantData;
  population: number;
  wards: Ward[];
  coordinates: [number, number];
  stationCount: number;
  lastUpdated: string;
}

export interface State {
  id: string;
  name: string;
  code: string;
  aqi: number;
  category: AQICategory;
  cities: City[];
  coordinates: [number, number];
  population: number;
}

export const getAQICategory = (aqi: number): AQICategory => {
  if (aqi <= 50) return 'good';
  if (aqi <= 100) return 'satisfactory';
  if (aqi <= 200) return 'moderate';
  if (aqi <= 300) return 'poor';
  if (aqi <= 400) return 'very-poor';
  return 'severe';
};

export const getAQIColor = (category: AQICategory): string => {
  const colors: Record<AQICategory, string> = {
    'good': '#22c55e',
    'satisfactory': '#84cc16',
    'moderate': '#eab308',
    'poor': '#f97316',
    'very-poor': '#ef4444',
    'severe': '#7f1d1d',
  };
  return colors[category];
};

export const getAQILabel = (category: AQICategory): string => {
  const labels: Record<AQICategory, string> = {
    'good': 'Good',
    'satisfactory': 'Satisfactory',
    'moderate': 'Moderate',
    'poor': 'Poor',
    'very-poor': 'Very Poor',
    'severe': 'Severe',
  };
  return labels[category];
};

export const getHealthAdvisory = (category: AQICategory): HealthAdvisory => {
  const advisories: Record<AQICategory, HealthAdvisory> = {
    'good': {
      general: 'Air quality is satisfactory. Enjoy outdoor activities.',
      sensitive: 'No precautions needed for sensitive groups.',
      outdoor: 'Ideal conditions for all outdoor activities.',
    },
    'satisfactory': {
      general: 'Air quality is acceptable. Minor breathing discomfort possible for very sensitive people.',
      sensitive: 'People with respiratory issues should monitor symptoms.',
      outdoor: 'Outdoor activities are generally safe.',
    },
    'moderate': {
      general: 'May cause breathing discomfort to sensitive people.',
      sensitive: 'Children, elderly, and those with respiratory issues should limit outdoor exposure.',
      outdoor: 'Reduce prolonged outdoor exertion.',
    },
    'poor': {
      general: 'Breathing discomfort to most people on prolonged exposure.',
      sensitive: 'Avoid outdoor activities. Use N95 masks if going outside.',
      outdoor: 'Limit outdoor physical activities. Schools should restrict outdoor play.',
    },
    'very-poor': {
      general: 'Respiratory illness on prolonged exposure. Affects healthy people.',
      sensitive: 'Stay indoors. Use air purifiers. Seek medical attention if symptoms persist.',
      outdoor: 'Avoid all outdoor activities. Keep windows closed.',
    },
    'severe': {
      general: 'Health emergency. Serious health effects for everyone.',
      sensitive: 'Complete bed rest advised. Emergency measures required.',
      outdoor: 'All outdoor activities banned. GRAP Stage IV measures in effect.',
    },
  };
  return advisories[category];
};

export const pollutionSources = [
  { id: 'vehicular', name: 'Vehicular Emissions', icon: 'Car', percentage: 28 },
  { id: 'industrial', name: 'Industrial', icon: 'Factory', percentage: 24 },
  { id: 'construction', name: 'Construction Dust', icon: 'Construction', percentage: 18 },
  { id: 'waste', name: 'Waste Burning', icon: 'Flame', percentage: 12 },
  { id: 'stubble', name: 'Stubble Burning', icon: 'Wheat', percentage: 10 },
  { id: 'domestic', name: 'Domestic', icon: 'Home', percentage: 8 },
];

export const grapActions = [
  {
    stage: 1,
    trigger: 'AQI 201-300 (Poor)',
    actions: [
      'Intensify road sweeping and water sprinkling',
      'Strictly enforce dust control at construction sites',
      'Increase bus and metro frequency',
      'Advisory on avoiding diesel generators',
    ],
  },
  {
    stage: 2,
    trigger: 'AQI 301-400 (Very Poor)',
    actions: [
      'Stop use of coal and firewood',
      'Increase parking fees by 3-4 times',
      'Restrict diesel generator use except for essential services',
      'Encourage work from home',
    ],
  },
  {
    stage: 3,
    trigger: 'AQI 401-450 (Severe)',
    actions: [
      'Ban construction activities',
      'Stop entry of trucks except essential goods',
      'Consider odd-even scheme for vehicles',
      'Close brick kilns and hot mix plants',
    ],
  },
  {
    stage: 4,
    trigger: 'AQI >450 (Severe+)',
    actions: [
      'Stop all construction including highways',
      'Entry of trucks banned completely',
      'Schools shift to online mode',
      '50% staff work from home',
      'Emergency measures for power plants',
    ],
  },
];

// Indian States Data
export const statesData: State[] = [
  {
    id: 'delhi',
    name: 'Delhi',
    code: 'DL',
    aqi: 312,
    category: 'very-poor',
    coordinates: [77.1025, 28.7041],
    population: 19000000,
    cities: [
      {
        id: 'new-delhi',
        name: 'New Delhi',
        state: 'Delhi',
        aqi: 312,
        category: 'very-poor',
        pollutants: { pm25: 185, pm10: 298, no2: 78, so2: 18, co: 2.4, o3: 42, nh3: 28 },
        population: 19000000,
        coordinates: [77.2090, 28.6139],
        stationCount: 42,
        lastUpdated: new Date().toISOString(),
        wards: [
          { id: 'anand-vihar', name: 'Anand Vihar', aqi: 389, category: 'very-poor', pollutants: { pm25: 245, pm10: 380, no2: 92, so2: 22, co: 3.1, o3: 38 }, population: 125000, area: 4.2, dominantSource: 'Vehicular', coordinates: [77.3152, 28.6469] },
          { id: 'dwarka', name: 'Dwarka', aqi: 245, category: 'poor', pollutants: { pm25: 145, pm10: 228, no2: 58, so2: 14, co: 1.8, o3: 45 }, population: 280000, area: 22.8, dominantSource: 'Construction', coordinates: [77.0419, 28.5823] },
          { id: 'rohini', name: 'Rohini', aqi: 298, category: 'poor', pollutants: { pm25: 172, pm10: 265, no2: 68, so2: 16, co: 2.2, o3: 40 }, population: 450000, area: 28.5, dominantSource: 'Industrial', coordinates: [77.0688, 28.7495] },
          { id: 'ito', name: 'ITO', aqi: 342, category: 'very-poor', pollutants: { pm25: 198, pm10: 312, no2: 88, so2: 20, co: 2.8, o3: 35 }, population: 85000, area: 2.1, dominantSource: 'Vehicular', coordinates: [77.2373, 28.6289] },
          { id: 'mundka', name: 'Mundka', aqi: 356, category: 'very-poor', pollutants: { pm25: 212, pm10: 345, no2: 75, so2: 24, co: 2.6, o3: 32 }, population: 180000, area: 8.5, dominantSource: 'Industrial', coordinates: [77.0315, 28.6811] },
          { id: 'patparganj', name: 'Patparganj', aqi: 278, category: 'poor', pollutants: { pm25: 162, pm10: 248, no2: 65, so2: 15, co: 2.0, o3: 42 }, population: 220000, area: 12.3, dominantSource: 'Waste Burning', coordinates: [77.2940, 28.6155] },
        ],
      },
    ],
  },
  {
    id: 'maharashtra',
    name: 'Maharashtra',
    code: 'MH',
    aqi: 178,
    category: 'moderate',
    coordinates: [75.7139, 19.7515],
    population: 125000000,
    cities: [
      {
        id: 'mumbai',
        name: 'Mumbai',
        state: 'Maharashtra',
        aqi: 168,
        category: 'moderate',
        pollutants: { pm25: 92, pm10: 158, no2: 52, so2: 12, co: 1.6, o3: 48, nh3: 18 },
        population: 20700000,
        coordinates: [72.8777, 19.0760],
        stationCount: 28,
        lastUpdated: new Date().toISOString(),
        wards: [
          { id: 'bandra', name: 'Bandra', aqi: 145, category: 'moderate', pollutants: { pm25: 78, pm10: 135, no2: 45, so2: 10, co: 1.4, o3: 52 }, population: 380000, area: 18.5, dominantSource: 'Vehicular', coordinates: [72.8361, 19.0596] },
          { id: 'andheri', name: 'Andheri', aqi: 172, category: 'moderate', pollutants: { pm25: 95, pm10: 162, no2: 55, so2: 13, co: 1.7, o3: 46 }, population: 620000, area: 26.2, dominantSource: 'Industrial', coordinates: [72.8369, 19.1136] },
          { id: 'colaba', name: 'Colaba', aqi: 128, category: 'moderate', pollutants: { pm25: 68, pm10: 118, no2: 38, so2: 8, co: 1.2, o3: 58 }, population: 125000, area: 7.8, dominantSource: 'Vehicular', coordinates: [72.8258, 18.9067] },
          { id: 'worli', name: 'Worli', aqi: 156, category: 'moderate', pollutants: { pm25: 85, pm10: 145, no2: 48, so2: 11, co: 1.5, o3: 50 }, population: 280000, area: 12.4, dominantSource: 'Construction', coordinates: [72.8150, 19.0176] },
          { id: 'malad', name: 'Malad', aqi: 182, category: 'moderate', pollutants: { pm25: 102, pm10: 175, no2: 58, so2: 14, co: 1.8, o3: 44 }, population: 520000, area: 22.8, dominantSource: 'Industrial', coordinates: [72.8478, 19.1863] },
        ],
      },
      {
        id: 'pune',
        name: 'Pune',
        state: 'Maharashtra',
        aqi: 142,
        category: 'moderate',
        pollutants: { pm25: 78, pm10: 132, no2: 42, so2: 10, co: 1.4, o3: 52, nh3: 15 },
        population: 7400000,
        coordinates: [73.8567, 18.5204],
        stationCount: 12,
        lastUpdated: new Date().toISOString(),
        wards: [
          { id: 'shivaji-nagar', name: 'Shivaji Nagar', aqi: 152, category: 'moderate', pollutants: { pm25: 82, pm10: 142, no2: 48, so2: 12, co: 1.5, o3: 48 }, population: 185000, area: 8.2, dominantSource: 'Vehicular', coordinates: [73.8478, 18.5308] },
          { id: 'hinjewadi', name: 'Hinjewadi', aqi: 118, category: 'moderate', pollutants: { pm25: 62, pm10: 108, no2: 35, so2: 8, co: 1.1, o3: 56 }, population: 350000, area: 28.5, dominantSource: 'Construction', coordinates: [73.7378, 18.5912] },
        ],
      },
    ],
  },
  {
    id: 'karnataka',
    name: 'Karnataka',
    code: 'KA',
    aqi: 125,
    category: 'moderate',
    coordinates: [75.7139, 15.3173],
    population: 67000000,
    cities: [
      {
        id: 'bengaluru',
        name: 'Bengaluru',
        state: 'Karnataka',
        aqi: 125,
        category: 'moderate',
        pollutants: { pm25: 68, pm10: 115, no2: 38, so2: 9, co: 1.3, o3: 55, nh3: 12 },
        population: 12700000,
        coordinates: [77.5946, 12.9716],
        stationCount: 18,
        lastUpdated: new Date().toISOString(),
        wards: [
          { id: 'koramangala', name: 'Koramangala', aqi: 118, category: 'moderate', pollutants: { pm25: 62, pm10: 108, no2: 35, so2: 8, co: 1.2, o3: 58 }, population: 185000, area: 12.4, dominantSource: 'Vehicular', coordinates: [77.6269, 12.9352] },
          { id: 'whitefield', name: 'Whitefield', aqi: 135, category: 'moderate', pollutants: { pm25: 72, pm10: 125, no2: 42, so2: 10, co: 1.4, o3: 52 }, population: 420000, area: 35.2, dominantSource: 'Construction', coordinates: [77.7510, 12.9698] },
          { id: 'jayanagar', name: 'Jayanagar', aqi: 108, category: 'moderate', pollutants: { pm25: 58, pm10: 98, no2: 32, so2: 7, co: 1.1, o3: 60 }, population: 165000, area: 8.8, dominantSource: 'Vehicular', coordinates: [77.5820, 12.9308] },
          { id: 'electronic-city', name: 'Electronic City', aqi: 122, category: 'moderate', pollutants: { pm25: 65, pm10: 112, no2: 38, so2: 9, co: 1.3, o3: 55 }, population: 280000, area: 28.5, dominantSource: 'Industrial', coordinates: [77.6760, 12.8456] },
        ],
      },
    ],
  },
  {
    id: 'tamil-nadu',
    name: 'Tamil Nadu',
    code: 'TN',
    aqi: 98,
    category: 'satisfactory',
    coordinates: [78.6569, 11.1271],
    population: 77000000,
    cities: [
      {
        id: 'chennai',
        name: 'Chennai',
        state: 'Tamil Nadu',
        aqi: 98,
        category: 'satisfactory',
        pollutants: { pm25: 52, pm10: 88, no2: 32, so2: 8, co: 1.0, o3: 58, nh3: 10 },
        population: 11000000,
        coordinates: [80.2707, 13.0827],
        stationCount: 14,
        lastUpdated: new Date().toISOString(),
        wards: [
          { id: 't-nagar', name: 'T. Nagar', aqi: 105, category: 'moderate', pollutants: { pm25: 56, pm10: 95, no2: 35, so2: 9, co: 1.1, o3: 55 }, population: 225000, area: 6.8, dominantSource: 'Vehicular', coordinates: [80.2339, 13.0418] },
          { id: 'adyar', name: 'Adyar', aqi: 85, category: 'satisfactory', pollutants: { pm25: 45, pm10: 78, no2: 28, so2: 6, co: 0.9, o3: 62 }, population: 180000, area: 12.5, dominantSource: 'Vehicular', coordinates: [80.2574, 13.0067] },
          { id: 'velachery', name: 'Velachery', aqi: 112, category: 'moderate', pollutants: { pm25: 60, pm10: 102, no2: 38, so2: 10, co: 1.2, o3: 52 }, population: 320000, area: 15.2, dominantSource: 'Construction', coordinates: [80.2180, 12.9815] },
          { id: 'anna-nagar', name: 'Anna Nagar', aqi: 92, category: 'satisfactory', pollutants: { pm25: 48, pm10: 82, no2: 30, so2: 7, co: 1.0, o3: 58 }, population: 285000, area: 18.4, dominantSource: 'Vehicular', coordinates: [80.2090, 13.0850] },
        ],
      },
    ],
  },
  {
    id: 'uttar-pradesh',
    name: 'Uttar Pradesh',
    code: 'UP',
    aqi: 285,
    category: 'poor',
    coordinates: [80.9462, 26.8467],
    population: 235000000,
    cities: [
      {
        id: 'lucknow',
        name: 'Lucknow',
        state: 'Uttar Pradesh',
        aqi: 268,
        category: 'poor',
        pollutants: { pm25: 158, pm10: 245, no2: 62, so2: 15, co: 2.0, o3: 42, nh3: 22 },
        population: 3600000,
        coordinates: [80.9462, 26.8467],
        stationCount: 8,
        lastUpdated: new Date().toISOString(),
        wards: [
          { id: 'gomti-nagar', name: 'Gomti Nagar', aqi: 245, category: 'poor', pollutants: { pm25: 142, pm10: 225, no2: 55, so2: 13, co: 1.8, o3: 45 }, population: 185000, area: 22.5, dominantSource: 'Construction', coordinates: [81.0098, 26.8508] },
          { id: 'hazratganj', name: 'Hazratganj', aqi: 278, category: 'poor', pollutants: { pm25: 165, pm10: 258, no2: 68, so2: 16, co: 2.2, o3: 40 }, population: 125000, area: 4.8, dominantSource: 'Vehicular', coordinates: [80.9537, 26.8530] },
          { id: 'indira-nagar', name: 'Indira Nagar', aqi: 258, category: 'poor', pollutants: { pm25: 152, pm10: 238, no2: 60, so2: 14, co: 1.9, o3: 43 }, population: 145000, area: 8.2, dominantSource: 'Vehicular', coordinates: [80.9925, 26.8779] },
        ],
      },
      {
        id: 'noida',
        name: 'Noida',
        state: 'Uttar Pradesh',
        aqi: 298,
        category: 'poor',
        pollutants: { pm25: 175, pm10: 278, no2: 72, so2: 18, co: 2.3, o3: 38, nh3: 25 },
        population: 640000,
        coordinates: [77.3910, 28.5355],
        stationCount: 6,
        lastUpdated: new Date().toISOString(),
        wards: [
          { id: 'sector-62', name: 'Sector 62', aqi: 285, category: 'poor', pollutants: { pm25: 168, pm10: 265, no2: 68, so2: 16, co: 2.1, o3: 40 }, population: 85000, area: 12.5, dominantSource: 'Industrial', coordinates: [77.3667, 28.6265] },
          { id: 'sector-18', name: 'Sector 18', aqi: 312, category: 'very-poor', pollutants: { pm25: 188, pm10: 295, no2: 78, so2: 20, co: 2.5, o3: 35 }, population: 125000, area: 8.8, dominantSource: 'Vehicular', coordinates: [77.3252, 28.5706] },
          { id: 'greater-noida', name: 'Greater Noida', aqi: 265, category: 'poor', pollutants: { pm25: 155, pm10: 248, no2: 62, so2: 15, co: 1.9, o3: 42 }, population: 180000, area: 35.2, dominantSource: 'Construction', coordinates: [77.5011, 28.4744] },
        ],
      },
    ],
  },
  {
    id: 'west-bengal',
    name: 'West Bengal',
    code: 'WB',
    aqi: 198,
    category: 'moderate',
    coordinates: [87.8550, 22.9868],
    population: 99000000,
    cities: [
      {
        id: 'kolkata',
        name: 'Kolkata',
        state: 'West Bengal',
        aqi: 198,
        category: 'moderate',
        pollutants: { pm25: 112, pm10: 185, no2: 58, so2: 14, co: 1.8, o3: 45, nh3: 20 },
        population: 14900000,
        coordinates: [88.3639, 22.5726],
        stationCount: 16,
        lastUpdated: new Date().toISOString(),
        wards: [
          { id: 'salt-lake', name: 'Salt Lake', aqi: 175, category: 'moderate', pollutants: { pm25: 95, pm10: 162, no2: 48, so2: 11, co: 1.5, o3: 50 }, population: 285000, area: 28.5, dominantSource: 'Vehicular', coordinates: [88.4098, 22.5958] },
          { id: 'howrah', name: 'Howrah', aqi: 225, category: 'poor', pollutants: { pm25: 132, pm10: 212, no2: 68, so2: 18, co: 2.2, o3: 38 }, population: 520000, area: 18.2, dominantSource: 'Industrial', coordinates: [88.2636, 22.5958] },
          { id: 'park-street', name: 'Park Street', aqi: 185, category: 'moderate', pollutants: { pm25: 102, pm10: 172, no2: 55, so2: 13, co: 1.7, o3: 46 }, population: 145000, area: 4.5, dominantSource: 'Vehicular', coordinates: [88.3521, 22.5528] },
        ],
      },
    ],
  },
  {
    id: 'rajasthan',
    name: 'Rajasthan',
    code: 'RJ',
    aqi: 165,
    category: 'moderate',
    coordinates: [74.2179, 27.0238],
    population: 81000000,
    cities: [
      {
        id: 'jaipur',
        name: 'Jaipur',
        state: 'Rajasthan',
        aqi: 165,
        category: 'moderate',
        pollutants: { pm25: 88, pm10: 155, no2: 45, so2: 11, co: 1.5, o3: 50, nh3: 15 },
        population: 4100000,
        coordinates: [75.7873, 26.9124],
        stationCount: 8,
        lastUpdated: new Date().toISOString(),
        wards: [
          { id: 'malviya-nagar', name: 'Malviya Nagar', aqi: 155, category: 'moderate', pollutants: { pm25: 82, pm10: 145, no2: 42, so2: 10, co: 1.4, o3: 52 }, population: 165000, area: 12.8, dominantSource: 'Vehicular', coordinates: [75.8106, 26.8575] },
          { id: 'vaishali-nagar', name: 'Vaishali Nagar', aqi: 172, category: 'moderate', pollutants: { pm25: 95, pm10: 162, no2: 48, so2: 12, co: 1.6, o3: 48 }, population: 185000, area: 15.2, dominantSource: 'Construction', coordinates: [75.7340, 26.9167] },
        ],
      },
    ],
  },
  {
    id: 'gujarat',
    name: 'Gujarat',
    code: 'GJ',
    aqi: 145,
    category: 'moderate',
    coordinates: [71.1924, 22.2587],
    population: 70000000,
    cities: [
      {
        id: 'ahmedabad',
        name: 'Ahmedabad',
        state: 'Gujarat',
        aqi: 145,
        category: 'moderate',
        pollutants: { pm25: 78, pm10: 135, no2: 42, so2: 10, co: 1.4, o3: 52, nh3: 14 },
        population: 8200000,
        coordinates: [72.5714, 23.0225],
        stationCount: 10,
        lastUpdated: new Date().toISOString(),
        wards: [
          { id: 'satellite', name: 'Satellite', aqi: 135, category: 'moderate', pollutants: { pm25: 72, pm10: 125, no2: 38, so2: 9, co: 1.3, o3: 55 }, population: 245000, area: 18.5, dominantSource: 'Vehicular', coordinates: [72.5110, 23.0272] },
          { id: 'naranpura', name: 'Naranpura', aqi: 152, category: 'moderate', pollutants: { pm25: 82, pm10: 142, no2: 45, so2: 11, co: 1.5, o3: 50 }, population: 178000, area: 12.2, dominantSource: 'Industrial', coordinates: [72.5544, 23.0527] },
        ],
      },
    ],
  },
];

// Get all cities across all states
export const getAllCities = (): City[] => {
  return statesData.flatMap(state => state.cities);
};

// Get top polluted cities
export const getTopPollutedCities = (limit: number = 10): City[] => {
  return getAllCities()
    .sort((a, b) => b.aqi - a.aqi)
    .slice(0, limit);
};

// Get city by ID
export const getCityById = (cityId: string): City | undefined => {
  return getAllCities().find(city => city.id === cityId);
};

// Get state by ID
export const getStateById = (stateId: string): State | undefined => {
  return statesData.find(state => state.id === stateId);
};

// Get ward by ID
export const getWardById = (wardId: string): { ward: Ward; city: City; state: State } | undefined => {
  for (const state of statesData) {
    for (const city of state.cities) {
      const ward = city.wards.find(w => w.id === wardId);
      if (ward) {
        return { ward, city, state };
      }
    }
  }
  return undefined;
};

// National statistics
export const getNationalStats = () => {
  const allCities = getAllCities();
  const totalAqi = allCities.reduce((sum, city) => sum + city.aqi, 0);
  const avgAqi = Math.round(totalAqi / allCities.length);
  
  const categoryCounts = allCities.reduce((acc, city) => {
    acc[city.category] = (acc[city.category] || 0) + 1;
    return acc;
  }, {} as Record<AQICategory, number>);

  return {
    averageAqi: avgAqi,
    category: getAQICategory(avgAqi),
    totalCities: allCities.length,
    totalStates: statesData.length,
    categoryCounts,
    worstCity: allCities.reduce((worst, city) => city.aqi > worst.aqi ? city : worst),
    bestCity: allCities.reduce((best, city) => city.aqi < best.aqi ? city : best),
  };
};

// Hourly trend data (mock)
export const getHourlyTrend = (cityId: string): { hour: string; aqi: number }[] => {
  const baseAqi = getCityById(cityId)?.aqi || 150;
  const hours = [];
  for (let i = 0; i < 24; i++) {
    const variation = Math.sin((i / 24) * Math.PI * 2) * 30 + (Math.random() - 0.5) * 20;
    hours.push({
      hour: `${i.toString().padStart(2, '0')}:00`,
      aqi: Math.max(0, Math.round(baseAqi + variation)),
    });
  }
  return hours;
};

// Weekly trend data (mock)
export const getWeeklyTrend = (cityId: string): { day: string; aqi: number }[] => {
  const baseAqi = getCityById(cityId)?.aqi || 150;
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map((day, i) => ({
    day,
    aqi: Math.max(0, Math.round(baseAqi + (Math.random() - 0.5) * 50)),
  }));
};
