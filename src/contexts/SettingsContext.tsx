import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthSettings {
  google: boolean;
  github: boolean;
  apple: boolean;
  facebook: boolean;
}

interface BrandingSettings {
  iconColor: string;
  primaryColor: string;
  secondaryColor: string;
  logoUrl: string | null;
  loaderUrl: string | null;
}

interface SettingsContextType {
  authSettings: AuthSettings;
  setAuthSettings: React.Dispatch<React.SetStateAction<AuthSettings>>;
  brandingSettings: BrandingSettings;
  setBrandingSettings: React.Dispatch<React.SetStateAction<BrandingSettings>>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authSettings, setAuthSettings] = useState<AuthSettings>({
    google: true,
    github: true,
    apple: false,
    facebook: false,
  });

  const [brandingSettings, setBrandingSettings] = useState<BrandingSettings>({
    iconColor: '#FFD700',
    primaryColor: '#FFD700',
    secondaryColor: '#b9f2ff',
    logoUrl: null,
    loaderUrl: null,
  });

  const value = {
    authSettings,
    setAuthSettings,
    brandingSettings,
    setBrandingSettings,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};
