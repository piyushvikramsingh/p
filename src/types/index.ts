// src/types/index.ts

// User and Authentication Types
export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  isAnonymous: boolean;
  metadata: {
    creationTime?: string;
    lastSignInTime?: string;
  };
  providerData: Array<{
    uid: string;
    displayName: string | null;
    email: string | null;
    phoneNumber: string | null;
    photoURL: string | null;
    providerId: string;
  }>;
  refreshToken: string;
  tenantId: string | null;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'Super Admin' | 'Moderator' | 'Support Agent' | 'End User';
  plan: 'Free' | 'Pro' | 'Enterprise';
  createdAt: Date;
  lastActive: Date;
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

// Message and Chat Types
export interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  userId: string;
  conversationId: string;
  imageUrl?: string;
  audioUrl?: string;
  reactions?: {
    thumbsUp: boolean;
    thumbsDown: boolean;
  };
  attachments?: string[];
}

export interface Conversation {
  id: string;
  title: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  messageCount: number;
  lastMessage?: string;
  isStarred: boolean;
  tags: string[];
}

// Task Management Types
export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'inprogress' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  tags: string[];
  reminder?: Date;
  project?: string;
  isRecurring: boolean;
  recurrenceRule?: string;
  estimatedTime?: number;
  actualTime?: number;
  assignedTo?: string;
  dependencies?: string[];
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  color: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  isArchived: boolean;
  taskCount: number;
  completedTaskCount: number;
}

// Memory and Knowledge Types
export interface MemoryItem {
  id: string;
  title: string;
  content: string;
  type: 'note' | 'conversation' | 'preference' | 'knowledge' | 'insight';
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  isStarred: boolean;
  isPrivate: boolean;
  relatedItems?: string[];
  source?: string;
  metadata?: Record<string, any>;
}

// Calendar Types
export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  location?: string;
  attendees?: string[];
  userId: string;
  isRecurring: boolean;
  recurrenceRule?: string;
  reminder?: Date;
  color?: string;
  isAllDay: boolean;
  timezone?: string;
  status: 'confirmed' | 'tentative' | 'cancelled';
}

// File Management Types
export interface FileItem {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  thumbnailUrl?: string;
  userId: string;
  folderId?: string;
  uploadedAt: Date;
  tags: string[];
  metadata?: Record<string, any>;
  isShared: boolean;
  permissions?: Array<{
    userId: string;
    permission: 'view' | 'edit' | 'admin';
  }>;
}

export interface Folder {
  id: string;
  name: string;
  parentId?: string;
  userId: string;
  createdAt: Date;
  color?: string;
  isShared: boolean;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: Date;
  actionUrl?: string;
  metadata?: Record<string, any>;
}

// Settings Types
export interface BrandingSettings {
  logoUrl?: string;
  faviconUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  companyName?: string;
  tagline?: string;
}

export interface AISettings {
  model: 'claude' | 'gpt4' | 'gemini';
  temperature: number;
  maxTokens: number;
  enableVoice: boolean;
  enableImageGeneration: boolean;
  voiceSettings?: {
    voiceId: string;
    speed: number;
    pitch: number;
  };
}

export interface AuthSettings {
  providers: {
    google: boolean;
    github: boolean;
    apple: boolean;
    facebook: boolean;
  };
  requireEmailVerification: boolean;
  allowAnonymous: boolean;
}

export interface AppSettings {
  branding: BrandingSettings;
  ai: AISettings;
  auth: AuthSettings;
  features: {
    tasks: boolean;
    calendar: boolean;
    files: boolean;
    memory: boolean;
    integrations: boolean;
  };
}

// Google Services Types
export interface GoogleDriveFile {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  modifiedTime: string;
  webViewLink?: string;
  thumbnailLink?: string;
  iconLink?: string;
  parents?: string[];
  starred?: boolean;
  shared?: boolean;
}

export interface GoogleCalendarEvent {
  id: string;
  summary: string;
  description?: string;
  location?: string;
  start: {
    dateTime?: string;
    date?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
  };
  attendees?: Array<{
    email: string;
    displayName?: string;
    responseStatus?: string;
  }>;
}

export interface GmailMessage {
  id: string;
  threadId: string;
  snippet: string;
  from?: string;
  to?: string;
  subject?: string;
  date?: string;
  labelIds?: string[];
  isUnread?: boolean;
  hasAttachments?: boolean;
  body?: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  nextPageToken?: string;
  totalCount?: number;
  hasMore: boolean;
}

// Form and Input Types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'checkbox' | 'date' | 'file';
  required: boolean;
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    custom?: (value: any) => boolean | string;
  };
}

// Error Types
export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
  userId?: string;
}

// Theme Types
export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    accent: string;
    error: string;
    warning: string;
    success: string;
    info: string;
  };
  fonts: {
    primary: string;
    secondary: string;
    mono: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    full: string;
  };
}

// Context Types
export interface AppContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  error: string | null;
  theme: 'light' | 'dark' | 'system';
  sidebarCollapsed: boolean;
  notifications: Notification[];
  setSidebarCollapsed: (collapsed: boolean) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  clearError: () => void;
}

// Hook Types
export interface UseApiOptions {
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

export interface UseApiReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: (...args: any[]) => Promise<T>;
  reset: () => void;
}

// Component Props Types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
  id?: string;
}

export interface IconProps extends BaseComponentProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

// Analytics Types
export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  userId?: string;
  timestamp: Date;
}

export interface UsageStats {
  messagesCount: number;
  tasksCreated: number;
  filesUploaded: number;
  memoryItemsCreated: number;
  lastActiveDate: Date;
  totalTimeSpent: number;
}

// Export all types
export type {
  // Add any additional type exports here
};
