import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Cloud, 
  Sun, 
  CloudRain, 
  Wind, 
  Thermometer, 
  Droplets,
  Eye,
  Gauge
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface WeatherData {
  location: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  visibility: number;
  pressure: number;
  condition: string;
  description: string;
  timestamp: string;
}

// Simulated live weather data that updates every 30 seconds
const generateWeatherData = (): WeatherData => {
  const locations = [
    'Mumbai, India',
    'Chennai, India', 
    'Kochi, India',
    'Goa, India',
    'Andaman Islands'
  ];
  
  const conditions = [
    { condition: 'sunny', description: 'Clear skies', icon: Sun },
    { condition: 'cloudy', description: 'Partly cloudy', icon: Cloud },
    { condition: 'rainy', description: 'Light rain', icon: CloudRain }
  ];
  
  const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
  const baseTemp = 28;
  const tempVariation = (Math.random() - 0.5) * 8;
  
  return {
    location: locations[Math.floor(Math.random() * locations.length)],
    temperature: Math.round(baseTemp + tempVariation),
    humidity: Math.round(65 + (Math.random() - 0.5) * 30),
    windSpeed: Math.round(8 + Math.random() * 12),
    visibility: Math.round(8 + Math.random() * 7),
    pressure: Math.round(1013 + (Math.random() - 0.5) * 20),
    condition: randomCondition.condition,
    description: randomCondition.description,
    timestamp: new Date().toLocaleTimeString()
  };
};

const WeatherIcon = ({ condition }: { condition: string }) => {
  switch (condition) {
    case 'sunny':
      return <Sun className="w-8 h-8 text-yellow-500" />;
    case 'cloudy':
      return <Cloud className="w-8 h-8 text-gray-400" />;
    case 'rainy':
      return <CloudRain className="w-8 h-8 text-blue-500" />;
    default:
      return <Sun className="w-8 h-8 text-yellow-500" />;
  }
};

const WeatherWidget: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData>(generateWeatherData());
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setWeatherData(generateWeatherData());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getAirQualityColor = (humidity: number) => {
    if (humidity > 80) return 'text-red-500';
    if (humidity > 60) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <Card className="group hover:shadow-marine transition-all duration-500 transform hover:-translate-y-2">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Cloud className="w-5 h-5 text-accent" />
            Weather Monitor
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="marine-gradient text-white">
              Live
            </Badge>
            <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
          </div>
        </div>
        <CardDescription>Real-time coastal weather conditions</CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {/* Main Weather Display */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <WeatherIcon condition={weatherData.condition} />
              <div>
                <div className="text-2xl font-bold">{weatherData.temperature}°C</div>
                <div className="text-sm text-muted-foreground">{weatherData.description}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium">{weatherData.location}</div>
              <div className="text-xs text-muted-foreground">Updated: {weatherData.timestamp}</div>
            </div>
          </div>

          {/* Weather Metrics Grid */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
            <motion.div 
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
            >
              <Droplets className="w-4 h-4 text-blue-500" />
              <div>
                <div className="text-sm font-medium">{weatherData.humidity}%</div>
                <div className="text-xs text-muted-foreground">Humidity</div>
              </div>
            </motion.div>
            
            <motion.div 
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
            >
              <Wind className="w-4 h-4 text-green-500" />
              <div>
                <div className="text-sm font-medium">{weatherData.windSpeed} km/h</div>
                <div className="text-xs text-muted-foreground">Wind Speed</div>
              </div>
            </motion.div>
            
            <motion.div 
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
            >
              <Eye className="w-4 h-4 text-purple-500" />
              <div>
                <div className="text-sm font-medium">{weatherData.visibility} km</div>
                <div className="text-xs text-muted-foreground">Visibility</div>
              </div>
            </motion.div>
            
            <motion.div 
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
            >
              <Gauge className="w-4 h-4 text-orange-500" />
              <div>
                <div className="text-sm font-medium">{weatherData.pressure} hPa</div>
                <div className="text-xs text-muted-foreground">Pressure</div>
              </div>
            </motion.div>
          </div>

          {/* Air Quality Indicator */}
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <span className="text-sm text-muted-foreground">Air Quality</span>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${getAirQualityColor(weatherData.humidity).replace('text-', 'bg-')}`} />
              <span className={`text-sm font-medium ${getAirQualityColor(weatherData.humidity)}`}>
                {weatherData.humidity > 80 ? 'Poor' : weatherData.humidity > 60 ? 'Moderate' : 'Good'}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherWidget;
