import { Button } from '../ui/button.js'
import { Input } from '../ui/input.js'
import { useNavigate, useParams } from 'react-router-dom'
import React, { useState, FormEvent } from 'react'
import axios, { AxiosError } from 'axios'

export default function ResetPassword() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const navigate = useNavigate()
  const { token } = useParams()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setMessage('Passwords do not match')
      return
    }

    try {
      console.log('Using token:', token)
      const response = await axios.post(`/auth/reset-password/${token}`, {
        password,
      })
      setMessage(response.data.message)
      setTimeout(() => navigate('/login'), 3000)
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
        <h1 className="text-4xl font-bold text-center text-[#283F3B] mb-8">Set New Password</h1>
        {message && <div className="mb-4 p-2 text-center rounded bg-white">{message}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full"
          />
          <Input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full"
          />
          <Button type="submit" className="w-full bg-[#659B5E] hover:bg-[#556F44] text-white">
            Set New Password
          </Button>
        </form>
      </div>
    </div>
  )
}
