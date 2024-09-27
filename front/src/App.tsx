// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import TopBar from './Components/TopBar';
import TitlePage from './Pages/TitlePage';
import MediaPage from './Pages/MediaPage';
import MediaReviewPage from './Pages/MediaReviewpage';
import Login from "./Components/login";
import Register from "./Components/register";
// import ProtectedRoute from "./Components/ProtectedRoute"; // Optional

import { AuthProvider } from './Components/AuthContext'; // Ensure correct path

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <TopBar />
                <Routes>
                    <Route path="/" element={<TitlePage />} />

                    <Route path="/Movies" element={<MediaPage mediaType={"Movies"} />} />
                    <Route path="/Shows" element={<MediaPage mediaType={"Shows"} />} />
                    <Route path="/Books" element={<MediaPage mediaType={"Books"} />} />
                    <Route path="/Games" element={<MediaPage mediaType={"Games"} />} />

                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    <Route path="/Movies/:id" element={<MediaReviewPage mediaType={"Movie"} />} />
                    <Route path="/Shows/:id" element={<MediaReviewPage mediaType={"Show"} />} />
                    <Route path="/Books/:id" element={<MediaReviewPage mediaType={"Book"} />} />
                    <Route path="/Games/:id" element={<MediaReviewPage mediaType={"Game"} />} />

                    {/* Example of a protected route (optional) */}
                    {/*
          <Route
            path="/protected"
            element={
              <ProtectedRoute>
                <ProtectedComponent />
              </ProtectedRoute>
            }
          />
          */}
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
