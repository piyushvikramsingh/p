import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Plus, 
  Settings, 
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Home,
  CheckSquare,
  Brain,
  FolderOpen,
  Calendar,
  Crown,
  Star,
  Zap
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'chat', label: 'Chat', icon: MessageSquare },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'memory', label: 'Memory', icon: Brain },
    { id: 'files', label: 'Files', icon: FolderOpen },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
  ];

  const bottomItems = [
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'help', label: 'Help', icon: HelpCircle },
  ];

  const recentChats = [
    { id: 1, title: 'React optimization tips', time: '2h ago', isActive: true },
    { id: 2, title: 'Data analysis workflow', time: '1d ago', isActive: false },
    { id: 3, title: 'UI/UX best practices', time: '3d ago', isActive: false },
  ];

  const handleNewChat = () => {
    setActiveTab('chat');
  };

  return (
    <motion.aside
      className="bg-premium-dark/95 backdrop-blur-xl border-r border-white/10 flex flex-col h-full relative"
      initial={{ x: -300 }}
      animate={{ 
        x: 0, 
        width: isCollapsed ? 72 : 280 
      }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      {/* Collapse Toggle */}
      <motion.button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute top-6 -right-3 w-6 h-6 bg-premium-dark-gray border border-white/20 rounded-full flex items-center justify-center shadow-lg z-10 hover:shadow-xl transition-all duration-200 hover:bg-premium-medium-gray"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isCollapsed ? (
          <ChevronRight className="w-3 h-3 text-premium-light-gray" />
        ) : (
          <ChevronLeft className="w-3 h-3 text-premium-light-gray" />
        )}
      </motion.button>

      {/* New Chat Button */}
      <div className="p-4 border-b border-white/10">
        <motion.button
          onClick={handleNewChat}
          className="w-full flex items-center justify-center px-4 py-3 rounded-xl bg-gold-diamond-gradient text-black transition-all duration-200 shadow-lg hover:shadow-gold-glow"
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus className={`w-5 h-5 ${isCollapsed ? '' : 'mr-3'}`} />
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span 
                className="font-semibold text-sm"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                New Chat
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <motion.button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 group relative ${
                isActive
                  ? 'bg-premium-dark-gray text-premium-gold'
                  : 'text-premium-light-gray/70 hover:bg-premium-dark-gray/50 hover:text-premium-platinum'
              }`}
              whileHover={{ scale: 1.02, x: 2 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Icon className={`w-5 h-5 ${isCollapsed ? 'mx-auto' : 'mr-3'}`} />
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span
                    className="font-medium text-sm"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
              {isActive && (
                <motion.div
                  className="absolute left-0 top-0 bottom-0 w-1 bg-premium-gold rounded-r-full"
                  layoutId="activeTab"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* Recent Chats */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            className="flex-1 px-4 py-2 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-xs font-semibold text-premium-light-gray/50 uppercase tracking-wider mb-3">
              Recent
            </h3>
            <div className="space-y-1">
              {recentChats.map((chat, index) => (
                <motion.div
                  key={chat.id}
                  className={`group p-3 rounded-xl cursor-pointer transition-all duration-200 relative ${
                    chat.isActive 
                      ? 'bg-premium-dark-gray text-premium-gold' 
                      : 'hover:bg-premium-dark-gray/50 text-premium-light-gray hover:text-premium-platinum'
                  }`}
                  whileHover={{ scale: 1.01, x: 2 }}
                  onClick={() => setActiveTab('chat')}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <p className="text-sm font-medium truncate">
                    {chat.title}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Section */}
      <div className="mt-auto">
        {/* Upgrade Section */}
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              className="p-4 border-t border-white/10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.3 }}
            >
              <div className="relative bg-premium-dark backdrop-blur-xl rounded-2xl p-5 border border-white/10 shadow-xl overflow-hidden">
                {/* Background gradient effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-premium-gold/5 via-premium-diamond/5 to-premium-platinum/5 rounded-2xl" />
                
                <div className="relative z-10">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 bg-gold-diamond-gradient rounded-xl flex items-center justify-center shadow-lg">
                      <Crown className="w-4 h-4 text-black" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-premium-platinum">Upgrade to Pro</h3>
                      <p className="text-xs text-premium-light-gray/60">Unlock unlimited power</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2">
                      <Star className="w-3 h-3 text-premium-gold" />
                      <span className="text-xs text-premium-light-gray/80">Unlimited conversations</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Zap className="w-3 h-3 text-premium-diamond" />
                      <span className="text-xs text-premium-light-gray/80">Priority support</span>
                    </div>
                  </div>
                  
                  <motion.button 
                    className="w-full bg-gold-diamond-gradient text-black px-4 py-2.5 rounded-xl text-sm font-bold shadow-lg hover:shadow-gold-glow transition-all duration-200"
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Start Free Trial
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Navigation */}
        <div className="p-4 border-t border-white/10 bg-premium-dark backdrop-blur-xl">
          <div className="space-y-2">
            {bottomItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <motion.button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 group relative ${
                    isActive
                      ? 'bg-premium-dark-gray text-premium-gold'
                      : 'text-premium-light-gray/70 hover:bg-premium-dark-gray/50 hover:text-premium-platinum'
                  }`}
                  whileHover={{ scale: 1.02, x: 2 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Icon className={`w-5 h-5 ${isCollapsed ? 'mx-auto' : 'mr-3'}`} />
                  <AnimatePresence>
                    {!isCollapsed && (
                      <motion.span
                        className="font-medium text-sm"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {isActive && (
                    <motion.div
                      className="absolute left-0 top-0 bottom-0 w-1 bg-premium-gold rounded-r-full"
                      layoutId="activeBottomTab"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
