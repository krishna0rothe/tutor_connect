import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PiBookOpen, PiGraduationCap, PiUser, PiCalendar, PiClock } from 'react-icons/pi';
import axios from 'axios';
import BASE_URL from '../../../utils/constants';

interface Creator {
  _id: string;
  name: string;
  email: string;
  specialization: string;
  qualification: string;
}

interface Stage {
  _id: string;
  title: string;
  description: string;
  no: number;
}

interface Course {
  _id: string;
  name: string;
  creator: Creator;
  description: string;
  specialization: string;
  thumbnail: string;
  content: Stage[];
  total_stages: number;
  enrolled: any[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export const CoursePreview: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [courseData, setCourseData] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourseData = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${BASE_URL}/api/course/getcourse/${courseId}`, {
          headers: { token }
        });
        setCourseData(response.data.course);
      } catch (error) {
        setIsError(true);
        setErrorMessage(error.response?.data?.message || 'Failed to fetch course data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#f8f9fa]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#f8f9fa]">
        <p className="text-red-500 text-xl">{errorMessage}</p>
      </div>
    );
  }

  if (!courseData) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#f8f9fa]">
        <p className="text-[#212529] text-xl">No course data available.</p>
      </div>
    );
  }

  const { thumbnail, name, specialization, description, creator, total_stages, createdAt, content, updatedAt, enrolled } = courseData;

  return (
    <div className="bg-[#f8f9fa] min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="relative h-64 md:h-80">
          <img
            src={thumbnail}
            alt={name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end">
            <div className="p-6">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-3xl md:text-4xl font-bold text-white mb-2"
              >
                {name}
              </motion.h1>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="inline-block bg-[#007bff] text-white px-3 py-1 rounded-full text-sm font-semibold"
              >
                {specialization}
              </motion.div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <h2 className="text-2xl font-bold text-[#212529] mb-4">Course Details</h2>
          <p className="text-[#6c757d] mb-4">{description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center">
              <PiUser className="text-[#007bff] mr-2" size={20} />
              <span className="text-[#212529]">Creator: {creator.name}</span>
            </div>
            <div className="flex items-center">
              <PiGraduationCap className="text-[#007bff] mr-2" size={20} />
              <span className="text-[#212529]">Qualification: {creator.qualification}</span>
            </div>
            <div className="flex items-center">
              <PiBookOpen className="text-[#007bff] mr-2" size={20} />
              <span className="text-[#212529]">Total Stages: {total_stages}</span>
            </div>
            <div className="flex items-center">
              <PiCalendar className="text-[#007bff] mr-2" size={20} />
              <span className="text-[#212529]">Created: {new Date(createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-[#212529] mb-4">Course Content</h2>
          <div className="space-y-4">
            {content.map((stage, index) => (
              <motion.div
                key={stage._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-[#f8f9fa] p-4 rounded-lg border border-[#dee2e6]"
              >
                <h3 className="text-lg font-semibold text-[#212529] mb-2">
                  Stage {stage.no}: {stage.title}
                </h3>
                <p className="text-[#6c757d]">{stage.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="bg-[#f8f9fa] p-6 border-t border-[#dee2e6]">
          <h2 className="text-2xl font-bold text-[#212529] mb-4">Course Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <PiUser className="text-[#007bff] mr-2" size={20} />
              <span className="text-[#212529]">Creator Email: {creator.email}</span>
            </div>
            <div className="flex items-center">
              <PiGraduationCap className="text-[#007bff] mr-2" size={20} />
              <span className="text-[#212529]">Creator Specialization: {creator.specialization}</span>
            </div>
            <div className="flex items-center">
              <PiClock className="text-[#007bff] mr-2" size={20} />
              <span className="text-[#212529]">Last Updated: {new Date(updatedAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center">
              <PiUser className="text-[#007bff] mr-2" size={20} />
              <span className="text-[#212529]">Enrolled Students: {enrolled.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

