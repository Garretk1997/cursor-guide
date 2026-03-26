import { useMobile } from './useMobile'

const N = 5  // total modules / projects / challenges

const LEVEL_STYLE = {
  Beginner:     { color: '#b9a3fc', bar: '#8b5cf6', bg: 'rgba(124,58,237,0.14)', border: 'rgba(124,58,237,0.28)', glow: 'rgba(124,58,237,0.45)' },
  Intermediate: { color: '#5ac8fa', bar: '#22bff0', bg: 'rgba(14,165,233,0.14)', border: 'rgba(56,189,248,0.28)', glow: 'rgba(56,189,248,0.45)'  },
  Advanced:     { color: '#5ee98a', bar: '#34d46a', bg: 'rgba(34,197,94,0.14)',  border: 'rgba(74,222,128,0.28)', glow: 'rgba(74,222,128,0.45)'   },
}

export function calcSkillOverall(modulesDone, projectsDone, challengesDone, bestScore) {
  return Math.round(
    (modulesDone.size    / N) * 30 +
    (projectsDone.size   / N) * 25 +
    (challengesDone.size / N) * 25 +
    bestScore * 0.20
  )
}

export function calcSkillLevel(overall) {
  if (overall < 30) return 'Beginner'
  if (overall < 75) return 'Intermediate'
  return 'Advanced'
}

// ── Compact (sidebar) version ─────────────────────────────────────────────────
function CompactView({ overall, level, ls, modulesDone, projectsDone, challengesDone, bestScore }) {
  const nextMsg = level === 'Beginner'     ? `${30 - overall}% to Intermediate`
                : level === 'Intermediate' ? `${75 - overall}% to Advanced`
                : 'Top tier reached'

  const stats = [
    { label: 'Modules',    pct: (modulesDone.size    / N) * 100, val: `${modulesDone.size}/${N}`    },
    { label: 'Projects',   pct: (projectsDone.size   / N) * 100, val: `${projectsDone.size}/${N}`   },
    { label: 'Challenges', pct: (challengesDone.size / N) * 100, val: `${challengesDone.size}/${N}` },
    { label: 'Quiz',       pct: bestScore,                        val: bestScore > 0 ? `${bestScore}%` : '—' },
  ]

  return (
    <div>
      {/* Level + overall row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{
            width: 6, height: 6, borderRadius: '50%',
            background: ls.color,
            boxShadow: `0 0 7px ${ls.glow}`,
          }} />
          <span style={{
            fontSize: 10, fontFamily: 'monospace', fontWeight: 700,
            color: ls.color, letterSpacing: '0.07em', textTransform: 'uppercase',
          }}>
            {level}
          </span>
        </div>
        <span style={{ fontSize: 10, fontFamily: 'monospace', color: 'rgba(255,255,255,0.42)' }}>
          {overall}%
        </span>
      </div>

      {/* Overall bar */}
      <div style={{
        height: 2, borderRadius: 9999,
        background: 'rgba(255,255,255,0.10)', overflow: 'hidden',
        marginBottom: 4,
      }}>
        <div style={{
          height: '100%', borderRadius: 9999,
          background: `linear-gradient(90deg, ${ls.bar}99, ${ls.bar})`,
          width: `${Math.max(overall, 2)}%`,
          transition: 'width 0.7s ease-out',
        }} />
      </div>

      {/* Next milestone hint */}
      <p style={{ fontSize: 9, fontFamily: 'monospace', color: 'rgba(255,255,255,0.36)', marginBottom: 11 }}>
        {nextMsg}
      </p>

      {/* Mini stat rows */}
      {stats.map(({ label, pct, val }) => (
        <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 5 }}>
          <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.42)', width: 60, flexShrink: 0 }}>
            {label}
          </span>
          <div style={{ flex: 1, height: 1.5, borderRadius: 9999, background: 'rgba(255,255,255,0.10)', overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 9999,
              background: pct >= 100 ? '#4ade80' : 'rgba(124,58,237,0.55)',
              width: `${pct}%`,
              transition: 'width 0.6s ease-out',
            }} />
          </div>
          <span style={{ fontSize: 9, fontFamily: 'monospace', color: 'rgba(255,255,255,0.46)', width: 24, textAlign: 'right', flexShrink: 0 }}>
            {val}
          </span>
        </div>
      ))}
    </div>
  )
}

