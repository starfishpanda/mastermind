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
import AuthContext from '../utils/AuthContext.jsx'
import { showDeleteAccountSuccessToast } from '../utils/toasts.js'

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
  } = useContext(AuthContext)
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
    <>
      {/*Back to Game Button */}
      <button style={{ position: 'absolute', top: 20, right: 20 }} onClick={() => navigate('/')}>
        Back to Game
      </button>
      {/* List of Game Records */}
      <GameRecords />
      {/* Delete Account */}
      <button style={{ marginTop: 10 }} onClick={handleDeleteAccount}>
        Delete Account
      </button>

      {/* Timer Settings */}
      <Box sx={{ display: 'flex', justifyContent: 'left', width: '50%', paddingTop: 5 }}>
        <FormControl sx={{ width: '30%' }}>
          <InputLabel id="time-limit-select-label">Time Limit</InputLabel>
          <Select
            labelId="time-limit-select-label"
            id="time-limit-select"
            value={dropdownTime}
            label="Time Limit"
            onChange={handleTimeChange}
          >
            {Array.from({ length: 10 }, (_, i) => (
              <MenuItem key={i + 1} value={i + 1}>
                {i + 1} Minutes
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </>
  )
}

export default Account
