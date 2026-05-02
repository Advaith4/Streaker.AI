import { Link, useNavigate } from 'react-router-dom';
import { Home, Calendar, BookOpen, ArrowLeft } from 'lucide-react';
import '../dsa.css';

const DSANavbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="navbar" style={{ marginBottom: '2rem' }}>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <button onClick={() => navigate('/dashboard')} style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-muted)', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <ArrowLeft size={16} /> Back to Devtrack
        </button>
        <Link to="/dsa" className="nav-logo" style={{ textDecoration: 'none' }}>
          <BookOpen className="text-accent" />
          Java Companion
        </Link>
      </div>
      <div className="nav-links" style={{ display: 'flex', gap: '1.5rem' }}>
        <Link to="/dsa" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
          <Home size={18} /> Dashboard
        </Link>
        <Link to="/dsa/daily" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
          <Calendar size={18} /> Daily Plan
        </Link>
      </div>
    </nav>
  );
};

export default DSANavbar;
