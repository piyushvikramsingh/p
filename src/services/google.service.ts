// src/services/google.service.ts

// Google API Configuration
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const DISCOVERY_DOCS = [
  'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest',
  'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest',
  'https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest',
  'https://www.googleapis.com/discovery/v1/apis/tasks/v1/rest',
  'https://www.googleapis.com/discovery/v1/apis/people/v1/rest'
];
const SCOPES = [
  'https://www.googleapis.com/auth/drive.readonly',
  'https://www.googleapis.com/auth/calendar.readonly',
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/contacts.readonly',
  'https://www.googleapis.com/auth/tasks.readonly',
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/user.emails.read'
].join(' ');

// Declare gapi types
declare global {
  interface Window {
    gapi: any;
  }
}

export interface DriveFile {
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
  permissions?: Array<{
    id: string;
    type: string;
    role: string;
    emailAddress?: string;
  }>;
}

export interface CalendarEvent {
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
  conferenceData?: {
    conferenceSolution?: {
      iconUri: string;
      key: { type: string };
      name: string;
    };
    entryPoints?: Array<{
      uri: string;
      entryPointType: string;
      label?: string;
    }>;
  };
  recurrence?: string[];
  reminders?: {
    useDefault: boolean;
    overrides?: Array<{
      method: string;
      minutes: number;
    }>;
  };
  status?: string;
  transparency?: string;
  visibility?: string;
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
  attachments?: Array<{
    filename: string;
    mimeType: string;
    size: number;
  }>;
}

export interface GoogleContact {
  resourceName: string;
  etag: string;
  names?: Array<{
    displayName: string;
    familyName?: string;
    givenName?: string;
  }>;
  emailAddresses?: Array<{
    value: string;
    type?: string;
  }>;
  phoneNumbers?: Array<{
    value: string;
    type?: string;
  }>;
  photos?: Array<{
    url: string;
  }>;
}

export interface GoogleTask {
  id: string;
  title: string;
  notes?: string;
  due?: string;
  completed?: string;
  status: 'needsAction' | 'completed';
  links?: Array<{
    type: string;
    description: string;
    link: string;
  }>;
}

class GoogleService {
  private isInitialized = false;
  private accessToken: string | null = null;
  private lastRequestTime = 0;
  private readonly REQUEST_DELAY = 200; // ms between requests
  private driveFileCache = new Map<string, DriveFile>();
  private calendarEventCache = new Map<string, CalendarEvent>();
  private gmailMessageCache = new Map<string, GmailMessage>();
  private gapi: any = null;

