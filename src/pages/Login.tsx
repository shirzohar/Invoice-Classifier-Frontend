import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setUsername } = useAuth();

  const handleLogin = async () => {
    setError('');
    try {
      const res = await fetch('https://localhost:7129/api/Auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        setError('אימייל או סיסמה שגויים');
        return;
      }

      const data = await res.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.email);
      setUsername(data.email);
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

        <div className="login-input-wrapper">
          <i className="fas fa-envelope"></i>
          <input
            className="login-input"
            placeholder="אימייל"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>

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

        <button onClick={handleLogin} className="login-button">
          התחבר
        </button>

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
