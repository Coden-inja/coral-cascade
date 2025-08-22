import React from 'react';
import { motion } from 'framer-motion';
import HeroSection from '@/components/HeroSection';
import LiveStatsBar from '@/components/LiveStatsBar';
import DashboardSection from '@/components/DashboardSection';
import FundDashboard from '@/components/FundDashboard';
import CommunityFeed from '@/components/CommunityFeed';
import SensorStrip from '@/components/SensorStrip';
import VoiceAgent from '@/components/VoiceAgent';
import GovernmentLinks from '@/components/GovernmentLinks';
import EmailAlertPreview from '@/components/EmailAlertPreview';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-depth overflow-x-hidden">
      {/* Hero Section */}
      <HeroSection />
      
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

      {/* Fixed Components */}
      <VoiceAgent />
      <EmailAlertPreview />
    </div>
  );
};

export default Index;