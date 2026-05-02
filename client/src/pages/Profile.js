import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";
import ActivityHeatmap from "../components/heatmap/ActivityHeatmap";
import { toast } from "react-toastify";


// GFG via Google site search — reliably finds the exact GFG article
// eslint-disable-next-line no-unused-vars
const gfgUrl = (p) => p.gfgUrl || `https://www.google.com/search?q=site:geeksforgeeks.org+${encodeURIComponent(p.title)}`;

function Profile() {
  const [user, setUser]           = useState(null);
  const [history, setHistory]     = useState([]);
  const [streakData, setStreakData] = useState({ currentStreak: 0, maxStreak: 0 });
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [expandedSection, setExpandedSection] = useState('notes'); // 'notes' or 'code'
  const [loading, setLoading]     = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) { navigate("/"); return; }
    Promise.all([
      API.get("/users/me"),
      API.get("/problems/stats"),
      API.get("/problems/solved"),
    ]).then(([userRes, statsRes, solvedRes]) => {
      setUser(userRes.data);
      // Stats endpoint returns { heatmap: [{date, count}], streak, bestStreak, totalSolved }
      setHistory(statsRes.data.heatmap || []);
      setStreakData({
        currentStreak: statsRes.data.streak || 0,
        maxStreak: statsRes.data.bestStreak || 0
      });
      setSolvedProblems(solvedRes.data);
    }).catch(() => toast.error("Failed to load profile"))
      .finally(() => setLoading(false));
  }, [token, navigate]);

  const handleLogout = () => { localStorage.removeItem("token"); navigate("/"); };

  if (loading) return (
    <div className="app-shell">
      <Navbar />
      <div className="loading-page"><div className="spinner" /><p>Loading profile...</p></div>
    </div>
  );

  return (
    <div className="app-shell">
      <Navbar />
      <div className="page">

        {/* ── Profile Header ── */}
        <div className="lc-profile-header card animate-fadeUp">
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div className="profile-avatar" style={{ margin: 0, flexShrink: 0 }}>
              {user ? (user.name || user.email || 'U')[0].toUpperCase() : '?'}
            </div>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.2rem' }}>{user?.name}</h2>
              <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '0.75rem' }}>{user?.email}</p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span className="badge badge-topic" style={{ textTransform: 'capitalize' }}>{user?.role}</span>
                <span className="badge badge-easy">Active</span>
              </div>
            </div>
            <button className="btn btn-ghost" onClick={handleLogout} style={{ fontSize: '0.85rem' }}>
              Logout
            </button>
          </div>

          {/* Stat row */}
          <div className="lc-stats-row">
            <div className="lc-stat">
              <div className="lc-stat-num" style={{ color: '#f59e0b' }}>{streakData.currentStreak}</div>
              <div className="lc-stat-label">🔥 Current Streak</div>
            </div>
            <div className="lc-stat-divider" />
            <div className="lc-stat">
              <div className="lc-stat-num" style={{ color: '#a78bfa' }}>{streakData.maxStreak}</div>
              <div className="lc-stat-label">🏆 Best Streak</div>
            </div>
            <div className="lc-stat-divider" />
            <div className="lc-stat">
              <div className="lc-stat-num" style={{ color: '#34d399' }}>
                {solvedProblems.length}
                <span style={{ fontSize: '0.9rem', color: 'var(--muted)', fontWeight: 500 }}>/450</span>
              </div>
              <div className="lc-stat-label">✅ Total Solved</div>
            </div>
            <div className="lc-stat-divider" />
            <div className="lc-stat">
              <div className="lc-stat-num" style={{ color: '#60a5fa' }}>{history.length}</div>
              <div className="lc-stat-label">📅 Active Days</div>
            </div>
          </div>

          {/* Overall progress bar */}
          {(() => {
            const pct = Math.round((solvedProblems.length / 450) * 100);
            const remaining = 450 - solvedProblems.length;
            return (
              <div style={{ marginTop: '1.25rem', padding: '1rem 1.25rem', background: 'rgba(16,185,129,0.06)', borderRadius: '10px', border: '1px solid rgba(16,185,129,0.15)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                    🎯 FINAL 450 Progress
                  </span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
                    {pct}% · {remaining > 0 ? `${remaining} problems to go` : '🏆 Complete!'}
                  </span>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '999px', height: '10px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${pct}%`, height: '100%',
                    background: 'linear-gradient(90deg, #10b981, #34d399)',
                    borderRadius: '999px',
                    transition: 'width 0.8s ease',
                    boxShadow: '0 0 8px rgba(16,185,129,0.5)'
                  }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.4rem' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>0</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>450 problems</span>
                </div>
              </div>
            );
          })()}
        </div>

        {/* ── Overview Heatmap ── */}
        <div className="animate-fadeUp delay-1">
          <div style={{ marginBottom: '1.5rem' }}>
            <ActivityHeatmap 
              data={history} 
              months={5} 
              totalSolved={solvedProblems.length} 
              streak={streakData.currentStreak} 
              bestStreak={streakData.maxStreak} 
            />
          </div>
        </div>

        {/* ── All Solved Problems ── */}
        <div className="animate-fadeUp delay-2" style={{ marginTop: '2rem' }}>
          <h3 style={{ marginBottom: '1.25rem', fontSize: '1.2rem', fontWeight: 800 }}>📋 Solved Problems</h3>
          {solvedProblems.length === 0 ? (
            <div className="card empty-state">
              <div className="empty-state-icon">📭</div>
              <p>No solved problems yet. Start your daily plan!</p>
              <button className="btn btn-accent" style={{ marginTop: '1rem' }} onClick={() => navigate('/dsa/daily')}>
                Go to Daily Plan →
              </button>
            </div>
          ) : (
              <>
                <p style={{ color: 'var(--muted)', marginBottom: '1rem', fontSize: '0.875rem' }}>
                  {solvedProblems.length} problems solved · Click a problem to review your solution
                </p>
                {solvedProblems.map((p) => (
                  <div key={p._id} className="card solved-review-card" style={{ marginBottom: '0.75rem' }}>
                    {/* Problem row */}
                    <div
                      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                      onClick={() => setExpandedId(expandedId === p._id ? null : p._id)}
                    >
                      <div>
                        <div style={{ fontWeight: 700, marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', fontSize: '0.95rem' }}>
                          <span style={{ color: 'var(--green)' }}>✓</span>
                          <span>{p.title}</span>
                          <a href={gfgUrl(p)} target="_blank" rel="noopener noreferrer"
                            style={{ textDecoration: 'none' }} onClick={(e) => e.stopPropagation()}>
                            <span style={{ background: '#2f8d46', color: 'white', fontSize: '0.6rem', fontWeight: 800, padding: '0.15rem 0.5rem', borderRadius: '4px' }}>GFG</span>
                          </a>
                        </div>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <span className="badge badge-topic">{p.topic}</span>
                          <span className={`badge badge-${(p.difficulty||'Medium').toLowerCase()}`}>{p.difficulty || 'Medium'}</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {p.solvedAt && (
                          <span style={{ color: 'var(--muted)', fontSize: '0.78rem' }}>
                            {new Date(p.solvedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                        )}
                        <span style={{ color: 'var(--muted)', fontSize: '1rem', transform: expandedId === p._id ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}>›</span>
                      </div>
                    </div>

                    {/* Expanded: Code + Notes tabs */}
                    {expandedId === p._id && (
                      <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                          <button
                            className={`btn ${expandedSection === 'code' ? 'btn-accent' : 'btn-ghost'}`}
                            onClick={() => setExpandedSection('code')}
                            style={{ fontSize: '0.82rem', padding: '0.35rem 0.85rem' }}
                          >
                            💻 Code
                          </button>
                          <button
                            className={`btn ${expandedSection === 'notes' ? 'btn-accent' : 'btn-ghost'}`}
                            onClick={() => setExpandedSection('notes')}
                            style={{ fontSize: '0.82rem', padding: '0.35rem 0.85rem' }}
                          >
                            📝 Notes
                          </button>
                        </div>

                        {expandedSection === 'code' && (
                          p.code ? (
                            <div className="code-editor-wrapper" style={{ borderRadius: 8 }}>
                              <div className="code-line-numbers">
                                {p.code.split('\n').map((_, i) => <span key={i}>{i + 1}</span>)}
                              </div>
                              <pre className="code-editor" style={{ whiteSpace: 'pre-wrap', overflowX: 'auto', minHeight: 'auto', cursor: 'default' }}>
                                {p.code}
                              </pre>
                            </div>
                          ) : (
                            <div className="empty-state" style={{ padding: '1.5rem' }}>
                              <p>No code saved for this problem.</p>
                            </div>
                          )
                        )}

                        {expandedSection === 'notes' && (
                          p.notes ? (
                            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: 8, padding: '1rem', fontSize: '0.9rem', lineHeight: 1.7, whiteSpace: 'pre-wrap', color: 'var(--muted2)' }}>
                              {p.notes}
                            </div>
                          ) : (
                            <div className="empty-state" style={{ padding: '1.5rem' }}>
                              <p>No notes saved for this problem.</p>
                            </div>
                          )
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </>
            )}
          </div>

      </div>
    </div>
  );
}

export default Profile;