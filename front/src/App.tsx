import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import TopBar from './Components/TopBar';

import TitlePage from './Pages/TitlePage';
import BooksPage from './Pages/BooksPage';
import TVPage from './Pages/TVPage';
import MoviesPage from './Pages/MoviesPage';
import GamesPage from './Pages/GamesPage';

import BooksReviewPage from './Pages/BooksReviewpage'; 
import MoviesReviewPage from './Pages/MoviesReviewPage';
import GamesReviewPage from './Pages/GamesReviewPage';
import TVShowsReviewPage from './Pages/TVShowReviewPage';

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

            <Route path="/Movies/:id" element={<MoviesReviewPage />}/>
            <Route path="/TVShows/:id" element={<TVShowsReviewPage />}/>
            <Route path="/Books/:id" element={<BooksReviewPage />}/>
            <Route path="/Games/:id" element={<GamesReviewPage />}/>
        </Routes>
    </BrowserRouter>
    );
}

export default App;
