import { useState, useEffect } from 'react'
import { QUIZ_QUESTIONS } from './quizData'
import { useMobile } from './useMobile'

export default function Results({ quizAnswers, onReview, onRestart, onStay }) {
  const isMobile = useMobile()
  const score  = QUIZ_QUESTIONS.reduce((n, q, i) => quizAnswers[i] === q.correct ? n + 1 : n, 0)
  const pct    = Math.round((score / QUIZ_QUESTIONS.length) * 100)
  const passed = pct >= 90

  const [revealed,    setRevealed]    = useState(false)
  const [contentIn,   setContentIn]   = useState(false)
  const [displayPct,  setDisplayPct]  = useState(0)

  // Staggered entrance
  useEffect(() => {
    const t1 = setTimeout(() => setRevealed(true),  380)
    const t2 = setTimeout(() => setContentIn(true), 680)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  // Count-up animation — starts when circle is revealed
  useEffect(() => {
    if (!revealed) return
    let rafId
    let start = null
    const duration = 1100
    function tick(ts) {
      if (!start) start = ts
      const p     = Math.min((ts - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)   // ease-out cubic
      setDisplayPct(Math.round(eased * pct))
      if (p < 1) rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [revealed, pct])

  const accentColor  = passed ? '#86efac' : '#fbbf24'
  const accentBg     = passed ? 'rgba(14,46,24,0.72)' : 'rgba(46,30,6,0.72)'
  const accentBorder = passed ? 'rgba(74,222,128,0.32)' : 'rgba(251,191,36,0.28)'
  const accentGlow   = passed ? 'rgba(74,222,128,0.20)' : 'rgba(251,191,36,0.14)'

  return (
    <div style={{
      position: 'relative', zIndex: 2,
      height: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      color: '#f0eeff', padding: isMobile ? '24px 20px' : '32px',
      overflowY: 'auto',
    }}>
      <div style={{ maxWidth: 480, width: '100%', textAlign: 'center' }}>

        {/* ── Score circle ── */}
        <div style={{
          width: isMobile ? 130 : 152, height: isMobile ? 130 : 152, borderRadius: '50%',
          border: `1px solid ${accentBorder}`,
          background: accentBg,
          backdropFilter: 'blur(14px)',
          boxShadow: [
            `0 0 0 1px ${accentBorder}`,
            `0 0 55px ${accentGlow}`,
            `0 0 110px ${accentGlow}`,
            '0 8px 36px rgba(0,0,0,0.45)',
          ].join(', '),
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 40px',
          opacity:   revealed ? 1 : 0,
          transform: revealed ? 'scale(1)' : 'scale(0.70)',
          transition: 'opacity 0.50s ease-out, transform 0.65s cubic-bezier(0.34,1.56,0.64,1)',
        }}>
          <span style={{
            fontSize: isMobile ? 34 : 40, fontWeight: 700, fontFamily: 'monospace',
            color: accentColor, lineHeight: 1,
          }}>
            {displayPct}%
          </span>
          <span style={{
            fontSize: 12, fontFamily: 'monospace',
            color: 'rgba(255,255,255,0.32)', marginTop: 6,
          }}>
            {score} / {QUIZ_QUESTIONS.length}
          </span>
        </div>

        {/* ── Heading + message ── */}
        <div style={{
          opacity:   contentIn ? 1 : 0,
          transform: contentIn ? 'translateY(0)' : 'translateY(12px)',
          transition: 'opacity 0.38s ease-out, transform 0.38s ease-out',
        }}>
          <h1 style={{
            fontSize: isMobile ? 20 : 24, fontWeight: 700, color: '#ede9fe',
            letterSpacing: '-0.4px', marginBottom: 12,
          }}>
            {passed ? 'Course Complete' : 'Almost There'}
          </h1>

          <p style={{
            fontSize: 14, color: 'rgba(255,255,255,0.42)', lineHeight: 1.75,
            maxWidth: 380, margin: '0 auto 34px',
          }}>
            {passed
              ? 'You passed the assessment. You have demonstrated a solid understanding of the material and are ready to move forward.'
              : `You scored ${pct}% — just below the 90% passing threshold. Reviewing the answers may help reinforce the concepts.`
            }
          </p>

          {/* ── Buttons ── */}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'stretch' : 'center' }}>
            {/* Review */}
            <button
              onClick={onReview}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.10)'; e.currentTarget.style.color = '#fff' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.62)' }}
              style={{
                padding: isMobile ? '13px 18px' : '8px 18px',
                fontSize: isMobile ? 14 : 13, fontWeight: 500, borderRadius: 8,
                border: '1px solid rgba(255,255,255,0.12)',
                background: 'rgba(255,255,255,0.06)',
                color: 'rgba(255,255,255,0.62)', cursor: 'pointer',
                transition: 'all 0.15s ease',
                minHeight: isMobile ? 48 : 'auto',
              }}
            >
              Review Answers
            </button>

            {/* Stay Here — only shown when failed */}
            {!passed && (
              <button
                onClick={onStay}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(255,255,255,0.68)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'rgba(255,255,255,0.42)' }}
                style={{
                  padding: isMobile ? '13px 18px' : '8px 18px',
                  fontSize: isMobile ? 14 : 13, fontWeight: 500, borderRadius: 8,
                  border: '1px solid rgba(255,255,255,0.08)',
                  background: 'rgba(255,255,255,0.04)',
                  color: 'rgba(255,255,255,0.42)', cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  minHeight: isMobile ? 48 : 'auto',
                }}
              >
                Stay Here
              </button>
            )}

            {/* Restart */}
            <button
              onClick={onRestart}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}
              style={{
                padding: isMobile ? '13px 18px' : '8px 18px',
                fontSize: isMobile ? 14 : 13, fontWeight: 500, borderRadius: 8,
                border: 'none', cursor: 'pointer',
                background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                color: '#fff',
                boxShadow: '0 0 22px rgba(124,58,237,0.28)',
                transition: 'transform 0.15s ease',
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
