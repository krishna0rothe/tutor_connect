import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SlideBar } from '../components/dashboard/Slidebar';
import { MdUpdate } from "react-icons/md";
import { UpdateCourse } from '../components/dashboard/teacher/UpdateCourse';
import { FaLayerGroup } from "react-icons/fa6";
import { VscPreview } from "react-icons/vsc";
import { AddStageComponent } from '@/components/dashboard/teacher/AddStageComponent';
import { CoursePreview } from '@/components/dashboard/teacher/CoursePreview';

export const ManageCourseComponent: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('update');

  const sidebarItems = [
    { icon: <MdUpdate />, label: 'Update Course' },
    { icon: <FaLayerGroup />, label: 'Stages' },
    { icon: <VscPreview />, label: 'Preview Course' },
  ];

  const handleSidebarClick = (index: number) => {
    const sections = ['update', 'stages' , 'preview'];
    setActiveSection(sections[index]);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SlideBar items={sidebarItems} onItemClick={handleSidebarClick} />
      <main className="flex-1 p-8">
        <section>
          {activeSection === 'update' && <UpdateCourse courseId={courseId}  />}
          {activeSection === 'stages' && <AddStageComponent />}
          {activeSection === 'preview' && <CoursePreview />}
        </section>
      </main>
    </div>
  );
};

