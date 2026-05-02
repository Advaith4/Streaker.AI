import React, { useState } from 'react';

// ─── Tooltip ──────────────────────────────────────────────────────────────────
export const Tooltip = ({ visible, x, y, date, count, status }) => {
  if (!visible) return null;

  const statusLabels = {
    solved:   { label: 'Solved', color: '#10b981' },
    unsolved: { label: 'Attempted', color: '#f87171' },
    none:     { label: 'No Activity', color: '#6b7280' },
  };
  const s = statusLabels[status] || statusLabels.none;
  const [yr, mo, dy] = date ? date.split('-') : [];
  const formatted = date
    ? new Date(yr, mo - 1, dy).toLocaleDateString('en-US', {
        weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
      })
    : '';

  return (
    <div style={{
      position: 'fixed',
      left: x + 12,
      top: y - 8,
      zIndex: 9999,
      background: '#0f172a',
      border: '1px solid rgba(255,255,255,0.12)',
      borderRadius: 10,
      padding: '0.6rem 0.85rem',
      pointerEvents: 'none',
      boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
      minWidth: 170,
      fontFamily: 'inherit',
    }}>
      <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginBottom: '0.3rem' }}>{formatted}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
        <span style={{
          width: 8, height: 8, borderRadius: '50%',
          background: s.color, display: 'inline-block', flexShrink: 0
        }} />
        <span style={{ fontSize: '0.8rem', color: '#f1f5f9', fontWeight: 600 }}>{s.label}</span>
      </div>
      <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
        {count > 0 ? `${count} problem${count > 1 ? 's' : ''} solved` : 'No problems solved'}
      </div>
    </div>
  );
};

// ─── HeatmapCell ──────────────────────────────────────────────────────────────
const getColor = (count, status) => {
  if (status === 'solved') {
    if (count >= 7) return { bg: '#065f46', border: '#059669', glow: 'rgba(16,185,129,0.5)' };
    if (count >= 5) return { bg: '#047857', border: '#10b981', glow: 'rgba(16,185,129,0.4)' };
    if (count >= 3) return { bg: '#059669', border: '#34d399', glow: 'rgba(52,211,153,0.4)' };
    if (count >= 1) return { bg: '#10b981', border: '#6ee7b7', glow: 'rgba(110,231,183,0.35)' };
  }
  if (status === 'unsolved') {
    return { bg: 'rgba(248,113,113,0.12)', border: 'rgba(248,113,113,0.3)', glow: 'rgba(248,113,113,0.2)' };
  }
  return { bg: 'rgba(255,255,255,0.04)', border: 'rgba(255,255,255,0.07)', glow: 'none' };
};

export const HeatmapCell = ({ date, count, status, isToday, onHover, onLeave, onClick }) => {
  const [hovered, setHovered] = useState(false);
  const { bg, border, glow } = getColor(count, status);

  const dateParts = date ? date.split('-') : [];
  const day = dateParts[2] ? parseInt(dateParts[2], 10) : null;

  const handleMouseEnter = (e) => {
    setHovered(true);
    onHover && onHover(e, { date, count, status });
  };

  const handleMouseMove = (e) => {
    onHover && onHover(e, { date, count, status });
  };

  const handleMouseLeave = () => {
    setHovered(false);
    onLeave && onLeave();
  };

  return (
    <div
      onClick={() => onClick && date && onClick({ date, count, status })}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        width: '100%',
        paddingBottom: '100%',
        position: 'relative',
        cursor: date ? 'pointer' : 'default',
      }}
    >
      <div style={{
        position: 'absolute',
        inset: 2,
        borderRadius: 6,
        background: date ? bg : 'transparent',
        border: date ? `1px solid ${border}` : 'none',
        boxShadow: hovered && date ? `0 0 10px ${glow}, 0 0 0 2px ${border}` : 'none',
        transform: hovered && date ? 'scale(1.18)' : 'scale(1)',
        transition: 'all 0.18s ease',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        outline: isToday ? '2px solid #f59e0b' : 'none',
        outlineOffset: 1,
        animation: isToday ? 'todayPulse 2.5s ease-in-out infinite' : 'none',
        zIndex: hovered ? 10 : 1,
      }}>
        {day && (
          <span style={{
            fontSize: 'clamp(0.45rem, 1.2vw, 0.7rem)',
            fontWeight: 600,
            color: status === 'solved' ? '#ecfdf5' : status === 'unsolved' ? '#fca5a5' : '#374151',
            lineHeight: 1,
            marginBottom: 1,
          }}>{day}</span>
        )}
        {date && status === 'solved' && (
          <span style={{ fontSize: 'clamp(0.4rem, 1vw, 0.6rem)', color: '#6ee7b7', lineHeight: 1 }}>✓</span>
        )}
        {date && status === 'unsolved' && (
          <span style={{ fontSize: 'clamp(0.35rem, 0.9vw, 0.55rem)', color: '#f87171', lineHeight: 1 }}>✕</span>
        )}
      </div>
    </div>
  );
};

