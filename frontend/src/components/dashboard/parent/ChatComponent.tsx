import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PiX } from "react-icons/pi";
import UserList from "./UserList";
import ChatModal from "./ChatModal";
import axios from "axios";
import BASE_URL from "../../../utils/constants";

// Mock data for messages
const mockMessages = [
  {
    id: "1",
    senderId: "1",
    text: "Hello, how are you?",
    timestamp: "2023-05-20T10:30:00Z",
  },
  {
    id: "2",
    senderId: "currentUser",
    text: "I'm good, thanks! How about you?",
    timestamp: "2023-05-20T10:31:00Z",
  },
  {
    id: "3",
    senderId: "1",
    text: "I'm doing well. Do you have any questions about the recent assignment?",
    timestamp: "2023-05-20T10:32:00Z",
  },
  {
    id: "4",
    senderId: "currentUser",
    text: "Yes, I was wondering about the due date. Is it next Friday?",
    timestamp: "2023-05-20T10:33:00Z",
  },
  {
    id: "5",
    senderId: "1",
    text: "That's correct. The assignment is due next Friday at 11:59 PM.",
    timestamp: "2023-05-20T10:34:00Z",
  },
];

const ChatComponent: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<{ id: string; name: string } | null>(null);
  const [messages, setMessages] = useState(mockMessages);
  const [users, setUsers] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const roleResponse = await axios.get(`${BASE_URL}/api/util/myrole`, {
          headers: {
            token
          },
        });
        const role = roleResponse.data.role;

        let usersResponse;
        if (role === "student") {
          usersResponse = await axios.get(`${BASE_URL}/api/student/getteachers`, {
            headers: {
              token
            },
          });
        } else if (role === "teacher") {
          usersResponse = await axios.get(`${BASE_URL}/api/tutor/studentparents`, {
            headers: {
              token
            },
          });
        }

        if (usersResponse) {
          setUsers(usersResponse.data.uniqueTeachers);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleUserSelect = (user: { id: string; name: string }) => {
    setSelectedUser(user);
    // In a real application, you would fetch messages for the selected user here
  };

  const handleSendMessage = (text: string) => {
    const newMessage = {
      id: (messages.length + 1).toString(),
      senderId: "currentUser",
      text,
      timestamp: new Date().toISOString(),
    };
    setMessages([...messages, newMessage]);
    // In a real application, you would send the message to the backend here
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
                  onSendMessage={handleSendMessage}
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

export default ChatComponent;
