import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Login.css';
import { API_BASE_URL } from '../utils/fetchWithAuth';


export default function Login() {
  // Local state for form fields and error message
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { setUsername } = useAuth(); // Updates global auth context after login

  // Handles login form submission
  const handleLogin = async () => {
    setError('');
    try {
      // Sends login request to backend API
      const res = await fetch(`${API_BASE_URL}/api/Auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        setError('אימייל או סיסמה שגויים');
        return;
      }

      const data = await res.json();

      // Save token and username in local storage
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.email);

      // Update global user context
      setUsername(data.email);

      // Redirect to dashboard after successful login
      navigate('/dashboard');
    } catch {
      setError('שגיאת תקשורת עם השרת');
    }
  };

  return (
    <div className="login-banner">
      <div className="login-wrapper">
        <h2 className="login-title">ברוך הבא</h2>
        {error && <div className="login-error">{error}</div>}

        {/* Email input field */}
        <div className="login-input-wrapper">
          <i className="fas fa-envelope"></i>
          <input
            className="login-input"
            placeholder="אימייל"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>

        {/* Password input field */}
        <div className="login-input-wrapper">
          <i className="fas fa-lock"></i>
          <input
            type="password"
            className="login-input"
            placeholder="סיסמה"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        {/* Login button */}
        <button onClick={handleLogin} className="login-button">
          התחבר
        </button>

        {/* Link to registration page */}
        <p className="login-footer">
          אין לך חשבון?{' '}
          <Link className="login-link" to="/register">
            הרשם
          </Link>
        </p>
      </div>
    </div>
  );
}
