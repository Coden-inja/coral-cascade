import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ExternalLink, 
  BookOpen, 
  FileText, 
  Users, 
  Globe, 
  Award,
  ChevronDown,
  ChevronRight,
  Building,
  Landmark,
  GraduationCap
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const governmentLinks = [
  {
    id: 'ministry-env',
    title: 'Ministry of Environment, Forest and Climate Change',
    description: 'Central ministry handling environmental policies and conservation',
    category: 'Government',
    icon: Landmark,
    links: [
      { name: 'Environmental Clearances', url: '#', type: 'portal' },
      { name: 'Forest Conservation Act', url: '#', type: 'policy' },
      { name: 'Pollution Control Board', url: '#', type: 'agency' },
      { name: 'National Green Tribunal', url: '#', type: 'judicial' }
    ],
    contacts: [
      { role: 'Minister', name: 'Bhupender Yadav', email: 'minister@moef.gov.in' },
      { role: 'Secretary', name: 'Leena Nandan', email: 'secretary@moef.gov.in' }
    ]
  },
  {
    id: 'doe-ocean',
    title: 'Department of Ocean Development',
    description: 'Marine research, ocean technology and coastal zone management',
    category: 'Marine Affairs',
    icon: Globe,
    links: [
      { name: 'Coastal Zone Management', url: '#', type: 'portal' },
      { name: 'Marine Protected Areas', url: '#', type: 'conservation' },
      { name: 'Blue Economy Initiative', url: '#', type: 'program' },
      { name: 'Ocean Data Portal', url: '#', type: 'data' }
    ],
    contacts: [
      { role: 'Secretary', name: 'Dr. M. Ravichandran', email: 'secretary@doe.gov.in' },
      { role: 'Joint Secretary', name: 'Shailesh Nayak', email: 'js@doe.gov.in' }
    ]
  },
  {
    id: 'isro',
    title: 'Indian Space Research Organisation',
    description: 'Satellite monitoring for environmental and climate applications',
    category: 'Technology',
    icon: Building,
    links: [
      { name: 'Oceansat Program', url: '#', type: 'satellite' },
      { name: 'Climate Data Portal', url: '#', type: 'data' },
      { name: 'Disaster Management', url: '#', type: 'service' },
      { name: 'Earth Observation', url: '#', type: 'portal' }
    ],
    contacts: [
      { role: 'Chairman', name: 'S. Somanath', email: 'chairman@isro.gov.in' },
      { role: 'Director', name: 'Dr. P. G. Divakar', email: 'director@isro.gov.in' }
    ]
  }
];

const learningResources = [
  {
    id: 'ncert-env',
    title: 'NCERT Environmental Science',
    description: 'Comprehensive curriculum on environmental studies',
    category: 'Education',
    icon: GraduationCap,
    resources: [
      { name: 'Class 12 - Biology', url: '#', type: 'textbook' },
      { name: 'Environmental Issues', url: '#', type: 'chapter' },
      { name: 'Ecosystem Services', url: '#', type: 'module' },
      { name: 'Conservation Biology', url: '#', type: 'course' }
    ],
    level: 'Intermediate'
  },
  {
    id: 'iit-ocean',
    title: 'IIT Ocean Engineering Programs',
    description: 'Advanced courses in marine technology and ocean sciences',
    category: 'Higher Education',
    icon: BookOpen,
    resources: [
      { name: 'Marine Biology Course', url: '#', type: 'course' },
      { name: 'Coastal Engineering', url: '#', type: 'program' },
      { name: 'Ocean Data Analysis', url: '#', type: 'workshop' },
      { name: 'Research Publications', url: '#', type: 'papers' }
    ],
    level: 'Advanced'
  },
  {
    id: 'nptel',
    title: 'NPTEL Environmental Courses',
    description: 'Free online courses on environmental engineering and sciences',
    category: 'Online Learning',
    icon: Users,
    resources: [
      { name: 'Water Treatment Technology', url: '#', type: 'course' },
      { name: 'Air Pollution Control', url: '#', type: 'lectures' },
      { name: 'Waste Management', url: '#', type: 'certification' },
      { name: 'Environmental Modeling', url: '#', type: 'advanced' }
    ],
    level: 'All Levels'
  }
];

