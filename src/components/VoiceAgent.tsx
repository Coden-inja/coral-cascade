import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const VoiceAgent = () => {
  const [isActive, setIsActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);

  // Simulate audio level changes when listening
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isListening) {
      interval = setInterval(() => {
        setAudioLevel(Math.random() * 100);
      }, 100);
    } else {
      setAudioLevel(0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isListening]);

  const handleToggle = async () => {
    if (!isActive) {
      // Request microphone permission
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setIsActive(true);
        setIsListening(true);
        
        // Simulate a welcome message
        setTimeout(() => {
          setIsListening(false);
        }, 2000);
      } catch (error) {
        console.log('Microphone access denied');
      }
    } else {
      setIsActive(false);
      setIsListening(false);
    }
  };

  const WaveRing = ({ delay = 0, scale = 1 }) => (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ 
        scale: [0.8, 1.4, 0.8],
        opacity: [0, 0.6, 0]
      }}
      transition={{
        duration: 2,
        delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className="absolute inset-0 rounded-full border-2 border-primary"
      style={{ transform: `scale(${scale})` }}
    />
  );

  return (
    <>
      {/* Floating Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="relative">
          <motion.button
            onClick={handleToggle}
            className={`
              relative w-16 h-16 rounded-full shadow-depth flex items-center justify-center
              transition-all duration-300 group overflow-hidden
              ${isActive 
                ? 'bg-primary text-white shadow-primary' 
                : 'marine-gradient text-white hover:shadow-marine'
              }
            `}
          >
            <motion.div
              animate={{ 
                scale: isListening ? [1, 1.2, 1] : 1,
                rotate: isActive ? 360 : 0
              }}
              transition={{ 
                scale: { duration: 1, repeat: Infinity },
                rotate: { duration: 0.5 }
              }}
            >
              {isActive ? (
                <MicOff className="w-7 h-7" />
              ) : (
                <Mic className="w-7 h-7" />
              )}
            </motion.div>

            {/* Pulse effect when listening */}
            {isListening && (
              <>
                <WaveRing delay={0} />
                <WaveRing delay={0.3} />
                <WaveRing delay={0.6} />
              </>
            )}
          </motion.button>

          {/* Audio level indicator */}
          {isListening && (
            <motion.div
              className="absolute -top-2 -right-2 w-4 h-4 bg-accent rounded-full"
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{ 
                duration: 0.1,
                repeat: Infinity
              }}
            />
          )}
        </div>
      </motion.div>

      {/* Voice Interface Modal */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4"
            onClick={() => setIsActive(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="bg-background/95 backdrop-blur-md rounded-3xl p-8 max-w-sm w-full text-center shadow-depth border border-border"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Avatar with animated waves */}
              <div className="relative mb-6 mx-auto w-32 h-32">
                <Avatar className="w-32 h-32 ring-4 ring-primary/20">
                  <AvatarImage src="/api/placeholder/128/128" alt="HackMarine AI" />
                  <AvatarFallback className="bg-primary text-white text-4xl">
                    HM
                  </AvatarFallback>
                </Avatar>

                {/* Animated waves around avatar */}
                {isListening && (
                  <>
                    {[...Array(4)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute inset-0 rounded-full border border-primary"
                        initial={{ scale: 1, opacity: 0.8 }}
                        animate={{
                          scale: [1, 2, 1],
                          opacity: [0.8, 0, 0.8]
                        }}
                        transition={{
                          duration: 2,
                          delay: i * 0.5,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                    ))}
                  </>
                )}

                {/* Audio visualization */}
                {isListening && (
                  <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-1 bg-primary rounded-full"
                        animate={{
                          height: [4, audioLevel / 10, 4]
                        }}
                        transition={{
                          duration: 0.3,
                          delay: i * 0.1,
                          repeat: Infinity,
                          repeatType: "reverse"
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Status text */}
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-foreground">
                  HackMarine AI
                </h3>
                <p className="text-muted-foreground">
                  {isListening 
                    ? "I'm listening... Ask me anything about marine conservation!"
                    : "Hello! I'm ready to help with your environmental queries."
                  }
                </p>
              </div>

              {/* Close hint */}
              <p className="text-xs text-muted-foreground mt-6">
                Tap anywhere outside to close
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default VoiceAgent;