import { useState, useEffect } from 'react'
import { useMobile } from './useMobile'

const LETTERS = ['A', 'B', 'C', 'D']
const BORDER  = 'rgba(255,255,255,0.095)'
const GLASS   = 'rgba(14,11,28,0.96)'

const TYPE_STYLE = {
  concept:   { color: '#a78bfa', bg: 'rgba(124,58,237,0.10)',  border: 'rgba(124,58,237,0.22)' },
  practical: { color: '#67e8f9', bg: 'rgba(8,145,178,0.10)',   border: 'rgba(34,211,238,0.22)' },
  scenario:  { color: '#fbbf24', bg: 'rgba(120,80,0,0.10)',    border: 'rgba(251,191,36,0.22)' },
}

export default function FinalExam({ questions, examIndex, examAnswers, onAnswer, onNext, onBack }) {
  const [visible, setVisible] = useState(false)
  const isMobile = useMobile()

  useEffect(() => {
    setVisible(false)
    const t = setTimeout(() => setVisible(true), 30)
    return () => clearTimeout(t)
  }, [examIndex])

  if (!questions.length) return null

  function advance() { setVisible(false); setTimeout(onNext, 200) }
  function retreat()  { setVisible(false); setTimeout(onBack, 200) }

  const total    = questions.length
  const q        = questions[examIndex]
  const selected = examAnswers[examIndex]
  const answered  = selected !== undefined
  const correct   = answered && selected === q.correct
  const isLast    = examIndex === total - 1
  const ts        = TYPE_STYLE[q.type] ?? TYPE_STYLE.concept

  function optionStyle(i) {
    if (!answered) {
      const sel = selected === i
      return {
        border:     sel ? '1px solid rgba(245,158,11,0.50)' : '1px solid rgba(255,255,255,0.07)',
        background: sel ? 'rgba(245,158,11,0.10)'           : 'rgba(255,255,255,0.025)',
        color:      sel ? '#fcd34d'                         : 'rgba(255,255,255,0.58)',
        boxShadow:  sel ? '0 0 22px rgba(245,158,11,0.10)'  : 'none',
      }
    }
    const right = i === q.correct
    const wrong = i === selected && !right
    if (right) return { border: '1px solid rgba(74,222,128,0.40)', background: 'rgba(12,38,20,0.72)', color: '#86efac',  boxShadow: '0 0 16px rgba(74,222,128,0.12)' }
    if (wrong) return { border: '1px solid rgba(248,113,113,0.40)', background: 'rgba(38,12,12,0.72)', color: '#fca5a5', boxShadow: 'none' }
    return       { border: '1px solid rgba(255,255,255,0.04)', background: 'rgba(255,255,255,0.01)', color: 'rgba(255,255,255,0.22)', boxShadow: 'none' }
  }

  function letterStyle(i) {
    if (!answered) {
      const sel = selected === i
      return {
        border:     sel ? '1px solid rgba(245,158,11,0.70)' : '1px solid rgba(255,255,255,0.15)',
        background: sel ? 'rgba(245,158,11,0.20)'           : 'transparent',
        color:      sel ? '#fcd34d'                         : 'rgba(255,255,255,0.35)',
      }
    }
    const right = i === q.correct
    const wrong = i === selected && !right
    if (right) return { border: '1px solid rgba(74,222,128,0.50)',  background: 'rgba(74,222,128,0.14)',  color: '#4ade80' }
    if (wrong) return { border: '1px solid rgba(248,113,113,0.50)', background: 'rgba(248,113,113,0.14)', color: '#f87171' }
    return       { border: '1px solid rgba(255,255,255,0.08)', background: 'transparent', color: 'rgba(255,255,255,0.18)' }
  }

  return (
    <div style={{ position: 'relative', zIndex: 2, height: '100vh', display: 'flex', flexDirection: 'column', color: '#f0eeff' }}>

      {/* ── Header ── */}
      <div style={{ padding: isMobile ? '12px 16px' : '14px 32px', borderBottom: `1px solid ${BORDER}`, background: GLASS, backdropFilter: 'blur(10px)', flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 7,
              background: 'linear-gradient(135deg, #d97706, #92400e)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ color: '#fff', fontSize: 13, fontWeight: 700 }}>✦</span>
            </div>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#ede9fe' }}>Final Exam</span>
            <span style={{
              fontSize: 10, fontFamily: 'monospace', letterSpacing: '0.06em',
              color: 'rgba(251,191,36,0.65)', background: 'rgba(245,158,11,0.08)',
              border: '1px solid rgba(245,158,11,0.18)', padding: '2px 8px', borderRadius: 5,
            }}>
              PASS AT 80%
            </span>
          </div>
          <span style={{ fontFamily: 'monospace', fontSize: 12, color: 'rgba(255,255,255,0.28)' }}>
            {examIndex + 1} / {total}
          </span>
        </div>

        {/* Amber progress bar */}
        <div style={{ height: 1, borderRadius: 9999, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: 9999,
            background: 'linear-gradient(90deg, #d97706, #fbbf24)',
            width: `${Math.round((examIndex / total) * 100)}%`,
            transition: 'width 0.5s ease-out',
            boxShadow: '0 0 8px rgba(245,158,11,0.38)',
          }} />
        </div>

        {/* Track dots */}
        <div style={{ display: 'flex', gap: 3, marginTop: 9 }}>
          {questions.map((_, i) => (
            <div key={i} style={{
              height: 2, flex: 1, borderRadius: 9999,
              background: i < examIndex   ? 'rgba(217,119,6,0.70)'
                        : i === examIndex ? 'rgba(251,191,36,0.60)'
                        : 'rgba(255,255,255,0.06)',
              transition: 'background 0.3s',
            }} />
          ))}
        </div>
      </div>

      {/* ── Question ── */}
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', overflowY: 'auto', padding: isMobile ? '20px 16px' : '32px' }}>
        <div style={{
          maxWidth: 620, width: '100%',
          opacity:   visible ? 1 : 0,
          transform: visible ? 'translateY(0) scale(1)' : 'translateY(12px) scale(0.984)',
          transition: 'opacity 0.22s ease-out, transform 0.22s ease-out',
        }}>

          {/* Badges */}
          <div style={{ marginBottom: 18, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <span style={{
              fontSize: 11, fontFamily: 'monospace', color: '#fbbf24',
              background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.22)',
              padding: '3px 10px', borderRadius: 6,
            }}>
              {q.module}
            </span>
            <span style={{
              fontSize: 10, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.08em',
              color: ts.color, background: ts.bg, border: `1px solid ${ts.border}`,
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
              '0 0 80px rgba(100,50,0,0.08)',
              'inset 0 1px 0 rgba(255,255,255,0.08)',
              'inset 0 -1px 0 rgba(0,0,0,0.18)',
            ].join(', '),
            padding: isMobile ? '20px 16px' : '28px',
          }}>
            <h2 style={{ fontSize: isMobile ? 16 : 18, fontWeight: 600, color: '#ede9fe', letterSpacing: '-0.3px', lineHeight: 1.5, marginBottom: 20 }}>
              {q.question}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {q.options.map((opt, i) => {
                const os = optionStyle(i)
                const ls = letterStyle(i)
                return (
                  <button
                    key={i}
                    onClick={() => { if (!answered) onAnswer(examIndex, i) }}
                    onMouseEnter={e => {
                      if (!answered && selected !== i) {
                        e.currentTarget.style.background  = 'rgba(255,255,255,0.045)'
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.13)'
                        e.currentTarget.style.color       = 'rgba(255,255,255,0.82)'
                      }
                    }}
                    onMouseLeave={e => {
                      if (!answered && selected !== i) {
                        e.currentTarget.style.background  = os.background
                        e.currentTarget.style.borderColor = ''
                        e.currentTarget.style.color       = os.color
                      }
                    }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 14,
                      padding: isMobile ? '14px 14px' : '13px 16px', borderRadius: 10,
                      minHeight: isMobile ? 52 : 'auto',
                      cursor: answered ? 'default' : 'pointer',
                      textAlign: 'left', fontSize: 14, lineHeight: 1.5,
                      transition: 'all 0.18s ease', ...os,
                    }}
                  >
                    <span style={{
                      width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 11, fontWeight: 600, fontFamily: 'monospace',
                      transition: 'all 0.18s ease', ...ls,
                    }}>
                      {LETTERS[i]}
                    </span>
                    {opt}
                  </button>
                )
              })}
            </div>

            {/* Feedback */}
            {answered && (
              <div style={{
                marginTop: 16, borderRadius: 10,
                padding: isMobile ? '13px 14px' : '14px 16px',
                background: correct ? 'rgba(12,38,20,0.80)' : 'rgba(38,12,12,0.80)',
                border: `1px solid ${correct ? 'rgba(74,222,128,0.24)' : 'rgba(248,113,113,0.24)'}`,
                display: 'flex', gap: 12, alignItems: 'flex-start',
                animation: 'examFeedIn 0.22s ease-out',
              }}>
                <span style={{ fontSize: 16, lineHeight: 1, flexShrink: 0, marginTop: 1, color: correct ? '#4ade80' : '#f87171' }}>
                  {correct ? '✓' : '✗'}
                </span>
                <div>
                  <p style={{ fontSize: 12, fontWeight: 600, fontFamily: 'monospace', color: correct ? '#4ade80' : '#f87171', marginBottom: 5 }}>
                    {correct ? 'Correct!' : `Incorrect — ${LETTERS[q.correct]} was right`}
                  </p>
                  <p style={{ fontSize: isMobile ? 12.5 : 13, color: 'rgba(255,255,255,0.58)', lineHeight: 1.65 }}>
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
        flexShrink: 0,
        padding: isMobile ? '12px 16px' : '14px 32px',
        paddingBottom: `calc(${isMobile ? 12 : 14}px + env(safe-area-inset-bottom, 0px))`,
        borderTop: `1px solid ${BORDER}`,
        background: GLASS,
        backdropFilter: 'blur(10px)',
      }}>
        <div style={{ maxWidth: 620, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            onClick={retreat}
            disabled={examIndex === 0}
            onMouseEnter={e => { if (examIndex > 0) e.currentTarget.style.color = 'rgba(255,255,255,0.68)' }}
            onMouseLeave={e => { e.currentTarget.style.color = examIndex === 0 ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.38)' }}
            style={{
              padding: isMobile ? '11px 14px' : '7px 14px', fontSize: isMobile ? 14 : 13, borderRadius: 8,
              color: examIndex === 0 ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.38)',
              background: 'none', border: 'none', cursor: examIndex === 0 ? 'not-allowed' : 'pointer',
              transition: 'color 0.15s', minHeight: isMobile ? 44 : 'auto',
            }}
          >
            ← Previous
          </button>

          <span style={{ fontFamily: 'monospace', fontSize: 12, color: 'rgba(255,255,255,0.20)' }}>
            {examIndex + 1} / {total}
          </span>

          <button
            onClick={advance}
            disabled={!answered}
            onMouseEnter={e => { if (answered) e.currentTarget.style.transform = 'scale(1.04)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}
            style={{
              padding: isMobile ? '11px 20px' : '7px 18px', fontSize: isMobile ? 14 : 13,
              fontWeight: 500, borderRadius: 8, border: 'none',
              cursor: answered ? 'pointer' : 'not-allowed',
              background: answered ? 'linear-gradient(135deg, #d97706, #92400e)' : 'rgba(255,255,255,0.05)',
              color: answered ? '#fff' : 'rgba(255,255,255,0.20)',
              animation: answered ? 'examPulse 2.6s ease-in-out infinite' : 'none',
              transition: 'background 0.2s, color 0.2s, transform 0.15s',
              minHeight: isMobile ? 44 : 'auto',
            }}
          >
            {isLast ? 'Submit →' : 'Next →'}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes examPulse {
          0%,100% { box-shadow: 0 0 18px rgba(217,119,6,0.32); }
          50%      { box-shadow: 0 0 32px rgba(217,119,6,0.55), 0 0 52px rgba(217,119,6,0.18); }
        }
        @keyframes examFeedIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
