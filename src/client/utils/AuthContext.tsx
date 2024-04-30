import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';
import {showLogoutSuccessToast} from './toasts';

interface AuthContextType {
    isLoggedIn: boolean;
    setIsLoggedIn: (isLoggedIn: boolean) => void;
}

const defaultContextValue: AuthContextType ={
    isLoggedIn: false,
    setIsLoggedIn: () => {}
}

const AuthContext = createContext<AuthContextType>(defaultContextValue);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);



    return (
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
