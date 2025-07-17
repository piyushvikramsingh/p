import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminSidebar from './AdminSidebar';
import AdminDashboard from './AdminDashboard';
import UserManagementView from './UserManagementView';
import AuthSettingsView from './AuthSettingsView';
import NotificationsView from './NotificationsView';
import LogsView from './LogsView';

const AdminView: React.FC = () => {
  const [activeAdminTab, setActiveAdminTab] = useState('dashboard');

  const renderContent = () => {
    const contentVariants = {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
      transition: { duration: 0.3 }
    };

    const componentMap: { [key: string]: React.ReactNode } = {
      dashboard: <AdminDashboard />,
      users: <UserManagementView />,
      auth: <AuthSettingsView />,
      notifications: <NotificationsView />,
      logs: <LogsView />,
    };

    return (
      <motion.div
        key={activeAdminTab}
        variants={contentVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="h-full"
      >
        {componentMap[activeAdminTab] || <AdminDashboard />}
      </motion.div>
    );
  };

  return (
    <div className="flex h-full bg-premium-dark">
      <AdminSidebar activeTab={activeAdminTab} setActiveTab={setActiveAdminTab} />
      <main className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {renderContent()}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default AdminView;
