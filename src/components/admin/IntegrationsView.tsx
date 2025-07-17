import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { Puzzle, Save, Bot, DollarSign, MessageSquare, TestTube, Database, Link as LinkIcon, Briefcase } from 'lucide-react';

const IntegrationCard: React.FC<{ title: string; icon: React.ElementType; children: React.ReactNode }> = ({ title, icon: Icon, children }) => (
    <motion.div
        className="bg-premium-dark-gray/60 rounded-2xl p-6 border border-white/10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
    >
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
                <Icon className="w-6 h-6 text-premium-gold" />
                <h3 className="text-lg font-semibold text-premium-platinum">{title}</h3>
            </div>
            <ToggleSwitch checked={true} onChange={() => {}} />
        </div>
        <div className="space-y-3">{children}</div>
    </motion.div>
);

const ToggleSwitch: React.FC<{ checked: boolean; onChange: (value: boolean) => void; }> = ({ checked, onChange }) => (
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
);

const ApiKeyInput: React.FC<{ label: string; placeholder: string }> = ({ label, placeholder }) => (
    <div>
        <label className="text-xs font-medium text-premium-light-gray/70">{label}</label>
        <input
            type="password"
            placeholder={placeholder}
            className="w-full mt-1 p-2 bg-premium-dark-gray border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-premium-gold text-sm"
        />
    </div>
);

const IntegrationsView: React.FC = () => {
    const handleSave = () => {
        toast.success("Integration settings saved!");
    };

    return (
        <div className="h-full bg-premium-dark overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-premium-platinum">Third-Party Integrations</h1>
                    <p className="text-premium-light-gray/70">Connect and manage external services.</p>
                </div>
                <motion.button onClick={handleSave} className="flex items-center space-x-2 px-4 py-2 bg-premium-gold text-black rounded-xl hover:opacity-90 shadow-lg shadow-premium-gold/30 text-sm">
                    <Save className="w-4 h-4" /><span>Save All</span>
                </motion.button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <IntegrationCard title="AI Providers" icon={Bot}>
                    <ApiKeyInput label="open ai key" placeholder="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" />
                    <p className="text-xs text-premium-light-gray/60">Connect your OpenAI account to power chat features.</p>
                </IntegrationCard>

                <IntegrationCard title="Payment Gateways" icon={DollarSign}>
                    <ApiKeyInput label="Stripe API Key" placeholder="pk_live_xxxxxxxxxxxx" />
                    <ApiKeyInput label="PayPal Client ID" placeholder="Axxxxxxxxxxxxxxxxxxx" />
                </IntegrationCard>

                <IntegrationCard title="Backend Services" icon={Database}>
                    <ApiKeyInput label="Firebase Project ID" placeholder="your-project-id" />
                    <ApiKeyInput label="Firebase API Key" placeholder="AIzaSyxxxxxxxxxxxxxx" />
                </IntegrationCard>
                
                <IntegrationCard title="Error Tracking" icon={TestTube}>
                    <ApiKeyInput label="Sentry DSN" placeholder="https://xxxx@xxxx.ingest.sentry.io/xxxx" />
                </IntegrationCard>

                <IntegrationCard title="Communication" icon={MessageSquare}>
                    <ApiKeyInput label="Slack Webhook URL" placeholder="https://hooks.slack.com/services/T0000/B0000/XXXX" />
                </IntegrationCard>

                <IntegrationCard title="Automation" icon={LinkIcon}>
                    <ApiKeyInput label="Zapier API Key" placeholder="za_xxxxxxxxxxxxxxxx" />
                </IntegrationCard>

                <div className="md:col-span-2 lg:col-span-3">
                    <IntegrationCard title="Productivity" icon={Briefcase}>
                        <div className="flex items-center justify-between p-3 bg-premium-dark-gray/50 rounded-lg">
                            <p className="text-sm font-medium">Google Workspace</p>
                            <button className="text-sm bg-premium-medium-gray px-4 py-2 rounded-lg">Connect Account</button>
                        </div>
                         <p className="text-xs text-premium-light-gray/60">Connect your Google account to sync Calendar, Drive, and Gmail for a seamless experience.</p>
                    </IntegrationCard>
                </div>
            </div>
        </div>
    );
};

export default IntegrationsView;
