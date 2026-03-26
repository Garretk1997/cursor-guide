import { useState } from 'react'
import { CHALLENGES } from './challengeData'
import { useMobile } from './useMobile'

const BORDER = 'rgba(255,255,255,0.055)'
const GLASS  = 'rgba(5,4,14,0.93)'

// ─── Single challenge card ─────────────────────────────────────────────────────
function ChallengeCard({ challenge, idx, isDone, onComplete, isMobile }) {
  const [hintsOpen,  setHintsOpen]  = useState(false)
  const [hintCount,  setHintCount]  = useState(0)
  const [completing, setCompleting] = useState(false)
  const [checked,    setChecked]    = useState(isDone)

  const allRevealed = hintCount >= challenge.hints.length

  function handleCheck() {
    if (isDone || checked) return
    setChecked(true)
  }

  function handleMarkComplete() {
    if (isDone || completing) return
    setCompleting(true)
    setTimeout(() => onComplete(idx), 700)
  }

  const done = isDone || checked

  return (
    <div style={{
      borderRadius: 14,
      background: done
        ? 'linear-gradient(150deg, rgba(12,36,22,0.88) 0%, rgba(8,24,14,0.94) 100%)'
        : 'linear-gradient(150deg, rgba(22,16,42,0.88) 0%, rgba(11,8,25,0.94) 100%)',
      border: `1px solid ${done ? 'rgba(74,222,128,0.18)' : 'rgba(255,255,255,0.07)'}`,
      backdropFilter: 'blur(20px)',
      boxShadow: done
        ? '0 4px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(74,222,128,0.08)'
        : '0 4px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06)',
      overflow: 'hidden',
      transition: 'border-color 0.3s, box-shadow 0.3s, background 0.3s',
    }}>

      {/* ── Card header ── */}
      <div style={{ padding: isMobile ? '18px 16px' : '20px 24px' }}>
        {/* Badges row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
          <span style={{
            fontSize: 10, fontFamily: 'monospace', fontWeight: 700,
            color: done ? 'rgba(74,222,128,0.75)' : 'rgba(245,158,11,0.75)',
            background: done ? 'rgba(74,222,128,0.08)' : 'rgba(245,158,11,0.08)',
            border: `1px solid ${done ? 'rgba(74,222,128,0.20)' : 'rgba(245,158,11,0.20)'}`,
            padding: '3px 10px', borderRadius: 6,
            letterSpacing: '0.08em', textTransform: 'uppercase',
          }}>
            {done ? '✓ Completed' : '⚡ Challenge'}
          </span>
          <span style={{
            fontSize: 10, fontFamily: 'monospace',
            color: 'rgba(167,139,250,0.60)',
            background: 'rgba(124,58,237,0.07)',
            border: '1px solid rgba(124,58,237,0.16)',
            padding: '3px 10px', borderRadius: 6,
          }}>
            {challenge.module}
          </span>
        </div>

        {/* Title + checkbox row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 14 }}>
          {/* Checkbox */}
          <button
            onClick={handleCheck}
            disabled={done}
            title={done ? 'Completed' : 'Check off when done'}
            style={{
              flexShrink: 0,
              marginTop: 3,
              width: 22, height: 22, borderRadius: 6,
              border: `2px solid ${done ? 'rgba(74,222,128,0.55)' : 'rgba(255,255,255,0.18)'}`,
              background: done ? 'rgba(74,222,128,0.18)' : 'transparent',
              cursor: done ? 'default' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s ease',
              color: done ? '#4ade80' : 'transparent',
              fontSize: 12, fontWeight: 700,
            }}
            onMouseEnter={e => { if (!done) e.currentTarget.style.borderColor = 'rgba(74,222,128,0.45)' }}
            onMouseLeave={e => { if (!done) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)' }}
          >
            {done ? '✓' : ''}
          </button>

          <h3 style={{
            fontSize: isMobile ? 16 : 18, fontWeight: 600,
            color: done ? 'rgba(255,255,255,0.55)' : '#ede9fe',
            letterSpacing: '-0.3px', lineHeight: 1.3, flex: 1,
            textDecoration: done ? 'line-through' : 'none',
            textDecorationColor: 'rgba(255,255,255,0.25)',
            transition: 'color 0.3s',
          }}>
            {challenge.title}
          </h3>
        </div>

        {/* Goal */}
        <div style={{
          borderRadius: 10,
          background: done ? 'rgba(74,222,128,0.04)' : 'rgba(245,158,11,0.06)',
          border: `1px solid ${done ? 'rgba(74,222,128,0.12)' : 'rgba(245,158,11,0.16)'}`,
          padding: isMobile ? '14px 14px' : '14px 18px',
          marginBottom: 16,
        }}>
          <p style={{
            fontSize: 10, fontFamily: 'monospace', fontWeight: 700,
            color: done ? 'rgba(74,222,128,0.50)' : 'rgba(245,158,11,0.55)',
            textTransform: 'uppercase', letterSpacing: '0.10em', marginBottom: 8,
          }}>
            Your Goal
          </p>
          <p style={{
            fontSize: isMobile ? 13 : 13.5,
            color: done ? 'rgba(255,255,255,0.40)' : 'rgba(255,255,255,0.72)',
            lineHeight: 1.70,
          }}>
            {challenge.goal}
          </p>
        </div>

        {/* Hints toggle */}
        <button
          onClick={() => setHintsOpen(o => !o)}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'none', border: 'none', cursor: 'pointer',
            padding: '2px 0',
            color: hintsOpen ? 'rgba(167,139,250,0.80)' : 'rgba(255,255,255,0.28)',
            fontSize: 12, fontFamily: 'monospace',
            transition: 'color 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'rgba(167,139,250,0.80)'}
          onMouseLeave={e => e.currentTarget.style.color = hintsOpen ? 'rgba(167,139,250,0.80)' : 'rgba(255,255,255,0.28)'}
        >
          <span style={{
            display: 'inline-block',
            transform: hintsOpen ? 'rotate(90deg)' : 'rotate(0deg)',
            transition: 'transform 0.18s ease',
            fontSize: 10,
          }}>▶</span>
          {hintsOpen ? 'Hide Hints' : `Show Step Guidance (${challenge.hints.length} hints)`}
        </button>
      </div>

      {/* ── Hints panel ── */}
      {hintsOpen && (
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.055)',
          padding: isMobile ? '14px 16px' : '16px 24px',
          animation: 'chFadeIn 0.22s ease-out',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <p style={{
              fontSize: 10, fontFamily: 'monospace', fontWeight: 700,
              color: 'rgba(167,139,250,0.55)',
              textTransform: 'uppercase', letterSpacing: '0.10em',
            }}>
              Hints ({hintCount}/{challenge.hints.length})
            </p>
            {!allRevealed && (
              <button
                onClick={() => setHintCount(n => n + 1)}
                style={{
                  fontSize: 11, fontFamily: 'monospace',
                  color: 'rgba(167,139,250,0.70)',
                  background: 'rgba(124,58,237,0.08)',
                  border: '1px solid rgba(124,58,237,0.18)',
                  padding: '4px 10px', borderRadius: 6, cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(124,58,237,0.14)'; e.currentTarget.style.color = '#c4b5fd' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(124,58,237,0.08)'; e.currentTarget.style.color = 'rgba(167,139,250,0.70)' }}
              >
                Reveal hint {hintCount + 1} →
              </button>
            )}
            {allRevealed && (
              <span style={{ fontSize: 10, fontFamily: 'monospace', color: 'rgba(255,255,255,0.18)' }}>
                All hints shown
              </span>
            )}
          </div>

          {hintCount === 0 ? (
            <div style={{
              borderRadius: 8, border: '1px dashed rgba(255,255,255,0.07)',
              padding: '14px 16px', textAlign: 'center',
            }}>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.18)', fontFamily: 'monospace' }}>
                Try on your own first — reveal hints one at a time when stuck.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {challenge.hints.slice(0, hintCount).map((hint, hi) => (
                <div
                  key={hi}
                  style={{
                    display: 'flex', gap: 12, alignItems: 'flex-start',
                    borderRadius: 9,
                    background: 'rgba(124,58,237,0.06)',
                    border: '1px solid rgba(124,58,237,0.14)',
                    padding: isMobile ? '12px 12px' : '12px 14px',
                    animation: 'chFadeIn 0.22s ease-out',
                  }}
                >
                  <span style={{
                    fontSize: 9, fontFamily: 'monospace',
                    color: 'rgba(167,139,250,0.55)',
                    background: 'rgba(124,58,237,0.10)',
                    border: '1px solid rgba(124,58,237,0.20)',
                    padding: '2px 7px', borderRadius: 5,
                    flexShrink: 0, marginTop: 2, whiteSpace: 'nowrap',
                  }}>
                    {hi + 1}
                  </span>
                  <p style={{
                    fontSize: isMobile ? 12 : 12.5,
                    color: 'rgba(255,255,255,0.52)',
                    lineHeight: 1.68, flex: 1,
                  }}>
                    {hint}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Footer actions ── */}
      {!isDone && (
        <div style={{
          borderTop: `1px solid ${done ? 'rgba(74,222,128,0.12)' : 'rgba(255,255,255,0.055)'}`,
          padding: isMobile ? '14px 16px' : '14px 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
        }}>
          <p style={{ fontSize: 11, fontFamily: 'monospace', color: 'rgba(255,255,255,0.18)' }}>
            {done ? 'Challenge complete ✓' : checked ? 'Checkbox ticked — click to save progress' : 'Finish the challenge, then mark it complete'}
          </p>
          <button
            onClick={handleMarkComplete}
            disabled={completing || isDone}
            style={{
              flexShrink: 0,
              padding: isMobile ? '10px 18px' : '8px 18px',
              fontSize: 13, fontWeight: 500, borderRadius: 8, border: 'none',
              cursor: completing || isDone ? 'default' : 'pointer',
              background: completing
                ? 'linear-gradient(135deg, #16a34a, #15803d)'
                : 'linear-gradient(135deg, #7c3aed, #6d28d9)',
              color: '#fff',
              boxShadow: completing
                ? '0 0 20px rgba(22,163,74,0.30)'
                : '0 0 18px rgba(124,58,237,0.28)',
              transition: 'background 0.35s, box-shadow 0.35s, transform 0.15s',
              minHeight: isMobile ? 44 : 'auto',
              display: 'flex', alignItems: 'center', gap: 7,
            }}
            onMouseEnter={e => { if (!completing && !isDone) e.currentTarget.style.transform = 'scale(1.03)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}
          >
            {completing ? (
              <><span>✓</span> Done!</>
            ) : (
              'Mark as Complete'
            )}
          </button>
        </div>
      )}
    </div>
  )
}

// ─── ChallengesHub ─────────────────────────────────────────────────────────────
export default function ChallengesHub({ challengesDone, onComplete, onBack }) {
  const isMobile   = useMobile()
  const doneCount  = CHALLENGES.filter((_, i) => challengesDone.has(i)).length
  const totalCount = CHALLENGES.length

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
        background: GLASS, backdropFilter: 'blur(10px)',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 7,
              background: 'linear-gradient(135deg, #d97706, #92400e)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ color: '#fff', fontSize: 13, fontWeight: 700 }}>⚡</span>
            </div>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#ede9fe' }}>Challenges</span>
            <span style={{
              fontSize: 10, fontFamily: 'monospace',
              color: doneCount === totalCount ? 'rgba(74,222,128,0.70)' : 'rgba(255,255,255,0.28)',
              background: doneCount === totalCount ? 'rgba(74,222,128,0.08)' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${doneCount === totalCount ? 'rgba(74,222,128,0.20)' : 'rgba(255,255,255,0.10)'}`,
              padding: '2px 8px', borderRadius: 9999,
            }}>
              {doneCount}/{totalCount} complete
            </span>
          </div>

          <button
            onClick={onBack}
            style={{
              fontSize: 12, color: 'rgba(255,255,255,0.30)',
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '5px 8px', borderRadius: 6,
              transition: 'color 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.60)'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.30)'}
          >
            ← Back
          </button>
        </div>

        {/* Progress bar */}
        <div style={{ height: 2, borderRadius: 9999, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: 9999,
            background: doneCount === totalCount
              ? 'linear-gradient(90deg, #16a34a, #4ade80)'
              : 'linear-gradient(90deg, #d97706, #fbbf24)',
            width: `${totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0}%`,
            transition: 'width 0.6s ease-out',
            boxShadow: doneCount === totalCount
              ? '0 0 8px rgba(74,222,128,0.40)'
              : '0 0 8px rgba(245,158,11,0.38)',
          }} />
        </div>
      </div>

      {/* ── Scrollable content ── */}
      <main style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{
          maxWidth: 680, margin: '0 auto',
          padding: isMobile ? '24px 16px 0' : '36px 32px 0',
          paddingBottom: `calc(48px + env(safe-area-inset-bottom, 0px))`,
        }}>

          {/* Intro text */}
          <p style={{
            fontSize: isMobile ? 13 : 14,
            color: 'rgba(255,255,255,0.32)',
            lineHeight: 1.75, marginBottom: 32,
            maxWidth: 520,
          }}>
            Real-world tasks that put your skills to the test. Reveal hints one at a time, check the box when done, and mark each challenge complete.
          </p>

          {/* Challenge cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {CHALLENGES.map((ch, i) => (
              <ChallengeCard
                key={i}
                idx={i}
                challenge={ch}
                isDone={challengesDone.has(i)}
                onComplete={onComplete}
                isMobile={isMobile}
              />
            ))}
          </div>

          {/* All done state */}
          {doneCount === totalCount && (
            <div style={{
              marginTop: 32, borderRadius: 12,
              background: 'rgba(12,36,22,0.70)',
              border: '1px solid rgba(74,222,128,0.20)',
              padding: isMobile ? '20px 18px' : '22px 28px',
              textAlign: 'center',
              animation: 'chFadeIn 0.35s ease-out',
            }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>🏆</div>
              <p style={{ fontSize: isMobile ? 15 : 16, fontWeight: 600, color: '#4ade80', marginBottom: 6 }}>
                All Challenges Complete
              </p>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', lineHeight: 1.65 }}>
                You have completed every real-world challenge in this course.
              </p>
            </div>
          )}
        </div>
      </main>

      <style>{`
        @keyframes chFadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
