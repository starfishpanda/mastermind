import { Button } from '../ui/button.js'
import { Input } from '../ui/input.js'
import { useNavigate } from 'react-router-dom'
import React, { useState, FormEvent } from 'react'
import axios, { AxiosError } from 'axios'

export default function Signup() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [verifyPassword, setVerifyPassword] = useState('')
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState<{
    username?: string
    email?: string
    password?: string
    verifyPassword?: string
  }>({})

  const navigate = useNavigate()

  const validateForm = () => {
    const newErrors: typeof errors = {}
    if (!username) newErrors.username = 'Username is required'
    if (!email) newErrors.email = 'Email is required'
    if (!password) newErrors.password = 'Password is required'
    if (password !== verifyPassword) {
      newErrors.verifyPassword = 'Passwords do not match'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      const response = await axios.post('/auth/signup', {
        username,
        email,
        password,
      })
      setMessage(response.data.message)
      if (response.status === 201) {
        setTimeout(() => navigate('/login'), 3000)
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        setMessage(error.response?.data?.message || 'An error occurred')
      } else {
        setMessage('An unexpected error occurred')
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#99DDC8] flex items-center justify-center p-4">
      <div className="bg-[#95BF74] border-4 border-[#556F44] rounded-lg shadow-xl p-8 w-full max-w-md">
        <h1 className="text-4xl font-bold text-center text-[#283F3B] mb-8">Sign Up</h1>
        {message && <div className="mb-4 p-2 text-center rounded bg-white">{message}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full"
            />
            {errors.username && <p className="text-red-600 text-sm">{errors.username}</p>}
          </div>
          <div>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
            />
            {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}
          </div>
          <div>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full"
            />
            {errors.password && <p className="text-red-600 text-sm">{errors.password}</p>}
          </div>
          <div>
            <Input
              type="password"
              placeholder="Verify Password"
              value={verifyPassword}
              onChange={(e) => setVerifyPassword(e.target.value)}
              className="w-full"
            />
            {errors.verifyPassword && (
              <p className="text-red-600 text-sm">{errors.verifyPassword}</p>
            )}
          </div>
          <Button type="submit" className="w-full bg-[#659B5E] hover:bg-[#556F44] text-white">
            Sign Up
          </Button>
          <Button
            type="button"
            onClick={() => navigate('/')}
            variant="outline"
            className="w-full bg-[#95BF74] text-[#283F3B] border-[#556F44] hover:bg-[#556F44] hover:text-white"
          >
            Back to Home
          </Button>
        </form>
      </div>
    </div>
  )
}
