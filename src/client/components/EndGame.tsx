import { useLocation } from 'react-router-dom';

const EndGame = () => {
  const location = useLocation();
  const { endResult } = location.state || {};
  return(
    <>
      <h1>{endResult ? 'Congratulations, you won!' : 'Sorry, try again'}</h1>
    </>
  )
};

export default EndGame;