import React from 'react'
import { motion } from 'framer-motion'

interface SlideBarItemProps {
  icon: React.ReactNode
  label: string
  onClick: () => void
}

export const SlideBarItem: React.FC<SlideBarItemProps> = ({ icon, label, onClick }) => {
  return (
    <motion.div
      className="flex items-center px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      <div className="text-xl text-blue-600">{icon}</div>
      <span className="ml-4 text-sm text-gray-700 font-medium hidden md:inline">{label}</span>
    </motion.div>
  )
}

