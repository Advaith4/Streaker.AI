import { useState } from 'react';
import API from '../services/api';
import { toast } from 'react-toastify';

const LANGUAGES = ['Java', 'Python', 'C++', 'JavaScript', 'C'];

const ExternalLink = ({ href, label, bg, textColor }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    title={`Open on ${label}`}
    style={{ textDecoration: 'none' }}
    onClick={(e) => e.stopPropagation()}
  >
    <span style={{
      background: bg,
      color: textColor || 'white',
      fontSize: '0.6rem',
      fontWeight: 800,
      padding: '0.18rem 0.5rem',
      borderRadius: '4px',
      letterSpacing: '0.03em',
      lineHeight: 1.5,
      display: 'inline-block',
    }}>
      {label}
    </span>
  </a>
);

const ProblemCard = ({ problem, onSolve, index = 0 }) => {
  const [solved, setSolved] = useState(problem.solved);
  const [activeTab, setActiveTab] = useState(null);
  const [notes, setNotes] = useState(problem.notes || '');
  const [code, setCode] = useState(problem.code || '');
  const [lang, setLang] = useState('Java');
  const [saving, setSaving] = useState(false);

  const handleSolve = async () => {
    if (solved) return;
    try {
      await API.post(`/solve/${problem._id}`);
      setSolved(true);
      toast.success('Problem solved! 🎉');
      if (onSolve) onSolve();
    } catch (error) {
      toast.error('Failed to mark as solved');
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await API.put(`/notes/${problem._id}`, { notes, code });
      toast.success('Saved!');
    } catch (error) {
      toast.error('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const diff  = (problem.difficulty || 'Medium').toLowerCase();
  const gfgUrl = problem.gfgUrl || `https://www.google.com/search?q=site:geeksforgeeks.org+${encodeURIComponent(problem.title)}`;

  return (
    <div
      className={`problem-card ${solved ? 'solved' : ''}`}
      style={{ animationDelay: `${index * 0.06}s` }}
    >
      {/* ── Header ── */}
      <div className="problem-header">
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* Title + links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.45rem' }}>
            {solved && (
              <span style={{
                color: 'var(--green)', fontSize: '0.9rem',
                background: 'rgba(16,185,129,0.12)', borderRadius: '50%',
                width: 22, height: 22, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0
              }}>✓</span>
            )}
            <span style={{ fontWeight: 700, fontSize: '0.95rem', lineHeight: 1.4, color: solved ? 'var(--muted2)' : 'var(--text)' }}>
              {problem.title}
            </span>
            {/* GFG link — Google site search always finds correct problem */}
            <ExternalLink href={gfgUrl} label="GFG" bg="#2f8d46" textColor="#fff" />
          </div>

          {/* Badges */}
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            <span className="badge badge-topic">{problem.topic}</span>
            <span className={`badge badge-${diff}`}>{problem.difficulty || 'Medium'}</span>
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0, alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            className={`btn btn-ghost ${activeTab === 'code' ? 'active-tab' : ''}`}
            onClick={() => setActiveTab(activeTab === 'code' ? null : 'code')}
            style={{ fontSize: '0.78rem', padding: '0.35rem 0.65rem' }}
          >
            💻 Code
          </button>
          <button
            className={`btn btn-ghost ${activeTab === 'notes' ? 'active-tab' : ''}`}
            onClick={() => setActiveTab(activeTab === 'notes' ? null : 'notes')}
            style={{ fontSize: '0.78rem', padding: '0.35rem 0.65rem' }}
          >
            📝 Notes
          </button>
          <button
            className={`btn ${solved ? 'btn-success' : 'btn-accent'}`}
            onClick={handleSolve}
            disabled={solved}
            style={{ fontSize: '0.82rem', padding: '0.42rem 0.9rem' }}
          >
            {solved ? '✓ Done' : 'Mark Done'}
          </button>
        </div>
      </div>

      {/* ── Code Tab ── */}
      {activeTab === 'code' && (
        <div className="tab-content">
          <div className="tab-toolbar">
            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
              {LANGUAGES.map(l => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`lang-btn ${lang === l ? 'lang-btn-active' : ''}`}
                >
                  {l}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <a href={gfgUrl} target="_blank" rel="noopener noreferrer"
                style={{ fontSize: '0.75rem', color: '#2f8d46', textDecoration: 'none', fontWeight: 600 }}>
                Practice on GFG ↗
              </a>
              <button className="btn btn-accent" onClick={handleSave} disabled={saving}
                style={{ fontSize: '0.75rem', padding: '0.3rem 0.75rem' }}>
                {saving ? 'Saving...' : '💾 Save'}
              </button>
            </div>
          </div>
          <div className="code-editor-wrapper">
            <div className="code-line-numbers">
              {(code || ' ').split('\n').map((_, i) => <span key={i}>{i + 1}</span>)}
            </div>
            <textarea
              className="code-editor"
              placeholder={`// Write your ${lang} solution here\n// Time: O(?)\n// Space: O(?)`}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
            />
          </div>
        </div>
      )}

      {/* ── Notes Tab ── */}
      {activeTab === 'notes' && (
        <div className="tab-content">
          <div className="tab-toolbar">
            <span style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>
              📖 Approach · Complexity · Key insights
            </span>
            <button className="btn btn-accent" onClick={handleSave} disabled={saving}
              style={{ fontSize: '0.75rem', padding: '0.3rem 0.75rem' }}>
              {saving ? 'Saving...' : '💾 Save'}
            </button>
          </div>
          <textarea
            className="notes-input"
            style={{ minHeight: 110 }}
            placeholder={`Approach:\n\nTime Complexity: O(?)\nSpace Complexity: O(?)\n\nKey insight:`}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      )}
    </div>
  );
};

export default ProblemCard;
