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
  Calendar
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
    { id: 4, title: 'Marketing campaign strategy', time: '4d ago', isActive: false },
    { id: 5, title: 'Backend API integration plan', time: '5d ago', isActive: false },
    { id: 6, title: 'Q4 financial report review', time: '6d ago', isActive: false },
    { id: 7, title: 'New feature brainstorming session', time: '1w ago', isActive: false },
  ];

  const handleNewChat = () => {
    setActiveTab('chat');
  };

  return (
    <motion.aside
      className="bg-premium-dark border-r border-white/10 flex flex-col h-full relative flex-shrink-0"
      initial={{ width: 280 }}
      animate={{ 
        width: isCollapsed ? 80 : 280 
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      style={{ overflow: 'hidden' }}
    >
      {/* Collapse Toggle */}
      <motion.button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute top-6 -right-3 w-6 h-6 bg-premium-dark-gray border border-white/20 rounded-full flex items-center justify-center shadow-lg z-20 hover:shadow-xl transition-all duration-200 hover:bg-premium-medium-gray"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <motion.div
          animate={{ rotate: isCollapsed ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronLeft className="w-3 h-3 text-premium-light-gray" />
        </motion.div>
      </motion.button>

      {/* New Chat Button */}
      <div className="p-4 border-b border-white/10 flex-shrink-0" style={{ overflow: 'hidden' }}>
        <motion.button
          onClick={handleNewChat}
          className="w-full flex items-center justify-center px-4 py-3 rounded-xl bg-gold-diamond-gradient text-black transition-all duration-200 shadow-lg hover:shadow-gold-glow"
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus className="w-5 h-5 flex-shrink-0" />
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.span 
                className="font-semibold text-sm ml-3"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}
              >
                New Chat
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <div className="space-y-2">
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
                <Icon className="w-5 h-5 flex-shrink-0" />
                <AnimatePresence mode="wait">
                  {!isCollapsed && (
                    <motion.span
                      className="font-medium text-sm ml-3"
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                      style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}
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
        </div>

        {/* Recent Chats Section */}
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.div
              className="pt-6"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="text-xs font-semibold text-premium-light-gray/50 uppercase tracking-wider mb-3 px-4">
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
      </nav>

      {/* Bottom Navigation - Fixed positioning */}
      <div className="p-4 border-t border-white/10 bg-premium-dark flex-shrink-0" style={{ overflow: 'hidden' }}>
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
                transition={{ delay: 0.4 + index * 0.05 }}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <AnimatePresence mode="wait">
                  {!isCollapsed && (
                    <motion.span
                      className="font-medium text-sm ml-3"
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                      style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}
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
    </motion.aside>
  );
};

export default Sidebar;
