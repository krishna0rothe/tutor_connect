import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import BASE_URL from '../utils/constants';
import { TeacherDashboard } from '../components/dashboard/TeacherDashboard';
import { ParentDashboard } from '../components/dashboard/ParentDashboard';
import { StudentDashboard } from '../components/dashboard/StudentDashboard';
import { motion } from 'framer-motion';

type UserRole = 'teacher' | 'parent' | 'student';

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<UserRole>('teacher');
  const navigate = useNavigate();   

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get(`${BASE_URL}/api/util/me`, {
          headers: { token }
        });
        setUser(response.data.user);
        // setUserRole(response.data.user.role);
      } catch (error) {
        console.error('Error fetching user info', error);
        navigate('/login');
      }
    };

    fetchUserInfo();
  }, [navigate]);

  const renderDashboard = () => {
    switch (userRole) {
      case 'teacher':
        return <TeacherDashboard />;
      case 'parent':
        return <ParentDashboard />;
      case 'student':
        return <StudentDashboard />;
      default:
        return null;
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return renderDashboard();
};

export default Dashboard;

