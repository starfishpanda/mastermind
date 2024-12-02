import {useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import guessCounter from '../utils/guessCounter';
import { GuessType } from '../types/GuessType';
import GuessHistory from './GuessHistory';
import { showLoginSuccessToast, showLoginUnsuccessfulToast, showLogoutSuccessToast} from '../utils/toasts';
import { z } from 'zod';
import AuthContext from '../utils/AuthContext';
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Card, CardHeader, CardTitle, CardContent } from './ui/card'
import { Bot } from 'lucide-react'



const Game = () => {
  const maxGuesses = 10;
  const [targetNumber,setTargetNumber] = useState<number[]>([]); // The random number fetched from the API
  const [currentGuess, setCurrentGuess] = useState<string>(''); // Setting the guess to be displayed in results so it doesn't change as user types new guess
  const [guessesCount, setGuessesCount] = useState(0); // Number of guesses left before the game ends
  const [guessHistory, setGuessHistory] = useState<GuessType[]>([]);
  const [targetNumberChecked, setTargetNumberChecked] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [allIncorrect, setAllIncorrect] = useState<boolean>(false);

  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);


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
        setTargetNumber(randomNumbersArray);
        console.log("random numbers array",randomNumbersArray);
      } catch (error){
        console.error('An error occurred fetching random numbers')
      }
      
    };

    fetchRandomNumbers();
    
  }, []);

  // Check random number fetched
  useEffect(() => {
    console.log("This is the random number fetched",targetNumber);
  },[targetNumber]);

  // Compare guess to random number answer fetched
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (currentGuess.length !== 4 || !/^\d+$/.test(currentGuess)) {
      return
    }
    setTargetNumberChecked(!targetNumberChecked);
    setAllIncorrect(false);

    setShowResults(false);

    const { digitsCorrect, positionsCorrect } = guessCounter(currentGuess,targetNumber);

    const newGuess: GuessType = {
      number: currentGuess,
      digitsCorrect,
      positionsCorrect,
    }
  
    setGuessesCount(prevGuessesCount => prevGuessesCount + 1);
    setCurrentGuess('')
    setGuessHistory(prevGuesses => [newGuess, ...prevGuesses]);
    
    // ** CHANGE THIS TO A MODAL INSTEAD OF PAGE NAVIGATION **
    // If numbers match, return Win
    if (newGuess.number === targetNumber.join('')){
      navigate('/end-game', {
        state: {endResult: true}
        
      });
    } else{
      setShowResults(true);
    }
  };

  return (
    <>
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

    <Card className="w-full max-w-2xl bg-gray-800 border-gray-700">
      <CardHeader className="border-b border-gray-700">
        <CardTitle className="text-2xl sm:text-3xl flex items-center gap-2 text-gray-100">
          Mastermind: Can you Read the Computer&apos;s RAM? <Bot className="w-6 h-6" />
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="flex gap-4 mb-6">
          <Input
            type="text"
            maxLength={4}
            pattern="\d*"
            value={currentGuess}
            onChange={(e) => setCurrentGuess(e.target.value)}
            placeholder="Enter a 4-digit number"
            className="bg-gray-700 border-gray-600 text-gray-100"
            disabled={gameOver}
          />
          <Button 
            type="submit" 
            disabled={currentGuess.length !== 4 || gameOver}
            variant="secondary"
          >
            Submit Guess
          </Button>
        </form>

        <div className="space-y-6 text-gray-100">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Results</h2>
            <p className="text-gray-400">Guesses Left: {maxGuesses-guessesCount}</p>
            {gameOver && (
              <p className="text-yellow-400">
                Game Over! The number was {targetNumber}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Guess History</h2>
            <div className="space-y-3">
              {guessHistory.map((guess, index) => (
                <div
                  key={index}
                  className="p-3 rounded-lg bg-gray-700 space-y-1"
                >
                  <p className="font-medium">Guess {guessHistory.length - index}: {guess.number}</p>
                  <p className="text-sm text-gray-400">
                    Correct Digits: {guess.digitsCorrect} | Correct Positions: {guess.positionsCorrect}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
    </>
  )
  // return(
    
  //   <>
  //   <h1>Mastermind: Can you Read the Computer's RAM? 🤖</h1>
  //   {/* Login and Logout Buttons */}
  //   { !isLoggedIn && (
  //     <button style={{ position: 'absolute', top: 35, right: 100 }} onClick={toggleLoginModal}>
  //     Login
  //     </button>
  //   )}

  //   { isLoggedIn && (
  //     <>
  //       <button style={{ position: 'absolute', top: 35, right: 200 }} onClick={() => navigate('/account')}>Account</button>
  //       <button style={{ position: 'absolute', top: 35, right: 100 }} onClick={handleLogout}>
  //       Logout
  //       </button>
  //     </>

  //   )}
    
  //     {/* Login Modal */}
  //     {isLoginModalOpen && (
  //       <div style={{
  //         position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
  //         backgroundColor: 'white', padding: '20px', zIndex: 1000
  //       }}>
  //         <form onSubmit={handleLogin}>
  //           <label>
  //             Email:
  //             <input type="email" name="email" required />
  //           </label>
  //           <label>
  //             Password:
  //             <input type="password" name="password" required />
  //           </label>
  //           <button type="submit">Log In</button>
  //           <button type="button" onClick={toggleLoginModal}>Close</button>
  //         </form>
  //       </div>
  //     )}

  //     <div style={{
  //       position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  //       backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 999
  //     }} onClick={toggleLoginModal} hidden={!isLoginModalOpen} />
      
  //   {/* Game Contents */}
  //   <form onSubmit={checkGuess}>
  //     <label htmlFor="numberInput">Enter a 4-digit Number:</label>
  //       <input
  //           type="text"
  //           id="textInput"
  //           value={guess}
  //           onChange={(e) => setGuess(e.target.value)}
  //           required // Makes sure the input is not empty
  //       />
  //     <button type="submit">Submit Guess</button>
  //   </form>
  //   <h3>Results</h3>
  //   <h3>Guesses Left: {maxGuesses - guessesCount} </h3>
    
  //   {allIncorrect && (<p>All digits incorrect.</p>)}
  //   { showResults && 
  //   (<>
  //   <p>Good try! For your guess <strong>{currentGuess}</strong>, you correctly guessed <strong>{digitsCorrect} digits</strong> in <strong>{positionsCorrect} positions</strong>.</p>
  //   {noGuessesLeft && (<p>The correct answer is <strong>{answer}</strong>. Refresh the page to play again 😃 </p>)}
  //   </>)}
    
  //   <h3>Guess History</h3>
  //     <GuessHistory guessHistory={guessHistory} />
  //   </>

    
    
  // ); 
};

export default Game;