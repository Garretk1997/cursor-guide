import { useState } from 'react'

// ─── Inline style injection (once per page) ───────────────────────────────────
const ANIM_ID = 'step-content-keyframes'
if (typeof document !== 'undefined' && !document.getElementById(ANIM_ID)) {
  const s = document.createElement('style')
  s.id = ANIM_ID
  s.textContent = `
    @keyframes scSlideUp {
      from { opacity: 0; transform: translateY(14px); }
      to   { opacity: 1; transform: translateY(0);    }
    }
    @keyframes quizCorrect {
      0%   { box-shadow: 0 0 0 0 rgba(74,222,128,0.00); }
      25%  { box-shadow: 0 0 0 6px rgba(74,222,128,0.22), 0 0 28px rgba(74,222,128,0.10); }
      100% { box-shadow: 0 0 0 0 rgba(74,222,128,0.00); }
    }
    @keyframes quizWrong {
      0%,100% { transform: translateX(0); }
      18%     { transform: translateX(-5px); }
      36%     { transform: translateX(5px); }
      54%     { transform: translateX(-3px); }
      72%     { transform: translateX(3px); }
    }
    @keyframes optionPop {
      0%   { transform: scale(1); }
      45%  { transform: scale(1.015); }
      100% { transform: scale(1); }
    }
  `
  document.head.appendChild(s)
}

// ─── ImagePlaceholder ─────────────────────────────────────────────────────────
function ImagePlaceholder({ label }) {
  return (
    <div style={{
      marginTop: 20, borderRadius: 12,
      border: '1px dashed rgba(255,255,255,0.08)',
      background: 'rgba(10,8,22,0.60)',
      height: 176,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: 8, userSelect: 'none',
    }}>
      <svg style={{ width: 26, height: 26, color: 'rgba(255,255,255,0.12)' }}
        fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 19.5h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
      </svg>
      <span style={{ fontSize: 11, fontFamily: 'monospace', color: 'rgba(255,255,255,0.18)' }}>
        {label}
      </span>
    </div>
  )
}

