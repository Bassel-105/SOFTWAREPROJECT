import React from 'react';
import Login from '../components/Login';

const LoginPage = () => {
  const handleLogin = async (data) => {
    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data), // Send username, password, and biometricImage
      });

      const result = await response.json();

      if (response.ok) {
        alert('Login successful');
        // Redirect to dashboard or another page
      } else {
        alert(result.message || 'Login failed');
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  return <Login onSubmit={handleLogin} />;
};

export default LoginPage;
