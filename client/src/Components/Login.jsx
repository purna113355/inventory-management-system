import { useState } from "react";
import "./Login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/login", {
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
        localStorage.setItem("token", data.access_token);
        window.location.reload();
      } else {
        setError(data.detail);
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Unable to connect to the server.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-heading">
          <h2>Welcome back</h2>
          <p>Sign in to continue to your dashboard</p>
        </div>

        <div className="login-form">
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
            className="login-button"
            onClick={handleLogin}
          >
            Sign In
          </button>

          {error && (
            <p className="login-error">
              {error}
            </p>
          )}
        </div>

        <div className="register-section">
          <span>Don't have an account?</span>

          <button
            className="register-button"
            type="button"
            onClick={() => {
              window.location.href = "/register";
            }}
          >
            Create an account
          </button>
        </div>

      </div>
    </div>
  );
}

export default Login;