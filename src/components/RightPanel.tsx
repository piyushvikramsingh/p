import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, CheckCircle, Bell, Star } from 'lucide-react';

const RightPanel: React.FC = () => {
  const Card: React.FC<{ children: React.ReactNode, delay: number }> = ({ children, delay }) => (
    <motion.div
      className="bg-premium-dark-gray/80 backdrop-blur-xl rounded-2xl p-4 border border-white/10 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );

  const CardHeader: React.FC<{ icon: React.ElementType, title: string }> = ({ icon: Icon, title }) => (
    <div className="flex items-center space-x-3 mb-4">
      <div className="w-8 h-8 bg-premium-dark-gray rounded-xl flex items-center justify-center border border-white/10">
        <Icon className="w-5 h-5 text-premium-gold" />
      </div>
      <h3 className="font-semibold text-premium-platinum">{title}</h3>
    </div>
  );

  return (
    <motion.div
      className="w-80 bg-premium-dark border-l border-white/10 p-6 space-y-6 overflow-y-auto"
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card delay={0.1}>
        <CardHeader icon={Lightbulb} title="Smart Suggestions" />
        <div className="space-y-3">
          {['Schedule team meeting', 'Review quarterly reports', 'Plan creative session'].map((text, i) => (
            <motion.div
              key={i}
              className="p-3 bg-premium-dark-gray rounded-xl hover:bg-premium-medium-gray cursor-pointer transition-all border border-white/10"
              whileHover={{ scale: 1.02, y: -2 }}
            >
              <p className="text-sm text-premium-light-gray">{text}</p>
            </motion.div>
          ))}
        </div>
      </Card>

      <Card delay={0.2}>
        <CardHeader icon={CheckCircle} title="Recent Tasks" />
        <div className="space-y-3">
          {[
            { text: 'Email campaign design', completed: true },
            { text: 'Website mockup review', completed: false },
          ].map((task, i) => (
            <div key={i} className="flex items-center space-x-3">
              <div className={`w-4 h-4 rounded-full border-2 ${task.completed ? 'bg-premium-gold border-premium-gold' : 'border-premium-light-gray/50'}`} />
              <p className={`text-sm ${task.completed ? 'line-through text-premium-light-gray/50' : 'text-premium-light-gray'}`}>
                {task.text}
              </p>
            </div>
          ))}
        </div>
      </Card>

      <Card delay={0.3}>
        <CardHeader icon={Bell} title="Notifications" />
        <div className="space-y-3">
          {['Team standup meeting', 'Project deadline approaching'].map((text, i) => (
            <div key={i} className="p-3 bg-premium-dark-gray rounded-xl border border-white/10">
              <p className="text-sm text-premium-light-gray">{text}</p>
            </div>
          ))}
        </div>
      </Card>
      
      <Card delay={0.4}>
        <CardHeader icon={Star} title="AI Insights" />
        <div className="space-y-3">
          {['Productivity peaks at 9-11 AM.', 'You\'ve completed 89% of goals.'].map((text, i) => (
            <div key={i} className="flex items-start space-x-3">
              <Star className="w-4 h-4 text-premium-diamond mt-0.5 flex-shrink-0" />
              <p className="text-sm text-premium-light-gray">{text}</p>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
};

export default RightPanel;
