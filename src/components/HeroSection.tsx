import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Droplets, Recycle, Waves, Fish, TreePine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroImage from '@/assets/hero-marine.jpg';

const FloatingIcon = ({ icon: Icon, delay = 0, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ 
      opacity: 1, 
      y: [0, -10, 0],
    }}
    transition={{
      opacity: { duration: 1, delay },
      y: { 
        duration: 3, 
        repeat: Infinity, 
        repeatType: "reverse",
        delay 
      }
    }}
    className={`absolute ${className}`}
  >
    <div className="p-4 glass-marine rounded-full shadow-marine">
      <Icon className="w-8 h-8 text-primary" />
    </div>
  </motion.div>
);

const WaveBackground = () => (
  <div className="absolute inset-0 overflow-hidden">
    <svg
      className="absolute bottom-0 w-full h-full"
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMax slice"
    >
      <defs>
        <linearGradient id="waveGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" className="text-primary/20" stopColor="currentColor" />
          <stop offset="100%" className="text-primary/5" stopColor="currentColor" />
        </linearGradient>
        <linearGradient id="waveGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" className="text-secondary/15" stopColor="currentColor" />
          <stop offset="100%" className="text-secondary/5" stopColor="currentColor" />
        </linearGradient>
      </defs>
      
      <motion.path
        d="M0,400 C300,350 600,450 900,400 C1050,375 1150,425 1200,400 L1200,800 L0,800 Z"
        fill="url(#waveGradient1)"
        animate={{
          d: [
            "M0,400 C300,350 600,450 900,400 C1050,375 1150,425 1200,400 L1200,800 L0,800 Z",
            "M0,420 C300,370 600,470 900,420 C1050,395 1150,445 1200,420 L1200,800 L0,800 Z",
            "M0,400 C300,350 600,450 900,400 C1050,375 1150,425 1200,400 L1200,800 L0,800 Z"
          ]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.path
        d="M0,450 C400,400 700,500 1000,450 C1100,425 1150,475 1200,450 L1200,800 L0,800 Z"
        fill="url(#waveGradient2)"
        animate={{
          d: [
            "M0,450 C400,400 700,500 1000,450 C1100,425 1150,475 1200,450 L1200,800 L0,800 Z",
            "M0,470 C400,420 700,520 1000,470 C1100,445 1150,495 1200,470 L1200,800 L0,800 Z",
            "M0,450 C400,400 700,500 1000,450 C1100,425 1150,475 1200,450 L1200,800 L0,800 Z"
          ]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />
    </svg>
  </div>
);

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      
      {/* Wave Background */}
      <WaveBackground />
      
      {/* Floating Icons */}
      <FloatingIcon 
        icon={Leaf} 
        delay={0} 
        className="top-20 left-20 hidden lg:block" 
      />
      <FloatingIcon 
        icon={Droplets} 
        delay={1} 
        className="top-32 right-32 hidden lg:block" 
      />
      <FloatingIcon 
        icon={Recycle} 
        delay={2} 
        className="bottom-40 left-32 hidden lg:block" 
      />
      <FloatingIcon 
        icon={Waves} 
        delay={0.5} 
        className="top-40 left-1/2 hidden md:block" 
      />
      <FloatingIcon 
        icon={Fish} 
        delay={1.5} 
        className="bottom-32 right-20 hidden lg:block" 
      />
      <FloatingIcon 
        icon={TreePine} 
        delay={2.5} 
        className="top-60 right-1/4 hidden xl:block" 
      />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-balance">
            <span className="bg-gradient-marine bg-clip-text text-transparent">
              Hack
            </span>
            <span className="text-primary">Marine</span>
          </h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-xl md:text-2xl text-muted-foreground mb-8 text-balance max-w-2xl mx-auto"
          >
            India's first platform for co-creating, funding, and monitoring 
            environmental action through AI-powered insights and community collaboration.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <Button 
              size="lg" 
              className="marine-gradient text-white font-semibold px-8 py-6 text-lg shadow-marine hover:shadow-depth transform hover:scale-105 transition-all duration-300"
            >
              Start Monitoring
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground px-8 py-6 text-lg font-semibold transform hover:scale-105 transition-all duration-300"
            >
              Explore Dashboard
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="flex flex-col items-center space-y-2">
          <span className="text-sm text-muted-foreground">Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-primary rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-3 bg-primary rounded-full mt-2"
            />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;