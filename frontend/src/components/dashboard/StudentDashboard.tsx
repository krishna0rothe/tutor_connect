import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlideBar } from './Slidebar';
import { PiMagnifyingGlassBold, PiBookOpenTextBold, PiBookmarkSimpleBold, PiCalendarCheckBold } from 'react-icons/pi';
import { StudentCourseViewComponent } from '../../pages/StudentCourseViewComponent';
import { FindTutorComponent } from './student/FindTutorComponent';
import { MyCoursesComponent } from './student/MyCoursesComponent';
import { EventListComponent } from './student/EventListComponent';
import { useNavigate } from 'react-router-dom';
import { SavedTutor } from './student/SavedTutor';

const slideBarItems = [
  { icon: <PiMagnifyingGlassBold />, label: 'Find Tutor' },
  { icon: <PiBookOpenTextBold />, label: 'My Courses' },
  { icon: <PiBookmarkSimpleBold />, label: 'Saved Tutors' },
  { icon: <PiCalendarCheckBold />, label: 'Upcoming Sessions' },
];

export const StudentDashboard: React.FC = () => {
  const [activeComponent, setActiveComponent] = useState('Find Tutor');
  const navigate = useNavigate();

  const handleSlideBarItemClick = (index: number) => {
    setActiveComponent(slideBarItems[index].label);
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="flex fle-col md:flex-row min-h-screen bg-gray-100 text-gray-800 font-sans">
      <SlideBar items={slideBarItems} onItemClick={handleSlideBarItemClick} />
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="flex justify-end mb-4">
          <button
            onClick={handleSignOut}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
          >
            Sign Out
          </button>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeComponent}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            {activeComponent === 'Find Tutor' && <FindTutorComponent />}
            {activeComponent === 'My Courses' && <MyCoursesComponent />}
            {activeComponent === 'Saved Tutors' && <SavedTutor />}
            {activeComponent === 'Upcoming Sessions' && <EventListComponent />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

