import { useState, useEffect } from 'react'
import { QUIZ_QUESTIONS } from './quizData'
import { useMobile } from './useMobile'

const LETTERS = ['A', 'B', 'C', 'D']
const BORDER  = 'rgba(255,255,255,0.055)'
const GLASS_H = 'rgba(5,4,14,0.93)'

const TYPE_STYLE = {
  concept:   { color: '#a78bfa', bg: 'rgba(124,58,237,0.10)',  border: 'rgba(124,58,237,0.22)' },
  practical: { color: '#67e8f9', bg: 'rgba(8,145,178,0.10)',   border: 'rgba(34,211,238,0.22)' },
  scenario:  { color: '#fbbf24', bg: 'rgba(120,80,0,0.10)',    border: 'rgba(251,191,36,0.22)' },
}

export default function Quiz({ quizIndex, quizAnswers, onAnswer, onNext, onBack, quizOrder }) {
  const [visible, setVisible] = useState(false)
  const isMobile = useMobile()

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

  const order    = quizOrder && quizOrder.length > 0 ? quizOrder : QUIZ_QUESTIONS.map((_, i) => i)
  const total    = order.length
  const q        = QUIZ_QUESTIONS[order[quizIndex]]
  const selected = quizAnswers[quizIndex]
  const answered = selected !== undefined
  const isCorrectAnswer = answered && selected === q.correct
  const isLast   = quizIndex === total - 1

  const typeStyle = TYPE_STYLE[q.type] ?? TYPE_STYLE.concept

  function optionStyle(i) {
    if (!answered) {
      const isSel = selected === i
      return {
        border:     isSel ? '1px solid rgba(139,92,246,0.50)' : '1px solid rgba(255,255,255,0.07)',
        background: isSel ? 'rgba(124,58,237,0.16)'           : 'rgba(255,255,255,0.025)',
        color:      isSel ? '#c4b5fd'                         : 'rgba(255,255,255,0.58)',
        boxShadow:  isSel ? '0 0 22px rgba(124,58,237,0.14)'  : 'none',
      }
    }
    const isRight     = i === q.correct
    const isWrongPick = i === selected && !isRight
    if (isRight)     return { border: '1px solid rgba(74,222,128,0.40)', background: 'rgba(12,38,20,0.72)', color: '#86efac',              boxShadow: '0 0 16px rgba(74,222,128,0.12)' }
    if (isWrongPick) return { border: '1px solid rgba(248,113,113,0.40)', background: 'rgba(38,12,12,0.72)', color: '#fca5a5',             boxShadow: 'none' }
    return              { border: '1px solid rgba(255,255,255,0.04)', background: 'rgba(255,255,255,0.01)', color: 'rgba(255,255,255,0.22)', boxShadow: 'none' }
  }

  function letterStyle(i) {
    if (!answered) {
      const isSel = selected === i
      return {
        border:     isSel ? '1px solid rgba(139,92,246,0.70)' : '1px solid rgba(255,255,255,0.15)',
        background: isSel ? 'rgba(124,58,237,0.25)'           : 'transparent',
        color:      isSel ? '#a78bfa'                         : 'rgba(255,255,255,0.35)',
      }
    }
    const isRight     = i === q.correct
    const isWrongPick = i === selected && !isRight
    if (isRight)     return { border: '1px solid rgba(74,222,128,0.50)',  background: 'rgba(74,222,128,0.14)',  color: '#4ade80' }
    if (isWrongPick) return { border: '1px solid rgba(248,113,113,0.50)', background: 'rgba(248,113,113,0.14)', color: '#f87171' }
    return              { border: '1px solid rgba(255,255,255,0.08)', background: 'transparent', color: 'rgba(255,255,255,0.18)' }
  }

  return (
    <div style={{
      position: 'relative', zIndex: 2,
      height: '100vh', display: 'flex', flexDirection: 'column',
      color: '#f0eeff',
    }}>

      {/* ── Header ── */}
      <div style={{
        padding: isMobile ? '12px 16px' : '14px 32px',
        borderBottom: `1px solid ${BORDER}`,
        background: GLASS_H, backdropFilter: 'blur(10px)',
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

        {/* Progress bar */}
        <div style={{ height: 1, borderRadius: 9999, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: 9999,
            background: 'linear-gradient(90deg, #6d28d9, #a78bfa)',
            width: `${Math.round((quizIndex / total) * 100)}%`,
            transition: 'width 0.5s ease-out',
            boxShadow: '0 0 8px rgba(139,92,246,0.5)',
          }} />
        </div>

        {/* Track dots */}
        <div style={{ display: 'flex', gap: 3, marginTop: 9 }}>
          {order.map((_, i) => (
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
        overflowY: 'auto', padding: isMobile ? '20px 16px' : '32px',
      }}>
        <div style={{
          maxWidth: 620, width: '100%',
          opacity:   visible ? 1 : 0,
          transform: visible ? 'translateY(0) scale(1)' : 'translateY(12px) scale(0.984)',
          transition: 'opacity 0.22s ease-out, transform 0.22s ease-out',
        }}>

          {/* Badges row */}
          <div style={{ marginBottom: 18, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{
              fontSize: 11, fontFamily: 'monospace', color: '#a78bfa',
              background: 'rgba(124,58,237,0.10)',
              border: '1px solid rgba(124,58,237,0.22)',
              padding: '3px 10px', borderRadius: 6,
            }}>
              {q.module}
            </span>
            <span style={{
              fontSize: 10, fontFamily: 'monospace', textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: typeStyle.color, background: typeStyle.bg,
              border: `1px solid ${typeStyle.border}`,
              padding: '3px 8px', borderRadius: 6,
            }}>
              {q.type}
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
            padding: isMobile ? '20px 16px' : '28px',
          }}>
            <h2 style={{
              fontSize: isMobile ? 16 : 18, fontWeight: 600, color: '#ede9fe',
              letterSpacing: '-0.3px', lineHeight: 1.5, marginBottom: 20,
            }}>
              {q.question}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {q.options.map((opt, i) => {
                const oStyle = optionStyle(i)
                const lStyle = letterStyle(i)
                return (
                  <button
                    key={i}
                    onClick={() => { if (!answered) onAnswer(quizIndex, i) }}
                    onMouseEnter={e => {
                      if (!answered && selected !== i) {
                        e.currentTarget.style.background  = 'rgba(255,255,255,0.045)'
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.13)'
                        e.currentTarget.style.color       = 'rgba(255,255,255,0.82)'
                      }
                    }}
                    onMouseLeave={e => {
                      if (!answered && selected !== i) {
                        e.currentTarget.style.background  = oStyle.background
                        e.currentTarget.style.borderColor = ''
                        e.currentTarget.style.color       = oStyle.color
                      }
                    }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 14,
                      padding: isMobile ? '14px 14px' : '13px 16px', borderRadius: 10,
                      minHeight: isMobile ? 52 : 'auto',
                      cursor: answered ? 'default' : 'pointer',
                      textAlign: 'left', fontSize: 14, lineHeight: 1.5,
                      transition: 'all 0.18s ease',
                      ...oStyle,
                    }}
                  >
                    <span style={{
                      width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 11, fontWeight: 600, fontFamily: 'monospace',
                      transition: 'all 0.18s ease',
                      ...lStyle,
                    }}>
                      {LETTERS[i]}
                    </span>
                    {opt}
                  </button>
                )
              })}
            </div>

            {/* ── Feedback panel ── */}
            {answered && (
              <div style={{
                marginTop: 16, borderRadius: 10,
                padding: isMobile ? '13px 14px' : '14px 16px',
                background: isCorrectAnswer ? 'rgba(12,38,20,0.80)' : 'rgba(38,12,12,0.80)',
                border: `1px solid ${isCorrectAnswer ? 'rgba(74,222,128,0.24)' : 'rgba(248,113,113,0.24)'}`,
                display: 'flex', gap: 12, alignItems: 'flex-start',
                animation: 'feedbackIn 0.22s ease-out',
              }}>
                <span style={{
                  fontSize: 16, lineHeight: 1, flexShrink: 0, marginTop: 1,
                  color: isCorrectAnswer ? '#4ade80' : '#f87171',
                }}>
                  {isCorrectAnswer ? '✓' : '✗'}
                </span>
                <div>
                  <p style={{
                    fontSize: 12, fontWeight: 600, fontFamily: 'monospace',
                    color: isCorrectAnswer ? '#4ade80' : '#f87171',
                    marginBottom: 5,
                  }}>
                    {isCorrectAnswer
                      ? 'Correct!'
                      : `Incorrect — ${LETTERS[q.correct]} was right`}
                  </p>
                  <p style={{
                    fontSize: isMobile ? 12.5 : 13,
                    color: 'rgba(255,255,255,0.58)',
                    lineHeight: 1.65,
                  }}>
                    {q.explanation}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <div style={{
        flexShrink: 0, padding: isMobile ? '12px 16px' : '14px 32px',
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
              padding: isMobile ? '11px 14px' : '7px 14px',
              fontSize: isMobile ? 14 : 13, borderRadius: 8,
              color: quizIndex === 0 ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.38)',
              background: 'none', border: 'none',
              cursor: quizIndex === 0 ? 'not-allowed' : 'pointer',
              transition: 'color 0.15s',
              minHeight: isMobile ? 44 : 'auto',
            }}
          >
            ← Previous
          </button>

          <span style={{ fontFamily: 'monospace', fontSize: 12, color: 'rgba(255,255,255,0.20)' }}>
            {quizIndex + 1} / {total}
          </span>

          <button
            onClick={advance}
            disabled={!answered}
            onMouseEnter={e => { if (answered) e.currentTarget.style.transform = 'scale(1.04)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}
            style={{
              padding: isMobile ? '11px 20px' : '7px 18px',
              fontSize: isMobile ? 14 : 13, fontWeight: 500, borderRadius: 8,
              border: 'none', cursor: answered ? 'pointer' : 'not-allowed',
              background: answered ? 'linear-gradient(135deg, #7c3aed, #6d28d9)' : 'rgba(255,255,255,0.05)',
              color: answered ? '#fff' : 'rgba(255,255,255,0.20)',
              animation: answered ? 'next-pulse 2.6s ease-in-out infinite' : 'none',
              transition: 'background 0.2s ease, color 0.2s ease, transform 0.15s ease',
              minHeight: isMobile ? 44 : 'auto',
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
        @keyframes feedbackIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
