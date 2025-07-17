import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { Wand2, ShieldCheck, Lightbulb, Play, Eye } from 'lucide-react';

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

const AutomationView: React.FC = () => {
    const [autoModeration, setAutoModeration] = useState(true);
    const [keywords, setKeywords] = useState('spam, scam, inappropriate');
    const [bulkActionCommand, setBulkActionCommand] = useState('');

    const handleExecute = () => {
        if (!bulkActionCommand) {
            toast.error("Please enter a command.");
            return;
        }
        toast.success(`Executing: "${bulkActionCommand}"`);
    }

    return (
        <div className="h-full bg-premium-dark overflow-y-auto p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-premium-platinum">Automation & AI</h1>
                <p className="text-premium-light-gray/70">Leverage AI to automate administrative tasks.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SettingCard title="Auto-Moderation" icon={ShieldCheck}>
                    <ToggleSwitch checked={autoModeration} onChange={setAutoModeration} label="Enable Auto-Moderation" />
                    <div>
                        <label className="text-sm font-medium text-premium-platinum">Keywords to Flag</label>
                        <p className="text-xs text-premium-light-gray/60 mb-2">Comma-separated list of words to automatically flag in user content.</p>
                        <textarea
                            value={keywords}
                            onChange={e => setKeywords(e.target.value)}
                            rows={3}
                            className="w-full p-2 bg-premium-dark-gray border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-premium-gold font-mono text-sm"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-premium-platinum">Action on Flag</label>
                        <select className="w-full mt-1 p-2 bg-premium-dark-gray border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-premium-gold">
                            <option>Alert Moderator</option>
                            <option>Quarantine Content</option>
                            <option>Auto-Delete</option>
                        </select>
                    </div>
                </SettingCard>

                <SettingCard title="AI-Powered Bulk Actions" icon={Wand2}>
                    <p className="text-sm text-premium-light-gray/70">Use natural language to perform bulk operations. Use with caution.</p>
                    <div>
                        <label className="text-sm font-medium text-premium-platinum">Command</label>
                        <input
                            type="text"
                            value={bulkActionCommand}
                            onChange={e => setBulkActionCommand(e.target.value)}
                            placeholder="e.g., Ban all inactive users older than 1 year"
                            className="w-full mt-1 p-2 bg-premium-dark-gray border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-premium-gold"
                        />
                    </div>
                    <div className="flex space-x-3">
                        <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-premium-medium-gray border border-white/10 rounded-xl hover:bg-premium-medium-gray/80 text-sm">
                            <Eye className="w-4 h-4" /><span>Preview</span>
                        </button>
                        <button onClick={handleExecute} className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-premium-gold text-black rounded-xl hover:opacity-90 text-sm">
                            <Play className="w-4 h-4" /><span>Execute</span>
                        </button>
                    </div>
                </SettingCard>

                <div className="lg:col-span-2">
                    <SettingCard title="AI-Powered Insights" icon={Lightbulb}>
                        <p className="text-sm text-premium-light-gray/70">The system automatically analyzes user behavior to provide actionable insights.</p>
                        <div className="space-y-2 text-sm">
                            <p>• User engagement is highest on <span className="text-premium-gold">Tuesdays at 2 PM</span>.</p>
                            <p>• <span className="text-premium-gold">Pro Plan</span> users are 3x more likely to use the Files feature.</p>
                            <p>• A high number of login failures detected from the <span className="text-premium-gold">APAC region</span>.</p>
                        </div>
                    </SettingCard>
                </div>
            </div>
        </div>
    );
};

export default AutomationView;
