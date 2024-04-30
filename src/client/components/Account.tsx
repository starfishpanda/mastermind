import {useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { z } from 'zod';
import { GameRecords } from './GameRecords'

const navigate = useNavigate();
const Account = () => {

  return (
    <>
      {/*Back to Game Button */}
      <button style={{ position: 'absolute', top: 20, right: 20 }} onClick={() => navigate('/')}>Back to Game</button>
      {/*Back to Game Button */}
      <GameRecords />
    </>
    
  )

};

export default Account;