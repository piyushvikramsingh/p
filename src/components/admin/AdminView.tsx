// src/components/admin/AdminView.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Users, 
  Settings, 
  BarChart3, 
  Database, 
  Bell, 
  Lock,
  Activity,
  FileText,
  Globe,
  Zap,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const AdminView: React.FC = () => {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('overview');

  // Mock data for demonstration
  const stats = [
    { label: 'Total Users', value: '1,234', change: '+12%', icon: Users, color: 'text-blue-400' },
    { label: 'Active Sessions', value: '89', change: '+5%', icon: Activity, color: 'text-green-400' },
    { label: 'API Calls', value: '45.2K', change: '+18%', icon: Zap, color: 'text-yellow-400' },
    { label: 'Storage Used', value: '2.4TB', change: '+8%', icon: Database, color: 'text-purple-400' },
  ];

  const recentActivity = [
    { action: 'New user registration', user: 'john.doe@example.com', time: '2 minutes ago', type: 'success' },
    { action: 'API rate limit exceeded', user: 'api-user-123', time: '5 minutes ago', type: 'warning' },
    { action: 'System backup completed', user: 'System', time: '1 hour ago', type: 'success' },
    { action: 'Failed login attempt', user: 'suspicious-user', time: '2 hours ago', type: 'error' },
  ];

  const adminSections = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'system', label: 'System Settings', icon: Settings },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'logs', label: 'System Logs', icon: FileText },
  ];

  if (user?.role !== 'Super Admin') {
    return (
      <div className="h-full bg-premium-dark flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-premium-platinum mb-2">Access Denied</h2>
          <p className="text-premium-light-gray/60">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  const StatCard: React.FC<{ stat: typeof stats[0] }> = ({ stat }) => {
    const Icon = stat.icon;
    return (
      <motion.div
        className="bg-premium-dark-gray/60 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-lg"
        whileHover={{ scale: 1.02, y: -2 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 rounded-xl bg-premium-dark-gray/60 flex items-center justify-center ${stat.color}`}>
            <Icon className="w-6 h-6" />
          </div>
          <span className="text-sm text-green-400 font-medium">{stat.change}</span>
        </div>
        <div>
          <p className="text-2xl font-bold text-premium-platinum mb-1">{stat.value}</p>
          <p className="text-sm text-premium-light-gray/60">{stat.label}</p>
        </div>
      </motion.div>
    );
  };

  const ActivityItem: React.FC<{ activity: typeof recentActivity[0] }> = ({ activity }) => {
    const getStatusIcon = () => {
      switch (activity.type) {
        case 'success': return <CheckCircle className="w-4 h-4 text-green-400" />;
        case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
        case 'error': return <AlertTriangle className="w-4 h-4 text-red-400" />;
        default: return <Clock className="w-4 h-4 text-blue-400" />;
      }
    };

    return (
      <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-premium-dark-gray/40 transition-colors">
        {getStatusIcon()}
        <div className="flex-1">
          <p className="text-sm text-premium-platinum">{activity.action}</p>
          <p className="text-xs text-premium-light-gray/60">{activity.user}</p>
        </div>
        <span className="text-xs text-premium-light-gray/50">{activity.time}</span>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <StatCard key={index} stat={stat} />
              ))}
            </div>

            {/* Recent Activity */}
            <div className="bg-premium-dark-gray/60 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-lg">
              <h3 className="text-lg font-semibold text-premium-platinum mb-4 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-premium-gold" />
                Recent Activity
              </h3>
              <div className="space-y-2">
                {recentActivity.map((activity, index) => (
                  <ActivityItem key={index} activity={activity} />
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.button
                className="bg-premium-dark-gray/60 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-lg hover:border-premium-gold/50 transition-all text-left"
                whileHover={{ scale: 1.02, y: -2 }}
              >
                <Users className="w-8 h-8 text-blue-400 mb-3" />
                <h4 className="text-lg font-semibold text-premium-platinum mb-2">Manage Users</h4>
                <p className="text-sm text-premium-light-gray/60">View and manage user accounts</p>
              </motion.button>

              <motion.button
                className="bg-premium-dark-gray/60 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-lg hover:border-premium-gold/50 transition-all text-left"
                whileHover={{ scale: 1.02, y: -2 }}
              >
                <Settings className="w-8 h-8 text-green-400 mb-3" />
                <h4 className="text-lg font-semibold text-premium-platinum mb-2">System Config</h4>
                <p className="text-sm text-premium-light-gray/60">Configure system settings</p>
              </motion.button>

              <motion.button
                className="bg-premium-dark-gray/60 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-lg hover:border-premium-gold/50 transition-all text-left"
                whileHover={{ scale: 1.02, y: -2 }}
              >
                <BarChart3 className="w-8 h-8 text-purple-400 mb-3" />
                <h4 className="text-lg font-semibold text-premium-platinum mb-2">View Analytics</h4>
                <p className="text-sm text-premium-light-gray/60">Analyze usage patterns</p>
              </motion.button>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="bg-premium-dark-gray/60 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-lg text-center">
            <div className="w-16 h-16 bg-premium-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Settings className="w-8 h-8 text-premium-gold" />
            </div>
            <h3 className="text-xl font-semibold text-premium-platinum mb-2">
              {adminSections.find(s => s.id === activeSection)?.label}
            </h3>
            <p className="text-premium-light-gray/60">
              This section is under development. More admin features coming soon.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="h-full bg-premium-dark flex overflow-hidden">
      {/* Admin Sidebar */}
      <div className="w-64 bg-premium-dark-gray/60 border-r border-white/10 p-4 flex-shrink-0">
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-premium-light-gray/70 mb-3 px-3">Admin Panel</h3>
            <div className="space-y-1">
              {adminSections.map((section) => {
                const Icon = section.icon;
                return (
                  <motion.button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center p-3 rounded-xl transition-colors ${
                      activeSection === section.id
                        ? 'bg-premium-gold text-black'
                        : 'text-premium-light-gray hover:bg-premium-dark-gray/60'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon className="w-4 h-4 mr-3" />
                    <span className="text-sm">{section.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Admin Info */}
          <div className="bg-premium-dark-gray/40 rounded-xl p-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-premium-gold rounded-full flex items-center justify-center">
                <Shield className="w-4 h-4 text-black" />
              </div>
              <div>
                <p className="text-sm font-medium text-premium-platinum">Admin Access</p>
                <p className="text-xs text-premium-light-gray/60">{user.name}</p>
              </div>
            </div>
            <div className="text-xs text-premium-light-gray/60">
              <p>Last login: {new Date().toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-premium-dark border-b border-white/10 p-6 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gold-diamond-gradient rounded-xl flex items-center justify-center shadow-lg shadow-premium-gold/20">
                <Shield className="w-5 h-5 text-black" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gold-diamond-gradient bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-premium-light-gray/70 text-sm">
                  System administration and management
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <motion.button
                className="p-2 rounded-xl hover:bg-premium-dark-gray transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Bell className="w-5 h-5 text-premium-light-gray" />
              </motion.button>
              <motion.button
                className="p-2 rounded-xl hover:bg-premium-dark-gray transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Globe className="w-5 h-5 text-premium-light-gray" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminView;
