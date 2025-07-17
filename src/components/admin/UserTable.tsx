import React from 'react';
import { motion } from 'framer-motion';
import { User, UserStatus } from '../../lib/mock-data';
import UserActions from './UserActions';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface UserTableProps {
  users: User[];
  onAction: (action: string, userId: string) => void;
  onSelectUser: (userId: string) => void;
  onSelectAll: () => void;
  selectedUsers: string[];
  isAllSelected: boolean;
}

const UserTable: React.FC<UserTableProps> = ({
  users,
  onAction,
  onSelectUser,
  onSelectAll,
  selectedUsers,
  isAllSelected
}) => {
  const getStatusBadge = (status: UserStatus) => {
    switch (status) {
      case 'Active': return 'bg-green-500/20 text-green-400';
      case 'Suspended': return 'bg-yellow-500/20 text-yellow-400';
      case 'Banned': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const TableHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <th className="px-4 py-3 text-left text-xs font-medium text-premium-light-gray/70 uppercase tracking-wider">
      <div className="flex items-center space-x-1 cursor-pointer hover:text-premium-platinum">
        <span>{children}</span>
        {/* Sorting icons can be added here */}
      </div>
    </th>
  );

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-white/10">
        <thead className="bg-premium-dark-gray/40">
          <tr>
            <th className="px-4 py-3">
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={onSelectAll}
                className="w-4 h-4 bg-premium-dark-gray border-white/20 rounded text-premium-gold focus:ring-premium-gold"
              />
            </th>
            <TableHeader>User</TableHeader>
            <TableHeader>Status</TableHeader>
            <TableHeader>Role</TableHeader>
            <TableHeader>Plan</TableHeader>
            <TableHeader>Last Active</TableHeader>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {users.map((user, index) => (
            <motion.tr
              key={user.id}
              className="hover:bg-premium-dark-gray/30 transition-colors"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.02 }}
            >
              <td className="px-4 py-4 whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={selectedUsers.includes(user.id)}
                  onChange={() => onSelectUser(user.id)}
                  className="w-4 h-4 bg-premium-dark-gray border-white/20 rounded text-premium-gold focus:ring-premium-gold"
                />
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <div className="flex items-center space-x-3">
                  <img className="h-10 w-10 rounded-full" src={user.avatar} alt={user.name} />
                  <div>
                    <div className="text-sm font-medium text-premium-platinum">{user.name}</div>
                    <div className="text-sm text-premium-light-gray/70">{user.email}</div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(user.status)}`}>
                  {user.status}
                </span>
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-premium-light-gray">{user.role}</td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-premium-light-gray">{user.plan}</td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-premium-light-gray">{formatDate(user.lastActive)}</td>
              <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                <UserActions user={user} onAction={onAction} />
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
