import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function PulseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M2 12h4l3-8 4 16 3-9 2 4 3-3h3" stroke="#fff" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    if (e) e.preventDefault();
    setError('');
    if (!email || !password) return setError('Please enter your email and password.');
    setLoading(true);
    try {
      const user = await login(email, password);
      navigate(user.role === 'admin' ? '/admin' : '/employee', { replace: true });
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  function fill(demoEmail) {
    setEmail(demoEmail);
    setPassword('password123');
  }

  return (
    <div className="auth-wrap">
      {/* ── Left panel ── */}
      <aside className="auth-panel" aria-hidden="true">
        <div className="auth-brand">
          <div className="auth-brand-icon">
            <PulseIcon />
          </div>
          <span className="auth-brand-name">TeamPulse</span>
        </div>

        <div className="auth-hero">
          <h1>
            Track work,<br />
            <span>move fast.</span>
          </h1>
          <p>
            A focused task management platform for teams. Admins assign and
            oversee; employees move their work forward, one status at a time.
          </p>
        </div>

        <div className="auth-demo">
          <div className="auth-demo-title">Try a demo account</div>
          <div className="auth-demo-grid">
            <button className="demo-btn" onClick={() => fill('dev@gmail.com')}>
              <span className="demo-role admin">Admin</span>
              dev@gmail.com
            </button>
            <button className="demo-btn" onClick={() => fill('aisha@demo.com')}>
              <span className="demo-role employee">Employee</span>
              aisha@demo.com
            </button>
            <button className="demo-btn" onClick={() => fill('ben@demo.com')}>
              <span className="demo-role employee">Employee</span>
              ben@demo.com
            </button>
          </div>
          <p style={{ marginTop: '.65rem', fontSize: '.75rem', color: 'rgba(255,255,255,.45)' }}>
            All demo accounts use password: <strong style={{ color: 'rgba(255,255,255,.65)' }}>password123</strong>
          </p>
        </div>
      </aside>

      {/* ── Right panel ── */}
      <main className="auth-form-side">
        <div className="auth-card">
          <div className="auth-card-header">
            <h2>Welcome back</h2>
            <p>Sign in to your TeamPulse account to continue.</p>
          </div>

          {error && (
            <div className="error-banner" role="alert">
              <span aria-hidden="true">⚠</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                className="input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                autoComplete="username"
                autoFocus
              />
            </div>
            <div className="field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                className="input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: '.5rem' }}
              disabled={loading}
            >
              {loading ? (
                <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Signing in…</>
              ) : (
                'Sign in'
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
