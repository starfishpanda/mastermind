import {useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import guessCounter from '../utils/guessCounter';
import { GuessHistoryType } from '../types/types';
import { GuessHistory } from './GuessHistory'



const Game = () => {
  const maxGuesses = 10;
  const [answer,setAnswer] = useState<number[]>([]); // The random number fetched from the API
  const [guess, setGuess] = useState<string>(''); // The user submitted guess
  const [localGuess, setLocalGuess] = useState<string>('');
  const [guessesCount, setGuessesCount] = useState(0); // Number of guesses left before the game ends
  const [digitsCorrect, setDigitsCorrect] = useState<number>(); // Number of correct digits in their guess
  const [positionsCorrect, setPositionsCorrect] = useState<number>(); // Number of correct digits in the correct position
  const [guessHistory, setGuessHistory] = useState<GuessHistoryType>([]);
  const [answerChecked, setAnswerChecked] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [noGuessesLeft, setNoGuessesLeft] = useState<boolean>(false);
  // const [resultsMessage, setResultsMessage] = useState('');
  const [allIncorrect, setAllIncorrect] = useState<boolean>(false);

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

  // Compare guess to random number answer fetched
  const checkGuess = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAnswerChecked(!answerChecked);
    setAllIncorrect(false);
    // if (guess.length > 4){
    //   setResultsMessage(`Number is too long. Enter a 4-digit number.`);
    //   setShowResults(true);
    //   return;
    // }

    // setting guess locally render in guess results
    setLocalGuess(guess);
    setShowResults(false);

    const guessMetrics = guessCounter(guess,answer);
  
    setGuessesCount(prevGuessesCount => prevGuessesCount + 1);
    setDigitsCorrect(guessMetrics.digitsCorrect);
    setPositionsCorrect(guessMetrics.positionsCorrect);

    // Set Guess History
    setGuessHistory(prev => [...prev, [guess,guessMetrics.digitsCorrect,guessMetrics.positionsCorrect]]);
    
    // If numbers match, return Win
    if (guess === answer.join('')){
      navigate('/end-game', {
        state: {endResult: true}
      });
    } else{
      setShowResults(true);
    }
  };

  // useEffect to set showResults to true if digitsCorrect and positionsCorrect changes
  useEffect(()=>{
    // if (guess !== answer.join('') && guessesCount === 10){
      
    // }
    if (digitsCorrect === 0 && positionsCorrect === 0){
     
      setAllIncorrect(true);
      setShowResults(true);
    }
    else if (digitsCorrect !== undefined && positionsCorrect !== undefined){
      // setResultsMessage(`Good try! For your guess ${guess}, you correctly guessed ${digitsCorrect} digits in ${positionsCorrect} positions.`);
      
      setShowResults(true);
    }
    if (guessesCount === 10){
      setNoGuessesLeft(true);
    }
    
  },[digitsCorrect,positionsCorrect,answerChecked])


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
    <h3>Results</h3>
    <h3>Guesses Left: {maxGuesses - guessesCount} </h3>
    
    {allIncorrect && (<p>All digits incorrect.</p>)}
    { showResults && 
    (<>
    <p>Good try! For your guess <strong>{localGuess}</strong>, you correctly guessed <strong>{digitsCorrect} digits</strong> in <strong>{positionsCorrect} positions</strong>.</p>
    {noGuessesLeft && (<p>The correct answer is <strong>{answer}</strong>. Refresh the page to play again 😃 </p>)}
    </>)}
    
    <h3>Guess History</h3>
      <GuessHistory guessHistory={guessHistory} />
    </>

    
    
  ); 
};

export default Game;