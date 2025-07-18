// src/lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  GithubAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import { 
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL,
  deleteObject 
} from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Auth providers
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();

// Add scopes for Google
googleProvider.addScope('https://www.googleapis.com/auth/drive.readonly');
googleProvider.addScope('https://www.googleapis.com/auth/calendar.readonly');
googleProvider.addScope('https://www.googleapis.com/auth/gmail.readonly');

// User interface
export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'Super Admin' | 'Moderator' | 'Support Agent' | 'End User';
  plan: 'Free' | 'Pro' | 'Enterprise';
  createdAt: Timestamp;
  lastActive: Timestamp;
  preferences?: {
    theme: 'light' | 'dark' | 'system';
    language: string;
    notifications: boolean;
  };
  googleTokens?: {
    accessToken: string;
    refreshToken: string;
  };
}

// Auth functions
export const signInWithEmail = (email: string, password: string) => 
  signInWithEmailAndPassword(auth, email, password);

export const signUpWithEmail = async (email: string, password: string, displayName: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  
  // Create user profile in Firestore
  await createUserProfile(user, { displayName });
  
  return userCredential;
};

export const signInWithGoogle = async () => {
  const result = await signInWithPopup(auth, googleProvider);
  
  // Get the Google Access Token
  const credential = GoogleAuthProvider.credentialFromResult(result);
  const token = credential?.accessToken;
  
  // Save tokens for Google API access
  if (token) {
    await updateDoc(doc(db, 'users', result.user.uid), {
      googleTokens: {
        accessToken: token,
        refreshToken: result.user.refreshToken
      }
    });
  }
  
  await createUserProfile(result.user);
  return result;
};

export const signInWithGithub = async () => {
  const result = await signInWithPopup(auth, githubProvider);
  await createUserProfile(result.user);
  return result;
};

export const logOut = () => signOut(auth);

// Create or update user profile
export const createUserProfile = async (user: User, additionalData?: any) => {
  if (!user) return;
  
  const userRef = doc(db, 'users', user.uid);
  const snapshot = await getDoc(userRef);
  
  if (!snapshot.exists()) {
    const { displayName, email, photoURL } = user;
    const createdAt = serverTimestamp();
    
    try {
      await setDoc(userRef, {
        uid: user.uid,
        displayName: displayName || additionalData?.displayName || 'User',
        email,
        photoURL,
        role: 'End User',
        plan: 'Free',
        createdAt,
        lastActive: createdAt,
        preferences: {
          theme: 'dark',
          language: 'en',
          notifications: true
        },
        ...additionalData
      });
    } catch (error) {
      console.error('Error creating user profile:', error);
    }
  } else {
    // Update last active
    await updateDoc(userRef, {
      lastActive: serverTimestamp()
    });
  }
  
  return userRef;
};

// Get user profile
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const userRef = doc(db, 'users', uid);
  const snapshot = await getDoc(userRef);
  
  if (snapshot.exists()) {
    return snapshot.data() as UserProfile;
  }
  
  return null;
};

// Chat functions
export interface ChatMessage {
  id?: string;
  userId: string;
  content: string;
  isUser: boolean;
  timestamp: Timestamp;
  reactions?: {
    thumbsUp: boolean;
    thumbsDown: boolean;
  };
  attachments?: string[];
}

export const saveMessage = async (message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
  const messagesRef = collection(db, 'messages');
  return await addDoc(messagesRef, {
    ...message,
    timestamp: serverTimestamp()
  });
};

export const getUserMessages = async (userId: string, limitCount: number = 50) => {
  const messagesRef = collection(db, 'messages');
  const q = query(
    messagesRef, 
    where('userId', '==', userId),
    orderBy('timestamp', 'desc'),
    limit(limitCount)
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as ChatMessage[];
};

// Task functions
export interface Task {
  id?: string;
  userId: string;
  title: string;
  description?: string;
  status: 'todo' | 'inprogress' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: Timestamp;
  project: string;
  tags: string[];
  isRecurring: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export const createTask = async (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
  const tasksRef = collection(db, 'tasks');
  return await addDoc(tasksRef, {
    ...task,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
};

export const getUserTasks = async (userId: string) => {
  const tasksRef = collection(db, 'tasks');
  const q = query(
    tasksRef,
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Task[];
};

// Memory functions
export interface Memory {
  id?: string;
  userId: string;
  title: string;
  content: string;
  type: 'note' | 'conversation' | 'preference' | 'knowledge' | 'insight';
  tags: string[];
  isStarred: boolean;
  isPrivate: boolean;
  source: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export const createMemory = async (memory: Omit<Memory, 'id' | 'createdAt' | 'updatedAt'>) => {
  const memoriesRef = collection(db, 'memories');
  return await addDoc(memoriesRef, {
    ...memory,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
};

export const getUserMemories = async (userId: string) => {
  const memoriesRef = collection(db, 'memories');
  const q = query(
    memoriesRef,
    where('userId', '==', userId),
    orderBy('updatedAt', 'desc')
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Memory[];
};

// File upload functions
export const uploadFile = async (file: File, path: string) => {
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(snapshot.ref);
  return downloadURL;
};

export const deleteFile = async (path: string) => {
  const storageRef = ref(storage, path);
  await deleteObject(storageRef);
};

// Real-time listeners
export const subscribeToMessages = (userId: string, callback: (messages: ChatMessage[]) => void) => {
  const messagesRef = collection(db, 'messages');
  const q = query(
    messagesRef,
    where('userId', '==', userId),
    orderBy('timestamp', 'desc'),
    limit(50)
  );
  
  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as ChatMessage[];
    callback(messages);
  });
};

export const subscribeToTasks = (userId: string, callback: (tasks: Task[]) => void) => {
  const tasksRef = collection(db, 'tasks');
  const q = query(
    tasksRef,
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  
  return onSnapshot(q, (snapshot) => {
    const tasks = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Task[];
    callback(tasks);
  });
};

// Settings functions
export interface AppSettings {
  logoUrl?: string;
  faviconUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  aiModel: 'claude' | 'gpt4' | 'gemini';
  authProviders: {
    google: boolean;
    github: boolean;
    apple: boolean;
    facebook: boolean;
  };
}

export const getAppSettings = async (): Promise<AppSettings> => {
  const settingsRef = doc(db, 'settings', 'app');
  const snapshot = await getDoc(settingsRef);
  
  if (snapshot.exists()) {
    return snapshot.data() as AppSettings;
  }
  
  // Default settings
  return {
    primaryColor: '#FFD700',
    secondaryColor: '#b9f2ff',
    aiModel: 'claude',
    authProviders: {
      google: true,
      github: true,
      apple: false,
      facebook: false
    }
  };
};

export const updateAppSettings = async (settings: Partial<AppSettings>) => {
  const settingsRef = doc(db, 'settings', 'app');
  await setDoc(settingsRef, settings, { merge: true });
};
