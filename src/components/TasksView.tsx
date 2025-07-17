import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckSquare, 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  Tag, 
  Flag, 
  MoreVertical,
  ChevronDown,
  ListTodo,
  Lightbulb,
  Zap,
  User,
  Clock
} from 'lucide-react';

type Priority = 'low' | 'medium' | 'high' | 'urgent';
type Status = 'todo' | 'inprogress' | 'done';

interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

interface Task {
  id: string;
  title: string;
  status: Status;
  priority: Priority;
  dueDate?: string;
  project: string;
  subtasks: Subtask[];
  isRecurring: boolean;
  assignees?: string[];
}

const TasksView: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Design new dashboard layout',
      status: 'inprogress',
      priority: 'high',
      dueDate: '2025-01-20',
      project: 'P.AI Redesign',
      subtasks: [
        { id: 's1', title: 'Wireframing', completed: true },
        { id: 's2', title: 'High-fidelity mockups', completed: true },
        { id: 's3', title: 'Prototype user flows', completed: false },
      ],
      isRecurring: false,
      assignees: ['Piyush']
    },
    {
      id: '2',
      title: 'Implement authentication flow',
      status: 'todo',
      priority: 'urgent',
      dueDate: '2025-01-18',
      project: 'Core Features',
      subtasks: [],
      isRecurring: false,
      assignees: ['Piyush']
    },
    {
      id: '3',
      title: 'Update documentation for API',
      status: 'todo',
      priority: 'medium',
      project: 'Documentation',
      subtasks: [],
      isRecurring: false,
    },
    {
      id: '4',
      title: 'Weekly team sync meeting',
      status: 'done',
      priority: 'low',
      dueDate: '2025-01-16',
      project: 'Meetings',
      subtasks: [],
      isRecurring: true,
    },
  ]);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const projects = ['P.AI Redesign', 'Core Features', 'Documentation', 'Meetings'];
  const statuses: Status[] = ['todo', 'inprogress', 'done'];

  const getPriorityStyles = (priority: Priority) => {
    switch (priority) {
      case 'urgent': return { color: 'text-red-400', label: 'Urgent' };
      case 'high': return { color: 'text-orange-400', label: 'High' };
      case 'medium': return { color: 'text-yellow-400', label: 'Medium' };
      case 'low': return { color: 'text-blue-400', label: 'Low' };
    }
  };
  
  const getStatusLabel = (status: Status) => {
    switch(status) {
      case 'todo': return 'To Do';
      case 'inprogress': return 'In Progress';
      case 'done': return 'Done';
    }
  }

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;
    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      status: 'todo',
      priority: 'medium',
      project: 'Uncategorized',
      subtasks: [],
      isRecurring: false,
    };
    setTasks(prev => [newTask, ...prev]);
    setNewTaskTitle('');
  };

  const TaskCard: React.FC<{ task: Task }> = ({ task }) => {
    const { color, label } = getPriorityStyles(task.priority);
    const completedSubtasks = task.subtasks.filter(s => s.completed).length;
    const progress = task.subtasks.length > 0 ? (completedSubtasks / task.subtasks.length) * 100 : task.status === 'done' ? 100 : 0;

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="bg-premium-dark-gray/80 backdrop-blur-xl rounded-xl p-4 border border-white/10 shadow-lg"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <motion.button 
              className={`w-5 h-5 mt-1 rounded-full border-2 flex-shrink-0 transition-all ${
                task.status === 'done'
                  ? 'bg-premium-gold border-premium-gold'
                  : 'border-premium-light-gray/50 hover:border-premium-gold'
              }`}
              whileTap={{ scale: 0.9 }}
            />
            <div className="flex-1">
              <p className={`text-premium-platinum ${task.status === 'done' ? 'line-through text-premium-light-gray/50' : ''}`}>
                {task.title}
              </p>
              <div className="flex items-center space-x-4 text-xs text-premium-light-gray/60 mt-2">
                {task.dueDate && (
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>{task.dueDate}</span>
                  </div>
                )}
                <div className="flex items-center space-x-1">
                  <Flag className={`w-3 h-3 ${color}`} />
                  <span>{label}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Tag className="w-3 h-3" />
                  <span>{task.project}</span>
                </div>
              </div>
            </div>
          </div>
          <motion.button className="p-1 rounded-full hover:bg-premium-dark-gray/60">
            <MoreVertical className="w-4 h-4 text-premium-light-gray/60" />
          </motion.button>
        </div>

        {task.subtasks.length > 0 && (
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs text-premium-light-gray/60 mb-1">
              <span>Subtasks</span>
              <span>{completedSubtasks}/{task.subtasks.length}</span>
            </div>
            <div className="w-full bg-premium-dark rounded-full h-1.5">
              <motion.div
                className="bg-gold-progress-gradient h-1.5 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="h-full bg-premium-dark flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-premium-dark border-b border-white/10 p-6 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gold-diamond-gradient rounded-xl flex items-center justify-center shadow-lg shadow-premium-gold/20">
              <CheckSquare className="w-5 h-5 text-black" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gold-diamond-gradient bg-clip-text text-transparent">
                Tasks
              </h1>
              <p className="text-premium-light-gray/70 text-sm">
                Stay organized and productive
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-premium-light-gray/50 w-4 h-4" />
              <input
                type="text"
                placeholder="Search tasks..."
                className="pl-10 pr-4 py-2 bg-premium-dark-gray border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-premium-gold focus:border-transparent text-sm text-premium-platinum placeholder-premium-light-gray/50"
              />
            </div>
            <motion.button
              className="px-3 py-2 bg-premium-dark-gray border border-white/10 rounded-xl hover:bg-premium-medium-gray transition-all text-premium-light-gray flex items-center"
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            >
              <Filter className="w-4 h-4 mr-2" /> Filter
            </motion.button>
          </div>
        </div>
        
        {/* Quick Add Task */}
        <div className="relative">
          <Plus className="absolute left-4 top-1/2 transform -translate-y-1/2 text-premium-light-gray/50 w-5 h-5" />
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
            placeholder="Add a new task... (e.g., 'Remind me to call Mom tomorrow')"
            className="w-full pl-12 pr-4 py-3 bg-premium-dark-gray border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-premium-gold focus:border-transparent text-premium-platinum placeholder-premium-light-gray/50"
          />
        </div>
      </div>

      {/* Tasks Board */}
      <div className="flex-1 overflow-x-auto p-6">
        <div className="flex space-x-6 min-w-max h-full">
          {statuses.map(status => (
            <div key={status} className="w-80 flex-shrink-0 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <h2 className="font-semibold text-premium-platinum">{getStatusLabel(status)}</h2>
                  <span className="text-sm text-premium-light-gray/50 bg-premium-dark-gray px-2 py-0.5 rounded-full">
                    {tasks.filter(t => t.status === status).length}
                  </span>
                </div>
                <motion.button className="p-1 rounded-full hover:bg-premium-dark-gray/60">
                  <MoreVertical className="w-4 h-4 text-premium-light-gray/60" />
                </motion.button>
              </div>
              <div className="space-y-4 overflow-y-auto flex-1 pr-2">
                <AnimatePresence>
                  {tasks.filter(t => t.status === status).map(task => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* AI Suggestions Footer */}
      <div className="bg-premium-dark border-t border-white/10 p-4 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-premium-dark-gray rounded-xl flex items-center justify-center border border-white/10">
            <Lightbulb className="w-4 h-4 text-premium-gold" />
          </div>
          <p className="text-sm text-premium-light-gray/80">
            <span className="font-semibold text-premium-platinum">AI Suggestion:</span> You have an urgent task due in 2 days. Consider prioritizing 'Implement authentication flow'.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TasksView;
