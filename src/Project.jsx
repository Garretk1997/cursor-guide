import { useState, useEffect } from 'react'
import { PRACTICE_PROJECTS } from './projectData'
import { useMobile } from './useMobile'

const BORDER  = 'rgba(255,255,255,0.055)'
const GLASS_H = 'rgba(5,4,14,0.93)'

export default function Project({ moduleIndex, projectsDone, onComplete, onSkip }) {
  const project    = PRACTICE_PROJECTS[moduleIndex]
  const isMobile   = useMobile()
  const alreadyDone = projectsDone.has(moduleIndex)

  const [visible,    setVisible]    = useState(false)
  const [completing, setCompleting] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 40)
    return () => clearTimeout(t)
  }, [moduleIndex])

  function handleComplete() {
    if (completing) return
    setCompleting(true)
    setTimeout(onComplete, 800)
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
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 7, background: '#7c3aed',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ color: '#fff', fontSize: 12, fontWeight: 700 }}>C</span>
          </div>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#ede9fe' }}>Practice Project</span>
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
          padding: isMobile ? '24px 16px 80px' : '36px 32px 80px',
          opacity:   visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(10px)',
          transition: 'opacity 0.30s ease-out, transform 0.30s ease-out',
        }}>

          {/* Module badge */}
          <div style={{ marginBottom: 16 }}>
            <span style={{
              fontSize: 11, fontFamily: 'monospace', color: '#a78bfa',
              background: 'rgba(124,58,237,0.10)',
              border: '1px solid rgba(124,58,237,0.22)',
              padding: '3px 10px', borderRadius: 6,
            }}>
              {project.module}
            </span>
          </div>

          {/* Title */}
          <h1 style={{
            fontSize: isMobile ? 22 : 26, fontWeight: 700, color: '#ede9fe',
            letterSpacing: '-0.5px', lineHeight: 1.25, marginBottom: 28,
          }}>
            {project.title}
          </h1>

          {/* Objective card */}
          <div style={{
            borderRadius: 12,
            background: 'rgba(124,58,237,0.08)',
            border: '1px solid rgba(124,58,237,0.20)',
            backdropFilter: 'blur(10px)',
            padding: isMobile ? '16px' : '18px 20px',
            marginBottom: 24,
          }}>
            <p style={{
              fontSize: 10, fontFamily: 'monospace',
              color: 'rgba(167,139,250,0.55)',
              textTransform: 'uppercase', letterSpacing: '0.10em',
              marginBottom: 8,
            }}>
              Objective
            </p>
            <p style={{ fontSize: isMobile ? 13 : 14, color: 'rgba(255,255,255,0.78)', lineHeight: 1.70 }}>
              {project.objective}
            </p>
          </div>

          {/* Steps */}
          <div style={{ marginBottom: 24 }}>
            <p style={{
              fontSize: 10, fontFamily: 'monospace',
              color: 'rgba(255,255,255,0.22)',
              textTransform: 'uppercase', letterSpacing: '0.10em',
              marginBottom: 12,
            }}>
              Step-by-Step Instructions
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {project.steps.map((step, i) => (
                <div key={i} style={{
                  display: 'flex', gap: 14, alignItems: 'flex-start',
                  borderRadius: 11,
                  background: 'linear-gradient(150deg, rgba(22,16,42,0.88) 0%, rgba(11,8,25,0.93) 100%)',
                  border: '1px solid rgba(255,255,255,0.060)',
                  backdropFilter: 'blur(14px)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)',
                  padding: isMobile ? '13px 13px' : '14px 16px',
                }}>
                  {/* Step number bubble */}
                  <span style={{
                    width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontFamily: 'monospace', fontWeight: 600,
                    border: '1px solid rgba(139,92,246,0.40)',
                    background: 'rgba(124,58,237,0.14)',
                    color: '#a78bfa',
                    marginTop: 1,
                  }}>
                    {i + 1}
                  </span>
                  <p style={{
                    fontSize: isMobile ? 13 : 13.5,
                    color: 'rgba(255,255,255,0.62)',
                    lineHeight: 1.65,
                    flex: 1,
                  }}>
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Expected outcome card */}
          <div style={{
            borderRadius: 12,
            background: 'rgba(12,38,20,0.60)',
            border: '1px solid rgba(74,222,128,0.16)',
            backdropFilter: 'blur(10px)',
            padding: isMobile ? '16px' : '18px 20px',
          }}>
            <p style={{
              fontSize: 10, fontFamily: 'monospace',
              color: 'rgba(74,222,128,0.55)',
              textTransform: 'uppercase', letterSpacing: '0.10em',
              marginBottom: 8,
            }}>
              Expected Outcome
            </p>
            <p style={{ fontSize: isMobile ? 13 : 14, color: 'rgba(255,255,255,0.68)', lineHeight: 1.70 }}>
              {project.outcome}
            </p>
          </div>

        </div>
      </main>

      {/* ── Footer ── */}
      <div style={{
        flexShrink: 0,
        padding: isMobile ? '12px 16px' : '14px 32px',
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
                Completed!
              </>
            ) : alreadyDone ? (
              'Done — Continue →'
            ) : (
              'Mark as Complete'
            )}
          </button>
        </div>
      </div>

    </div>
  )
}
