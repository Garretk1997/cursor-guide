import { useState, useEffect, useRef } from 'react'
import { QUIZ_QUESTIONS } from './quizData'
import { useMobile } from './useMobile'
import SkillDashboard, { calcSkillOverall } from './SkillDashboard'
import Starfield from './Starfield'
import Quiz       from './Quiz'
import Results    from './Results'
import Review     from './Review'
import Project    from './Project'
import Challenge  from './Challenge'
import Capstone   from './Capstone'
import StepContent  from './StepContent'
import Completion   from './Completion'
import { SECTIONS } from './sectionsData'

const TOTAL_STEPS = SECTIONS.reduce((sum, s) => sum + s.steps.length, 0)
const STORAGE_KEY = 'cursor-guide-progress'

// ─── Colours (semi-transparent so stars show through) ────────────────────────
const C = {
  sidebar:         'rgba(8, 6, 18, 0.90)',
  sidebarBorder:   'rgba(255,255,255,0.055)',
  header:          'rgba(5, 4, 14, 0.93)',
  footer:          'rgba(5, 4, 14, 0.93)',
  card:            'rgba(16, 12, 30, 0.94)',
  cardBorder:      'rgba(255,255,255,0.065)',
  activeItem:      'rgba(139,92,246,0.12)',
  activeItemBorder:'rgba(139,92,246,0.22)',
  trackEmpty:      'rgba(255,255,255,0.06)',
  hoverItem:       'rgba(255,255,255,0.04)',
}

// ─── Persistence ─────────────────────────────────────────────────────────────

function loadSaved() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const { moduleIndex, stepIndex, modulesDone, phase, quizIndex, quizAnswers, quizOrder, projectsDone, challengesDone, bestScore, capstonesDone, stepQuizAnswers } = JSON.parse(raw)
    return {
      moduleIndex:      moduleIndex      ?? 0,
      stepIndex:        stepIndex        ?? 0,
      modulesDone:      new Set(modulesDone    ?? []),
      projectsDone:     new Set(projectsDone   ?? []),
      challengesDone:   new Set(challengesDone ?? []),
      capstonesDone:    new Set(capstonesDone  ?? []),
      phase:            phase            ?? 'course',
      quizIndex:        quizIndex        ?? 0,
      quizAnswers:      quizAnswers      ?? {},
      quizOrder:        quizOrder        ?? [],
      bestScore:        bestScore        ?? 0,
      stepQuizAnswers:  stepQuizAnswers  ?? {},
    }
  } catch { return null }
}

// ─── App ─────────────────────────────────────────────────────────────────────

