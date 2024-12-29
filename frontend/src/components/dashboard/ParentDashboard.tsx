import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SlideBar } from './Slidebar'
import { PiChartLineUpBold, PiChatTextBold, PiCalendarCheckBold } from 'react-icons/pi'
import { EventListComponent } from './student/EventListComponent'
import { useNavigate } from 'react-router-dom'
import ChatComponent from './parent/ChatComponent'
import StudentProgressComponent from './parent/StudentProgressComponent'
import ChatAttachment from './parent/ChatAttachment'

const slideBarItems = [
  { icon: <PiChartLineUpBold />, label: 'Student Progress' },
  { icon: <PiChatTextBold />, label: 'Message Tutor' },
  { icon: <PiCalendarCheckBold />, label: 'Upcoming Events' },
]

export const ParentDashboard: React.FC = () => {
  const [activeComponent, setActiveComponent] = useState('Student Progress')
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
            {activeComponent === 'Student Progress' && <StudentProgressComponent />}
            {activeComponent === 'Message Tutor' && <ChatAttachment />}
            {activeComponent === 'Upcoming Events' && <EventListComponent />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}

