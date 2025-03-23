// import React from 'react';
import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Box from '@mui/material/Box'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import GameRecords from './GameRecords.jsx'
import { useAuth } from '../utils/AuthContext.jsx'
import { showDeleteAccountSuccessToast } from '../utils/toasts.js'
import { Button } from './ui/button'

const Account = () => {
  const {
    // isLoggedIn,
    setIsLoggedIn,
    // showTimer,
    // setShowTimer,
    timeLimit,
    setTimeLimit,
    // currentTime,
    // setCurrentTime,
    user
  } = useAuth()
  const navigate = useNavigate()
  const [dropdownTime, setDropdownTime] = useState((timeLimit / 60000).toString())

  const handleTimeChange = (event: SelectChangeEvent) => {
    setDropdownTime(event.target.value) // Set time in number of minutes times milliseconds
    setTimeLimit(Number(event.target.value))
  }

  const handleDeleteAccount = async () => {
    try {
      await axios.delete('/api/delete-account')
      setIsLoggedIn(false)
      navigate('/')
      showDeleteAccountSuccessToast()
    } catch (error) {
      console.error('There was an error deleting the account', error)
    }
  }

  return (
    <div className="min-h-screen bg-[#99DDC8] p-4">
      <div className="flex justify-between items-center mb-4">
        <Button
          onClick={() => navigate('/')}
          variant="outline"
          className="bg-[#95BF74] text-[#283F3B] border-[#556F44] hover:bg-[#556F44] hover:text-white"
        >
          Home
        </Button>
        <Button
          onClick={() => navigate('/play')}
          variant="outline"
          className="bg-[#95BF74] text-[#283F3B] border-[#556F44] hover:bg-[#556F44] hover:text-white"
        >
          Play
        </Button>
      </div>

      <div className="bg-[#95BF74] border-4 border-[#556F44] rounded-lg shadow-xl p-8 max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-[#283F3B] mb-8">Account Details</h1>
        
        <div className="space-y-6">
          <div className="bg-white rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-[#283F3B] mb-4">Profile Information</h2>
            <div className="space-y-3">
              <p className="text-lg">
                <span className="font-semibold">Username:</span> {user?.username}
              </p>
              <p className="text-lg">
                <span className="font-semibold">Email:</span> {user?.email}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-[#283F3B] mb-4">Game Statistics</h2>
            <div className="space-y-3">
              <p className="text-lg">
                <span className="font-semibold">Games Played:</span> {user?.gamesPlayed || 0}
              </p>
              <p className="text-lg">
                <span className="font-semibold">Games Won:</span> {user?.gamesWon || 0}
              </p>
              <p className="text-lg">
                <span className="font-semibold">Win Rate:</span>{' '}
                {user?.gamesPlayed
                  ? `${((user?.gamesWon || 0) / user?.gamesPlayed * 100).toFixed(1)}%`
                  : '0%'}
              </p>
            </div>
          </div>

          <div className="flex justify-center space-x-4">
            <Button
              onClick={() => navigate('/play')}
              className="bg-[#659B5E] hover:bg-[#556F44] text-white"
            >
              Play Game
            </Button>
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="bg-[#95BF74] text-[#283F3B] border-[#556F44] hover:bg-[#556F44] hover:text-white"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Account