// ─── HeatmapGrid ──────────────────────────────────────────────────────────────
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const getLocalIso = (dateObj) => {
  return `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
};

function buildGrid(dataMap, months = 4) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Start from first day of (months) months ago
  const start = new Date(today);
  start.setMonth(start.getMonth() - months + 1);
  start.setDate(1);

  // Rewind to Sunday of that week
  const gridStart = new Date(start);
  gridStart.setDate(gridStart.getDate() - gridStart.getDay());

  const weeks = [];
  const monthLabels = []; // { label, colIndex }
  let cur = new Date(gridStart);
  let col = 0;
  let lastMonth = -1;

  while (cur <= today || col < 1) {
    const week = [];
    let addedMonthLabelThisCol = false;

    for (let d = 0; d < 7; d++) {
      const iso = getLocalIso(cur);
      const inRange = cur >= start && cur <= today;

      if (inRange && cur.getMonth() !== lastMonth) {
        if (!addedMonthLabelThisCol && !monthLabels.find(m => m.col === col)) {
          monthLabels.push({ label: MONTHS[cur.getMonth()], col });
          addedMonthLabelThisCol = true;
        }
        lastMonth = cur.getMonth();
      }

      week.push(inRange ? {
        date: iso,
        count: dataMap[iso]?.count ?? 0,
        status: dataMap[iso]?.status ?? 'none',
        isToday: cur.getTime() === today.getTime(),
      } : null);

      cur.setDate(cur.getDate() + 1);
    }
    weeks.push(week);
    col++;
    if (cur > today) break;
  }

  return { weeks, monthLabels };
}

export const HeatmapGrid = ({ data = [], months = 4, onDayClick }) => {
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, date: '', count: 0, status: 'none' });

  // Build lookup map from data array
  const dataMap = {};
  data.forEach(d => { dataMap[d.date] = d; });

  const { weeks, monthLabels } = buildGrid(dataMap, months);

  const handleHover = (e, cell) => {
    setTooltip({ visible: true, x: e.clientX, y: e.clientY, ...cell });
  };
  const handleLeave = () => setTooltip(t => ({ ...t, visible: false }));

  const CELL_SIZE = 'minmax(0, 1fr)';

  return (
    <div style={{ position: 'relative', userSelect: 'none' }}>
      <Tooltip {...tooltip} />

      {/* Month labels */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `28px repeat(${weeks.length}, ${CELL_SIZE})`,
        marginBottom: 4,
        paddingLeft: 2,
      }}>
        <div /> {/* spacer for day labels */}
        {weeks.map((_, i) => {
          const ml = monthLabels.find(m => m.col === i);
          return (
            <div key={i} style={{
              fontSize: '0.7rem', color: '#64748b', fontWeight: 600,
              textAlign: 'center', letterSpacing: '0.04em',
              whiteSpace: 'nowrap', overflow: 'visible',
            }}>
              {ml ? ml.label : ''}
            </div>
          );
        })}
      </div>

      {/* Grid: day labels + cells */}
      <div style={{ display: 'flex', gap: 0 }}>
        {/* Day labels */}
        <div style={{
          display: 'grid', gridTemplateRows: 'repeat(7, 1fr)',
          width: 28, flexShrink: 0, marginTop: 0,
        }}>
          {DAYS.map(d => (
            <div key={d} style={{
              fontSize: '0.6rem', color: '#4b5563', display: 'flex',
              alignItems: 'center', justifyContent: 'flex-end',
              paddingRight: 4, height: '100%',
            }}>{d}</div>
          ))}
        </div>

        {/* Cells grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${weeks.length}, ${CELL_SIZE})`,
          gridTemplateRows: 'repeat(7, 1fr)',
          flex: 1,
          gridAutoFlow: 'column',
        }}>
          {weeks.map((week, wi) =>
            week.map((cell, di) => (
              <HeatmapCell
                key={`${wi}-${di}`}
                date={cell?.date}
                count={cell?.count ?? 0}
                status={cell?.status ?? 'none'}
                isToday={cell?.isToday ?? false}
                onHover={handleHover}
                onLeave={handleLeave}
                onClick={onDayClick}
              />
            ))
          )}
        </div>
      </div>

      {/* Legend */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
        gap: '0.4rem', marginTop: '0.75rem',
      }}>
        <span style={{ fontSize: '0.68rem', color: '#6b7280' }}>Less</span>
        {['rgba(255,255,255,0.06)', '#10b981', '#059669', '#047857', '#065f46'].map((c, i) => (
          <div key={i} style={{
            width: 12, height: 12, borderRadius: 3,
            background: c, border: '1px solid rgba(255,255,255,0.1)',
          }} />
        ))}
        <span style={{ fontSize: '0.68rem', color: '#6b7280' }}>More</span>
      </div>

      <style>{`
        @keyframes todayPulse {
          0%, 100% { outline-color: #f59e0b; }
          50%       { outline-color: #fbbf24; box-shadow: 0 0 8px rgba(245,158,11,0.6); }
        }
      `}</style>
    </div>
  );
};
