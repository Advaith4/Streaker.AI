import { useState, useEffect } from 'react';
import API from '../services/api';
import ActivityHeatmap from '../components/heatmap/ActivityHeatmap';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const DSADashboard = () => {
  const [history, setHistory] = useState([]);
  const [streakData, setStreakData] = useState({ currentStreak: 0, maxStreak: 0 });
  const [totalSolved, setTotalSolved] = useState(0);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => { fetchHistory(); }, []);

  const fetchHistory = async () => {
    try {
      const [statsRes, solvedRes] = await Promise.all([
        API.get('/problems/stats'),
        API.get('/problems/solved')
      ]);
      const { data } = statsRes;
      setHistory(data.heatmap || []);
      setStreakData({ currentStreak: data.streak || 0, maxStreak: data.bestStreak || 0 });
      setTotalSolved(data.totalSolved || 0);
      setSolvedProblems(solvedRes.data || []);
    } catch (error) {
      console.error('Failed to fetch history', error);
    } finally {
      setLoading(false);
    }
  };



  const groupByTopic = () => {
    const map = {};
    solvedProblems.forEach(p => { map[p.topic] = (map[p.topic] || 0) + 1; });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  };

  const topicBreakdown = groupByTopic();
  const maxCount = topicBreakdown[0]?.[1] || 1;

  if (loading) return (
    <div className="app-shell">
      <Navbar />
      <div className="loading-page">
        <div className="spinner" />
        <p>Loading your stats...</p>
      </div>
    </div>
  );

  return (
    <div className="app-shell">
      <Navbar />
      <div className="page">
        {/* Hero */}
        <div className="hero animate-fadeUp">
          <h1>🧠 DSA Tracker</h1>
          <p>Your personal DSA training engine — stay consistent, build mastery.</p>
          <button
            className="btn btn-accent animate-fadeUp delay-2"
            onClick={() => navigate('/dsa/daily')}
            style={{ margin: '1.5rem auto 0', fontSize: '1rem', padding: '0.75rem 2rem' }}
          >
            📅 Open Today's Plan →
          </button>
        </div>

        {/* Stat Cards */}
        <div className="stats-grid">
          <div className="card stat-card animate-fadeUp delay-1">
            <div className="stat-icon">🔥</div>
            <div className="stat-value">{streakData.currentStreak}</div>
            <div className="stat-label">Current Streak (days)</div>
          </div>
          <div className="card stat-card animate-fadeUp delay-2">
            <div className="stat-icon">🏆</div>
            <div className="stat-value">{streakData.maxStreak}</div>
            <div className="stat-label">Best Streak (days)</div>
          </div>
          <div className="card stat-card animate-fadeUp delay-3">
            <div className="stat-icon">✅</div>
            <div className="stat-value">{totalSolved}</div>
            <div className="stat-label">Total Solved</div>
          </div>
          <div className="card stat-card animate-fadeUp delay-4">
            <div className="stat-icon">📊</div>
            <div className="stat-value">{history.length}</div>
            <div className="stat-label">Active Days</div>
          </div>
        </div>

        {/* Heatmap Wrapper */}
        <div className="animate-fadeUp delay-2" style={{ marginTop: '2rem' }}>
          <ActivityHeatmap 
            data={history} 
            months={6} 
            totalSolved={totalSolved} 
            streak={streakData.currentStreak} 
            bestStreak={streakData.maxStreak} 
          />
        </div>

        {/* Topic Breakdown */}
        {topicBreakdown.length > 0 && (
          <div className="card animate-fadeUp delay-2" style={{ marginTop: '1.5rem' }}>
            <div className="section-title">📊 Progress by Topic</div>
            {topicBreakdown.map(([topic, count]) => (
              <div key={topic} style={{ marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem', fontSize: '0.875rem' }}>
                  <span>{topic}</span>
                  <span style={{ color: 'var(--muted)' }}>{count} solved</span>
                </div>
                <div className="progress-bar-track" style={{ margin: 0 }}>
                  <div className="progress-bar-fill" style={{ width: `${(count / maxCount) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Recent Activity */}
        {solvedProblems.length > 0 && (
          <div className="card animate-fadeUp delay-3" style={{ marginTop: '1.5rem' }}>
            <div className="section-title">📋 Recently Solved</div>
            {solvedProblems.slice(0, 7).map((p) => (
              <div key={p._id} className="user-list-item" style={{ padding: '0.75rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 600, color: '#f1f5f9', fontSize: '0.95rem' }}>{p.title}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '0.3rem' }}>
                    <span className="badge badge-topic" style={{ padding: '0.1rem 0.4rem', marginRight: '0.4rem' }}>{p.topic}</span>
                    {new Date(p.solvedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
                <span className="badge badge-easy">✓ Solved</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DSADashboard;
