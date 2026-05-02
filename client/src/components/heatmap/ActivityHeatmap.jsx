import React, { useState, useMemo } from 'react';
import { HeatmapGrid } from './HeatmapComponents';
import DayDetailModal from './DayDetailModal';

/**
 * ActivityHeatmap
 *
 * Props:
 *   data: Array<{ date: "YYYY-MM-DD", count: number, status?: "solved"|"unsolved"|"none" }>
 *   months: number (default 4) — how many months back to show
 *   totalSolved: number
 *   streak: number
 *   bestStreak: number
 */
const ActivityHeatmap = ({ data = [], months = 4, totalSolved = 0, streak = 0, bestStreak = 0 }) => {
  const [selectedDay, setSelectedDay] = useState(null);

  // Normalise data — ensure every entry has a status
  const normalised = useMemo(() =>
    data.map(d => ({
      ...d,
      status: d.status || (d.count > 0 ? 'solved' : 'none'),
    })),
    [data]
  );

  // Compute quick stats from data
  const activeDays  = useMemo(() => data.filter(d => d.count > 0).length, [data]);
  const thisWeek    = useMemo(() => {
    const today = new Date();
    const mon   = new Date(today);
    mon.setDate(today.getDate() - today.getDay() + 1);
    return data.filter(d => {
      const dt = new Date(d.date + 'T00:00:00');
      return dt >= mon && dt <= today && d.count > 0;
    }).reduce((s, d) => s + d.count, 0);
  }, [data]);

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(15,23,42,0.95) 0%, rgba(17,24,39,0.95) 100%)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 16,
      padding: '1.5rem',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Decorative glow */}
      <div style={{
        position: 'absolute', top: -60, right: -60,
        width: 200, height: 200, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
            <span style={{ fontSize: '1.1rem' }}>📊</span>
            <span style={{ fontWeight: 800, fontSize: '1rem', color: '#f1f5f9' }}>
              Activity Calendar
            </span>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>
            Last {months} months · click any day for details
          </p>
        </div>

        {/* Quick stats pills */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <Pill color="#f59e0b" icon="🔥" label="Streak" value={`${streak}d`} />
          <Pill color="#10b981" icon="✅" label="Solved" value={totalSolved} />
          <Pill color="#60a5fa" icon="📅" label="Active" value={`${activeDays}d`} />
          <Pill color="#a78bfa" icon="⚡" label="This Week" value={thisWeek} />
        </div>
      </div>

      {/* Heatmap grid */}
      <HeatmapGrid
        data={normalised}
        months={months}
        onDayClick={setSelectedDay}
      />

      {/* Legend row with status keys */}
      <div style={{
        display: 'flex', gap: '1rem', marginTop: '1rem',
        flexWrap: 'wrap', alignItems: 'center',
      }}>
        <StatusKey color="#10b981" icon="✓" label="Solved day" />
        <StatusKey color="#f87171" icon="✕" label="Attempted" />
        <StatusKey color="rgba(255,255,255,0.12)" label="No activity" />
        <div style={{
          marginLeft: 'auto', fontSize: '0.7rem',
          color: '#475569', fontStyle: 'italic',
        }}>
          Best streak: {bestStreak} days
        </div>
      </div>

      {/* Day detail modal */}
      {selectedDay && (
        <DayDetailModal day={selectedDay} onClose={() => setSelectedDay(null)} />
      )}
    </div>
  );
};

// ─── Sub-components ────────────────────────────────────────────────────────────
const Pill = ({ color, icon, label, value }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: '0.35rem',
    background: color + '18', border: `1px solid ${color}40`,
    borderRadius: 8, padding: '0.3rem 0.65rem',
  }}>
    <span style={{ fontSize: '0.8rem' }}>{icon}</span>
    <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 500 }}>{label}</span>
    <span style={{ fontSize: '0.8rem', color, fontWeight: 800 }}>{value}</span>
  </div>
);

const StatusKey = ({ color, icon, label }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
    <div style={{
      width: 14, height: 14, borderRadius: 4,
      background: color, border: '1px solid rgba(255,255,255,0.1)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '0.5rem', color: '#fff', fontWeight: 800,
    }}>{icon}</div>
    <span style={{ fontSize: '0.68rem', color: '#6b7280' }}>{label}</span>
  </div>
);

export default ActivityHeatmap;
