// src/services/apiService.ts
import { collection, addDoc, query, where, orderBy, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  userId: string;
  conversationId: string;
}

export interface Conversation {
  id: string;
  title: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  lastMessage?: string;
}

class APIService {
  private claudeApiKey: string;
  private claudeApiUrl: string = 'https://api.anthropic.com/v1/messages';

  constructor() {
    this.claudeApiKey = process.env.REACT_APP_CLAUDE_API_KEY || '';
  }

  // Claude API Integration
  async sendMessageToClaude(message: string): Promise<string> {
    try {
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
          messages: [
            {
              role: 'user',
              content: message,
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`Claude API error: ${response.status}`);
      }

      const data = await response.json();
      return data.content[0].text;
    } catch (error) {
      console.error('Error calling Claude API:', error);
      throw new Error('Failed to get response from AI assistant');
    }
  }

  // Alternative: OpenAI API Integration
  async sendMessageToOpenAI(message: string): Promise<string> {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are P.AI, a helpful and intelligent assistant.',
            },
            {
              role: 'user',
              content: message,
            },
          ],
          max_tokens: 1000,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      throw new Error('Failed to get response from AI assistant');
    }
  }

  // Conversation Management
  async createConversation(userId: string, title: string): Promise<string> {
    try {
      const conversationData = {
        title,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const docRef = await addDoc(collection(db, 'conversations'), conversationData);
      return docRef.id;
    } catch (error) {
      console.error('Error creating conversation:', error);
      throw new Error('Failed to create conversation');
    }
  }

  async getConversations(userId: string): Promise<Conversation[]> {
    try {
      const q = query(
        collection(db, 'conversations'),
        where('userId', '==', userId),
        orderBy('updatedAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const conversations: Conversation[] = [];

      querySnapshot.forEach((doc) => {
        conversations.push({
          id: doc.id,
          ...doc.data(),
        } as Conversation);
      });

      return conversations;
    } catch (error) {
      console.error('Error getting conversations:', error);
      throw new Error('Failed to get conversations');
    }
  }

  async deleteConversation(conversationId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'conversations', conversationId));
      
      // Also delete all messages in this conversation
      const messagesQuery = query(
        collection(db, 'messages'),
        where('conversationId', '==', conversationId)
      );
      
      const messagesSnapshot = await getDocs(messagesQuery);
      const deletePromises = messagesSnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
    } catch (error) {
      console.error('Error deleting conversation:', error);
      throw new Error('Failed to delete conversation');
    }
  }

  // Message Management
  async saveMessage(
    content: string,
    isUser: boolean,
    userId: string,
    conversationId: string
  ): Promise<string> {
    try {
      const messageData = {
        content,
        isUser,
        userId,
        conversationId,
        timestamp: new Date(),
      };

      const docRef = await addDoc(collection(db, 'messages'), messageData);

      // Update conversation's last message and timestamp
      await updateDoc(doc(db, 'conversations', conversationId), {
        lastMessage: content,
        updatedAt: new Date(),
      });

      return docRef.id;
    } catch (error) {
      console.error('Error saving message:', error);
      throw new Error('Failed to save message');
    }
  }

  async getMessages(conversationId: string): Promise<Message[]> {
    try {
      const q = query(
        collection(db, 'messages'),
        where('conversationId', '==', conversationId),
        orderBy('timestamp', 'asc')
      );

      const querySnapshot = await getDocs(q);
      const messages: Message[] = [];

      querySnapshot.forEach((doc) => {
        messages.push({
          id: doc.id,
          ...doc.data(),
        } as Message);
      });

      return messages;
    } catch (error) {
      console.error('Error getting messages:', error);
      throw new Error('Failed to get messages');
    }
  }

  // Streaming response simulation
  async *streamResponse(message: string): AsyncGenerator<string, void, unknown> {
    try {
      const response = await this.sendMessageToClaude(message);
      const words = response.split(' ');
      
      for (const word of words) {
        yield word + ' ';
        await new Promise(resolve => setTimeout(resolve, 50)); // Simulate streaming delay
      }
    } catch (error) {
      console.error('Error streaming response:', error);
      throw error;
    }
  }
}

export const apiService = new APIService();
