import {useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const Game = () => {
  const [answer,setAnswer] = useState([]); // The random number fetched from the API
  const [guess, setGuess] = useState<string>(''); // The user submitted guess
  const [guessesLeft, setGuessesLeft] = useState(10); // Number of guesses left before the game ends
  const [digitsCorrect, setDigitsCorrect] = useState(0); // Number of correct digits in their guess
  const [digitsPositionCorrect, setDigitsPositionCorrect] = useState(0); // Number of correct digits in the correct position
  const navigate = useNavigate();

  // Random numbers are fetched on page load
  useEffect(()=> {

    const fetchRandomNumbers = async () => {

      try{
        const response = await fetch('/api/get-random-numbers')
        const randomNumbersArray = await response.json();
        setAnswer(randomNumbersArray);
      } catch (error){
        console.error('An error occurred fetching random numbers')
      }
      
    };

    fetchRandomNumbers();
  });

  const checkGuess = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (guess === answer.join('')){
      navigate('/end-game', {
        state: {endgame: true}
      });
    }

  };


  return(
    
    <>
    <h1>Mastermind: Can you Read the Computer's Mind?</h1>
    <form onSubmit={checkGuess}>
      <label htmlFor="numberInput">Enter a 4-digit Number:</label>
        <input
            type="text"
            id="textInput"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            required // Makes sure the input is not empty
        />
      <button type="submit">Submit Guess</button>
    </form>
    </>

    
    
  ); 
};

export default Game;