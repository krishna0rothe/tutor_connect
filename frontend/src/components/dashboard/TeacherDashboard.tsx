import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SlideBar } from './Slidebar'
import { PiStudentBold, PiChartLineUpBold, PiCalendarCheckBold, PiPlusBold, PiBooks } from 'react-icons/pi'
import { CreateCourse } from './teacher/CreateCourse'
import { CourseList } from './teacher/CourseList'

const slideBarItems = [
  { icon: <PiStudentBold />, label: 'My Students' },
  { icon: <PiChartLineUpBold />, label: 'Progress Report' },
  { icon: <PiCalendarCheckBold />, label: 'Upcoming Events' },
  { icon: <PiBooks />, label: 'My Courses' },
  { icon: <PiPlusBold />, label: 'Add Course' },
]

export const TeacherDashboard: React.FC = () => {
  const [activeComponent, setActiveComponent] = useState('My Students')

  const handleSlideBarItemClick = (index: number) => {
    setActiveComponent(slideBarItems[index].label)
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100 text-gray-800 font-sans">
      <SlideBar items={slideBarItems} onItemClick={handleSlideBarItemClick} />
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeComponent}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            {activeComponent === 'My Students' && "<MyStudents />"}
            {activeComponent === 'Progress Report' && "<ProgressReport />"}
            {activeComponent === 'Upcoming Events' && "<UpcomingEvents />"}
            {activeComponent === 'My Courses' && <CourseList />}
            {activeComponent === 'Add Course' && <CreateCourse />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}

