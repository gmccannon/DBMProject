import React from 'react';
import logo from './logo.svg';
import './App.css';

function App(): React.JSX.Element {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p style={{fontSize: "200px"}}>
         AI
        </p>
      </header>
    </div>
  );
}

export default App;
