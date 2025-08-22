import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  Heart, 
  Share2, 
  Send, 
  User, 
  Globe, 
  Leaf,
  Trophy,
  Medal,
  Crown,
  Star,
  Camera,
  MapPin,
  Hash,
  Users
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

const mockPosts = [
  {
    id: 1,
    user: { name: "Priya Sharma", avatar: "/api/placeholder/40/40", location: "Mumbai, India", level: "Marine Protector" },
    content: "Just spotted a family of dolphins near Gateway of India! Marine life is returning to Mumbai waters. #MarineConservation 🐬",
    timestamp: "2 minutes ago",
    likes: 24,
    comments: 5,
    shares: 3,
    tags: ["marine", "mumbai", "conservation"],
    type: "sighting",
    image: "/api/placeholder/400/200"
  },
  {
    id: 2,
    user: { name: "Raj Patel", avatar: "/api/placeholder/40/40", location: "Gujarat, India", level: "Coral Guardian" },
    content: "Completed coral reef restoration training with @HackMarine. Ready to make a difference in the Andaman waters! 🪸",
    timestamp: "15 minutes ago",
    likes: 67,
    comments: 12,
    shares: 8,
    tags: ["coral", "training", "restoration"],
    type: "achievement"
  },
  {
    id: 3,
    user: { name: "Marine NGO Kerala", avatar: "/api/placeholder/40/40", location: "Kerala, India", level: "Ocean Champion" },
    content: "Emergency: Oil spill detected 15km off Kochi coast. Mobilizing cleanup volunteers. Contact us if you can help! 🆘",
    timestamp: "1 hour ago",
    likes: 156,
    comments: 28,
    shares: 45,
    tags: ["emergency", "cleanup", "volunteer"],
    type: "alert"
  }
];

const leaderboard = [
  { id: 1, name: "Ocean Warrior", avatar: "/api/placeholder/50/50", points: 2450, badge: "👑", level: "Legend" },
  { id: 2, name: "Coral Keeper", avatar: "/api/placeholder/50/50", points: 2100, badge: "🥇", level: "Champion" },
  { id: 3, name: "Wave Rider", avatar: "/api/placeholder/50/50", points: 1890, badge: "🥈", level: "Champion" },
  { id: 4, name: "Deep Diver", avatar: "/api/placeholder/50/50", points: 1650, badge: "🥉", level: "Guardian" },
  { id: 5, name: "Sea Explorer", avatar: "/api/placeholder/50/50", points: 1420, badge: "⭐", level: "Guardian" }
];

const globalChatMessages = [
  { id: 1, user: "EcoWarrior", message: "Amazing coral restoration work in Lakshadweep!", time: "2m ago", online: true },
  { id: 2, user: "OceanGuard", message: "Anyone joining the beach cleanup in Chennai tomorrow?", time: "5m ago", online: true },
  { id: 3, user: "MarineDoc", message: "New research shows 15% improvement in coastal biodiversity!", time: "8m ago", online: false },
  { id: 4, user: "CoralQueen", message: "Check out these beautiful underwater shots from Andaman 📸", time: "12m ago", online: true }
];

