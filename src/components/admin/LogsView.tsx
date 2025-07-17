import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, AlertCircle, Server } from 'lucide-react';
import { generateActivityLogs, generateErrorLogs, generateApiLogs, ActivityLog, ErrorLog, ApiLog, LogLevel, HttpMethod } from '../../lib/mock-data';
import LogTable from './LogTable';

type Tab = 'activity' | 'error' | 'api';

const LogsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('activity');

  const activityLogs = useMemo(() => generateActivityLogs(100), []);
  const errorLogs = useMemo(() => generateErrorLogs(100), []);
  const apiLogs = useMemo(() => generateApiLogs(100), []);

  const getSeverityBadge = (severity: LogLevel) => {
    const styles: { [key in LogLevel]: string } = {
      Info: 'bg-blue-500/20 text-blue-400',
      Warning: 'bg-yellow-500/20 text-yellow-400',
      Error: 'bg-orange-500/20 text-orange-400',
      Critical: 'bg-red-500/20 text-red-400',
    };
    return <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${styles[severity]}`}>{severity}</span>;
  };

  const getMethodBadge = (method: HttpMethod) => {
    const styles: { [key in HttpMethod]: string } = {
      GET: 'bg-green-500/20 text-green-400',
      POST: 'bg-blue-500/20 text-blue-400',
      PUT: 'bg-yellow-500/20 text-yellow-400',
      PATCH: 'bg-purple-500/20 text-purple-400',
      DELETE: 'bg-red-500/20 text-red-400',
    };
    return <span className={`px-2 w-16 text-center inline-flex text-xs leading-5 font-semibold rounded-full ${styles[method]}`}>{method}</span>;
  };

  const getStatusBadge = (status: number) => {
    const color = status >= 500 ? 'bg-red-500/20 text-red-400'
                : status >= 400 ? 'bg-orange-500/20 text-orange-400'
                : status >= 300 ? 'bg-yellow-500/20 text-yellow-400'
                : 'bg-green-500/20 text-green-400';
    return <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${color}`}>{status}</span>;
  };

  const activityColumns = [
    { key: 'user', header: 'User', render: (item: ActivityLog) => (
      <div className="flex items-center space-x-3">
        <img className="h-8 w-8 rounded-full" src={item.user.avatar} alt={item.user.name} />
        <span className="text-sm font-medium text-premium-platinum">{item.user.name}</span>
      </div>
    )},
    { key: 'action', header: 'Action', render: (item: ActivityLog) => <span className="text-sm">{item.action}</span> },
    { key: 'target', header: 'Target', render: (item: ActivityLog) => <code className="text-sm text-premium-light-gray/80">{item.target}</code> },
    { key: 'ip', header: 'IP Address', render: (item: ActivityLog) => <span className="text-sm">{item.ip}</span> },
    { key: 'timestamp', header: 'Timestamp', render: (item: ActivityLog) => <span className="text-sm">{new Date(item.timestamp).toLocaleString()}</span> },
  ];

  const errorColumns = [
    { key: 'severity', header: 'Severity', render: (item: ErrorLog) => getSeverityBadge(item.severity) },
    { key: 'code', header: 'Code', render: (item: ErrorLog) => <span className="text-sm">{item.code}</span> },
    { key: 'message', header: 'Message', render: (item: ErrorLog) => <p className="text-sm truncate max-w-sm">{item.message}</p> },
    { key: 'timestamp', header: 'Timestamp', render: (item: ErrorLog) => <span className="text-sm">{new Date(item.timestamp).toLocaleString()}</span> },
  ];

  const apiColumns = [
    { key: 'method', header: 'Method', render: (item: ApiLog) => getMethodBadge(item.method) },
    { key: 'endpoint', header: 'Endpoint', render: (item: ApiLog) => <code className="text-sm">{item.endpoint}</code> },
    { key: 'statusCode', header: 'Status', render: (item: ApiLog) => getStatusBadge(item.statusCode) },
    { key: 'duration', header: 'Duration', render: (item: ApiLog) => <span className="text-sm">{item.duration}ms</span> },
    { key: 'ip', header: 'IP Address', render: (item: ApiLog) => <span className="text-sm">{item.ip}</span> },
    { key: 'timestamp', header: 'Timestamp', render: (item: ApiLog) => <span className="text-sm">{new Date(item.timestamp).toLocaleString()}</span> },
  ];

  const tabs = [
    { id: 'activity', label: 'Activity Logs', icon: History, data: activityLogs, columns: activityColumns },
    { id: 'error', label: 'Error Logs', icon: AlertCircle, data: errorLogs, columns: errorColumns },
    { id: 'api', label: 'API Logs', icon: Server, data: apiLogs, columns: apiColumns },
  ];

  const currentTab = tabs.find(t => t.id === activeTab);

  return (
    <div className="h-full bg-premium-dark flex flex-col overflow-hidden">
      <div className="p-6 border-b border-white/10 flex-shrink-0">
        <h1 className="text-2xl font-bold text-premium-platinum mb-4">Logs & Audits</h1>
        <div className="flex items-center border-b border-white/10">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-colors relative ${
                activeTab === tab.id ? 'text-premium-gold' : 'text-premium-light-gray/70 hover:text-premium-platinum'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {activeTab === tab.id && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-premium-gold"
                  layoutId="logTabIndicator"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {currentTab && <LogTable logs={currentTab.data} columns={currentTab.columns} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LogsView;
