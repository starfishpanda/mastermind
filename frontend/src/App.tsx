import { Route, Routes } from 'react-router-dom'
import Home from './components/Login/Home.js'
import Game from './components/Game.jsx'
import NotFound from './components/NotFound.jsx'
import EndGame from './components/EndGame.jsx'
import Account from './components/Account.jsx'

import { AuthProvider } from './utils/AuthContext'
import ResetPassword from './components/Login/ResetPassword.js'
import ForgotPassword from './components/Login/ForgotPassword.js'
import Login from './components/Login/Login.js'
import Signup from './components/Login/Signup.js'
import VerifyEmail from './components/Login/VerifyEmail'

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/play" element={<Game />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/end-game" element={<EndGame />} />
        <Route path="/account" element={<Account />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {/* <div>
        <h1>App is rendering.</h1>
        <Game/>
      </div> */}
    </AuthProvider>
  )
}

export default App
