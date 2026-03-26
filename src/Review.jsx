import { useState, useEffect } from 'react'
import { QUIZ_QUESTIONS } from './quizData'

const LETTERS  = ['A', 'B', 'C', 'D']
const BORDER   = 'rgba(255,255,255,0.055)'
const GLASS_H  = 'rgba(5,4,14,0.93)'

export default function Review({ quizAnswers, onRestart, onBack }) {
  const score  = QUIZ_QUESTIONS.reduce((n, q, i) => quizAnswers[i] === q.correct ? n + 1 : n, 0)
  const pct    = Math.round((score / QUIZ_QUESTIONS.length) * 100)
  const passed = pct >= 90

  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 40)
    return () => clearTimeout(t)
  }, [])

  return (
    <div style={{
      position: 'relative', zIndex: 2,
      height: '100vh', display: 'flex', flexDirection: 'column',
      color: '#f0eeff',
    }}>

      {/* ── Header ── */}
      <div style={{
        padding: '14px 32px',
        borderBottom: `1px solid ${BORDER}`,
        background: GLASS_H, backdropFilter: 'blur(10px)',
        flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 7, background: '#7c3aed',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ color: '#fff', fontSize: 12, fontWeight: 700 }}>C</span>
          </div>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#ede9fe' }}>Answer Review</span>
        </div>
        <span style={{
          fontFamily: 'monospace', fontSize: 12,
          color: passed ? 'rgba(134,239,172,0.70)' : 'rgba(251,191,36,0.70)',
        }}>
          {score} / {QUIZ_QUESTIONS.length} correct — {pct}%
        </span>
      </div>

      {/* ── Scrollable review list ── */}
      <main style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{
          maxWidth: 640, margin: '0 auto', padding: '28px 32px 72px',
          opacity:   visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(10px)',
          transition: 'opacity 0.30s ease-out, transform 0.30s ease-out',
        }}>
          {QUIZ_QUESTIONS.map((q, qi) => {
            const userAnswer  = quizAnswers[qi]
            const isCorrect   = userAnswer === q.correct

            return (
              <div key={qi} style={{
                borderRadius: 12,
                background: isCorrect
                  ? 'rgba(12,38,20,0.72)'
                  : 'rgba(38,12,12,0.72)',
                border: `1px solid ${isCorrect ? 'rgba(74,222,128,0.17)' : 'rgba(248,113,113,0.17)'}`,
                backdropFilter: 'blur(10px)',
                padding: '18px 20px',
                marginBottom: 10,
              }}>

                {/* Question header */}
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 14 }}>
                  <span style={{
                    fontSize: 15, flexShrink: 0, marginTop: 1,
                    color: isCorrect ? '#4ade80' : '#f87171',
                  }}>
                    {isCorrect ? '✓' : '✗'}
                  </span>
                  <div style={{ flex: 1 }}>
                    <span style={{
                      fontSize: 10, fontFamily: 'monospace',
                      color: 'rgba(255,255,255,0.26)',
                      display: 'block', marginBottom: 4,
                    }}>
                      Q{qi + 1} · {q.module}
                    </span>
                    <span style={{ fontSize: 14, color: '#ede9fe', lineHeight: 1.55 }}>
                      {q.question}
                    </span>
                  </div>
                </div>

                {/* Options */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5, paddingLeft: 28 }}>
                  {q.options.map((opt, oi) => {
                    const isRight     = oi === q.correct
                    const isUserPick  = oi === userAnswer
                    const isWrongPick = isUserPick && !isRight

                    let color  = 'rgba(255,255,255,0.20)'
                    if (isRight)     color = '#4ade80'
                    if (isWrongPick) color = '#f87171'

                    return (
                      <div key={oi} style={{
                        display: 'flex', gap: 8, alignItems: 'flex-start',
                        fontSize: 13, color,
                        fontWeight: isRight || isWrongPick ? 500 : 400,
                      }}>
                        <span style={{ fontFamily: 'monospace', flexShrink: 0, opacity: 0.55 }}>
                          {LETTERS[oi]}
                        </span>
                        <span style={{ flex: 1 }}>{opt}</span>
                        {isRight    && <span style={{ fontSize: 10, opacity: 0.65, flexShrink: 0 }}>correct</span>}
                        {isWrongPick && <span style={{ fontSize: 10, opacity: 0.65, flexShrink: 0 }}>your answer</span>}
                      </div>
                    )
                  })}
                </div>

              </div>
            )
          })}
        </div>
      </main>

      {/* ── Footer ── */}
      <div style={{
        flexShrink: 0, padding: '14px 32px',
        borderTop: `1px solid ${BORDER}`,
        background: GLASS_H, backdropFilter: 'blur(10px)',
      }}>
        <div style={{
          maxWidth: 640, margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <button
            onClick={onBack}
            onMouseEnter={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.70)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.38)' }}
            style={{
              padding: '7px 14px', fontSize: 13, borderRadius: 8,
              color: 'rgba(255,255,255,0.38)',
              background: 'none', border: 'none', cursor: 'pointer',
              transition: 'color 0.15s',
            }}
          >
            ← Back to Results
          </button>

          <button
            onClick={onRestart}
            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}
            style={{
              padding: '7px 18px', fontSize: 13, fontWeight: 500, borderRadius: 8,
              border: 'none', cursor: 'pointer',
              background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
              color: '#fff',
              boxShadow: '0 0 20px rgba(124,58,237,0.25)',
              transition: 'transform 0.15s ease',
            }}
          >
            Restart Course
          </button>
        </div>
      </div>
    </div>
  )
}
