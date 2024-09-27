// src/Components/AuthContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode'; // Named import

interface AuthContextType {
    isAuthenticated: boolean;
    username: string | null; // Changed from 'email' to 'username'
    login: (token: string) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    username: null,
    login: () => {},
    logout: () => {},
});

interface Props {
    children: ReactNode;
}

interface TokenPayload {
    id: number;
    username: string;
    // Add other fields if necessary
}

export const AuthProvider: React.FC<Props> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [username, setUsername] = useState<string | null>(null);

    // Function to handle login
    const login = (token: string) => {
        console.log('Attempting to login with token:', token);
        localStorage.setItem('token', token);
        try {
            const decoded = jwtDecode<TokenPayload>(token);
            setUsername(decoded.username);
            setIsAuthenticated(true);
            console.log('Login successful. Username:', decoded.username);
        } catch (error) {
            console.error('Invalid token:', error);
            setIsAuthenticated(false);
            setUsername(null);
        }
    };

    // Function to handle logout
    const logout = () => {
        console.log('Logging out...');
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setUsername(null);
    };

    // Check for token on app load
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            console.log('Token found in localStorage:', token);
            try {
                const decoded = jwtDecode<TokenPayload>(token);
                setUsername(decoded.username);
                setIsAuthenticated(true);
                console.log('Token valid. Username:', decoded.username);
            } catch (error) {
                console.error('Invalid token on load:', error);
                setIsAuthenticated(false);
                setUsername(null);
            }
        } else {
            console.log('No token found in localStorage.');
        }
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, username, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
