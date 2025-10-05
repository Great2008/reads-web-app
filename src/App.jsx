import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import AdminPanel from './pages/AdminPanel'
import AuthPage from './pages/AuthPage'
import { AuthProvider, useAuth } from './utils/authContext'
import ThemeToggle from './components/ThemeToggle'

function Protected({ children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to='/auth' />
  return children
}

export default function App(){
  return (
    <AuthProvider>
      <div className='min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors'>
        <div className='container mx-auto px-4 py-6'>
          <div className='flex justify-between items-center mb-6'>
            <h1 className='text-2xl font-bold'>$READS</h1>
            <ThemeToggle />
          </div>

          <Routes>
            <Route path='/' element={<Landing/>} />
            <Route path='/auth' element={<AuthPage/>} />
            <Route path='/dashboard' element={<Protected><Dashboard /></Protected>} />
            <Route path='/admin' element={<Protected><AdminPanel /></Protected>} />
          </Routes>
        </div>
      </div>
    </AuthProvider>
  )
}