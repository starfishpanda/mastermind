import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from './ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card.jsx'
import { Trophy, Frown } from 'lucide-react'

const EndGame = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { endResult } = location.state || {}

  const handlePlayAgain = () => {
    navigate('/play')
  }

  const handleGameStats = () => {
    // TODO: Implement game stats functionality
    console.log('Game Stats button clicked')
  }

  return (
    <div className="min-h-screen bg-[#99DDC8] flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-[#95BF74] border-4 border-[#556F44] rounded-lg shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-[#283F3B]">
            {endResult ? 'Congratulations!' : 'Game Over'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            {endResult ? (
              <Trophy className="w-24 h-24 text-[#659B5E]" />
            ) : (
              <Frown className="w-24 h-24 text-[#556F44]" />
            )}
          </div>
          <p className="text-xl text-center text-[#283F3B]">
            {endResult
              ? 'You guessed the correct number!'
              : 'Sorry, you ran out of guesses. Better luck next time!'}
          </p>
          <div className="flex flex-col space-y-4">
            <Button
              onClick={handlePlayAgain}
              className="w-full bg-[#659B5E] hover:bg-[#556F44] text-white"
            >
              Play Again
            </Button>
            <Button
              onClick={handleGameStats}
              variant="outline"
              className="w-full bg-[#95BF74] text-[#283F3B] border-[#556F44] hover:bg-[#556F44] hover:text-white"
            >
              Game Stats
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default EndGame
