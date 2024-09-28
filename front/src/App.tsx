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

function App() {
    return (
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

              <Route path="/Movies/:mediaNumber" element={<MediaReviewPage mediaType={"Movies"} />} />
              <Route path="/Shows/:mediaNumber" element={<MediaReviewPage mediaType={"Shows"} />} />
              <Route path="/Books/:mediaNumber" element={<MediaReviewPage mediaType={"Books"} />} />
              <Route path="/Games/:mediaNumber" element={<MediaReviewPage mediaType={"Games"} />} />

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
    );
}

export default App;
