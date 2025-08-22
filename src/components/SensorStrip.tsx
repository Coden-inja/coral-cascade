import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Gauge, 
  Radio, 
  Trash2, 
  AlertTriangle, 
  CheckCircle, 
  Download,
  RefreshCw,
  Wifi,
  WifiOff
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';

const SensorGauge = ({ value, maxValue, label, unit, color, isOnline }) => {
  const percentage = Math.min((value / maxValue) * 100, 100);
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-32 h-32 flex items-center justify-center">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth="6"
        />
        {/* Progress circle */}
        <motion.circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke={`hsl(var(--${color}))`}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className={isOnline ? 'opacity-100' : 'opacity-50'}
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.div 
          className={`text-2xl font-bold text-${color}`}
          key={value}
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {value.toFixed(1)}
        </motion.div>
        <div className="text-xs text-muted-foreground">{unit}</div>
        <div className="text-xs font-medium mt-1">{label}</div>
      </div>
      
      {/* Online indicator */}
      <div className="absolute -top-2 -right-2">
        {isOnline ? (
          <div className="w-4 h-4 bg-accent rounded-full animate-pulse-marine" />
        ) : (
          <div className="w-4 h-4 bg-destructive rounded-full" />
        )}
      </div>
    </div>
  );
};

const SensorCard = ({ sensor, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentValue, setCurrentValue] = useState(sensor.currentValue);

  useEffect(() => {
    if (sensor.isOnline) {
      const interval = setInterval(() => {
        const variation = (Math.random() - 0.5) * 2;
        setCurrentValue(prev => 
          Math.max(0, Math.min(sensor.maxValue, prev + variation))
        );
      }, 3000);
      
      return () => clearInterval(interval);
    }
  }, [sensor.isOnline, sensor.maxValue]);

  const getStatusColor = () => {
    if (!sensor.isOnline) return 'destructive';
    if (currentValue > sensor.maxValue * 0.8) return 'destructive';
    if (currentValue > sensor.maxValue * 0.6) return 'secondary';
    return 'accent';
  };

  const getStatusText = () => {
    if (!sensor.isOnline) return 'Offline';
    if (currentValue > sensor.maxValue * 0.8) return 'Critical';
    if (currentValue > sensor.maxValue * 0.6) return 'Warning';
    return 'Normal';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, rotateY: -15 }}
      whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
      transition={{ 
        duration: 0.8, 
        delay: index * 0.2,
        type: "spring",
        stiffness: 100
      }}
      viewport={{ once: true }}
      className="group perspective-1000"
    >
      <Card className="hover:shadow-marine transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 group-hover:shadow-depth">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <sensor.icon className="w-5 h-5 text-primary" />
              {sensor.name}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge 
                variant="outline"
                className={`${getStatusColor()}-gradient text-white`}
              >
                {sensor.isOnline ? <Wifi className="w-3 h-3 mr-1" /> : <WifiOff className="w-3 h-3 mr-1" />}
                {getStatusText()}
              </Badge>
            </div>
          </div>
          <CardDescription className="flex items-center gap-2">
            {sensor.location}
            <Badge variant="secondary" className="text-xs">
              {sensor.type}
            </Badge>
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="flex justify-center mb-6">
            <SensorGauge
              value={currentValue}
              maxValue={sensor.maxValue}
              label={sensor.name}
              unit={sensor.unit}
              color={getStatusColor()}
              isOnline={sensor.isOnline}
            />
          </div>

          <div className="space-y-4">
            {/* Recent readings */}
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">24h Average</div>
                <div className="font-semibold">{sensor.average24h} {sensor.unit}</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Peak Today</div>
                <div className="font-semibold">{sensor.peakToday} {sensor.unit}</div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex justify-between items-center pt-4 border-t border-border">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => setIsExpanded(!isExpanded)}
                className="hover:bg-primary/10"
              >
                {isExpanded ? 'Less' : 'More'} Details
              </Button>
              
              <div className="flex gap-2">
                <Button size="sm" variant="ghost">
                  <RefreshCw className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-3 pt-4 border-t border-border"
                >
                  <div className="text-sm">
                    <div className="font-semibold mb-2">Sensor Health</div>
                    <Progress value={sensor.isOnline ? 95 : 0} className="mb-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Battery: {sensor.isOnline ? '87%' : 'N/A'}</span>
                      <span>Signal: {sensor.isOnline ? 'Strong' : 'None'}</span>
                    </div>
                  </div>
                  
                  <div className="text-sm">
                    <div className="font-semibold mb-2">Last Updated</div>
                    <div className="text-muted-foreground">
                      {sensor.isOnline ? 'Just now' : '2 hours ago'}
                    </div>
                  </div>
                  
                  <Button size="sm" className="w-full coral-gradient text-white">
                    View Historical Data
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const CSVDataToggle = ({ onToggle, isEnabled }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    whileInView={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.6 }}
    viewport={{ once: true }}
  >
    <Card className="glass-algae shadow-algae">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h3 className="font-semibold flex items-center gap-2">
              <Download className="w-5 h-5 text-accent" />
              Fallback CSV Data
            </h3>
            <p className="text-sm text-muted-foreground">
              Enable offline CSV data when sensors are unavailable
            </p>
          </div>
          <Switch 
            checked={isEnabled}
            onCheckedChange={onToggle}
            className="data-[state=checked]:bg-accent"
          />
        </div>
        
        {isEnabled && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 pt-4 border-t border-border"
          >
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                Export Current
              </Button>
              <Button size="sm" variant="outline" className="flex-1">
                <RefreshCw className="w-4 h-4 mr-2" />
                Import CSV
              </Button>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  </motion.div>
);

