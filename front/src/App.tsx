import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from './Components/Header';
import BooksPage from './Pages/BooksPage';
import TopBar from './Components/TopBar';

function App() {
  return (
    <BrowserRouter>
        <TopBar />
        <Header />
        <Routes>
            <Route path="/" element={<BooksPage />}/>
        </Routes>
    </BrowserRouter>
    );
}

export default App;
