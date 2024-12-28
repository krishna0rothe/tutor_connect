import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PiGraduationCap, PiUser, PiEnvelope } from "react-icons/pi";
import ProgressBar from "./ProgressBar";
import axios from "axios";
import BASE_URL from "../../../utils/constants";

interface Creator {
  id: string;
  name: string;
  email: string;
}

interface Progress {
  _id: string;
  courseId: string;
  currentStage: string;
  completedStages: string[];
  totalStages: number;
  status: string;
  completedStagesCount: number;
}

interface Course {
  courseId: string;
  courseName: string;
  courseDescription: string;
  creator: Creator;
  progress: Progress;
}

const CourseProgressItem: React.FC<{ course: Course }> = ({ course }) => {
  const progressPercentage =
    (course.progress.completedStagesCount / course.progress.totalStages) * 100

  return (
    <motion.div
      className="bg-white p-4 rounded-lg shadow-md flex flex-col justify-between h-full"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="space-y-3">
        <h3 className="text-lg font-semibold line-clamp-2">{course.courseName}</h3>
        <p className="text-sm text-gray-600 line-clamp-3">{course.courseDescription}</p>
        <div className="flex items-center text-sm text-gray-500">
          <PiUser className="text-blue-500 mr-2 flex-shrink-0" />
          <span className="truncate">{course.creator.name}</span>
        </div>
      </div>
      <div className="mt-4">
        <ProgressBar progress={progressPercentage} />
        <div className="flex justify-between text-sm mt-2">
          <span>
            {course.progress.completedStagesCount} / {course.progress.totalStages} stages
          </span>
          <span className="font-medium text-blue-600">{course.progress.status}</span>
        </div>
      </div>
    </motion.div>
  )
}



const StudentProgressComponent: React.FC = () => {
  const [student, setStudent] = useState<{ id: string; name: string } | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("Fetching student data with token:", token);
        const response = await axios.get(`${BASE_URL}/api/student/mystudent`, {
          headers: {
            token
          },
        });
        console.log("Student data fetched successfully:", response.data);
        setStudent(response.data.student);
        setCourses(response.data.courses);
      } catch (error) {
        console.error("Error fetching student data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
        <div className="bg-gray-100 p-6">
          <div className="flex items-center mb-6">
            <PiGraduationCap className="text-3xl text-blue-500 mr-3" />
            <h2 className="text-2xl font-bold">Progress for {student?.name}</h2>
          </div>
          <div className="overflow-y-auto pb-4">
            <div className="flex flex-col space-y-4">
              {courses && courses.map((course) => (
                <div key={course.courseId} className="w-full">
                  <CourseProgressItem course={course} />
                </div>
              ))}
            </div>
          </div>
        </div>
  );
};

export default StudentProgressComponent;

