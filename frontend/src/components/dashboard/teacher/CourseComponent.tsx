import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Book, User, Layers, ChevronRight } from 'lucide-react';

interface Course {
  id: string;
  name: string;
  description: string;
  creator: string;
  thumbnail: string;
  specialization: string;
  total_stages: number;
}

interface CourseListComponentProps {
  courses: Course[];
}

export const CourseComponent: React.FC<CourseListComponentProps> = ({ courses }) => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Courses</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img 
              src={course.thumbnail} 
              alt={`${course.name} thumbnail`} 
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{course.name}</h2>
              <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
              <div className="flex items-center mb-2">
                <Book className="w-4 h-4 mr-2 text-gray-500" />
                <span className="text-sm text-gray-500">{course.specialization}</span>
              </div>
              <div className="flex items-center mb-4">
                <Layers className="w-4 h-4 mr-2 text-gray-500" />
                <span className="text-sm text-gray-500">{course.total_stages} stages</span>
              </div>
              <button
                onClick={() => navigate(`/myCourse/${course._id}`)}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors duration-300 flex items-center justify-center"
              >
                Manage Course
                <ChevronRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

