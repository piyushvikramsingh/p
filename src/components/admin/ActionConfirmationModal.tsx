import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

interface ActionConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning';
}

const ActionConfirmationModal: React.FC<ActionConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
}) => {
  const buttonColor = variant === 'danger' ? 'bg-red-600 hover:bg-red-700' : 'bg-yellow-500 hover:bg-yellow-600';

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
            className="bg-premium-dark-gray/95 backdrop-blur-xl rounded-2xl border border-white/10 p-8 max-w-md w-full shadow-lg"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start space-x-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${variant === 'danger' ? 'bg-red-500/20' : 'bg-yellow-500/20'}`}>
                <AlertTriangle className={`w-6 h-6 ${variant === 'danger' ? 'text-red-500' : 'text-yellow-500'}`} />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-premium-platinum mb-2">{title}</h2>
                <p className="text-premium-light-gray/80 text-sm">{message}</p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-4 mt-8">
              <motion.button
                onClick={onClose}
                className="px-6 py-2 rounded-xl bg-premium-medium-gray text-premium-platinum hover:bg-premium-medium-gray/80 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {cancelText}
              </motion.button>
              <motion.button
                onClick={onConfirm}
                className={`px-6 py-2 rounded-xl text-white transition-colors ${buttonColor}`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {confirmText}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ActionConfirmationModal;
