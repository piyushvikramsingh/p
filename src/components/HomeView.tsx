import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Zap, Code, Lightbulb, TrendingUp, BookOpen, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const HomeView: React.FC = () => {
  const { user } = useAuth();
  
  const suggestions = [
    { title: 'Explain quantum computing', icon: Zap },
    { title: 'Write a React component', icon: Code },
    { title: 'Business strategy ideas', icon: Lightbulb },
    { title: 'Analyze market trends', icon: TrendingUp },
    { title: 'Create a study plan', icon: BookOpen },
    { title: 'Creative writing prompt', icon: MessageSquare },
  ];

  if (!user) return null;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const userInitials = getInitials(user.name);
  const firstName = user.name.split(' ')[0];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="h-full bg-premium-dark overflow-y-auto">
      <div className="max-w-4xl mx-auto px-6 py-8 flex flex-col items-center justify-center min-h-full">
        <motion.div
          className="space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            className="relative inline-block"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="w-24 h-24 bg-gold-diamond-gradient rounded-3xl flex items-center justify-center shadow-2xl shadow-premium-gold/20">
              {user.avatarUrl ? (
                <img 
                  src={user.avatarUrl} 
                  alt={user.name} 
                  className="w-24 h-24 rounded-3xl object-cover"
                />
              ) : (
                <span className="text-black font-bold text-4xl">{userInitials}</span>
              )}
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-premium-diamond rounded-full flex items-center justify-center shadow-lg">
              <Sparkles className="w-4 h-4 text-black" />
            </div>
          </motion.div>
          
          <div className="space-y-4 text-center">
            <motion.h1 
              className="text-5xl font-bold bg-gold-diamond-gradient bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {getGreeting()}, {firstName}!
            </motion.h1>
            <motion.p 
              className="text-premium-light-gray/70 text-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              What can I help you with today?
            </motion.p>
          </div>
        </motion.div>

        <motion.div
          className="w-full mt-12 max-w-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {suggestions.map((suggestion, index) => {
              const Icon = suggestion.icon;
              return (
                <motion.button
                  key={suggestion.title}
                  className="group relative bg-premium-dark-gray/80 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-premium-gold/50 transition-all duration-300 text-left overflow-hidden shadow-lg hover:shadow-gold-glow"
                  whileHover={{ scale: 1.02, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.05 }}
                  onClick={() => {
                    // This could integrate with a chat function later
                    console.log('Clicked suggestion:', suggestion.title);
                  }}
                >
                  <div className="relative z-10">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-premium-platinum group-hover:text-premium-gold transition-colors">
                        {suggestion.title}
                      </h3>
                      <Icon className="w-6 h-6 text-premium-light-gray/50 group-hover:text-premium-gold transition-colors" />
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          className="mt-12 text-center space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <p className="text-premium-light-gray/50 text-sm">
            P.AI can make mistakes. Consider checking important information.
          </p>
          
          {user.role === 'Super Admin' && (
            <motion.div
              className="inline-flex items-center px-4 py-2 bg-premium-gold/10 border border-premium-gold/30 rounded-xl"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.2 }}
            >
              <Sparkles className="w-4 h-4 text-premium-gold mr-2" />
              <span className="text-premium-gold font-medium text-sm">Admin Access Enabled</span>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default HomeView;
