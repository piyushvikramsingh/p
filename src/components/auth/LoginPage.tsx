import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useUser, UserRole } from '../../contexts/UserContext';
import { toast } from 'react-hot-toast';
import { LogIn, User, Key, ArrowRight, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LoginPageProps {
  isAdminLogin: boolean;
}

const LoginPage: React.FC<LoginPageProps> = ({ isAdminLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useUser();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate network delay
    setTimeout(() => {
      const role: UserRole = isAdminLogin ? 'Super Admin' : 'End User';
      const success = login(email, password, role);
      
      if (!success) {
        toast.error('Invalid credentials. Please try again.');
        setIsLoading(false);
      }
      // On success, the user context will navigate away
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-premium-dark font-inter flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-premium-decorative-gradient opacity-20"></div>
      <motion.div 
        className="relative z-10 w-full max-w-md bg-premium-dark-gray/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl shadow-premium-gold/10"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <Link to="/" className="absolute top-4 left-4 text-premium-light-gray/50 hover:text-premium-gold transition-colors">
          <ArrowRight className="w-5 h-5 rotate-180" />
        </Link>
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gold-diamond-gradient rounded-2xl flex items-center justify-center shadow-lg shadow-premium-gold/20 mx-auto mb-4">
            {isAdminLogin ? <Shield className="w-8 h-8 text-black" /> : <span className="text-black font-bold text-3xl">P</span>}
          </div>
          <h1 className="text-3xl font-bold text-premium-platinum">{isAdminLogin ? 'Admin Login' : 'Welcome Back'}</h1>
          <p className="text-premium-light-gray/70 mt-1">Sign in to continue to P.AI</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-premium-light-gray/50" />
            <input
              type="email"
              placeholder="Email (piyush@example.com)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-12 pr-4 py-3 bg-premium-dark-gray border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-premium-gold text-premium-platinum placeholder-premium-light-gray/50"
            />
          </div>
          <div className="relative">
            <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-premium-light-gray/50" />
            <input
              type="password"
              placeholder="Password (piyush)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-12 pr-4 py-3 bg-premium-dark-gray border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-premium-gold text-premium-platinum placeholder-premium-light-gray/50"
            />
          </div>
          
          <motion.button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center px-4 py-3 rounded-xl bg-premium-gold text-black font-semibold transition-opacity shadow-lg shadow-premium-gold/30 disabled:opacity-50"
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="w-5 h-5 mr-2" />
                <span>Sign In</span>
              </>
            )}
          </motion.button>
        </form>
        
        <div className="text-center mt-6 text-sm">
          {isAdminLogin ? (
            <Link to="/login" className="text-premium-light-gray/60 hover:text-premium-gold transition-colors">
              Not an admin? Login here
            </Link>
          ) : (
            <Link to="/admin-login" className="text-premium-light-gray/60 hover:text-premium-gold transition-colors">
              Login as Admin
            </Link>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
