// src/services/google.service.ts
import { gapi } from 'gapi-script';

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

  // Initialize Google API
  async init(): Promise<void> {
    if (this.isInitialized) return;
    
    if (!CLIENT_ID || !API_KEY) {
      throw new Error('Missing Google API configuration. Please check your environment variables.');
    }

    return new Promise((resolve, reject) => {
      gapi.load('client:auth2', async () => {
        try {
          await gapi.client.init({
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
  }

  // Set access token from Firebase Auth
  setAccessToken(token: string) {
    this.accessToken = token;
    if (gapi.client && token) {
      gapi.client.setToken({ access_token: token });
    }
  }

  // Check if user is signed in
  isSignedIn(): boolean {
    if (!this.isInitialized) return false;
    return gapi.auth2.getAuthInstance().isSignedIn.get();
  }

  // Sign in with Google (if not using Firebase Auth)
  async signIn(): Promise<void> {
    if (!this.isInitialized) await this.init();
    await gapi.auth2.getAuthInstance().signIn();
  }

  // Sign out
  async signOut(): Promise<void> {
    if (!this.isInitialized) return;
    await gapi.auth2.getAuthInstance().signOut();
    this.clearCache();
  }

  // Cleanup resources
  destroy() {
    gapi.client.setToken(null);
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

  // Google Drive Methods
  async getDriveFiles(options?: {
    pageSize?: number;
    orderBy?: string;
    q?: string;
    pageToken?: string;
    fields?: string;
  }): Promise<{ files: DriveFile[]; nextPageToken?: string }> {
    try {
      await this.throttleRequest();
      const response = await gapi.client.drive.files.list({
        pageSize: options?.pageSize || 20,
        orderBy: options?.orderBy || 'modifiedTime desc',
        q: options?.q || "trashed = false",
        fields: options?.fields || 'nextPageToken, files(id, name, mimeType, size, modifiedTime, webViewLink, thumbnailLink, iconLink, parents, starred, shared, permissions)',
        pageToken: options?.pageToken
      });

      // Cache the files
      response.result.files?.forEach(file => {
        if (file.id) this.driveFileCache.set(file.id, file);
      });

      return {
        files: response.result.files || [],
        nextPageToken: response.result.nextPageToken
      };
    } catch (error) {
      this.handleApiError('getDriveFiles', error);
    }
  }

  async getAllDriveFiles(query: string = "trashed = false"): Promise<DriveFile[]> {
    let allFiles: DriveFile[] = [];
    let pageToken: string | undefined;

    do {
      const result = await this.getDriveFiles({
        q: query,
        pageSize: 100,
        pageToken
      });
      allFiles = [...allFiles, ...result.files];
      pageToken = result.nextPageToken;
    } while (pageToken);

    return allFiles;
  }

  async searchDriveFiles(query: string): Promise<DriveFile[]> {
    try {
      await this.throttleRequest();
      const response = await gapi.client.drive.files.list({
        q: `name contains '${query}' and trashed = false`,
        pageSize: 50,
        fields: 'files(id, name, mimeType, size, modifiedTime, webViewLink, thumbnailLink, iconLink, parents, starred, shared)'
      });

      return response.result.files || [];
    } catch (error) {
      this.handleApiError('searchDriveFiles', error);
    }
  }

  async getFileContent(fileId: string): Promise<string> {
    try {
      await this.throttleRequest();
      const response = await gapi.client.drive.files.get({
        fileId: fileId,
        alt: 'media'
      });

      return response.body;
    } catch (error) {
      this.handleApiError('getFileContent', error);
    }
  }

  async getFileMetadata(fileId: string, forceRefresh = false): Promise<DriveFile> {
    if (!forceRefresh && this.driveFileCache.has(fileId)) {
      return this.driveFileCache.get(fileId)!;
    }

    try {
      await this.throttleRequest();
      const response = await gapi.client.drive.files.get({
        fileId: fileId,
        fields: 'id, name, mimeType, size, modifiedTime, webViewLink, thumbnailLink, iconLink, parents, starred, shared, permissions'
      });

      this.driveFileCache.set(fileId, response.result);
      return response.result;
    } catch (error) {
      this.handleApiError('getFileMetadata', error);
    }
  }

  async batchGetDriveFiles(fileIds: string[]): Promise<DriveFile[]> {
    try {
      await this.throttleRequest();
      const batch = gapi.client.newBatch();
      const results: DriveFile[] = [];

      fileIds.forEach(fileId => {
        if (this.driveFileCache.has(fileId)) {
          results.push(this.driveFileCache.get(fileId)!);
        } else {
          batch.add(gapi.client.drive.files.get({
            fileId: fileId,
            fields: 'id, name, mimeType, size, modifiedTime, webViewLink, thumbnailLink, iconLink, parents, starred'
          }));
        }
      });

      if (batch.requests.length > 0) {
        const batchResponse = await batch.execute();
        Object.values(batchResponse.result).forEach((response: any) => {
          if (response.status === 200) {
            results.push(response.result);
            if (response.result.id) {
              this.driveFileCache.set(response.result.id, response.result);
            }
          }
        });
      }

      return results;
    } catch (error) {
      this.handleApiError('batchGetDriveFiles', error);
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
      await this.throttleRequest();
      const response = await gapi.client.calendar.events.list({
        calendarId: options?.calendarId || 'primary',
        timeMin: options?.timeMin?.toISOString() || new Date().toISOString(),
        timeMax: options?.timeMax?.toISOString() || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        maxResults: options?.maxResults || 250,
        singleEvents: options?.singleEvents !== false,
        orderBy: options?.orderBy || 'startTime',
        q: options?.q
      });

      // Cache the events
      response.result.items?.forEach(event => {
        if (event.id) this.calendarEventCache.set(event.id, event);
      });

      return response.result.items || [];
    } catch (error) {
      this.handleApiError('getCalendarEvents', error);
    }
  }

  async getAllCalendarEvents(calendarId = 'primary', timeRange = 90): Promise<CalendarEvent[]> {
    const timeMin = new Date();
    const timeMax = new Date();
    timeMax.setDate(timeMax.getDate() + timeRange);

    let allEvents: CalendarEvent[] = [];
    let pageToken: string | undefined;

    do {
      const response = await gapi.client.calendar.events.list({
        calendarId,
        timeMin: timeMin.toISOString(),
        timeMax: timeMax.toISOString(),
        maxResults: 2500,
        singleEvents: true,
        orderBy: 'startTime',
        pageToken
      });

      allEvents = [...allEvents, ...(response.result.items || [])];
      pageToken = response.result.nextPageToken;
    } while (pageToken);

    return allEvents;
  }

  async getEvent(eventId: string, calendarId: string = 'primary', forceRefresh = false): Promise<CalendarEvent> {
    if (!forceRefresh && this.calendarEventCache.has(eventId)) {
      return this.calendarEventCache.get(eventId)!;
    }

    try {
      await this.throttleRequest();
      const response = await gapi.client.calendar.events.get({
        calendarId,
        eventId
      });

      this.calendarEventCache.set(eventId, response.result);
      return response.result;
    } catch (error) {
      this.handleApiError('getEvent', error);
    }
  }

  async getCalendarList(): Promise<Array<{
    id: string;
    summary: string;
    description?: string;
    backgroundColor?: string;
    foregroundColor?: string;
    primary?: boolean;
  }>> {
    try {
      await this.throttleRequest();
      const response = await gapi.client.calendar.calendarList.list();
      return response.result.items || [];
    } catch (error) {
      this.handleApiError('getCalendarList', error);
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
      await this.throttleRequest();
      const response = await gapi.client.gmail.users.messages.list({
        userId: 'me',
        q: options?.q || 'is:unread',
        maxResults: options?.maxResults || 20,
        pageToken: options?.pageToken,
        labelIds: options?.labelIds
      });

      if (!response.result.messages) {
        return { messages: [] };
      }

      // Get full message details
      const messages = await Promise.all(
        response.result.messages.map(async (message) => {
          const details = await this.getGmailMessage(message.id!, options?.includeBody);
          return details;
        })
      );

      return {
        messages,
        nextPageToken: response.result.nextPageToken
      };
    } catch (error) {
      this.handleApiError('getGmailMessages', error);
    }
  }

  async getAllGmailMessages(query: string = 'is:inbox'): Promise<GmailMessage[]> {
    let allMessages: GmailMessage[] = [];
    let pageToken: string | undefined;

    do {
      const result = await this.getGmailMessages({
        q: query,
        maxResults: 100,
        pageToken
      });
      allMessages = [...allMessages, ...result.messages];
      pageToken = result.nextPageToken;
    } while (pageToken);

    return allMessages;
  }

  async getGmailMessage(messageId: string, includeBody = false): Promise<GmailMessage> {
    if (!includeBody && this.gmailMessageCache.has(messageId)) {
      return this.gmailMessageCache.get(messageId)!;
    }

    try {
      await this.throttleRequest();
      const response = await gapi.client.gmail.users.messages.get({
        userId: 'me',
        id: messageId,
        format: includeBody ? 'full' : 'metadata',
        metadataHeaders: ['From', 'To', 'Subject', 'Date']
      });

      const headers = response.result.payload.headers || [];
      const getHeader = (name: string) => headers.find(h => h.name === name)?.value || '';

      const message: GmailMessage = {
        id: response.result.id!,
        threadId: response.result.threadId!,
        snippet: response.result.snippet!,
        from: getHeader('From'),
        to: getHeader('To'),
        subject: getHeader('Subject'),
        date: getHeader('Date'),
        labelIds: response.result.labelIds,
        isUnread: response.result.labelIds?.includes('UNREAD') || false,
        hasAttachments: response.result.payload.parts?.some(part => part.filename) || false
      };

      if (includeBody) {
        message.body = this.extractEmailBody(response.result);
        message.attachments = this.extractAttachments(response.result);
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

  async searchGmail(query: string): Promise<GmailMessage[]> {
    const result = await this.getGmailMessages({ q: query, maxResults: 50 });
    return result.messages;
  }

  async getGmailLabels(): Promise<Array<{
    id: string;
    name: string;
    type: 'system' | 'user';
    messagesTotal?: number;
    messagesUnread?: number;
  }>> {
    try {
      await this.throttleRequest();
      const response = await gapi.client.gmail.users.labels.list({
        userId: 'me'
      });

      return response.result.labels || [];
    } catch (error) {
      this.handleApiError('getGmailLabels', error);
    }
  }

  async sendEmail(raw: string): Promise<void> {
    try {
      await this.throttleRequest();
      await gapi.client.gmail.users.messages.send({
        userId: 'me',
        resource: { raw }
      });
    } catch (error) {
      this.handleApiError('sendEmail', error);
    }
  }

  // Google Contacts Methods
  async getContacts(options?: {
    pageSize?: number;
    pageToken?: string;
  }): Promise<{ contacts: GoogleContact[]; nextPageToken?: string }> {
    try {
      await this.throttleRequest();
      const response = await gapi.client.people.people.connections.list({
        resourceName: 'people/me',
        pageSize: options?.pageSize || 100,
        pageToken: options?.pageToken,
        personFields: 'names,emailAddresses,phoneNumbers,photos'
      });

      return {
        contacts: response.result.connections || [],
        nextPageToken: response.result.nextPageToken
      };
    } catch (error) {
      this.handleApiError('getContacts', error);
    }
  }

  async getAllContacts(): Promise<GoogleContact[]> {
    let allContacts: GoogleContact[] = [];
    let pageToken: string | undefined;

    do {
      const result = await this.getContacts({
        pageSize: 100,
        pageToken
      });
      allContacts = [...allContacts, ...result.contacts];
      pageToken = result.nextPageToken;
    } while (pageToken);

    return allContacts;
  }

  // Google Tasks Methods
  async getTaskLists(): Promise<Array<{
    id: string;
    title: string;
    updated: string;
  }>> {
    try {
      await this.throttleRequest();
      const response = await gapi.client.tasks.tasklists.list();
      return response.result.items || [];
    } catch (error) {
      this.handleApiError('getTaskLists', error);
    }
  }

  async getTasks(taskListId: string): Promise<GoogleTask[]> {
    try {
      await this.throttleRequest();
      const response = await gapi.client.tasks.tasks.list({
        tasklist: taskListId
      });

      return response.result.items || [];
    } catch (error) {
      this.handleApiError('getTasks', error);
    }
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

  // User Profile Methods
  async getUserProfile(): Promise<{
    displayName?: string;
    email?: string;
    photoUrl?: string;
  }> {
    try {
      await this.throttleRequest();
      const response = await gapi.client.people.people.get({
        resourceName: 'people/me',
        personFields: 'names,emailAddresses,photos'
      });

      return {
        displayName: response.result.names?.[0]?.displayName,
        email: response.result.emailAddresses?.[0]?.value,
        photoUrl: response.result.photos?.[0]?.url
      };
    } catch (error) {
      this.handleApiError('getUserProfile', error);
    }
  }
}

// Export singleton instance
export const googleService = new GoogleService();
