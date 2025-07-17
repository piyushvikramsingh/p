import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './contexts/ThemeContext';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import RightPanel from './components/RightPanel';
import HomeView from './components/HomeView';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');

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
        className="h-full bg-gradient-to-br from-premium-dark to-premium-dark-gray overflow-y-auto"
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
      case 'tasks':
        return <PlaceholderView title="Tasks Management" description="Organize and track your tasks efficiently" />;
      case 'memory':
        return <PlaceholderView title="AI Memory" description="Your personal AI knowledge base" />;
      case 'files':
        return <PlaceholderView title="My Files" description="Access and manage your documents" />;
      case 'calendar':
        return <PlaceholderView title="Calendar" description="Schedule and manage your appointments" />;
      case 'settings':
        return <PlaceholderView title="Settings" description="Customize your P.AI experience" />;
      default:
        return (
          <motion.div 
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
    <ThemeProvider>
      <div className="min-h-screen bg-premium-lighter-gray dark:bg-premium-dark font-inter">
        <Header />
        <div className="flex h-[calc(100vh-4rem)]">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          <main className="flex-1 overflow-hidden">
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
              background: 'rgba(26, 26, 26, 0.8)',
              color: '#E5E4E2',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            },
          }}
        />
      </div>
    </ThemeProvider>
  );
};

export default App;
