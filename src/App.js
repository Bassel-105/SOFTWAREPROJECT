import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

const App = () => {
  const handleLogin = async (data) => {
    console.log('Logging in with:', data);
  };

  const handleSignup = async (data) => {
    console.log('Signing up with:', data);
  };

  return (
    <Router>
      <div>
        <nav>
          <h1>Welcome to the Quiz App!</h1>
          {/* Add links to navigate to login and signup */}
          <div>
            <Link to="/login">
              <button>Go to Login</button>
            </Link>
            <Link to="/signup">
              <button>Go to Sign Up</button>
            </Link>
          </div>
        </nav>
        <Routes>
          <Route path="/login" element={<LoginPage onSubmit={handleLogin} />} />
          <Route path="/signup" element={<SignupPage onSubmit={handleSignup} />} />
          <Route path="/" element={<h1>Welcome to the Quiz App!</h1>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
