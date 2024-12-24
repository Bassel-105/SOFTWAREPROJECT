import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState(""); // Email or username
  const [password, setPassword] = useState(""); // Password
  const [biometricImage, setBiometricImage] = useState(null); // Optional biometric image for login
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents the default form submission

    try {
      const response = await axios.post("http://localhost:3000/login", {
        username,
        password,
        biometricImage, // Optional biometric image for verification
      });

      alert(response.data.message); // Show success message from backend
      localStorage.setItem("token", response.data.token); // Store token in localStorage

      navigate("/dashboard"); // Redirect to dashboard or home page after successful login
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        alert(error.response.data.message); // Show error message from backend
      } else {
        alert("An error occurred during login.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Email or Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <input
        type="file"
        onChange={(e) => setBiometricImage(e.target.files[0])}
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
