// src/components/MemoryView.tsx
import React, { useState, useEffect } from 'react';
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
  Settings,
  Save,
  X,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { apiService, MemoryItem } from '../services/apiService';
import { toast } from 'react-hot-toast';

const MemoryView: React.FC = () => {
  const { user } = useAuth();
  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [selectedMemory, setSelectedMemory] = useState<MemoryItem | null>(null);
  const [showMemoryModal, setShowMemoryModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [googleDriveFiles, setGoogleDriveFiles] = useState<any[]>([]);
  const [showDriveFiles, setShowDriveFiles] = useState(false);

  // Form state for creating/editing memory
  const [memoryForm, setMemoryForm] = useState<Omit<MemoryItem, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'isStarred' | 'relatedItems'>>({
    title: '',
    content: '',
    type: 'note',
    tags: [],
    isPrivate: false,
    source: 'Manual entry'
  });

  // Load memories on component mount
  useEffect(() => {
    if (user) {
      loadMemories();
      loadGoogleDriveFiles();
    }
  }, [user]);

  const loadMemories = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const loadedMemories = await apiService.getMemoryItems(user.id);
      setMemories(loadedMemories);
    } catch (error) {
      console.error('Error loading memories:', error);
      toast.error('Failed to load memories');
    } finally {
      setIsLoading(false);
    }
  };

  const loadGoogleDriveFiles = async () => {
    try {
      // In a real implementation, you would call the Google Drive API here
      // This is a mock implementation for demonstration
      const mockFiles = [
        {
          id: '1',
          name: 'Project Requirements.docx',
          type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          modifiedTime: new Date().toISOString(),
          webViewLink: '#'
        },
        {
          id: '2',
          name: 'Meeting Notes.pdf',
          type: 'application/pdf',
          modifiedTime: new Date().toISOString(),
          webViewLink: '#'
        }
      ];
      setGoogleDriveFiles(mockFiles);
    } catch (error) {
      console.error('Error loading Google Drive files:', error);
      toast.error('Failed to load Google Drive files');
    }
  };

  const resetForm = () => {
    setMemoryForm({
      title: '',
      content: '',
      type: 'note',
      tags: [],
      isPrivate: false,
      source: 'Manual entry'
    });
    setIsEditMode(false);
  };

  const handleCreateMemory = async () => {
    if (!user || !memoryForm.title.trim()) {
      toast.error('Please enter a title for your memory');
      return;
    }

    setIsLoading(true);
    try {
      const memoryData = {
        ...memoryForm,
        userId: user.id,
        isStarred: false,
        relatedItems: []
      };

      await apiService.createMemoryItem(memoryData);
      toast.success('Memory created successfully!');
      resetForm();
      setShowMemoryModal(false);
      await loadMemories();
    } catch (error) {
      console.error('Error creating memory:', error);
      toast.error('Failed to create memory');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateMemory = async () => {
    if (!selectedMemory || !memoryForm.title.trim()) {
      toast.error('Please enter a title for your memory');
      return;
    }

    setIsLoading(true);
    try {
      const updates = {
        title: memoryForm.title,
        content: memoryForm.content,
        type: memoryForm.type,
        tags: memoryForm.tags,
        isPrivate: memoryForm.isPrivate,
        source: memoryForm.source
      };

      await apiService.updateMemoryItem(selectedMemory.id, updates);
      toast.success('Memory updated successfully!');
      resetForm();
      setSelectedMemory(null);
      await loadMemories();
    } catch (error) {
      console.error('Error updating memory:', error);
      toast.error('Failed to update memory');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteMemory = async (memoryId: string) => {
    if (!window.confirm('Are you sure you want to delete this memory?')) return;

    setIsLoading(true);
    try {
      await apiService.deleteMemoryItem(memoryId);
      toast.success('Memory deleted successfully!');
      await loadMemories();
      setSelectedMemory(null);
    } catch (error) {
      console.error('Error deleting memory:', error);
      toast.error('Failed to delete memory');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStar = async (memory: MemoryItem) => {
    try {
      await apiService.updateMemoryItem(memory.id, { isStarred: !memory.isStarred });
      await loadMemories();
      if (selectedMemory?.id === memory.id) {
        setSelectedMemory({ ...memory, isStarred: !memory.isStarred });
      }
    } catch (error) {
      console.error('Error toggling star:', error);
      toast.error('Failed to update memory');
    }
  };

  const handleTogglePrivacy = async (memory: MemoryItem) => {
    try {
      await apiService.updateMemoryItem(memory.id, { isPrivate: !memory.isPrivate });
      await loadMemories();
      if (selectedMemory?.id === memory.id) {
        setSelectedMemory({ ...memory, isPrivate: !memory.isPrivate });
      }
    } catch (error) {
      console.error('Error toggling privacy:', error);
      toast.error('Failed to update memory');
    }
  };

  const handleImportFromGoogleDrive = async (file: any) => {
    if (!user) return;

    setIsLoading(true);
    try {
      const memoryData = {
        title: file.name,
        content: `Imported from Google Drive: ${file.name}`,
        type: 'knowledge' as const,
        tags: ['google-drive', 'imported'],
        userId: user.id,
        isStarred: false,
        isPrivate: false,
        source: 'Google Drive',
        relatedItems: []
      };

      await apiService.createMemoryItem(memoryData);
      toast.success(`Imported ${file.name} to memory!`);
      await loadMemories();
    } catch (error) {
      console.error('Error importing from Google Drive:', error);
      toast.error('Failed to import from Google Drive');
    } finally {
      setIsLoading(false);
    }
  };

  const prepareEditForm = (memory: MemoryItem) => {
    setMemoryForm({
      title: memory.title,
      content: memory.content,
      type: memory.type,
      tags: memory.tags,
      isPrivate: memory.isPrivate,
      source: memory.source || 'Manual entry'
    });
    setIsEditMode(true);
    setShowMemoryModal(true);
  };

  const memoryTypes = [
    { id: 'all', label: 'All Memories', icon: Brain, count: memories.length },
    { id: 'note', label: 'Notes', icon: BookOpen, count: memories.filter(m => m.type === 'note').length },
    { id: 'conversation', label: 'Conversations', icon: MessageSquare, count: memories.filter(m => m.type === 'conversation').length },
    { id: 'preference', label: 'Preferences', icon: Settings, count: memories.filter(m => m.type === 'preference').length },
    { id: 'knowledge', label: 'Knowledge', icon: Lightbulb, count: memories.filter(m => m.type === 'knowledge').length },
    { id: 'insight', label: 'Insights', icon: TrendingUp, count: memories.filter(m => m.type === 'insight').length }
  ];

  const filteredMemories = memories.filter(memory => {
    const matchesSearch = memory.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         memory.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         memory.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFilter = selectedFilter === 'all' || memory.type === selectedFilter;
    return matchesSearch && matchesFilter;
  });

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
            {memory.isPrivate && (
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  handleTogglePrivacy(memory);
                }}
                className="p-1 rounded-full hover:bg-premium-dark-gray/60 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <EyeOff className="w-3 h-3 text-premium-light-gray/60" />
              </motion.button>
            )}
            {memory.isStarred ? (
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleStar(memory);
                }}
                className="p-1 rounded-full hover:bg-premium-dark-gray/60 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Star className="w-3 h-3 text-yellow-400 fill-current" />
              </motion.button>
            ) : (
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleStar(memory);
                }}
                className="p-1 rounded-full hover:bg-premium-dark-gray/60 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Star className="w-3 h-3 text-premium-light-gray/60" />
              </motion.button>
            )}
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                prepareEditForm(memory);
              }}
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
            <span>{memory.updatedAt.toLocaleDateString()}</span>
          </div>
          {memory.source && (
            <span className="truncate max-w-24">{memory.source}</span>
          )}
        </div>
      </motion.div>
    );
  };

  const ActionButton: React.FC<{ 
    icon: React.ElementType; 
    label: string; 
    onClick: () => void;
    disabled?: boolean;
    className?: string;
  }> = ({ icon: Icon, label, onClick, disabled = false, className = '' }) => (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center space-x-2 px-3 py-2 bg-premium-dark-gray border border-white/10 rounded-xl hover:bg-premium-medium-gray transition-all text-premium-light-gray ${className}`}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
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

          {/* Google Drive Files */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-premium-light-gray/70">Google Drive</h3>
              <button 
                onClick={() => setShowDriveFiles(!showDriveFiles)}
                className="text-premium-light-gray/50 hover:text-premium-gold transition-colors"
              >
                {showDriveFiles ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
            {showDriveFiles && (
              <div className="space-y-2">
                {googleDriveFiles.length > 0 ? (
                  googleDriveFiles.map((file) => (
                    <motion.div
                      key={file.id}
                      className="p-2 bg-premium-dark-gray/40 rounded-lg border border-white/10"
                      whileHover={{ scale: 1.01 }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-xs font-medium text-premium-platinum truncate">{file.name}</p>
                          <p className="text-xs text-premium-light-gray/60">
                            {new Date(file.modifiedTime).toLocaleDateString()}
                          </p>
                        </div>
                        <motion.button
                          onClick={() => handleImportFromGoogleDrive(file)}
                          className="p-1 rounded-full hover:bg-premium-dark-gray/60 transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Plus className="w-3 h-3 text-premium-gold" />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-xs text-premium-light-gray/60 text-center py-2">
                    No Google Drive files found
                  </p>
                )}
              </div>
            )}
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
                <span className="text-premium-platinum font-medium">
                  {memories.filter(m => {
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return m.createdAt > weekAgo;
                  }).length}
                </span>
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
                onClick={() => {
                  resetForm();
                  setShowMemoryModal(true);
                }}
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
              <ActionButton 
                icon={Star} 
                label="Starred" 
                onClick={() => setSelectedFilter('all')} 
              />
              <ActionButton 
                icon={EyeOff} 
                label="Private" 
                onClick={() => setSelectedFilter('all')} 
              />
              <ActionButton 
                icon={Tag} 
                label="Tags" 
                onClick={() => setSelectedFilter('all')} 
              />
              <ActionButton 
                icon={Archive} 
                label="Archive" 
                onClick={() => setSelectedFilter('all')} 
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <ActionButton 
                icon={Filter} 
                label="Filter" 
                onClick={() => setSelectedFilter('all')} 
              />
              <ActionButton 
                icon={Zap} 
                label="Auto-organize" 
                onClick={() => setSelectedFilter('all')} 
              />
            </div>
          </div>
        </div>

        {/* Memories Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading && memories.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-premium-gold"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMemories.map((memory) => (
                <MemoryCard key={memory.id} memory={memory} />
              ))}
            </div>
          )}
          
          {!isLoading && filteredMemories.length === 0 && (
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
                  <ActionButton 
                    icon={Edit} 
                    label="Edit" 
                    onClick={() => prepareEditForm(selectedMemory)} 
                  />
                  <ActionButton 
                    icon={Trash2} 
                    label="Delete" 
                    onClick={() => handleDeleteMemory(selectedMemory.id)}
                    className="hover:bg-red-500/10 hover:text-red-400"
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-premium-light-gray leading-relaxed whitespace-pre-wrap">{selectedMemory.content}</p>
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
                    <span>Created: {selectedMemory.createdAt.toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>Updated: {selectedMemory.updatedAt.toLocaleDateString()}</span>
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

      {/* Memory Form Modal */}
      <AnimatePresence>
        {showMemoryModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              resetForm();
              setShowMemoryModal(false);
            }}
          >
            <motion.div
              className="bg-premium-dark-gray/95 backdrop-blur-xl rounded-2xl border border-white/10 p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-premium-platinum">
                  {isEditMode ? 'Edit Memory' : 'Create New Memory'}
                </h2>
                <button
                  onClick={() => {
                    resetForm();
                    setShowMemoryModal(false);
                  }}
                  className="p-1 rounded-full hover:bg-premium-dark-gray/60 transition-colors"
                >
                  <X className="w-5 h-5 text-premium-light-gray/60" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-premium-light-gray mb-1">Title</label>
                  <input
                    type="text"
                    value={memoryForm.title}
                    onChange={(e) => setMemoryForm({...memoryForm, title: e.target.value})}
                    className="w-full px-3 py-2 bg-premium-dark-gray border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-premium-gold focus:border-transparent text-premium-platinum"
                    placeholder="Memory title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-premium-light-gray mb-1">Content</label>
                  <textarea
                    value={memoryForm.content}
                    onChange={(e) => setMemoryForm({...memoryForm, content: e.target.value})}
                    className="w-full px-3 py-2 bg-premium-dark-gray border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-premium-gold focus:border-transparent text-premium-platinum min-h-[120px]"
                    placeholder="Memory content"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-premium-light-gray mb-1">Type</label>
                    <select
                      value={memoryForm.type}
                      onChange={(e) => setMemoryForm({...memoryForm, type: e.target.value as MemoryItem['type']})}
                      className="w-full px-3 py-2 bg-premium-dark-gray border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-premium-gold focus:border-transparent text-premium-platinum"
                    >
                      <option value="note">Note</option>
                      <option value="conversation">Conversation</option>
                      <option value="preference">Preference</option>
                      <option value="knowledge">Knowledge</option>
                      <option value="insight">Insight</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-premium-light-gray mb-1">Source</label>
                    <input
                      type="text"
                      value={memoryForm.source}
                      onChange={(e) => setMemoryForm({...memoryForm, source: e.target.value})}
                      className="w-full px-3 py-2 bg-premium-dark-gray border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-premium-gold focus:border-transparent text-premium-platinum"
                      placeholder="Source of memory"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-premium-light-gray mb-1">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={memoryForm.tags.join(', ')}
                    onChange={(e) => setMemoryForm({
                      ...memoryForm, 
                      tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                    })}
                    className="w-full px-3 py-2 bg-premium-dark-gray border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-premium-gold focus:border-transparent text-premium-platinum"
                    placeholder="tag1, tag2, tag3"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isPrivate"
                      checked={memoryForm.isPrivate}
                      onChange={(e) => setMemoryForm({...memoryForm, isPrivate: e.target.checked})}
                      className="w-4 h-4 bg-premium-dark-gray border-white/10 rounded focus:ring-premium-gold focus:ring-offset-premium-dark"
                    />
                    <label htmlFor="isPrivate" className="text-sm text-premium-light-gray">
                      Private Memory
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <ActionButton
                      icon={X}
                      label="Cancel"
                      onClick={() => {
                        resetForm();
                        setShowMemoryModal(false);
                      }}
                      className="hover:bg-red-500/10 hover:text-red-400"
                    />
                    <ActionButton
                      icon={isEditMode ? Save : Plus}
                      label={isEditMode ? 'Save Changes' : 'Create Memory'}
                      onClick={isEditMode ? handleUpdateMemory : handleCreateMemory}
                      disabled={!memoryForm.title.trim() || isLoading}
                      className="bg-premium-gold text-black hover:opacity-90 disabled:opacity-50"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MemoryView;
