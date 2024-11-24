import { useLocation } from 'react-router-dom';

const EndGame = () => {
  const location = useLocation();
  const { endResult } = location.state || {};
  return(
    <>
      <h1>{endResult ? 'Congratulations, you won! Please go back to play again' : 'Sorry, try again. Please go back to play again.'}</h1>
    </>
  )
};

export default EndGame;