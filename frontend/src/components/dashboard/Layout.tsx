import React from 'react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'

interface LayoutProps {
  children: React.ReactNode
  role: 'teacher' | 'student' | 'parent'
}

export function Layout({ children, role }: LayoutProps) {
  return (
    <div className="flex h-screen bg-white">
      <Sidebar role={role} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header role={role} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-white p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

