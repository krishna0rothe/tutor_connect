import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {SlideBar} from './Slidebar'
import { PiMagnifyingGlassBold, PiBookOpenTextBold, PiBookmarkSimpleBold, PiCalendarCheckBold } from 'react-icons/pi'

const slideBarItems = [
  { icon: <PiMagnifyingGlassBold />, label: 'Find Tutor' },
  { icon: <PiBookOpenTextBold />, label: 'My Courses' },
  { icon: <PiBookmarkSimpleBold />, label: 'Saved Tutors' },
  { icon: <PiCalendarCheckBold />, label: 'Upcoming Sessions' },
]

export const StudentDashboard: React.FC = () => {
  const [activeComponent, setActiveComponent] = useState('Find Tutor')

  const handleSlideBarItemClick = (index: number) => {
    setActiveComponent(slideBarItems[index].label)
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100 text-gray-800 font-sans">
      <SlideBar items={slideBarItems} onItemClick={handleSlideBarItemClick} />
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-6 text-blue-800">Student Dashboard</h1>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeComponent}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            {activeComponent === 'Find Tutor' && "<FindTutor />"}
            {activeComponent === 'My Courses' && "<MyCourses />"}
            {activeComponent === 'Saved Tutors' && "<SavedTutors />"}
            {activeComponent === 'Upcoming Sessions' && "<StudentUpcomingSessions />"}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}