// ─── TipBox ───────────────────────────────────────────────────────────────────
function TipBox({ tip, isMobile }) {
  return (
    <div style={{
      marginTop: 16, borderRadius: 10,
      border: '1px solid rgba(245,158,11,0.20)',
      background: 'rgba(245,158,11,0.07)',
      padding: isMobile ? '12px 14px' : '12px 16px',
      animation: 'scSlideUp 0.32s ease-out both',
      animationDelay: '0.08s',
    }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <span style={{
          fontSize: 13, lineHeight: 1, marginTop: 1, flexShrink: 0,
          filter: 'saturate(1.2)',
        }}>
          💡
        </span>
        <div>
          <span style={{
            display: 'block', fontSize: 9, fontFamily: 'monospace', fontWeight: 700,
            color: 'rgba(245,158,11,0.70)', letterSpacing: '0.10em',
            textTransform: 'uppercase', marginBottom: 5,
          }}>
            Pro Tip
          </span>
          <p style={{ fontSize: isMobile ? 12.5 : 13, color: 'rgba(255,255,255,0.48)', lineHeight: 1.65, margin: 0 }}>
            {tip}
          </p>
        </div>
      </div>
    </div>
  )
}

// ─── InlineQuiz ───────────────────────────────────────────────────────────────
const LETTERS = ['A', 'B', 'C', 'D']

function InlineQuiz({ quiz, isMobile, initialAnswer, onAnswer }) {
  const [selected, setSelected] = useState(initialAnswer ?? null)
  const answered = selected !== null
  const isCorrect = selected === quiz.correct

  function optionStyle(i) {
    const base = {
      width: '100%', display: 'flex', alignItems: 'center', gap: 10,
      padding: isMobile ? '10px 12px' : '9px 12px',
      borderRadius: 8, marginBottom: 6, cursor: answered ? 'default' : 'pointer',
      textAlign: 'left', fontSize: isMobile ? 13 : 12.5,
      transition: 'background 0.15s, border-color 0.15s',
      border: '1px solid rgba(255,255,255,0.07)',
      background: 'rgba(255,255,255,0.03)',
      color: 'rgba(255,255,255,0.45)',
    }
    if (!answered) return base
    if (i === quiz.correct) return { ...base, background: 'rgba(12,38,20,0.80)', border: '1px solid rgba(74,222,128,0.30)', color: '#86efac' }
    if (i === selected)     return { ...base, background: 'rgba(38,12,12,0.70)', border: '1px solid rgba(239,68,68,0.25)', color: '#fca5a5' }
    return { ...base, opacity: 0.4 }
  }

  function letterStyle(i) {
    const base = {
      width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 9, fontFamily: 'monospace', fontWeight: 700,
      border: '1px solid rgba(139,92,246,0.25)', color: 'rgba(167,139,250,0.55)',
      background: 'rgba(124,58,237,0.08)',
    }
    if (!answered) return base
    if (i === quiz.correct) return { ...base, background: 'rgba(34,197,94,0.20)', border: '1px solid rgba(74,222,128,0.40)', color: '#86efac' }
    if (i === selected)     return { ...base, background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.30)', color: '#fca5a5' }
    return base
  }

  return (
    <div style={{
      marginTop: 14, borderRadius: 10,
      border: '1px solid rgba(139,92,246,0.16)',
      background: 'rgba(124,58,237,0.05)',
      padding: isMobile ? '14px 14px' : '14px 16px',
      animation: 'scSlideUp 0.32s ease-out both',
      animationDelay: '0.18s',
    }}>
      <span style={{
        display: 'block', fontSize: 9, fontFamily: 'monospace', fontWeight: 700,
        color: 'rgba(167,139,250,0.60)', letterSpacing: '0.10em',
        textTransform: 'uppercase', marginBottom: 10,
      }}>
        Quick Check
      </span>

      <p style={{ fontSize: isMobile ? 13 : 13, color: 'rgba(255,255,255,0.65)', lineHeight: 1.55, marginBottom: 12 }}>
        {quiz.question}
      </p>

      {quiz.options.map((opt, i) => (
        <button
          key={i}
          onClick={() => { if (!answered) { setSelected(i); onAnswer?.(i) } }}
          style={optionStyle(i)}
          onMouseEnter={e => { if (!answered) e.currentTarget.style.background = 'rgba(124,58,237,0.10)' }}
          onMouseLeave={e => { if (!answered) e.currentTarget.style.background = 'rgba(255,255,255,0.03)' }}
        >
          <span style={letterStyle(i)}>{LETTERS[i]}</span>
          <span style={{ flex: 1 }}>{opt}</span>
          {answered && i === quiz.correct && (
            <span style={{ fontSize: 12, color: '#86efac', flexShrink: 0 }}>✓</span>
          )}
          {answered && i === selected && i !== quiz.correct && (
            <span style={{ fontSize: 12, color: '#fca5a5', flexShrink: 0 }}>✗</span>
          )}
        </button>
      ))}

      {answered && (
        <p style={{
          fontSize: 11.5, color: isCorrect ? 'rgba(134,239,172,0.65)' : 'rgba(252,165,165,0.65)',
          marginTop: 4, fontFamily: 'monospace',
          animation: 'scSlideUp 0.22s ease-out both',
        }}>
          {isCorrect
            ? 'Correct! Move on when ready.'
            : `Not quite — ${LETTERS[quiz.correct]} is the right answer.`}
        </p>
      )}
    </div>
  )
}

// ─── TaskCard ─────────────────────────────────────────────────────────────────
function TaskCard({ task, isMobile }) {
  const [done, setDone] = useState(false)

  return (
    <div style={{
      marginTop: 14, borderRadius: 10,
      border: `1px solid ${done ? 'rgba(34,211,238,0.22)' : 'rgba(6,182,212,0.16)'}`,
      background: done ? 'rgba(6,182,212,0.07)' : 'rgba(6,182,212,0.04)',
      padding: isMobile ? '14px 14px' : '14px 16px',
      animation: 'scSlideUp 0.32s ease-out both',
      animationDelay: '0.28s',
      transition: 'background 0.25s, border-color 0.25s',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <span style={{
            display: 'block', fontSize: 9, fontFamily: 'monospace', fontWeight: 700,
            color: done ? 'rgba(34,211,238,0.60)' : 'rgba(34,211,238,0.50)',
            letterSpacing: '0.10em', textTransform: 'uppercase', marginBottom: 8,
          }}>
            Try It Now
          </span>
          <p style={{
            fontSize: isMobile ? 13 : 12.5,
            color: done ? 'rgba(255,255,255,0.38)' : 'rgba(255,255,255,0.50)',
            lineHeight: 1.65, margin: 0,
            overflowWrap: 'anywhere',
            textDecoration: done ? 'line-through' : 'none',
            transition: 'color 0.2s',
          }}>
            {task}
          </p>
        </div>

        <button
          onClick={() => setDone(d => !d)}
          style={{
            flexShrink: 0,
            width: 26, height: 26, borderRadius: '50%',
            border: `1px solid ${done ? 'rgba(34,211,238,0.45)' : 'rgba(6,182,212,0.28)'}`,
            background: done ? 'rgba(6,182,212,0.20)' : 'transparent',
            color: done ? '#22d3ee' : 'rgba(6,182,212,0.40)',
            cursor: 'pointer', fontSize: 13, lineHeight: 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s ease',
            marginTop: 2,
          }}
          title={done ? 'Mark as incomplete' : 'Mark as done'}
        >
          {done ? '✓' : '○'}
        </button>
      </div>
    </div>
  )
}

// ─── StepContent ──────────────────────────────────────────────────────────────
export default function StepContent({ step, stepIndex, isMobile, quizAnswer, onQuizAnswer }) {
  const cardBorder = 'rgba(255,255,255,0.065)'

  return (
    <>
      {/* Main step card */}
      <div style={{
        borderRadius: 14,
        background: 'linear-gradient(150deg, rgba(22,16,42,0.91) 0%, rgba(11,8,25,0.96) 100%)',
        border: `1px solid ${cardBorder}`,
        padding: isMobile ? '20px 16px' : '24px',
        backdropFilter: 'blur(20px) saturate(1.2)',
        boxShadow: [
          '0 4px 32px rgba(0,0,0,0.42)',
          '0 0 80px rgba(76,36,160,0.10)',
          'inset 0 1px 0 rgba(255,255,255,0.08)',
          'inset 0 -1px 0 rgba(0,0,0,0.18)',
        ].join(', '),
      }}>
        <div style={{ display: 'flex', gap: isMobile ? 12 : 16, alignItems: 'flex-start' }}>
          {/* Step number */}
          <div style={{
            width: isMobile ? 30 : 36, height: isMobile ? 30 : 36,
            borderRadius: '50%', flexShrink: 0,
            border: '1px solid rgba(139,92,246,0.35)',
            background: 'rgba(124,58,237,0.10)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginTop: 2,
          }}>
            <span style={{ fontSize: 12, fontFamily: 'monospace', color: '#a78bfa' }}>
              {stepIndex + 1}
            </span>
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 style={{
              fontSize: isMobile ? 16 : 18, fontWeight: 600, color: '#ede9fe',
              letterSpacing: '-0.3px', lineHeight: 1.35, marginBottom: 10,
              overflowWrap: 'anywhere',
            }}>
              {step.title}
            </h2>
            <p style={{
              fontSize: isMobile ? 13 : 14, color: 'rgba(255,255,255,0.42)', lineHeight: 1.7, whiteSpace: 'pre-line',
              overflowWrap: 'anywhere',
            }}>
              {step.description}
            </p>
            {step.hasImage && <ImagePlaceholder label={step.title} />}
          </div>
        </div>
      </div>

      {/* Staggered extras */}
      {step.tip  && <TipBox    tip={step.tip}   isMobile={isMobile} />}
      {step.quiz && <InlineQuiz quiz={step.quiz} isMobile={isMobile} initialAnswer={quizAnswer} onAnswer={onQuizAnswer} />}
      {step.task && <TaskCard   task={step.task} isMobile={isMobile} />}
    </>
  )
}
