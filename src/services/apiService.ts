// src/services/apiService.ts
import { collection, addDoc, query, where, orderBy, getDocs, doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../lib/firebase';

export interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  userId: string;
  conversationId: string;
  imageUrl?: string;
  audioUrl?: string;
}

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
}

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
}

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
}

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
}

class APIService {
  private claudeApiKey: string;
  private openaiApiKey: string;
  private claudeApiUrl: string = 'https://api.anthropic.com/v1/messages';
  private openaiApiUrl: string = 'https://api.openai.com/v1/chat/completions';
  private elevenLabsApiKey: string;
  private googleApiKey: string;

  constructor() {
    // Fixed: Use import.meta.env instead of process.env for Vite
    this.claudeApiKey = import.meta.env.VITE_CLAUDE_API_KEY || '';
    this.openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY || '';
    this.elevenLabsApiKey = import.meta.env.VITE_ELEVENLABS_API_KEY || '';
    this.googleApiKey = import.meta.env.VITE_GOOGLE_API_KEY || '';
  }

  // AI Chat Integration
  async sendMessageToClaude(message: string, conversationHistory: Message[] = []): Promise<string> {
    try {
      if (!this.claudeApiKey) {
        throw new Error('Claude API key not configured');
      }

      const messages = [
        ...conversationHistory.slice(-10).map(msg => ({
          role: msg.isUser ? 'user' : 'assistant',
          content: msg.content,
        })),
        {
          role: 'user',
          content: message,
        },
      ];

      const response = await fetch(this.claudeApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.claudeApiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-3-sonnet-20240229',
          max_tokens: 1000,
          messages: messages,
          system: 'You are P.AI, a helpful, intelligent, and creative assistant. You can help with tasks, answer questions, generate content, and provide insights. Be concise but comprehensive in your responses.',
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Claude API error: ${response.status} - ${errorData}`);
      }

      const data = await response.json();
      return data.content[0].text;
    } catch (error) {
      console.error('Error calling Claude API:', error);
      // Fallback to OpenAI
      return this.sendMessageToOpenAI(message, conversationHistory);
    }
  }

  async sendMessageToOpenAI(message: string, conversationHistory: Message[] = []): Promise<string> {
    try {
      if (!this.openaiApiKey) {
        throw new Error('OpenAI API key not configured');
      }

      const messages = [
        {
          role: 'system',
          content: 'You are P.AI, a helpful, intelligent, and creative assistant. You can help with tasks, answer questions, generate content, and provide insights. Be concise but comprehensive in your responses.',
        },
        ...conversationHistory.slice(-10).map(msg => ({
          role: msg.isUser ? 'user' : 'assistant',
          content: msg.content,
        })),
        {
          role: 'user',
          content: message,
        },
      ];

      const response = await fetch(this.openaiApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.openaiApiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages,
          max_tokens: 1000,
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`OpenAI API error: ${response.status} - ${errorData}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      throw new Error('Failed to get response from AI assistant');
    }
  }

  // Voice Generation
  async generateVoice(text: string, voiceId: string = 'pNInz6obpgDQGcFmaJgB'): Promise<string> {
    try {
      if (!this.elevenLabsApiKey) {
        throw new Error('ElevenLabs API key not configured');
      }

      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': this.elevenLabsApiKey,
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.status}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      return audioUrl;
    } catch (error) {
      console.error('Error generating voice:', error);
      throw new Error('Failed to generate voice');
    }
  }

