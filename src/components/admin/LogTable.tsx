import React from 'react';
import { motion } from 'framer-motion';

interface LogTableProps {
  logs: any[];
  columns: { key: string; header: string; render?: (item: any) => React.ReactNode }[];
}

const LogTable: React.FC<LogTableProps> = ({ logs, columns }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-white/10">
        <thead className="bg-premium-dark-gray/40">
          <tr>
            {columns.map(col => (
              <th
                key={col.key}
                className="px-6 py-3 text-left text-xs font-medium text-premium-light-gray/70 uppercase tracking-wider"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {logs.map((log, index) => (
            <motion.tr
              key={log.id}
              className="hover:bg-premium-dark-gray/30 transition-colors"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.01 }}
            >
              {columns.map(col => (
                <td key={col.key} className="px-6 py-4 whitespace-nowrap">
                  {col.render ? col.render(log) : <span className="text-sm text-premium-light-gray">{log[col.key]}</span>}
                </td>
              ))}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LogTable;
