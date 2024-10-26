import React from 'react';
import logo from './logo.svg';
import './App.css';
import RecommendedBooks from './RecommendedBooks';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1 className="App-title">ReadY</h1>
      </header>
      <RecommendedBooks />
    </div>
  );
}

export default App;
