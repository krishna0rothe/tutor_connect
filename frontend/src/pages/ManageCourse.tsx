import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SlideBar } from '../components/dashboard/Slidebar';
import { MdUpdate } from "react-icons/md";
import { UpdateCourse } from '../components/dashboard/teacher/UpdateCourse';
import { FaLayerGroup } from "react-icons/fa6";
import { StageList } from '@/components/dashboard/teacher/StageList';
import { AddStageComponent } from '@/components/dashboard/teacher/AddStageComponent';

export const ManageCourseComponent: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('update');

  const sidebarItems = [
    { icon: <MdUpdate />, label: 'Update Course' },
    { icon: <FaLayerGroup />, label: 'Stages' },
  ];

  const handleSidebarClick = (index: number) => {
    const sections = ['update', 'stages'];
    setActiveSection(sections[index]);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SlideBar items={sidebarItems} onItemClick={handleSidebarClick} />
      <main className="flex-1 p-8">
        <section>
          {activeSection === 'update' && <UpdateCourse courseId={courseId}  />}
          {activeSection === 'stages' && <AddStageComponent />}
        </section>
      </main>
    </div>
  );
};