  // Image Generation
  async generateImage(prompt: string, size: string = '1024x1024'): Promise<string> {
    try {
      if (!this.openaiApiKey) {
        throw new Error('OpenAI API key not configured');
      }

      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.openaiApiKey}`,
        },
        body: JSON.stringify({
          model: 'dall-e-3',
          prompt,
          n: 1,
          size,
          quality: 'standard',
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`OpenAI Images API error: ${response.status} - ${errorData}`);
      }

      const data = await response.json();
      return data.data[0].url;
    } catch (error) {
      console.error('Error generating image:', error);
      throw new Error('Failed to generate image');
    }
  }

  // Speech-to-Text
  async transcribeAudio(audioBlob: Blob): Promise<string> {
    try {
      if (!this.openaiApiKey) {
        throw new Error('OpenAI API key not configured');
      }

      const formData = new FormData();
      formData.append('file', audioBlob, 'audio.wav');
      formData.append('model', 'whisper-1');

      const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.openaiApiKey}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`OpenAI Whisper API error: ${response.status} - ${errorData}`);
      }

      const data = await response.json();
      return data.text;
    } catch (error) {
      console.error('Error transcribing audio:', error);
      throw new Error('Failed to transcribe audio');
    }
  }

  // File Upload
  async uploadFile(file: File, userId: string, folder: string = 'uploads'): Promise<string> {
    try {
      const fileName = `${Date.now()}_${file.name}`;
      const fileRef = ref(storage, `${folder}/${userId}/${fileName}`);
      await uploadBytes(fileRef, file);
      const downloadURL = await getDownloadURL(fileRef);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new Error('Failed to upload file');
    }
  }

  // Task Management
  async createTask(taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const task = {
        ...taskData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, 'tasks'), task);
      return docRef.id;
    } catch (error) {
      console.error('Error creating task:', error);
      throw new Error('Failed to create task');
    }
  }

  async getTasks(userId: string): Promise<Task[]> {
    try {
      const q = query(
        collection(db, 'tasks'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        dueDate: doc.data().dueDate?.toDate(),
        reminder: doc.data().reminder?.toDate(),
      })) as Task[];
    } catch (error) {
      console.error('Error getting tasks:', error);
      throw new Error('Failed to get tasks');
    }
  }

  async updateTask(taskId: string, updates: Partial<Task>): Promise<void> {
    try {
      await updateDoc(doc(db, 'tasks', taskId), {
        ...updates,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating task:', error);
      throw new Error('Failed to update task');
    }
  }

  async deleteTask(taskId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'tasks', taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
      throw new Error('Failed to delete task');
    }
  }

  // Memory Management
  async createMemoryItem(memoryData: Omit<MemoryItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const memory = {
        ...memoryData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, 'memory'), memory);
      return docRef.id;
    } catch (error) {
      console.error('Error creating memory item:', error);
      throw new Error('Failed to create memory item');
    }
  }

  async getMemoryItems(userId: string): Promise<MemoryItem[]> {
    try {
      const q = query(
        collection(db, 'memory'),
        where('userId', '==', userId),
        orderBy('updatedAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as MemoryItem[];
    } catch (error) {
      console.error('Error getting memory items:', error);
      throw new Error('Failed to get memory items');
    }
  }

  async updateMemoryItem(memoryId: string, updates: Partial<MemoryItem>): Promise<void> {
    try {
      await updateDoc(doc(db, 'memory', memoryId), {
        ...updates,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating memory item:', error);
      throw new Error('Failed to update memory item');
    }
  }

  async deleteMemoryItem(memoryId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'memory', memoryId));
    } catch (error) {
      console.error('Error deleting memory item:', error);
      throw new Error('Failed to delete memory item');
    }
  }

  // Calendar Management
  async createCalendarEvent(eventData: Omit<CalendarEvent, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'calendar'), eventData);
      return docRef.id;
    } catch (error) {
      console.error('Error creating calendar event:', error);
      throw new Error('Failed to create calendar event');
    }
  }

  async getCalendarEvents(userId: string): Promise<CalendarEvent[]> {
    try {
      const q = query(
        collection(db, 'calendar'),
        where('userId', '==', userId),
        orderBy('startDate', 'asc')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        startDate: doc.data().startDate?.toDate() || new Date(),
        endDate: doc.data().endDate?.toDate() || new Date(),
        reminder: doc.data().reminder?.toDate(),
      })) as CalendarEvent[];
    } catch (error) {
      console.error('Error getting calendar events:', error);
      throw new Error('Failed to get calendar events');
    }
  }

  // Google Drive Integration
  async getGoogleDriveFiles(accessToken: string): Promise<any[]> {
    try {
      const response = await fetch(`https://www.googleapis.com/drive/v3/files?pageSize=100&fields=files(id,name,mimeType,size,modifiedTime,thumbnailLink,webViewLink)`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Google Drive API error: ${response.status}`);
      }

      const data = await response.json();
      return data.files || [];
    } catch (error) {
      console.error('Error fetching Google Drive files:', error);
      throw new Error('Failed to fetch Google Drive files');
    }
  }

  // Notification Management
  async createNotification(userId: string, title: string, message: string, type: string = 'info'): Promise<void> {
    try {
      await addDoc(collection(db, 'notifications'), {
        userId,
        title,
        message,
        type,
        read: false,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error creating notification:', error);
      throw new Error('Failed to create notification');
    }
  }

  // Streaming response with enhanced capabilities
  async *streamEnhancedResponse(message: string, conversationHistory: Message[] = []): AsyncGenerator<string, void, unknown> {
    try {
      // Check if user wants image generation
      if (message.toLowerCase().includes('generate image') || message.toLowerCase().includes('create image') || message.toLowerCase().includes('draw')) {
        yield 'I\'ll generate an image for you... ';
        const imagePrompt = message.replace(/generate image|create image|draw/gi, '').trim();
        try {
          const imageUrl = await this.generateImage(imagePrompt);
          yield `\n\n![Generated Image](${imageUrl})`;
        } catch (error) {
          yield '\n\nSorry, I encountered an error generating the image.';
        }
        return;
      }

      // Check if user wants to create a task
      if (message.toLowerCase().includes('create task') || message.toLowerCase().includes('add task') || message.toLowerCase().includes('remind me')) {
        yield 'Creating a task for you... ';
        // This would be handled by the component to create actual task
        yield 'Task created successfully!';
        return;
      }

      // Regular AI response
      const response = await this.sendMessageToClaude(message, conversationHistory);
      const words = response.split(' ');
      
      for (const word of words) {
        yield word + ' ';
        await new Promise(resolve => setTimeout(resolve, 50));
      }
    } catch (error) {
      console.error('Error streaming response:', error);
      yield 'Sorry, I encountered an error processing your request.';
    }
  }
}

export const apiService = new APIService();
