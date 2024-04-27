// Utility function to return correct number of digits and correct number of positions


const guessCounter = (guess: string,answer: number[]) => {
  const guessMetrics = {
    digitsCorrect: 0,
    positionsCorrect: 0
  };
  for (let i = 0; i < guess.length; i++ ){
    const guessDigit: number = parseInt(guess[i]);
    if (guessDigit === answer[i]){
      guessMetrics.digitsCorrect++;
      guessMetrics.positionsCorrect++;
    } 
    else if (answer.includes(guessDigit)){
      guessMetrics.digitsCorrect++;
    }
  }
  // console.log(guessMetrics.digitsCorrect)
  // console.log(guessMetrics.positionsCorrect)
  return guessMetrics;
};

export default guessCounter;