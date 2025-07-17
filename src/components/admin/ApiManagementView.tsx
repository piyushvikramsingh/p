import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useSettings } from '../../contexts/SettingsContext';
import { Cpu, Save, KeySquare, Webhook, Shield, BarChart, Server, User, Calendar, CheckSquare, FolderOpen, Bot, DollarSign, Bell } from 'lucide-react';

const SettingCard: React.FC<{ title: string; icon: React.ElementType; children: React.ReactNode }> = ({ title, icon: Icon, children }) => (
  <motion.div
    className="bg-premium-dark-gray/60 rounded-2xl p-6 border border-white/10"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <div className="flex items-center space-x-3 mb-6">
      <div className="w-10 h-10 bg-premium-dark-gray rounded-xl flex items-center justify-center border border-white/10">
        <Icon className="w-5 h-5" style={{ color: useSettings().brandingSettings.iconColor }} />
      </div>
      <h3 className="text-lg font-semibold text-premium-platinum">{title}</h3>
    </div>
    <div className="space-y-4">{children}</div>
  </motion.div>
);

const ApiManagementView: React.FC = () => {
  const [rateLimit, setRateLimit] = useState(1000);
  const [apiKey, setApiKey] = useState('PAI-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');
  const [webhookUrl, setWebhookUrl] = useState('');
  const { brandingSettings } = useSettings();

  const handleSave = () => {
    toast.success('API settings saved!');
  };
  
  const coreApis = [
      { name: 'User API', purpose: 'CRUD operations for users', icon: User },
      { name: 'Auth API', purpose: 'Login, session management', icon: KeySquare },
      { name: 'Calendar API', purpose: 'Sync events and reminders', icon: Calendar },
      { name: 'Tasks API', purpose: 'Create and update tasks', icon: CheckSquare },
      { name: 'Files API', purpose: 'Upload, download, OCR', icon: FolderOpen },
      { name: 'AI Model API', purpose: 'Chat, voice, DeepSearch', icon: Bot },
      { name: 'Billing API', purpose: 'Subscriptions and invoices', icon: DollarSign },
      { name: 'Notification API', purpose: 'Send alerts via all channels', icon: Bell },
  ];

  return (
    <div className="h-full bg-premium-dark overflow-y-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-premium-platinum">API Management</h1>
          <p className="text-premium-light-gray/70">Monitor and secure your application's APIs.</p>
        </div>
        <motion.button onClick={handleSave} className="flex items-center space-x-2 px-4 py-2 bg-premium-gold text-black rounded-xl hover:opacity-90 shadow-lg shadow-premium-gold/30 text-sm">
          <Save className="w-4 h-4" /><span>Save Changes</span>
        </motion.button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="lg:col-span-2 bg-premium-dark-gray/60 rounded-2xl p-6 border border-white/10">
            <h2 className="text-lg font-semibold text-premium-platinum mb-4">Core APIs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {coreApis.map(api => (
                    <div key={api.name} className="bg-premium-dark-gray/50 p-4 rounded-lg border border-white/10">
                        <api.icon className="w-6 h-6 mb-2" style={{ color: brandingSettings.iconColor }} />
                        <h4 className="font-semibold">{api.name}</h4>
                        <p className="text-xs text-premium-light-gray/70">{api.purpose}</p>
                        <div className="flex items-center text-xs text-green-400 mt-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full mr-1.5"></div>
                            Operational
                        </div>
                    </div>
                ))}
            </div>
        </div>
        
        <SettingCard title="Rate Limiting" icon={BarChart}>
          <label className="text-sm font-medium text-premium-platinum">Requests per minute</label>
          <p className="text-xs text-premium-light-gray/60">Set the maximum number of API requests allowed per user per minute.</p>
          <input
            type="number"
            value={rateLimit}
            onChange={(e) => setRateLimit(parseInt(e.target.value))}
            className="w-full p-2 bg-premium-dark-gray border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-premium-gold"
          />
        </SettingCard>

        <SettingCard title="API Keys & OAuth" icon={KeySquare}>
          <p className="text-sm text-premium-light-gray/70">Manage developer API keys and third-party application access.</p>
          <div className="flex items-center space-x-2">
            <input type="text" readOnly value={apiKey} className="flex-1 p-2 bg-premium-dark border border-white/10 rounded-lg font-mono text-xs" />
            <button className="px-3 py-2 text-sm bg-premium-medium-gray rounded-lg">Regenerate</button>
          </div>
          <button className="text-sm text-premium-gold hover:underline">Manage OAuth 2.0 Applications</button>
        </SettingCard>

        <SettingCard title="Webhooks" icon={Webhook}>
          <p className="text-sm text-premium-light-gray/70">Send real-time updates to external services.</p>
          <input
            type="url"
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            placeholder="https://example.com/webhook"
            className="w-full p-2 bg-premium-dark-gray border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-premium-gold"
          />
           <button className="text-sm bg-premium-medium-gray px-4 py-2 rounded-lg w-full">Add Webhook</button>
        </SettingCard>

        <SettingCard title="API Security" icon={Shield}>
            <div className="flex items-center justify-between text-sm">
                <p>CORS Policies</p>
                <button className="text-premium-gold hover:underline">Configure</button>
            </div>
            <div className="flex items-center justify-between text-sm">
                <p>Request/Response Logging</p>
                <span className="text-green-400">Enabled</span>
            </div>
            <div className="flex items-center justify-between text-sm">
                <p>Endpoint Permissions (IAM)</p>
                <button className="text-premium-gold hover:underline">Manage Roles</button>
            </div>
        </SettingCard>
      </div>
    </div>
  );
};

export default ApiManagementView;
