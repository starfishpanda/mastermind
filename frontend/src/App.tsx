import { Route, Routes } from 'react-router-dom'
import Home from './components/Home.jsx'
import Game from './components/Game.jsx'
import NotFound from './components/NotFound.jsx'
import EndGame from './components/EndGame.jsx'
import Account from './components/Account.jsx'

import { AuthProvider } from './utils/AuthContext'

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/play" element={<Game />} />
        <Route path="end-game" element={<EndGame />} />
        <Route path="account" element={<Account />} />
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
