import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PiBookOpen, PiGraduationCap, PiUser, PiCalendar, PiPlayCircle, PiX, PiCheckCircle } from 'react-icons/pi';
import axios from 'axios';
import BASE_URL from '../utils/constants';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Creator {
  _id: string;
  name: string;
  email: string;
  specialization: string;
  qualification: string;
}

interface Stage {
  id: string;
  title: string;
  description: string;
  no: number;
  completed: boolean;
}

interface Course {
  id: string;
  thumbnail: string;
  description: string;
  creator: Creator;
  totalStages: number;
  content: Stage[];
}

export const StudentCourseViewComponent: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStage, setSelectedStage] = useState<Stage | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${BASE_URL}/api/course/getcourse/student/${courseId}`, {
          headers: {token}
        });
        setCourse(response.data.course);
        setIsLoading(false);
      } catch (err) {
        setError('Error fetching course details. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  const openStagePopup = (stage: Stage) => {
    setSelectedStage(stage);
    setIsPopupOpen(true);
  };

  const closeStagePopup = () => {
    setIsPopupOpen(false);
    setSelectedStage(null);
  };

  const handleStageComplete = async () => {
    if (selectedStage) {
      try {
        const token = localStorage.getItem('token');
        await axios.post(`${BASE_URL}/api/course/updateprogress`, {
          courseId: course?.id,
          stageId: selectedStage.id
        }, {
          headers: {token }
        });

        // Update the completed status locally
        setCourse(prevCourse => {
          if (!prevCourse) return null;
          return {
            ...prevCourse,
            content: prevCourse.content.map(stage =>
              stage.id === selectedStage.id ? { ...stage, completed: true } : stage
            )
          };
        });
        toast.success('Stage completed!');
        closeStagePopup();
      } catch (err) {
        toast.error('Error updating progress. Please try again later.');
      }
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading course details...</div>;
  }

  if (error) {
    toast.error(error);
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  if (!course) {
    return <div className="text-center py-8">Course not found.</div>;
  }

  return (
    <div className="bg-[#f8f9fa] min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="relative h-64 md:h-80">
          <img
            src={course.thumbnail}
            alt={course.description}
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
                {course.description}
              </motion.h1>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="inline-block bg-[#007bff] text-white px-3 py-1 rounded-full text-sm font-semibold"
              >
                {course.creator.specialization}
              </motion.div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <p className="text-[#6c757d] mb-6">{course.description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center">
              <PiUser className="text-[#007bff] mr-2" size={20} />
              <span className="text-[#212529]">Instructor: {course.creator.name}</span>
            </div>
            <div className="flex items-center">
              <PiGraduationCap className="text-[#007bff] mr-2" size={20} />
              <span className="text-[#212529]">Specialization: {course.creator.specialization}</span>
            </div>
            <div className="flex items-center">
              <PiBookOpen className="text-[#007bff] mr-2" size={20} />
              <span className="text-[#212529]">Total Stages: {course.totalStages}</span>
            </div>
            <div className="flex items-center">
              <PiCalendar className="text-[#007bff] mr-2" size={20} />
              <span className="text-[#212529]">Qualification: {course.creator.qualification}</span>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-[#212529] mb-4">Course Content</h2>
          <div className="space-y-4">
            {course.content.map((stage, index) => (
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-[#f8f9fa] p-4 rounded-lg border border-[#dee2e6] cursor-pointer"
                onClick={() => openStagePopup(stage)}
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-[#212529]">
                    Stage {stage.no}: {stage.title}
                  </h3>
                  {stage.completed ? (
                    <PiCheckCircle className="text-[#28a745]" size={20} />
                  ) : (
                    <PiPlayCircle className="text-[#007bff]" size={20} />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="bg-[#f8f9fa] p-6 border-t border-[#dee2e6]">
          <h2 className="text-2xl font-bold text-[#212529] mb-4">About the Instructor</h2>
          <div className="flex items-center mb-4">
            <div className="w-16 h-16 bg-[#007bff] rounded-full flex items-center justify-center text-white text-2xl font-bold mr-4">
              {course.creator.name.charAt(0)}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#212529]">{course.creator.name}</h3>
              <p className="text-[#6c757d]">{course.creator.qualification}</p>
            </div>
          </div>
          <p className="text-[#6c757d]">
            Specializes in {course.creator.specialization}. Passionate about teaching and helping students succeed in their learning journey.
          </p>
        </div>
      </div>

      <AnimatePresence>
        {isPopupOpen && selectedStage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-lg p-6 max-w-lg w-full relative"
            >
              <button
                onClick={closeStagePopup}
                className="absolute top-2 right-2 text-[#6c757d] hover:text-[#212529]"
                aria-label="Close popup"
              >
                <PiX size={24} />
              </button>
              <h2 className="text-2xl font-bold text-[#212529] mb-4">Course Overview</h2>
              <h3 className="text-xl font-semibold text-[#212529] mb-2">
                Stage {selectedStage.no}: {selectedStage.title}
              </h3>
              <p className="text-[#6c757d] mb-4">{selectedStage.description}</p>
              <div className="flex justify-end">
                <button
                  onClick={handleStageComplete}
                  className={`px-4 py-2 rounded-md text-white transition-colors duration-300 ${
                    selectedStage.completed
                      ? 'bg-[#28a745] hover:bg-[#218838]'
                      : 'bg-[#007bff] hover:bg-[#0056b3]'
                  }`}
                  disabled={selectedStage.completed}
                >
                  {selectedStage.completed ? 'Stage Completed' : 'Mark as Complete'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

