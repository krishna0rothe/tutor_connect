import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CourseComponent } from './CourseComponent';
import BASE_URL from '../../../utils/constants';

interface Course {
  id: string;
  name: string;
  description: string;
  creator: string;
  thumbnail: string;
  specialization: string;
  total_stages: number;
}

export const CourseList: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('User not authenticated');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${BASE_URL}/api/course/getallcourse`, {
          headers: { token }
        });
        setCourses(response.data.courses);
      } catch (error) {
        setError('Error fetching courses');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <CourseComponent courses={courses} />
    </div>
  );
};

