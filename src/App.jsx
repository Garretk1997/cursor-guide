import { useState, useEffect, useRef } from 'react'
import { useMobile } from './useMobile'
import Starfield from './Starfield'
import Quiz    from './Quiz'
import Results from './Results'
import Review  from './Review'

// ─── Data ────────────────────────────────────────────────────────────────────

const SECTIONS = [
  {
    id: 'setup-cursor',
    title: 'Setup Cursor',
    description: 'Get your AI-powered code editor installed and configured.',
    steps: [
      { title: 'Download Cursor', description: 'Visit cursor.com and download the installer for your OS — macOS, Windows, or Linux. Cursor is built on VS Code so the interface will feel familiar.', hasImage: true },
      { title: 'Install and Sign In', description: 'Run the installer, open Cursor, and sign in with GitHub or create a free account. This unlocks AI Tab completion and the Chat panel.', hasImage: true },
      { title: 'Connect an AI Model', description: 'Open Settings → Cursor → Models. Claude and GPT-4o are available out of the box. Pick your preferred model for Chat and Tab completions.', hasImage: false },
      { title: 'Try Your First AI Edit', description: 'Open any file, select some code, and press Cmd+K (Mac) or Ctrl+K (Windows). Type what you want changed and hit Enter.', hasImage: false },
    ],
  },
  {
    id: 'github-basics',
    title: 'GitHub Basics',
    description: 'Learn version control fundamentals with Git and GitHub.',
    steps: [
      { title: 'Create a GitHub Account', description: 'Sign up at github.com. Your username becomes your public developer identity — it appears on commits, pull requests, and your profile.', hasImage: true },
      { title: 'Install Git', description: 'On macOS run `brew install git`. On Windows download from git-scm.com. Verify with `git --version` in your terminal.', hasImage: false },
      { title: 'Configure Your Identity', description: 'Run `git config --global user.name "Your Name"` and `git config --global user.email "you@example.com"`. These values stamp every commit you make.', hasImage: false },
      { title: 'Create Your First Repository', description: 'On GitHub click New → name your repo → check "Add a README" → Create. You now have a remote repo ready to receive code.', hasImage: true },
    ],
  },
  {
    id: 'first-project',
    title: 'First Project',
    description: 'Clone a repo, make changes in Cursor, and push your first commit.',
    steps: [
      { title: 'Clone the Repository', description: 'Copy the repo URL from GitHub, then run `git clone <url>` in your terminal. This downloads the full project history to your machine.', hasImage: true },
      { title: 'Open in Cursor', description: 'Use File → Open Folder, or drag the project folder into Cursor. The Explorer panel on the left shows your file tree.', hasImage: true },
      { title: 'Make a Change', description: 'Edit the README or any file. Use Cursor Chat (Cmd+L) to ask questions about the code, or Tab to autocomplete as you type.', hasImage: false },
      { title: 'Commit and Push', description: 'Run `git add .`, then `git commit -m "my first change"`, then `git push`. Your change is now live on GitHub.', hasImage: false },
    ],
  },
  {
    id: 'apis-webhooks',
    title: 'APIs & Webhooks',
    description: 'Connect your app to external services and respond to real-time events.',
    steps: [
      { title: 'Understanding REST APIs', description: 'APIs let services talk to each other over HTTP. The four methods: GET (read), POST (create), PUT (update), DELETE (remove).', hasImage: true },
      { title: 'Make Your First API Call', description: "Try the GitHub API: `curl https://api.github.com/users/yourusername`. You'll get back a JSON object with your public profile data.", hasImage: false },
      { title: 'Set Up a Webhook', description: 'In your GitHub repo go to Settings → Webhooks → Add webhook. Paste your server URL and choose which events to listen for.', hasImage: true },
      { title: 'Handle Incoming Events', description: 'Create a POST endpoint on your server. Parse the JSON body, verify the signature, run your logic, then respond 200.', hasImage: false },
    ],
  },
  {
    id: 'advanced-builds',
    title: 'Advanced Builds',
    description: 'Automate deployments with CI/CD and ship with confidence.',
    steps: [
      { title: 'CI/CD Pipelines', description: 'Add `.github/workflows/ci.yml` to your repo. GitHub Actions runs your tests on every push — catching bugs before they reach production.', hasImage: true },
      { title: 'Environment Variables', description: "Store secrets in `.env.local` locally and in your platform's settings for production. Never commit `.env` files to Git.", hasImage: false },
      { title: 'Deploy to Vercel', description: 'Connect your GitHub repo at vercel.com. Every push to `main` triggers an automatic deploy. PRs get their own preview URLs.', hasImage: true },
      { title: 'Monitor Your App', description: 'Use Vercel Analytics for traffic and Core Web Vitals. Check function logs in the dashboard. Set alerts so you know before users do.', hasImage: false },
    ],
  },
]

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
    const { moduleIndex, stepIndex, modulesDone, phase, quizIndex, quizAnswers } = JSON.parse(raw)
    return {
      moduleIndex:  moduleIndex  ?? 0,
      stepIndex:    stepIndex    ?? 0,
      modulesDone:  new Set(modulesDone ?? []),
      phase:        phase        ?? 'course',
      quizIndex:    quizIndex    ?? 0,
      quizAnswers:  quizAnswers  ?? {},
    }
  } catch { return null }
}

// ─── Components ──────────────────────────────────────────────────────────────

