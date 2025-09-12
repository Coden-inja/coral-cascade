import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box } from '@react-three/drei';
import Earth3D from './Earth3D';
import EarthModal from './EarthModal';
import ForestHeatmap from '@/components/ui/forest-heatmap';
import ForestMapModal from './ForestMapModal';
import WeatherWidget from './WeatherWidget';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TreePine, Waves, Globe, Gauge } from 'lucide-react';

// Mock data for charts
const forestData = [
  { month: 'Jan', deforestation: 23, reforestation: 45 },
  { month: 'Feb', deforestation: 18, reforestation: 52 },
  { month: 'Mar', deforestation: 31, reforestation: 38 },
  { month: 'Apr', deforestation: 15, reforestation: 61 },
  { month: 'May', deforestation: 28, reforestation: 42 },
  { month: 'Jun', deforestation: 12, reforestation: 68 }
];

const ozoneData = [
  { time: '00:00', level: 0.32 },
  { time: '04:00', level: 0.28 },
  { time: '08:00', level: 0.35 },
  { time: '12:00', level: 0.42 },
  { time: '16:00', level: 0.38 },
  { time: '20:00', level: 0.29 }
];

const RotatingCube = () => (
  <mesh rotation={[0, 0, 0]}>
    <Box args={[2, 2, 2]}>
      <meshStandardMaterial 
        color="#FF5F45" 
        transparent 
        opacity={0.8}
        emissive="#FF5F45"
        emissiveIntensity={0.2}
      />
    </Box>
  </mesh>
);

const ForestHeatMap = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Card className="group hover:shadow-algae transition-all duration-500 transform hover:-translate-y-2">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TreePine className="w-5 h-5 text-accent" />
              Forest Heat-Map
            </CardTitle>
            <Badge variant="outline" className="algae-gradient text-white">
              Live
            </Badge>
          </div>
          <CardDescription>Real-time deforestation vs reforestation tracking</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-48 w-full bg-gradient-to-br from-green-900/20 to-red-900/20 rounded-lg overflow-hidden">
            <ForestHeatmap />
          </div>
          <div className="mt-4 flex justify-between items-center">
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Reforestation</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>Deforestation</span>
              </div>
            </div>
            <button 
              className="px-3 py-1 text-sm bg-gradient-to-r from-green-600 to-green-700 text-white rounded-md border border-green-500 hover:from-green-700 hover:to-green-800 transition-all duration-200"
              onClick={() => setIsModalOpen(true)}
              type="button"
            >
              View Full Map
            </button>
          </div>
        </CardContent>
      </Card>
      
      <ForestMapModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
};

const Earth3DVisualization = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleExploreClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Explore Earth button clicked!');
    setIsModalOpen(true);
    console.log('Modal state set to true');
  };

  console.log('Earth3DVisualization render - isModalOpen:', isModalOpen);

  return (
    <>
      <Card className="group hover:shadow-coral transition-all duration-500 transform hover:-translate-y-2">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-secondary" />
              3D Earth Model
            </CardTitle>
            <Badge variant="outline" className="coral-gradient text-white">
              Interactive
            </Badge>
          </div>
          <CardDescription>Interactive 3D visualization of our planet</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-48 w-full bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg overflow-hidden">
            <Canvas camera={{ position: [0, 0, 5] }}>
              <Earth3D />
              <OrbitControls 
                enableZoom={true} 
                autoRotate={false}
                minDistance={3}
                maxDistance={10}
              />
            </Canvas>
          </div>
          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm text-muted-foreground">Global Environmental Data</div>
            <button 
              className="px-3 py-1 text-sm bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-md border border-orange-400 hover:from-orange-600 hover:to-red-600 transition-all duration-200"
              onClick={handleExploreClick}
              type="button"
            >
              Explore Earth
            </button>
          </div>
        </CardContent>
      </Card>
      
      <EarthModal 
        isOpen={isModalOpen} 
        onClose={() => {
          console.log('Closing modal');
          setIsModalOpen(false);
        }} 
      />
    </>
  );
};

const OzoneGraph = () => (
  <Card className="group hover:shadow-marine transition-all duration-500 transform hover:-translate-y-2">
    <CardHeader className="pb-3">
      <div className="flex items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-primary" />
          Ozone Levels
        </CardTitle>
        <Badge variant="outline" className="marine-gradient text-white">
          Real-time
        </Badge>
      </div>
      <CardDescription>24-hour ozone concentration monitoring</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={ozoneData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="level" 
              stroke="hsl(var(--primary))" 
              strokeWidth={3}
              dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 text-center">
        <div className="text-2xl font-bold text-primary">0.35 ppm</div>
        <div className="text-sm text-muted-foreground">Current Level</div>
      </div>
    </CardContent>
  </Card>
);

const SeaLevelGauge = () => {
  const [level, setLevel] = useState(73);
  
  React.useEffect(() => {
    const interval = setInterval(() => {
      setLevel(prev => prev + (Math.random() - 0.5) * 2);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="group hover:shadow-depth transition-all duration-500 transform hover:-translate-y-2">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Gauge className="w-5 h-5 text-primary" />
            Sea-Level Gauge
          </CardTitle>
          <Badge variant="outline" className="marine-gradient text-white">
            Sensor
          </Badge>
        </div>
        <CardDescription>Global sea level monitoring</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-48 flex items-center justify-center">
          <div className="relative w-32 h-32">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                fill="none"
                stroke="hsl(var(--border))"
                strokeWidth="8"
              />
              <motion.circle
                cx="64"
                cy="64"
                r="56"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={352}
                strokeDashoffset={352 - (352 * level) / 100}
                initial={{ strokeDashoffset: 352 }}
                animate={{ strokeDashoffset: 352 - (352 * level) / 100 }}
                transition={{ duration: 1, ease: "easeInOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <motion.div 
                  className="text-2xl font-bold text-primary"
                  key={Math.floor(level)}
                  initial={{ scale: 1.2, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {Math.floor(level)}%
                </motion.div>
                <div className="text-xs text-muted-foreground">Above Normal</div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 text-center">
          <div className="text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const DashboardSection = () => {
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
          Environmental <span className="text-primary">Dashboard</span>
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Real-time monitoring of critical environmental indicators through AI-powered analytics
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="transform hover:scale-[1.02] transition-all duration-300"
        >
          <ForestHeatMap />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="transform hover:scale-[1.02] transition-all duration-300"
        >
          <Earth3DVisualization />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          viewport={{ once: true }}
          className="transform hover:scale-[1.02] transition-all duration-300"
        >
          <WeatherWidget />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="transform hover:scale-[1.02] transition-all duration-300"
        >
          <OzoneGraph />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="transform hover:scale-[1.02] transition-all duration-300"
        >
          <SeaLevelGauge />
        </motion.div>
      </div>
    </section>
  );
};

export default DashboardSection;