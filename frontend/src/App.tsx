import { Route, Routes } from 'react-router-dom';
import Home from './components/Home'
import Game from './components/Game';
import NotFound from './components/NotFound';
import EndGame from './components/EndGame';
import Account from './components/Account';

import { AuthProvider }from './utils/AuthContext';

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/play" element={<Game />} />
        <Route path="end-game" element={<EndGame />}/>
        <Route path="account" element={<Account />}/>
        <Route path="*" element={<NotFound />} />
      </Routes>
      {/* <div>
        <h1>App is rendering.</h1>
        <Game/>
      </div> */}
    </AuthProvider>
    
  );
};

export default App;