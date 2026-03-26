import { useState, useEffect } from 'react'
import { useMobile } from './useMobile'
import { QUIZ_QUESTIONS } from './quizData'

// ─── Weak-area detection ──────────────────────────────────────────────────────
// Returns unique module IDs where the user got questions wrong
function weakModules(quizAnswers, quizOrder) {
  if (!quizOrder || quizOrder.length === 0) return []
  const mods = new Set()
  quizOrder.forEach((qIdx, i) => {
    if (quizAnswers[i] !== QUIZ_QUESTIONS[qIdx].correct) {
      mods.add(QUIZ_QUESTIONS[qIdx].module)
    }
  })
  return [...mods]
}

// ─── Stat tile ────────────────────────────────────────────────────────────────
function StatTile({ label, value, done, isMobile }) {
  return (
    <div style={{
      flex: 1,
      borderRadius: 10,
      border: `1px solid ${done ? 'rgba(74,222,128,0.18)' : 'rgba(255,255,255,0.07)'}`,
      background: done ? 'rgba(34,197,94,0.06)' : 'rgba(255,255,255,0.025)',
      padding: isMobile ? '10px 10px' : '12px 14px',
      textAlign: 'center',
    }}>
      <div style={{
        fontSize: isMobile ? 18 : 21, fontWeight: 700, fontFamily: 'monospace',
        color: done ? '#4ade80' : '#ede9fe', lineHeight: 1, marginBottom: 5,
      }}>
        {value}
      </div>
      <div style={{
        fontSize: 9, fontFamily: 'monospace', textTransform: 'uppercase',
        letterSpacing: '0.08em', color: 'rgba(255,255,255,0.22)',
      }}>
        {label}
      </div>
    </div>
  )
}

// ─── Completion ───────────────────────────────────────────────────────────────
const TIERS = [
  { min: 90, label: 'Elite',               color: '#fbbf24', glow: 'rgba(251,191,36,0.22)'  },
  { min: 75, label: 'Strong',              color: '#4ade80', glow: 'rgba(74,222,128,0.20)'  },
  { min: 50, label: 'Needs Work',          color: '#38bdf8', glow: 'rgba(56,189,248,0.18)'  },
  { min:  0, label: 'Restart Recommended', color: '#f87171', glow: 'rgba(248,113,113,0.18)' },
]
function getTier(s) { return TIERS.find(t => s >= t.min) }

