import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import guessCounter from '../utils/guessCounter.js'
import { GuessType } from '../types/GuessType.js'
import {
  // showLoginSuccessToast,
  showLoginUnsuccessfulToast,
  showLogoutSuccessToast,
} from '../utils/toasts.js'
import { z } from 'zod'
import AuthContext from '../utils/AuthContext.jsx'
import { Input } from './ui/input.jsx'
import { Button } from './ui/button.jsx'
import { Card, CardHeader, CardTitle, CardContent } from './ui/card.jsx'
function Game() {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
  const [targetNumber, setTargetNumber] = useState<number[]>([]) // The random number fetched from the API
  const [currentGuess, setCurrentGuess] = useState<string>('') // Setting the guess to be displayed in results so it doesn't change as user types new guess
  const [guessesCount, setGuessesCount] = useState(0) // Number of guesses left before the game ends
  const [guessHistory, setGuessHistory] = useState<GuessType[]>([])
  const [targetNumberChecked, setTargetNumberChecked] = useState<boolean>(false)
  const [gameOver, setGameOver] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const maxGuesses = 10
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext)

  const navigate = useNavigate()
  const toggleLoginModal = () => setIsLoginModalOpen(!isLoginModalOpen)
  const closeLoginModal = () => setIsLoginModalOpen(false)
  // Sets login state and login modal
  const loginSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
  })
  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const email = form.elements.namedItem('email') as HTMLInputElement
    const password = form.elements.namedItem('password') as HTMLInputElement
    try {
      // Validate form using Zod
      const result = loginSchema.parse({
        email: email.value,
        password: password.value,
      })

      // Proceed with API call if Zod validation is successful
      const response = await axios.post('/api/user-login', {
        email: email.value,
        password: password.value,
      })

      // Check if the login was successful
      if (response.status === 200 || response.status === 201) {
        // Assuming the server sends back a specific status for a successful login
        setIsLoggedIn(true)
        setIsLoginModalOpen(false)
        // showLoginSuccessToast();
        console.log('Logged in successfully!')
      }
    } catch (error) {
      showLoginUnsuccessfulToast()
      console.error('An error occurred logging in.')
    }
  }

  // Logs out and shows success toast
  const handleLogout = async () => {
    try {
      const response = await axios.post('/api/user-logout')
      setIsLoggedIn(false)
      showLogoutSuccessToast()
    } catch (error) {
      console.error('An error occurred logging out', error)
    }
  }
  // Random numbers are fetched on page load
  useEffect(() => {
    const fetchRandomNumbers = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/get-random-numbers`)
        const randomNumbersArray: number[] = response.data
        setTargetNumber(randomNumbersArray)
        console.log('random numbers array', randomNumbersArray)
      } catch (error) {
        console.error('An error occurred fetching random numbers')
      }
    }

    fetchRandomNumbers()
  }, [])

  // Check random number fetched
  useEffect(() => {
    console.log('This is the random number fetched', targetNumber)
  }, [targetNumber])

  // Compare guess to random number answer fetched
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (currentGuess.length !== 4 || !/^\d+$/.test(currentGuess)) {
      return
    }
    setTargetNumberChecked(!targetNumberChecked)

    const { digitsCorrect, positionsCorrect } = guessCounter(currentGuess, targetNumber)

    const newGuess: GuessType = {
      number: currentGuess,
      digitsCorrect,
      positionsCorrect,
    }
    // ** CHANGE THIS TO A MODAL INSTEAD OF PAGE NAVIGATION **
    // If numbers match, return Win
    if (newGuess.number === targetNumber.join('')) {
      navigate('/end-game', {
        state: { endResult: true },
      })
      return
    }

    setGuessesCount((prevGuessesCount) => prevGuessesCount + 1)
    setCurrentGuess('')
    setGuessHistory((prevGuesses) => [newGuess, ...prevGuesses])
  }

  // End Game - change maxGuesses to be stateful with useContext in case user wants to change it in settings
  useEffect(() => {
    if (guessesCount >= maxGuesses) {
      navigate('/end-game', {
        state: { endResult: false },
      })
    }
  }, [guessesCount, maxGuesses])

  return (
    <div className="min-h-screen bg-[#99DDC8] flex items-center justify-center p-4">
      <div className="bg-[#95BF74] border-4 border-[#556F44] rounded-lg shadow-xl p-8 w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-center text-[#283F3B] mb-8">
          Mastermind
          <br />
          Can you Read the Computer&apos;s Mind?
        </h1>

        {/* Login/Logout buttons */}
        <div className="absolute top-4 right-4 space-x-4">
          {!isLoggedIn ? (
            // **Commmented out login until login security established**
            // <Button onClick={toggleLoginModal} variant="outline" className="bg-[#95BF74] text-[#283F3B] border-[#556F44] hover:bg-[#556F44] hover:text-white">
            //   Login
            // </Button>
            <Button
              variant="outline"
              className="bg-[#95BF74] text-[#283F3B] border-[#556F44] hover:bg-[#556F44] hover:text-white"
            >
              Login
            </Button>
          ) : (
            <>
              <Button
                onClick={() => navigate('/account')}
                variant="outline"
                className="bg-[#95BF74] text-[#283F3B] border-[#556F44] hover:bg-[#556F44] hover:text-white"
              >
                Account
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="bg-[#95BF74] text-[#283F3B] border-[#556F44] hover:bg-[#556F44] hover:text-white"
              >
                Logout
              </Button>
            </>
          )}
        </div>

        {/* Login Modal */}
        {isLoginModalOpen && (
          <>
            <div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              onClick={closeLoginModal}
            >
              <Card
                className="w-full max-w-md bg-[#95BF74] border-[#556F44]"
                onClick={(e) => e.stopPropagation()}
              >
                <CardHeader>
                  <CardTitle className="text-[#283F3B]">Login</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-[#283F3B]">
                        Email:
                      </label>
                      <Input
                        type="email"
                        id="email"
                        name="email"
                        required
                        className="bg-white text-[#283F3B] border-[#556F44]"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="password" className="text-[#283F3B]">
                        Password:
                      </label>
                      <Input
                        type="password"
                        id="password"
                        name="password"
                        required
                        className="bg-white text-[#283F3B] border-[#556F44]"
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button type="submit" className="bg-[#659B5E] hover:bg-[#556F44] text-white">
                        Log In
                      </Button>
                      <Button
                        type="button"
                        onClick={closeLoginModal}
                        variant="outline"
                        className="bg-[#95BF74] text-[#283F3B] border-[#556F44] hover:bg-[#556F44] hover:text-white"
                      >
                        Close
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {/* Game Content */}
        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <div className="flex flex-col items-center space-y-4">
            <Input
              type="text"
              maxLength={4}
              pattern="\d*"
              value={currentGuess}
              onChange={(e) => setCurrentGuess(e.target.value)}
              placeholder="Enter 4 digits"
              className="bg-white text-[#283F3B] border-[#556F44] w-48 text-center text-m transition-width duration-300 focus:w-64"
              disabled={gameOver}
            />
            <Button
              type="submit"
              disabled={currentGuess.length !== 4 || gameOver}
              className="bg-[#659B5E] hover:bg-[#556F44] text-white"
            >
              Submit Guess
            </Button>
          </div>
        </form>

        <div className="space-y-6 text-[#283F3B]">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Results</h2>
            <p>Guesses Left: {maxGuesses - guessesCount}</p>
            {gameOver && (
              <p className="text-[#556F44] font-bold text-[#EFEBCE]">
                Game Over! The number was <span className="underline">{targetNumber.join('')}</span>
                .
              </p>
            )}
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Guess History</h2>
            <div className="space-y-3">
              {guessHistory.map((guess, index) => (
                <div key={index} className="p-3 rounded-lg bg-[#659B5E] text-white space-y-1">
                  <p className="font-medium">
                    Guess {guessHistory.length - index}: {guess.number}
                  </p>
                  <p className="text-sm">
                    Correct Digits: {guess.digitsCorrect} | Correct Positions:{' '}
                    {guess.positionsCorrect}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Game
