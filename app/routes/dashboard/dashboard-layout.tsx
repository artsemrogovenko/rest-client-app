import React from 'react'
import { Outlet } from 'react-router'

export default function DashboardLayout({children}: {children: React.ReactNode}) {
  return (
    <>
      <div>
        <Outlet />
      </div>
      {children}
    </>
  )
}
