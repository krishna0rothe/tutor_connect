import React from 'react';
import { motion } from 'framer-motion';

interface User {
  id: string;
  name: string;
}

interface UserListProps {
  users: User[];
  onUserSelect: (user: User) => void;
  selectedUser: User | null;
}

const UserList: React.FC<UserListProps> = ({ users, onUserSelect, selectedUser }) => {
  return (
    <div className="h-full overflow-y-auto">
      <h2 className="text-xl font-semibold p-4 border-b">Users</h2>
      <ul>
        {users.map((user) => (
          <motion.li
            key={user.id}
            className={`p-4 border-b cursor-pointer hover:bg-gray-100 transition-colors duration-200 ${
              selectedUser?.id === user.id ? 'bg-blue-100' : ''
            }`}
            onClick={() => onUserSelect(user)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center">
              <span className="font-medium">{user.name}</span>
            </div>
          </motion.li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;

