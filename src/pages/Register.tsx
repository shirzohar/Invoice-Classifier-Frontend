import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Login.css';
import { API_BASE_URL } from '../utils/fetchWithAuth';


export default function Register() {
  // Local state for form fields and error message
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Handles registration logic
  const handleRegister = async () => {
    setError('');
    
    // Check if passwords match
    if (password !== confirm) {
      setError('הסיסמאות לא תואמות');
      return;
    }

    try {
      // Send POST request to backend to register a new user
      const res = await fetch(`${API_BASE_URL}api/Auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      // If successful, redirect to login page
      if (res.ok) {
        navigate('/login');
      } else {
        const msg = await res.text();
        setError(msg || 'הרשמה נכשלה');
      }
    } catch {
      setError('שגיאת תקשורת עם השרת');
    }
  };

  return (
    <div className="login-banner">
      <div className="login-wrapper">
        <h2 className="login-title">הרשמה</h2>
        {error && <div className="login-error">{error}</div>}

        {/* Email input */}
        <div className="login-input-wrapper">
          <i className="fas fa-envelope"></i>
          <input
            className="login-input"
            placeholder="אימייל"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>

        {/* Password input */}
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

        {/* Password confirmation input */}
        <div className="login-input-wrapper">
          <i className="fas fa-lock"></i>
          <input
            type="password"
            className="login-input"
            placeholder="אישור סיסמה"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
          />
        </div>

        {/* Register button */}
        <button onClick={handleRegister} className="login-button">
          הירשם
        </button>

        {/* Link to login page */}
        <p className="login-footer">
          כבר יש לך משתמש?{' '}
          <Link className="login-link" to="/login">
            התחבר
          </Link>
        </p>
      </div>
    </div>
  );
}
