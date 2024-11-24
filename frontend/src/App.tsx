import { Route, Routes } from 'react-router-dom';
import Game from './components/Game';
import NotFound from './components/NotFound';
import EndGame from './components/EndGame';
import Account from './components/Account';

import { AuthProvider }from './utils/AuthContext';

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Game />} />
        <Route path="end-game" element={<EndGame />}/>
        <Route path="account" element={<Account />}/>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
    
  );
};

export default App;