function ImagePlaceholder({ label }) {
  return (
    <div style={{
      marginTop: '20px',
      borderRadius: '12px',
      border: '1px dashed rgba(255,255,255,0.08)',
      background: 'rgba(10,8,22,0.60)',
      height: '176px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      userSelect: 'none',
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

// ─── App ─────────────────────────────────────────────────────────────────────

export default function App() {
  const saved = loadSaved()
  const [moduleIndex, setModuleIndex] = useState(saved?.moduleIndex ?? 0)
  const [stepIndex,   setStepIndex]   = useState(saved?.stepIndex   ?? 0)
  const [modulesDone, setModulesDone] = useState(saved?.modulesDone ?? new Set())
  const [phase,       setPhase]       = useState(saved?.phase       ?? 'course')
  const [quizIndex,   setQuizIndex]   = useState(saved?.quizIndex   ?? 0)
  const [quizAnswers, setQuizAnswers] = useState(saved?.quizAnswers ?? {})
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
      moduleIndex, stepIndex, modulesDone: [...modulesDone],
      phase, quizIndex, quizAnswers,
    }))
  }, [moduleIndex, stepIndex, modulesDone, phase, quizIndex, quizAnswers])

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
        setModulesDone(prev => new Set(prev).add(moduleIndex))
        if (!isLastMod) { setModuleIndex(n => n + 1); setStepIndex(0) }
      } else {
        setStepIndex(n => n + 1)
      }
    })
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

  function handleBeginAssessment() {
    setPhase('quiz')
    setQuizIndex(0)
    setQuizAnswers({})
  }

  function handleAnswer(qIdx, aIdx) {
    setQuizAnswers(prev => ({ ...prev, [qIdx]: aIdx }))
  }

  function handleQuizNext() {
    const total = 10  // QUIZ_QUESTIONS.length — avoids import at top level
    if (quizIndex < total - 1) setQuizIndex(n => n + 1)
    else setPhase('results')
  }

  function handleQuizBack() {
    if (quizIndex > 0) setQuizIndex(n => n - 1)
  }

  function handleReview() { setPhase('review') }
  function handleStay()   { setPhase('results') }
  function handleBackToResults() { setPhase('results') }

  function handleReset() {
    localStorage.removeItem(STORAGE_KEY)
    setModuleIndex(0); setStepIndex(0)
    setModulesDone(new Set())
    setPhase('course'); setQuizIndex(0); setQuizAnswers({})
  }

  // Progress
  const completedCount = SECTIONS.reduce((sum, s, mi) => {
    if (modulesDone.has(mi)) return sum + s.steps.length
    if (mi < moduleIndex)    return sum + s.steps.length
    if (mi === moduleIndex)  return sum + stepIndex
    return sum
  }, 0)
  const progressPct = Math.round((completedCount / TOTAL_STEPS) * 100)
  const nextLabel   = isLastStep ? (isLastMod ? 'Finish' : 'Next Module') : 'Next Step'

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

  if (phase === 'quiz') return (
    <><Starfield /><FullGlows />
      <Quiz quizIndex={quizIndex} quizAnswers={quizAnswers}
        onAnswer={handleAnswer} onNext={handleQuizNext} onBack={handleQuizBack} />
    </>
  )

  if (phase === 'results') return (
    <><Starfield /><FullGlows />
      <Results quizAnswers={quizAnswers}
        onReview={handleReview} onRestart={handleReset} onStay={handleStay} />
    </>
  )

  if (phase === 'review') return (
    <><Starfield /><FullGlows />
      <Review quizAnswers={quizAnswers} onRestart={handleReset} onBack={handleBackToResults} />
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

          {/* Overall progress + reset */}
          <div style={{ padding: '0 14px 18px' }}>
            <div style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>Overall</span>
                <span style={{ fontSize: 11, fontFamily: 'monospace', color: 'rgba(255,255,255,0.30)' }}>
                  {progressPct}%
                </span>
              </div>
              <div style={{
                height: 3, borderRadius: 9999,
                background: C.trackEmpty, overflow: 'hidden',
              }}>
                <div style={{
                  height: '100%', borderRadius: 9999,
                  background: 'rgba(124,58,237,0.7)',
                  width: `${Math.max(progressPct, 0)}%`,
                  transition: 'width 0.7s ease-out',
                }} />
              </div>
            </div>
            <button
              onClick={handleReset}
              style={{
                width: '100%', fontSize: 11, color: 'rgba(255,255,255,0.18)',
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '4px 0', textAlign: 'center', transition: 'color 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.40)'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.18)'}
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
              <span style={{ fontFamily: 'monospace', fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>
                {progressPct}%
              </span>
            </div>

            {/* Global smooth bar */}
            <div style={{ height: 1, borderRadius: 9999, background: C.trackEmpty, overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: 9999,
                background: 'linear-gradient(90deg, #6d28d9, #a78bfa)',
                width: `${Math.max(progressPct, 1)}%`,
                transition: 'width 0.7s ease-out',
                boxShadow: '0 0 8px rgba(139,92,246,0.5)',
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

              {/* Step card */}
              <div style={{
                borderRadius: 14,
                background:   'linear-gradient(150deg, rgba(22,16,42,0.91) 0%, rgba(11,8,25,0.96) 100%)',
                border:       `1px solid ${C.cardBorder}`,
                padding:      isMobile ? '20px 16px' : '24px',
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
                    }}>
                      {step.title}
                    </h2>
                    <p style={{ fontSize: isMobile ? 13 : 14, color: 'rgba(255,255,255,0.42)', lineHeight: 1.7 }}>
                      {step.description}
                    </p>
                    {step.hasImage && <ImagePlaceholder label={step.title} />}
                  </div>
                </div>
              </div>

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
