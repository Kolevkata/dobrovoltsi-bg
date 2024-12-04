import logo from './logo.svg';
import './App.css';

// /src/App.js
import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
// import RegisterPage from './pages/RegisterPage';

// function App() {
//   return (
//     <Router>
//       <Navbar />
//       <Route path="/" exact component={HomePage} />
//       <Route path="/login" component={LoginPage} />
//       {/* <Route path="/register" component={RegisterPage} /> */}
//     </Router>
//   );
// }

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
