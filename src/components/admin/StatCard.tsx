import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatCardProps {
  icon: React.ElementType;
  title: string;
  value: string;
  trend: string;
  isNegative?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, title, value, trend, isNegative = false }) => {
  return (
    <motion.div 
      className="bg-premium-dark-gray/60 rounded-2xl p-5 border border-white/10"
      whileHover={{ scale: 1.02, y: -2, backgroundColor: 'rgba(26, 26, 26, 0.9)' }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-premium-light-gray/70">{title}</p>
        <Icon className="w-5 h-5 text-premium-light-gray/50" />
      </div>
      <div className="flex items-end justify-between">
        <p className="text-3xl font-bold text-premium-platinum">{value}</p>
        <div className={`flex items-center text-sm font-medium ${isNegative ? 'text-red-400' : 'text-green-400'}`}>
          {isNegative ? <ArrowDownRight className="w-4 h-4 mr-1" /> : <ArrowUpRight className="w-4 h-4 mr-1" />}
          <span>{trend}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;
