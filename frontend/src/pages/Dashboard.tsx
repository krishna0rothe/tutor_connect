import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import BASE_URL from '../utils/constants';
import { TeacherDashboard } from '../components/dashboard/TeacherDashboard';
import { ParentDashboard } from '../components/dashboard/ParentDashboard';
import { StudentDashboard } from '../components/dashboard/StudentDashboard';

type UserRole = 'teacher' | 'parent' | 'student';

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const navigate = useNavigate();   

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        localStorage.removeItem("token");
        navigate('/login');
        return;
      }

      try {
        const userInfoResponse = await axios.get(`${BASE_URL}/api/util/me`, {
          headers: {token }
        });
        setUser(userInfoResponse.data.user);

        const userRoleResponse = await axios.get(`${BASE_URL}/api/util/myrole`, {
          headers: { token }
        });
        setUserRole(userRoleResponse.data.role);
      } catch (error) {
        console.error('Error fetching user info or role', error);
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

  if (!user || !userRole) {
    return <div>Loading...</div>;
  }

  return renderDashboard();
};

export default Dashboard;

