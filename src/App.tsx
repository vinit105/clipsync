// src/App.tsx
import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import VerticalNavbar from './components/Navbar'
import type { User } from 'firebase/auth'

import Login from './components/auth/LoginOrRegister'
import About from './components/About'
import Dashboard from './components/Dashboard'
import { Toaster } from './components/sonner'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase/firebase'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  if (loading) return <div className="text-center mt-20">Loading...</div>

  return (
    <>
      <Router>
         <div className="flex h-screen">
  <VerticalNavbar User={user} />
  <div className="ml-8   flex-1 overflow-hidden">
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="*" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute user={user}>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/about" element={<About />} />
    </Routes>
  </div>
</div>

</Router>


      <Toaster />
    </>
  )
}

export default App