export default function Completion({
  bestScore,
  quizAnswers,
  quizOrder,
  skillOverall,
  totalScore,
  modulesDone,
  projectsDone,
  challengesDone,
  totalModules,
  onRestart,
  onBeginAssessment,
  onReviewAnswers,
}) {
  const isMobile = useMobile()
  const score   = totalScore ?? skillOverall  // fallback for safety
  const tier    = getTier(score)
  const hasQuiz  = quizOrder && quizOrder.length > 0 && Object.keys(quizAnswers).length > 0
  const weak     = hasQuiz ? weakModules(quizAnswers, quizOrder) : []
  const hasWeak  = weak.length > 0

  // Staggered entrance
  const [orbIn,      setOrbIn]      = useState(false)
  const [contentIn,  setContentIn]  = useState(false)
  const [statsIn,    setStatsIn]    = useState(false)
  const [displayPct, setDisplayPct] = useState(0)
  const [barPct,     setBarPct]     = useState(0)

  useEffect(() => {
    const t1 = setTimeout(() => setOrbIn(true),     300)
    const t2 = setTimeout(() => setContentIn(true),  700)
    const t3 = setTimeout(() => setStatsIn(true),    950)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [])

  // Count-up animation on totalScore
  useEffect(() => {
    if (!orbIn) return
    let rafId, start = null
    const duration = 1200
    function tick(ts) {
      if (!start) start = ts
      const p     = Math.min((ts - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setDisplayPct(Math.round(eased * score))
      setBarPct(Math.round(eased * score))
      if (p < 1) rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [orbIn, score])

  const N = totalModules

  return (
    <div style={{
      position: 'relative', zIndex: 2,
      height: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      color: '#f0eeff', padding: isMobile ? '24px 20px' : '40px 32px',
      overflowY: 'auto',
    }}>
      <div style={{ maxWidth: 520, width: '100%', textAlign: 'center' }}>

        {/* ── Orb ── */}
        <div style={{
          width: isMobile ? 130 : 152, height: isMobile ? 130 : 152,
          borderRadius: '50%', margin: '0 auto 36px',
          border: `1px solid ${tier.color}44`,
          background: 'rgba(10,8,22,0.80)',
          backdropFilter: 'blur(14px)',
          boxShadow: [
            `0 0 0 1px ${tier.color}33`,
            `0 0 55px ${tier.glow}`,
            `0 0 110px ${tier.glow}`,
            '0 8px 36px rgba(0,0,0,0.50)',
          ].join(', '),
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          opacity:   orbIn ? 1 : 0,
          transform: orbIn ? 'scale(1)' : 'scale(0.68)',
          transition: 'opacity 0.55s ease-out, transform 0.70s cubic-bezier(0.34,1.56,0.64,1)',
        }}>
          {/* Checkmark */}
          <svg
            style={{
              width: isMobile ? 28 : 32, height: isMobile ? 28 : 32,
              color: '#4ade80', marginBottom: 8,
              opacity: orbIn ? 1 : 0,
              transform: orbIn ? 'scale(1)' : 'scale(0.5)',
              transition: 'opacity 0.35s ease-out 0.35s, transform 0.45s cubic-bezier(0.34,1.56,0.64,1) 0.35s',
            }}
            fill="none" stroke="currentColor" strokeWidth={2.2}
            strokeLinecap="round" strokeLinejoin="round"
            viewBox="0 0 24 24"
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>

          {/* Score */}
          <span style={{
            fontSize: isMobile ? 26 : 30, fontWeight: 700, fontFamily: 'monospace',
            color: tier.color, lineHeight: 1,
          }}>
            {displayPct}%
          </span>
          <span style={{
            fontSize: 10, fontFamily: 'monospace',
            color: 'rgba(255,255,255,0.28)', marginTop: 4,
          }}>
            total score
          </span>
        </div>

        {/* ── Heading + subtext ── */}
        <div style={{
          opacity:   contentIn ? 1 : 0,
          transform: contentIn ? 'translateY(0)' : 'translateY(14px)',
          transition: 'opacity 0.40s ease-out, transform 0.40s ease-out',
        }}>
          <h1 style={{
            fontSize: isMobile ? 22 : 27, fontWeight: 700, color: '#ede9fe',
            letterSpacing: '-0.5px', marginBottom: 10, lineHeight: 1.2,
          }}>
            All Modules Complete
          </h1>

          {/* Tier badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '4px 12px', borderRadius: 9999, marginBottom: 16,
            border: `1px solid ${tier.color}44`,
            background: `${tier.color}12`,
          }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: tier.color, boxShadow: `0 0 5px ${tier.color}` }} />
            <span style={{ fontSize: 11, fontFamily: 'monospace', fontWeight: 700, color: tier.color, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              {tier.label}
            </span>
          </div>

          {/* Score progress bar */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ height: 3, borderRadius: 9999, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: 9999,
                background: tier.color,
                width: `${barPct}%`,
                transition: 'width 0.05s linear',
                boxShadow: `0 0 8px ${tier.glow}`,
              }} />
            </div>
          </div>

          <p style={{
            fontSize: isMobile ? 13 : 14, color: 'rgba(255,255,255,0.38)',
            lineHeight: 1.75, maxWidth: 400, margin: '0 auto 28px',
          }}>
            You have worked through every lesson, project, and challenge. That is the hard part. Everything from here is consolidation.
          </p>
        </div>

        {/* ── Stat tiles ── */}
        <div style={{
          display: 'flex', gap: 8, marginBottom: 32,
          opacity:   statsIn ? 1 : 0,
          transform: statsIn ? 'translateY(0)' : 'translateY(10px)',
          transition: 'opacity 0.38s ease-out, transform 0.38s ease-out',
        }}>
          <StatTile label="Modules"    value={`${modulesDone.size}/${N}`}    done={modulesDone.size >= N}    isMobile={isMobile} />
          <StatTile label="Projects"   value={`${projectsDone.size}/${N}`}   done={projectsDone.size >= N}   isMobile={isMobile} />
          <StatTile label="Challenges" value={`${challengesDone.size}/${N}`} done={challengesDone.size >= N} isMobile={isMobile} />
          <StatTile label="Quiz Best"  value={bestScore > 0 ? `${bestScore}%` : '—'} done={bestScore >= 90} isMobile={isMobile} />
        </div>

        {/* ── Actions ── */}
        <div style={{
          display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'stretch',
          opacity:   statsIn ? 1 : 0,
          transform: statsIn ? 'translateY(0)' : 'translateY(10px)',
          transition: 'opacity 0.38s ease-out 0.08s, transform 0.38s ease-out 0.08s',
        }}>

          {/* Primary: assessment CTA */}
          <button
            onClick={onBeginAssessment}
            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.03)'; e.currentTarget.style.boxShadow = '0 0 36px rgba(124,58,237,0.42)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)';   e.currentTarget.style.boxShadow = '0 0 22px rgba(124,58,237,0.28)' }}
            style={{
              padding: isMobile ? '14px 24px' : '12px 24px',
              fontSize: isMobile ? 15 : 14, fontWeight: 600, borderRadius: 10,
              border: 'none', cursor: 'pointer',
              background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
              color: '#fff',
              boxShadow: '0 0 22px rgba(124,58,237,0.28)',
              transition: 'transform 0.15s ease, box-shadow 0.2s ease',
              minHeight: isMobile ? 52 : 'auto',
            }}
          >
            {hasQuiz ? 'Retake Assessment →' : 'Begin Assessment →'}
          </button>

          {/* Secondary row */}
          <div style={{
            display: 'flex', gap: 8,
            flexDirection: isMobile ? 'column' : 'row',
          }}>

            {/* Review Weak Areas */}
            <button
              onClick={hasQuiz ? onReviewAnswers : onBeginAssessment}
              onMouseEnter={e => {
                if (hasWeak || !hasQuiz) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.10)'
                  e.currentTarget.style.color = '#fff'
                }
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = hasWeak ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)'
                e.currentTarget.style.color = hasWeak ? 'rgba(255,255,255,0.62)' : 'rgba(255,255,255,0.22)'
              }}
              style={{
                flex: 1,
                padding: isMobile ? '12px 16px' : '9px 16px',
                fontSize: isMobile ? 14 : 13, fontWeight: 500, borderRadius: 8,
                border: `1px solid ${hasWeak ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.06)'}`,
                background: hasWeak ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)',
                color: hasWeak ? 'rgba(255,255,255,0.62)' : 'rgba(255,255,255,0.22)',
                cursor: hasWeak || !hasQuiz ? 'pointer' : 'default',
                transition: 'all 0.15s ease',
                minHeight: isMobile ? 48 : 'auto',
                position: 'relative',
              }}
            >
              {!hasQuiz
                ? 'Review Weak Areas'
                : hasWeak
                  ? `Review Weak Areas${weak.length > 0 ? ` (${weak.length})` : ''}`
                  : '✓ No Weak Areas'}
            </button>

            {/* Restart */}
            <button
              onClick={onRestart}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.50)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.color = 'rgba(255,255,255,0.28)' }}
              style={{
                flex: 1,
                padding: isMobile ? '12px 16px' : '9px 16px',
                fontSize: isMobile ? 14 : 13, fontWeight: 500, borderRadius: 8,
                border: '1px solid rgba(255,255,255,0.08)',
                background: 'rgba(255,255,255,0.03)',
                color: 'rgba(255,255,255,0.28)', cursor: 'pointer',
                transition: 'all 0.15s ease',
                minHeight: isMobile ? 48 : 'auto',
              }}
            >
              Restart Course
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
