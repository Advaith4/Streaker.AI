import { useState, useEffect } from 'react';
import API from '../services/api';
import ProblemCard from '../components/ProblemCard';
import Navbar from '../components/Navbar';
import { toast } from 'react-toastify';

const DailyProblems = () => {
  const [dailyLog, setDailyLog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => { fetchDailyLog(); }, []);

  const fetchDailyLog = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/daily');
      setDailyLog(data);
    } catch (error) {
      console.error('Failed to fetch daily log', error);
    } finally {
      setLoading(false);
    }
  };

  const generateDaily = async (dayType) => {
    setGenerating(true);
    try {
      const { data } = await API.post('/daily', { dayType });
      setDailyLog(data);
      toast.success(`${dayType === 'holiday' ? '7' : '3'} problems generated! Let's go! 💪`);
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to generate';
      toast.error(msg);
      if (msg.includes('already generated')) {
        fetchDailyLog();
      }
    } finally {
      setGenerating(false);
    }
  };

  if (loading) return (
    <div className="app-shell">
      <Navbar />
      <div className="loading-page">
        <div className="spinner" />
        <p>Loading today's plan...</p>
      </div>
    </div>
  );

  if (!dailyLog) return (
    <div className="app-shell">
      <Navbar />
      <div className="page">
        <div className="generator-landing">
          <div style={{ fontSize: '4rem', marginBottom: '1rem', animation: 'float 3s ease-in-out infinite' }}>
            🤖
          </div>
          <h2 className="animate-fadeUp">What's your plan today?</h2>
          <p className="animate-fadeUp delay-1">
            Our AI engine will assign you problems from different topics for a balanced practice session.
          </p>

          <div className="day-type-grid animate-fadeUp delay-2" style={{ marginTop: '2.5rem', maxWidth: 480 }}>
            <div
              className="day-card"
              onClick={() => !generating && generateDaily('working')}
              style={{ opacity: generating ? 0.6 : 1 }}
            >
              <div className="day-card-badge">3 problems</div>
              <span className="day-card-icon">💼</span>
              <h3>Working Day</h3>
              <p>Focused & efficient practice session</p>
            </div>

            <div
              className="day-card"
              onClick={() => !generating && generateDaily('holiday')}
              style={{ opacity: generating ? 0.6 : 1 }}
            >
              <div className="day-card-badge" style={{ background: 'var(--green)' }}>7 problems</div>
              <span className="day-card-icon">🌴</span>
              <h3>Holiday / Weekend</h3>
              <p>Deep dive with maximum problems</p>
            </div>
          </div>

          {generating && (
            <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--muted)' }}>
              <div className="spinner" style={{ width: 24, height: 24, borderWidth: 2 }} />
              Generating your personalized plan...
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const solved = dailyLog.problemsSolved?.length || dailyLog.count || 0;
  const total = dailyLog.problemsAssigned?.length || 0;
  const pct = total > 0 ? Math.round((solved / total) * 100) : 0;

  return (
    <div className="app-shell">
      <Navbar />
      <div className="page">
        {/* Header */}
        <div className="daily-header animate-fadeUp">
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '0.25rem' }}>
              {pct === 100 ? '🏆 All Done!' : "📅 Today's Mission"}
            </h1>
            <p style={{ color: 'var(--muted)' }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="daily-counter">
            <div className="daily-counter-num">{solved}/{total}</div>
            <div className="daily-counter-label">Solved · {pct}%</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="progress-bar-track animate-fadeUp delay-1">
          <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
        </div>

        {/* Problem Cards */}
        <div style={{ marginTop: '1.5rem' }}>
          {dailyLog.problemsAssigned?.map((problem, i) => (
            <ProblemCard
              key={problem._id}
              problem={problem}
              index={i}
              onSolve={fetchDailyLog}
            />
          ))}
        </div>

        {pct === 100 && (
          <div className="card animate-fadeUp" style={{ textAlign: 'center', padding: '2.5rem', marginTop: '1rem', background: 'rgba(16,185,129,0.08)', borderColor: 'rgba(16,185,129,0.3)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🏆</div>
            <h2 style={{ color: 'var(--green)' }}>You crushed today's plan!</h2>
            <p style={{ color: 'var(--muted)', marginTop: '0.5rem' }}>Come back tomorrow to keep your streak alive.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyProblems;
