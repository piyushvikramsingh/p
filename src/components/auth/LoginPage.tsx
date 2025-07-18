// src/components/auth/LoginPage.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useSettings } from '../../contexts/SettingsContext';
import { toast } from 'react-hot-toast';
import { LogIn, User, Key, ArrowRight, Shield, Github, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const GoogleIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.16c1.56 0 2.95.54 4.04 1.58l3.15-3.15C17.45 1.99 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

interface LoginPageProps {
  isAdminLogin?: boolean;
}

const LoginPage: React.FC<LoginPageProps> = ({ isAdminLogin = false }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, register, loginWithGoogle, loginWithGithub } = useAuth();
  const { authSettings } = useSettings();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (isRegistering) {
        if (!name.trim()) {
          toast.error('Please enter your name');
          return;
        }
        await register(email, password, name);
      } else {
        await login(email, password);
      }
      navigate('/app');
    } catch (error: any) {
      console.error('Auth error:', error);
      // Error is already handled in the auth context
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await loginWithGoogle();
      navigate('/app');
    } catch (error) {
      console.error('Google login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    setIsLoading(true);
    try {
      await loginWithGithub();
      navigate('/app');
    } catch (error) {
      console.error('GitHub login error:', error);
    } finally {
      setIsLoading(false);
    }
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
            {isAdminLogin ? (
              <Shield className="w-8 h-8 text-black" />
            ) : (
              <span className="text-black font-bold text-3xl">P</span>
            )}
          </div>
          <h1 className="text-3xl font-bold text-premium-platinum">
            {isAdminLogin ? 'Admin Login' : isRegistering ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="text-premium-light-gray/70 mt-1">
            {isRegistering ? 'Join P.AI today' : 'Sign in to continue to P.AI'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {isRegistering && (
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-premium-light-gray/50" />
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-3 bg-premium-dark-gray border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-premium-gold text-premium-platinum placeholder-premium-light-gray/50"
              />
            </div>
          )}

          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-premium-light-gray/50" />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-12 pr-4 py-3 bg-premium-dark-gray border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-premium-gold text-premium-platinum placeholder-premium-light-gray/50"
            />
          </div>

          <div className="relative">
            <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-premium-light-gray/50" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-12 pr-12 py-3 bg-premium-dark-gray border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-premium-gold text-premium-platinum placeholder-premium-light-gray/50"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-premium-light-gray/50 hover:text-premium-light-gray"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          
          <motion.button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center px-4 py-3 rounded-xl bg-premium-gold text-black font-semibold transition-opacity shadow-lg shadow-premium-gold/30 disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="w-5 h-5 mr-2" />
                <span>{isRegistering ? 'Create Account' : 'Sign In'}</span>
              </>
            )}
          </motion.button>
        </form>
        
        {!isAdminLogin && (authSettings.google || authSettings.github) && (
          <>
            <div className="flex items-center my-6">
              <div className="flex-grow border-t border-white/10"></div>
              <span className="flex-shrink mx-4 text-premium-light-gray/50 text-sm">OR</span>
              <div className="flex-grow border-t border-white/10"></div>
            </div>
            
            <div className="flex items-center justify-center space-x-4">
              {authSettings.google && (
                <motion.button 
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className="w-12 h-12 flex items-center justify-center bg-premium-dark-gray border border-white/10 rounded-full hover:border-premium-gold/50 disabled:opacity-50 disabled:cursor-not-allowed" 
                  whileHover={{ scale: isLoading ? 1 : 1.05 }} 
                  whileTap={{ scale: isLoading ? 1 : 0.95 }}
                >
                  <GoogleIcon />
                </motion.button>
              )}
              {authSettings.github && (
                <motion.button 
                  onClick={handleGithubLogin}
                  disabled={isLoading}
                  className="w-12 h-12 flex items-center justify-center bg-premium-dark-gray border border-white/10 rounded-full text-premium-light-gray hover:border-premium-gold/50 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed" 
                  whileHover={{ scale: isLoading ? 1 : 1.05 }} 
                  whileTap={{ scale: isLoading ? 1 : 0.95 }}
                >
                  <Github className="w-6 h-6" />
                </motion.button>
              )}
            </div>
          </>
        )}
        
        <div className="text-center mt-6 space-y-2">
          {!isAdminLogin && (
            <button
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-premium-light-gray/60 hover:text-premium-gold transition-colors text-sm"
            >
              {isRegistering ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          )}
          
          <div className="text-sm">
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
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
