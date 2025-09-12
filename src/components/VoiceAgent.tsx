import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageSquare } from 'lucide-react';
import Vapi from '@vapi-ai/web';

// Vapi instance management
let vapiInstance: Vapi | null = null;
const getVapiInstance = () => {
  if (!vapiInstance) {
    const publicKey = import.meta.env.VITE_VAPI_PUBLIC_KEY;
    if (!publicKey) {
      throw new Error('VITE_VAPI_PUBLIC_KEY is not configured');
    }
    
    // Initialize Vapi - the SDK doesn't support custom baseUrl configuration
    vapiInstance = new Vapi(publicKey);
  }
  return vapiInstance;
};


const VoiceAgent = () => {
  const [isActive, setIsActive] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const [callStatus, setCallStatus] = useState("Tap to start speaking with HackMarine AI");
  const [transcript, setTranscript] = useState<Array<{
    id: number;
    role: string;
    text: string;
    isFinal: boolean;
  }>>([]);
  const [showTranscript, setShowTranscript] = useState(false);
  const [isAgentSpeaking, setIsAgentSpeaking] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [hasError, setHasError] = useState(false);

  // Unique message id helper
  const messageId = useRef(0);

  // Simulate audio level changes when agent is speaking
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAgentSpeaking) {
      interval = setInterval(() => {
        setAudioLevel(Math.random() * 100);
      }, 100);
    } else {
      setAudioLevel(0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAgentSpeaking]);

  useEffect(() => {
    try {
      const vapi = getVapiInstance();

      const handleCallStart = () => {
        console.log('✅ Call started successfully');
        setIsCalling(true);
        setCallStatus("Listening…");
        setTranscript([]);
        setHasError(false);
      };

      const handleCallEnd = () => {
        setIsCalling(false);
        setCallStatus("Ready to chat again");
        setIsAgentSpeaking(false);
      };

      const handleError = (error: any) => {
        console.error('Vapi error:', error);
        setHasError(true);
        
        // Extract specific error information
        let errorMessage = "Connection error";
        if (error.error && error.error.type === 'cors') {
          const origin = window.location.origin;
          errorMessage = `CORS error - API call blocked by browser. Add Allowed Origin in Vapi dashboard: ${origin}`;
        } else if (error.error && error.error.status === 400) {
          errorMessage = "Invalid request format or missing parameters";
        } else if (error.error && error.error.status === 401) {
          errorMessage = "Authentication failed";
        } else if (error.error && error.error.status === 403) {
          errorMessage = "Access denied";
        }
        
        setCallStatus(errorMessage);
        setIsAgentSpeaking(false);
        setIsCalling(false);
      };

      const handleMessage = (msg: any) => {
        if (msg.type === "transcript" && msg.transcript) {
          setIsAgentSpeaking(msg.role === "assistant");

          setTranscript((prev) => {
            const next = [...prev];

            // update existing interim line
            const idx = next.findIndex(
              (t) => t.role === msg.role && !t.isFinal
            );
            if (idx !== -1) {
              next[idx] = {
                ...next[idx],
                text: msg.transcript,
                isFinal: msg.transcriptType === "final",
              };
              return next;
            }

            // new line
            return [
              ...next,
              {
                id: ++messageId.current,
                role: msg.role,
                text: msg.transcript,
                isFinal: msg.transcriptType === "final",
              },
            ];
          });
        }
      };

      vapi.on("call-start", handleCallStart);
      vapi.on("call-end", handleCallEnd);
      vapi.on("error", handleError);
      vapi.on("message", handleMessage);

      return () => {
        vapi.off("call-start", handleCallStart);
        vapi.off("call-end", handleCallEnd);
        vapi.off("error", handleError);
        vapi.off("message", handleMessage);
        vapi.stop();
        // fully reset singleton so Fast-Refresh works
        vapiInstance = null;
      };
    } catch (error) {
      console.error('Failed to initialize Vapi:', error);
      setCallStatus("Configuration error. Please check environment variables.");
    }
  }, []);

  const startCall = async () => {
    try {
      console.log('🔄 Starting call process...');
      setCallStatus("Connecting…");
      setIsActive(true);
      setHasError(false);
      
      const assistantId = import.meta.env.VITE_VAPI_ASSISTANT_ID;
      const publicKey = import.meta.env.VITE_VAPI_PUBLIC_KEY;
      
      console.log('🔑 Environment variables check:');
      console.log('- Assistant ID:', assistantId ? `${assistantId.substring(0, 8)}...` : 'MISSING');
      console.log('- Public Key:', publicKey ? `${publicKey.substring(0, 8)}...` : 'MISSING');
      
      if (!assistantId) {
        throw new Error('VITE_VAPI_ASSISTANT_ID is not configured');
      }
      if (!publicKey) {
        throw new Error('VITE_VAPI_PUBLIC_KEY is not configured');
      }
      
      console.log('📞 Getting Vapi instance...');
      const vapi = getVapiInstance();
      console.log('✅ Vapi instance created successfully');
      
      console.log('🚀 Attempting to start call with assistant ID:', assistantId);
      
      // Use the correct Vapi start method - pass assistantId directly as string
      await vapi.start(assistantId);
      
      // Don't show success message - let the call-start event handler do it
      // The success will be logged when handleCallStart is triggered
    } catch (error) {
      console.error('❌ Failed to start call:', error);
      
      // Log detailed error information
      if (error instanceof Error) {
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }
      
      // Check if it's a network error
      if (error && typeof error === 'object' && 'response' in error) {
        const response = (error as any).response;
        console.error('Response status:', response?.status);
        console.error('Response data:', response?.data);
      }
      
      // More specific error handling
      let errorMessage = "Failed to connect. Please check your credentials.";
      if (error instanceof Error) {
        if (error.message.includes('not configured')) {
          errorMessage = "Environment variables not configured properly.";
        } else if (error.message.includes('400')) {
          errorMessage = "Invalid assistant ID or API configuration.";
        } else if (error.message.includes('401')) {
          errorMessage = "Invalid API key. Please check your credentials.";
        } else if (error.message.includes('403')) {
          errorMessage = "Access denied. Check API permissions.";
        } else if (error.message.includes('404')) {
          errorMessage = "Assistant not found. Check assistant ID.";
        } else if (error.message.includes('network')) {
          errorMessage = "Network error. Check your internet connection.";
        }
      }
      
      console.error('🔴 Final error message:', errorMessage);
      setCallStatus(errorMessage);
      setIsActive(false);
      setIsCalling(false);
    }
  };

  const endCall = () => {
    getVapiInstance().stop();
    setIsActive(false);
  };


  const handleToggle = () => {
    if (isCalling) {
      endCall();
    } else {
      startCall();
    }
  };

  const toggleTranscript = () => setShowTranscript(!showTranscript);

  const WaveRing = ({ delay = 0, scale = 1 }: { delay?: number; scale?: number }) => (
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
              ${isCalling 
                ? 'bg-red-600 text-white shadow-red-600' 
                : 'marine-gradient text-white hover:shadow-marine'
              }
            `}
          >
            <motion.div
              animate={{ 
                scale: isAgentSpeaking ? [1, 1.2, 1] : 1,
                rotate: isCalling ? 360 : 0
              }}
              transition={{ 
                scale: { duration: 1, repeat: Infinity },
                rotate: { duration: 0.5 }
              }}
            >
              {isCalling ? (
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 11h-1.7c0 .74-.16 1.43-.43 2.05l1.23 1.23c.56-.98.9-2.09.9-3.28zm-4.02.17c0-.06.02-.11.02-.17V5c0-1.66-1.34-3-3-3S9 3.34 9 5v.18l5.98 5.99zM4.27 3L3 4.27l6.01 6.01V11c0 1.66 1.33 3 2.99 3 .22 0 .44-.03.65-.08l1.66 1.66c-.71.33-1.5.52-2.31.52-2.76 0-5.3-2.1-5.3-5.1H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c.91-.13 1.77-.45 2.54-.9L19.73 21 21 19.73 4.27 3z"/>
                </svg>
              ) : (
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2c1.1 0 2 .9 2 2v7c0 1.1-.9 2-2 2s-2-.9-2-2V4c0-1.1.9-2 2-2zm5.3 9c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.49 6-3.31 6-6.72h-1.7z"/>
                </svg>
              )}
            </motion.div>

            {/* Pulse effect when listening */}
            {isCalling && (
              <>
                <WaveRing delay={0} />
                <WaveRing delay={0.3} />
                <WaveRing delay={0.6} />
              </>
            )}
          </motion.button>

          {/* Audio level indicator */}
          {isAgentSpeaking && (
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
                {isAgentSpeaking && (
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
                {isAgentSpeaking && (
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
                  {callStatus}
                </p>

                {/* CORS guidance */}
                {hasError && callStatus.toLowerCase().includes('cors') && (
                  <div className="mt-2 text-xs p-3 rounded-lg border border-amber-300 bg-amber-50 text-amber-900 dark:bg-amber-900/20 dark:text-amber-200">
                    <div className="font-medium mb-1">Allow this origin in Vapi dashboard</div>
                    <div className="flex items-center gap-2">
                      <code className="px-2 py-1 rounded bg-amber-100/60 dark:bg-amber-800/40">
                        {window.location.origin}
                      </code>
                      <button
                        className="px-2 py-1 rounded bg-amber-200/70 hover:bg-amber-300/70 dark:bg-amber-700/40 dark:hover:bg-amber-700/60 transition-colors"
                        onClick={() => navigator.clipboard.writeText(window.location.origin)}
                        type="button"
                      >
                        Copy
                      </button>
                    </div>
                    <div className="mt-2 opacity-80">
                      Add it under Project → Settings → Allowed Origins. Also include
                      localhost variants like http://localhost:5173 and http://127.0.0.1:5173.
                    </div>
                  </div>
                )}
              </div>

              {/* Call control buttons */}
              <div className="flex gap-3 mt-6">
                {isCalling ? (
                  <button
                    onClick={endCall}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    End Call
                  </button>
                ) : (
                  <>
                    <button
                      onClick={startCall}
                      className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg transition-colors"
                    >
                      Try Again
                    </button>
                    <button
                      onClick={() => setIsActive(false)}
                      className="flex-1 bg-muted hover:bg-muted/80 text-muted-foreground px-4 py-2 rounded-lg transition-colors"
                    >
                      Close
                    </button>
                  </>
                )}
              </div>

              {/* Transcript toggle button */}
              {transcript.length > 0 && (
                <button
                  onClick={toggleTranscript}
                  className="mt-4 flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors"
                >
                  <MessageSquare size={16} />
                  <span className="text-sm">View Conversation</span>
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transcript Panel */}
      <AnimatePresence>
        {showTranscript && (
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            className="fixed bottom-0 left-0 right-0 h-80 bg-background/95 backdrop-blur-md border-t border-border z-50"
          >
            <div className="p-4 h-full flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Conversation</h3>
                <button
                  onClick={toggleTranscript}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  ×
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                {transcript.length === 0 && (
                  <p className="text-center text-muted-foreground mt-8">No conversation yet</p>
                )}
                {transcript.map((t) => (
                  <div
                    key={t.id}
                    className={`flex ${t.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[75%] px-4 py-2 rounded-lg text-sm ${
                        t.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {t.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </>
  );
};

export default VoiceAgent;