const SensorStrip = () => {
  const [csvMode, setCsvMode] = useState(false);
  
  const sensors = [
    {
      id: 1,
      name: 'LPG Sensor',
      type: 'Gas Detection',
      location: 'Mumbai Port Area',
      currentValue: 2.3,
      maxValue: 10,
      unit: 'ppm',
      average24h: 1.8,
      peakToday: 3.1,
      isOnline: true,
      icon: Gauge
    },
    {
      id: 2,
      name: 'Seashore Rover',
      type: 'Ocean Monitoring',
      location: 'Andaman Islands',
      currentValue: 7.8,
      maxValue: 14,
      unit: 'pH',
      average24h: 7.6,
      peakToday: 8.2,
      isOnline: true,
      icon: Radio
    },
    {
      id: 3,
      name: 'Plastic Counter',
      type: 'Waste Detection',
      location: 'Goa Beaches',
      currentValue: 145,
      maxValue: 1000,
      unit: 'items/m²',
      average24h: 132,
      peakToday: 198,
      isOnline: false,
      icon: Trash2
    }
  ];

  return (
    <section className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl font-bold mb-4">
          Live <span className="text-primary">Sensor Data</span>
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Real-time environmental monitoring through our network of IoT sensors across India
        </p>
      </motion.div>

      {/* Sensor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {sensors.map((sensor, index) => (
          <SensorCard key={sensor.id} sensor={sensor} index={index} />
        ))}
      </div>

      {/* CSV Data Toggle */}
      <div className="max-w-md mx-auto mb-8">
        <CSVDataToggle 
          isEnabled={csvMode}
          onToggle={setCsvMode}
        />
      </div>

      {/* Network Status */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center"
      >
        <Card className="marine-gradient text-white max-w-2xl mx-auto">
          <CardContent className="p-6">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>2 Sensors Online</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                <span>1 Sensor Offline</span>
              </div>
            </div>
            <p className="text-sm opacity-90 mb-4">
              Network Status: 67% operational. Automatic failover to CSV data enabled.
            </p>
            <Button 
              variant="outline" 
              className="bg-white text-primary hover:bg-white/90"
            >
              View Network Dashboard
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </section>
  );
};

export default SensorStrip;