import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SlideBar } from './Slidebar'
import { PiStudentBold, PiChartLineUpBold, PiCalendarCheckBold, PiPlusBold, PiBooks, PiPencilBold } from 'react-icons/pi'
import { CreateCourse } from './teacher/CreateCourse'
import { CourseList } from './teacher/CourseList'
import { AddEventComponent } from './teacher/AddEventComponent'
import { useNavigate } from 'react-router-dom'
import TeacherProfileEdit from './teacher/TeacherProfileEdit'

const slideBarItems = [
  { icon: <PiStudentBold />, label: 'My Students' },
  { icon: <PiCalendarCheckBold />, label: 'Add Upcoming Events' },
  { icon: <PiBooks />, label: 'My Courses' },
  { icon: <PiPlusBold />, label: 'Add Course' },
  { icon: <PiPencilBold />, label: 'Edit Profile' },
]

export const TeacherDashboard: React.FC = () => {
  const [activeComponent, setActiveComponent] = useState('My Students')
  const navigate = useNavigate()

  const handleSlideBarItemClick = (index: number) => {
    setActiveComponent(slideBarItems[index].label)
  }

  const handleSignOut = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100 text-gray-800 font-sans">
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
            {activeComponent === 'My Students' && "<MyStudents />"}
            {activeComponent === 'Add Upcoming Events' && <AddEventComponent />}
            {activeComponent === 'My Courses' && <CourseList />}
            {activeComponent === 'Add Course' && <CreateCourse />}
            {activeComponent === 'Edit Profile' && <TeacherProfileEdit />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}

