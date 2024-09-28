// src/Components/AuthContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode'; // Named import

interface AuthContextType {
    isAuthenticated: boolean;
    username: string | null; // Changed from 'email' to 'username'
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

export const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    username: null,
    userID: null,
    login: () => {},
    logout: () => {},
});

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [username, setUsername] = useState<string | null>(null);
    const [userID, setUserID] = useState<number | null>(null);

    // Check for token on app load
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

    // Function to handle login
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

    // Function to handle logout
    const logout = () => {
        console.log('Logging out...');
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setUsername(null);
        setUserID(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, username, userID, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
