import React from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useSettings } from '../../contexts/SettingsContext';
import { 
  KeyRound, 
  Save, 
  RotateCcw,
  LogIn,
  AtSign,
  Globe,
  Shield,
  ListFilter,
} from 'lucide-react';

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

const ToggleSwitch: React.FC<{ checked: boolean; onChange: (value: boolean) => void; label: string; description?: string }> = ({ checked, onChange, label, description }) => (
  <div className="flex items-center justify-between py-2 border-b border-white/5 last:border-b-0">
    <div className="flex-1 pr-4">
      <p className="text-sm font-medium text-premium-platinum">{label}</p>
      {description && <p className="text-xs text-premium-light-gray/60 mt-1">{description}</p>}
    </div>
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

const TextInput: React.FC<{ value: string | number; onChange: (value: any) => void; label: string; type?: string }> = ({ value, onChange, label, type = 'text' }) => (
    <div className="flex items-center justify-between py-2 border-b border-white/5 last:border-b-0">
        <label className="text-sm font-medium text-premium-platinum">{label}</label>
        <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-32 px-2 py-1 bg-premium-dark-gray border border-white/10 rounded-md focus:outline-none focus:ring-1 focus:ring-premium-gold text-sm text-right"
        />
    </div>
);

const AuthSettingsView: React.FC = () => {
  const { authSettings, setAuthSettings } = useSettings();
  const [localSettings, setLocalSettings] = React.useState({
    enforce2FA: true,
    sessionDuration: 60,
    lockoutThreshold: 5,
    bruteForceProtection: true,
    ipWhitelist: '192.168.1.1/24\n203.0.113.0/24',
    emailPassword: true,
    magicLinks: false,
    saml: false,
    oidc: false,
  });

  const handleLocalSettingChange = (key: keyof typeof localSettings, value: any) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveChanges = () => {
    toast.success('Authentication settings saved successfully!');
  };
  
  const handleReset = () => {
    setAuthSettings({ google: true, github: true, apple: false, facebook: false });
    toast.success('Settings have been reset to default.');
  }

  return (
    <div className="h-full bg-premium-dark overflow-y-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
            <h1 className="text-2xl font-bold text-premium-platinum">Authentication & Security</h1>
            <p className="text-premium-light-gray/70">Manage how users log in and secure your application.</p>
        </div>
        <div className="flex space-x-3">
            <motion.button onClick={handleReset} className="flex items-center space-x-2 px-4 py-2 bg-premium-dark-gray border border-white/10 rounded-xl hover:bg-premium-medium-gray text-sm">
                <RotateCcw className="w-4 h-4" /><span>Reset</span>
            </motion.button>
            <motion.button onClick={handleSaveChanges} className="flex items-center space-x-2 px-4 py-2 bg-premium-gold text-black rounded-xl hover:opacity-90 shadow-lg shadow-premium-gold/30 text-sm">
                <Save className="w-4 h-4" /><span>Save Changes</span>
            </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="flex flex-col gap-6">
            <SettingCard title="Login Methods" icon={LogIn}>
                <ToggleSwitch checked={localSettings.emailPassword} onChange={v => handleLocalSettingChange('emailPassword', v)} label="Email & Password" description="Classic email and password login." />
                <ToggleSwitch checked={localSettings.magicLinks} onChange={v => handleLocalSettingChange('magicLinks', v)} label="Passwordless Magic Links" description="Allow users to log in via a link sent to their email." />
            </SettingCard>
            <SettingCard title="Social Logins (OAuth)" icon={Globe}>
                <ToggleSwitch checked={authSettings.google} onChange={v => setAuthSettings(p => ({...p, google: v}))} label="Google" description="Sign in with Google." />
                <ToggleSwitch checked={authSettings.apple} onChange={v => setAuthSettings(p => ({...p, apple: v}))} label="Apple" description="Sign in with Apple." />
                <ToggleSwitch checked={authSettings.facebook} onChange={v => setAuthSettings(p => ({...p, facebook: v}))} label="Facebook" description="Sign in with Facebook." />
                <ToggleSwitch checked={authSettings.github} onChange={v => setAuthSettings(p => ({...p, github: v}))} label="GitHub" description="Sign in with GitHub for developers." />
            </SettingCard>
            <SettingCard title="Enterprise Login (SSO)" icon={AtSign}>
                <ToggleSwitch checked={localSettings.saml} onChange={v => handleLocalSettingChange('saml', v)} label="SAML" description="For enterprise customers using SAML." />
                <ToggleSwitch checked={localSettings.oidc} onChange={v => handleLocalSettingChange('oidc', v)} label="OpenID Connect" description="For enterprise customers using OIDC." />
            </SettingCard>
        </div>
        <div className="flex flex-col gap-6">
            <SettingCard title="Security Policies" icon={Shield}>
                <ToggleSwitch checked={localSettings.enforce2FA} onChange={v => handleLocalSettingChange('enforce2FA', v)} label="Enforce Two-Factor Auth" description="Require 2FA for all users or specific roles." />
                <TextInput value={localSettings.sessionDuration} onChange={v => handleLocalSettingChange('sessionDuration', v)} label="Session Duration (minutes)" type="number" />
                <TextInput value={localSettings.lockoutThreshold} onChange={v => handleLocalSettingChange('lockoutThreshold', v)} label="Failed Login Lockout Threshold" type="number" />
                <ToggleSwitch checked={localSettings.bruteForceProtection} onChange={v => handleLocalSettingChange('bruteForceProtection', v)} label="Brute-Force Protection" description="Enable rate limiting and CAPTCHA." />
            </SettingCard>
            <SettingCard title="IP Management" icon={ListFilter}>
                <label className="text-sm font-medium text-premium-platinum">IP Whitelist</label>
                <p className="text-xs text-premium-light-gray/60 mb-2">Only allow access from these IPs. One per line.</p>
                <textarea
                    value={localSettings.ipWhitelist}
                    onChange={e => handleLocalSettingChange('ipWhitelist', e.target.value)}
                    rows={4}
                    className="w-full p-2 bg-premium-dark-gray border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-premium-gold font-mono text-sm"
                    placeholder="e.g., 192.168.1.1/24"
                />
            </SettingCard>
        </div>
      </div>
    </div>
  );
};

export default AuthSettingsView;
