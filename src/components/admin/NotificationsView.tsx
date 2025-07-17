import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Plus, Send, Mail, MessageSquare, Smartphone, Users, Calendar, Trash2, FileText, ToggleRight, TestTube2, Save } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useApp } from '../../contexts/AppContext';

type NotificationType = 'email' | 'in-app' | 'push' | 'sms';
type TargetAudience = 'all' | 'admins' | 'users' | 'pro-users';

interface SentNotification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  target: TargetAudience;
  sentAt: Date;
}

const SettingCard: React.FC<{ title: string; icon: React.ElementType; children: React.ReactNode; className?: string }> = ({ title, icon: Icon, children, className }) => (
    <div className={`bg-premium-dark-gray/60 rounded-2xl p-6 border border-white/10 ${className}`}>
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-8 h-8 bg-premium-dark-gray rounded-xl flex items-center justify-center border border-white/10">
          <Icon className="w-4 h-4 text-premium-gold" />
        </div>
        <h3 className="text-md font-semibold text-premium-platinum">{title}</h3>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
);

const NotificationsView: React.FC = () => {
  const { addNotification } = useApp();
  const [sentNotifications, setSentNotifications] = useState<SentNotification[]>([]);

  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    type: 'in-app' as NotificationType,
    target: 'all' as TargetAudience,
    schedule: '',
  });

  const handleInputChange = (field: keyof typeof newNotification, value: any) => {
    setNewNotification(prev => ({ ...prev, [field]: value }));
  };

  const handleSend = () => {
    if (!newNotification.title || !newNotification.message) {
      toast.error('Title and message are required.');
      return;
    }
    
    if (newNotification.type === 'in-app') {
        addNotification({
            title: newNotification.title,
            message: newNotification.message,
            type: newNotification.type,
        });
    }

    const sentNotif: SentNotification = {
      id: Date.now().toString(),
      title: newNotification.title,
      message: newNotification.message,
      type: newNotification.type,
      target: newNotification.target,
      sentAt: new Date(),
    };
    setSentNotifications(prev => [sentNotif, ...prev]);

    const message = newNotification.schedule 
      ? `Notification "${newNotification.title}" has been scheduled!`
      : `Notification "${newNotification.title}" has been sent!`;

    toast.success(message);
    setNewNotification({ title: '', message: '', type: 'in-app', target: 'all', schedule: '' });
  };
  
  const getIconForType = (type: NotificationType) => {
    const icons = { email: Mail, 'in-app': MessageSquare, push: Smartphone, sms: MessageSquare };
    return icons[type];
  }

  return (
    <div className="h-full bg-premium-dark flex flex-col overflow-hidden">
      <div className="p-6 border-b border-white/10 flex-shrink-0">
        <h1 className="text-2xl font-bold text-premium-platinum">Notifications System</h1>
        <p className="text-premium-light-gray/70">Manage and schedule communications with your users.</p>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-1/3 border-r border-white/10 p-6 flex flex-col space-y-6 overflow-y-auto">
          <h2 className="text-lg font-semibold text-premium-platinum flex items-center"><Plus className="w-5 h-5 mr-2"/>Create Notification</h2>
          
          <div>
            <label className="text-sm font-medium text-premium-light-gray/80">Title</label>
            <input type="text" value={newNotification.title} onChange={e => handleInputChange('title', e.target.value)} className="w-full mt-1 p-2 bg-premium-dark-gray border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-premium-gold" />
          </div>

          <div>
            <label className="text-sm font-medium text-premium-light-gray/80">Message</label>
            <textarea value={newNotification.message} onChange={e => handleInputChange('message', e.target.value)} rows={5} className="w-full mt-1 p-2 bg-premium-dark-gray border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-premium-gold" />
          </div>

          <div>
            <label className="text-sm font-medium text-premium-light-gray/80 mb-2 block">Channel</label>
            <div className="grid grid-cols-2 gap-2">
              {(['in-app', 'email', 'push', 'sms'] as NotificationType[]).map(type => (
                <button key={type} onClick={() => handleInputChange('type', type)} className={`p-2 rounded-lg border text-sm flex items-center justify-center space-x-2 ${newNotification.type === type ? 'bg-premium-gold text-black border-premium-gold' : 'bg-premium-dark-gray border-white/10 hover:border-white/20'}`}>
                  {React.createElement(getIconForType(type), { className: 'w-4 h-4' })}
                  <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium text-premium-light-gray/80 mb-2 block">Audience</label>
            <select value={newNotification.target} onChange={e => handleInputChange('target', e.target.value)} className="w-full p-2 bg-premium-dark-gray border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-premium-gold">
              <option value="all">All Users</option>
              <option value="admins">Admins Only</option>
              <option value="users">End Users</option>
              <option value="pro-users">Pro Plan Users</option>
            </select>
          </div>
          
          <div>
            <label className="text-sm font-medium text-premium-light-gray/80">Schedule (Optional)</label>
            <input type="datetime-local" value={newNotification.schedule} onChange={e => handleInputChange('schedule', e.target.value)} className="w-full mt-1 p-2 bg-premium-dark-gray border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-premium-gold" style={{ colorScheme: 'dark' }} />
          </div>

          <motion.button onClick={handleSend} className="w-full p-3 bg-premium-gold text-black rounded-lg font-semibold flex items-center justify-center space-x-2 shadow-lg shadow-premium-gold/30 hover:opacity-90" whileTap={{ scale: 0.98 }}>
            <Send className="w-5 h-5"/>
            <span>{newNotification.schedule ? 'Schedule' : 'Send Now'}</span>
          </motion.button>
        </div>

        <div className="w-2/3 p-6 overflow-y-auto space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SettingCard title="Templates" icon={FileText}>
                    <p className="text-sm text-premium-light-gray/70">Manage reusable message templates.</p>
                    <button className="text-sm text-premium-gold hover:underline">Edit Templates</button>
                </SettingCard>
                <SettingCard title="Triggers" icon={ToggleRight}>
                    <p className="text-sm text-premium-light-gray/70">Automate notifications based on user actions.</p>
                    <button className="text-sm text-premium-gold hover:underline">Configure Triggers</button>
                </SettingCard>
                <SettingCard title="A/B Testing" icon={TestTube2}>
                    <p className="text-sm text-premium-light-gray/70">Optimize engagement by testing different messages.</p>
                    <button className="text-sm text-premium-gold hover:underline">Create New Test</button>
                </SettingCard>
                <SettingCard title="User Preferences" icon={Users}>
                    <p className="text-sm text-premium-light-gray/70">View and manage user opt-in/out settings.</p>
                    <button className="text-sm text-premium-gold hover:underline">View Preferences</button>
                </SettingCard>
            </div>
            
            <div>
                <h2 className="text-lg font-semibold text-premium-platinum mb-4">History</h2>
                <div className="space-y-4">
                    {sentNotifications.map(notif => {
                    const Icon = getIconForType(notif.type);
                    return (
                        <motion.div key={notif.id} className="bg-premium-dark-gray/60 p-4 rounded-xl border border-white/10" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="flex justify-between items-start">
                            <div>
                            <div className="flex items-center space-x-3 mb-2">
                                <Icon className="w-4 h-4 text-premium-light-gray/80"/>
                                <p className="font-semibold text-premium-platinum">{notif.title}</p>
                            </div>
                            <p className="text-sm text-premium-light-gray/70 max-w-lg">{notif.message}</p>
                            </div>
                            <button className="p-2 text-premium-light-gray/60 hover:text-red-400"><Trash2 className="w-4 h-4"/></button>
                        </div>
                        <div className="text-xs text-premium-light-gray/60 mt-3 flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                            <span className="flex items-center space-x-1"><Users className="w-3 h-3"/><span>To: {notif.target}</span></span>
                            <span className="flex items-center space-x-1"><Calendar className="w-3 h-3"/><span>{notif.sentAt.toLocaleString()}</span></span>
                            </div>
                        </div>
                        </motion.div>
                    )
                    })}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsView;
