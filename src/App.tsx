import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import RightPanel from './components/RightPanel';
import HomeView from './components/HomeView';
import SettingsView from './components/SettingsView';
import CalendarView from './components/CalendarView';
import FilesView from './components/FilesView';
import MemoryView from './components/MemoryView';
import TasksView from './components/TasksView';
import AdminView from './components/admin/AdminView';
import { useSettings } from './contexts/SettingsContext';
import { useAuth } from './contexts/AuthContext';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const { brandingSettings } = useSettings();
  const { user } = useAuth();

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--color-primary', brandingSettings.primaryColor);
    root.style.setProperty('--color-secondary', brandingSettings.secondaryColor);
  }, [brandingSettings.primaryColor, brandingSettings.secondaryColor]);

  // Redirect to login if user is not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-premium-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-premium-gold mx-auto mb-4"></div>
          <p className="text-premium-light-gray">Loading...</p>
        </div>
      </div>
    );
  }

  const renderMainContent = () => {
    const contentVariants = {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 }
    };

    const PlaceholderView: React.FC<{ title: string, description: string }> = ({ title, description }) => (
      <motion.div
        variants={contentVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.3 }}
        className="h-full bg-premium-dark overflow-y-auto"
      >
        <div className="max-w-4xl mx-auto px-6 py-16 flex flex-col items-center justify-center h-full">
          <div className="text-center space-y-6">
            <motion.div
              className="w-16 h-16 bg-gold-diamond-gradient rounded-2xl flex items-center justify-center shadow-2xl shadow-premium-gold/20 mx-auto"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <span className="text-black font-bold text-2xl">P</span>
            </motion.div>
            
            <h2 className="text-4xl font-bold bg-gold-diamond-gradient bg-clip-text text-transparent">{title}</h2>
            <p className="text-premium-light-gray/70 text-lg max-w-md mx-auto">{description}</p>
            
            <div className="bg-premium-dark-gray/60 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-lg mt-8">
              <p className="text-center text-premium-light-gray/60">Features for this section are coming soon...</p>
            </div>
          </div>
        </div>
      </motion.div>
    );

    switch (activeTab) {
      case 'home':
        return (
          <motion.div 
            key="home"
            variants={contentVariants} 
            initial="initial" 
            animate="animate" 
            exit="exit" 
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <HomeView />
          </motion.div>
        );
      case 'chat':
        return (
          <motion.div 
            key="chat"
            variants={contentVariants} 
            initial="initial" 
            animate="animate" 
            exit="exit" 
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <ChatWindow />
          </motion.div>
        );
      case 'settings':
        return (
          <motion.div 
            key="settings"
            variants={contentVariants} 
            initial="initial" 
            animate="animate" 
            exit="exit" 
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <SettingsView />
          </motion.div>
        );
      case 'calendar':
        return (
          <motion.div 
            key="calendar"
            variants={contentVariants} 
            initial="initial" 
            animate="animate" 
            exit="exit" 
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <CalendarView />
          </motion.div>
        );
      case 'files':
        return (
          <motion.div 
            key="files"
            variants={contentVariants} 
            initial="initial" 
            animate="animate" 
            exit="exit" 
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <FilesView />
          </motion.div>
        );
      case 'memory':
        return (
          <motion.div 
            key="memory"
            variants={contentVariants} 
            initial="initial" 
            animate="animate" 
            exit="exit" 
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <MemoryView />
          </motion.div>
        );
      case 'tasks':
        return (
          <motion.div 
            key="tasks"
            variants={contentVariants} 
            initial="initial" 
            animate="animate" 
            exit="exit" 
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <TasksView />
          </motion.div>
        );
      case 'admin':
        // Only show admin view for Super Admin users
        if (user.role === 'Super Admin') {
          return (
            <motion.div 
              key="admin"
              variants={contentVariants} 
              initial="initial" 
              animate="animate" 
              exit="exit" 
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <AdminView />
            </motion.div>
          );
        } else {
          // Redirect non-admin users
          setActiveTab('home');
          return null;
        }
      case 'help':
        return <PlaceholderView title="Help & Support" description="Get help and support for P.AI" />;
      default:
        return (
          <motion.div 
            key="default"
            variants={contentVariants} 
            initial="initial" 
            animate="animate" 
            exit="exit" 
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <HomeView />
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-premium-dark font-inter">
      <Header />
      <div className="flex h-[calc(100vh-4rem)]">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 overflow-hidden bg-premium-dark">
          <AnimatePresence mode="wait">
            {renderMainContent()}
          </AnimatePresence>
        </main>
        <AnimatePresence>
          {activeTab === 'chat' && <RightPanel />}
        </AnimatePresence>
      </div>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'rgba(26, 26, 26, 0.9)',
            color: '#E5E4E2',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          },
        }}
      />
    </div>
  );
};

export default App;
