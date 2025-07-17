import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Bell, Search, MoreHorizontal } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <motion.header 
      className="h-16 bg-premium-dark/95 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-6 sticky top-0 z-50"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Logo */}
      <motion.div 
        className="flex items-center space-x-4"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <div className="relative">
          <div className="w-8 h-8 bg-gold-diamond-gradient rounded-xl flex items-center justify-center shadow-lg shadow-premium-gold/20">
            <span className="text-black font-bold text-sm">P</span>
          </div>
        </div>
        <div>
          <h1 className="text-xl font-bold bg-gold-diamond-gradient bg-clip-text text-transparent">
            P.AI
          </h1>
          <p className="text-xs text-premium-light-gray">Intelligent Assistant</p>
        </div>
      </motion.div>

      {/* Search Bar */}
      <motion.div 
        className="hidden md:flex items-center max-w-md mx-8 flex-1"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-premium-light-gray/50 w-4 h-4" />
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full pl-10 pr-4 py-2 bg-premium-dark-gray border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-premium-gold focus:border-transparent transition-all duration-200 text-sm placeholder:text-premium-light-gray/50 text-premium-platinum"
          />
        </div>
      </motion.div>

      {/* Right Section */}
      <motion.div 
        className="flex items-center space-x-2"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        {/* Notifications */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative p-2 rounded-xl hover:bg-premium-dark-gray transition-colors"
        >
          <Bell className="w-5 h-5 text-premium-light-gray" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-premium-dark"></span>
        </motion.button>

        {/* Settings */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 rounded-xl hover:bg-premium-dark-gray transition-colors"
        >
          <Settings className="w-5 h-5 text-premium-light-gray" />
        </motion.button>

        {/* Divider */}
        <div className="w-px h-6 bg-white/10 mx-2"></div>

        {/* User Profile */}
        <motion.div 
          className="flex items-center space-x-3 cursor-pointer group"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <div className="relative">
            <div className="w-9 h-9 bg-gold-diamond-gradient rounded-full flex items-center justify-center shadow-md shadow-premium-gold/20">
              <span className="text-black font-semibold text-sm">P</span>
            </div>
          </div>
          <div className="hidden lg:block">
            <p className="text-sm font-semibold text-premium-platinum group-hover:text-premium-gold transition-colors">
              Piyush
            </p>
            <p className="text-xs text-premium-light-gray/70">Pro Plan</p>
          </div>
          <MoreHorizontal className="w-4 h-4 text-premium-light-gray/50 group-hover:text-premium-light-gray transition-colors" />
        </motion.div>
      </motion.div>
    </motion.header>
  );
};

export default Header;
