import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Heart, Share2, Send, User, Globe, Leaf } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const mockPosts = [
  {
    id: 1,
    user: { name: "Priya Sharma", avatar: "/api/placeholder/40/40", location: "Mumbai, India" },
    content: "Just spotted a family of dolphins near Gateway of India! Marine life is returning to Mumbai waters. #MarineConservation 🐬",
    timestamp: "2 minutes ago",
    likes: 24,
    comments: 5,
    tags: ["marine", "mumbai", "conservation"],
    type: "sighting"
  },
  {
    id: 2,
    user: { name: "Raj Patel", avatar: "/api/placeholder/40/40", location: "Gujarat, India" },
    content: "Completed coral reef restoration training with @HackMarine. Ready to make a difference in the Andaman waters! 🪸",
    timestamp: "15 minutes ago",
    likes: 67,
    comments: 12,
    tags: ["coral", "training", "restoration"],
    type: "achievement"
  },
  {
    id: 3,
    user: { name: "Marine NGO Kerala", avatar: "/api/placeholder/40/40", location: "Kerala, India" },
    content: "Emergency: Oil spill detected 15km off Kochi coast. Mobilizing cleanup volunteers. Contact us if you can help! 🆘",
    timestamp: "1 hour ago",
    likes: 156,
    comments: 28,
    tags: ["emergency", "cleanup", "volunteer"],
    type: "alert"
  },
  {
    id: 4,
    user: { name: "Arjun Reddy", avatar: "/api/placeholder/40/40", location: "Andhra Pradesh, India" },
    content: "Our AI sensor network detected unusual temperature patterns in coastal areas. Sharing data with research community.",
    timestamp: "3 hours ago",
    likes: 89,
    comments: 15,
    tags: ["ai", "sensor", "data"],
    type: "data"
  }
];

const PostCard = ({ post, index }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
  };

  const getTypeColor = (type) => {
    switch(type) {
      case 'alert': return 'coral';
      case 'achievement': return 'algae';
      case 'sighting': return 'marine';
      default: return 'marine';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        type: "spring",
        stiffness: 100
      }}
    >
      <Card className={`hover:shadow-${getTypeColor(post.type)} transition-all duration-500 transform hover:-translate-y-2 group`}>
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
                <Badge variant="outline" className="text-xs">
                  <Globe className="w-3 h-3 mr-1" />
                  {post.user.location}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">{post.timestamp}</p>
            </div>
            <Badge 
              variant="outline" 
              className={`${getTypeColor(post.type)}-gradient text-white`}
            >
              {post.type}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <p className="text-sm leading-relaxed mb-4 group-hover:text-foreground transition-colors">
            {post.content}
          </p>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
          
          {/* Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleLike}
                className={`flex items-center gap-1 text-sm transition-colors ${
                  liked ? 'text-secondary' : 'text-muted-foreground hover:text-secondary'
                }`}
              >
                <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
                {likeCount}
              </motion.button>
              
              <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
                <MessageCircle className="w-4 h-4" />
                {post.comments}
              </button>
              
              <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-accent transition-colors">
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>
            
            <Button size="sm" variant="ghost" className="text-xs hover:bg-primary/10">
              View Details
            </Button>
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
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <Card className="glass-marine shadow-marine">
        <CardContent className="p-6">
          <div className="flex gap-4">
            <Avatar className="w-12 h-12 ring-2 ring-primary/20">
              <AvatarFallback className="bg-primary text-white">
                <User className="w-6 h-6" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-4">
              <Input
                placeholder="Share your environmental observations, data, or call for action..."
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
                        <Leaf className="w-3 h-3 mr-1" />
                        #Environment
                      </Badge>
                      <Badge variant="outline" className="cursor-pointer hover:bg-secondary/20">
                        📸 Add Photo
                      </Badge>
                      <Badge variant="outline" className="cursor-pointer hover:bg-primary/20">
                        📍 Location
                      </Badge>
                    </div>
                    
                    <Button 
                      size="sm" 
                      className="coral-gradient text-white hover:shadow-coral"
                      disabled={!postText.trim()}
                    >
                      <Send className="w-4 h-4 mr-1" />
                      Post
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const CommunityFeed = () => {
  const [posts, setPosts] = useState(mockPosts);
  const [filter, setFilter] = useState('all');

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly update like counts
      setPosts(prevPosts => 
        prevPosts.map(post => ({
          ...post,
          likes: post.likes + Math.floor(Math.random() * 3)
        }))
      );
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const filteredPosts = filter === 'all' 
    ? posts 
    : posts.filter(post => post.type === filter);

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
          Community <span className="text-accent">Feed</span>
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Connect with environmental enthusiasts, share observations, and collaborate on conservation efforts
        </p>
      </motion.div>

      {/* Post Composer */}
      <div className="mb-8">
        <PostComposer />
      </div>

      {/* Filter Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="flex flex-wrap justify-center gap-4 mb-8"
      >
        {[
          { key: 'all', label: 'All Posts', count: posts.length },
          { key: 'sighting', label: 'Sightings', count: posts.filter(p => p.type === 'sighting').length },
          { key: 'alert', label: 'Alerts', count: posts.filter(p => p.type === 'alert').length },
          { key: 'achievement', label: 'Achievements', count: posts.filter(p => p.type === 'achievement').length },
          { key: 'data', label: 'Data Sharing', count: posts.filter(p => p.type === 'data').length }
        ].map((tab) => (
          <Button
            key={tab.key}
            variant={filter === tab.key ? 'default' : 'outline'}
            onClick={() => setFilter(tab.key)}
            className={
              filter === tab.key 
                ? 'marine-gradient text-white' 
                : 'hover:bg-primary/10'
            }
          >
            {tab.label}
            <Badge variant="secondary" className="ml-2">
              {tab.count}
            </Badge>
          </Button>
        ))}
      </motion.div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <AnimatePresence mode="popLayout">
          {filteredPosts.map((post, index) => (
            <PostCard key={post.id} post={post} index={index} />
          ))}
        </AnimatePresence>
      </div>

      {/* Load More */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center"
      >
        <Button 
          size="lg" 
          variant="outline"
          className="marine-gradient text-white hover:shadow-marine"
        >
          Load More Posts
        </Button>
      </motion.div>
    </section>
  );
};

export default CommunityFeed;