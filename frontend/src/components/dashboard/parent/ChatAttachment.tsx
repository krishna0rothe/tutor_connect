import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PiX, PiPaperPlaneTilt } from 'react-icons/pi';
import axios from 'axios';
import BASE_URL from '../../../utils/constants';

interface User {
  id: string;
  name: string;
}

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  role: string;
}

interface UserListProps {
  users: User[];
  onUserSelect: (user: User) => void;
  selectedUser: User | null;
}

interface ChatModalProps {
  user: User;
  messages: Message[];
  conversationId: string | null;
  onSendMessage: (text: string, conversationId: string) => void;
  onClose: () => void;
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

const ChatModal: React.FC<ChatModalProps> = ({ user, messages, conversationId, onSendMessage, onClose }) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting message:", newMessage);
    if (newMessage.trim() && conversationId) {
      onSendMessage(newMessage.trim(), conversationId);
      setNewMessage('');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col h-[calc(100vh-8rem)]">
      <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <h3 className="text-xl font-semibold">{user.name}</h3>
        <button onClick={onClose} className="text-white hover:text-gray-200">
          <PiX size={24} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-4 ${
              message.senderId === 'currentUser' ? 'text-right' : 'text-left'
            }`}
          >
            <div
              className={`inline-block p-2 rounded-lg ${
                message.senderId === 'currentUser'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              <p>{message.text}</p>
              <p className="text-xs mt-1 opacity-75">
                {new Date(message.timestamp).toLocaleTimeString()} - {message.role}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 transition-colors duration-200"
          >
            <PiPaperPlaneTilt size={20} />
          </motion.button>
        </div>
      </form>
    </div>
  );
};

const ChatAttachment: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("Fetching user role with token:", token);
        const roleResponse = await axios.get(`${BASE_URL}/api/util/myrole`, {
          headers: {
            token
          },
        });
        const role = roleResponse.data.role;
        setUserRole(role);
        console.log("User role fetched successfully:", role);

        let usersResponse;
        if (role === "parent") {
          console.log("Fetching teachers for student...");
          usersResponse = await axios.get(`${BASE_URL}/api/student/getteachers`, {
            headers: {
              token
            },
          });
          if (usersResponse) {
            console.log("Users fetched successfully:", usersResponse.data.uniqueTeachers);
            setUsers(usersResponse.data.uniqueTeachers.map((teacher: any) => ({
              id: teacher.id,
              name: teacher.name,
            })));
          }
        } else if (role === "teacher") {
          console.log("Fetching parents for teacher...");
          usersResponse = await axios.get(`${BASE_URL}/api/tutor/studentparents`, {
            headers: {
              token
            },
          });
          if (usersResponse) {
            console.log("Users fetched successfully:", usersResponse.data.uniqueParents);
            setUsers(usersResponse.data.uniqueParents.map((parent: any) => ({
              id: parent.parentId,
              name: parent.parentName,
            })));
          }
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      fetchMessages(selectedUser.id);
    }
  }, [selectedUser]);

  const fetchMessages = async (userId: string) => {
    try {
      const token = localStorage.getItem("token");
      console.log("Fetching conversation for user:", userId);
      const response = await axios.get(`${BASE_URL}/api/msg/conversation`, {
        params: { recipientId: userId },
        headers: {
          token
        },
      });
      console.log("Conversation fetched successfully:", response.data);
      setConversationId(response.data.response.conversation._id);
      setMessages(response.data.response.messages.map((message: any) => ({
        id: message._id,
        senderId: message.sender,
        text: message.content,
        timestamp: message.sentTime,
        role: message.senderModel,
      })));
    } catch (error) {
      console.error("Error fetching conversation:", error);
    }
  };

  const handleUserSelect = (user: User) => {
    console.log("User selected:", user);
    setSelectedUser(user);
  };

  const handleSendMessage = async (content: string, conversationId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      console.log("Sending message to conversation:", conversationId);
      const response = await axios.post(`${BASE_URL}/api/msg/send`, {
        conversationId: conversationId,
        content: content,
      }, {
        headers: {
          token
        },
      });

      if (response.status === 200) {
        console.log("Message sent successfully:", response.data);
        // Re-fetch messages after sending a message
        fetchMessages(selectedUser!.id);
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      // Optionally, you can show an error message to the user here
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex h-screen bg-gray-100">
        <div className="w-1/3 bg-white shadow-md">
          <UserList
            users={users}
            onUserSelect={handleUserSelect}
            selectedUser={selectedUser}
          />
        </div>
        <div className="w-2/3 p-4">
          <h1 className="text-2xl font-bold mb-4">Chat with Teachers</h1>
          <AnimatePresence>
            {selectedUser && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <ChatModal
                  user={selectedUser}
                  messages={messages}
                  conversationId={conversationId}
                  onSendMessage={(text) => handleSendMessage(text, conversationId!)}
                  onClose={() => setSelectedUser(null)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ChatAttachment;

