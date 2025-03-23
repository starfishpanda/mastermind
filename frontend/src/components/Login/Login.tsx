import { Button } from '../ui/button.js'
import { Input } from '../ui/input.js'
import { useNavigate } from 'react-router-dom'
import React, { useState, FormEvent } from 'react'
import axios, { AxiosError } from 'axios'
import { useAuth } from '../../utils/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      const response = await axios.post('/auth/login', {
        email,
        password,
      })
      const { token, user } = response.data.data
      login(token, user)
      navigate('/play')
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
        <h1 className="text-4xl font-bold text-center text-[#283F3B] mb-8">Log In</h1>
        {message && <div className="mb-4 p-2 text-center rounded bg-white">{message}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full"
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full"
          />
          <Button type="submit" className="w-full bg-[#659B5E] hover:bg-[#556F44] text-white">
            Log In
          </Button>
          <div className="flex space-x-4">
            <Button
              type="button"
              onClick={() => navigate('/forgot-password')}
              variant="outline"
              className="w-full bg-[#95BF74] text-[#283F3B] border-[#556F44] hover:bg-[#556F44] hover:text-white"
            >
              Forgot Password?
            </Button>
            <Button
              type="button"
              onClick={() => navigate('/')}
              variant="outline"
              className="w-full bg-[#95BF74] text-[#283F3B] border-[#556F44] hover:bg-[#556F44] hover:text-white"
            >
              Back to Home
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