const SocialPost = ({ post, index }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <Card className="hover:shadow-marine transition-all duration-500 group">
        <CardHeader className="pb-3">
          <div className="flex items-start gap-3">
            <Avatar className="w-12 h-12 ring-2 ring-primary/20">
              <AvatarImage src={post.user.avatar} alt={post.user.name} />
              <AvatarFallback className="bg-primary text-white">
                {post.user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-sm">{post.user.name}</h4>
                <Badge variant="outline" className="text-xs marine-gradient text-white">
                  {post.user.level}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Globe className="w-3 h-3" />
                {post.user.location} • {post.timestamp}
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <p className="text-sm leading-relaxed mb-4">
            {post.content}
          </p>
          
          {post.image && (
            <div className="mb-4 rounded-lg overflow-hidden">
              <img 
                src={post.image} 
                alt="Post content" 
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          )}
          
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs cursor-pointer hover:bg-primary/20">
                #{tag}
              </Badge>
            ))}
          </div>
          
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <div className="flex items-center gap-6">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleLike}
                className={`flex items-center gap-2 text-sm transition-colors ${
                  liked ? 'text-secondary' : 'text-muted-foreground hover:text-secondary'
                }`}
              >
                <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
                {likeCount}
              </motion.button>
              
              <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                <MessageCircle className="w-4 h-4" />
                {post.comments}
              </button>
              
              <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors">
                <Share2 className="w-4 h-4" />
                {post.shares}
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const PostComposer = () => {
  const [postText, setPostText] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="glass-marine shadow-marine mb-6">
      <CardContent className="p-6">
        <div className="flex gap-4">
          <Avatar className="w-12 h-12 ring-2 ring-primary/20">
            <AvatarFallback className="bg-primary text-white">
              <User className="w-6 h-6" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-4">
            <Input
              placeholder="Share your environmental impact, observations, or achievements..."
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              onFocus={() => setIsExpanded(true)}
              className="bg-transparent border-border focus:border-primary"
            />
            
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center justify-between"
                >
                  <div className="flex gap-2">
                    <Badge variant="outline" className="cursor-pointer hover:bg-accent/20">
                      <Camera className="w-3 h-3 mr-1" />
                      Photo
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-secondary/20">
                      <MapPin className="w-3 h-3 mr-1" />
                      Location
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-primary/20">
                      <Hash className="w-3 h-3 mr-1" />
                      Tags
                    </Badge>
                  </div>
                  
                  <Button 
                    size="sm" 
                    className="coral-gradient text-white hover:shadow-coral"
                    disabled={!postText.trim()}
                  >
                    <Send className="w-4 h-4 mr-1" />
                    Share
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Leaderboard = () => (
  <Card className="glass-marine shadow-marine">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Trophy className="w-5 h-5 text-secondary" />
        Top Contributors
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {leaderboard.map((user, index) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary/5 transition-colors"
          >
            <div className="text-2xl">{user.badge}</div>
            <Avatar className="w-10 h-10">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="font-semibold text-sm">{user.name}</div>
              <div className="text-xs text-muted-foreground">{user.level}</div>
            </div>
            <div className="text-right">
              <div className="font-bold text-primary">{user.points.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">points</div>
            </div>
          </motion.div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const GlobalChat = () => {
  const [message, setMessage] = useState('');

  return (
    <Card className="glass-marine shadow-marine h-96 flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5 text-accent" />
          Global Chat
          <Badge variant="secondary" className="ml-auto">
            247 online
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0">
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {globalChatMessages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-2"
            >
              <div className={`w-2 h-2 rounded-full mt-2 ${msg.online ? 'bg-accent' : 'bg-muted'}`} />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm">{msg.user}</span>
                  <span className="text-xs text-muted-foreground">{msg.time}</span>
                </div>
                <p className="text-sm">{msg.message}</p>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="p-4 border-t border-border">
          <div className="flex gap-2">
            <Input
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1"
            />
            <Button size="sm" className="marine-gradient text-white">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Social = () => {
  const [activeTab, setActiveTab] = useState('feed');

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-4">
            HackMarine <span className="text-accent">Community</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Connect, share, and collaborate with environmental enthusiasts worldwide
          </p>
        </motion.div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="feed">Social Feed</TabsTrigger>
            <TabsTrigger value="chat">Global Chat</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            <TabsTrigger value="challenges">Challenges</TabsTrigger>
          </TabsList>

          <TabsContent value="feed" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <PostComposer />
                {mockPosts.map((post, index) => (
                  <SocialPost key={post.id} post={post} index={index} />
                ))}
              </div>
              <div className="space-y-6">
                <Leaderboard />
                <Card className="glass-marine shadow-marine">
                  <CardHeader>
                    <CardTitle>Your Impact</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Level Progress</span>
                        <span>75%</span>
                      </div>
                      <Progress value={75} className="h-2" />
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-primary">1,247</div>
                        <div className="text-xs text-muted-foreground">Points</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-secondary">23</div>
                        <div className="text-xs text-muted-foreground">Posts</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="chat">
            <div className="max-w-4xl mx-auto">
              <GlobalChat />
            </div>
          </TabsContent>

          <TabsContent value="leaderboard">
            <div className="max-w-2xl mx-auto">
              <Leaderboard />
            </div>
          </TabsContent>

          <TabsContent value="challenges">
            <div className="text-center py-12">
              <Star className="w-16 h-16 mx-auto mb-4 text-accent" />
              <h3 className="text-2xl font-bold mb-2">Environmental Challenges</h3>
              <p className="text-muted-foreground mb-6">
                Participate in weekly challenges to earn points and badges
              </p>
              <Button className="coral-gradient text-white">
                View Active Challenges
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Social;