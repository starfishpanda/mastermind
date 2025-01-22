import { Request, Response, NextFunction } from 'express'
import axios from 'axios'

const randomNumberController = {
  getRandomNumbers: async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Fetch a 4-digit number from 0 to 7 in base 10, plain text format in a single column
      const response = await axios.get(
        'https://www.random.org/integers/?num=4&min=0&max=7&col=4&base=10&format=plain&rnd=new'
      )
      // Parse the random number string and turn it into a iterable array
      console.log(response)
      const randomNumbersArray = response.data.split('\t').map((char: string) => parseInt(char))

      // Convert to JSON before sending response
      return res.status(200).json(randomNumbersArray)
    } catch (error) {
      console.error(
        `randomNumberController.getRandomNumbers encountered an error fetching random numbers ${error}`
      )
      return next(error)
    }
  },
}

export default randomNumberController