export default function App() {
  const saved = loadSaved()
  const [moduleIndex, setModuleIndex] = useState(saved?.moduleIndex ?? 0)
  const [stepIndex,   setStepIndex]   = useState(saved?.stepIndex   ?? 0)
  const [modulesDone,  setModulesDone]  = useState(saved?.modulesDone  ?? new Set())
  const [projectsDone,   setProjectsDone]   = useState(saved?.projectsDone   ?? new Set())
  const [challengesDone, setChallengesDone] = useState(saved?.challengesDone ?? new Set())
  const [phase,        setPhase]        = useState(saved?.phase        ?? 'course')
  const [quizIndex,   setQuizIndex]   = useState(saved?.quizIndex   ?? 0)
  const [quizAnswers, setQuizAnswers] = useState(saved?.quizAnswers ?? {})
  const [quizOrder,   setQuizOrder]   = useState(saved?.quizOrder   ?? [])
  const [bestScore,    setBestScore]    = useState(saved?.bestScore    ?? 0)
  const [capstonesDone,    setCapstonesDone]    = useState(saved?.capstonesDone    ?? new Set())
  const [stepQuizAnswers,  setStepQuizAnswers]  = useState(saved?.stepQuizAnswers  ?? {})
  const [canProceed,  setCanProceed]  = useState(false)
  const [visible,     setVisible]     = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const isMobile = useMobile()
  const contentRef = useRef(null)

  const section    = SECTIONS[moduleIndex]
  const step       = section.steps[stepIndex]
  const isFirst    = moduleIndex === 0 && stepIndex === 0
  const isLastStep = stepIndex === section.steps.length - 1
  const isLastMod  = moduleIndex === SECTIONS.length - 1
  const isFinished = isLastMod && modulesDone.has(moduleIndex)

  // Persist — includes quiz phase state so refresh returns to correct screen
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      moduleIndex, stepIndex,
      modulesDone:    [...modulesDone],
      projectsDone:   [...projectsDone],
      challengesDone: [...challengesDone],
      phase, quizIndex, quizAnswers, quizOrder, bestScore,
      capstonesDone: [...capstonesDone],
      stepQuizAnswers,
    }))
  }, [moduleIndex, stepIndex, modulesDone, projectsDone, challengesDone, phase, quizIndex, quizAnswers, quizOrder, bestScore, capstonesDone, stepQuizAnswers])

  // On step change: scroll to top, reset gate
  useEffect(() => {
    setVisible(true)
    setCanProceed(false)
    const el = contentRef.current
    if (!el) return
    el.scrollTo({ top: 0, behavior: 'smooth' })
    const t = setTimeout(() => {
      if (el.scrollHeight <= el.clientHeight + 20) setCanProceed(true)
    }, 200)
    return () => clearTimeout(t)
  }, [moduleIndex, stepIndex])

  // Close sidebar when switching to desktop
  useEffect(() => {
    if (!isMobile) setSidebarOpen(false)
  }, [isMobile])

  function handleScroll() {
    const el = contentRef.current
    if (!el || canProceed) return
    if (el.scrollHeight - el.scrollTop <= el.clientHeight + 60) setCanProceed(true)
  }

  function go(fn) {
    setVisible(false)
    setTimeout(fn, 180)
  }

  function handleNext() {
    go(() => {
      if (isLastStep) {
        const alreadyDone = modulesDone.has(moduleIndex)
        setModulesDone(prev => new Set(prev).add(moduleIndex))
        if (!alreadyDone) {
          // First completion — show practice project
          setPhase('project')
        } else if (!isLastMod) {
          // Re-visiting a completed module — skip project, advance
          setModuleIndex(n => n + 1)
          setStepIndex(0)
        }
        // alreadyDone && isLastMod: isFinished=true so "Begin Assessment" shows — nothing to do
      } else {
        setStepIndex(n => n + 1)
      }
    })
  }

  function handleProjectComplete() {
    setProjectsDone(prev => new Set(prev).add(moduleIndex))
    setPhase('challenge')
  }

  function handleProjectSkip() {
    setPhase('challenge')
  }

  function handleChallengeComplete() {
    setChallengesDone(prev => new Set(prev).add(moduleIndex))
    if (!isLastMod) { setModuleIndex(n => n + 1); setStepIndex(0); setPhase('course') }
    else { setPhase('complete') }
  }

  function handleChallengeSkip() {
    if (!isLastMod) { setModuleIndex(n => n + 1); setStepIndex(0); setPhase('course') }
    else { setPhase('complete') }
  }

  function handlePrev() {
    go(() => {
      if (stepIndex > 0) {
        setStepIndex(n => n - 1)
      } else if (moduleIndex > 0) {
        const p = moduleIndex - 1
        setModuleIndex(p)
        setStepIndex(SECTIONS[p].steps.length - 1)
      }
    })
  }

  function handleModuleSelect(i) {
    if (isMobile) setSidebarOpen(false)
    if (i === moduleIndex) return
    if (i > moduleIndex && !modulesDone.has(i)) return
    go(() => { setModuleIndex(i); setStepIndex(0) })
  }

  // ─── Assessment handlers ──────────────────────────────────────────────────

  function shuffle(arr) {
    const a = [...arr]
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]]
    }
    return a
  }

  function handleBeginAssessment() {
    const order = shuffle(QUIZ_QUESTIONS.map((_, i) => i))
    setQuizOrder(order)
    setPhase('quiz')
    setQuizIndex(0)
    setQuizAnswers({})
  }

  function handleAnswer(qIdx, aIdx) {
    setQuizAnswers(prev => ({ ...prev, [qIdx]: aIdx }))
  }

  function handleQuizNext() {
    const total = quizOrder.length > 0 ? quizOrder.length : QUIZ_QUESTIONS.length
    if (quizIndex < total - 1) {
      setQuizIndex(n => n + 1)
    } else {
      const order = quizOrder.length > 0 ? quizOrder : QUIZ_QUESTIONS.map((_, i) => i)
      const count = order.reduce((n, qIdx, i) => quizAnswers[i] === QUIZ_QUESTIONS[qIdx].correct ? n + 1 : n, 0)
      const pct   = Math.round((count / order.length) * 100)
      setBestScore(prev => Math.max(prev, pct))
      setPhase('results')
    }
  }

  function handleQuizBack() {
    if (quizIndex > 0) setQuizIndex(n => n - 1)
  }

  function handleReview() { setPhase('review') }
  function handleStay()   { setPhase('results') }
  function handleBackToResults() { setPhase('results') }
  function handleCapstone() { setPhase('capstone') }
  function handleCapstoneComplete(id) { setCapstonesDone(prev => new Set(prev).add(id)) }
  function handleCapstoneExit() { setPhase('results') }
  function handleCompletionReviewAnswers() { setPhase('review') }

  function handleStepQuizAnswer(mi, si, selected) {
    setStepQuizAnswers(prev => ({ ...prev, [`${mi}-${si}`]: selected }))
  }

  function handleReset() {
    localStorage.removeItem(STORAGE_KEY)
    setModuleIndex(0); setStepIndex(0)
    setModulesDone(new Set()); setProjectsDone(new Set()); setChallengesDone(new Set())
    setPhase('course'); setQuizIndex(0); setQuizAnswers({}); setQuizOrder([]); setBestScore(0)
    setCapstonesDone(new Set()); setStepQuizAnswers({})
  }

  // Progress
  const completedCount = SECTIONS.reduce((sum, s, mi) => {
    if (modulesDone.has(mi)) return sum + s.steps.length
    if (mi < moduleIndex)    return sum + s.steps.length
    if (mi === moduleIndex)  return sum + stepIndex
    return sum
  }, 0)
  const progressPct  = Math.round((completedCount / TOTAL_STEPS) * 100)
  const nextLabel    = isLastStep ? 'Complete Module' : 'Next Step'
  const skillOverall = calcSkillOverall(modulesDone, projectsDone, challengesDone, bestScore)

  // ─── Score tracking ───────────────────────────────────────────────────────
  const INLINE_TOTAL = SECTIONS.reduce((n, s) => n + s.steps.filter(st => st.quiz).length, 0)
  const inlineCorrect = Object.entries(stepQuizAnswers).filter(([key, val]) => {
    const [mi, si] = key.split('-').map(Number)
    return val === SECTIONS[mi]?.steps[si]?.quiz?.correct
  }).length
  const inlinePct  = INLINE_TOTAL > 0 ? Math.round((inlineCorrect / INLINE_TOTAL) * 100) : 0
  const totalScore = bestScore > 0 ? Math.round((inlinePct + bestScore) / 2) : inlinePct

  function getTier(s) {
    if (s >= 90) return { label: 'Elite',               color: '#fbbf24' }
    if (s >= 75) return { label: 'Strong',              color: '#4ade80' }
    if (s >= 50) return { label: 'Needs Work',          color: '#38bdf8' }
    return              { label: 'Restart Recommended', color: '#f87171' }
  }
  const tier = getTier(totalScore)

  // ─── Shared full-screen background (used by quiz / results / review) ────────
  const FullGlows = () => (
    <>
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: [
          'radial-gradient(ellipse 62% 52% at 58% 36%, rgba(70,28,155,0.12) 0%, transparent 65%)',
          'radial-gradient(ellipse 48% 42% at 16% 84%, rgba(18,42,108,0.09) 0%, transparent 58%)',
          'linear-gradient(180deg, rgba(6,3,18,0.00) 0%, rgba(4,2,12,0.15) 100%)',
        ].join(', '),
        pointerEvents: 'none', zIndex: 1,
      }} />
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backdropFilter: 'blur(0.6px)', background: 'rgba(3,2,10,0.04)',
        pointerEvents: 'none', zIndex: 1,
      }} />
    </>
  )

  if (phase === 'complete') return (
    <><Starfield /><FullGlows />
      <Completion
        bestScore={bestScore}
        quizAnswers={quizAnswers}
        quizOrder={quizOrder}
        skillOverall={skillOverall}
        totalScore={totalScore}
        modulesDone={modulesDone}
        projectsDone={projectsDone}
        challengesDone={challengesDone}
        totalModules={SECTIONS.length}
        onRestart={handleReset}
        onBeginAssessment={handleBeginAssessment}
        onReviewAnswers={handleCompletionReviewAnswers}
      />
    </>
  )

  if (phase === 'capstone') return (
    <><Starfield /><FullGlows />
      <Capstone
        capstonesDone={capstonesDone}
        onComplete={handleCapstoneComplete}
        onExit={handleCapstoneExit}
      />
    </>
  )

  if (phase === 'challenge') return (
    <><Starfield /><FullGlows />
      <Challenge
        moduleIndex={moduleIndex}
        challengesDone={challengesDone}
        onComplete={handleChallengeComplete}
        onSkip={handleChallengeSkip}
      />
    </>
  )

  if (phase === 'project') return (
    <><Starfield /><FullGlows />
      <Project
        moduleIndex={moduleIndex}
        projectsDone={projectsDone}
        onComplete={handleProjectComplete}
        onSkip={handleProjectSkip}
      />
    </>
  )

  if (phase === 'quiz') return (
    <><Starfield /><FullGlows />
      <Quiz quizIndex={quizIndex} quizAnswers={quizAnswers} quizOrder={quizOrder}
        onAnswer={handleAnswer} onNext={handleQuizNext} onBack={handleQuizBack} />
    </>
  )

  if (phase === 'results') return (
    <><Starfield /><FullGlows />
      <Results quizAnswers={quizAnswers} quizOrder={quizOrder}
        onReview={handleReview} onRestart={handleReset} onStay={handleStay} onCapstone={handleCapstone} />
    </>
  )

  if (phase === 'review') return (
    <><Starfield /><FullGlows />
      <Review quizAnswers={quizAnswers} quizOrder={quizOrder} onRestart={handleReset} onBack={handleBackToResults} />
    </>
  )

  // ─── Course UI ───────────────────────────────────────────────────────────────

  return (
    <>
      {/* ── Starfield canvas (z:0, fixed, behind everything) ── */}
      <Starfield />

      {/* ── Layered background glows — full-width on mobile (no sidebar offset) ── */}
      <div style={{
        position:      'fixed',
        top:           0,
        left:          isMobile ? 0 : 240,
        right:         0,
        bottom:        0,
        background: [
          'radial-gradient(ellipse 62% 52% at 58% 36%, rgba(70,28,155,0.12) 0%, transparent 65%)',
          'radial-gradient(ellipse 48% 42% at 16% 84%, rgba(18,42,108,0.09) 0%, transparent 58%)',
          'linear-gradient(180deg, rgba(6,3,18,0.00) 0%, rgba(4,2,12,0.15) 100%)',
        ].join(', '),
        pointerEvents: 'none',
        zIndex:        1,
      }} />

      {/* ── Soft blur veil ── */}
      <div style={{
        position:      'fixed',
        top:           0,
        left:          isMobile ? 0 : 240,
        right:         0,
        bottom:        0,
        backdropFilter:'blur(0.6px)',
        background:    'rgba(3,2,10,0.04)',
        pointerEvents: 'none',
        zIndex:        1,
      }} />

      {/* ── Mobile backdrop (closes sidebar on outside tap) ── */}
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.55)',
            zIndex: 49,
          }}
        />
      )}

      {/* ── App shell (z:2, above canvas + glow) ── */}
      <div style={{
        position:  'relative',
        zIndex:    2,
        display:   'flex',
        height:    '100vh',
        overflow:  'hidden',
        color:     '#f0eeff',
      }}>

        {/* ══ SIDEBAR ══════════════════════════════════════════════════════ */}
        <aside style={{
          position:       isMobile ? 'fixed' : 'static',
          width:          240,
          height:         isMobile ? '100vh' : 'auto',
          top:            isMobile ? 0 : 'auto',
          left:           isMobile ? (sidebarOpen ? 0 : -245) : 'auto',
          flexShrink:     0,
          display:        'flex',
          flexDirection:  'column',
          background:     C.sidebar,
          borderRight:    `1px solid ${C.sidebarBorder}`,
          backdropFilter: 'blur(12px)',
          zIndex:         isMobile ? 50 : 'auto',
          transition:     isMobile ? 'left 0.28s cubic-bezier(0.4,0,0.2,1)' : 'none',
        }}>

          {/* Brand */}
          <div style={{ padding: '20px', borderBottom: `1px solid ${C.sidebarBorder}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 28, height: 28, borderRadius: 7,
                background: '#7c3aed',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <span style={{ color: '#fff', fontSize: 12, fontWeight: 700 }}>C</span>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#ede9fe', lineHeight: 1 }}>
                  Cursor Guide
                </p>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)', marginTop: 3 }}>
                  Developer Onboarding
                </p>
              </div>
              {/* Close button — mobile only */}
              {isMobile && (
                <button
                  onClick={() => setSidebarOpen(false)}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'rgba(255,255,255,0.35)', padding: '6px 8px',
                    fontSize: 16, lineHeight: 1, borderRadius: 6,
                    flexShrink: 0,
                  }}
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Module list */}
          <nav style={{ flex: 1, padding: '14px 12px', overflowY: 'auto' }}>
            <p style={{
              fontSize: 10, fontWeight: 600, letterSpacing: '0.1em',
              textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)',
              marginBottom: 8, paddingLeft: 10,
            }}>
              Modules
            </p>

            {SECTIONS.map((s, i) => {
              const isActive     = i === moduleIndex
              const isDone       = modulesDone.has(i)
              const isAccessible = i <= moduleIndex || isDone

              return (
                <button
                  key={s.id}
                  onClick={() => isAccessible && handleModuleSelect(i)}
                  disabled={!isAccessible}
                  style={{
                    width:          '100%',
                    display:        'flex',
                    alignItems:     'center',
                    gap:            10,
                    padding:        isMobile ? '11px 10px' : '9px 10px',
                    borderRadius:   9,
                    marginBottom:   2,
                    border:         isActive ? `1px solid ${C.activeItemBorder}` : '1px solid transparent',
                    background:     isActive ? C.activeItem : 'transparent',
                    color:          isActive ? '#c4b5fd'
                                  : isDone   ? 'rgba(255,255,255,0.45)'
                                             : 'rgba(255,255,255,0.18)',
                    cursor:         isAccessible ? 'pointer' : 'not-allowed',
                    textAlign:      'left',
                    fontSize:       13,
                    transition:     'background 0.2s ease, color 0.2s ease, box-shadow 0.2s ease',
                    animation:      isActive ? 'sidebar-glow 3s ease-in-out infinite' : 'none',
                  }}
                  onMouseEnter={e => {
                    if (!isActive && isAccessible) {
                      e.currentTarget.style.background = C.hoverItem
                      e.currentTarget.style.boxShadow = 'inset 0 0 0 1px rgba(139,92,246,0.10), 0 0 14px rgba(139,92,246,0.06)'
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'transparent'
                      e.currentTarget.style.boxShadow = 'none'
                    }
                  }}
                >
                  {/* Indicator circle */}
                  <span style={{
                    width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 10, fontWeight: 500,
                    border:     isDone   ? 'none'
                              : isActive ? '1px solid rgba(139,92,246,0.7)'
                                         : '1px solid rgba(255,255,255,0.12)',
                    background: isDone ? '#7c3aed' : 'transparent',
                    color:      isDone   ? '#fff'
                              : isActive ? '#a78bfa'
                                         : 'rgba(255,255,255,0.25)',
                  }}>
                    {isDone ? '✓' : i + 1}
                  </span>

                  <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {s.title}
                  </span>

                  {/* Mini step dots for active module */}
                  {isActive && (
                    <div style={{ display: 'flex', gap: 3, flexShrink: 0 }}>
                      {s.steps.map((_, si) => (
                        <div key={si} style={{
                          width: 5, height: 5, borderRadius: '50%',
                          background: si < stepIndex   ? '#7c3aed'
                                    : si === stepIndex ? '#a78bfa'
                                                       : 'rgba(255,255,255,0.1)',
                          transition: 'background 0.3s',
                        }} />
                      ))}
                    </div>
                  )}
                </button>
              )
            })}
          </nav>

          {/* Capstone entry */}
          <div style={{ padding: '8px 12px 0' }}>
            <p style={{
              fontSize: 10, fontWeight: 600, letterSpacing: '0.1em',
              textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)',
              marginBottom: 6, paddingLeft: 10,
            }}>
              Capstone
            </p>
            <button
              onClick={() => { if (isMobile) setSidebarOpen(false); setPhase('capstone') }}
              disabled={modulesDone.size < SECTIONS.length}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                padding: isMobile ? '11px 10px' : '9px 10px',
                borderRadius: 9, marginBottom: 2,
                border: phase === 'capstone' ? '1px solid rgba(245,158,11,0.35)' : '1px solid transparent',
                background: phase === 'capstone' ? 'rgba(245,158,11,0.10)' : 'transparent',
                color: modulesDone.size < SECTIONS.length
                  ? 'rgba(255,255,255,0.15)'
                  : phase === 'capstone' ? '#fcd34d' : 'rgba(255,255,255,0.40)',
                cursor: modulesDone.size < SECTIONS.length ? 'not-allowed' : 'pointer',
                textAlign: 'left', fontSize: 13,
                transition: 'background 0.2s ease, color 0.2s ease',
              }}
              onMouseEnter={e => { if (modulesDone.size >= SECTIONS.length && phase !== 'capstone') e.currentTarget.style.background = 'rgba(245,158,11,0.06)' }}
              onMouseLeave={e => { if (phase !== 'capstone') e.currentTarget.style.background = 'transparent' }}
            >
              <span style={{
                width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10,
                border: modulesDone.size < SECTIONS.length
                  ? '1px solid rgba(255,255,255,0.10)'
                  : '1px solid rgba(245,158,11,0.45)',
                background: modulesDone.size < SECTIONS.length ? 'transparent' : 'rgba(245,158,11,0.12)',
                color: modulesDone.size < SECTIONS.length ? 'rgba(255,255,255,0.15)' : '#f59e0b',
              }}>
                ★
              </span>
              <span style={{ flex: 1 }}>Final Projects</span>
              {capstonesDone.size > 0 && (
                <span style={{ fontSize: 10, fontFamily: 'monospace', color: 'rgba(245,158,11,0.55)' }}>
                  {capstonesDone.size}/3
                </span>
              )}
            </button>
          </div>

          {/* Skill progression + reset */}
          <div style={{ padding: '14px 14px 0', borderTop: `1px solid ${C.sidebarBorder}` }}>
            <p style={{
              fontSize: 9, fontFamily: 'monospace', color: 'rgba(255,255,255,0.18)',
              textTransform: 'uppercase', letterSpacing: '0.10em', marginBottom: 10,
            }}>
              Skill Progress
            </p>
            <SkillDashboard
              compact
              modulesDone={modulesDone}
              projectsDone={projectsDone}
              challengesDone={challengesDone}
              bestScore={bestScore}
            />
            <button
              onClick={handleReset}
              style={{
                width: '100%', fontSize: 10, color: 'rgba(255,255,255,0.16)',
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '12px 0 14px', textAlign: 'center', transition: 'color 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.38)'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.16)'}
            >
              Reset progress
            </button>
          </div>
        </aside>

        {/* ══ MAIN PANEL ═══════════════════════════════════════════════════ */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

          {/* Progress header */}
          <div style={{
            padding:       isMobile ? '12px 16px' : '14px 32px',
            borderBottom:  `1px solid ${C.sidebarBorder}`,
            background:    C.header,
            backdropFilter:'blur(10px)',
            flexShrink:    0,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontFamily: 'monospace', fontSize: 12 }}>
                {/* Hamburger — mobile only */}
                {isMobile && (
                  <button
                    onClick={() => setSidebarOpen(o => !o)}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      padding: '5px 6px', marginRight: 4, borderRadius: 6,
                      display: 'flex', flexDirection: 'column', gap: 4,
                      color: 'rgba(255,255,255,0.50)',
                    }}
                  >
                    <span style={{ display: 'block', width: 17, height: 1.5, background: 'currentColor', borderRadius: 9999 }} />
                    <span style={{ display: 'block', width: 17, height: 1.5, background: 'currentColor', borderRadius: 9999 }} />
                    <span style={{ display: 'block', width: 17, height: 1.5, background: 'currentColor', borderRadius: 9999 }} />
                  </button>
                )}
                <span style={{ color: 'rgba(255,255,255,0.35)' }}>
                  Module {moduleIndex + 1}/{SECTIONS.length}
                </span>
                <span style={{ color: 'rgba(255,255,255,0.12)' }}>·</span>
                <span style={{ color: 'rgba(255,255,255,0.25)' }}>
                  Step {stepIndex + 1}/{section.steps.length}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: tier.color, boxShadow: `0 0 5px ${tier.color}99` }} />
                  <span style={{ fontSize: 10, fontFamily: 'monospace', color: tier.color, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    {tier.label}
                  </span>
                </div>
                <span style={{ color: 'rgba(255,255,255,0.10)' }}>·</span>
                <span style={{ fontFamily: 'monospace', fontSize: 12, color: 'rgba(255,255,255,0.32)', fontWeight: 500 }}>
                  {totalScore}%
                </span>
              </div>
            </div>

            {/* Course progress bar */}
            <div style={{ height: 1, borderRadius: 9999, background: C.trackEmpty, overflow: 'hidden', marginBottom: 5 }}>
              <div style={{
                height: '100%', borderRadius: 9999,
                background: 'linear-gradient(90deg, #6d28d9, #a78bfa)',
                width: `${Math.max(progressPct, 1)}%`,
                transition: 'width 0.7s ease-out',
                boxShadow: '0 0 8px rgba(139,92,246,0.5)',
              }} />
            </div>

            {/* Score bar */}
            <div style={{ height: 2, borderRadius: 9999, background: C.trackEmpty, overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: 9999,
                background: tier.color,
                width: `${Math.max(totalScore, 1)}%`,
                transition: 'width 0.8s ease-out',
                boxShadow: `0 0 6px ${tier.color}88`,
                opacity: 0.70,
              }} />
            </div>

            {/* Per-module step track */}
            <div style={{ display: 'flex', gap: 4, marginTop: 9 }}>
              {section.steps.map((_, i) => (
                <div key={i} style={{
                  height: 2, flex: 1, borderRadius: 9999,
                  background: i < stepIndex   ? 'rgba(124,58,237,0.7)'
                            : i === stepIndex ? 'rgba(167,139,250,0.6)'
                                              : C.trackEmpty,
                  transition: 'background 0.3s',
                }} />
              ))}
            </div>
          </div>

          {/* Scrollable content */}
          <main
            ref={contentRef}
            onScroll={handleScroll}
            style={{ flex: 1, overflowY: 'auto' }}
          >
            <div style={{
              maxWidth:   680,
              margin:     '0 auto',
              padding:    isMobile ? '24px 16px' : '40px 32px',
              opacity:    visible ? 1 : 0,
              transform:  visible ? 'translateY(0) scale(1)' : 'translateY(12px) scale(0.984)',
              transition: 'opacity 0.22s ease-out, transform 0.22s ease-out',
            }}>

              {/* Skill dashboard — full view when all modules complete */}
              {isFinished && (
                <SkillDashboard
                  modulesDone={modulesDone}
                  projectsDone={projectsDone}
                  challengesDone={challengesDone}
                  bestScore={bestScore}
                />
              )}

              {/* Breadcrumb */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: isMobile ? 20 : 28 }}>
                <span style={{
                  fontSize: 11, fontFamily: 'monospace', color: '#a78bfa',
                  background: 'rgba(124,58,237,0.10)',
                  border: '1px solid rgba(124,58,237,0.22)',
                  padding: '3px 10px', borderRadius: 6,
                }}>
                  Module {moduleIndex + 1}
                </span>
                <span style={{ color: 'rgba(255,255,255,0.12)', fontSize: 12 }}>/</span>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.30)' }}>
                  {section.title}
                </span>
              </div>

              {/* Step card + tip / quiz / task */}
              <StepContent
                key={`${moduleIndex}-${stepIndex}`}
                step={step}
                stepIndex={stepIndex}
                moduleIndex={moduleIndex}
                isMobile={isMobile}
                quizAnswer={stepQuizAnswers[`${moduleIndex}-${stepIndex}`] ?? null}
                onQuizAnswer={(sel) => handleStepQuizAnswer(moduleIndex, stepIndex, sel)}
              />

              {/* Scroll hint */}
              {!canProceed && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  marginTop: 22, fontSize: 12,
                  color: 'rgba(255,255,255,0.15)',
                  userSelect: 'none',
                }}>
                  <svg style={{ width: 13, height: 13, animation: 'bounce 1.5s infinite' }}
                    fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                  Scroll down to continue
                </div>
              )}

              <div style={{ height: 48 }} />
            </div>
          </main>

          {/* Sticky footer nav */}
          <div style={{
            flexShrink:    0,
            padding:       isMobile ? '12px 16px' : '14px 32px',
            borderTop:     `1px solid ${C.sidebarBorder}`,
            background:    C.footer,
            backdropFilter:'blur(10px)',
          }}>
            <div style={{
              maxWidth: 680, margin: '0 auto',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <button
                onClick={handlePrev}
                disabled={isFirst}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: isMobile ? '11px 14px' : '7px 14px',
                  fontSize: isMobile ? 14 : 13, borderRadius: 8,
                  color: isFirst ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.38)',
                  background: 'none', border: 'none', cursor: isFirst ? 'not-allowed' : 'pointer',
                  transition: 'color 0.15s',
                  minHeight: isMobile ? 44 : 'auto',
                }}
                onMouseEnter={e => { if (!isFirst) e.currentTarget.style.color = 'rgba(255,255,255,0.65)' }}
                onMouseLeave={e => { e.currentTarget.style.color = isFirst ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.38)' }}
              >
                ← Previous
              </button>

              {/* Step dots */}
              <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 5 : 6 }}>
                {section.steps.map((_, i) => (
                  <div key={i} style={{
                    borderRadius: 9999,
                    width:      i === stepIndex ? (isMobile ? 12 : 16) : (isMobile ? 5 : 6),
                    height:     isMobile ? 5 : 6,
                    background: i < stepIndex   ? 'rgba(124,58,237,0.5)'
                              : i === stepIndex ? '#7c3aed'
                                                : 'rgba(255,255,255,0.10)',
                    transition: 'all 0.3s ease',
                  }} />
                ))}
              </div>

              {isFinished ? (
                <button
                  onClick={handleBeginAssessment}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}
                  style={{
                    padding: isMobile ? '11px 16px' : '7px 18px',
                    fontSize: isMobile ? 14 : 13, fontWeight: 500, borderRadius: 8,
                    border: '1px solid rgba(139,92,246,0.38)',
                    background: 'rgba(124,58,237,0.14)',
                    color: '#c4b5fd', cursor: 'pointer',
                    animation: 'next-pulse 2.6s ease-in-out infinite',
                    transition: 'transform 0.15s ease',
                    minHeight: isMobile ? 44 : 'auto',
                  }}
                >
                  Begin Assessment →
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  disabled={!canProceed}
                  onMouseEnter={e => { if (canProceed) e.currentTarget.style.transform = 'scale(1.04)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}
                  style={{
                    padding: isMobile ? '11px 18px' : '7px 18px',
                    fontSize: isMobile ? 14 : 13, fontWeight: 500, borderRadius: 8,
                    border: 'none', cursor: canProceed ? 'pointer' : 'not-allowed',
                    transition: 'background 0.2s ease, color 0.2s ease, transform 0.15s ease',
                    background: canProceed
                      ? 'linear-gradient(135deg, #7c3aed, #6d28d9)'
                      : 'rgba(255,255,255,0.05)',
                    color: canProceed ? '#fff' : 'rgba(255,255,255,0.20)',
                    animation: canProceed ? 'next-pulse 2.6s ease-in-out infinite' : 'none',
                    minHeight: isMobile ? 44 : 'auto',
                  }}
                >
                  {nextLabel} →
                </button>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Bounce keyframe for scroll hint arrow */}
      <style>{`
        @keyframes bounce {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(4px); }
        }
        @keyframes sidebar-glow {
          0%,100% { box-shadow: 0 0 8px rgba(139,92,246,0.04); }
          50%     { box-shadow: 0 0 18px rgba(139,92,246,0.13); }
        }
        @keyframes next-pulse {
          0%,100% { box-shadow: 0 0 18px rgba(124,58,237,0.32); }
          50%     { box-shadow: 0 0 32px rgba(124,58,237,0.56), 0 0 52px rgba(124,58,237,0.18); }
        }
      `}</style>
    </>
  )
}
