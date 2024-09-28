// src/Components/AuthContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode'; // Named import

interface AuthContextType {
    isAuthenticated: boolean;
    username: string | null;
    userID: number | null;
    login: (token: string) => void;
    logout: () => void;
}

interface AuthProviderProps {
    children: ReactNode;
}

interface TokenPayload {
    id: number;
    username: string;
}

// Creates an AuthContext with default values to provide authentication state and methods (login, logout)
// This allows other components to access authentication status and user data (username, userID)
export const AuthContext = createContext<AuthContextType>({
    // Default states and functions to be overridden by the context provider
    isAuthenticated: false,
    username: null,
    userID: null,
    login: () => {},  
    logout: () => {},
});

// Component that manages authentication state (e.g., whether a user is logged in or not) 
// Provides access to `login` and `logout` functions and user information (username, userID)
// State is updated on page load (via useEffect) and when the login or logout functions are invoked
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    // States for authentication, username, and userID
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [username, setUsername] = useState<string | null>(null);
    const [userID, setUserID] = useState<number | null>(null);

    // On page load, check if a token exists in localStorage and update the state accordingly
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            console.log('Token found in localStorage:', token);
            try {
                const decoded = jwtDecode<TokenPayload>(token);
                setUsername(decoded.username);
                setUserID(decoded.id);
                setIsAuthenticated(true);
                console.log('Token valid. Username:', decoded.username);
            } catch (error) {
                console.error('Invalid token on load:', error);
                setIsAuthenticated(false);
                setUsername(null);
                setUserID(null);
            }
        } else {
            console.log('No token found in localStorage.');
        }
    }, []);

    // function to handle login, sets authentaction state to true
    const login = (token: string) => {
        console.log('Attempting to login with token:', token);
        localStorage.setItem('token', token);
        try {
            const decoded = jwtDecode<TokenPayload>(token);
            setUsername(decoded.username);
            setUserID(decoded.id);
            setIsAuthenticated(true);
            console.log('Login successful. Username:', decoded.username);
        } catch (error) {
            console.error('Invalid token:', error);
            setIsAuthenticated(false);
            setUsername(null);
            setUserID(null);
        }
    };

    // function to handle logout, sets authentaction state to false
    const logout = () => {
        console.log('Logging out...');
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setUsername(null);
        setUserID(null);
    };

    // The provider passes the authentication state (isAuthenticated, username, userID)
    // and the login/logout functions to any child component that consumes the AuthContext
    return (
        <AuthContext.Provider value={{ isAuthenticated, username, userID, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
