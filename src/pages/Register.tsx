import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Login.css';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    setError('');
    if (password !== confirm) {
      setError('הסיסמאות לא תואמות');
      return;
    }

    try {
      const res = await fetch('http://localhost:5095/api/Auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

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

        <button onClick={handleRegister} className="login-button">
          הירשם
        </button>

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
