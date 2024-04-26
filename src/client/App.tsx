import { Route, Routes } from 'react-router-dom';
import Game from './components/Game';
import NotFound from './components/NotFound';
import EndGame from './components/EndGame';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Game />} />
      <Route path="end-game" element={<EndGame />}/>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;