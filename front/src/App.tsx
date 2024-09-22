import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TopBar from './Components/TopBar';
import BooksPage from './Pages/BooksPage';
import TVPage from './Pages/TVPage';
import MoviesPage from './Pages/MoviesPage';
import TitlePage from './Pages/TitlePage';
import GamesPage from './Pages/GamesPage';

function App() {
  return (
    <BrowserRouter>
        <TopBar />
        <Routes>
            <Route path="/" element={<TitlePage />}/>
            <Route path="/Movies" element={<MoviesPage />}/>
            <Route path="/TVShows" element={<TVPage />}/>
            <Route path="/Books" element={<BooksPage />}/>
            <Route path="/Games" element={<GamesPage />}/>
        </Routes>
    </BrowserRouter>
    );
}

export default App;
