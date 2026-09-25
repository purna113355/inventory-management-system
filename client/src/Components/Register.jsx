import { useState } from "react";
import "./Register.css";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async () => {
    if (!username || !password) {
      setError("Username and password are required");
      setMessage("");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setMessage("");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Registration successful! You can now login.");
        setError("");
      } else {
        setError(data.detail || data.message);
        setMessage("");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setError("Unable to connect to the server.");
      setMessage("");
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">

        <div className="register-heading">
          <h2>Create your account</h2>
          <p>Register to access your inventory dashboard</p>
        </div>

        <div className="register-form">
          <label>Username</label>

          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <label>Password</label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            className="register-submit"
            onClick={handleRegister}
          >
            Create Account
          </button>

          {message && (
            <p className="register-success">
              {message}
            </p>
          )}

          {error && (
            <p className="register-error">
              {error}
            </p>
          )}
        </div>

        <div className="login-section">
          <span>Already have an account?</span>

          <button
            type="button"
            className="login-link"
            onClick={() => {
              window.location.href = "/";
            }}
          >
            Sign in
          </button>
        </div>

      </div>
    </div>
  );
}

export default Register;