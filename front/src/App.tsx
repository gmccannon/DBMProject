import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TopBar from './Components/TopBar';
import BooksPage from './Pages/BooksPage';
import TVPage from './Pages/TVPage';
import MoviesPage from './Pages/MoviesPage';

function App() {
  return (
    <BrowserRouter>
        <TopBar />
        <Routes>
            <Route path="/" element={<MoviesPage />}/>
            <Route path="/TVShows" element={<TVPage />}/>
            <Route path="/Books" element={<BooksPage />}/>
        </Routes>
    </BrowserRouter>
    );
}

export default App;
