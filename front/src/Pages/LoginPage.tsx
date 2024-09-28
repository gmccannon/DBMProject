// src/Components/Login.tsx
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../Components/AuthContext'; // Ensure correct path
import styled from 'styled-components';

// Styled components
const Container = styled.div`
    max-width: 400px;
    margin: 100px auto;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background-color: #f9f9f9;
    font-family: 'Courier New';
    text-align: center;
`;

const Title = styled.h2`
    margin-bottom: 20px;
    font-size: 24px;
    color: #333;
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 15px;
`;

const InputGroup = styled.div`
    display: flex;
    flex-direction: column;
    text-align: left;
`;

const Label = styled.label`
    margin-bottom: 5px;
    font-size: 18px;
    color: #555;
`;

const Input = styled.input`
    padding: 10px;
    font-size: 16px;
    border-radius: 4px;
    border: 1px solid #ccc;
    outline: none;
    transition: border-color 0.3s;
`;

const Button = styled.button`
    font-family: 'Courier New';
    font-size: 20px;
    font-weight: 600;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    color: white;
    transition: background-color 0.3s;

    &.submit {
        background-color: #ADD8E6; // Light blue background
    }

    &.register {
        margin-left: 10px;
        background-color: #32CD32; // Lime green background
    }
`;

const ErrorMessage = styled.p`
    color: red;
    font-size: 14px;
`;

const RegisterPrompt = styled.p`
    margin-top: 20px;
    font-size: 16px;
    color: #333;
`;

const Login: React.FC = () => {
    // use navigation method from react router
    const navigate = useNavigate();

    // use method to login the user from AuthContext component
    const { login } = useContext(AuthContext);

    // States
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');

    // Handler for form submission
    const handleLogin = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setError(''); // Reset error message

        try {
            const response = await axios.post('http://localhost:3001/login', { username, password });
            const { token } = response.data;
            login(token); // Use the login function from AuthContext
            navigate('/Shows'); // Redirect after successful login
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'An unexpected error occurred.';
            setError(errorMessage);
        }
    };

    return (
        <Container>
            <Title>Log In</Title>
            <Form onSubmit={handleLogin}>
                <InputGroup>
                    <Label htmlFor="username">Username:</Label>
                    <Input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </InputGroup>
                <InputGroup>
                    <Label htmlFor="password">Password:</Label>
                    <Input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </InputGroup>
                {error && <ErrorMessage>{error}</ErrorMessage>}
                <Button type="submit" className="submit">Log In</Button>
            </Form>
            <RegisterPrompt>
                Don't have an account?
                <Button onClick={() => navigate('/register')} className="register">Register</Button>
            </RegisterPrompt>
        </Container>
    );
};

export default Login;