// ── Full (main content) version ───────────────────────────────────────────────
function FullView({ overall, level, ls, modulesDone, projectsDone, challengesDone, bestScore }) {
  const isMobile = useMobile()

  const stats = [
    { label: 'Modules',    val: `${modulesDone.size}/${N}`,    pct: (modulesDone.size    / N) * 100, sub: 'course completed'  },
    { label: 'Projects',   val: `${projectsDone.size}/${N}`,   pct: (projectsDone.size   / N) * 100, sub: 'built & shipped'   },
    { label: 'Challenges', val: `${challengesDone.size}/${N}`, pct: (challengesDone.size / N) * 100, sub: 'completed'         },
    { label: 'Quiz',       val: bestScore > 0 ? `${bestScore}%` : '—', pct: bestScore,               sub: 'best score'        },
  ]

  return (
    <div style={{
      borderRadius: 14,
      background: 'linear-gradient(150deg, rgba(26,22,46,0.92) 0%, rgba(16,13,34,0.95) 100%)',
      border: `1px solid ${ls.border}`,
      backdropFilter: 'blur(14px)',
      padding: isMobile ? '16px 14px' : '18px 20px',
      marginBottom: 24,
      boxShadow: [
        '0 4px 32px rgba(0,0,0,0.38)',
        `0 0 60px ${ls.glow}18`,
        'inset 0 1px 0 rgba(255,255,255,0.10)',
      ].join(', '),
    }}>

      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <span style={{
          fontSize: 10, fontFamily: 'monospace',
          color: 'rgba(255,255,255,0.40)',
          textTransform: 'uppercase', letterSpacing: '0.10em',
        }}>
          Skill Progress
        </span>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 5,
          background: ls.bg, border: `1px solid ${ls.border}`,
          borderRadius: 9999, padding: '3px 10px',
        }}>
          <div style={{
            width: 5, height: 5, borderRadius: '50%',
            background: ls.color,
            boxShadow: `0 0 6px ${ls.glow}`,
          }} />
          <span style={{
            fontSize: 10, fontFamily: 'monospace', fontWeight: 700,
            color: ls.color, letterSpacing: '0.08em', textTransform: 'uppercase',
          }}>
            {level}
          </span>
        </div>
      </div>

      {/* Overall progress bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: isMobile ? 12 : 14 }}>
        <div style={{ flex: 1, height: 3, borderRadius: 9999, background: 'rgba(255,255,255,0.11)', overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: 9999,
            background: `linear-gradient(90deg, ${ls.bar}99, ${ls.bar})`,
            width: `${Math.max(overall, 1)}%`,
            transition: 'width 0.8s ease-out',
            boxShadow: `0 0 6px ${ls.glow}66`,
          }} />
        </div>
        <span style={{ fontSize: 12, fontFamily: 'monospace', color: ls.color, fontWeight: 600, flexShrink: 0 }}>
          {overall}%
        </span>
      </div>

      {/* Stat tiles */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
        gap: isMobile ? 7 : 8,
      }}>
        {stats.map(({ label, val, pct, sub }) => {
          const done = pct >= 100
          return (
            <div key={label} style={{
              borderRadius: 10,
              background: done ? 'rgba(34,197,94,0.10)' : 'rgba(255,255,255,0.06)',
              border: `1px solid ${done ? 'rgba(74,222,128,0.22)' : 'rgba(255,255,255,0.10)'}`,
              padding: isMobile ? '10px 10px' : '10px 12px',
            }}>
              <div style={{
                fontSize: 9, fontFamily: 'monospace',
                color: 'rgba(255,255,255,0.42)',
                textTransform: 'uppercase', letterSpacing: '0.08em',
                marginBottom: 5,
              }}>
                {label}
              </div>
              <div style={{
                fontSize: isMobile ? 17 : 19, fontWeight: 700, fontFamily: 'monospace',
                color: done ? '#4ade80' : '#ede9fe',
                lineHeight: 1, marginBottom: 7,
              }}>
                {val}
              </div>
              <div style={{
                height: 2, borderRadius: 9999,
                background: 'rgba(255,255,255,0.10)', overflow: 'hidden',
                marginBottom: 5,
              }}>
                <div style={{
                  height: '100%', borderRadius: 9999,
                  background: done ? '#4ade80' : 'rgba(124,58,237,0.62)',
                  width: `${pct}%`,
                  transition: 'width 0.7s ease-out',
                }} />
              </div>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.38)', fontFamily: 'monospace' }}>
                {sub}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Public component ──────────────────────────────────────────────────────────
export default function SkillDashboard({ modulesDone, projectsDone, challengesDone, bestScore, compact = false }) {
  const overall = calcSkillOverall(modulesDone, projectsDone, challengesDone, bestScore)
  const level   = calcSkillLevel(overall)
  const ls      = LEVEL_STYLE[level]

  const shared = { overall, level, ls, modulesDone, projectsDone, challengesDone, bestScore }

  return compact ? <CompactView {...shared} /> : <FullView {...shared} />
}
