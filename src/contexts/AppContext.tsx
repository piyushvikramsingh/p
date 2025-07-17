import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, generateUsers } from '../lib/mock-data';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'in-app' | 'email' | 'push';
  read: boolean;
  createdAt: Date;
}

interface AppContextType {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  notifications: AppNotification[];
  addNotification: (notification: Omit<AppNotification, 'id' | 'read' | 'createdAt'>) => void;
  markNotificationsAsRead: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => generateUsers(50));
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  const addNotification = (notification: Omit<AppNotification, 'id' | 'read' | 'createdAt'>) => {
    const newNotification: AppNotification = {
      ...notification,
      id: Date.now().toString(),
      read: false,
      createdAt: new Date(),
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const value = {
    users,
    setUsers,
    notifications,
    addNotification,
    markNotificationsAsRead,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
