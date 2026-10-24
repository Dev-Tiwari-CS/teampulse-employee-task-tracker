import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Inline SVG pulse/chart icon for the brand logo
function PulseIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M2 10h3l2-6 3 12 2-7 2 3 2-2h2" stroke="#fff" strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="container navbar-inner">
        <div className="brand" role="img" aria-label="TeamPulse">
          <div className="brand-logo" aria-hidden="true">
            <PulseIcon />
          </div>
          <div className="brand-text">
            <span className="brand-name">TeamPulse</span>
            <span className="brand-tagline">Task &amp; Productivity Platform</span>
          </div>
        </div>

        {user && (
          <div className="nav-right">
            <span className={`nav-role-pill ${user.role}`} aria-label={`Role: ${user.role}`}>
              {user.role}
            </span>
            <div className="nav-user-info" aria-label={`Signed in as ${user.name}`}>
              <div className="nav-user-name">{user.name}</div>
            </div>
            <button className="btn btn-sm" onClick={handleLogout} aria-label="Sign out">
              Sign out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
