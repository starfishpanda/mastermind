// Utility function to return correct number of digits and correct number of positions


const guessCounter = (guess: string,answer: number[]) => {
  const guessMetrics = {
    digitsCorrect: 0,
    positionsCorrect: 0
  };
  // Create frequency hash of numbers in answer
  const freqObj: {[key: number]: number} = {};
  answer.forEach((num: number) =>{
    if (freqObj[num] !== undefined) freqObj[num]++;
    else {
      freqObj[num] = 1;
    }
  })
  
  // Check for correct digits in correct position
  for (let i = 0; i < guess.length; i++ ){
    const guessDigit: number = parseInt(guess[i]);
    if (guessDigit === answer[i] && freqObj[guessDigit] > 0){
      freqObj[guessDigit]--;
      guessMetrics.digitsCorrect++;
      guessMetrics.positionsCorrect++;
    } 
    // Check for correct digit but not correct position
    else if (freqObj[guessDigit] && freqObj[guessDigit] > 0){
      freqObj[guessDigit]--;
      guessMetrics.digitsCorrect++;
    }
    // console.log(freqObj);
    // console.log('digits correct', guessMetrics.digitsCorrect)
    // console.log('positions correct', guessMetrics.positionsCorrect)
  }

  return guessMetrics;
};

export default guessCounter;