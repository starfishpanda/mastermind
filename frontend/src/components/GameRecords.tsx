import axios from 'axios';
import {useState, useEffect } from 'react';

const GameRecords = () => {
  const [wins, setWins] = useState(0);
  const [losses, setLosses] = useState(0);
  const [favoriteNumber, setFavoriteNumber] = useState(null);

  // Fetch user's stats from database
  useEffect(() => {
    const fetchGameRecords = async () => {
      try{
        const response = await axios.get('/api/get-game-records');
        setWins(response.data.wins);
        setLosses(response.data.losses);
        setFavoriteNumber(response.data.favoriteNumber);
        return response.data;
      } catch(error){
        console.error("Failed to fetch game records", error);
      }
    };
    fetchGameRecords();
  });

  return (
    <>
      <h3>Game Records</h3>
        <div>
          <strong>Wins:</strong>{wins}<br />
          <strong>Losses:</strong>{losses}<br />
          <strong>Favorite Number:</strong>{favoriteNumber}<br />
        </div>
    </>
    
  );
};

export default GameRecords;