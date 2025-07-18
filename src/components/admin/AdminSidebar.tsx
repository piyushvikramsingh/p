import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Users, KeyRound, Bell, History, Database, Wand2, Cpu, Palette, Puzzle, Archive } from 'lucide-react';

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'auth', label: 'Authentication', icon: KeyRound },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'api', label: 'API Management', icon: Cpu },
    { id: 'storage', label: 'Data Storage', icon: Database },
    { id: 'automation', label: 'Automation', icon: Wand2 },
    { id: 'logs', label: 'Logs & Audits', icon: History },
    { id: 'branding', label: 'Branding', icon: Palette },
    { id: 'integrations', label: 'Integrations', icon: Puzzle },
    { id: 'backups', label: 'Backups & Export', icon: Archive },
  ];

  return (
    <aside className="w-64 bg-premium-dark-gray/60 border-r border-white/10 p-4 flex flex-col">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-premium-platinum px-3">Admin Panel</h2>
        <p className="text-xs text-premium-light-gray/60 px-3">System Management</p>
      </div>
      <nav className="flex-1 space-y-2 overflow-y-auto pr-2">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <motion.button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-3 py-3 rounded-xl transition-all duration-200 group relative ${
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
              <span className="font-medium text-sm ml-3 text-left">{item.label}</span>
              {isActive && (
                <motion.div
                  className="absolute left-0 top-0 bottom-0 w-1 bg-premium-gold rounded-r-full"
                  layoutId="activeAdminTab"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
