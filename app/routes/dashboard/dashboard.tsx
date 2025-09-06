import React from 'react'
import { Outlet } from 'react-router'
import useAuth from '~/contexts/auth/useAuth';

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) {
    return <div>Loading...</div>;
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-60 bg-gray-200">
      <Outlet />
      <div className="text-xl font-semibold mt-4">Dashboard</div>
      <div>
        <div>Welcome back, {user.email}!</div>
      </div>
    </div>
  )
}
