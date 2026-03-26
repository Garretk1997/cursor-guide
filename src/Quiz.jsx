import { useState, useEffect } from 'react'
import { QUIZ_QUESTIONS } from './quizData'

const LETTERS = ['A', 'B', 'C', 'D']

const BORDER  = 'rgba(255,255,255,0.055)'
const GLASS_H = 'rgba(5,4,14,0.93)'

export default function Quiz({ quizIndex, quizAnswers, onAnswer, onNext, onBack }) {
  const [visible, setVisible] = useState(false)

  // Fade in whenever the question changes
  useEffect(() => {
    setVisible(false)
    const t = setTimeout(() => setVisible(true), 30)
    return () => clearTimeout(t)
  }, [quizIndex])

  function advance() {
    setVisible(false)
    setTimeout(onNext, 200)
  }

  function retreat() {
    setVisible(false)
    setTimeout(onBack, 200)
  }

  const q         = QUIZ_QUESTIONS[quizIndex]
  const selected  = quizAnswers[quizIndex]
  const hasAnswer = selected !== undefined
  const isLast    = quizIndex === QUIZ_QUESTIONS.length - 1
  const total     = QUIZ_QUESTIONS.length

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
        background: GLASS_H,
        backdropFilter: 'blur(10px)',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 7, background: '#7c3aed',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ color: '#fff', fontSize: 12, fontWeight: 700 }}>C</span>
            </div>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#ede9fe' }}>Final Assessment</span>
          </div>
          <span style={{ fontFamily: 'monospace', fontSize: 12, color: 'rgba(255,255,255,0.28)' }}>
            Question {quizIndex + 1} of {total}
          </span>
        </div>

        {/* Global progress bar */}
        <div style={{ height: 1, borderRadius: 9999, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: 9999,
            background: 'linear-gradient(90deg, #6d28d9, #a78bfa)',
            width: `${Math.round((quizIndex / total) * 100)}%`,
            transition: 'width 0.5s ease-out',
            boxShadow: '0 0 8px rgba(139,92,246,0.5)',
          }} />
        </div>

        {/* Question track dots */}
        <div style={{ display: 'flex', gap: 3, marginTop: 9 }}>
          {QUIZ_QUESTIONS.map((_, i) => (
            <div key={i} style={{
              height: 2, flex: 1, borderRadius: 9999,
              background: i < quizIndex   ? 'rgba(124,58,237,0.7)'
                        : i === quizIndex ? 'rgba(167,139,250,0.6)'
                        : 'rgba(255,255,255,0.06)',
              transition: 'background 0.3s',
            }} />
          ))}
        </div>
      </div>

      {/* ── Question area ── */}
      <main style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflowY: 'auto', padding: '32px',
      }}>
        <div style={{
          maxWidth: 620, width: '100%',
          opacity:   visible ? 1 : 0,
          transform: visible ? 'translateY(0) scale(1)' : 'translateY(12px) scale(0.984)',
          transition: 'opacity 0.22s ease-out, transform 0.22s ease-out',
        }}>

          {/* Module badge */}
          <div style={{ marginBottom: 22 }}>
            <span style={{
              fontSize: 11, fontFamily: 'monospace', color: '#a78bfa',
              background: 'rgba(124,58,237,0.10)',
              border: '1px solid rgba(124,58,237,0.22)',
              padding: '3px 10px', borderRadius: 6,
            }}>
              {q.module}
            </span>
          </div>

          {/* Card */}
          <div style={{
            borderRadius: 14,
            background: 'linear-gradient(150deg, rgba(22,16,42,0.91) 0%, rgba(11,8,25,0.96) 100%)',
            border: '1px solid rgba(255,255,255,0.065)',
            backdropFilter: 'blur(20px) saturate(1.2)',
            boxShadow: [
              '0 4px 32px rgba(0,0,0,0.42)',
              '0 0 80px rgba(76,36,160,0.10)',
              'inset 0 1px 0 rgba(255,255,255,0.08)',
              'inset 0 -1px 0 rgba(0,0,0,0.18)',
            ].join(', '),
            padding: '28px',
          }}>
            <h2 style={{
              fontSize: 18, fontWeight: 600, color: '#ede9fe',
              letterSpacing: '-0.3px', lineHeight: 1.5, marginBottom: 24,
            }}>
              {q.question}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {q.options.map((opt, i) => {
                const isSelected = selected === i
                return (
                  <button
                    key={i}
                    onClick={() => onAnswer(quizIndex, i)}
                    onMouseEnter={e => {
                      if (!isSelected) {
                        e.currentTarget.style.background    = 'rgba(255,255,255,0.045)'
                        e.currentTarget.style.borderColor   = 'rgba(255,255,255,0.13)'
                        e.currentTarget.style.color         = 'rgba(255,255,255,0.82)'
                      }
                    }}
                    onMouseLeave={e => {
                      if (!isSelected) {
                        e.currentTarget.style.background    = 'rgba(255,255,255,0.025)'
                        e.currentTarget.style.borderColor   = 'rgba(255,255,255,0.07)'
                        e.currentTarget.style.color         = 'rgba(255,255,255,0.58)'
                      }
                    }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 14,
                      padding: '13px 16px', borderRadius: 10,
                      border: isSelected ? '1px solid rgba(139,92,246,0.50)' : '1px solid rgba(255,255,255,0.07)',
                      background: isSelected ? 'rgba(124,58,237,0.16)' : 'rgba(255,255,255,0.025)',
                      color: isSelected ? '#c4b5fd' : 'rgba(255,255,255,0.58)',
                      cursor: 'pointer', textAlign: 'left', fontSize: 14, lineHeight: 1.5,
                      transition: 'all 0.15s ease',
                      boxShadow: isSelected ? '0 0 22px rgba(124,58,237,0.14)' : 'none',
                    }}
                  >
                    {/* Letter bubble */}
                    <span style={{
                      width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 11, fontWeight: 600, fontFamily: 'monospace',
                      border: isSelected ? '1px solid rgba(139,92,246,0.70)' : '1px solid rgba(255,255,255,0.15)',
                      background: isSelected ? 'rgba(124,58,237,0.25)' : 'transparent',
                      color: isSelected ? '#a78bfa' : 'rgba(255,255,255,0.35)',
                      transition: 'all 0.15s ease',
                    }}>
                      {LETTERS[i]}
                    </span>
                    {opt}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <div style={{
        flexShrink: 0, padding: '14px 32px',
        borderTop: `1px solid ${BORDER}`,
        background: GLASS_H, backdropFilter: 'blur(10px)',
      }}>
        <div style={{
          maxWidth: 620, margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <button
            onClick={retreat}
            disabled={quizIndex === 0}
            onMouseEnter={e => { if (quizIndex > 0) e.currentTarget.style.color = 'rgba(255,255,255,0.68)' }}
            onMouseLeave={e => { e.currentTarget.style.color = quizIndex === 0 ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.38)' }}
            style={{
              padding: '7px 14px', fontSize: 13, borderRadius: 8,
              color: quizIndex === 0 ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.38)',
              background: 'none', border: 'none',
              cursor: quizIndex === 0 ? 'not-allowed' : 'pointer',
              transition: 'color 0.15s',
            }}
          >
            ← Previous
          </button>

          <span style={{ fontFamily: 'monospace', fontSize: 12, color: 'rgba(255,255,255,0.20)' }}>
            {quizIndex + 1} / {total}
          </span>

          <button
            onClick={advance}
            disabled={!hasAnswer}
            onMouseEnter={e => { if (hasAnswer) e.currentTarget.style.transform = 'scale(1.04)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}
            style={{
              padding: '7px 18px', fontSize: 13, fontWeight: 500, borderRadius: 8,
              border: 'none', cursor: hasAnswer ? 'pointer' : 'not-allowed',
              background: hasAnswer ? 'linear-gradient(135deg, #7c3aed, #6d28d9)' : 'rgba(255,255,255,0.05)',
              color: hasAnswer ? '#fff' : 'rgba(255,255,255,0.20)',
              animation: hasAnswer ? 'next-pulse 2.6s ease-in-out infinite' : 'none',
              transition: 'background 0.2s ease, color 0.2s ease, transform 0.15s ease',
            }}
          >
            {isLast ? 'Submit →' : 'Next →'}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes next-pulse {
          0%,100% { box-shadow: 0 0 18px rgba(124,58,237,0.32); }
          50%     { box-shadow: 0 0 32px rgba(124,58,237,0.56), 0 0 52px rgba(124,58,237,0.18); }
        }
      `}</style>
    </div>
  )
}
