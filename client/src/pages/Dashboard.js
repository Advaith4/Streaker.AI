import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function Dashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  let currentUser = null;
  if (token) {
    try { currentUser = JSON.parse(atob(token.split(".")[1])); } catch (_) {}
  }

  useEffect(() => {
    if (!token) navigate("/");
  }, [token, navigate]);

  const firstName = currentUser?.name?.split(' ')[0] || 'there';

  const cards = [
    {
      icon: '📊',
      title: 'DSA Tracker',
      desc: 'View your progress by topic, recent solves, and heatmap overview.',
      cta: 'Open Dashboard →',
      path: '/dsa',
      color: '#60a5fa',
    },
    {
      icon: '⚡',
      title: "Today's Plan",
      desc: 'Get your customized daily problems and maintain your streak.',
      cta: 'Start Practice →',
      path: '/dsa/daily',
      color: '#10b981',
    },
    {
      icon: '👤',
      title: 'My Profile',
      desc: 'Review all your solved problems, saved code snippets, and notes.',
      cta: 'View Profile →',
      path: '/profile',
      color: '#c084fc',
    },
  ];

  return (
    <div className="app-shell">
      <Navbar />
      <div className="page">

        {/* Premium Hero Banner */}
        <div className="animate-fadeUp" style={{
          position: 'relative',
          padding: '3rem 2.5rem',
          borderRadius: '24px',
          background: 'linear-gradient(135deg, rgba(30,41,59,0.7) 0%, rgba(15,23,42,0.9) 100%)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
          overflow: 'hidden',
          marginBottom: '2.5rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start'
        }}>
          {/* Decorative Glows */}
          <div style={{ position: 'absolute', top: -100, right: -50, width: 300, height: 300, background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -100, left: -50, width: 250, height: 250, background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
          
          <div style={{ position: 'relative', zIndex: 10 }}>
            <h1 style={{ 
              fontSize: 'clamp(2rem, 4vw, 2.8rem)', 
              fontWeight: 800, 
              color: '#f8fafc',
              lineHeight: 1.2,
              marginBottom: '0.75rem',
              letterSpacing: '-0.02em'
            }}>
              Welcome back, <span style={{ background: 'linear-gradient(to right, #818cf8, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{firstName}</span>.
            </h1>
            <p style={{ fontSize: '1.05rem', color: '#94a3b8', maxWidth: '600px', lineHeight: 1.6, margin: 0 }}>
              Your DSA training environment is ready. Select your next objective to maintain your streak and build mastery.
            </p>
          </div>
        </div>

        {/* Premium Nav Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {cards.map((card, i) => (
            <div
              key={card.path}
              className={`animate-fadeUp delay-${i + 1}`}
              onClick={() => navigate(card.path)}
              style={{ 
                cursor: 'pointer', 
                position: 'relative',
                background: 'rgba(30,41,59,0.4)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '20px',
                padding: '2rem',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.border = `1px solid ${card.color}55`;
                e.currentTarget.style.boxShadow = `0 15px 30px ${card.color}22`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.border = '1px solid rgba(255,255,255,0.06)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ 
                width: '48px', height: '48px', 
                borderRadius: '12px', 
                background: `${card.color}15`, 
                border: `1px solid ${card.color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.5rem', marginBottom: '1.25rem',
                boxShadow: `inset 0 0 10px ${card.color}10`
              }}>
                {card.icon}
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f1f5f9', marginBottom: '0.6rem' }}>
                {card.title}
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: 1.6, flexGrow: 1, marginBottom: '1.5rem' }}>
                {card.desc}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', color: card.color, fontSize: '0.85rem', fontWeight: 600 }}>
                {card.cta}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default Dashboard;