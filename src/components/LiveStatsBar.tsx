import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Upload, Target, TrendingUp } from 'lucide-react';

const StatItem = ({ icon: Icon, label, value, isAnimating }) => (
  <motion.div 
    className="flex items-center space-x-3 px-6 py-4 glass-marine rounded-xl shadow-marine"
    animate={{ 
      scale: isAnimating ? [1, 1.05, 1] : 1,
      boxShadow: isAnimating 
        ? ["var(--shadow-marine)", "var(--shadow-depth)", "var(--shadow-marine)"]
        : "var(--shadow-marine)"
    }}
    transition={{ duration: 0.6 }}
  >
    <div className="p-3 marine-gradient rounded-full">
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div>
      <AnimatePresence mode="wait">
        <motion.div
          key={value}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="text-2xl font-bold text-primary"
        >
          {value.toLocaleString()}
        </motion.div>
      </AnimatePresence>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  </motion.div>
);

const LiveStatsBar = () => {
  const [stats, setStats] = useState({
    users: 12847,
    uploads: 3256,
    sdgScore: 87,
    projects: 156
  });
  
  const [animatingStats, setAnimatingStats] = useState({
    users: false,
    uploads: false,
    sdgScore: false,
    projects: false
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      const statKeys = Object.keys(stats);
      const randomStat = statKeys[Math.floor(Math.random() * statKeys.length)];
      
      setAnimatingStats(prev => ({ ...prev, [randomStat]: true }));
      
      setStats(prev => ({
        ...prev,
        [randomStat]: prev[randomStat] + Math.floor(Math.random() * 10) + 1
      }));
      
      setTimeout(() => {
        setAnimatingStats(prev => ({ ...prev, [randomStat]: false }));
      }, 600);
      
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border py-6"
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <StatItem
              icon={Users}
              label="Active Users"
              value={stats.users}
              isAnimating={animatingStats.users}
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <StatItem
              icon={Upload}
              label="Data Uploads"
              value={stats.uploads}
              isAnimating={animatingStats.uploads}
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <StatItem
              icon={Target}
              label="SDG Score"
              value={stats.sdgScore}
              isAnimating={animatingStats.sdgScore}
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <StatItem
              icon={TrendingUp}
              label="Active Projects"
              value={stats.projects}
              isAnimating={animatingStats.projects}
            />
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default LiveStatsBar;