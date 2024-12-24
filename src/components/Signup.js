import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student"); // Default role set to 'student'
  const [biometricImage, setBiometricImage] = useState(null); // Optional biometric image
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3000/signup", {
        name,
        email,
        password,
        role,
        biometricImage, // Optional biometric image
      });

      alert(response.data.message); // Show success message from backend
      navigate("/login"); // Redirect to login page after successful signup
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        alert(error.response.data.message); // Show error message from backend
      } else {
        alert("An error occurred during signup.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="student">Student</option>
        <option value="instructor">Instructor</option>
        <option value="admin">Admin</option>
      </select>
      <input
        type="file"
        onChange={(e) => setBiometricImage(e.target.files[0])}
      />
      <button type="submit">Signup</button>
    </form>
  );
};

export default Signup;
