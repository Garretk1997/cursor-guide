import { useEffect, useRef } from 'react'

const STAR_COUNT = 290
const SHOOTING_CHECK_INTERVAL = 210 // frames between spawn checks
const SHOOTING_CHANCE = 0.12 // 12% per check ≈ 1 per ~30s

/** px/ms; fast flick scrolls easily exceed ~0.6 */
const FAST_SCROLL_THRESHOLD = 0.58
const SCROLL_VELOCITY_DECAY = 0.88

function scrollTargetKey(target) {
  if (target === document || target === document.documentElement || target === document.body)
    return '__doc'
  return target
}

function readScrollTop(target) {
  if (target === document || target === document.documentElement)
    return window.scrollY || document.documentElement.scrollTop || 0
  if (target === document.body) return document.body.scrollTop || window.scrollY || 0
  return typeof target?.scrollTop === 'number' ? target.scrollTop : 0
}

export default function Starfield() {
  const canvasRef = useRef(null)
  const scrollVelocityRef = useRef(0)
  const scrollLastRef = useRef(new Map())

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1

    let width, height, stars, frame = 0, animId
    let lastCheck = 0
    const shooters = []

    function onScrollCapture(e) {
      const key = scrollTargetKey(e.target)
      const y = readScrollTop(e.target)
      const now = performance.now()
      const prev = scrollLastRef.current.get(key)
      scrollLastRef.current.set(key, { y, t: now })
      if (!prev) return
      const dt = now - prev.t
      if (dt <= 0 || dt > 64) return
      const v = Math.abs(y - prev.y) / dt
      if (v > scrollVelocityRef.current) scrollVelocityRef.current = v
    }

    document.addEventListener('scroll', onScrollCapture, true)

    // ── Setup ────────────────────────────────────────────────────────────────
    function resize() {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      canvas.style.width = width + 'px'
      canvas.style.height = height + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      buildStars()
    }

    function buildStars() {
      stars = Array.from({ length: STAR_COUNT }, () => {
        const r = Math.random()
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          radius:
            r < 0.70 ? Math.random() * 0.50 + 0.15 : Math.random() * 0.75 + 0.60,
          opacity: Math.random() * 0.46 + 0.34,
          speed: Math.random() * 0.007 + 0.002,
          phase: Math.random() * Math.PI * 2,
          phase2: Math.random() * Math.PI * 2,
          dx: (Math.random() - 0.5) * 0.026,
          dy: (Math.random() - 0.5) * 0.017,
          warm: Math.random() < 0.25 ? Math.random() * 15 : 0,
        }
      })
    }

    function spawnShooter() {
      const fromTop = Math.random() < 0.7
      shooters.push({
        x: fromTop ? Math.random() * width * 0.8 : 0,
        y: fromTop ? 0 : Math.random() * height * 0.45,
        vx: 0.9 + Math.random() * 1.1,
        vy: 0.4 + Math.random() * 0.55,
        length: 55 + Math.random() * 75,
        life: 0,
        maxLife: 220 + Math.random() * 120,
      })
    }

    // ── Draw loop ────────────────────────────────────────────────────────────
    function draw() {
      scrollVelocityRef.current *= SCROLL_VELOCITY_DECAY
      const fastScroll = scrollVelocityRef.current > FAST_SCROLL_THRESHOLD

      ctx.clearRect(0, 0, width, height)

      for (const s of stars) {
        let pulse
        if (fastScroll) {
          pulse = 0.78
        } else {
          const f1 = Math.sin(frame * s.speed + s.phase)
          const f2 = Math.sin(frame * s.speed * 2.1 + s.phase2)
          pulse = 0.70 + f1 * 0.20 + f2 * 0.10
        }
        const alpha = s.opacity * pulse
        const color = `rgba(255,${255 - Math.round(s.warm * 0.4)},${255 - Math.round(s.warm * 0.8)},`

        if (!fastScroll && s.radius > 0.65) {
          const halo = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.radius * 5.5)
          halo.addColorStop(0, color + `${(alpha * 0.38).toFixed(3)})`)
          halo.addColorStop(1, 'rgba(0,0,0,0)')
          ctx.beginPath()
          ctx.arc(s.x, s.y, s.radius * 5.5, 0, Math.PI * 2)
          ctx.fillStyle = halo
          ctx.fill()
        }

        ctx.beginPath()
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2)
        ctx.fillStyle = color + `${alpha.toFixed(3)})`
        ctx.fill()

        s.x += fastScroll ? s.dx * 0.35 : s.dx
        s.y += fastScroll ? s.dy * 0.35 : s.dy
        if (s.x < -10) s.x = width + 10
        else if (s.x > width + 10) s.x = -10
        if (s.y < -10) s.y = height + 10
        else if (s.y > height + 10) s.y = -10
      }

      if (!fastScroll) {
        if (frame - lastCheck >= SHOOTING_CHECK_INTERVAL) {
          lastCheck = frame
          if (Math.random() < SHOOTING_CHANCE) spawnShooter()
        }

        for (let i = shooters.length - 1; i >= 0; i--) {
          const ss = shooters[i]
          ss.life++
          ss.x += ss.vx
          ss.y += ss.vy

          const p = ss.life / ss.maxLife
          const env =
            p < 0.15 ? p / 0.15 : p > 0.80 ? (1 - p) / 0.20 : 1
          const alpha = env * 0.38

          const angle = Math.atan2(ss.vy, ss.vx)
          const tx = ss.x - Math.cos(angle) * ss.length
          const ty = ss.y - Math.sin(angle) * ss.length

          const grad = ctx.createLinearGradient(tx, ty, ss.x, ss.y)
          grad.addColorStop(0, 'rgba(255,255,255,0)')
          grad.addColorStop(0.6, `rgba(255,255,255,${(alpha * 0.35).toFixed(3)})`)
          grad.addColorStop(1, `rgba(255,255,255,${alpha.toFixed(3)})`)

          ctx.beginPath()
          ctx.moveTo(tx, ty)
          ctx.lineTo(ss.x, ss.y)
          ctx.strokeStyle = grad
          ctx.lineWidth = 1.0
          ctx.lineCap = 'round'
          ctx.stroke()

          if (
            ss.life >= ss.maxLife ||
            ss.x > width + 120 ||
            ss.y > height + 120
          ) {
            shooters.splice(i, 1)
          }
        }
      } else {
        shooters.length = 0
      }

      frame++
      animId = requestAnimationFrame(draw)
    }

    resize()
    draw()
    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
      document.removeEventListener('scroll', onScrollCapture, true)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  )
}
