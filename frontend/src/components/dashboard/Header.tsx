import React from 'react'
import { UserCircle } from 'react-icons/hi'

interface HeaderProps {
  role: 'teacher' | 'student' | 'parent'
}

export function Header({ role }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 bg-gradient-to-r from-blue-500 to-teal-500 text-white p-4 flex justify-between items-center">
      <h2 className="text-2xl font-bold">{role.charAt(0).toUpperCase() + role.slice(1)} Dashboard</h2>
      <div className="flex items-center">
        <UserCircle className="w-8 h-8 mr-2" />
        <span>John Doe</span>
      </div>
    </header>
  )
}

