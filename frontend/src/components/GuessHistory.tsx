import '../styles.css';


interface GuessHistoryProps {
  guessHistory: [string, number, number][];
}

const GuessHistory = ({ guessHistory }: GuessHistoryProps) => {

  return (
    <div>
      {guessHistory.slice().reverse().map((el,i) => {
        const [guess, correctDigits, positionsCorrect] = el;
        return(
          <div key={i} className="guessHistory">
            <strong>Guess {guessHistory.length - i}: {guess}</strong><br />
            Correct Number of Digits: {correctDigits}<br />
            Correction Number of Positions: {positionsCorrect}<br />
          </div>
        )
      })}
    </div>
    
  )
};

export default GuessHistory;