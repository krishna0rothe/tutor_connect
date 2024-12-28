import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PiBookOpen, PiGraduationCap } from 'react-icons/pi';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BASE_URL from '../../../utils/constants';

interface Creator {
  _id: string;
  name: string;
  email: string;
  specialization: string;
  qualification: string;
}

interface Course {
  id: string;
  name: string;
  description: string;
  specialization: string;
  thumbnail: string;
  creator: Creator;
  totalEnrolled: number;
}

const fetchEnrolledCourses = async (): Promise<Course[]> => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${BASE_URL}/api/student/courses`, {
    headers: { token }
  });
  if (response.status !== 200) {
    throw new Error('Failed to fetch enrolled courses');
  }
  return response.data.courses;
};

const fetchAllCourses = async (): Promise<Course[]> => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${BASE_URL}/api/course/getall`, {
    headers: { token }
  });
  if (response.status !== 200) {
    throw new Error('Failed to fetch all courses');
  }
  return response.data.courses;
};

const enrollInCourse = async (courseId: string): Promise<void> => {
  const token = localStorage.getItem('token');
  const response = await axios.post(`${BASE_URL}/api/course/enroll`, { courseId }, {
    headers: { token }
  });
  if (response.status !== 201) {
    throw new Error('Failed to enroll in course');
  }
};

const CourseCard: React.FC<{ course: Course; isEnrolled: boolean; onEnroll: (courseId: string) => void; onContinue: (courseId: string) => void }> = ({ course, isEnrolled, onEnroll, onContinue }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full"
    >
      <div className="relative h-48 w-full">
        <img
          src={course.thumbnail || '/placeholder.svg'}
          alt={course.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="text-xl font-semibold mb-2 line-clamp-2">{course.name}</h3>
        <p className="text-gray-600 mb-4 flex-grow line-clamp-3">{course.description}</p>
        <div className="flex items-center mb-2">
          <PiGraduationCap className="text-blue-500 mr-2" />
          <span className="text-sm font-medium">{course.specialization}</span>
        </div>
        <div className="flex items-center mb-4">
          <PiBookOpen className="text-blue-500 mr-2" />
          <span className="text-sm">Enrolled: {course.totalEnrolled}</span>
        </div>
        <button
          className={`w-full py-2 px-4 rounded-md text-white font-medium ${
            isEnrolled ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'
          }`}
          onClick={() => isEnrolled ? onContinue(course.id) : onEnroll(course.id)}
        >
          {isEnrolled ? 'Continue' : 'Enroll Now'}
        </button>
      </div>
    </motion.div>
  );
};

export const MyCoursesComponent: React.FC = () => {
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        const [enrolled, all] = await Promise.all([
          fetchEnrolledCourses(),
          fetchAllCourses()
        ]);
        setEnrolledCourses(enrolled);
        const enrolledIds = new Set(enrolled.map(course => course.id));
        const filteredCourses = all.filter(course => !enrolledIds.has(course.id));
        setAvailableCourses(filteredCourses);
        setIsLoading(false);
      } catch (err) {
        setError('Error fetching courses. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleEnroll = async (courseId: string) => {
    try {
      await enrollInCourse(courseId);
      const updatedEnrolledCourses = await fetchEnrolledCourses();
      setEnrolledCourses(updatedEnrolledCourses);
      const enrolledIds = new Set(updatedEnrolledCourses.map(course => course.id));
      const updatedAvailableCourses = await fetchAllCourses();
      setAvailableCourses(updatedAvailableCourses.filter(course => !enrolledIds.has(course.id)));
      toast.success('Enrolled in course successfully!');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error enrolling in course. Please try again later.';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleContinue = (courseId: string) => {

    navigate(`/course/${courseId}`);
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading courses...</div>;
  }

  if (error) {
    toast.error(error);
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Courses</h1>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Your Enrolled Courses</h2>
        {enrolledCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {enrolledCourses.map(course => (
                <CourseCard key={course.id} course={course} isEnrolled={true} onEnroll={handleEnroll} onContinue={handleContinue} />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <p className="text-gray-600">You have not enrolled in any courses yet.</p>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Explore Courses</h2>
        {availableCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {availableCourses.map(course => (
                <CourseCard key={course.id} course={course} isEnrolled={false} onEnroll={handleEnroll} onContinue={handleContinue} />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <p className="text-gray-600">No additional courses available at the moment.</p>
        )}
      </section>
    </div>
  );
};

