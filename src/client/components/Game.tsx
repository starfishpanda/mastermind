import {useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import guessCounter from '../utils/guessCounter';



const Game = () => {
  const maxGuesses = 10;
  const [answer,setAnswer] = useState<number[]>([]); // The random number fetched from the API
  const [guess, setGuess] = useState<string>(''); // The user submitted guess
  const [guessesCount, setGuessesCount] = useState(0); // Number of guesses left before the game ends
  const [digitsCorrect, setDigitsCorrect] = useState(0); // Number of correct digits in their guess
  const [positionsCorrect, setPositionsCorrect] = useState(0); // Number of correct digits in the correct position
  const [showResults, setShowResults] = useState(false);
  const [resultsMessage, setResultsMessage] = useState('');

  const navigate = useNavigate();

  // Random numbers are fetched on page load
  useEffect(()=> {

    const fetchRandomNumbers = async () => {

      try{
        const response = await axios.get('/api/get-random-numbers')
        const randomNumbersArray: number[] = response.data;
        setAnswer(randomNumbersArray);
      } catch (error){
        console.error('An error occurred fetching random numbers')
      }
      
    };

    fetchRandomNumbers();
    
  }, []);
  // Check random number fetched
  useEffect(() => {
    console.log("This is the random number fetched",answer);
  },[answer]);

  const checkGuess = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setResultsMessage('');
    setShowResults(false);
    // End game if they have no guesses left
    if (guessesCount === 10){
      navigate('/end-game', {
        state: {endResult: false}
      });
    }
    // If numbers match, return Win
    if (guess === answer.join('')){
      navigate('/end-game', {
        state: {endResult: true}
      });
    }
    // Check for number of correct digits and positions
   
    const guessMetrics = guessCounter(guess,answer);
    setGuessesCount(prevGuessesCount => prevGuessesCount + 1);
    setDigitsCorrect(guessMetrics.digitsCorrect);
    setPositionsCorrect(guessMetrics.positionsCorrect);

    setResultsMessage(`Good try! For your guess ${guess}, you correctly guessed ${digitsCorrect} digits in ${positionsCorrect} positions.`);
    setShowResults(true);

  };

  // useEffect to set results message if showResults is positive
  
  // useEffect to set showResults to true if digitsCorrect and positionsCorrect changes
  // useEffect(()=>{
  //   setResultsMessage(`Good try! For your guess ${guess}, you correctly guessed ${digitsCorrect} digits in ${positionsCorrect} positions.`);
  //   setShowResults(true);
  // },[digitsCorrect,positionsCorrect])

  return(
    
    <>
    <h1>Mastermind: Can you Read the Computer's Mind? 🤖</h1>
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
    { showResults && 
    (<><h3>Results</h3>
    <p>{resultsMessage}</p>
    <h3>Guesses Left: {maxGuesses - guessesCount} </h3>
    </>)}
    
    <h3>Guess History</h3>
    </>

    
    
  ); 
};

export default Game;