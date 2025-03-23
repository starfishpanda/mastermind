import { Button } from '../ui/button.js'
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-[#99DDC8] flex items-center justify-center p-4">
      <div className="bg-[#95BF74] border-4 border-[#556F44] rounded-lg shadow-xl p-8 w-full max-w-md">
        <h1 className="text-4xl font-bold text-center text-[#283F3B] mb-8">
          Mastermind
          <br />
          <br />
          Can you Read the Computer&apos;s Mind?
        </h1>
        <div className="space-y-4">
          <Button
            className="w-full text-xl py-6 bg-[#659B5E] hover:bg-[#556F44] text-white"
            onClick={() => navigate('/play')}
          >
            Play
          </Button>
          <Button
            onClick={() => navigate('/signup')}
            variant="outline"
            className="w-full bg-[#95BF74] text-[#283F3B] border-[#556F44] hover:bg-[#556F44] hover:text-white"
          >
            Sign up
          </Button>
          <Button
            onClick={() => navigate('/login')}
            variant="outline"
            className="w-full bg-[#95BF74] text-[#283F3B] border-[#556F44] hover:bg-[#556F44] hover:text-white"
          >
            Log in
          </Button>
        </div>
      </div>
    </div>
  )
}
