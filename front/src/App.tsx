// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import TopBar from './Components/TopBar';
import TitlePage from './Pages/TitlePage';
import MediaPage from './Pages/MediaPage';
import MediaReviewPage from './Pages/MediaReviewpage';
import Login from "./Pages/LoginPage";
import Register from "./Pages/RegisterPage";
import ProfilePage from './Pages/ProfilePage';
import UsersPage from './Pages/UsersPage';
import UserInfoPage from './Pages/UserInfoPage';
import ProtectedRoute from "./Components/ProtectedRoute";  // used to ensure the user is logged in 

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
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

              <Route path="/Movies/:mediaNumber" element={<MediaReviewPage mediaType={"Movies"} />} />
              <Route path="/Shows/:mediaNumber" element={<MediaReviewPage mediaType={"Shows"} />} />
              <Route path="/Books/:mediaNumber" element={<MediaReviewPage mediaType={"Books"} />} />
              <Route path="/Games/:mediaNumber" element={<MediaReviewPage mediaType={"Games"} />} />

              <Route path="/users" element={<UsersPage />} />
              <Route path="/users/:URLUserID" element={<UserInfoPage />} />

          </Routes>
      </BrowserRouter>
    );
}

export default App;
