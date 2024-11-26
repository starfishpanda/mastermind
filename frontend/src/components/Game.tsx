import {useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import guessCounter from '../utils/guessCounter';
import { GuessHistoryType } from '../types/GuessHistoryType';
import GuessHistory from './GuessHistory';
import { showLoginSuccessToast, showLoginUnsuccessfulToast, showLogoutSuccessToast} from '../utils/toasts';
import { z } from 'zod';
import AuthContext from '../utils/AuthContext';


const Game = () => {
  const maxGuesses = 10;
  const [answer,setAnswer] = useState<number[]>([]); // The random number fetched from the API
  const [guess, setGuess] = useState<string>(''); // The user submitted guess
  const [localGuess, setLocalGuess] = useState<string>(''); // Setting the guess to be displayed in results so it doesn't change as user types new guess
  const [guessesCount, setGuessesCount] = useState(0); // Number of guesses left before the game ends
  const [digitsCorrect, setDigitsCorrect] = useState<number>(); // Number of correct digits in their guess
  const [positionsCorrect, setPositionsCorrect] = useState<number>(); // Number of correct digits in the correct position
  const [guessHistory, setGuessHistory] = useState<GuessHistoryType>([]);
  const [answerChecked, setAnswerChecked] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [noGuessesLeft, setNoGuessesLeft] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  // const [resultsMessage, setResultsMessage] = useState('');
  const [allIncorrect, setAllIncorrect] = useState<boolean>(false);

  const navigate = useNavigate();
  const toggleLoginModal = () => setIsLoginModalOpen(!isLoginModalOpen);

  // Sets login state and login modal
  const loginSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters"})
  })
  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const email = form.elements.namedItem('email') as HTMLInputElement;
    const password = form.elements.namedItem('password') as HTMLInputElement;
    try {
      // Validate form using Zod
      const result = loginSchema.parse({
        email: email.value,
        password: password.value
      });

      // Proceed with API call if Zod validation is successful
      const response = await axios.post('/api/user-login',{
        email: email.value,
        password: password.value
      });

      // Check if the login was successful
      if (response.status === 200 || response.status === 201) {
        // Assuming the server sends back a specific status for a successful login
        setIsLoggedIn(true);
        setIsLoginModalOpen(false);
        showLoginSuccessToast();
        console.log('Logged in successfully!');
      } 
    } catch (error){
      showLoginUnsuccessfulToast();
      console.error('An error occurred logging in.');
    }
  };

  // Logs out and shows success toast
  const handleLogout = async () => {
    try{
      const response = await axios.post('/api/user-logout');
      setIsLoggedIn(false);
      showLogoutSuccessToast();
    }catch(error){
      console.error('An error occurred logging out', error)
    }

  };
  // Random numbers are fetched on page load
  useEffect(()=> {

    const fetchRandomNumbers = async () => {

      try{
        const response = await axios.get('/api/get-random-numbers')
        const randomNumbersArray: number[] = response.data;
        setAnswer(randomNumbersArray);
        console.log("random numbers array",randomNumbersArray);
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
    <h1>Mastermind: Can you Read the Computer's RAM? 🤖</h1>
    {/* Login and Logout Buttons */}
    { !isLoggedIn && (
      <button style={{ position: 'absolute', top: 35, right: 100 }} onClick={toggleLoginModal}>
      Login
      </button>
    )}

    { isLoggedIn && (
      <>
        <button style={{ position: 'absolute', top: 35, right: 200 }} onClick={() => navigate('/account')}>Account</button>
        <button style={{ position: 'absolute', top: 35, right: 100 }} onClick={handleLogout}>
        Logout
        </button>
      </>

    )}
    
      {/* Login Modal */}
      {isLoginModalOpen && (
        <div style={{
          position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          backgroundColor: 'white', padding: '20px', zIndex: 1000
        }}>
          <form onSubmit={handleLogin}>
            <label>
              Email:
              <input type="email" name="email" required />
            </label>
            <label>
              Password:
              <input type="password" name="password" required />
            </label>
            <button type="submit">Log In</button>
            <button type="button" onClick={toggleLoginModal}>Close</button>
          </form>
        </div>
      )}

      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 999
      }} onClick={toggleLoginModal} hidden={!isLoginModalOpen} />
      
    {/* Game Contents */}
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