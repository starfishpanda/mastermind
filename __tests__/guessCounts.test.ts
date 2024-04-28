import guessCounter from '../src/client/utils/guessCounter';

describe('guessCounter', () => {
  const testAnswer = [4,5,4,4];
  // All digits wrong
  it('should return [0,0], all incorrect, when no digits match', () => {
    const guessMetrics = guessCounter('1111',testAnswer);
    const result = [guessMetrics.digitsCorrect,guessMetrics.positionsCorrect];
    expect(result).toEqual([0,0]);
  })
  //Correct digits, but in wrong position
  it('should return [2,0] when two numbers in the guess are in the answer, but not in the correct position]', () => {
    const guessMetrics = guessCounter('5422',testAnswer);
    const result = [guessMetrics.digitsCorrect,guessMetrics.positionsCorrect];
    expect(result).toEqual([2,0]);
  })
  //Correct digits, and correct position
  it('should return [3,3] when three numbers in the guess are in the answer, and in the correct position]', () => {
    const guessMetrics = guessCounter('4540',testAnswer);
    const result = [guessMetrics.digitsCorrect,guessMetrics.positionsCorrect];
    expect(result).toEqual([3,3]);
  })
  // Not over-counting
  it('should return [1,0] when a numbers from the guess is in the answer, and not increment when there are duplicates in the answer]', () => {
    const guessMetrics = guessCounter('5500',testAnswer);
    const result = [guessMetrics.digitsCorrect,guessMetrics.positionsCorrect];
    expect(result).toEqual([1,0]);
  })
})