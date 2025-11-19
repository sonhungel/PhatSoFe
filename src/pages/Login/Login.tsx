import { useState } from 'react';
import type { FormEvent } from 'react';
import './Login.css';
import { login } from '../../services/authService';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");

    // Add your login logic here
    try{
        const res = await login({username: email, password: password});

        // save token
        if(res.token)
        {
            localStorage.setItem("token", res.token);
        }
        // redirect or update UI
    }
    catch(err: any){
        setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Welcome Back</h2>
        {error && (
          <div className="error-message" style={{ 
            color: 'red', 
            backgroundColor: '#fee', 
            padding: '10px', 
            borderRadius: '4px', 
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">User Name</label>
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your User Name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="login-button">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
