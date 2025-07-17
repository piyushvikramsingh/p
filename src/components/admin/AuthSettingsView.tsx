import React from 'react';
import { motion } from 'framer-motion';
import { KeyRound } from 'lucide-react';

const PlaceholderView: React.FC<{ title: string; description: string; icon: React.ElementType }> = ({ title, description, icon: Icon }) => (
  <div className="h-full bg-premium-dark flex items-center justify-center p-6">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <div className="w-16 h-16 bg-premium-dark-gray/60 rounded-2xl flex items-center justify-center border border-white/10 mx-auto mb-6">
        <Icon className="w-8 h-8 text-premium-gold" />
      </div>
      <h2 className="text-2xl font-bold text-premium-platinum mb-2">{title}</h2>
      <p className="text-premium-light-gray/70 max-w-md">{description}</p>
    </motion.div>
  </div>
);

const AuthSettingsView: React.FC = () => {
  return (
    <PlaceholderView
      title="Authentication & Security"
      description="This section is under construction. Soon you'll be able to configure login methods, social logins, and security policies."
      icon={KeyRound}
    />
  );
};

export default AuthSettingsView;
