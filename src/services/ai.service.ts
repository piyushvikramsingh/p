// src/services/ai.service.ts
import axios from 'axios';
import OpenAI from 'openai';

// Claude API Configuration
const CLAUDE_API_KEY = import.meta.env.VITE_CLAUDE_API_KEY;
const CLAUDE_API_URL = import.meta.env.VITE_CLAUDE_API_URL || 'https://api.anthropic.com/v1/messages';

// OpenAI Configuration
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Only for development
});

// Claude API Service
export class ClaudeService {
  private conversationHistory: Array<{ role: string; content: string }> = [];
  private systemPrompt = `You are P.AI, an intelligent assistant designed to help users with various tasks. 
You have access to the user's context, can remember past conversations, and can help with:
- Writing and editing content
- Coding and technical questions
- Research and analysis
- Creative tasks
- Planning and organization
- Learning and education

Always be helpful, accurate, and considerate of the user's needs. If you're unsure about something, be honest about it.`;

  async sendMessage(message: string, context?: any): Promise<string> {
    try {
      // Add user message to history
      this.conversationHistory.push({ role: 'user', content: message });

      // Prepare the request
      const response = await axios.post(
        CLAUDE_API_URL,
        {
          model: 'claude-3-opus-20240229',
          messages: this.conversationHistory,
          system: this.systemPrompt,
          max_tokens: 4096,
          temperature: 0.7,
          metadata: context
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': CLAUDE_API_KEY,
            'anthropic-version': '2023-06-01'
          }
        }
      );

      const assistantMessage = response.data.content[0].text;
      
      // Add assistant response to history
      this.conversationHistory.push({ role: 'assistant', content: assistantMessage });
      
      // Keep conversation history manageable (last 20 exchanges)
      if (this.conversationHistory.length > 40) {
        this.conversationHistory = this.conversationHistory.slice(-40);
      }

      return assistantMessage;
    } catch (error) {
      console.error('Claude API Error:', error);
      throw new Error('Failed to get response from AI');
    }
  }

  clearHistory() {
    this.conversationHistory = [];
  }

  setSystemPrompt(prompt: string) {
    this.systemPrompt = prompt;
  }

  getHistory() {
    return this.conversationHistory;
  }
}

// Image Generation Service
export class ImageGenerationService {
  async generateImage(prompt: string, options?: {
    size?: '256x256' | '512x512' | '1024x1024' | '1792x1024' | '1024x1792';
    quality?: 'standard' | 'hd';
    style?: 'natural' | 'vivid';
    n?: number;
  }): Promise<string[]> {
    try {
      const response = await openai.images.generate({
        model: 'dall-e-3',
        prompt,
        n: options?.n || 1,
        size: options?.size || '1024x1024',
        quality: options?.quality || 'standard',
        style: options?.style || 'vivid'
      });

      return response.data.map(image => image.url || '');
    } catch (error) {
      console.error('Image Generation Error:', error);
      throw new Error('Failed to generate image');
    }
  }

  async createVariation(imageUrl: string, n: number = 1): Promise<string[]> {
    try {
      // First, fetch the image as a blob
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const file = new File([blob], 'image.png', { type: 'image/png' });

      const variationResponse = await openai.images.createVariation({
        image: file,
        n,
        size: '1024x1024'
      });

      return variationResponse.data.map(image => image.url || '');
    } catch (error) {
      console.error('Image Variation Error:', error);
      throw new Error('Failed to create image variation');
    }
  }
}

// Voice Service using Web Speech API
export class VoiceService {
  private recognition: SpeechRecognition | null = null;
  private synthesis: SpeechSynthesis;
  private isListening = false;

  constructor() {
    // Initialize speech recognition
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';
    }

    // Initialize speech synthesis
    this.synthesis = window.speechSynthesis;
  }

  // Start listening
  startListening(onResult: (transcript: string, isFinal: boolean) => void): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.recognition) {
        reject(new Error('Speech recognition not supported'));
        return;
      }

      if (this.isListening) {
        reject(new Error('Already listening'));
        return;
      }

      this.recognition.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          onResult(finalTranscript.trim(), true);
        } else if (interimTranscript) {
          onResult(interimTranscript, false);
        }
      };

      this.recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        this.isListening = false;
        reject(new Error(event.error));
      };

      this.recognition.onend = () => {
        this.isListening = false;
      };

      this.recognition.start();
      this.isListening = true;
      resolve();
    });
  }

  // Stop listening
  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  // Text to speech
  speak(text: string, options?: {
    voice?: SpeechSynthesisVoice;
    rate?: number;
    pitch?: number;
    volume?: number;
  }): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.synthesis) {
        reject(new Error('Speech synthesis not supported'));
        return;
      }

      // Cancel any ongoing speech
      this.synthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set options
      if (options?.voice) utterance.voice = options.voice;
      if (options?.rate) utterance.rate = options.rate;
      if (options?.pitch) utterance.pitch = options.pitch;
      if (options?.volume) utterance.volume = options.volume;

      utterance.onend = () => resolve();
      utterance.onerror = (event) => reject(new Error(event.error));

      this.synthesis.speak(utterance);
    });
  }

  // Get available voices
  getVoices(): SpeechSynthesisVoice[] {
    return this.synthesis.getVoices();
  }

  // Stop speaking
  stopSpeaking() {
    this.synthesis.cancel();
  }

  isCurrentlyListening() {
    return this.isListening;
  }
}

// Smart Notification Service
export class NotificationService {
  private permission: NotificationPermission = 'default';

  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.error('This browser does not support notifications');
      return false;
    }

    this.permission = await Notification.requestPermission();
    return this.permission === 'granted';
  }

  async sendNotification(title: string, options?: NotificationOptions): Promise<void> {
    if (this.permission !== 'granted') {
      const granted = await this.requestPermission();
      if (!granted) {
        throw new Error('Notification permission denied');
      }
    }

    new Notification(title, {
      icon: '/favicon.ico',
      badge: '/badge.png',
      ...options
    });
  }

  // Schedule a notification
  scheduleNotification(title: string, body: string, delay: number): void {
    setTimeout(() => {
      this.sendNotification(title, { body });
    }, delay);
  }
}

// Export singleton instances
export const claudeService = new ClaudeService();
export const imageService = new ImageGenerationService();
export const voiceService = new VoiceService();
export const notificationService = new NotificationService();

// Window type declarations for TypeScript
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}
