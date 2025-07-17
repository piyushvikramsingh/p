import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from './AppContext';

export type UserRole = 'Super Admin' | 'Moderator' | 'Support Agent' | 'End User';

interface CurrentUser {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  avatarInitial: string;
}

interface UserContextType {
  user: CurrentUser | null;
  isAuthenticated: boolean;
  login: (email: string, pass: string, role: UserRole) => boolean;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const navigate = useNavigate();
  const { users } = useApp();

  // Persist auth state
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      // Re-verify role from central state on load
      const centralUser = users.find(u => u.id === parsedUser.id);
      if (centralUser) {
        parsedUser.role = centralUser.role;
      }
      setUser(parsedUser);
      setIsAuthenticated(true);
    }
  }, [users]); // Rerun if the central users list changes

  const login = (email: string, pass: string, requestedRole: UserRole): boolean => {
    // Hardcoded credentials as requested
    if (email.toLowerCase() !== 'piyush@example.com' || pass !== 'piyush') {
      return false;
    }
    
    // Find the user in the central user list to get their current data
    const centralUser = users.find(u => u.email.toLowerCase() === 'piyush@example.com');
    
    if (!centralUser) {
        // This case handles if the main user isn't in the generated list.
        // We'll create a default one.
        const loggedInUser: CurrentUser = {
            id: 'piyush-main-user',
            name: 'Piyush Sharma',
            role: requestedRole,
            email: 'piyush@example.com',
            avatarInitial: 'P',
        };
        setUser(loggedInUser);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(loggedInUser));
        navigate('/app');
        return true;
    }

    // Check if the user is trying to log in as admin but doesn't have the role
    if (requestedRole === 'Super Admin' && centralUser.role !== 'Super Admin') {
        return false;
    }

    const loggedInUser: CurrentUser = {
      id: centralUser.id,
      name: centralUser.name,
      role: centralUser.role, // Use the role from the central state
      email: centralUser.email,
      avatarInitial: centralUser.name.charAt(0).toUpperCase(),
    };

    setUser(loggedInUser);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(loggedInUser));
    navigate('/app');
    return true;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    navigate('/');
  };

  const value = { user, isAuthenticated, login, logout };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
