import { useState, useEffect } from 'react'
import { useMobile } from './useMobile'

const PASS_THRESHOLD = 80

export default function ExamResults({ examQuestions, examAnswers, onRetake, onContinue }) {
  const isMobile = useMobile()

  const total   = examQuestions.length
  const correct = examQuestions.filter((q, i) => examAnswers[i] === q.correct).length
  const pct     = total > 0 ? Math.round((correct / total) * 100) : 0
  const passed  = pct >= PASS_THRESHOLD

  // ── Weak area detection ──────────────────────────────────────────────────────
  const moduleResults = {}
  examQuestions.forEach((q, i) => {
    if (!moduleResults[q.module]) moduleResults[q.module] = { total: 0, correct: 0 }
    moduleResults[q.module].total++
    if (examAnswers[i] === q.correct) moduleResults[q.module].correct++
  })
  const weakModules = Object.entries(moduleResults).filter(([, r]) => r.correct < r.total)

  // ── Entrance animation ───────────────────────────────────────────────────────
  const [orbIn,      setOrbIn]      = useState(false)
  const [contentIn,  setContentIn]  = useState(false)
  const [displayPct, setDisplayPct] = useState(0)
  const [barPct,     setBarPct]     = useState(0)

  useEffect(() => {
    const t1 = setTimeout(() => setOrbIn(true),    350)
    const t2 = setTimeout(() => setContentIn(true), 700)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  useEffect(() => {
    if (!orbIn) return
    let rafId, start = null
    const duration = 1100
    function tick(ts) {
      if (!start) start = ts
      const p     = Math.min((ts - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setDisplayPct(Math.round(eased * pct))
      setBarPct(Math.round(eased * pct))
      if (p < 1) rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [orbIn, pct])

  const accentColor  = passed ? '#4ade80'               : '#fbbf24'
  const accentGlow   = passed ? 'rgba(74,222,128,0.20)' : 'rgba(251,191,36,0.18)'
  const accentBorder = passed ? 'rgba(74,222,128,0.32)' : 'rgba(251,191,36,0.28)'

  return (
    <div style={{
      position: 'relative', zIndex: 2,
      height: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      color: '#f0eeff',
      padding: isMobile ? '24px 20px' : '32px',
      paddingBottom: `calc(${isMobile ? 24 : 32}px + env(safe-area-inset-bottom, 0px))`,
      overflowY: 'auto',
    }}>
      <div style={{ maxWidth: 500, width: '100%', textAlign: 'center' }}>

        {/* ── Orb ── */}
        <div style={{
          width: isMobile ? 128 : 148, height: isMobile ? 128 : 148,
          borderRadius: '50%', margin: '0 auto 36px',
          border: `1px solid ${accentBorder}`,
          background: 'rgba(10,8,22,0.80)',
          backdropFilter: 'blur(14px)',
          boxShadow: [
            `0 0 0 1px ${accentBorder}`,
            `0 0 55px ${accentGlow}`,
            `0 0 110px ${accentGlow}`,
            '0 8px 36px rgba(0,0,0,0.50)',
          ].join(', '),
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          opacity:   orbIn ? 1 : 0,
          transform: orbIn ? 'scale(1)' : 'scale(0.68)',
          transition: 'opacity 0.55s ease-out, transform 0.70s cubic-bezier(0.34,1.56,0.64,1)',
        }}>
          {passed && (
            <svg style={{
              width: isMobile ? 26 : 30, height: isMobile ? 26 : 30,
              color: '#4ade80', marginBottom: 6,
              opacity:   orbIn ? 1 : 0,
              transform: orbIn ? 'scale(1)' : 'scale(0.5)',
              transition: 'opacity 0.35s ease-out 0.35s, transform 0.45s cubic-bezier(0.34,1.56,0.64,1) 0.35s',
            }}
              fill="none" stroke="currentColor" strokeWidth={2.2}
              strokeLinecap="round" strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <path d="M20 6L9 17l-5-5" />
            </svg>
          )}
          <span style={{
            fontSize: isMobile ? 28 : 34, fontWeight: 700, fontFamily: 'monospace',
            color: accentColor, lineHeight: 1,
          }}>
            {displayPct}%
          </span>
          <span style={{ fontSize: 10, fontFamily: 'monospace', color: 'rgba(255,255,255,0.28)', marginTop: 4 }}>
            {correct} / {total}
          </span>
        </div>

        {/* ── Content ── */}
        <div style={{
          opacity:   contentIn ? 1 : 0,
          transform: contentIn ? 'translateY(0)' : 'translateY(14px)',
          transition: 'opacity 0.38s ease-out, transform 0.38s ease-out',
        }}>
          <h1 style={{
            fontSize: isMobile ? 20 : 25, fontWeight: 700, color: '#ede9fe',
            letterSpacing: '-0.4px', marginBottom: 8, lineHeight: 1.2,
          }}>
            {passed ? 'Exam Passed' : 'Not Quite Yet'}
          </h1>

          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '4px 12px', borderRadius: 9999, marginBottom: 18,
            border: `1px solid ${accentBorder}`,
            background: passed ? 'rgba(74,222,128,0.07)' : 'rgba(251,191,36,0.07)',
          }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: accentColor, boxShadow: `0 0 5px ${accentColor}` }} />
            <span style={{
              fontSize: 11, fontFamily: 'monospace', fontWeight: 700,
              color: accentColor, letterSpacing: '0.08em', textTransform: 'uppercase',
            }}>
              {passed ? `Passed — ${pct}%` : `${pct}% — Need 80%`}
            </span>
          </div>

          {/* Score bar with 80% threshold marker */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ position: 'relative', height: 3, borderRadius: 9999, background: 'rgba(255,255,255,0.06)' }}>
              <div style={{
                height: '100%', borderRadius: 9999,
                background: accentColor,
                width: `${barPct}%`,
                transition: 'width 0.05s linear',
                boxShadow: `0 0 8px ${accentGlow}`,
              }} />
              {/* Threshold marker at 80% */}
              <div style={{
                position: 'absolute', top: -5, left: '80%',
                width: 1, height: 13,
                background: 'rgba(255,255,255,0.22)',
                transform: 'translateX(-50%)',
              }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 5 }}>
              <span style={{ fontSize: 9, fontFamily: 'monospace', color: 'rgba(255,255,255,0.20)' }}>
                80% to pass
              </span>
            </div>
          </div>

          {/* Description */}
          <p style={{
            fontSize: isMobile ? 13 : 14, color: 'rgba(255,255,255,0.38)',
            lineHeight: 1.75, maxWidth: 400, margin: '0 auto 28px',
          }}>
            {passed
              ? 'You have demonstrated a solid command of Cursor. Continue to see your full course results.'
              : 'Review the sections where you lost points, then retake when you are ready.'}
          </p>

          {/* Weak area cards (fail only) */}
          {!passed && weakModules.length > 0 && (
            <div style={{ marginBottom: 28, textAlign: 'left' }}>
              <p style={{
                fontSize: 10, fontFamily: 'monospace', fontWeight: 700,
                color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase',
                letterSpacing: '0.10em', marginBottom: 10, textAlign: 'center',
              }}>
                Modules to Review
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                {weakModules.map(([modName, r]) => (
                  <button
                    key={modName}
                    onClick={() => onContinue(modName)}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(245,158,11,0.10)'; e.currentTarget.style.borderColor = 'rgba(245,158,11,0.28)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(245,158,11,0.05)'; e.currentTarget.style.borderColor = 'rgba(245,158,11,0.16)' }}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: isMobile ? '12px 14px' : '10px 14px',
                      borderRadius: 9, border: '1px solid rgba(245,158,11,0.16)',
                      background: 'rgba(245,158,11,0.05)',
                      cursor: 'pointer', textAlign: 'left',
                      transition: 'background 0.15s, border-color 0.15s',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{
                        width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 11, background: 'rgba(245,158,11,0.12)',
                        border: '1px solid rgba(245,158,11,0.28)', color: '#fbbf24',
                      }}>
                        ✗
                      </span>
                      <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)' }}>{modName}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                      <span style={{
                        fontSize: 10, fontFamily: 'monospace',
                        color: r.correct === 0 ? '#f87171' : 'rgba(251,191,36,0.70)',
                      }}>
                        {r.correct}/{r.total}
                      </span>
                      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.22)' }}>→</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Action buttons ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {passed ? (
              <>
                <button
                  onClick={() => onContinue(null)}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.03)'; e.currentTarget.style.boxShadow = '0 0 36px rgba(74,222,128,0.35)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)';   e.currentTarget.style.boxShadow = '0 0 22px rgba(74,222,128,0.20)' }}
                  style={{
                    padding: isMobile ? '14px 24px' : '11px 28px',
                    fontSize: isMobile ? 15 : 14, fontWeight: 600, borderRadius: 10,
                    border: '1px solid rgba(74,222,128,0.35)',
                    background: 'rgba(74,222,128,0.12)',
                    color: '#4ade80', cursor: 'pointer',
                    transition: 'transform 0.15s, box-shadow 0.2s',
                    boxShadow: '0 0 22px rgba(74,222,128,0.20)',
                    minHeight: isMobile ? 52 : 'auto',
                  }}
                >
                  View Results →
                </button>
                <button
                  onClick={onRetake}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(255,255,255,0.55)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'rgba(255,255,255,0.28)' }}
                  style={{
                    padding: isMobile ? '12px 24px' : '9px 24px',
                    fontSize: isMobile ? 14 : 13, fontWeight: 500, borderRadius: 8,
                    border: '1px solid rgba(255,255,255,0.08)',
                    background: 'rgba(255,255,255,0.04)',
                    color: 'rgba(255,255,255,0.28)', cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    minHeight: isMobile ? 48 : 'auto',
                  }}
                >
                  Retake to Improve
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={onRetake}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.03)'; e.currentTarget.style.boxShadow = '0 0 36px rgba(217,119,6,0.45)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)';   e.currentTarget.style.boxShadow = '0 0 22px rgba(217,119,6,0.28)' }}
                  style={{
                    padding: isMobile ? '14px 24px' : '11px 28px',
                    fontSize: isMobile ? 15 : 14, fontWeight: 600, borderRadius: 10,
                    border: 'none',
                    background: 'linear-gradient(135deg, #d97706, #92400e)',
                    color: '#fff', cursor: 'pointer',
                    transition: 'transform 0.15s, box-shadow 0.2s',
                    boxShadow: '0 0 22px rgba(217,119,6,0.28)',
                    minHeight: isMobile ? 52 : 'auto',
                  }}
                >
                  Retake Exam →
                </button>
                <button
                  onClick={() => onContinue(null)}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(255,255,255,0.55)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'rgba(255,255,255,0.28)' }}
                  style={{
                    padding: isMobile ? '12px 24px' : '9px 24px',
                    fontSize: isMobile ? 14 : 13, fontWeight: 500, borderRadius: 8,
                    border: '1px solid rgba(255,255,255,0.08)',
                    background: 'rgba(255,255,255,0.04)',
                    color: 'rgba(255,255,255,0.28)', cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    minHeight: isMobile ? 48 : 'auto',
                  }}
                >
                  Back to Course
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
