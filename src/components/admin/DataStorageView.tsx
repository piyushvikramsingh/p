import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { Database, Cloud, ServerCog, Archive, Shield, Save } from 'lucide-react';

const SettingCard: React.FC<{ title: string; icon: React.ElementType; children: React.ReactNode }> = ({ title, icon: Icon, children }) => (
  <motion.div
    className="bg-premium-dark-gray/60 rounded-2xl p-6 border border-white/10"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <div className="flex items-center space-x-3 mb-6">
      <div className="w-10 h-10 bg-premium-dark-gray rounded-xl flex items-center justify-center border border-white/10">
        <Icon className="w-5 h-5 text-premium-gold" />
      </div>
      <h3 className="text-lg font-semibold text-premium-platinum">{title}</h3>
    </div>
    <div className="space-y-4">{children}</div>
  </motion.div>
);

const ToggleSwitch: React.FC<{ checked: boolean; onChange: (value: boolean) => void; label: string }> = ({ checked, onChange, label }) => (
  <div className="flex items-center justify-between py-2 border-b border-white/5 last:border-b-0">
    <p className="text-sm font-medium text-premium-platinum">{label}</p>
    <motion.button
      onClick={() => onChange(!checked)}
      className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${checked ? 'bg-premium-gold' : 'bg-premium-medium-gray'}`}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full transition-colors duration-200 ${checked ? 'bg-black' : 'bg-premium-light-gray'}`}
        animate={{ x: checked ? 24 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </motion.button>
  </div>
);

const DataStorageView: React.FC = () => {
    const [settings, setSettings] = useState({
        automatedBackups: true,
        retentionDays: 90,
    });

    const handleSave = () => {
        toast.success("Data storage policies updated!");
    }

    const services = [
        { name: 'Firestore', purpose: 'NoSQL database (profiles, tasks)', icon: Database },
        { name: 'Cloud Storage', purpose: 'File uploads (PDFs, images)', icon: Cloud },
        { name: 'BigQuery', purpose: 'Analytics and reporting', icon: ServerCog },
        { name: 'Cloud Functions', purpose: 'Serverless backend logic', icon: ServerCog },
        { name: 'Pub/Sub', purpose: 'Real-time event handling', icon: ServerCog },
        { name: 'Memorystore', purpose: 'Caching (Redis)', icon: ServerCog },
    ];

    return (
        <div className="h-full bg-premium-dark overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-premium-platinum">Data Storage</h1>
                    <p className="text-premium-light-gray/70">Overview of Google Cloud services and data policies.</p>
                </div>
                <motion.button onClick={handleSave} className="flex items-center space-x-2 px-4 py-2 bg-premium-gold text-black rounded-xl hover:opacity-90 shadow-lg shadow-premium-gold/30 text-sm">
                    <Save className="w-4 h-4" /><span>Save Policies</span>
                </motion.button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-premium-dark-gray/60 rounded-2xl p-6 border border-white/10">
                    <h2 className="text-lg font-semibold text-premium-platinum mb-4">Google Cloud Services</h2>
                    <div className="space-y-3">
                        {services.map(service => (
                            <div key={service.name} className="flex items-center justify-between p-3 bg-premium-dark-gray/50 rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <service.icon className="w-5 h-5 text-premium-gold" />
                                    <div>
                                        <p className="font-medium text-sm">{service.name}</p>
                                        <p className="text-xs text-premium-light-gray/60">{service.purpose}</p>
                                    </div>
                                </div>
                                <div className="flex items-center text-xs text-green-400">
                                    <div className="w-2 h-2 bg-green-400 rounded-full mr-1.5"></div>
                                    Active
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-6">
                    <SettingCard title="Data Security" icon={Shield}>
                        <div className="text-sm flex justify-between items-center"><span>Encryption at Rest</span><span className="text-green-400 font-semibold">Enabled</span></div>
                        <div className="text-sm flex justify-between items-center"><span>Encryption in Transit</span><span className="text-green-400 font-semibold">Enabled</span></div>
                        <div className="text-sm flex justify-between items-center"><span>Access Control (IAM)</span><button className="text-premium-gold hover:underline text-xs">Manage</button></div>
                    </SettingCard>

                    <SettingCard title="Backup & Retention" icon={Archive}>
                        <ToggleSwitch checked={settings.automatedBackups} onChange={v => setSettings(p => ({...p, automatedBackups: v}))} label="Automated Backups" />
                        <div>
                            <label className="text-sm font-medium text-premium-platinum">Data Retention Policy</label>
                            <p className="text-xs text-premium-light-gray/60 mb-2">Automatically delete logs older than the specified days.</p>
                            <div className="flex items-center space-x-2">
                                <input type="number" value={settings.retentionDays} onChange={e => setSettings(p => ({...p, retentionDays: parseInt(e.target.value)}))} className="w-24 p-2 bg-premium-dark-gray border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-premium-gold" />
                                <span className="text-sm">days</span>
                            </div>
                        </div>
                    </SettingCard>
                </div>
            </div>
        </div>
    );
};

export default DataStorageView;
