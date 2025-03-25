import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios, { AxiosError } from 'axios'

export default function VerifyEmail() {
  const [message, setMessage] = useState('Verifying your email...')
  const navigate = useNavigate()
  const { token } = useParams()

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axios.get(`/auth/verify-email/${token}`)
        setMessage(response.data.message)
        // Redirect to login page after 3 seconds
        setTimeout(() => navigate('/login'), 3000)
      } catch (error) {
        if (error instanceof AxiosError) {
          setMessage(error.response?.data?.message || 'Verification failed')
        } else {
          setMessage('An unexpected error occurred')
        }
      }
    }

    verifyEmail()
  }, [token, navigate])

  return (
    <div className="min-h-screen bg-[#99DDC8] flex items-center justify-center p-4">
      <div className="bg-[#95BF74] border-4 border-[#556F44] rounded-lg shadow-xl p-8 w-full max-w-md">
        <h1 className="text-4xl font-bold text-center text-[#283F3B] mb-8">Email Verification</h1>
        <div className="mb-4 p-2 text-center rounded bg-white">{message}</div>
      </div>
    </div>
  )
}
