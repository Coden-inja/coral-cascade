import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  AlertTriangle, 
  X, 
  MapPin, 
  Clock, 
  Users, 
  ExternalLink,
  CheckCircle,
  Info
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const EmailAlertPreview = () => {
  const [currentAlert, setCurrentAlert] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [alertQueue, setAlertQueue] = useState([]);

  const mockAlerts = [
    {
      id: 1,
      type: 'critical',
      title: 'Coral Bleaching Alert - Andaman Islands',
      message: 'Unusual temperature spike detected in Havelock Island coral reefs. Immediate monitoring required.',
      location: 'Andaman & Nicobar Islands',
      timestamp: new Date(),
      recipients: ['Marine NGOs', 'Local Authorities', 'Research Teams'],
      data: {
        temperature: '31.2°C',
        affected_area: '2.5 km²',
        severity: 'High'
      },
      actions: [
        { label: 'Deploy Response Team', urgent: true },
        { label: 'Notify Dive Centers', urgent: false },
        { label: 'Update Monitoring', urgent: false }
      ]
    },
    {
      id: 2,
      type: 'warning',
      title: 'Forest Fire Risk - Western Ghats',
      message: 'Dry conditions and high winds detected. Forest fire risk elevated in Kerala region.',
      location: 'Western Ghats, Kerala',
      timestamp: new Date(),
      recipients: ['Forest Department', 'Fire Services', 'Local Communities'],
      data: {
        humidity: '23%',
        wind_speed: '45 km/h',
        risk_level: 'Elevated'
      },
      actions: [
        { label: 'Increase Patrols', urgent: true },
        { label: 'Alert Villagers', urgent: true },
        { label: 'Prepare Equipment', urgent: false }
      ]
    },
    {
      id: 3,
      type: 'info',
      title: 'Plastic Cleanup Success - Goa Beaches',
      message: 'Community cleanup drive removed 500kg plastic waste from Baga Beach with 200+ volunteers.',
      location: 'Baga Beach, Goa',
      timestamp: new Date(),
      recipients: ['Environmental Groups', 'Tourism Board', 'Media'],
      data: {
        plastic_removed: '500 kg',
        volunteers: '200+',
        area_cleaned: '3.2 km'
      },
      actions: [
        { label: 'Share Success Story', urgent: false },
        { label: 'Plan Next Event', urgent: false },
        { label: 'Thank Volunteers', urgent: false }
      ]
    }
  ];

  useEffect(() => {
    // Demo: Show alerts every 10 seconds
    const interval = setInterval(() => {
      const randomAlert = mockAlerts[Math.floor(Math.random() * mockAlerts.length)];
      const alertWithId = {
        ...randomAlert,
        id: Date.now(),
        timestamp: new Date()
      };
      
      setAlertQueue(prev => [...prev, alertWithId]);
      
      if (!isVisible) {
        setCurrentAlert(alertWithId);
        setIsVisible(true);
      }
    }, 10000);

    // Show first alert after 3 seconds
    const firstAlert = setTimeout(() => {
      setCurrentAlert({
        ...mockAlerts[0],
        timestamp: new Date()
      });
      setIsVisible(true);
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(firstAlert);
    };
  }, []);

  // Auto-hide alerts after 8 seconds
  useEffect(() => {
    if (isVisible && currentAlert) {
      const hideTimeout = setTimeout(() => {
        handleDismiss();
      }, 8000);

      return () => clearTimeout(hideTimeout);
    }
  }, [isVisible, currentAlert]);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => {
      // Show next alert in queue if any
      if (alertQueue.length > 0) {
        const nextAlert = alertQueue[0];
        setAlertQueue(prev => prev.slice(1));
        setCurrentAlert(nextAlert);
        setIsVisible(true);
      } else {
        setCurrentAlert(null);
      }
    }, 300);
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'critical':
        return <AlertTriangle className="w-6 h-6 text-destructive" />;
      case 'warning':
        return <AlertTriangle className="w-6 h-6 text-secondary" />;
      case 'info':
        return <Info className="w-6 h-6 text-accent" />;
      default:
        return <Mail className="w-6 h-6 text-primary" />;
    }
  };

  const getAlertColor = (type) => {
    switch (type) {
      case 'critical':
        return 'border-destructive bg-destructive/5';
      case 'warning':
        return 'border-secondary bg-secondary/5';
      case 'info':
        return 'border-accent bg-accent/5';
      default:
        return 'border-primary bg-primary/5';
    }
  };

  const getBadgeColor = (type) => {
    switch (type) {
      case 'critical':
        return 'bg-destructive text-destructive-foreground';
      case 'warning':
        return 'coral-gradient text-white';
      case 'info':
        return 'algae-gradient text-white';
      default:
        return 'marine-gradient text-white';
    }
  };

  if (!isVisible || !currentAlert) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 400, scale: 0.8 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: 400, scale: 0.8 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
          duration: 0.6
        }}
        className="fixed top-6 right-6 w-96 max-w-[calc(100vw-3rem)] z-50"
      >
        <Card className={`shadow-depth border-2 ${getAlertColor(currentAlert.type)} backdrop-blur-sm`}>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {getAlertIcon(currentAlert.type)}
                </motion.div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className={getBadgeColor(currentAlert.type)}>
                      <Mail className="w-3 h-3 mr-1" />
                      {currentAlert.type.toUpperCase()}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      <Clock className="w-3 h-3 mr-1" />
                      Just now
                    </Badge>
                  </div>
                  <CardTitle className="text-lg leading-tight">
                    {currentAlert.title}
                  </CardTitle>
                </div>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleDismiss}
                className="hover:bg-destructive/10"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Message */}
            <p className="text-sm leading-relaxed">
              {currentAlert.message}
            </p>

            {/* Location and Recipients */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {currentAlert.location}
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {currentAlert.recipients.length} groups notified
              </div>
            </div>

            {/* Data Display */}
            {currentAlert.data && (
              <div className="grid grid-cols-3 gap-2 p-3 bg-muted/50 rounded-lg">
                {Object.entries(currentAlert.data).map(([key, value]) => (
                  <div key={key} className="text-center">
                    <div className="text-xs text-muted-foreground capitalize">
                      {key.replace('_', ' ')}
                    </div>
                    <div className="font-semibold text-sm">{String(value)}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Recipients */}
            <div>
              <div className="text-xs font-semibold mb-2">Notified:</div>
              <div className="flex flex-wrap gap-1">
                {currentAlert.recipients.map((recipient, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {recipient}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-2">
              <div className="text-xs font-semibold">Quick Actions:</div>
              {currentAlert.actions.slice(0, 2).map((action, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <Button
                    size="sm"
                    variant={action.urgent ? "default" : "outline"}
                    className={`w-full justify-between ${
                      action.urgent 
                        ? 'coral-gradient text-white' 
                        : 'hover:bg-primary/10'
                    }`}
                  >
                    <span className="text-xs">{action.label}</span>
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </motion.div>
              ))}
            </div>

            {/* Email Status */}
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-accent" />
                <span className="text-xs text-muted-foreground">
                  Email sent successfully
                </span>
              </div>
              <Button size="sm" variant="ghost" className="text-xs hover:bg-primary/10">
                View Full Email
              </Button>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Auto-dismiss in</span>
                <span className="font-mono">5s</span>
              </div>
              <motion.div
                className="w-full h-1 bg-muted rounded-full overflow-hidden"
              >
                <motion.div
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ duration: 5, ease: "linear" }}
                  className="h-full bg-primary"
                />
              </motion.div>
            </div>
          </CardContent>
        </Card>

        {/* Queue Indicator */}
        {alertQueue.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 text-center"
          >
            <Badge variant="secondary" className="text-xs">
              {alertQueue.length} more alert{alertQueue.length !== 1 ? 's' : ''} queued
            </Badge>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default EmailAlertPreview;