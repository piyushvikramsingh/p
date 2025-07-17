import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { Archive, Download, DatabaseBackup, Shield, Play } from 'lucide-react';

const SettingCard: React.FC<{ title: string; icon: React.ElementType; children: React.ReactNode }> = ({ title, icon: Icon, children }) => (
  <motion.div
    className="bg-premium-dark-gray/60 rounded-2xl p-6 border border-white/10"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <div className="flex items-center space-x-3 mb-6">
      <div className="w-10 h-10 bg-premium-dark-gray rounded-xl flex items-center justify-center border border-white/10">
        <Icon className="w-5 h-5 text-premium-gold" />
      </div>
      <h3 className="text-lg font-semibold text-premium-platinum">{title}</h3>
    </div>
    <div className="space-y-4">{children}</div>
  </motion.div>
);

const BackupExportView: React.FC = () => {
    const [exportData, setExportData] = useState('users');
    const [exportFormat, setExportFormat] = useState('json');

    const handleBackup = () => {
        toast.promise(
            new Promise(resolve => setTimeout(resolve, 1500)),
            {
                loading: 'Starting database backup...',
                success: 'Database backup successfully created in Google Cloud Storage.',
                error: 'Backup failed.',
            }
        );
    };

    const handleExport = () => {
        toast.success(`Exporting ${exportData} as ${exportFormat.toUpperCase()}...`);
    };

    const handleRecovery = () => {
        toast.loading('Disaster recovery process initiated. This may take a while.');
    }

    return (
        <div className="h-full bg-premium-dark overflow-y-auto p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-premium-platinum">Backups & Export</h1>
                <p className="text-premium-light-gray/70">Manage data backups, exports, and recovery.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SettingCard title="Manual Database Backup" icon={DatabaseBackup}>
                    <p className="text-sm text-premium-light-gray/70">Create a full snapshot of the production database and store it securely in Google Cloud Storage.</p>
                    <button onClick={handleBackup} className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-premium-gold text-black rounded-xl hover:opacity-90 text-sm font-semibold">
                        <Play className="w-4 h-4" />
                        <span>Initiate Backup Now</span>
                    </button>
                </SettingCard>

                <SettingCard title="Export Data" icon={Download}>
                    <p className="text-sm text-premium-light-gray/70">Export specific data sets for analysis or migration.</p>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-medium text-premium-light-gray/80">Data Set</label>
                            <select value={exportData} onChange={e => setExportData(e.target.value)} className="w-full mt-1 p-2 bg-premium-dark-gray border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-premium-gold">
                                <option value="users">Users</option>
                                <option value="tasks">Tasks</option>
                                <option value="analytics">Analytics</option>
                                <option value="logs">Logs</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-medium text-premium-light-gray/80">Format</label>
                            <select value={exportFormat} onChange={e => setExportFormat(e.target.value)} className="w-full mt-1 p-2 bg-premium-dark-gray border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-premium-gold">
                                <option value="json">JSON</option>
                                <option value="csv">CSV</option>
                            </select>
                        </div>
                    </div>
                    <button onClick={handleExport} className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-premium-medium-gray border border-white/10 rounded-xl hover:bg-premium-medium-gray/80 text-sm font-semibold">
                        <Download className="w-4 h-4" />
                        <span>Export</span>
                    </button>
                </SettingCard>

                <div className="lg:col-span-2">
                    <SettingCard title="Disaster Recovery" icon={Shield}>
                        <p className="text-sm text-premium-light-gray/70">
                            Our disaster recovery plan involves restoring the latest stable backup from a geo-redundant storage bucket. This action should only be taken in a critical failure scenario.
                        </p>
                        <p className="text-xs text-premium-light-gray/60">Last successful backup: Today at 2:00 AM UTC</p>
                        <button onClick={handleRecovery} className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-600/80 text-white rounded-xl hover:bg-red-600 text-sm font-semibold">
                            <Shield className="w-4 h-4" />
                            <span>Initiate Disaster Recovery</span>
                        </button>
                    </SettingCard>
                </div>
            </div>
        </div>
    );
};

export default BackupExportView;
