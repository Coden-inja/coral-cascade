import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  DollarSign, 
  Target, 
  Users, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  Award,
  Handshake
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const projects = [
  {
    id: 1,
    title: "Coral Reef Restoration - Andaman",
    category: "Marine Conservation",
    funded: 450000,
    target: 650000,
    backers: 234,
    status: "active",
    approval: "verified",
    timeline: "6 months remaining",
    impact: "12,000 m² coral coverage"
  },
  {
    id: 2,
    title: "Forest Fire Prevention AI",
    category: "Forest Protection",
    funded: 320000,
    target: 500000,
    backers: 189,
    status: "funding",
    approval: "pending",
    timeline: "3 months remaining",
    impact: "50,000 hectares protected"
  },
  {
    id: 3,
    title: "Plastic Ocean Cleanup",
    category: "Ocean Cleanup",
    funded: 780000,
    target: 750000,
    backers: 412,
    status: "completed",
    approval: "verified",
    timeline: "Completed",
    impact: "2.5 tons plastic removed"
  }
];

const ProjectCard = ({ project, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const progressPercentage = (project.funded / project.target) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group"
    >
      <Card className="hover:shadow-coral transition-all duration-500 transform hover:-translate-y-2 cursor-pointer">
        <CardHeader 
          className="pb-3"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg group-hover:text-secondary transition-colors">
                {project.title}
              </CardTitle>
              <CardDescription className="mt-1">
                <span>{project.category}</span>
                <div className="flex items-center gap-2 mt-1">
                  {project.approval === 'verified' && (
                    <Badge className="algae-gradient text-white">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                  {project.approval === 'pending' && (
                    <Badge variant="outline">
                      <Clock className="w-3 h-3 mr-1" />
                      Pending
                    </Badge>
                  )}
                </div>
              </CardDescription>
            </div>
            <Badge 
              variant={project.status === 'completed' ? 'default' : 'secondary'}
              className={
                project.status === 'completed' 
                  ? 'algae-gradient text-white' 
                  : project.status === 'active'
                  ? 'coral-gradient text-white'
                  : 'marine-gradient text-white'
              }
            >
              {project.status}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Funding Progress</span>
                <span className="font-semibold">{progressPercentage.toFixed(1)}%</span>
              </div>
              <Progress 
                value={progressPercentage} 
                className="h-2"
              />
              <div className="flex justify-between text-sm">
                <span className="font-semibold text-primary">
                  ₹{project.funded.toLocaleString()}
                </span>
                <span className="text-muted-foreground">
                  of ₹{project.target.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="space-y-1">
                <div className="text-2xl font-bold text-primary">{project.backers}</div>
                <div className="text-xs text-muted-foreground">Backers</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-secondary">
                  {Math.floor(progressPercentage)}%
                </div>
                <div className="text-xs text-muted-foreground">Funded</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-accent">Live</div>
                <div className="text-xs text-muted-foreground">Status</div>
              </div>
            </div>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4 pt-4 border-t border-border"
                >
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Timeline:</span>
                      <div className="font-semibold">{project.timeline}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Impact:</span>
                      <div className="font-semibold">{project.impact}</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="flex-1 coral-gradient text-white hover:shadow-coral"
                    >
                      <DollarSign className="w-4 h-4 mr-1" />
                      Fund Project
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Handshake className="w-4 h-4 mr-1" />
                      Collaborate
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const StatsCard = ({ icon: Icon, title, value, change, color }) => (
  <Card className={`hover:shadow-${color} transition-all duration-500 transform hover:-translate-y-1`}>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold text-primary">{value}</p>
          <p className="text-sm text-accent font-semibold">+{change}% this month</p>
        </div>
        <div className={`p-3 ${color}-gradient rounded-full`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </CardContent>
  </Card>
);

const FundDashboard = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredProjects = selectedCategory === 'all' 
    ? projects 
    : projects.filter(p => p.category.toLowerCase().includes(selectedCategory));

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
          Fund & <span className="text-secondary">Collaborate</span>
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Connect with NGOs, Government initiatives, and Private sector projects for environmental impact
        </p>
      </motion.div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
        >
          <StatsCard
            icon={DollarSign}
            title="Total Funded"
            value="₹15.2Cr"
            change="23"
            color="marine"
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <StatsCard
            icon={Target}
            title="Active Projects"
            value="156"
            change="18"
            color="coral"
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <StatsCard
            icon={Users}
            title="NGO Partners"
            value="89"
            change="12"
            color="algae"
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <StatsCard
            icon={Award}
            title="Success Rate"
            value="94%"
            change="5"
            color="marine"
          />
        </motion.div>
      </div>

      {/* Category Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="flex flex-wrap justify-center gap-4 mb-8"
      >
        {['all', 'marine', 'forest', 'ocean'].map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'}
            onClick={() => setSelectedCategory(category)}
            className={
              selectedCategory === category 
                ? 'marine-gradient text-white' 
                : 'hover:bg-primary/10'
            }
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
            {category === 'all' ? ' Projects' : ' Conservation'}
          </Button>
        ))}
      </motion.div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {filteredProjects.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} />
        ))}
      </div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-center mt-16"
      >
        <Card className="marine-gradient text-white p-8">
          <CardContent className="space-y-6">
            <h3 className="text-3xl font-bold">Start Your Environmental Project</h3>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">
              Join the HackMarine community and get funding for your environmental initiative. 
              Connect with like-minded organizations and make a real impact.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="outline" className="bg-white text-primary hover:bg-white/90">
                <Target className="w-5 h-5 mr-2" />
                Submit Project
              </Button>
              <Button size="lg" variant="outline" className="bg-white text-primary hover:bg-white/90">
                <Users className="w-5 h-5 mr-2" />
                Join as Partner
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </section>
  );
};

export default FundDashboard;