import React, { useState } from 'react'
import { registerUser, loginUser } from '../../services/authServices' // ✅ adjust path if needed
import { showToast } from '../Toast' // optional if you want to show notifications

import { FirebaseError } from 'firebase/app'
import { useNavigate } from 'react-router-dom'

// 👇 Optional helper: map Firebase error codes to user-friendly messages
const getFriendlyError = (code: string): string => {
  switch (code) {
    case 'auth/user-not-found':
      return 'No user found with this email.'
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.'
    case 'auth/invalid-email':
      return 'Invalid email address.'
    case 'auth/email-already-in-use':
      return 'This email is already registered.'
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.'
    case 'auth/invalid-credential':
      return 'Invalid credentials. Please try again.'
    default:
      return 'Something went wrong. Please try again.'
  }
}
const Login = () => {
  
  const navigate = useNavigate()
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const getStrength = () => {
    if (password.length >= 12 && /[A-Z]/.test(password) && /[@#$%^&+=!]/.test(password)) return 'strong'
    if (password.length >= 8) return 'medium'
    return 'weak'
  }

  const strengthColor = {
    weak: 'bg-red-400 w-1/3',
    medium: 'bg-yellow-400 w-2/3',
    strong: 'bg-green-500 w-full',
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (mode === 'signup') {
        if (password !== confirmPassword) {
          showToast({title:'Passwords do not match!'})
          return
        }
       await registerUser(email, password)
        showToast?.({ title: 'Registered successfully!' })
         setMode('login')
         setEmail('')
         setPassword('')
         setConfirmPassword('')
        // console.log('Registered:', result.user)
      } else {
         await loginUser(email, password)
        showToast?.({ title: 'Logged in successfully!' })
         navigate('/dashboard')
          setEmail('')
         setPassword('')
         setConfirmPassword('')
       
        // console.log('Logged in:', result.user)
      }
    } catch (err: any) {
      
    let message = 'An error occurred.'
         if (err instanceof FirebaseError) {
      message = getFriendlyError(err.code)
    }

    showToast({title:`${message}`})
    console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-full max-h-max flex items-center justify-center bg-white mt-4">
      <div className="w-full max-w-sm p-8 rounded-xl bg-[#8ff3ce] shadow">
        <h2 className="text-2xl font-semibold text-center mb-6">
          ClipSync {mode === 'signup' ? 'Sign Up' : 'Login'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded"
            required
          />

          {mode === 'signup' && (
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              required
            />
          )}

          {mode === 'signup' && (
            <div className="mt-4">
              <p className="text-sm mb-1 text-gray-600">Password Strength:</p>
              <div className="w-full h-2 bg-gray-200 rounded">
                <div
                  className={`h-full rounded transition-all duration-300 ${strengthColor[getStrength()]}`}
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-60"
          >
            {loading ? 'Please wait...' : mode === 'signup' ? 'Sign Up' : 'Log In'}
          </button>
        </form>

        <div className="text-center mt-4 text-sm">
          {mode === 'signup' ? (
            <p>
              Already have an account?{' '}
              <button className="text-blue-700 underline" onClick={() => setMode('login')}>
                Log In
              </button>
            </p>
          ) : (
            <p>
              Don’t have an account?{' '}
              <button className="text-blue-700 underline" onClick={() => setMode('signup')}>
                Sign Up
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Login
