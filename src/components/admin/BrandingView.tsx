import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useSettings } from '../../contexts/SettingsContext';
import { Palette, UploadCloud, Save, Image as ImageIcon, Loader } from 'lucide-react';

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

const BrandingView: React.FC = () => {
  const { brandingSettings, setBrandingSettings } = useSettings();
  const logoInputRef = useRef<HTMLInputElement>(null);
  const loaderInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'logoUrl' | 'loaderUrl') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBrandingSettings(prev => ({ ...prev, [field]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    toast.success('Branding settings saved successfully!');
  };

  const FileUpload: React.FC<{
    preview: string | null;
    onUploadClick: () => void;
    inputRef: React.RefObject<HTMLInputElement>;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    label: string;
    accept: string;
  }> = ({ preview, onUploadClick, inputRef, onChange, label, accept }) => (
    <div className="flex items-center space-x-4">
      <div className="w-24 h-24 bg-premium-dark-gray/50 rounded-lg flex items-center justify-center border-2 border-dashed border-white/20">
        {preview ? (
          <img src={preview} alt="Preview" className="max-w-full max-h-full object-contain" />
        ) : (
          <ImageIcon className="w-8 h-8 text-premium-light-gray/50" />
        )}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-premium-platinum mb-2">{label}</p>
        <input
          type="file"
          ref={inputRef}
          hidden
          onChange={onChange}
          accept={accept}
        />
        <button
          onClick={onUploadClick}
          className="flex items-center space-x-2 px-4 py-2 bg-premium-medium-gray border border-white/10 rounded-xl hover:bg-premium-medium-gray/80 text-sm"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Upload File</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="h-full bg-premium-dark overflow-y-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-premium-platinum">Branding & Appearance</h1>
          <p className="text-premium-light-gray/70">Customize the look and feel of your application.</p>
        </div>
        <motion.button onClick={handleSave} className="flex items-center space-x-2 px-4 py-2 bg-premium-gold text-black rounded-xl hover:opacity-90 shadow-lg shadow-premium-gold/30 text-sm">
          <Save className="w-4 h-4" /><span>Save Changes</span>
        </motion.button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SettingCard title="Application Logo" icon={ImageIcon}>
          <FileUpload
            preview={brandingSettings.logoUrl}
            onUploadClick={() => logoInputRef.current?.click()}
            inputRef={logoInputRef}
            onChange={(e) => handleFileChange(e, 'logoUrl')}
            label="Upload your logo (PNG, SVG recommended)"
            accept="image/png, image/svg+xml, image/jpeg"
          />
        </SettingCard>

        <SettingCard title="Website Loader" icon={Loader}>
          <FileUpload
            preview={brandingSettings.loaderUrl}
            onUploadClick={() => loaderInputRef.current?.click()}
            inputRef={loaderInputRef}
            onChange={(e) => handleFileChange(e, 'loaderUrl')}
            label="Upload a loading animation (GIF, Lottie/JSON)"
            accept="image/gif, application/json"
          />
        </SettingCard>

        <div className="lg:col-span-2">
          <SettingCard title="Color Palette" icon={Palette}>
            <p className="text-sm text-premium-light-gray/70 mb-4">These colors will be used across the application for branding elements.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center space-x-4">
                <input
                  type="color"
                  value={brandingSettings.primaryColor}
                  onChange={(e) => setBrandingSettings(p => ({...p, primaryColor: e.target.value}))}
                  className="w-12 h-12 p-0 bg-transparent border-none cursor-pointer"
                />
                <div>
                  <label className="text-sm font-medium text-premium-platinum">Primary Color</label>
                  <p className="text-xs text-premium-light-gray/60">Used for main actions and highlights.</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <input
                  type="color"
                  value={brandingSettings.secondaryColor}
                  onChange={(e) => setBrandingSettings(p => ({...p, secondaryColor: e.target.value}))}
                  className="w-12 h-12 p-0 bg-transparent border-none cursor-pointer"
                />
                <div>
                  <label className="text-sm font-medium text-premium-platinum">Secondary Color</label>
                  <p className="text-xs text-premium-light-gray/60">Used for accents and gradients.</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <input
                  type="color"
                  value={brandingSettings.iconColor}
                  onChange={(e) => setBrandingSettings(p => ({...p, iconColor: e.target.value}))}
                  className="w-12 h-12 p-0 bg-transparent border-none cursor-pointer"
                />
                <div>
                  <label className="text-sm font-medium text-premium-platinum">Icon Color</label>
                  <p className="text-xs text-premium-light-gray/60">Used for component icons.</p>
                </div>
              </div>
            </div>
          </SettingCard>
        </div>
      </div>
    </div>
  );
};

export default BrandingView;
