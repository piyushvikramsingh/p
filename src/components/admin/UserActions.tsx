import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoreVertical, Eye, Edit, UserX, Trash2, ShieldAlert } from 'lucide-react';
import { User } from '../../lib/mock-data';

interface UserActionsProps {
  user: User;
  onAction: (action: 'view' | 'edit' | 'suspend' | 'ban' | 'delete', userId: string) => void;
}

const UserActions: React.FC<UserActionsProps> = ({ user, onAction }) => {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    { id: 'view', label: 'View Profile', icon: Eye },
    { id: 'edit', label: 'Edit User', icon: Edit },
    { id: 'suspend', label: 'Suspend', icon: UserX },
    { id: 'ban', label: 'Ban', icon: ShieldAlert },
    { id: 'delete', label: 'Delete', icon: Trash2, isDestructive: true },
  ];

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-premium-medium-gray/50 text-premium-light-gray/70"
        whileTap={{ scale: 0.9 }}
      >
        <MoreVertical className="w-5 h-5" />
      </motion.button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-48 bg-premium-dark-gray rounded-xl border border-white/10 shadow-lg z-10 origin-top-right"
          >
            <ul className="p-2">
              {actions.map(action => (
                <li key={action.id}>
                  <button
                    onClick={() => {
                      onAction(action.id as any, user.id);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-3 py-2 text-sm rounded-lg transition-colors ${
                      action.isDestructive
                        ? 'text-red-400 hover:bg-red-500/10'
                        : 'text-premium-light-gray hover:bg-premium-medium-gray/50'
                    }`}
                  >
                    <action.icon className="w-4 h-4" />
                    <span>{action.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserActions;
