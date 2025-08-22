import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  MessageCircle, 
  X,
  Send,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const VoiceAgent = () => {
  const [isListening, setIsListening] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'agent',
      content: "Hello! I'm your HackMarine assistant. Ask me about marine conservation, sensor data, or environmental projects.",
      timestamp: new Date(),
      isVoice: false
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Mock responses for demo
  const responses = [
    "Based on our latest sensor data, the coral reef health in Andaman has improved by 23% this month!",
    "I found 3 active marine conservation projects in your area that need volunteers.",
    "The current plastic pollution levels are concerning. Would you like me to suggest cleanup initiatives?",
    "Great question! Our AI predicts a 15% increase in marine biodiversity if current conservation efforts continue.",
    "I can help you connect with local NGOs working on ocean cleanup. Shall I show you the options?"
  ];

  const handleVoiceToggle = () => {
    if (!isListening) {
      // Start voice recognition
      setIsListening(true);
      setIsExpanded(true);
      
      // Simulate voice recognition for demo
      setTimeout(() => {
        setIsListening(false);
        handleSendMessage("What's the status of coral reefs in Andaman?", true);
      }, 3000);
    } else {
      setIsListening(false);
    }
  };

  const handleSendMessage = (text = inputText, isVoice = false) => {
    if (!text.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: text,
      timestamp: new Date(),
      isVoice
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      setIsTyping(false);
      setIsSpeaking(true);
      
      const agentMessage = {
        id: messages.length + 2,
        type: 'agent',
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
        isVoice: false
      };

      setMessages(prev => [...prev, agentMessage]);

      // Simulate speech synthesis
      setTimeout(() => {
        setIsSpeaking(false);
      }, 2000);
    }, 1500);
  };

  const quickQuestions = [
    "Show coral reef status",
    "Find cleanup events",
    "Check sensor data",
    "Marine biodiversity trends"
  ];

  return (
    <>
      {/* Floating Voice Button */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ 
          duration: 0.8, 
          delay: 2,
          type: "spring",
          stiffness: 100 
        }}
        className="fixed bottom-6 right-6 z-50"
      >
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            size="lg"
            onClick={handleVoiceToggle}
            className={`
              w-16 h-16 rounded-full shadow-depth transition-all duration-300
              ${isListening 
                ? 'coral-gradient animate-pulse-marine' 
                : 'marine-gradient hover:shadow-marine'
              }
            `}
          >
            {isListening ? (
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                <Mic className="w-6 h-6 text-white" />
              </motion.div>
            ) : (
              <Mic className="w-6 h-6 text-white" />
            )}
          </Button>
        </motion.div>

        {/* Listening indicator */}
        <AnimatePresence>
          {isListening && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="absolute -top-12 left-1/2 transform -translate-x-1/2"
            >
              <Badge className="coral-gradient text-white">
                <Volume2 className="w-3 h-3 mr-1" />
                Listening...
              </Badge>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Speaking indicator */}
        <AnimatePresence>
          {isSpeaking && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="absolute -top-12 left-1/2 transform -translate-x-1/2"
            >
              <Badge className="algae-gradient text-white">
                <Volume2 className="w-3 h-3 mr-1" />
                Speaking...
              </Badge>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Chat Interface */}
      <AnimatePresence>
        {isExpanded && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
              onClick={() => setIsExpanded(false)}
            />
            
            {/* Chat Panel */}
            <motion.div
              initial={{ opacity: 0, y: 100, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.9 }}
              transition={{ 
                type: "spring",
                stiffness: 300,
                damping: 30
              }}
              className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-3rem)] z-50"
            >
              <Card className="shadow-depth border-2 border-primary/20">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <div className="w-3 h-3 bg-accent rounded-full animate-pulse" />
                      Marine AI Assistant
                    </CardTitle>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setIsExpanded(false)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Messages */}
                  <div className="max-h-64 overflow-y-auto space-y-3">
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`
                            max-w-[80%] p-3 rounded-lg text-sm
                            ${message.type === 'user'
                              ? 'marine-gradient text-white'
                              : 'bg-muted text-muted-foreground'
                            }
                          `}
                        >
                          <div className="flex items-center gap-1 mb-1">
                            {message.isVoice && (
                              <Mic className="w-3 h-3" />
                            )}
                            <span className="text-xs opacity-70">
                              {message.type === 'user' ? 'You' : 'Marine AI'}
                            </span>
                          </div>
                          {message.content}
                        </div>
                      </motion.div>
                    ))}
                    
                    {/* Typing indicator */}
                    {isTyping && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-start"
                      >
                        <div className="bg-muted p-3 rounded-lg">
                          <div className="flex items-center gap-1">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span className="text-sm text-muted-foreground">
                              Marine AI is thinking...
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Quick Questions */}
                  <div className="grid grid-cols-2 gap-2">
                    {quickQuestions.map((question, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSendMessage(question)}
                        className="p-2 text-xs bg-primary/10 hover:bg-primary/20 rounded-lg text-left transition-colors"
                      >
                        {question}
                      </motion.button>
                    ))}
                  </div>

                  {/* Input */}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type your question..."
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1"
                    />
                    <Button
                      size="sm"
                      onClick={() => handleSendMessage()}
                      disabled={!inputText.trim()}
                      className="algae-gradient text-white"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Voice Controls */}
                  <div className="flex justify-between items-center pt-2 border-t border-border">
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleVoiceToggle}
                        className={isListening ? 'coral-gradient text-white' : ''}
                      >
                        {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                      </Button>
                      <span className="text-xs text-muted-foreground">
                        {isListening ? 'Stop listening' : 'Start voice chat'}
                      </span>
                    </div>
                    
                    <Badge variant="outline" className="text-xs">
                      🌊 Powered by HackMarine AI
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default VoiceAgent;