  // Load Google API script
  private async loadGapi(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (window.gapi) {
        this.gapi = window.gapi;
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => {
        this.gapi = window.gapi;
        resolve();
      };
      script.onerror = () => reject(new Error('Failed to load Google API script'));
      document.head.appendChild(script);
    });
  }

  // Initialize Google API
  async init(): Promise<void> {
    if (this.isInitialized) return;
    
    if (!CLIENT_ID || !API_KEY) {
      throw new Error('Missing Google API configuration. Please check your environment variables.');
    }

    try {
      await this.loadGapi();
      
      return new Promise((resolve, reject) => {
        this.gapi.load('client:auth2', async () => {
          try {
            await this.gapi.client.init({
              apiKey: API_KEY,
              clientId: CLIENT_ID,
              discoveryDocs: DISCOVERY_DOCS,
              scope: SCOPES
            });
            
            this.isInitialized = true;
            resolve();
          } catch (error: any) {
            const message = error.result?.error?.message || error.message;
            console.error('Google API initialization failed:', message);
            reject(new Error(`Failed to initialize Google API: ${message}`));
          }
        });
      });
    } catch (error) {
      console.error('Failed to load Google API:', error);
      throw error;
    }
  }

  // Set access token from Firebase Auth
  setAccessToken(token: string) {
    this.accessToken = token;
    if (this.gapi?.client && token) {
      this.gapi.client.setToken({ access_token: token });
    }
  }

  // Check if user is signed in
  isSignedIn(): boolean {
    if (!this.isInitialized || !this.gapi) return false;
    return this.gapi.auth2.getAuthInstance().isSignedIn.get();
  }

  // Sign in with Google (if not using Firebase Auth)
  async signIn(): Promise<void> {
    if (!this.isInitialized) await this.init();
    await this.gapi.auth2.getAuthInstance().signIn();
  }

  // Sign out
  async signOut(): Promise<void> {
    if (!this.isInitialized || !this.gapi) return;
    await this.gapi.auth2.getAuthInstance().signOut();
    this.clearCache();
  }

  // Cleanup resources
  destroy() {
    if (this.gapi?.client) {
      this.gapi.client.setToken(null);
    }
    this.accessToken = null;
    this.clearCache();
  }

  private clearCache() {
    this.driveFileCache.clear();
    this.calendarEventCache.clear();
    this.gmailMessageCache.clear();
  }

  private async throttleRequest() {
    const now = Date.now();
    if (now - this.lastRequestTime < this.REQUEST_DELAY) {
      await new Promise(resolve => setTimeout(resolve, this.REQUEST_DELAY - (now - this.lastRequestTime)));
    }
    this.lastRequestTime = Date.now();
  }

  private handleApiError(method: string, error: any): never {
    const message = error.result?.error?.message || error.message;
    console.error(`Google API Error (${method}):`, message);
    throw new Error(`Google API ${method} failed: ${message}`);
  }

  // Google Drive Methods using fetch instead of gapi for better reliability
  async getDriveFiles(options?: {
    pageSize?: number;
    orderBy?: string;
    q?: string;
    pageToken?: string;
    fields?: string;
  }): Promise<{ files: DriveFile[]; nextPageToken?: string }> {
    try {
      if (!this.accessToken) {
        throw new Error('No access token available');
      }

      await this.throttleRequest();
      
      const params = new URLSearchParams({
        pageSize: (options?.pageSize || 20).toString(),
        orderBy: options?.orderBy || 'modifiedTime desc',
        q: options?.q || "trashed = false",
        fields: options?.fields || 'nextPageToken, files(id, name, mimeType, size, modifiedTime, webViewLink, thumbnailLink, iconLink, parents, starred, shared)',
        ...(options?.pageToken && { pageToken: options.pageToken })
      });

      const response = await fetch(`https://www.googleapis.com/drive/v3/files?${params}`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Drive API error: ${response.status} - ${errorData}`);
      }

      const data = await response.json();

      // Cache the files
      data.files?.forEach((file: DriveFile) => {
        if (file.id) this.driveFileCache.set(file.id, file);
      });

      return {
        files: data.files || [],
        nextPageToken: data.nextPageToken
      };
    } catch (error) {
      this.handleApiError('getDriveFiles', error);
    }
  }

  async searchDriveFiles(query: string): Promise<DriveFile[]> {
    try {
      if (!this.accessToken) {
        throw new Error('No access token available');
      }

      await this.throttleRequest();
      
      const params = new URLSearchParams({
        q: `name contains '${query}' and trashed = false`,
        pageSize: '50',
        fields: 'files(id, name, mimeType, size, modifiedTime, webViewLink, thumbnailLink, iconLink, parents, starred, shared)'
      });

      const response = await fetch(`https://www.googleapis.com/drive/v3/files?${params}`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Drive API error: ${response.status} - ${errorData}`);
      }

      const data = await response.json();
      return data.files || [];
    } catch (error) {
      this.handleApiError('searchDriveFiles', error);
    }
  }

  // Google Calendar Methods
  async getCalendarEvents(options?: {
    calendarId?: string;
    timeMin?: Date;
    timeMax?: Date;
    maxResults?: number;
    orderBy?: string;
    singleEvents?: boolean;
    q?: string;
  }): Promise<CalendarEvent[]> {
    try {
      if (!this.accessToken) {
        throw new Error('No access token available');
      }

      await this.throttleRequest();
      
      const params = new URLSearchParams({
        calendarId: options?.calendarId || 'primary',
        timeMin: options?.timeMin?.toISOString() || new Date().toISOString(),
        timeMax: options?.timeMax?.toISOString() || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        maxResults: (options?.maxResults || 250).toString(),
        singleEvents: (options?.singleEvents !== false).toString(),
        orderBy: options?.orderBy || 'startTime',
        ...(options?.q && { q: options.q })
      });

      const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events?${params}`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Calendar API error: ${response.status} - ${errorData}`);
      }

      const data = await response.json();

      // Cache the events
      data.items?.forEach((event: CalendarEvent) => {
        if (event.id) this.calendarEventCache.set(event.id, event);
      });

      return data.items || [];
    } catch (error) {
      this.handleApiError('getCalendarEvents', error);
    }
  }

  // Gmail Methods
  async getGmailMessages(options?: {
    q?: string;
    maxResults?: number;
    pageToken?: string;
    labelIds?: string[];
    includeBody?: boolean;
  }): Promise<{ messages: GmailMessage[]; nextPageToken?: string }> {
    try {
      if (!this.accessToken) {
        throw new Error('No access token available');
      }

      await this.throttleRequest();
      
      const params = new URLSearchParams({
        q: options?.q || 'is:unread',
        maxResults: (options?.maxResults || 20).toString(),
        ...(options?.pageToken && { pageToken: options.pageToken }),
        ...(options?.labelIds && { labelIds: options.labelIds.join(',') })
      });

      const response = await fetch(`https://www.googleapis.com/gmail/v1/users/me/messages?${params}`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Gmail API error: ${response.status} - ${errorData}`);
      }

      const data = await response.json();

      if (!data.messages) {
        return { messages: [] };
      }

      // Get full message details
      const messages = await Promise.all(
        data.messages.map(async (message: any) => {
          const details = await this.getGmailMessage(message.id, options?.includeBody);
          return details;
        })
      );

      return {
        messages,
        nextPageToken: data.nextPageToken
      };
    } catch (error) {
      this.handleApiError('getGmailMessages', error);
    }
  }

  async getGmailMessage(messageId: string, includeBody = false): Promise<GmailMessage> {
    if (!includeBody && this.gmailMessageCache.has(messageId)) {
      return this.gmailMessageCache.get(messageId)!;
    }

    try {
      if (!this.accessToken) {
        throw new Error('No access token available');
      }

      await this.throttleRequest();
      
      const params = new URLSearchParams({
        format: includeBody ? 'full' : 'metadata',
        metadataHeaders: 'From,To,Subject,Date'
      });

      const response = await fetch(`https://www.googleapis.com/gmail/v1/users/me/messages/${messageId}?${params}`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Gmail API error: ${response.status} - ${errorData}`);
      }

      const data = await response.json();

      const headers = data.payload.headers || [];
      const getHeader = (name: string) => headers.find((h: any) => h.name === name)?.value || '';

      const message: GmailMessage = {
        id: data.id,
        threadId: data.threadId,
        snippet: data.snippet,
        from: getHeader('From'),
        to: getHeader('To'),
        subject: getHeader('Subject'),
        date: getHeader('Date'),
        labelIds: data.labelIds,
        isUnread: data.labelIds?.includes('UNREAD') || false,
        hasAttachments: data.payload.parts?.some((part: any) => part.filename) || false
      };

      if (includeBody) {
        message.body = this.extractEmailBody(data);
        message.attachments = this.extractAttachments(data);
      }

      this.gmailMessageCache.set(messageId, message);
      return message;
    } catch (error) {
      this.handleApiError('getGmailMessage', error);
    }
  }

  private extractEmailBody(message: any): string {
    if (!message.payload) return '';
    
    if (message.payload.parts) {
      const textPart = message.payload.parts.find(
        (part: any) => part.mimeType === 'text/plain'
      );
      const htmlPart = message.payload.parts.find(
        (part: any) => part.mimeType === 'text/html'
      );
      
      if (textPart?.body?.data) {
        return atob(textPart.body.data.replace(/-/g, '+').replace(/_/g, '/'));
      }
      if (htmlPart?.body?.data) {
        return atob(htmlPart.body.data.replace(/-/g, '+').replace(/_/g, '/'));
      }
    }
    
    if (message.payload.body?.data) {
      return atob(message.payload.body.data.replace(/-/g, '+').replace(/_/g, '/'));
    }
    
    return '';
  }

  private extractAttachments(message: any): Array<{
    filename: string;
    mimeType: string;
    size: number;
  }> {
    if (!message.payload.parts) return [];
    
    return message.payload.parts
      .filter((part: any) => part.filename && part.filename.length > 0)
      .map((part: any) => ({
        filename: part.filename,
        mimeType: part.mimeType,
        size: part.body.size || 0
      }));
  }

  // Utility Methods
  formatFileSize(bytes: string | number): string {
    const size = typeof bytes === 'string' ? parseInt(bytes) : bytes;
    if (!size) return '0 B';
    
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(size) / Math.log(1024));
    
    return `${(size / Math.pow(1024, i)).toFixed(2)} ${units[i]}`;
  }

  getMimeTypeIcon(mimeType: string): string {
    const typeMap: { [key: string]: string } = {
      'application/vnd.google-apps.folder': '📁',
      'application/vnd.google-apps.document': '📄',
      'application/vnd.google-apps.spreadsheet': '📊',
      'application/vnd.google-apps.presentation': '📊',
      'application/pdf': '📑',
      'image/jpeg': '🖼️',
      'image/png': '🖼️',
      'image/gif': '🖼️',
      'video/mp4': '🎬',
      'audio/mpeg': '🎵',
      'text/plain': '📝',
      'application/zip': '🗜️',
      'application/msword': '📝',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '📝',
      'application/vnd.ms-excel': '📊',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '📊',
      'application/vnd.ms-powerpoint': '📊',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': '📊'
    };

    return typeMap[mimeType] || '📎';
  }

  // Check if the service is ready
  isReady(): boolean {
    return this.isInitialized && !!this.accessToken;
  }

  // Get service status
  getStatus(): { initialized: boolean; hasToken: boolean; signedIn: boolean } {
    return {
      initialized: this.isInitialized,
      hasToken: !!this.accessToken,
      signedIn: this.isSignedIn()
    };
  }
}

// Export singleton instance
export const googleService = new GoogleService();
