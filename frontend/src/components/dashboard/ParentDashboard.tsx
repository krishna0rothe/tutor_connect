import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SlideBar } from './Slidebar'
import { PiChartLineUpBold, PiChatTextBold, PiCalendarCheckBold } from 'react-icons/pi'

const slideBarItems = [
  { icon: <PiChartLineUpBold />, label: 'Student Progress' },
  { icon: <PiChatTextBold />, label: 'Message Tutor' },
  { icon: <PiCalendarCheckBold />, label: 'Upcoming Events' },
]

export const ParentDashboard: React.FC = () => {
  const [activeComponent, setActiveComponent] = useState('Student Progress')

  const handleSlideBarItemClick = (index: number) => {
    setActiveComponent(slideBarItems[index].label)
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100 text-gray-800 font-sans">
      <SlideBar items={slideBarItems} onItemClick={handleSlideBarItemClick} />
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-6 text-blue-800">Parent Dashboard</h1>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeComponent}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            {activeComponent === 'Student Progress' && "<StudentProgress />"}
            {activeComponent === 'Message Tutor' && "<MessageTutor />"}
            {activeComponent === 'Upcoming Events' && "<ParentUpcomingEvents />"}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}

