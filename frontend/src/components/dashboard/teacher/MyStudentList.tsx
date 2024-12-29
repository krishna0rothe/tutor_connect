import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BASE_URL from '../../../utils/constants';

interface Student {
  id: string;
  name: string;
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

interface StudentProgress {
  student: Student;
  progress: Progress;
}

interface Course {
  courseId: string;
  courseName: string;
  students: StudentProgress[];
}

const MyStudentList: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("Fetching student data with token:", token);
        const response = await axios.get(`${BASE_URL}/api/tutor/mystudents`, {
          headers: {
          token
          },
        });
        console.log("Student data fetched successfully:", response.data);
        setCourses(response.data.teacher.courses);
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
    <div className="w-full">
      {courses.map((course) => (
        <div key={course.courseId} className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{course.courseName}</h2>
          {course.students.length > 0 ? (
            <ul className="space-y-4">
              {course.students.map(({ student, progress }) => (
                <li key={student.id} className="bg-white shadow-md rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">{student.name}</h3>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">
                      Progress: {progress.completedStagesCount} / {progress.totalStages} stages
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: `${(progress.completedStagesCount / progress.totalStages) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">Status: {progress.status}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No students enrolled in this course.</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default MyStudentList;

