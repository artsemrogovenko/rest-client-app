import React from 'react'
import { Outlet } from 'react-router'

export default function Dashboard() {
  return (
    <div className="flex flex-col items-center justify-center min-h-60 bg-gray-200">
      <Outlet />
      <div className="text-xl font-semibold mt-4">Dashboard</div>
      <div>
        <div>Welcome back, !</div>
      </div>
    </div>
  )
}
