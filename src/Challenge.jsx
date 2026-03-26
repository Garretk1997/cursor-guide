import { useState, useEffect } from 'react'
import { CHALLENGES } from './challengeData'
import { useMobile } from './useMobile'

const BORDER  = 'rgba(255,255,255,0.055)'
const GLASS_H = 'rgba(5,4,14,0.93)'

// Amber accent — visually distinct from the violet project/course UI
const AMBER      = '#f59e0b'
const AMBER_DIM  = 'rgba(245,158,11,0.65)'
const AMBER_BG   = 'rgba(245,158,11,0.07)'
const AMBER_BDR  = 'rgba(245,158,11,0.20)'

export default function Challenge({ moduleIndex, challengesDone, onComplete, onSkip }) {
  const challenge   = CHALLENGES[moduleIndex]
  const isMobile    = useMobile()
  const alreadyDone = challengesDone.has(moduleIndex)

  const [visible,         setVisible]         = useState(false)
  const [hintsRevealed,   setHintsRevealed]   = useState(0)
  const [attempted,       setAttempted]       = useState(alreadyDone)  // pre-unlock if already done
  const [solutionVisible, setSolutionVisible] = useState(false)
  const [confirmSolution, setConfirmSolution] = useState(false)
  const [completing,      setCompleting]      = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 40)
    return () => clearTimeout(t)
  }, [moduleIndex])

  function revealNextHint() {
    if (hintsRevealed < challenge.hints.length) {
      setHintsRevealed(n => n + 1)
    }
  }

  function handleAttempt() {
    setAttempted(true)
    setConfirmSolution(false)
  }

  function handleRevealSolution() {
    if (!confirmSolution) {
      setConfirmSolution(true)  // first click — confirm step
    } else {
      setSolutionVisible(true)  // second click — reveal
      setConfirmSolution(false)
    }
  }

  function handleComplete() {
    if (completing) return
    setCompleting(true)
    setTimeout(onComplete, 800)
  }

  const allHintsShown = hintsRevealed >= challenge.hints.length
  const hintsLeft     = challenge.hints.length - hintsRevealed

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
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 7, background: '#7c3aed',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ color: '#fff', fontSize: 12, fontWeight: 700 }}>C</span>
          </div>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#ede9fe' }}>Challenge Mode</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {alreadyDone && (
            <span style={{
              fontSize: 10, fontFamily: 'monospace', color: 'rgba(74,222,128,0.65)',
              background: 'rgba(16,46,24,0.55)', border: '1px solid rgba(74,222,128,0.18)',
              padding: '2px 8px', borderRadius: 9999,
            }}>
              ✓ completed
            </span>
          )}
          <span style={{ fontSize: 11, fontFamily: 'monospace', color: 'rgba(255,255,255,0.22)' }}>
            Module {moduleIndex + 1} / 5
          </span>
        </div>
      </div>

      {/* ── Scrollable content ── */}
      <main style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{
          maxWidth: 640, margin: '0 auto',
          padding: isMobile ? '24px 16px 0' : '36px 32px 0',
          paddingBottom: `calc(80px + env(safe-area-inset-bottom, 0px))`,
          opacity:   visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(10px)',
          transition: 'opacity 0.30s ease-out, transform 0.30s ease-out',
        }}>

          {/* Badges row */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 18, flexWrap: 'wrap' }}>
            <span style={{
              fontSize: 10, fontFamily: 'monospace', fontWeight: 700,
              color: AMBER,
              background: AMBER_BG,
              border: `1px solid ${AMBER_BDR}`,
              padding: '3px 10px', borderRadius: 6,
              letterSpacing: '0.08em', textTransform: 'uppercase',
            }}>
              ⚡ Challenge
            </span>
            <span style={{
              fontSize: 10, fontFamily: 'monospace',
              color: 'rgba(167,139,250,0.70)',
              background: 'rgba(124,58,237,0.08)',
              border: '1px solid rgba(124,58,237,0.18)',
              padding: '3px 10px', borderRadius: 6,
            }}>
              {challenge.module}
            </span>
          </div>

          {/* Title */}
          <h1 style={{
            fontSize: isMobile ? 22 : 26, fontWeight: 700, color: '#ede9fe',
            letterSpacing: '-0.5px', lineHeight: 1.25, marginBottom: 24,
          }}>
            {challenge.title}
          </h1>

          {/* Goal card — amber-tinted, no instructions */}
          <div style={{
            borderRadius: 12,
            background: AMBER_BG,
            border: `1px solid ${AMBER_BDR}`,
            backdropFilter: 'blur(10px)',
            padding: isMobile ? '18px 16px' : '22px 24px',
            marginBottom: 28,
            boxShadow: `0 0 40px rgba(245,158,11,0.06)`,
          }}>
            <p style={{
              fontSize: 10, fontFamily: 'monospace',
              color: AMBER_DIM,
              textTransform: 'uppercase', letterSpacing: '0.10em',
              marginBottom: 10,
            }}>
              Your Goal
            </p>
            <p style={{
              fontSize: isMobile ? 14 : 15,
              color: 'rgba(255,255,255,0.84)',
              lineHeight: 1.72,
              fontWeight: 400,
            }}>
              {challenge.goal}
            </p>
          </div>

          {/* ── Hints section ── */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <p style={{
                fontSize: 10, fontFamily: 'monospace',
                color: 'rgba(255,255,255,0.22)',
                textTransform: 'uppercase', letterSpacing: '0.10em',
              }}>
                Hints ({hintsRevealed}/{challenge.hints.length})
              </p>
              {!allHintsShown && (
                <button
                  onClick={revealNextHint}
                  style={{
                    fontSize: 12, fontFamily: 'monospace',
                    color: 'rgba(167,139,250,0.70)',
                    background: 'rgba(124,58,237,0.08)',
                    border: '1px solid rgba(124,58,237,0.18)',
                    padding: '4px 10px', borderRadius: 6, cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.color = '#c4b5fd'
                    e.currentTarget.style.background = 'rgba(124,58,237,0.14)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.color = 'rgba(167,139,250,0.70)'
                    e.currentTarget.style.background = 'rgba(124,58,237,0.08)'
                  }}
                >
                  Show hint {hintsRevealed + 1} of {challenge.hints.length} →
                </button>
              )}
              {allHintsShown && (
                <span style={{ fontSize: 11, fontFamily: 'monospace', color: 'rgba(255,255,255,0.18)' }}>
                  All hints shown
                </span>
              )}
            </div>

            {/* Revealed hint cards */}
            {hintsRevealed === 0 && (
              <div style={{
                borderRadius: 10, border: '1px dashed rgba(255,255,255,0.07)',
                padding: '16px 18px', textAlign: 'center',
              }}>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.18)', fontFamily: 'monospace' }}>
                  Try without hints first. You can reveal them one at a time.
                </p>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {challenge.hints.slice(0, hintsRevealed).map((hint, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex', gap: 14, alignItems: 'flex-start',
                    borderRadius: 10,
                    background: 'linear-gradient(150deg, rgba(22,16,42,0.85) 0%, rgba(11,8,25,0.90) 100%)',
                    border: '1px solid rgba(255,255,255,0.055)',
                    backdropFilter: 'blur(12px)',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)',
                    padding: isMobile ? '13px 13px' : '13px 16px',
                    animation: 'fadeSlideIn 0.25s ease-out',
                  }}
                >
                  <span style={{
                    fontSize: 10, fontFamily: 'monospace',
                    color: 'rgba(167,139,250,0.55)',
                    background: 'rgba(124,58,237,0.10)',
                    border: '1px solid rgba(124,58,237,0.22)',
                    padding: '2px 7px', borderRadius: 5,
                    flexShrink: 0, marginTop: 2,
                    whiteSpace: 'nowrap',
                  }}>
                    Hint {i + 1}
                  </span>
                  <p style={{
                    fontSize: isMobile ? 12 : 13,
                    color: 'rgba(255,255,255,0.58)',
                    lineHeight: 1.65, flex: 1,
                  }}>
                    {hint}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Attempt + Solution section ── */}
          <div style={{
            borderRadius: 12,
            background: 'rgba(10,8,22,0.60)',
            border: `1px solid rgba(255,255,255,0.06)`,
            backdropFilter: 'blur(10px)',
            overflow: 'hidden',
          }}>

            {/* Attempt gate */}
            {!attempted && (
              <div style={{ padding: isMobile ? '18px 16px' : '20px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.55)', marginBottom: 3 }}>
                    Solution — locked
                  </p>
                  <p style={{ fontSize: 11, fontFamily: 'monospace', color: 'rgba(255,255,255,0.22)' }}>
                    Make a genuine attempt before revealing the answer.
                  </p>
                </div>
                <button
                  onClick={handleAttempt}
                  style={{
                    padding: isMobile ? '10px 16px' : '8px 16px',
                    fontSize: 13, fontWeight: 500, borderRadius: 8,
                    border: `1px solid ${AMBER_BDR}`,
                    background: AMBER_BG,
                    color: AMBER, cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    whiteSpace: 'nowrap',
                    minHeight: isMobile ? 44 : 'auto',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(245,158,11,0.13)'
                    e.currentTarget.style.borderColor = 'rgba(245,158,11,0.35)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = AMBER_BG
                    e.currentTarget.style.borderColor = AMBER_BDR
                  }}
                >
                  I've Attempted This
                </button>
              </div>
            )}

            {/* Reveal button row — shown after attempt */}
            {attempted && !solutionVisible && (
              <div style={{ padding: isMobile ? '18px 16px' : '20px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.55)', marginBottom: 3 }}>
                    Solution — unlocked
                  </p>
                  <p style={{ fontSize: 11, fontFamily: 'monospace', color: 'rgba(255,255,255,0.22)' }}>
                    {confirmSolution
                      ? 'Are you sure? Click again to reveal.'
                      : 'Good work attempting it. Ready to check?'}
                  </p>
                </div>
                <button
                  onClick={handleRevealSolution}
                  style={{
                    padding: isMobile ? '10px 16px' : '8px 16px',
                    fontSize: 13, fontWeight: 500, borderRadius: 8,
                    border: confirmSolution
                      ? '1px solid rgba(248,113,113,0.30)'
                      : '1px solid rgba(255,255,255,0.10)',
                    background: confirmSolution
                      ? 'rgba(248,113,113,0.07)'
                      : 'rgba(255,255,255,0.05)',
                    color: confirmSolution
                      ? 'rgba(248,113,113,0.80)'
                      : 'rgba(255,255,255,0.42)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    whiteSpace: 'nowrap',
                    minHeight: isMobile ? 44 : 'auto',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.color = confirmSolution ? '#f87171' : 'rgba(255,255,255,0.65)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.color = confirmSolution ? 'rgba(248,113,113,0.80)' : 'rgba(255,255,255,0.42)'
                  }}
                >
                  {confirmSolution ? 'Yes, reveal it' : 'Reveal Solution'}
                </button>
              </div>
            )}

            {/* Solution content */}
            {solutionVisible && (
              <div style={{ animation: 'fadeSlideIn 0.30s ease-out' }}>
                <div style={{
                  padding: isMobile ? '14px 16px 10px' : '16px 22px 10px',
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                  display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  <span style={{ fontSize: 11, color: 'rgba(248,113,113,0.65)' }}>◉</span>
                  <p style={{
                    fontSize: 10, fontFamily: 'monospace',
                    color: 'rgba(248,113,113,0.55)',
                    textTransform: 'uppercase', letterSpacing: '0.10em',
                  }}>
                    Solution
                  </p>
                </div>
                <pre style={{
                  margin: 0,
                  padding: isMobile ? '16px' : '20px 22px',
                  fontSize: isMobile ? 11 : 12,
                  fontFamily: 'monospace',
                  color: 'rgba(255,255,255,0.55)',
                  lineHeight: 1.75,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}>
                  {challenge.solution}
                </pre>
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
        background: GLASS_H, backdropFilter: 'blur(10px)',
      }}>
        <div style={{
          maxWidth: 640, margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <button
            onClick={onSkip}
            style={{
              padding: isMobile ? '11px 14px' : '7px 14px',
              fontSize: isMobile ? 14 : 13, borderRadius: 8,
              color: 'rgba(255,255,255,0.26)',
              background: 'none', border: 'none', cursor: 'pointer',
              transition: 'color 0.15s',
              minHeight: isMobile ? 44 : 'auto',
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.50)'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.26)'}
          >
            Skip for now
          </button>

          <button
            onClick={handleComplete}
            style={{
              padding: isMobile ? '11px 22px' : '8px 22px',
              fontSize: isMobile ? 14 : 13, fontWeight: 500, borderRadius: 8,
              border: 'none',
              cursor: completing ? 'default' : 'pointer',
              background: completing
                ? 'linear-gradient(135deg, #16a34a, #15803d)'
                : 'linear-gradient(135deg, #7c3aed, #6d28d9)',
              color: '#fff',
              boxShadow: completing
                ? '0 0 24px rgba(22,163,74,0.32)'
                : '0 0 22px rgba(124,58,237,0.28)',
              transition: 'background 0.35s ease, box-shadow 0.35s ease, transform 0.15s ease',
              minHeight: isMobile ? 44 : 'auto',
              display: 'flex', alignItems: 'center', gap: 7,
            }}
            onMouseEnter={e => { if (!completing) e.currentTarget.style.transform = 'scale(1.04)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}
          >
            {completing ? (
              <>
                <span style={{ fontSize: 13, lineHeight: 1 }}>✓</span>
                Challenge Complete!
              </>
            ) : alreadyDone ? (
              'Done — Continue →'
            ) : (
              'Mark as Complete'
            )}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