const LinkCard = ({ item, type, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const items = type === 'government' ? item.links : item.resources;
  const additionalData = type === 'government' ? item.contacts : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, rotateX: -15 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ 
        duration: 0.8, 
        delay: index * 0.1,
        type: "spring",
        stiffness: 100
      }}
      viewport={{ once: true }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group perspective-1000"
    >
      <Card className="hover:shadow-algae transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 cursor-pointer">
        <CardHeader 
          className="pb-3"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="p-3 marine-gradient rounded-full">
                <item.icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-lg group-hover:text-primary transition-colors">
                  {item.title}
                </CardTitle>
                <CardDescription className="mt-1">
                  {item.description}
                </CardDescription>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="algae-gradient text-white">
                    {item.category}
                  </Badge>
                  {type === 'learning' && (
                    <Badge variant="secondary">
                      {item.level}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            </motion.div>
          </div>
        </CardHeader>
        
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <CardContent className="pt-0">
                <div className="space-y-4">
                  {/* Links/Resources */}
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <ExternalLink className="w-4 h-4" />
                      {type === 'government' ? 'Government Portals' : 'Learning Resources'}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {items.map((link, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          whileHover={{ scale: 1.02 }}
                          className="flex items-center gap-2 p-2 rounded-lg hover:bg-primary/5 transition-colors cursor-pointer"
                        >
                          <ChevronRight className="w-3 h-3 text-primary" />
                          <span className="text-sm flex-1">{link.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {link.type}
                          </Badge>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Contacts (for government) */}
                  {additionalData && (
                    <div className="pt-4 border-t border-border">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Key Contacts
                      </h4>
                      <div className="space-y-2">
                        {additionalData.map((contact, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="flex items-center justify-between p-2 bg-muted/50 rounded-lg"
                          >
                            <div>
                              <div className="font-medium text-sm">{contact.name}</div>
                              <div className="text-xs text-muted-foreground">{contact.role}</div>
                            </div>
                            <Button size="sm" variant="ghost" className="text-xs">
                              <ExternalLink className="w-3 h-3 mr-1" />
                              Contact
                            </Button>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-4 border-t border-border">
                    <Button size="sm" className="flex-1 coral-gradient text-white">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Visit Portal
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <BookOpen className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
};

const QuickAccessPanel = () => {
  const quickLinks = [
    { name: 'Environmental Clearance', icon: FileText, category: 'Permits' },
    { name: 'Marine Protected Areas', icon: Globe, category: 'Conservation' },
    { name: 'Research Grants', icon: Award, category: 'Funding' },
    { name: 'Policy Documents', icon: BookOpen, category: 'Legal' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <Card className="marine-gradient text-white">
        <CardHeader>
          <CardTitle className="text-xl">Quick Access</CardTitle>
          <CardDescription className="text-white/80">
            Frequently accessed government portals and resources
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {quickLinks.map((link, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-4 bg-white/10 rounded-lg backdrop-blur-sm cursor-pointer hover:bg-white/20 transition-all"
              >
                <div className="flex items-center gap-3">
                  <link.icon className="w-5 h-5" />
                  <div>
                    <div className="font-semibold text-sm">{link.name}</div>
                    <div className="text-xs opacity-80">{link.category}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const GovernmentLinks = () => {
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
          Government <span className="text-accent">Resources</span>
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Connect with official portals, policies, and learning resources for environmental action
        </p>
      </motion.div>

      {/* Quick Access Panel */}
      <div className="mb-12">
        <QuickAccessPanel />
      </div>

      {/* Government Links */}
      <div className="mb-16">
        <motion.h3
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-2xl font-bold mb-8 flex items-center gap-2"
        >
          <Landmark className="w-6 h-6 text-primary" />
          Government Portals & Agencies
        </motion.h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {governmentLinks.map((item, index) => (
            <LinkCard key={item.id} item={item} type="government" index={index} />
          ))}
        </div>
      </div>

      {/* Learning Resources */}
      <div>
        <motion.h3
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-2xl font-bold mb-8 flex items-center gap-2"
        >
          <GraduationCap className="w-6 h-6 text-accent" />
          Learning Resources
        </motion.h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {learningResources.map((item, index) => (
            <LinkCard key={item.id} item={item} type="learning" index={index} />
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-center mt-16"
      >
        <Card className="algae-gradient text-white p-8">
          <CardContent>
            <h3 className="text-2xl font-bold mb-4">Stay Connected</h3>
            <p className="mb-6 opacity-90">
              Subscribe to updates on new policies, initiatives, and learning opportunities
            </p>
            <Button size="lg" variant="outline" className="bg-white text-accent hover:bg-white/90">
              <Award className="w-5 h-5 mr-2" />
              Subscribe to Updates
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </section>
  );
};

export default GovernmentLinks;