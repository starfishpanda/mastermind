import React, { createContext, useState } from 'react'

interface AuthContextType {
  isLoggedIn: boolean
  setIsLoggedIn: (isLoggedIn: boolean) => void
  showTimer: boolean
  setShowTimer: (showTimer: boolean) => void
  timeLimit: number
  setTimeLimit: (timeLimit: number) => void
  currentTime: number
  setCurrentTime: (currentTime: number) => void
}

const defaultContextValue: AuthContextType = {
  isLoggedIn: false,
  setIsLoggedIn: () => {},
  showTimer: false,
  setShowTimer: () => {},
  timeLimit: 3 * 60 * 1000,
  setTimeLimit: () => {},
  currentTime: 3 * 60 * 1000,
  setCurrentTime: () => {},
}

const AuthContext = createContext<AuthContextType>(defaultContextValue)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showTimer, setShowTimer] = useState<boolean>(false)
  const [timeLimit, setTimeLimit] = useState<number>(3 * 60 * 1000)
  const [currentTime, setCurrentTime] = useState<number>(timeLimit)

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        showTimer,
        setShowTimer,
        timeLimit,
        setTimeLimit,
        currentTime,
        setCurrentTime,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
