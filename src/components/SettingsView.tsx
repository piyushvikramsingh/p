import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  Palette, 
  Globe, 
  Type, 
  Brain, 
  Shield, 
  Bell, 
  Mic, 
  Moon,
  Sun,
  Monitor,
  Volume2,
  VolumeX,
  Eye,
  EyeOff,
  Trash2,
  Download,
  Upload,
  Lock,
  Unlock,
  Zap,
  User,
  MessageSquare,
  Save,
  RotateCcw
} from 'lucide-react';

const SettingsView: React.FC = () => {
  const [settings, setSettings] = useState({
    // General Settings
    theme: 'dark',
    language: 'en',
    fontSize: 'medium',
    defaultMode: 'text',
    autoSave: true,
    
    // AI Behavior
    responseLength: 'medium',
    tone: 'professional',
    autoCorrection: true,
    
    // Privacy & Security
    dataCollection: true,
    encryption: true,
    twoFA: false,
    
    // Notifications
    soundAlerts: true,
    desktopNotifications: true,
    priorityAlerts: false,
    
    // Voice Settings
    voiceGender: 'neutral',
    voiceSpeed: 'normal',
    wakeWord: 'Hey P.ai',
    noiseFiltering: true,
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const SettingCard: React.FC<{ title: string; icon: React.ElementType; children: React.ReactNode }> = ({ title, icon: Icon, children }) => (
    <motion.div
      className="bg-premium-dark-gray/80 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-lg"
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
      <div className="space-y-4">
        {children}
      </div>
    </motion.div>
  );

  const ToggleSwitch: React.FC<{ checked: boolean; onChange: (value: boolean) => void; label: string; description?: string }> = ({ checked, onChange, label, description }) => (
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <p className="text-sm font-medium text-premium-platinum">{label}</p>
        {description && <p className="text-xs text-premium-light-gray/60 mt-1">{description}</p>}
      </div>
      <motion.button
        onClick={() => onChange(!checked)}
        className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
          checked ? 'bg-premium-gold' : 'bg-premium-medium-gray'
        }`}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full transition-colors duration-200 ${
            checked ? 'bg-black' : 'bg-premium-light-gray'
          }`}
          animate={{ x: checked ? 24 : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </motion.button>
    </div>
  );

  const SelectInput: React.FC<{ value: string; onChange: (value: string) => void; options: { value: string; label: string }[]; label: string }> = ({ value, onChange, options, label }) => (
    <div>
      <label className="block text-sm font-medium text-premium-platinum mb-2">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 bg-premium-dark-gray border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-premium-gold focus:border-transparent text-premium-platinum"
      >
        {options.map(option => (
          <option key={option.value} value={option.value} className="bg-premium-dark-gray">
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );

  const TextInput: React.FC<{ value: string; onChange: (value: string) => void; label: string; placeholder?: string }> = ({ value, onChange, label, placeholder }) => (
    <div>
      <label className="block text-sm font-medium text-premium-platinum mb-2">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 bg-premium-dark-gray border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-premium-gold focus:border-transparent text-premium-platinum placeholder-premium-light-gray/50"
      />
    </div>
  );

  const ActionButton: React.FC<{ onClick: () => void; icon: React.ElementType; label: string; variant?: 'primary' | 'secondary' | 'danger' }> = ({ onClick, icon: Icon, label, variant = 'secondary' }) => (
    <motion.button
      onClick={onClick}
      className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl transition-all duration-200 ${
        variant === 'primary' 
          ? 'bg-premium-gold text-black hover:opacity-90 shadow-lg shadow-premium-gold/30' 
          : variant === 'danger'
          ? 'bg-red-600 text-white hover:bg-red-700'
          : 'bg-premium-dark-gray border border-white/10 text-premium-platinum hover:bg-premium-medium-gray'
      }`}
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.98 }}
    >
      <Icon className="w-4 h-4" />
      <span className="font-medium text-sm">{label}</span>
    </motion.button>
  );

  return (
    <div className="h-full bg-premium-dark overflow-y-auto">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-12 h-12 bg-gold-diamond-gradient rounded-2xl flex items-center justify-center shadow-lg shadow-premium-gold/20">
              <Settings className="w-6 h-6 text-black" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gold-diamond-gradient bg-clip-text text-transparent">
                Settings
              </h1>
              <p className="text-premium-light-gray/70">Customize your P.AI experience</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* General Settings */}
            <SettingCard title="General Settings" icon={Settings}>
              <SelectInput
                value={settings.theme}
                onChange={(value) => handleSettingChange('theme', value)}
                options={[
                  { value: 'dark', label: 'Dark' },
                  { value: 'light', label: 'Light' },
                  { value: 'system', label: 'System' }
                ]}
                label="Theme"
              />
              
              <SelectInput
                value={settings.language}
                onChange={(value) => handleSettingChange('language', value)}
                options={[
                  { value: 'en', label: 'English' },
                  { value: 'es', label: 'Spanish' },
                  { value: 'fr', label: 'French' },
                  { value: 'de', label: 'German' },
                  { value: 'zh', label: 'Chinese' }
                ]}
                label="Language"
              />
              
              <SelectInput
                value={settings.fontSize}
                onChange={(value) => handleSettingChange('fontSize', value)}
                options={[
                  { value: 'small', label: 'Small' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'large', label: 'Large' }
                ]}
                label="Font Size"
              />
              
              <SelectInput
                value={settings.defaultMode}
                onChange={(value) => handleSettingChange('defaultMode', value)}
                options={[
                  { value: 'text', label: 'Text' },
                  { value: 'voice', label: 'Voice' },
                  { value: 'think', label: 'Think Mode' },
                  { value: 'deepsearch', label: 'Deep Search' },
                  { value: 'turbo', label: 'Turbo' }
                ]}
                label="Default Mode"
              />
              
              <ToggleSwitch
                checked={settings.autoSave}
                onChange={(value) => handleSettingChange('autoSave', value)}
                label="Auto-Save Conversations"
                description="Automatically save your conversations"
              />
            </SettingCard>

            {/* AI Behavior */}
            <SettingCard title="AI Behavior" icon={Brain}>
              <SelectInput
                value={settings.responseLength}
                onChange={(value) => handleSettingChange('responseLength', value)}
                options={[
                  { value: 'short', label: 'Short' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'long', label: 'Long' }
                ]}
                label="Response Length"
              />
              
              <SelectInput
                value={settings.tone}
                onChange={(value) => handleSettingChange('tone', value)}
                options={[
                  { value: 'professional', label: 'Professional' },
                  { value: 'casual', label: 'Casual' },
                  { value: 'friendly', label: 'Friendly' },
                  { value: 'technical', label: 'Technical' }
                ]}
                label="Tone"
              />
              
              <ToggleSwitch
                checked={settings.autoCorrection}
                onChange={(value) => handleSettingChange('autoCorrection', value)}
                label="Auto-Correction"
                description="Automatically correct grammar and spelling"
              />
            </SettingCard>

            {/* Privacy & Security */}
            <SettingCard title="Privacy & Security" icon={Shield}>
              <ToggleSwitch
                checked={settings.dataCollection}
                onChange={(value) => handleSettingChange('dataCollection', value)}
                label="Data Collection"
                description="Allow data collection for service improvement"
              />
              
              <ToggleSwitch
                checked={settings.encryption}
                onChange={(value) => handleSettingChange('encryption', value)}
                label="Encryption"
                description="Enable end-to-end encryption for conversations"
              />
              
              <ToggleSwitch
                checked={settings.twoFA}
                onChange={(value) => handleSettingChange('twoFA', value)}
                label="Two-Factor Authentication"
                description="Add an extra layer of security to your account"
              />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <ActionButton onClick={() => {}} icon={Trash2} label="Clear History" variant="danger" />
                <ActionButton onClick={() => {}} icon={Download} label="Export Data" />
              </div>
            </SettingCard>

            {/* Notifications */}
            <SettingCard title="Notifications" icon={Bell}>
              <ToggleSwitch
                checked={settings.soundAlerts}
                onChange={(value) => handleSettingChange('soundAlerts', value)}
                label="Sound Alerts"
                description="Play sound for new messages and alerts"
              />
              
              <ToggleSwitch
                checked={settings.desktopNotifications}
                onChange={(value) => handleSettingChange('desktopNotifications', value)}
                label="Desktop Notifications"
                description="Show desktop notifications for important events"
              />
              
              <ToggleSwitch
                checked={settings.priorityAlerts}
                onChange={(value) => handleSettingChange('priorityAlerts', value)}
                label="Priority Alerts"
                description="Receive alerts for important reminders"
              />
            </SettingCard>

            {/* Voice Settings */}
            <SettingCard title="Voice Settings" icon={Mic}>
              <SelectInput
                value={settings.voiceGender}
                onChange={(value) => handleSettingChange('voiceGender', value)}
                options={[
                  { value: 'male', label: 'Male' },
                  { value: 'female', label: 'Female' },
                  { value: 'neutral', label: 'Neutral' }
                ]}
                label="Voice Gender"
              />
              
              <SelectInput
                value={settings.voiceSpeed}
                onChange={(value) => handleSettingChange('voiceSpeed', value)}
                options={[
                  { value: 'slow', label: 'Slow' },
                  { value: 'normal', label: 'Normal' },
                  { value: 'fast', label: 'Fast' }
                ]}
                label="Voice Speed"
              />
              
              <TextInput
                value={settings.wakeWord}
                onChange={(value) => handleSettingChange('wakeWord', value)}
                label="Wake Word"
                placeholder="Hey P.ai"
              />
              
              <ToggleSwitch
                checked={settings.noiseFiltering}
                onChange={(value) => handleSettingChange('noiseFiltering', value)}
                label="Background Noise Filtering"
                description="Filter out background noise during voice input"
              />
            </SettingCard>

            {/* Account Management */}
            <SettingCard title="Account Management" icon={User}>
              <div className="space-y-3">
                <ActionButton onClick={() => {}} icon={Save} label="Save Settings" variant="primary" />
                <ActionButton onClick={() => {}} icon={RotateCcw} label="Reset to Default" />
                <ActionButton onClick={() => {}} icon={Upload} label="Import Settings" />
                <ActionButton onClick={() => {}} icon={Download} label="Export Settings" />
              </div>
            </SettingCard>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SettingsView;
