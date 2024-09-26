// Login.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
    const navigate = useNavigate();

    // State variables for form inputs
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    // Handler for form submission
    const handleLogin = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();

        // TODO: Implement authentication logic here
        // Example:
        // authenticateUser(username, password)
        //   .then(() => {
        //     navigate('/Shows'); // Redirect after successful login
        //   })
        //   .catch((error) => {
        //     alert('Login failed: ' + error.message);
        //   });

        // For demonstration, we'll simply navigate to '/Shows'
        navigate('/Shows');
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
                <button type="submit" style={styles.submitButton}>
                    Log In
                </button>
            </form>
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
};

// Optional: Add hover effects using CSS classes or CSS-in-JS libraries
// Since inline styles don't support pseudo-classes like :hover directly,
// consider using CSS classes for hover effects.

export default Login;
