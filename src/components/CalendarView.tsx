import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Clock, 
  MapPin, 
  Users, 
  Bell,
  Repeat,
  Search,
  Filter,
  MoreVertical,
  Video,
  Phone,
  Mail,
  Globe
} from 'lucide-react';

interface Event {
  id: string;
  title: string;
  time: string;
  date: string;
  location?: string;
  attendees?: string[];
  type: 'meeting' | 'task' | 'reminder' | 'personal';
  color: string;
  isRecurring?: boolean;
}

const CalendarView: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day' | 'agenda'>('month');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);

  const events: Event[] = [
    {
      id: '1',
      title: 'Team Standup',
      time: '09:00 AM',
      date: '2025-01-16',
      location: 'Conference Room A',
      attendees: ['John Doe', 'Jane Smith', 'Mike Johnson'],
      type: 'meeting',
      color: 'bg-blue-500',
      isRecurring: true
    },
    {
      id: '2',
      title: 'AI Model Review',
      time: '02:00 PM',
      date: '2025-01-16',
      location: 'Virtual Meeting',
      attendees: ['Sarah Connor', 'Tech Lead'],
      type: 'meeting',
      color: 'bg-purple-500'
    },
    {
      id: '3',
      title: 'Project Deadline',
      time: '11:59 PM',
      date: '2025-01-18',
      type: 'task',
      color: 'bg-red-500'
    },
    {
      id: '4',
      title: 'Coffee with Alex',
      time: '03:30 PM',
      date: '2025-01-17',
      location: 'Central Café',
      type: 'personal',
      color: 'bg-green-500'
    }
  ];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const getEventsForDate = (date: string) => {
    return events.filter(event => event.date === date);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const EventCard: React.FC<{ event: Event }> = ({ event }) => (
    <motion.div
      className={`p-2 rounded-lg text-white text-xs mb-1 cursor-pointer ${event.color} hover:opacity-80 transition-opacity`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center justify-between">
        <span className="font-medium truncate">{event.title}</span>
        {event.isRecurring && <Repeat className="w-3 h-3 ml-1" />}
      </div>
      <div className="flex items-center mt-1">
        <Clock className="w-3 h-3 mr-1" />
        <span>{event.time}</span>
      </div>
    </motion.div>
  );

  const QuickActionButton: React.FC<{ icon: React.ElementType; label: string; onClick: () => void }> = ({ icon: Icon, label, onClick }) => (
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
    <div className="h-full bg-premium-dark overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-premium-dark border-b border-white/10 p-6 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gold-diamond-gradient rounded-xl flex items-center justify-center shadow-lg shadow-premium-gold/20">
              <Calendar className="w-5 h-5 text-black" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gold-diamond-gradient bg-clip-text text-transparent">
                Calendar
              </h1>
              <p className="text-premium-light-gray/70 text-sm">
                {formatDate(currentDate)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-premium-light-gray/50 w-4 h-4" />
              <input
                type="text"
                placeholder="Search events..."
                className="pl-10 pr-4 py-2 bg-premium-dark-gray border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-premium-gold focus:border-transparent text-sm text-premium-platinum placeholder-premium-light-gray/50"
              />
            </div>
            
            <motion.button
              onClick={() => setShowEventModal(true)}
              className="px-4 py-2 bg-premium-gold text-black rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-premium-gold/30"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="w-4 h-4 mr-2 inline" />
              New Event
            </motion.button>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {['month', 'week', 'day', 'agenda'].map((mode) => (
              <motion.button
                key={mode}
                onClick={() => setViewMode(mode as any)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                  viewMode === mode
                    ? 'bg-premium-gold text-black'
                    : 'text-premium-light-gray hover:bg-premium-dark-gray'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </motion.button>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <motion.button
              onClick={() => navigateMonth('prev')}
              className="p-2 rounded-lg hover:bg-premium-dark-gray transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronLeft className="w-5 h-5 text-premium-light-gray" />
            </motion.button>
            
            <h2 className="text-xl font-semibold text-premium-platinum min-w-[200px] text-center">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            
            <motion.button
              onClick={() => navigateMonth('next')}
              className="p-2 rounded-lg hover:bg-premium-dark-gray transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronRight className="w-5 h-5 text-premium-light-gray" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Calendar Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {viewMode === 'month' && (
          <div className="bg-premium-dark-gray/60 rounded-2xl p-6 border border-white/10">
            {/* Weekday Headers */}
            <div className="grid grid-cols-7 gap-4 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-premium-light-gray/70 font-medium py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-4">
              {getDaysInMonth(currentDate).map((day, index) => {
                const dateString = day ? `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}` : '';
                const dayEvents = day ? getEventsForDate(dateString) : [];
                const isToday = day === new Date().getDate() && 
                              currentDate.getMonth() === new Date().getMonth() && 
                              currentDate.getFullYear() === new Date().getFullYear();

                return (
                  <motion.div
                    key={index}
                    className={`min-h-[120px] p-2 rounded-xl border transition-all cursor-pointer ${
                      day
                        ? isToday
                          ? 'bg-premium-gold/20 border-premium-gold'
                          : 'bg-premium-dark-gray/40 border-white/10 hover:bg-premium-dark-gray/60'
                        : 'border-transparent'
                    }`}
                    whileHover={day ? { scale: 1.02 } : {}}
                    onClick={() => day && setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
                  >
                    {day && (
                      <>
                        <div className={`text-center font-medium mb-2 ${
                          isToday ? 'text-premium-gold' : 'text-premium-platinum'
                        }`}>
                          {day}
                        </div>
                        <div className="space-y-1">
                          {dayEvents.slice(0, 3).map(event => (
                            <EventCard key={event.id} event={event} />
                          ))}
                          {dayEvents.length > 3 && (
                            <div className="text-xs text-premium-light-gray/60 text-center">
                              +{dayEvents.length - 3} more
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {viewMode === 'agenda' && (
          <div className="space-y-6">
            {events.map((event, index) => (
              <motion.div
                key={event.id}
                className="bg-premium-dark-gray/60 rounded-2xl p-6 border border-white/10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className={`w-3 h-3 rounded-full ${event.color}`} />
                      <h3 className="text-lg font-semibold text-premium-platinum">{event.title}</h3>
                      {event.isRecurring && <Repeat className="w-4 h-4 text-premium-light-gray/60" />}
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-premium-light-gray/70">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        {event.time} • {event.date}
                      </div>
                      {event.location && (
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2" />
                          {event.location}
                        </div>
                      )}
                      {event.attendees && (
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-2" />
                          {event.attendees.length} attendees
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <motion.button
                      className="p-2 rounded-lg hover:bg-premium-dark-gray transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Video className="w-4 h-4 text-premium-light-gray" />
                    </motion.button>
                    <motion.button
                      className="p-2 rounded-lg hover:bg-premium-dark-gray transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <MoreVertical className="w-4 h-4 text-premium-light-gray" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-premium-dark border-t border-white/10 p-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <QuickActionButton icon={Plus} label="Quick Add" onClick={() => {}} />
            <QuickActionButton icon={Globe} label="Time Zones" onClick={() => {}} />
            <QuickActionButton icon={Bell} label="Reminders" onClick={() => {}} />
          </div>
          
          <div className="flex items-center space-x-2">
            <QuickActionButton icon={Filter} label="Filter" onClick={() => {}} />
            <QuickActionButton icon={Mail} label="Sync" onClick={() => {}} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
