import { useEffect, useRef } from 'react'

const STAR_COUNT = 290
const SHOOTING_CHECK_INTERVAL = 210   // frames between spawn checks
const SHOOTING_CHANCE = 0.12          // 12% per check ≈ 1 per ~30s

export default function Starfield() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx    = canvas.getContext('2d')
    const dpr    = window.devicePixelRatio || 1

    let width, height, stars, frame = 0, animId
    let lastCheck = 0
    const shooters = []

    // ── Setup ────────────────────────────────────────────────────────────────
    function resize() {
      width  = window.innerWidth
      height = window.innerHeight
      canvas.width  = Math.round(width  * dpr)
      canvas.height = Math.round(height * dpr)
      canvas.style.width  = width  + 'px'
      canvas.style.height = height + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      buildStars()
    }

    function buildStars() {
      stars = Array.from({ length: STAR_COUNT }, () => {
        const r = Math.random()
        return {
          x:       Math.random() * width,
          y:       Math.random() * height,
          // Weighted toward very small: most are 0.15–0.65px, a few up to 1.4px
          radius:  r < 0.70 ? Math.random() * 0.50 + 0.15
                             : Math.random() * 0.75 + 0.60,
          // Clearly visible against dark background — intentional, not accidental
          opacity: Math.random() * 0.50 + 0.28,
          speed:   Math.random() * 0.007 + 0.002,   // pulse speed
          phase:   Math.random() * Math.PI * 2,
          // Second phase offset for the double-beat twinkle
          phase2:  Math.random() * Math.PI * 2,
          // Float drift — noticeably alive, never rushed
          dx:      (Math.random() - 0.5) * 0.026,   // ±0.013 px/frame ≈ ±0.78 px/s
          dy:      (Math.random() - 0.5) * 0.017,   // ±0.0085 px/frame ≈ ±0.51 px/s
          // Slight warmth variation: 0 = pure white, 1 = very slightly warm
          warm:    Math.random() < 0.25 ? Math.random() * 15 : 0,
        }
      })
    }

    // ── Shooting star ────────────────────────────────────────────────────────
    function spawnShooter() {
      // Start from top edge or left edge, travel diagonally down-right
      const fromTop = Math.random() < 0.7
      shooters.push({
        x:       fromTop ? Math.random() * width * 0.8 : 0,
        y:       fromTop ? 0 : Math.random() * height * 0.45,
        vx:      0.9 + Math.random() * 1.1,
        vy:      0.4 + Math.random() * 0.55,
        length:  55 + Math.random() * 75,
        life:    0,
        maxLife: 220 + Math.random() * 120,
      })
    }

    // ── Draw loop ────────────────────────────────────────────────────────────
    function draw() {
      ctx.clearRect(0, 0, width, height)

      // — Stars —
      for (const s of stars) {
        // Two-frequency twinkle: irrational ratio (×2.1) means the beats never sync,
        // giving each star a unique organic rhythm — slow, soft, never mechanical.
        const f1      = Math.sin(frame * s.speed         + s.phase)
        const f2      = Math.sin(frame * s.speed * 2.1   + s.phase2)
        const pulse   = 0.70 + f1 * 0.20 + f2 * 0.10    // 0.40 – 1.00
        const alpha   = s.opacity * pulse
        const g       = s.warm    // green channel reduced for warmth
        const color   = `rgba(255,${255 - Math.round(s.warm * 0.4)},${255 - Math.round(s.warm * 0.8)},`

        // Glow halo for larger stars only
        if (s.radius > 0.65) {
          const halo = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.radius * 5.5)
          halo.addColorStop(0, color + `${(alpha * 0.38).toFixed(3)})`)
          halo.addColorStop(1, 'rgba(0,0,0,0)')
          ctx.beginPath()
          ctx.arc(s.x, s.y, s.radius * 5.5, 0, Math.PI * 2)
          ctx.fillStyle = halo
          ctx.fill()
        }

        // Star core
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2)
        ctx.fillStyle = color + `${alpha.toFixed(3)})`
        ctx.fill()

        // Slow drift — wraps at edges so stars never disappear
        s.x += s.dx
        s.y += s.dy
        if      (s.x < -10)        s.x = width  + 10
        else if (s.x > width  + 10) s.x = -10
        if      (s.y < -10)        s.y = height + 10
        else if (s.y > height + 10) s.y = -10
      }

      // — Shooting stars —
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
        // Smooth bell: fade in first 15%, hold, fade out last 20%
        const env = p < 0.15 ? p / 0.15
                  : p > 0.80 ? (1 - p) / 0.20
                  : 1
        const alpha = env * 0.38  // keep very subtle

        const angle = Math.atan2(ss.vy, ss.vx)
        const tx    = ss.x - Math.cos(angle) * ss.length
        const ty    = ss.y - Math.sin(angle) * ss.length

        const grad = ctx.createLinearGradient(tx, ty, ss.x, ss.y)
        grad.addColorStop(0,   'rgba(255,255,255,0)')
        grad.addColorStop(0.6, `rgba(255,255,255,${(alpha * 0.35).toFixed(3)})`)
        grad.addColorStop(1,   `rgba(255,255,255,${alpha.toFixed(3)})`)

        ctx.beginPath()
        ctx.moveTo(tx, ty)
        ctx.lineTo(ss.x, ss.y)
        ctx.strokeStyle = grad
        ctx.lineWidth   = 1.0
        ctx.lineCap     = 'round'
        ctx.stroke()

        if (ss.life >= ss.maxLife || ss.x > width + 120 || ss.y > height + 120) {
          shooters.splice(i, 1)
        }
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
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position:      'fixed',
        inset:         0,
        pointerEvents: 'none',
        zIndex:        0,
      }}
    />
  )
}
