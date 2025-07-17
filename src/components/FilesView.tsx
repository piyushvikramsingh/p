import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FolderOpen, 
  Search, 
  Filter, 
  Upload, 
  Download, 
  Star,
  Grid3X3,
  List,
  MoreVertical,
  FileText,
  Image,
  Video,
  Music,
  Archive,
  Trash2,
  Share2,
  Eye,
  Edit,
  Copy,
  Clock,
  User,
  ChevronRight,
  Plus,
  Cloud,
  HardDrive,
  Zap
} from 'lucide-react';

interface FileItem {
  id: string;
  name: string;
  type: 'folder' | 'document' | 'image' | 'video' | 'audio' | 'archive';
  size?: string;
  modified: string;
  path: string;
  isStarred: boolean;
  thumbnail?: string;
  tags?: string[];
  sharedWith?: string[];
}

const FilesView: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('root');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

  const files: FileItem[] = [
    {
      id: '1',
      name: 'Projects',
      type: 'folder',
      modified: '2 hours ago',
      path: '/Projects',
      isStarred: true,
      tags: ['work', 'active']
    },
    {
      id: '2',
      name: 'AI Research Paper.pdf',
      type: 'document',
      size: '2.4 MB',
      modified: '1 day ago',
      path: '/Documents/AI Research Paper.pdf',
      isStarred: false,
      tags: ['research', 'ai']
    },
    {
      id: '3',
      name: 'Presentation Slides.pptx',
      type: 'document',
      size: '15.7 MB',
      modified: '3 days ago',
      path: '/Documents/Presentation Slides.pptx',
      isStarred: true,
      tags: ['presentation', 'work']
    },
    {
      id: '4',
      name: 'Team Photo.jpg',
      type: 'image',
      size: '5.2 MB',
      modified: '1 week ago',
      path: '/Images/Team Photo.jpg',
      isStarred: false,
      thumbnail: 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/300x200/FFD700/000000?text=Team+Photo',
      tags: ['team', 'photo']
    },
    {
      id: '5',
      name: 'Meeting Recording.mp4',
      type: 'video',
      size: '145 MB',
      modified: '2 weeks ago',
      path: '/Videos/Meeting Recording.mp4',
      isStarred: false,
      tags: ['meeting', 'video']
    },
    {
      id: '6',
      name: 'Data Archive.zip',
      type: 'archive',
      size: '89.3 MB',
      modified: '1 month ago',
      path: '/Archives/Data Archive.zip',
      isStarred: false,
      tags: ['data', 'backup']
    }
  ];

  const quickAccess = [
    { name: 'Recent', icon: Clock, count: 12 },
    { name: 'Starred', icon: Star, count: 5 },
    { name: 'Shared', icon: Share2, count: 8 },
    { name: 'Trash', icon: Trash2, count: 3 }
  ];

  const storageLocations = [
    { name: 'Local Storage', icon: HardDrive, used: '45.2 GB', total: '500 GB' },
    { name: 'Cloud Storage', icon: Cloud, used: '128.7 GB', total: '1 TB' },
    { name: 'AI Processing', icon: Zap, used: '12.4 GB', total: '100 GB' }
  ];

  const getFileIcon = (type: FileItem['type']) => {
    switch (type) {
      case 'folder': return FolderOpen;
      case 'document': return FileText;
      case 'image': return Image;
      case 'video': return Video;
      case 'audio': return Music;
      case 'archive': return Archive;
      default: return FileText;
    }
  };

  const getFileColor = (type: FileItem['type']) => {
    switch (type) {
      case 'folder': return 'text-blue-400';
      case 'document': return 'text-red-400';
      case 'image': return 'text-green-400';
      case 'video': return 'text-purple-400';
      case 'audio': return 'text-yellow-400';
      case 'archive': return 'text-orange-400';
      default: return 'text-gray-400';
    }
  };

  const toggleFileSelection = (fileId: string) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  const FileGridItem: React.FC<{ file: FileItem }> = ({ file }) => {
    const Icon = getFileIcon(file.type);
    const colorClass = getFileColor(file.type);
    const isSelected = selectedFiles.includes(file.id);

    return (
      <motion.div
        className={`bg-premium-dark-gray/60 rounded-xl p-4 border cursor-pointer transition-all ${
          isSelected 
            ? 'border-premium-gold bg-premium-gold/10' 
            : 'border-white/10 hover:border-white/20 hover:bg-premium-dark-gray/80'
        }`}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => toggleFileSelection(file.id)}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            {file.thumbnail ? (
              <img 
                src={file.thumbnail} 
                alt={file.name}
                className="w-10 h-10 rounded-lg object-cover"
              />
            ) : (
              <div className={`w-10 h-10 rounded-lg bg-premium-dark-gray/60 flex items-center justify-center ${colorClass}`}>
                <Icon className="w-5 h-5" />
              </div>
            )}
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                // Toggle star
              }}
              className="p-1 rounded-full hover:bg-premium-dark-gray/60 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Star className={`w-4 h-4 ${file.isStarred ? 'text-yellow-400 fill-current' : 'text-gray-400'}`} />
            </motion.button>
          </div>
          <motion.button
            className="p-1 rounded-full hover:bg-premium-dark-gray/60 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <MoreVertical className="w-4 h-4 text-premium-light-gray/60" />
          </motion.button>
        </div>

        <div className="space-y-1">
          <h3 className="font-medium text-premium-platinum text-sm truncate">{file.name}</h3>
          {file.size && (
            <p className="text-xs text-premium-light-gray/60">{file.size}</p>
          )}
          <p className="text-xs text-premium-light-gray/60">{file.modified}</p>
        </div>

        {file.tags && (
          <div className="flex flex-wrap gap-1 mt-2">
            {file.tags.slice(0, 2).map(tag => (
              <span key={tag} className="px-2 py-1 bg-premium-dark-gray/60 text-xs rounded-full text-premium-light-gray/60">
                {tag}
              </span>
            ))}
          </div>
        )}
      </motion.div>
    );
  };

  const FileListItem: React.FC<{ file: FileItem }> = ({ file }) => {
    const Icon = getFileIcon(file.type);
    const colorClass = getFileColor(file.type);
    const isSelected = selectedFiles.includes(file.id);

    return (
      <motion.div
        className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
          isSelected 
            ? 'border-premium-gold bg-premium-gold/10' 
            : 'border-white/10 hover:border-white/20 hover:bg-premium-dark-gray/60'
        }`}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={() => toggleFileSelection(file.id)}
      >
        <div className="flex items-center space-x-4 flex-1">
          <div className={`w-10 h-10 rounded-lg bg-premium-dark-gray/60 flex items-center justify-center ${colorClass}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-premium-platinum">{file.name}</h3>
            <p className="text-sm text-premium-light-gray/60">{file.path}</p>
          </div>
        </div>

        <div className="flex items-center space-x-6 text-sm text-premium-light-gray/60">
          {file.size && <span>{file.size}</span>}
          <span>{file.modified}</span>
          <div className="flex items-center space-x-2">
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                // Toggle star
              }}
              className="p-1 rounded-full hover:bg-premium-dark-gray/60 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Star className={`w-4 h-4 ${file.isStarred ? 'text-yellow-400 fill-current' : 'text-gray-400'}`} />
            </motion.button>
            <motion.button
              className="p-1 rounded-full hover:bg-premium-dark-gray/60 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <MoreVertical className="w-4 h-4 text-premium-light-gray/60" />
            </motion.button>
          </div>
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
    <div className="h-full bg-premium-dark flex overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-premium-dark-gray/60 border-r border-white/10 p-4 flex-shrink-0 flex flex-col">
        <div className="space-y-6 overflow-y-auto flex-1">
          {/* Quick Access */}
          <div>
            <h3 className="text-sm font-semibold text-premium-light-gray/70 mb-3 px-3">Quick Access</h3>
            <div className="space-y-1">
              {quickAccess.map((item) => {
                const Icon = item.icon;
                return (
                  <motion.button
                    key={item.name}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-premium-dark-gray/60 transition-colors text-premium-light-gray"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="w-4 h-4" />
                      <span className="text-sm">{item.name}</span>
                    </div>
                    <span className="text-xs text-premium-light-gray/60">{item.count}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Storage */}
          <div>
            <h3 className="text-sm font-semibold text-premium-light-gray/70 mb-3 px-3">Storage</h3>
            <div className="space-y-3">
              {storageLocations.map((storage) => {
                const Icon = storage.icon;
                const usedPercentage = (parseFloat(storage.used) / parseFloat(storage.total)) * 100;
                
                return (
                  <div key={storage.name} className="bg-premium-dark-gray/40 rounded-xl p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <Icon className="w-4 h-4 text-premium-gold" />
                      <span className="text-sm font-medium text-premium-platinum">{storage.name}</span>
                    </div>
                    <div className="text-xs text-premium-light-gray/60 mb-1">
                      {storage.used} of {storage.total} used
                    </div>
                    <div className="w-full bg-premium-dark rounded-full h-2">
                      <div 
                        className="bg-gold-progress-gradient h-2 rounded-full transition-all duration-500"
                        style={{ width: `${usedPercentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
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
                <FolderOpen className="w-5 h-5 text-black" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gold-diamond-gradient bg-clip-text text-transparent">
                  My Files
                </h1>
                <p className="text-premium-light-gray/70 text-sm">
                  Organize and manage your documents
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-premium-light-gray/50 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search files..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-premium-dark-gray border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-premium-gold focus:border-transparent text-sm text-premium-platinum placeholder-premium-light-gray/50"
                />
              </div>
              
              <motion.button
                className="px-4 py-2 bg-premium-gold text-black rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-premium-gold/30"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Upload className="w-4 h-4 mr-2 inline" />
                Upload
              </motion.button>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ActionButton icon={Plus} label="New Folder" onClick={() => {}} />
              <ActionButton icon={Download} label="Download" onClick={() => {}} />
              <ActionButton icon={Share2} label="Share" onClick={() => {}} />
              <ActionButton icon={Filter} label="Filter" onClick={() => {}} />
            </div>
            
            <div className="flex items-center space-x-2">
              <motion.button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-premium-gold text-black' 
                    : 'text-premium-light-gray hover:bg-premium-dark-gray'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Grid3X3 className="w-4 h-4" />
              </motion.button>
              <motion.button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-premium-gold text-black' 
                    : 'text-premium-light-gray hover:bg-premium-dark-gray'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <List className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Files Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {files.map((file) => (
                <FileGridItem key={file.id} file={file} />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {files.map((file) => (
                <FileListItem key={file.id} file={file} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilesView;
