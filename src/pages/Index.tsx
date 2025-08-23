import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Users, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import HeroSection from '@/components/HeroSection';
import BuoyVideoSection from '@/components/BuoyVideoSection';
import LiveStatsBar from '@/components/LiveStatsBar';
import DashboardSection from '@/components/DashboardSection';
import FundDashboard from '@/components/FundDashboard';
import CommunityFeed from '@/components/CommunityFeed';
import SensorStrip from '@/components/SensorStrip';
import VoiceAgent from '@/components/VoiceAgent';
import GovernmentLinks from '@/components/GovernmentLinks';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-depth overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/20 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold marine-gradient bg-clip-text text-transparent">
              HackMarine
            </h1>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild className="text-white hover:bg-white/10">
                <a href="/" className="flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  Home
                </a>
              </Button>
              <Button variant="ghost" size="sm" asChild className="text-white hover:bg-white/10">
                <Link to="/social" className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Social
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Add top padding to account for fixed navigation */}
      <div className="pt-16">
        {/* Hero Section */}
        <HeroSection />
        
        {/* Buoy Video Section */}
        <BuoyVideoSection />
        
        {/* Live Stats Bar */}
        <LiveStatsBar />
        
        {/* Main Content */}
        <main className="relative z-10">
          {/* Dashboard Section */}
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="py-20"
          >
            <DashboardSection />
          </motion.section>

          {/* Fund Dashboard */}
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="py-20"
          >
            <FundDashboard />
          </motion.section>

          {/* Community Feed */}
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="py-20"
          >
            <CommunityFeed />
          </motion.section>

          {/* Sensor Strip */}
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="py-20"
          >
            <SensorStrip />
          </motion.section>

          {/* Government Links */}
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            viewport={{ once: true }}
            className="py-20"
          >
            <GovernmentLinks />
          </motion.section>
        </main>

        {/* Voice Agent */}
        <VoiceAgent />
      </div>
    </div>
  );
};

export default Index;