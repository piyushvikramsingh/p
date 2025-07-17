import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, StopCircle, Copy, RefreshCw, ThumbsUp, ThumbsDown, Mic, Paperclip, Sparkles, User, Bot } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  isStreaming?: boolean;
  reactions?: { thumbsUp: boolean; thumbsDown: boolean };
}

const ChatWindow: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m P.AI. How can I assist you today?',
      isUser: false,
      timestamp: new Date(),
    }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputValue]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: `Thinking about "${currentInput}"...`,
        isUser: false,
        timestamp: new Date(),
        isStreaming: true,
        reactions: { thumbsUp: false, thumbsDown: false }
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);

      setTimeout(() => {
        setMessages(prev => prev.map(msg => 
          msg.id === aiResponse.id ? { ...msg, isStreaming: false, content: `Here are my thoughts on "${currentInput}". Let's break it down.` } : msg
        ));
      }, 1500);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickSuggestions = [
    "Help me write a React component",
    "Explain quantum computing",
    "Create a business plan",
    "Write a creative story",
  ];

  return (
    <div className="flex flex-col h-full bg-premium-dark">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-8">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                className={`flex gap-4 ${message.isUser ? 'justify-end' : 'justify-start'}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {!message.isUser && (
                  <div className="w-8 h-8 bg-gold-diamond-gradient rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-premium-gold/20">
                    <Bot className="w-5 h-5 text-black" />
                  </div>
                )}
                
                <div className={`max-w-[85%] group ${message.isUser ? 'order-2' : ''}`}>
                  <div className={`relative ${
                    message.isUser 
                      ? 'bg-gold-diamond-gradient text-black shadow-lg shadow-premium-gold/30' 
                      : 'bg-premium-dark-gray text-premium-platinum shadow-lg border border-white/10'
                  } rounded-2xl px-6 py-4`}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.content}
                      {message.isStreaming && (
                        <motion.span
                          className="inline-block w-2 h-4 bg-current ml-1 opacity-75"
                          animate={{ opacity: [0, 1, 0] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        />
                      )}
                    </p>
                  </div>

                  {!message.isUser && !message.isStreaming && (
                    <motion.div
                      className="flex items-center space-x-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      {[Copy, RefreshCw, ThumbsUp, ThumbsDown].map((Icon, i) => (
                        <button key={i} className="p-2 rounded-xl hover:bg-premium-dark-gray transition-colors">
                          <Icon className="w-4 h-4 text-premium-light-gray/50 hover:text-premium-light-gray" />
                        </button>
                      ))}
                    </motion.div>
                  )}
                </div>

                {message.isUser && (
                  <div className="w-8 h-8 bg-gray-700 rounded-xl flex items-center justify-center flex-shrink-0 order-1">
                    <User className="w-5 h-5 text-premium-light-gray" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div className="flex gap-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="w-8 h-8 bg-gold-diamond-gradient rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-premium-gold/20">
                <Bot className="w-5 h-5 text-black" />
              </div>
              <div className="bg-premium-dark-gray rounded-2xl px-6 py-4 shadow-lg border border-white/10">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-premium-gold rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-premium-gold rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-premium-gold rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-premium-dark border-t border-white/10 p-6">
        <div className="max-w-4xl mx-auto">
          {messages.length <= 1 && (
            <div className="flex flex-wrap gap-3 justify-center mb-4">
              {quickSuggestions.map((suggestion, index) => (
                <motion.button
                  key={index}
                  onClick={() => setInputValue(suggestion)}
                  className="px-4 py-2 bg-premium-dark-gray border border-white/10 rounded-xl text-sm text-premium-light-gray hover:bg-premium-medium-gray hover:border-premium-gold/50 transition-all shadow-sm"
                  whileHover={{ scale: 1.05, y: -2 }}
                >
                  {suggestion}
                </motion.button>
              ))}
            </div>
          )}
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Message P.AI..."
              className="w-full pl-6 pr-32 py-4 bg-premium-dark-gray border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-premium-gold focus:border-transparent text-premium-platinum placeholder-premium-light-gray/50 resize-none overflow-hidden shadow-lg"
              rows={1}
              style={{ minHeight: '56px', maxHeight: '140px' }}
            />
            
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-2">
              <motion.button className="p-2 rounded-xl text-premium-light-gray/70 hover:text-premium-platinum hover:bg-premium-medium-gray transition-all" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Mic className="w-5 h-5" />
              </motion.button>
              <motion.button className="p-2 rounded-xl text-premium-light-gray/70 hover:text-premium-platinum hover:bg-premium-medium-gray transition-all" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Paperclip className="w-5 h-5" />
              </motion.button>
              <motion.button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className="p-2 rounded-xl bg-premium-gold hover:opacity-90 disabled:bg-premium-medium-gray disabled:cursor-not-allowed text-black shadow-lg shadow-premium-gold/30 transition-all disabled:opacity-50"
                whileHover={{ scale: inputValue.trim() ? 1.05 : 1 }}
                whileTap={{ scale: inputValue.trim() ? 0.95 : 1 }}
              >
                <Send className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
