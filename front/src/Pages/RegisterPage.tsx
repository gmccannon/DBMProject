// src/Components/Register.tsx
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../Components/AuthContext'; // Ensure correct path
import styled from 'styled-components';

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

const SubmitButton = styled.button`
    font-family: 'Courier New';
    font-size: 20px;
    font-weight: 600;
    padding: 10px 20px;
    background-color: #ADD8E6; // Light blue background
    border: none;
    border-radius: 5px;
    cursor: pointer;
    color: white;
    transition: background-color 0.3s;
`;

const Error = styled.p`
    color: red;
    font-size: 14px;
`;

const RegisterPrompt = styled.p`
    margin-top: 20px;
    font-size: 16px;
    color: #333;
`;

const RegisterButton = styled.button`
    margin-left: 10px;
    font-family: 'Courier New';
    font-size: 20px;
    font-weight: 600;
    padding: 5px 10px;
    background-color: #32CD32; // Lime green background
    border: none;
    border-radius: 5px;
    cursor: pointer;
    color: white;
    transition: background-color 0.3s;
`;

const Register: React.FC = () => {
    // use navigation method from react router
    const navigate = useNavigate();

    // use method to login the user from AuthContext component
    const { login } = useContext(AuthContext);

    // states
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');

    // function to handle navigate to login page
    const handleNavigateToLogin = (): void => {
        navigate('/login');
    };

    // function to add a new user into the database, then log in that user
    const handleRegister = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post('http://localhost:3001/register', {
                username,
                password,
            });

            const { token } = response.data;
            login(token);
            navigate('/Shows');
        } catch (err: any) {
            setError(err.response?.data?.message || 'An unexpected error occurred.');
        }
    };

    return (
        <Container>
            <Title>Register</Title>
            <Form onSubmit={handleRegister}>
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
                {error && <Error>{error}</Error>}
                <SubmitButton type="submit">Register</SubmitButton>
            </Form>
            <RegisterPrompt>
                Already have an account?
                <RegisterButton onClick={handleNavigateToLogin}>Login</RegisterButton>
            </RegisterPrompt>
        </Container>
    );
};

export default Register;
