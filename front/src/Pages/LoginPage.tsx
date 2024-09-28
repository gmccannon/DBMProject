// src/Components/Login.tsx
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../Components/AuthContext'; // Ensure correct path

const Login: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext); // Access login function from context

    // State variables for form inputs
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');

    // Handler for form submission
    const handleLogin = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setError(''); // Reset error message

        try {
            const response = await axios.post('http://localhost:3001/login', {
                username,
                password,
            });

            const { token } = response.data;

            // Use the login function from AuthContext
            login(token);

            // Redirect after successful login
            navigate('/Shows');
        } catch (err: any) {
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('An unexpected error occurred.');
            }
        }
    };

    // Handler for navigating to the Register page
    const handleNavigateToRegister = (): void => {
        navigate('/register');
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Log In</h2>
            <form onSubmit={handleLogin} style={styles.form}>
                <div style={styles.inputGroup}>
                    <label htmlFor="username" style={styles.label}>Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        style={styles.input}
                    />
                </div>
                <div style={styles.inputGroup}>
                    <label htmlFor="password" style={styles.label}>Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={styles.input}
                    />
                </div>
                {error && <p style={styles.error}>{error}</p>}
                <button type="submit" style={styles.submitButton}>
                    Log In
                </button>
            </form>
            <p style={styles.registerPrompt}>
                Don't have an account?
                <button onClick={handleNavigateToRegister} style={styles.registerButton}>
                    Register
                </button>
            </p>
        </div>
    );
};

// Define styles using TypeScript's React.CSSProperties
const styles: { [key: string]: React.CSSProperties } = {
    container: {
        maxWidth: '400px',
        margin: '100px auto', // Center the container vertically with some top margin
        padding: '20px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        backgroundColor: '#f9f9f9',
        fontFamily: 'Courier New', // Consistent with TopBar
        textAlign: 'center',
    },
    title: {
        marginBottom: '20px',
        fontSize: '24px',
        color: '#333',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px', // Space between form elements
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'left',
    },
    label: {
        marginBottom: '5px',
        fontSize: '18px',
        color: '#555',
    },
    input: {
        padding: '10px',
        fontSize: '16px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        outline: 'none',
        transition: 'border-color 0.3s',
    },
    submitButton: {
        fontFamily: 'Courier New',
        fontSize: '20px',
        fontWeight: 600,
        padding: '10px 20px',
        backgroundColor: '#ADD8E6', // Light blue background
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        color: 'white',
        transition: 'background-color 0.3s',
    },
    registerPrompt: {
        marginTop: '20px',
        fontSize: '16px',
        color: '#333',
    },
    registerButton: {
        marginLeft: '10px',
        fontFamily: 'Courier New',
        fontSize: '16px',
        fontWeight: 600,
        padding: '5px 10px',
        backgroundColor: '#32CD32', // Lime green background
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        color: 'white',
        transition: 'background-color 0.3s',
    },
    error: {
        color: 'red',
        fontSize: '14px',
    },
};

export default Login;
