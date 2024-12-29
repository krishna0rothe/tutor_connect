import React from 'react'
import { motion } from 'framer-motion'
import { SlideBarItem } from './SlidebarItem'
import { PiUserCircleBold } from 'react-icons/pi'

interface SlideBarProps {
  items: { icon: React.ReactNode; label: string }[]
  onItemClick: (index: number) => void
}

export const SlideBar: React.FC<SlideBarProps> = ({ items, onItemClick }) => {
  return (
    <motion.div
      className="sticky top-0 flex flex-col h-screen w-16 md:w-64 bg-white shadow-lg"
      initial={{ x: -100 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Main navigation items at the top */}
      <div className="flex-1 pt-4">
        {items.map((item, index) => (
          <SlideBarItem
            key={index}
            icon={item.icon}
            label={item.label}
            onClick={() => onItemClick(index)}
          />
        ))}
      </div>

      {/* Profile at the bottom */}
      {/* <div className="border-t border-gray-200">
        <SlideBarItem
          icon={<PiUserCircleBold className="text-blue-600" />}
          label="Profile"
          onClick={() =>{}}
        /> 
      </div> */}
    </motion.div>
  )
}

