import { useState, useEffect, useCallback } from 'react'
import { CAPSTONE_PROJECTS } from './capstoneData'
import { useMobile } from './useMobile'

const BORDER  = 'rgba(255,255,255,0.055)'
const GLASS_H = 'rgba(5,4,14,0.93)'
const GOLD    = '#f59e0b'
const GOLD_BG = 'rgba(245,158,11,0.08)'
const GOLD_BD = 'rgba(245,158,11,0.20)'

const DIFF_STYLE = {
  Intermediate: { color: '#a78bfa', bg: 'rgba(124,58,237,0.10)', border: 'rgba(124,58,237,0.22)' },
  Advanced:     { color: '#f87171', bg: 'rgba(185,28,28,0.10)',  border: 'rgba(248,113,113,0.22)' },
}

// ── List view ─────────────────────────────────────────────────────────────────
function ListView({ capstonesDone, onSelect, onExit, isMobile }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => { const t = setTimeout(() => setVisible(true), 40); return () => clearTimeout(t) }, [])

  const allDone = CAPSTONE_PROJECTS.every(p => capstonesDone.has(p.id))

  return (
    <div style={{
      maxWidth: 700, margin: '0 auto',
      padding: isMobile ? '24px 16px 0' : '40px 32px 0',
      paddingBottom: `calc(80px + env(safe-area-inset-bottom, 0px))`,
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(10px)',
      transition: 'opacity 0.30s ease-out, transform 0.30s ease-out',
    }}>

      {/* Intro */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <span style={{
            fontSize: 11, fontFamily: 'monospace', color: GOLD,
            background: GOLD_BG, border: `1px solid ${GOLD_BD}`,
            padding: '3px 10px', borderRadius: 6, textTransform: 'uppercase', letterSpacing: '0.08em',
          }}>
            Capstone
          </span>
          {allDone && (
            <span style={{
              fontSize: 10, fontFamily: 'monospace', color: 'rgba(74,222,128,0.65)',
              background: 'rgba(16,46,24,0.55)', border: '1px solid rgba(74,222,128,0.18)',
              padding: '2px 8px', borderRadius: 9999,
            }}>
              ✓ all complete
            </span>
          )}
        </div>
        <h1 style={{
          fontSize: isMobile ? 22 : 28, fontWeight: 700, color: '#ede9fe',
          letterSpacing: '-0.5px', lineHeight: 1.2, marginBottom: 12,
        }}>
          Capstone Projects
        </h1>
        <p style={{
          fontSize: isMobile ? 13 : 14, color: 'rgba(255,255,255,0.38)',
          lineHeight: 1.75, maxWidth: 560,
        }}>
          No instructions. No hints. Just a spec and a rubric — the same brief a real team would give you.
          Pick a project, build it on your own, and submit when you're satisfied it meets the criteria.
        </p>
      </div>

      {/* Project cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {CAPSTONE_PROJECTS.map(project => {
          const done     = capstonesDone.has(project.id)
          const diffStyle = DIFF_STYLE[project.difficulty] ?? DIFF_STYLE.Intermediate

          return (
            <button
              key={project.id}
              onClick={() => onSelect(project.id)}
              onMouseEnter={e => { e.currentTarget.style.borderColor = done ? 'rgba(74,222,128,0.30)' : GOLD_BD; e.currentTarget.style.transform = 'translateY(-1px)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = done ? 'rgba(74,222,128,0.14)' : BORDER; e.currentTarget.style.transform = 'translateY(0)' }}
              style={{
                display: 'block', width: '100%', textAlign: 'left', cursor: 'pointer',
                borderRadius: 13,
                background: done
                  ? 'linear-gradient(150deg, rgba(14,36,20,0.82) 0%, rgba(8,20,12,0.90) 100%)'
                  : 'linear-gradient(150deg, rgba(22,16,42,0.88) 0%, rgba(11,8,25,0.93) 100%)',
                border: `1px solid ${done ? 'rgba(74,222,128,0.14)' : BORDER}`,
                backdropFilter: 'blur(14px)',
                padding: isMobile ? '16px' : '20px 22px',
                transition: 'all 0.18s ease',
                boxShadow: done ? '0 0 28px rgba(74,222,128,0.06)' : '0 2px 16px rgba(0,0,0,0.28)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  {/* Badges */}
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
                    <span style={{
                      fontSize: 10, fontFamily: 'monospace',
                      color: diffStyle.color, background: diffStyle.bg, border: `1px solid ${diffStyle.border}`,
                      padding: '2px 7px', borderRadius: 5,
                    }}>
                      {project.difficulty}
                    </span>
                    <span style={{
                      fontSize: 10, fontFamily: 'monospace',
                      color: 'rgba(255,255,255,0.30)', background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      padding: '2px 7px', borderRadius: 5,
                    }}>
                      {project.tag}
                    </span>
                    <span style={{
                      fontSize: 10, fontFamily: 'monospace',
                      color: 'rgba(255,255,255,0.20)',
                      padding: '2px 0',
                    }}>
                      {project.timeEstimate}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 style={{
                    fontSize: isMobile ? 15 : 17, fontWeight: 600, color: done ? '#86efac' : '#ede9fe',
                    letterSpacing: '-0.2px', lineHeight: 1.3, marginBottom: 8,
                  }}>
                    {done && <span style={{ marginRight: 7, opacity: 0.9 }}>✓</span>}
                    {project.title}
                  </h2>

                  {/* Summary */}
                  <p style={{
                    fontSize: isMobile ? 12 : 13,
                    color: 'rgba(255,255,255,0.38)',
                    lineHeight: 1.65,
                    display: '-webkit-box', WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical', overflow: 'hidden',
                  }}>
                    {project.summary}
                  </p>
                </div>

                {/* Arrow */}
                <span style={{
                  fontSize: 18, color: done ? 'rgba(74,222,128,0.40)' : 'rgba(255,255,255,0.18)',
                  flexShrink: 0, marginTop: 4, transition: 'color 0.15s',
                }}>
                  →
                </span>
              </div>

              {/* Progress bar */}
              <div style={{
                marginTop: 14, height: 1.5, borderRadius: 9999,
                background: 'rgba(255,255,255,0.05)', overflow: 'hidden',
              }}>
                <div style={{
                  height: '100%', borderRadius: 9999,
                  background: done ? '#4ade80' : GOLD,
                  width: done ? '100%' : '0%',
                  transition: 'width 0.6s ease-out',
                }} />
              </div>
            </button>
          )
        })}
      </div>

      {/* Back */}
      <button
        onClick={onExit}
        onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.55)'}
        onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.22)'}
        style={{
          marginTop: 32, background: 'none', border: 'none', cursor: 'pointer',
          fontSize: 13, color: 'rgba(255,255,255,0.22)', padding: '6px 0',
          transition: 'color 0.15s',
        }}
      >
        ← Back to course
      </button>
    </div>
  )
}

