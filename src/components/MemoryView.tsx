import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Search, 
  Plus, 
  Star, 
  Tag, 
  Clock, 
  Filter, 
  MoreVertical,
  BookOpen,
  Link,
  User,
  MessageSquare,
  Lightbulb,
  Trash2,
  Edit,
  Share2,
  Archive,
  Eye,
  EyeOff,
  Zap,
  TrendingUp,
  Calendar,
  MapPin,
  Settings
} from 'lucide-react';

interface MemoryItem {
  id: string;
  title: string;
  content: string;
  type: 'note' | 'conversation' | 'preference' | 'knowledge' | 'insight';
  tags: string[];
  createdAt: string;
  updatedAt: string;
  isStarred: boolean;
  isPrivate: boolean;
  relatedItems?: string[];
  source?: string;
}

const MemoryView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [selectedMemory, setSelectedMemory] = useState<MemoryItem | null>(null);
  const [showMemoryModal, setShowMemoryModal] = useState(false);

  const memories: MemoryItem[] = [
    {
      id: '1',
      title: 'Preferred coding style',
      content: 'User prefers TypeScript with strict type checking, functional components, and Tailwind CSS for styling. Always uses arrow functions and prefers const over let.',
      type: 'preference',
      tags: ['coding', 'typescript', 'preferences'],
      createdAt: '2025-01-15T10:00:00Z',
      updatedAt: '2025-01-15T10:00:00Z',
      isStarred: true,
      isPrivate: false,
      source: 'Chat conversation'
    },
    {
      id: '2',
      title: 'React optimization techniques',
      content: 'Discussed React.memo, useMemo, useCallback, and virtualization for large lists. User was particularly interested in the performance implications of re-renders.',
      type: 'knowledge',
      tags: ['react', 'optimization', 'performance'],
      createdAt: '2025-01-14T15:30:00Z',
      updatedAt: '2025-01-14T15:30:00Z',
      isStarred: false,
      isPrivate: false,
      relatedItems: ['3', '4'],
      source: 'Chat conversation'
    },
    {
      id: '3',
      title: 'Project deadlines',
      content: 'User has a major project deadline on January 25th. Working on a React dashboard with real-time data visualization. Needs to focus on performance optimization.',
      type: 'note',
      tags: ['deadline', 'project', 'important'],
      createdAt: '2025-01-13T09:15:00Z',
      updatedAt: '2025-01-16T14:20:00Z',
      isStarred: true,
      isPrivate: true,
      source: 'Manual entry'
    },
    {
      id: '4',
      title: 'Weekly team meeting insights',
      content: 'Team is moving towards microservices architecture. User expressed interest in learning more about Docker containerization and Kubernetes orchestration.',
      type: 'insight',
      tags: ['team', 'architecture', 'learning'],
      createdAt: '2025-01-12T11:45:00Z',
      updatedAt: '2025-01-12T11:45:00Z',
      isStarred: false,
      isPrivate: false,
      source: 'Meeting summary'
    },
    {
      id: '5',
      title: 'Favorite coffee shop',
      content: 'User enjoys working from Central Café on 5th Street. Usually orders a large cappuccino and prefers the corner table by the window. Open from 6 AM to 10 PM.',
      type: 'note',
      tags: ['personal', 'location', 'coffee'],
      createdAt: '2025-01-11T16:20:00Z',
      updatedAt: '2025-01-11T16:20:00Z',
      isStarred: false,
      isPrivate: true,
      source: 'Manual entry'
    },
    {
      id: '6',
      title: 'AI model training discussion',
      content: 'In-depth conversation about transformer architectures, attention mechanisms, and the training process for large language models. User is particularly interested in the mathematical foundations.',
      type: 'conversation',
      tags: ['ai', 'machine-learning', 'transformers'],
      createdAt: '2025-01-10T13:00:00Z',
      updatedAt: '2025-01-10T13:00:00Z',
      isStarred: true,
      isPrivate: false,
      relatedItems: ['2'],
      source: 'Chat conversation'
    }
  ];

  const memoryTypes = [
    { id: 'all', label: 'All Memories', icon: Brain, count: memories.length },
    { id: 'note', label: 'Notes', icon: BookOpen, count: memories.filter(m => m.type === 'note').length },
    { id: 'conversation', label: 'Conversations', icon: MessageSquare, count: memories.filter(m => m.type === 'conversation').length },
    { id: 'preference', label: 'Preferences', icon: Settings, count: memories.filter(m => m.type === 'preference').length },
    { id: 'knowledge', label: 'Knowledge', icon: Lightbulb, count: memories.filter(m => m.type === 'knowledge').length },
    { id: 'insight', label: 'Insights', icon: TrendingUp, count: memories.filter(m => m.type === 'insight').length }
  ];

  const getMemoryIcon = (type: MemoryItem['type']) => {
    switch (type) {
      case 'note': return BookOpen;
      case 'conversation': return MessageSquare;
      case 'preference': return Settings;
      case 'knowledge': return Lightbulb;
      case 'insight': return TrendingUp;
      default: return Brain;
    }
  };

  const getMemoryColor = (type: MemoryItem['type']) => {
    switch (type) {
      case 'note': return 'bg-blue-500';
      case 'conversation': return 'bg-green-500';
      case 'preference': return 'bg-purple-500';
      case 'knowledge': return 'bg-yellow-500';
      case 'insight': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const filteredMemories = memories.filter(memory => {
    const matchesSearch = memory.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         memory.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         memory.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFilter = selectedFilter === 'all' || memory.type === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const MemoryCard: React.FC<{ memory: MemoryItem }> = ({ memory }) => {
    const Icon = getMemoryIcon(memory.type);
    const colorClass = getMemoryColor(memory.type);

    return (
      <motion.div
        className="bg-premium-dark-gray/60 rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all cursor-pointer"
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setSelectedMemory(memory)}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className={`w-8 h-8 rounded-lg ${colorClass} flex items-center justify-center`}>
              <Icon className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-premium-platinum text-sm">{memory.title}</h3>
              <p className="text-xs text-premium-light-gray/60 capitalize">{memory.type}</p>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            {memory.isPrivate && <EyeOff className="w-3 h-3 text-premium-light-gray/60" />}
            {memory.isStarred && <Star className="w-3 h-3 text-yellow-400 fill-current" />}
            <motion.button
              className="p-1 rounded-full hover:bg-premium-dark-gray/60 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <MoreVertical className="w-3 h-3 text-premium-light-gray/60" />
            </motion.button>
          </div>
        </div>

        <p className="text-premium-light-gray/80 text-sm mb-3 line-clamp-2">
          {memory.content}
        </p>

        <div className="flex flex-wrap gap-1 mb-3">
          {memory.tags.slice(0, 3).map(tag => (
            <span key={tag} className="px-2 py-1 bg-premium-dark-gray/60 text-xs rounded-full text-premium-light-gray/60">
              #{tag}
            </span>
          ))}
          {memory.tags.length > 3 && (
            <span className="px-2 py-1 bg-premium-dark-gray/60 text-xs rounded-full text-premium-light-gray/60">
              +{memory.tags.length - 3}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-premium-light-gray/60">
          <div className="flex items-center space-x-2">
            <Clock className="w-3 h-3" />
            <span>{new Date(memory.updatedAt).toLocaleDateString()}</span>
          </div>
          {memory.source && (
            <span className="truncate max-w-24">{memory.source}</span>
          )}
        </div>
      </motion.div>
    );
  };

  const ActionButton: React.FC<{ icon: React.ElementType; label: string; onClick: () => void }> = ({ icon: Icon, label, onClick }) => (
    <motion.button
      onClick={onClick}
      className="flex items-center space-x-2 px-3 py-2 bg-premium-dark-gray border border-white/10 rounded-xl hover:bg-premium-medium-gray transition-all text-premium-light-gray"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Icon className="w-4 h-4" />
      <span className="text-sm">{label}</span>
    </motion.button>
  );

  return (
    <div className="h-full bg-premium-dark flex">
      {/* Sidebar */}
      <div className="w-64 bg-premium-dark-gray/60 border-r border-white/10 p-4 flex-shrink-0">
        <div className="space-y-6">
          {/* Memory Types */}
          <div>
            <h3 className="text-sm font-semibold text-premium-light-gray/70 mb-3">Memory Types</h3>
            <div className="space-y-1">
              {memoryTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <motion.button
                    key={type.id}
                    onClick={() => setSelectedFilter(type.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors ${
                      selectedFilter === type.id
                        ? 'bg-premium-gold text-black'
                        : 'text-premium-light-gray hover:bg-premium-dark-gray/60'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="w-4 h-4" />
                      <span className="text-sm">{type.label}</span>
                    </div>
                    <span className="text-xs opacity-70">{type.count}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-premium-dark-gray/40 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-premium-light-gray/70 mb-3">Memory Stats</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-premium-light-gray/60">Total Memories</span>
                <span className="text-premium-platinum font-medium">{memories.length}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-premium-light-gray/60">Starred</span>
                <span className="text-premium-platinum font-medium">{memories.filter(m => m.isStarred).length}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-premium-light-gray/60">Private</span>
                <span className="text-premium-platinum font-medium">{memories.filter(m => m.isPrivate).length}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-premium-light-gray/60">This Week</span>
                <span className="text-premium-platinum font-medium">5</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-premium-dark border-b border-white/10 p-6 flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gold-diamond-gradient rounded-xl flex items-center justify-center shadow-lg shadow-premium-gold/20">
                <Brain className="w-5 h-5 text-black" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gold-diamond-gradient bg-clip-text text-transparent">
                  AI Memory
                </h1>
                <p className="text-premium-light-gray/70 text-sm">
                  Your personal AI knowledge base
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-premium-light-gray/50 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search memories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-premium-dark-gray border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-premium-gold focus:border-transparent text-sm text-premium-platinum placeholder-premium-light-gray/50"
                />
              </div>
              
              <motion.button
                onClick={() => setShowMemoryModal(true)}
                className="px-4 py-2 bg-premium-gold text-black rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-premium-gold/30"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus className="w-4 h-4 mr-2 inline" />
                Add Memory
              </motion.button>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ActionButton icon={Star} label="Starred" onClick={() => {}} />
              <ActionButton icon={EyeOff} label="Private" onClick={() => {}} />
              <ActionButton icon={Tag} label="Tags" onClick={() => {}} />
              <ActionButton icon={Archive} label="Archive" onClick={() => {}} />
            </div>
            
            <div className="flex items-center space-x-2">
              <ActionButton icon={Filter} label="Filter" onClick={() => {}} />
              <ActionButton icon={Zap} label="Auto-organize" onClick={() => {}} />
            </div>
          </div>
        </div>

        {/* Memories Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMemories.map((memory) => (
              <MemoryCard key={memory.id} memory={memory} />
            ))}
          </div>
          
          {filteredMemories.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="w-16 h-16 bg-premium-dark-gray/60 rounded-full flex items-center justify-center mb-4">
                <Brain className="w-8 h-8 text-premium-light-gray/60" />
              </div>
              <h3 className="text-lg font-semibold text-premium-light-gray/70 mb-2">No memories found</h3>
              <p className="text-premium-light-gray/60 text-center max-w-md">
                {searchQuery ? 'Try adjusting your search terms' : 'Start adding memories to build your personal AI knowledge base'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Memory Detail Modal */}
      <AnimatePresence>
        {selectedMemory && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedMemory(null)}
          >
            <motion.div
              className="bg-premium-dark-gray/95 backdrop-blur-xl rounded-2xl border border-white/10 p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-xl ${getMemoryColor(selectedMemory.type)} flex items-center justify-center`}>
                    {React.createElement(getMemoryIcon(selectedMemory.type), { className: "w-5 h-5 text-white" })}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-premium-platinum">{selectedMemory.title}</h2>
                    <p className="text-premium-light-gray/60 capitalize">{selectedMemory.type}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <ActionButton icon={Edit} label="Edit" onClick={() => {}} />
                  <ActionButton icon={Share2} label="Share" onClick={() => {}} />
                  <ActionButton icon={Trash2} label="Delete" onClick={() => {}} />
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-premium-light-gray leading-relaxed">{selectedMemory.content}</p>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedMemory.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-premium-dark-gray/60 text-sm rounded-full text-premium-light-gray/70">
                    #{tag}
                  </span>
                ))}
              </div>
              
              <div className="flex items-center justify-between text-sm text-premium-light-gray/60 border-t border-white/10 pt-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>Created: {new Date(selectedMemory.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>Updated: {new Date(selectedMemory.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
                {selectedMemory.source && (
                  <span>Source: {selectedMemory.source}</span>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MemoryView;
