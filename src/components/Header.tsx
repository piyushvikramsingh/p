import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Bell, Search, MoreHorizontal, User, LogOut, MessageSquare } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { useSettings } from '../contexts/SettingsContext';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { notifications, markNotificationsAsRead } = useApp();
  const { brandingSettings } = useSettings();
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);
  
  const unreadCount = notifications.filter(n => !n.read).length;

  if (!user) return null;

  const handleNotifClick = () => {
    setIsNotifDropdownOpen(!isNotifDropdownOpen);
    if (!isNotifDropdownOpen) {
      markNotificationsAsRead();
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const userInitials = getInitials(user.name);

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
            {brandingSettings.logoUrl ? (
              <img src={brandingSettings.logoUrl} alt="Logo" className="w-6 h-6 object-contain" />
            ) : (
              <span className="text-black font-bold text-sm">{userInitials.charAt(0)}</span>
            )}
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
        <div className="relative">
          <motion.button
            onClick={handleNotifClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative p-2 rounded-xl hover:bg-premium-dark-gray transition-colors"
          >
            <Bell className="w-5 h-5 text-premium-light-gray" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 text-xs bg-red-500 rounded-full border-2 border-premium-dark flex items-center justify-center text-white">
                {unreadCount}
              </span>
            )}
          </motion.button>
          <AnimatePresence>
            {isNotifDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-3 w-80 bg-premium-dark-gray rounded-xl border border-white/10 shadow-lg z-20 origin-top-right"
                onMouseLeave={() => setIsNotifDropdownOpen(false)}
              >
                <div className="p-3 border-b border-white/10">
                  <h3 className="font-semibold text-premium-platinum">Notifications</h3>
                </div>
                <ul className="p-2 max-h-80 overflow-y-auto">
                  {notifications.length > 0 ? notifications.map(notif => (
                    <li key={notif.id} className="p-3 rounded-lg hover:bg-premium-medium-gray/50">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-premium-dark-gray/60 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <MessageSquare className="w-4 h-4 text-premium-gold"/>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-premium-platinum">{notif.title}</p>
                          <p className="text-xs text-premium-light-gray/80">{notif.message}</p>
                          <p className="text-xs text-premium-light-gray/50 mt-1">{new Date(notif.createdAt).toLocaleString()}</p>
                        </div>
                      </div>
                    </li>
                  )) : (
                    <li className="p-4 text-center text-sm text-premium-light-gray/70">No new notifications.</li>
                  )}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

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
        <div className="relative">
          <motion.div 
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="relative">
              <div className="w-9 h-9 bg-gold-diamond-gradient rounded-full flex items-center justify-center shadow-md shadow-premium-gold/20">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} className="w-9 h-9 rounded-full object-cover" />
                ) : (
                  <span className="text-black font-semibold text-sm">{userInitials}</span>
                )}
              </div>
            </div>
            <div className="hidden lg:block">
              <p className="text-sm font-semibold text-premium-platinum group-hover:text-premium-gold transition-colors">
                {user.name.split(' ')[0]}
              </p>
              <p className="text-xs text-premium-light-gray/70">{user.role}</p>
            </div>
            <MoreHorizontal className="w-4 h-4 text-premium-light-gray/50 group-hover:text-premium-light-gray transition-colors" />
          </motion.div>

          <AnimatePresence>
            {isUserDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-3 w-48 bg-premium-dark-gray rounded-xl border border-white/10 shadow-lg z-20 origin-top-right"
                onMouseLeave={() => setIsUserDropdownOpen(false)}
              >
                <ul className="p-2">
                  <li className="px-3 py-2">
                    <p className="text-sm font-semibold text-premium-platinum">{user.name}</p>
                    <p className="text-xs text-premium-light-gray/60 truncate">{user.email}</p>
                  </li>
                  <li className="h-px bg-white/10 my-1"></li>
                  <li>
                    <button className="w-full flex items-center space-x-3 px-3 py-2 text-sm rounded-lg transition-colors text-premium-light-gray hover:bg-premium-medium-gray/50">
                      <User className="w-4 h-4" /><span>Profile</span>
                    </button>
                  </li>
                  <li>
                    <button onClick={logout} className="w-full flex items-center space-x-3 px-3 py-2 text-sm rounded-lg transition-colors text-red-400 hover:bg-red-500/10">
                      <LogOut className="w-4 h-4" /><span>Logout</span>
                    </button>
                  </li>
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.header>
  );
};

export default Header;
