// ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
    children: JSX.Element;
}

// component to protect a route. to use, wrap the route inside BrowserRouter (in App.tsx) with this component
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    // check if the user is logged in by retrieving the token from localStorage
    const token = localStorage.getItem('token');

    // if the user is not logged in, redirect them to the login page
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // render the children components (i.e., the protected content) if the user is logged in
    return children;
};

export default ProtectedRoute;
