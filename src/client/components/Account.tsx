import {useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { z } from 'zod';
import GameRecords from './GameRecords';
import { useAuth } from '../utils/AuthContext';
import { showDeleteAccountSuccessToast } from '../utils/toasts'

const Account = () => {
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const navigate = useNavigate();
    
  
  const handleDeleteAccount = async () => {
    try{
      await axios.delete('/api/delete-account');
      setIsLoggedIn(false);
      navigate('/');
      showDeleteAccountSuccessToast();
    }catch(error){
      console.error('There was an error deleting the account', error)
    }
  };

  return (
    <>
      {/*Back to Game Button */}
      <button style={{ position: 'absolute', top: 20, right: 20 }} onClick={() => navigate('/')}>Back to Game</button>
      {/* List of Game Records */}
      <GameRecords />
      {/* Delete Account */}
      <button onClick={handleDeleteAccount}>Delete Account</button>
      
    </>
    
  )

};

export default Account;