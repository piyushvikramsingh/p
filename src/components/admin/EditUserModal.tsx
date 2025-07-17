import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, UserRole, UserStatus, SubscriptionPlan } from '../../lib/mock-data';
import { Edit } from 'lucide-react';

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onSave: (updatedUser: User) => void;
}

const EditUserModal: React.FC<EditUserModalProps> = ({ isOpen, onClose, user, onSave }) => {
  const [formData, setFormData] = useState<User>(user);

  useEffect(() => {
    setFormData(user);
  }, [user]);

  const handleInputChange = (field: keyof User, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // TODO: Add API call to update user on the backend
    onSave(formData);
  };
  
  const FormRow: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <div>
        <label className="block text-sm font-medium text-premium-light-gray/80 mb-1">{label}</label>
        {children}
    </div>
  );

  const roles: UserRole[] = ['Super Admin', 'Moderator', 'Support Agent', 'End User'];
  const statuses: UserStatus[] = ['Active', 'Suspended', 'Banned'];
  const plans: SubscriptionPlan[] = ['Free', 'Pro', 'Enterprise'];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-premium-dark-gray/95 backdrop-blur-xl rounded-2xl border border-white/10 p-8 max-w-lg w-full shadow-lg"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 bg-premium-gold/20">
                <Edit className="w-6 h-6 text-premium-gold" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-premium-platinum">Edit User</h2>
                <p className="text-premium-light-gray/80 text-sm">Editing profile for {user.name}</p>
              </div>
            </div>
            
            <div className="space-y-4">
                <FormRow label="Full Name">
                    <input type="text" value={formData.name} onChange={e => handleInputChange('name', e.target.value)} className="w-full p-2 bg-premium-dark-gray border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-premium-gold" />
                </FormRow>
                <FormRow label="Email Address">
                    <input type="email" value={formData.email} onChange={e => handleInputChange('email', e.target.value)} className="w-full p-2 bg-premium-dark-gray border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-premium-gold" />
                </FormRow>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormRow label="Role">
                        <select value={formData.role} onChange={e => handleInputChange('role', e.target.value)} className="w-full p-2 bg-premium-dark-gray border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-premium-gold">
                            {roles.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                    </FormRow>
                    <FormRow label="Status">
                        <select value={formData.status} onChange={e => handleInputChange('status', e.target.value)} className="w-full p-2 bg-premium-dark-gray border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-premium-gold">
                            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </FormRow>
                    <FormRow label="Plan">
                        <select value={formData.plan} onChange={e => handleInputChange('plan', e.target.value)} className="w-full p-2 bg-premium-dark-gray border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-premium-gold">
                            {plans.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                    </FormRow>
                </div>
            </div>
            
            <div className="flex justify-end space-x-4 mt-8">
              <motion.button onClick={onClose} className="px-6 py-2 rounded-xl bg-premium-medium-gray text-premium-platinum hover:bg-premium-medium-gray/80 transition-colors" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                Cancel
              </motion.button>
              <motion.button onClick={handleSave} className="px-6 py-2 rounded-xl text-black bg-premium-gold hover:opacity-90 transition-colors" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                Save Changes
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditUserModal;
