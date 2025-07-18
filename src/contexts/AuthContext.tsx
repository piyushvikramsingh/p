// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  User as FirebaseUser,
  GoogleAuthProvider,
  signInWithPopup,
  GithubAuthProvider
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { toast } from 'react-hot-toast';

export type UserRole = 'Super Admin' | 'Moderator' | 'Support Agent' | 'End User';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: Date;
  lastLoginAt: Date;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithGithub: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Create or update user document in Firestore
  const createUserDocument = async (firebaseUser: FirebaseUser, additionalData?: any) => {
    if (!firebaseUser) return;

    const userRef = doc(db, 'users', firebaseUser.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      const { displayName, email } = firebaseUser;
      const userData = {
        name: displayName || additionalData?.name || 'Anonymous User',
        email,
        role: 'End User' as UserRole,
        createdAt: new Date(),
        lastLoginAt: new Date(),
        ...additionalData,
      };

      try {
        await setDoc(userRef, userData);
        return userData;
      } catch (error) {
        console.error('Error creating user document:', error);
        throw error;
      }
    } else {
      // Update last login time
      await setDoc(userRef, { lastLoginAt: new Date() }, { merge: true });
      return userSnap.data();
    }
  };

  // Convert Firebase user to our User type
  const convertFirebaseUser = (firebaseUser: FirebaseUser, userData: any): User => {
    return {
      id: firebaseUser.uid,
      name: userData.name || firebaseUser.displayName || 'Anonymous User',
      email: firebaseUser.email || '',
      role: userData.role || 'End User',
      avatarUrl: firebaseUser.photoURL || undefined,
      createdAt: userData.createdAt?.toDate() || new Date(),
      lastLoginAt: userData.lastLoginAt?.toDate() || new Date(),
    };
  };

  // Login with email and password
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { user: firebaseUser } = await signInWithEmailAndPassword(auth, email, password);
      const userData = await createUserDocument(firebaseUser);
      const user = convertFirebaseUser(firebaseUser, userData);
      setUser(user);
      toast.success('Successfully logged in!');
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Failed to login');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Register with email and password
  const register = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);
      const userData = await createUserDocument(firebaseUser, { name });
      const user = convertFirebaseUser(firebaseUser, userData);
      setUser(user);
      toast.success('Account created successfully!');
    } catch (error: any) {
      console.error('Register error:', error);
      toast.error(error.message || 'Failed to create account');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Login with Google
  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      const { user: firebaseUser } = await signInWithPopup(auth, provider);
      const userData = await createUserDocument(firebaseUser);
      const user = convertFirebaseUser(firebaseUser, userData);
      setUser(user);
      toast.success('Successfully logged in with Google!');
    } catch (error: any) {
      console.error('Google login error:', error);
      toast.error(error.message || 'Failed to login with Google');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Login with GitHub
  const loginWithGithub = async () => {
    try {
      setLoading(true);
      const provider = new GithubAuthProvider();
      const { user: firebaseUser } = await signInWithPopup(auth, provider);
      const userData = await createUserDocument(firebaseUser);
      const user = convertFirebaseUser(firebaseUser, userData);
      setUser(user);
      toast.success('Successfully logged in with GitHub!');
    } catch (error: any) {
      console.error('GitHub login error:', error);
      toast.error(error.message || 'Failed to login with GitHub');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      toast.success('Successfully logged out');
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
      throw error;
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userRef = doc(db, 'users', firebaseUser.uid);
          const userSnap = await getDoc(userRef);
          
          if (userSnap.exists()) {
            const userData = userSnap.data();
            const user = convertFirebaseUser(firebaseUser, userData);
            setUser(user);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    user,
    loading,
    login,
    register,
    loginWithGoogle,
    loginWithGithub,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