// ── Detail view ───────────────────────────────────────────────────────────────
function DetailView({ project, done, onComplete, onBack, isMobile }) {
  const [visible,    setVisible]    = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [completing, setCompleting] = useState(false)

  useEffect(() => { const t = setTimeout(() => setVisible(true), 40); return () => clearTimeout(t) }, [])

  function handleSubmit() {
    if (done) return
    if (!confirming) { setConfirming(true); return }
    setCompleting(true)
    setTimeout(onComplete, 900)
  }

  const diffStyle = DIFF_STYLE[project.difficulty] ?? DIFF_STYLE.Intermediate

  return (
    <div style={{
      maxWidth: 680, margin: '0 auto',
      padding: isMobile ? '24px 16px 0' : '40px 32px 0',
      paddingBottom: `calc(100px + env(safe-area-inset-bottom, 0px))`,
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(10px)',
      transition: 'opacity 0.30s ease-out, transform 0.30s ease-out',
    }}>

      {/* Back + badges row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <button
          onClick={onBack}
          onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.55)'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.25)'}
          style={{
            background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0',
            fontSize: 13, color: 'rgba(255,255,255,0.25)', transition: 'color 0.15s',
          }}
        >
          ← Projects
        </button>
        <span style={{ color: 'rgba(255,255,255,0.10)', fontSize: 12 }}>/</span>
        <span style={{
          fontSize: 10, fontFamily: 'monospace',
          color: diffStyle.color, background: diffStyle.bg, border: `1px solid ${diffStyle.border}`,
          padding: '2px 8px', borderRadius: 5,
        }}>
          {project.difficulty}
        </span>
        <span style={{
          fontSize: 10, fontFamily: 'monospace',
          color: GOLD, background: GOLD_BG, border: `1px solid ${GOLD_BD}`,
          padding: '2px 8px', borderRadius: 5, textTransform: 'uppercase', letterSpacing: '0.07em',
        }}>
          Capstone
        </span>
        <span style={{ fontSize: 10, fontFamily: 'monospace', color: 'rgba(255,255,255,0.20)' }}>
          {project.timeEstimate}
        </span>
        {done && (
          <span style={{
            fontSize: 10, fontFamily: 'monospace', color: 'rgba(74,222,128,0.70)',
            background: 'rgba(16,46,24,0.55)', border: '1px solid rgba(74,222,128,0.20)',
            padding: '2px 8px', borderRadius: 9999,
          }}>
            ✓ submitted
          </span>
        )}
      </div>

      {/* Title */}
      <h1 style={{
        fontSize: isMobile ? 22 : 28, fontWeight: 700, color: '#ede9fe',
        letterSpacing: '-0.5px', lineHeight: 1.2, marginBottom: 14,
      }}>
        {project.title}
      </h1>

      {/* Summary */}
      <p style={{
        fontSize: isMobile ? 13 : 14, color: 'rgba(255,255,255,0.42)',
        lineHeight: 1.80, marginBottom: 32,
      }}>
        {project.summary}
      </p>

      {/* Requirements */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <span style={{
            fontSize: 9, fontFamily: 'monospace', color: GOLD,
            textTransform: 'uppercase', letterSpacing: '0.12em',
          }}>
            Requirements
          </span>
          <div style={{ flex: 1, height: 1, background: `${GOLD}22` }} />
          <span style={{ fontSize: 9, fontFamily: 'monospace', color: 'rgba(255,255,255,0.18)' }}>
            {project.requirements.length} items
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {project.requirements.map((req, i) => (
            <div key={i} style={{
              display: 'flex', gap: 14, alignItems: 'flex-start',
              borderRadius: 10,
              background: 'linear-gradient(150deg, rgba(22,16,42,0.80) 0%, rgba(11,8,25,0.88) 100%)',
              border: '1px solid rgba(255,255,255,0.055)',
              backdropFilter: 'blur(12px)',
              padding: isMobile ? '12px 13px' : '13px 15px',
            }}>
              <span style={{
                width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, fontFamily: 'monospace', fontWeight: 700,
                border: `1px solid ${GOLD_BD}`,
                background: GOLD_BG,
                color: GOLD, marginTop: 1,
              }}>
                {i + 1}
              </span>
              <p style={{
                fontSize: isMobile ? 12.5 : 13.5,
                color: 'rgba(255,255,255,0.60)',
                lineHeight: 1.68, flex: 1,
              }}>
                {req}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Success Criteria */}
      <div style={{ marginBottom: 36 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <span style={{
            fontSize: 9, fontFamily: 'monospace', color: '#4ade80',
            textTransform: 'uppercase', letterSpacing: '0.12em',
          }}>
            Success Criteria
          </span>
          <div style={{ flex: 1, height: 1, background: 'rgba(74,222,128,0.15)' }} />
          <span style={{ fontSize: 9, fontFamily: 'monospace', color: 'rgba(255,255,255,0.18)' }}>
            {project.successCriteria.length} checks
          </span>
        </div>
        <div style={{
          borderRadius: 12,
          background: 'rgba(12,38,20,0.40)',
          border: '1px solid rgba(74,222,128,0.12)',
          backdropFilter: 'blur(10px)',
          padding: isMobile ? '14px' : '16px 18px',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
            {project.successCriteria.map((criterion, i) => (
              <div key={i} style={{ display: 'flex', gap: 11, alignItems: 'flex-start' }}>
                <div style={{
                  width: 15, height: 15, borderRadius: 4, flexShrink: 0, marginTop: 2,
                  border: done
                    ? '1.5px solid rgba(74,222,128,0.70)'
                    : '1.5px solid rgba(74,222,128,0.25)',
                  background: done ? 'rgba(74,222,128,0.18)' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.3s ease',
                }}>
                  {done && (
                    <span style={{ fontSize: 8, color: '#4ade80', lineHeight: 1 }}>✓</span>
                  )}
                </div>
                <p style={{
                  fontSize: isMobile ? 12 : 13,
                  color: done ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.48)',
                  lineHeight: 1.65, flex: 1,
                  textDecoration: done ? 'none' : 'none',
                }}>
                  {criterion}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Submit button */}
      {!done ? (
        <div>
          {confirming && (
            <p style={{
              fontSize: 12, color: 'rgba(255,255,255,0.35)', fontFamily: 'monospace',
              marginBottom: 10, textAlign: 'center',
            }}>
              Are you sure? Only submit if your build genuinely meets the criteria above.
            </p>
          )}
          <button
            onClick={handleSubmit}
            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.03)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}
            style={{
              width: '100%',
              padding: isMobile ? '14px 20px' : '12px 24px',
              fontSize: isMobile ? 15 : 14, fontWeight: 600, borderRadius: 10,
              border: confirming
                ? '1px solid rgba(248,113,113,0.35)'
                : `1px solid ${GOLD_BD}`,
              background: completing
                ? 'linear-gradient(135deg, #16a34a, #15803d)'
                : confirming
                  ? 'rgba(185,28,28,0.18)'
                  : GOLD_BG,
              color: completing ? '#fff' : confirming ? '#fca5a5' : GOLD,
              cursor: 'pointer',
              transition: 'all 0.25s ease, transform 0.15s ease',
              boxShadow: completing
                ? '0 0 28px rgba(22,163,74,0.35)'
                : confirming
                  ? '0 0 16px rgba(248,113,113,0.12)'
                  : `0 0 20px ${GOLD}22`,
            }}
          >
            {completing
              ? '✓ Submitted'
              : confirming
                ? 'Yes — I built this and it meets the criteria'
                : 'Submit Project'}
          </button>
        </div>
      ) : (
        <div style={{
          borderRadius: 10,
          background: 'rgba(12,38,20,0.60)',
          border: '1px solid rgba(74,222,128,0.20)',
          padding: isMobile ? '14px 16px' : '14px 20px',
          textAlign: 'center',
        }}>
          <p style={{ fontSize: 13, color: 'rgba(74,222,128,0.80)', fontWeight: 500 }}>
            ✓ Project submitted
          </p>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.28)', marginTop: 4 }}>
            This one is in the books. Build the next one.
          </p>
        </div>
      )}
    </div>
  )
}

// ── Guided detail view (type: 'guided') ───────────────────────────────────────
function GuidedDetailView({ project, done, onComplete, onBack, isMobile }) {
  const STEP_KEY = `cursor-guide-steps-${project.id}`

  const [stepsComplete, setStepsComplete] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STEP_KEY)) || {} } catch { return {} }
  })
  const [hintsOpen, setHintsOpen]   = useState({}) // stepId → revealed hint count
  const [visible,    setVisible]    = useState(false)
  const [completing, setCompleting] = useState(false)

  useEffect(() => { const t = setTimeout(() => setVisible(true), 40); return () => clearTimeout(t) }, [])

  const completedCount = project.steps.filter(s => stepsComplete[s.id]).length
  const allStepsDone   = completedCount === project.steps.length

  const toggleStep = useCallback((stepId) => {
    setStepsComplete(prev => {
      const next = { ...prev, [stepId]: !prev[stepId] }
      localStorage.setItem(STEP_KEY, JSON.stringify(next))
      return next
    })
  }, [STEP_KEY])

  const revealHint = useCallback((stepId) => {
    setHintsOpen(prev => ({ ...prev, [stepId]: Math.min((prev[stepId] || 0) + 1, project.steps.find(s => s.id === stepId).hints.length) }))
  }, [project.steps])

  function handleFinish() {
    if (done) return
    setCompleting(true)
    setTimeout(onComplete, 900)
  }

  return (
    <div style={{
      maxWidth: 680, margin: '0 auto',
      padding: isMobile ? '24px 16px 0' : '40px 32px 0',
      paddingBottom: `calc(100px + env(safe-area-inset-bottom, 0px))`,
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(10px)',
      transition: 'opacity 0.30s ease-out, transform 0.30s ease-out',
    }}>

      {/* Back row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <button
          onClick={onBack}
          onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.55)'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.25)'}
          style={{
            background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0',
            fontSize: 13, color: 'rgba(255,255,255,0.25)', transition: 'color 0.15s',
          }}
        >
          ← Projects
        </button>
        <span style={{ color: 'rgba(255,255,255,0.10)', fontSize: 12 }}>/</span>
        <span style={{
          fontSize: 10, fontFamily: 'monospace',
          color: GOLD, background: GOLD_BG, border: `1px solid ${GOLD_BD}`,
          padding: '2px 8px', borderRadius: 5, textTransform: 'uppercase', letterSpacing: '0.07em',
        }}>
          Guided
        </span>
        <span style={{ fontSize: 10, fontFamily: 'monospace', color: 'rgba(255,255,255,0.20)' }}>
          {project.timeEstimate}
        </span>
        {done && (
          <span style={{
            fontSize: 10, fontFamily: 'monospace', color: 'rgba(74,222,128,0.70)',
            background: 'rgba(16,46,24,0.55)', border: '1px solid rgba(74,222,128,0.20)',
            padding: '2px 8px', borderRadius: 9999,
          }}>
            ✓ shipped
          </span>
        )}
      </div>

      {/* Title + summary */}
      <h1 style={{
        fontSize: isMobile ? 22 : 28, fontWeight: 700, color: '#ede9fe',
        letterSpacing: '-0.5px', lineHeight: 1.2, marginBottom: 12,
      }}>
        {project.title}
      </h1>
      <p style={{
        fontSize: isMobile ? 13 : 14, color: 'rgba(255,255,255,0.42)',
        lineHeight: 1.80, marginBottom: 28,
      }}>
        {project.summary}
      </p>

      {/* Progress bar */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
          <span style={{ fontSize: 10, fontFamily: 'monospace', color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase', letterSpacing: '0.10em' }}>
            Progress
          </span>
          <span style={{ fontSize: 10, fontFamily: 'monospace', color: done ? 'rgba(74,222,128,0.65)' : GOLD }}>
            {done ? project.steps.length : completedCount} / {project.steps.length} steps
          </span>
        </div>
        <div style={{ height: 3, borderRadius: 9999, background: 'rgba(255,255,255,0.06)' }}>
          <div style={{
            height: '100%', borderRadius: 9999,
            background: done ? '#4ade80' : GOLD,
            width: `${done ? 100 : Math.round((completedCount / project.steps.length) * 100)}%`,
            transition: 'width 0.5s ease-out',
            boxShadow: done ? '0 0 8px rgba(74,222,128,0.35)' : `0 0 8px ${GOLD}55`,
          }} />
        </div>
      </div>

      {/* Step cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 32 }}>
        {project.steps.map((step, idx) => {
          const stepDone     = done || !!stepsComplete[step.id]
          const revealed     = hintsOpen[step.id] || 0
          const hasMoreHints = revealed < step.hints.length

          return (
            <div key={step.id} style={{
              borderRadius: 13,
              background: stepDone
                ? 'linear-gradient(150deg, rgba(14,36,20,0.80) 0%, rgba(8,20,12,0.88) 100%)'
                : 'linear-gradient(150deg, rgba(22,16,42,0.82) 0%, rgba(11,8,25,0.90) 100%)',
              border: `1px solid ${stepDone ? 'rgba(74,222,128,0.18)' : BORDER}`,
              backdropFilter: 'blur(14px)',
              padding: isMobile ? '16px' : '18px 20px',
              transition: 'all 0.2s ease',
            }}>
              {/* Step header */}
              <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <span style={{
                  fontFamily: 'monospace', fontSize: 11, fontWeight: 700,
                  color: stepDone ? '#4ade80' : GOLD,
                  background: stepDone ? 'rgba(16,46,24,0.55)' : GOLD_BG,
                  border: `1px solid ${stepDone ? 'rgba(74,222,128,0.22)' : GOLD_BD}`,
                  borderRadius: 6, padding: '3px 8px', flexShrink: 0, marginTop: 2,
                  transition: 'all 0.3s ease',
                }}>
                  {stepDone ? '✓' : step.label}
                </span>
                <div style={{ flex: 1 }}>
                  <h3 style={{
                    fontSize: isMobile ? 14 : 15, fontWeight: 600,
                    color: stepDone ? '#86efac' : '#ede9fe',
                    letterSpacing: '-0.2px', marginBottom: 7,
                  }}>
                    {step.title}
                  </h3>
                  <p style={{
                    fontSize: isMobile ? 12.5 : 13,
                    color: 'rgba(255,255,255,0.48)',
                    lineHeight: 1.68,
                  }}>
                    {step.description}
                  </p>

                  {/* Verification */}
                  <div style={{
                    marginTop: 10,
                    fontSize: 11, fontFamily: 'monospace',
                    color: stepDone ? 'rgba(74,222,128,0.55)' : 'rgba(255,255,255,0.22)',
                    display: 'flex', alignItems: 'center', gap: 5,
                  }}>
                    <span style={{ opacity: 0.6 }}>✔</span>
                    <span>{step.verification}</span>
                  </div>

                  {/* Revealed hints */}
                  {revealed > 0 && (
                    <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 7 }}>
                      {step.hints.slice(0, revealed).map((hint, hi) => (
                        <div key={hi} style={{
                          borderRadius: 8,
                          background: 'rgba(245,158,11,0.06)',
                          border: '1px solid rgba(245,158,11,0.14)',
                          padding: isMobile ? '9px 12px' : '8px 12px',
                          fontSize: isMobile ? 12 : 12.5,
                          color: 'rgba(255,255,255,0.52)',
                          lineHeight: 1.60,
                        }}>
                          <span style={{ fontFamily: 'monospace', fontSize: 9, color: GOLD, marginRight: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                            hint {hi + 1}
                          </span>
                          {hint}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Hint reveal + step checkbox */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12, flexWrap: 'wrap', gap: 8 }}>
                    {hasMoreHints && !stepDone ? (
                      <button
                        onClick={() => revealHint(step.id)}
                        onMouseEnter={e => e.currentTarget.style.color = GOLD}
                        onMouseLeave={e => e.currentTarget.style.color = 'rgba(245,158,11,0.55)'}
                        style={{
                          background: 'none', border: 'none', cursor: 'pointer',
                          fontSize: 11, fontFamily: 'monospace',
                          color: 'rgba(245,158,11,0.55)',
                          padding: '3px 0', transition: 'color 0.15s',
                        }}
                      >
                        Reveal hint {revealed + 1} →
                      </button>
                    ) : (
                      <span />
                    )}

                    {!done && (
                      <button
                        onClick={() => toggleStep(step.id)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 6,
                          background: 'none', border: 'none', cursor: 'pointer', padding: '3px 0',
                        }}
                      >
                        <span style={{
                          width: 16, height: 16, borderRadius: 4, flexShrink: 0,
                          border: stepDone ? '1.5px solid rgba(74,222,128,0.70)' : '1.5px solid rgba(255,255,255,0.22)',
                          background: stepDone ? 'rgba(74,222,128,0.18)' : 'transparent',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'all 0.25s ease',
                        }}>
                          {stepDone && <span style={{ fontSize: 9, color: '#4ade80', lineHeight: 1 }}>✓</span>}
                        </span>
                        <span style={{
                          fontSize: 11, fontFamily: 'monospace',
                          color: stepDone ? 'rgba(74,222,128,0.60)' : 'rgba(255,255,255,0.25)',
                          transition: 'color 0.2s',
                        }}>
                          {stepDone ? 'done' : 'mark done'}
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Finish button / done state */}
      {done ? (
        <div style={{
          borderRadius: 13, padding: isMobile ? '18px' : '20px 24px',
          background: 'linear-gradient(150deg, rgba(14,36,20,0.82) 0%, rgba(8,20,12,0.90) 100%)',
          border: '1px solid rgba(74,222,128,0.22)',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: isMobile ? 28 : 32, marginBottom: 10 }}>🚀</div>
          <p style={{ fontSize: isMobile ? 14 : 15, fontWeight: 600, color: '#86efac', marginBottom: 6 }}>
            Project Shipped!
          </p>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.32)', lineHeight: 1.6 }}>
            You built it, deployed it, and shared it. That's the full cycle.
          </p>
        </div>
      ) : (
        <button
          onClick={handleFinish}
          disabled={!allStepsDone}
          onMouseEnter={e => { if (allStepsDone) { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.boxShadow = '0 0 32px rgba(74,222,128,0.30)' } }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = allStepsDone ? '0 0 20px rgba(74,222,128,0.16)' : 'none' }}
          style={{
            width: '100%',
            padding: isMobile ? '14px 20px' : '12px 24px',
            fontSize: isMobile ? 15 : 14, fontWeight: 600, borderRadius: 10,
            border: allStepsDone ? '1px solid rgba(74,222,128,0.32)' : `1px solid ${BORDER}`,
            background: completing
              ? 'linear-gradient(135deg, #16a34a, #15803d)'
              : allStepsDone
                ? 'rgba(74,222,128,0.12)'
                : 'rgba(255,255,255,0.03)',
            color: completing ? '#fff' : allStepsDone ? '#4ade80' : 'rgba(255,255,255,0.22)',
            cursor: allStepsDone ? 'pointer' : 'not-allowed',
            transition: 'all 0.25s ease, transform 0.15s ease',
            boxShadow: allStepsDone ? '0 0 20px rgba(74,222,128,0.16)' : 'none',
          }}
        >
          {completing ? '✓ Project Shipped!' : allStepsDone ? 'Mark as Complete →' : `Complete all ${project.steps.length} steps to finish`}
        </button>
      )}
    </div>
  )
}

// ── Public component ──────────────────────────────────────────────────────────
export default function Capstone({ capstonesDone, onComplete, onExit }) {
  const isMobile = useMobile()
  const [selectedId, setSelectedId] = useState(null)

  const project = selectedId ? CAPSTONE_PROJECTS.find(p => p.id === selectedId) : null

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
            width: 28, height: 28, borderRadius: 7,
            background: `linear-gradient(135deg, ${GOLD}, #d97706)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ color: '#fff', fontSize: 12, fontWeight: 700 }}>★</span>
          </div>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#ede9fe' }}>
            Capstone Projects
          </span>
        </div>
        <span style={{ fontSize: 11, fontFamily: 'monospace', color: 'rgba(255,255,255,0.22)' }}>
          {capstonesDone.size} / {CAPSTONE_PROJECTS.length} complete
        </span>
      </div>

      {/* ── Scrollable content ── */}
      <main style={{ flex: 1, overflowY: 'auto' }}>
        {project ? (
          project.type === 'guided' ? (
            <GuidedDetailView
              key={selectedId}
              project={project}
              done={capstonesDone.has(selectedId)}
              onComplete={() => onComplete(selectedId)}
              onBack={() => setSelectedId(null)}
              isMobile={isMobile}
            />
          ) : (
            <DetailView
              key={selectedId}
              project={project}
              done={capstonesDone.has(selectedId)}
              onComplete={() => onComplete(selectedId)}
              onBack={() => setSelectedId(null)}
              isMobile={isMobile}
            />
          )
        ) : (
          <ListView
            capstonesDone={capstonesDone}
            onSelect={setSelectedId}
            onExit={onExit}
            isMobile={isMobile}
          />
        )}
      </main>
    </div>
  )
}
