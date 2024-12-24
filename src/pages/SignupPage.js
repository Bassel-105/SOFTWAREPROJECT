import React from 'react';
import Signup from '../components/Signup';

const SignupPage = () => {
  const handleSignup = async (data) => {
    try {
      const response = await fetch('http://localhost:3000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data), // Send email, password, and role
      });

      const result = await response.json();

      if (response.ok) {
        alert('Signup successful');
        // Redirect to login page or another page
      } else {
        alert(result.message || 'Signup failed');
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  return <Signup onSubmit={handleSignup} />;
};

export default SignupPage;
