import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { User } from '../../lib/mock-data';
import { useApp } from '../../contexts/AppContext';
import UserTable from './UserTable';
import ActionConfirmationModal from './ActionConfirmationModal';
import EditUserModal from './EditUserModal';
import { Search, Plus, Download, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'react-hot-toast';

const UserManagementView: React.FC = () => {
  const { users, setUsers } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalState, setModalState] = useState({ isOpen: false, action: '', userId: '' });
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const usersPerPage = 10;

  const filteredUsers = useMemo(() => {
    return users.filter(user =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [users, searchQuery]);

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * usersPerPage;
    return filteredUsers.slice(startIndex, startIndex + usersPerPage);
  }, [filteredUsers, currentPage, usersPerPage]);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === paginatedUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(paginatedUsers.map(u => u.id));
    }
  };

  const handleAction = (action: string, userId: string) => {
    if (action === 'edit') {
      const userToEdit = users.find(u => u.id === userId);
      if (userToEdit) setEditingUser(userToEdit);
    } else {
      setModalState({ isOpen: true, action, userId });
    }
  };
  
  const handleSaveUser = (updatedUser: User) => {
    setUsers(prevUsers => prevUsers.map(u => u.id === updatedUser.id ? updatedUser : u));
    toast.success(`User ${updatedUser.name} updated successfully.`);
    setEditingUser(null);
  };

  const confirmAction = () => {
    const { action, userId } = modalState;
    const user = users.find(u => u.id === userId);
    if (!user) return;

    switch (action) {
      case 'suspend':
        setUsers(users.map(u => u.id === userId ? { ...u, status: 'Suspended' } : u));
        toast.success(`User ${user.name} has been suspended.`);
        break;
      case 'ban':
        setUsers(users.map(u => u.id === userId ? { ...u, status: 'Banned' } : u));
        toast.success(`User ${user.name} has been banned.`);
        break;
      case 'delete':
        setUsers(users.filter(u => u.id !== userId));
        toast.success(`User ${user.name} has been deleted.`);
        break;
      default:
        toast(`Action '${action}' on ${user.name}`);
    }
    closeModal();
  };

  const closeModal = () => {
    setModalState({ isOpen: false, action: '', userId: '' });
  };

  const getModalContent = () => {
    const user = users.find(u => u.id === modalState.userId);
    if (!user) return { title: '', message: '' };
    switch (modalState.action) {
      case 'suspend':
        return { title: 'Suspend User', message: `Are you sure you want to suspend ${user.name}? They will lose access temporarily.` };
      case 'ban':
        return { title: 'Ban User', message: `Are you sure you want to ban ${user.name}? This action is permanent.` };
      case 'delete':
        return { title: 'Delete User', message: `Are you sure you want to delete ${user.name}? This action cannot be undone.` };
      default:
        return { title: 'Confirm Action', message: `Please confirm this action for ${user.name}.` };
    }
  };

  return (
    <div className="h-full bg-premium-dark flex flex-col overflow-hidden">
      <ActionConfirmationModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        onConfirm={confirmAction}
        title={getModalContent().title}
        message={getModalContent().message}
      />
      
      {editingUser && (
        <EditUserModal
          isOpen={!!editingUser}
          onClose={() => setEditingUser(null)}
          user={editingUser}
          onSave={handleSaveUser}
        />
      )}
      
      {/* Header */}
      <div className="p-6 border-b border-white/10 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-premium-platinum">User Management</h1>
          <div className="flex items-center space-x-3">
            <motion.button className="flex items-center space-x-2 px-4 py-2 bg-premium-dark-gray border border-white/10 rounded-xl hover:bg-premium-medium-gray text-sm">
              <Download className="w-4 h-4" /><span>Export</span>
            </motion.button>
            <motion.button className="flex items-center space-x-2 px-4 py-2 bg-premium-gold text-black rounded-xl hover:opacity-90 shadow-lg shadow-premium-gold/30 text-sm">
              <Plus className="w-4 h-4" /><span>Add User</span>
            </motion.button>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-premium-light-gray/50 w-4 h-4" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 bg-premium-dark-gray border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-premium-gold text-sm"
            />
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-premium-dark-gray border border-white/10 rounded-xl hover:bg-premium-medium-gray text-sm">
            <Filter className="w-4 h-4" /><span>Filter</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-y-auto">
        <UserTable
          users={paginatedUsers}
          onAction={handleAction}
          onSelectUser={handleSelectUser}
          onSelectAll={handleSelectAll}
          selectedUsers={selectedUsers}
          isAllSelected={selectedUsers.length === paginatedUsers.length && paginatedUsers.length > 0}
        />
      </div>

      {/* Footer / Pagination */}
      <div className="p-4 border-t border-white/10 flex items-center justify-between text-sm text-premium-light-gray/70 flex-shrink-0">
        <div>
          {selectedUsers.length} of {filteredUsers.length} users selected.
        </div>
        <div className="flex items-center space-x-4">
          <span>Page {currentPage} of {totalPages}</span>
          <div className="flex items-center space-x-2">
            <motion.button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-premium-dark-gray"
              whileTap={{ scale: 0.9 }}
            >
              <ChevronLeft className="w-4 h-4" />
            </motion.button>
            <motion.button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-premium-dark-gray"
              whileTap={{ scale: 0.9 }}
            >
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagementView;
