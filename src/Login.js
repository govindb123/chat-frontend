import { useState } from "react";
import "./Login.css";

function Login({ setToken }) {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = async () => {
    setError("");

    const url = isSignup
      ? "http://localhost:3000/signup"
      : "http://localhost:3000/login";

    const body = isSignup
      ? { auth: { name, email, password } }
      : { email, password };

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || data.errors?.[0] || "Something went wrong");
      return;
    }

    localStorage.setItem("token", data.token);
    setToken(data.token);
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h2>{isSignup ? "Create Account" : "Login"}</h2>

        {error && <div className="error-text">{error}</div>}

        {isSignup && (
          <input
            placeholder="Name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        )}

        <input
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <button onClick={submit}>
          {isSignup ? "Sign Up" : "Login"}
        </button>

        <p className="switch-text">
          {isSignup ? "Already have an account?" : "Don't have an account?"}
          <span onClick={() => setIsSignup(!isSignup)}>
            {isSignup ? " Login" : " Sign Up"}
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
