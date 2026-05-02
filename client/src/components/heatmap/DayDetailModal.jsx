import React, { useEffect, useRef } from 'react';

const DayDetailModal = ({ day, onClose }) => {
  const modalRef = useRef();

  // Close on backdrop click
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  if (!day) return null;

  const formatted = new Date(day.date + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
  });

  const statusConfig = {
    solved:   { color: '#10b981', bg: 'rgba(16,185,129,0.1)',  border: 'rgba(16,185,129,0.3)', icon: '✓', label: 'Solved' },
    unsolved: { color: '#f87171', bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.3)', icon: '✕', label: 'Attempted' },
    none:     { color: '#6b7280', bg: 'rgba(107,114,128,0.1)', border: 'rgba(107,114,128,0.2)', icon: '○', label: 'No Activity' },
  };
  const s = statusConfig[day.status] || statusConfig.none;

  return (
    <div
      onClick={(e) => { if (!modalRef.current?.contains(e.target)) onClose(); }}
      style={{
        position: 'fixed', inset: 0, zIndex: 9998,
        background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem',
        animation: 'fadeIn 0.18s ease',
      }}
    >
      <div
        ref={modalRef}
        style={{
          background: '#0f172a',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 16,
          padding: '1.75rem',
          maxWidth: 380,
          width: '100%',
          boxShadow: '0 24px 80px rgba(0,0,0,0.8)',
          animation: 'slideUp 0.22s ease',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.2rem', fontWeight: 500 }}>
              📅 Activity Detail
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#f1f5f9' }}>{formatted}</div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 8, color: '#94a3b8', width: 32, height: 32,
              cursor: 'pointer', fontSize: '1.1rem', display: 'flex',
              alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
          >×</button>
        </div>

        {/* Status badge */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.75rem',
          background: s.bg, border: `1px solid ${s.border}`,
          borderRadius: 10, padding: '0.9rem 1rem', marginBottom: '1rem',
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: s.color + '22', border: `1px solid ${s.color}55`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.2rem', color: s.color, fontWeight: 800, flexShrink: 0,
          }}>{s.icon}</div>
          <div>
            <div style={{ fontWeight: 700, color: s.color, fontSize: '0.95rem' }}>{s.label}</div>
            <div style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '0.1rem' }}>
              {day.count > 0
                ? `${day.count} problem${day.count > 1 ? 's' : ''} solved this day`
                : 'No problems solved on this day'}
            </div>
          </div>
        </div>

        {/* Progress ring visual */}
        <div style={{
          display: 'flex', justifyContent: 'center', padding: '0.5rem 0 1rem',
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: '3rem', fontWeight: 900,
              color: day.count > 0 ? s.color : '#374151',
              lineHeight: 1, marginBottom: '0.35rem',
              textShadow: day.count > 0 ? `0 0 20px ${s.color}66` : 'none',
            }}>{day.count}</div>
            <div style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 500 }}>
              problems solved
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          style={{
            width: '100%', padding: '0.65rem',
            background: 'rgba(99,102,241,0.15)',
            border: '1px solid rgba(99,102,241,0.3)',
            borderRadius: 10, color: '#a5b4fc', fontWeight: 600,
            fontSize: '0.85rem', cursor: 'pointer',
            transition: 'background 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,102,241,0.25)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(99,102,241,0.15)'}
        >Close</button>
      </div>

      <style>{`
        @keyframes fadeIn  { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { transform: translateY(16px); opacity:0 } to { transform: translateY(0); opacity:1 } }
      `}</style>
    </div>
  );
};

export default DayDetailModal;
