'use client'

import { useEffect, useRef } from 'react'
import {
    motion,
    useScroll,
    useTransform,
    useMotionValue,
    animate,
    type Variants,
} from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

/* ─────────────────────────────────────────────
   ANIMATION VARIANTS
───────────────────────────────────────────── */
const FADE_IN_BG: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 1.2, ease: 'easeOut' } },
}

const BADGE_SLIDE: Variants = {
    hidden: { opacity: 0, y: -24 },
    show: { opacity: 1, y: 0, transition: { delay: 0.3, duration: 0.55, ease: 'easeOut' } },
}

const TITLE_RISE: Variants = {
    hidden: { opacity: 0, y: 48 },
    show: { opacity: 1, y: 0, transition: { delay: 0.5, duration: 0.7, ease: 'easeOut' } },
}

const SUBTITLE_BLUR: Variants = {
    hidden: { opacity: 0, filter: 'blur(12px)' },
    show: {
        opacity: 1,
        filter: 'blur(0px)',
        transition: { delay: 0.7, duration: 0.65, ease: 'easeOut' },
    },
}

const BUTTON_SCALE: Variants = {
    hidden: { opacity: 0, scale: 0.82 },
    show: {
        opacity: 1,
        scale: 1,
        transition: { delay: 0.9, duration: 0.5, ease: 'backOut' },
    },
}

const SCROLL_FADE: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { delay: 1.3, duration: 0.6 } },
}

/* ─────────────────────────────────────────────
   FLOATING SPHERE  component
───────────────────────────────────────────── */
function FloatingSphere({
    size,
    x,
    y,
    delay = 0,
    duration = 8,
}: {
    size: number
    x: string
    y: string
    delay?: number
    duration?: number
}) {
    return (
        <motion.div
            style={{
                position: 'absolute',
                width: size,
                height: size,
                borderRadius: '50%',
                background:
                    'radial-gradient(circle, var(--accent-glow) 0%, var(--accent-subtle) 50%, transparent 70%)',
                left: x,
                top: y,
                filter: 'blur(40px)',
                pointerEvents: 'none',
            }}
            animate={{
                x: [0, 40, -20, 0],
                y: [0, -30, 20, 0],
                scale: [1, 1.15, 0.95, 1],
                opacity: [0.6, 0.9, 0.55, 0.6],
            }}
            transition={{
                duration,
                delay,
                repeat: Infinity,
                ease: 'easeInOut',
                repeatType: 'mirror',
            }}
        />
    )
}

/* ─────────────────────────────────────────────
   SHIMMER TITLE — the light-sweep runs once
───────────────────────────────────────────── */
function ShimmerTitle({ text }: { text: string }) {
    const pos = useMotionValue(-120)

    useEffect(() => {
        // delay after title animation visible
        const timeout = setTimeout(() => {
            animate(pos, 120, { duration: 1.1, ease: 'easeInOut' })
        }, 1400)
        return () => clearTimeout(timeout)
    }, [pos]) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div style={{ position: 'relative', display: 'inline-block' }}>
            {/* Static base text */}
            <span
                style={{
                    fontFamily: 'Bebas Neue, sans-serif',
                    fontSize: 'clamp(64px, 11vw, 140px)',
                    lineHeight: 0.88,
                    letterSpacing: '-0.01em',
                    color: '#fff',
                    display: 'block',
                    userSelect: 'none',
                }}
            >
                {text}
            </span>

            {/* Shimmer overlay — a light beam that sweeps once */}
            <motion.span
                aria-hidden
                style={{
                    position: 'absolute',
                    inset: 0,
                    fontFamily: 'Bebas Neue, sans-serif',
                    fontSize: 'clamp(64px, 11vw, 140px)',
                    lineHeight: 0.88,
                    letterSpacing: '-0.01em',
                    backgroundImage: `linear-gradient(
            105deg,
            transparent 20%,
            rgba(255,255,255,0.55) 50%,
            transparent 80%
          )`,
                    backgroundSize: '200% 100%',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    backgroundPositionX: pos as any,
                    pointerEvents: 'none',
                }}
            >
                {text}
            </motion.span>
        </div>
    )
}

/* ─────────────────────────────────────────────
   MAIN HERO SECTION
───────────────────────────────────────────── */
export function HeroSection() {
    const containerRef = useRef<HTMLDivElement>(null)

    /* ── Parallax ── */
    const { scrollY } = useScroll()
    const bgY = useTransform(scrollY, [0, 700], ['0%', '20%'])

    return (
        <section
            ref={containerRef}
            style={{
                position: 'relative',
                height: '100vh',
                minHeight: 680,
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
            }}
        >
            {/* ══════════════════════════════════════════
          LAYER 1 — PARALLAX BACKGROUND IMAGE
      ══════════════════════════════════════════ */}
            <motion.div
                style={{
                    position: 'absolute',
                    inset: '-15%',        /* extra space so parallax doesn't show edges */
                    y: bgY,
                    backgroundImage:
                        'url(https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=1600&q=85)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    willChange: 'transform',
                }}
                variants={FADE_IN_BG}
                initial="hidden"
                animate="show"
            />

            {/* ══════════════════════════════════════════
          LAYER 2 — GRADIENT OVERLAY
      ══════════════════════════════════════════ */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    background: `
            linear-gradient(
              105deg,
              rgba(0,0,0,0.88) 0%,
              rgba(0,0,0,0.65) 55%,
              rgba(0,0,0,0.30) 100%
            ),
            linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)
          `,
                }}
            />

            {/* ══════════════════════════════════════════
          LAYER 3 — FLOATING BLUE SPHERES
      ══════════════════════════════════════════ */}
            <FloatingSphere size={520} x="60%" y="-10%" delay={0} duration={9} />
            <FloatingSphere size={380} x="75%" y="50%" delay={1.5} duration={7} />

            {/* ══════════════════════════════════════════
          LAYER 4 — SUBTLE GRID TEXTURE
      ══════════════════════════════════════════ */}
            <div
                aria-hidden
                style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: `
            linear-gradient(var(--accent-subtle) 1px, transparent 1px),
            linear-gradient(90deg, var(--accent-subtle) 1px, transparent 1px)
          `,
                    backgroundSize: '64px 64px',
                    pointerEvents: 'none',
                }}
            />

            {/* ══════════════════════════════════════════
          LAYER 5 — MAIN CONTENT
      ══════════════════════════════════════════ */}
            <div
                className="container-padel"
                style={{ position: 'relative', zIndex: 10, maxWidth: 900 }}
            >
                {/* Badge */}
                <motion.div variants={BADGE_SLIDE} initial="hidden" animate="show">
                    <span
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 8,
                            padding: '6px 14px',
                            border: '1px solid var(--border-hover)',
                            borderRadius: 999,
                            background: 'var(--accent-subtle)',
                            color: 'var(--accent)',
                            fontSize: 11,
                            fontWeight: 700,
                            letterSpacing: '0.14em',
                            textTransform: 'uppercase',
                            backdropFilter: 'blur(8px)',
                            marginBottom: 28,
                        }}
                    >
                        <span
                            style={{
                                width: 6,
                                height: 6,
                                borderRadius: '50%',
                                background: 'var(--accent)',
                                boxShadow: '0 0 8px var(--accent)',
                                display: 'inline-block',
                            }}
                        />
                        Edición Limitada
                    </span>
                </motion.div>

                {/* Title — THE RACKET LAB with shimmer */}
                <motion.div variants={TITLE_RISE} initial="hidden" animate="show">
                    <ShimmerTitle text="THE RACKET" />
                    <ShimmerTitle text="LAB" />
                </motion.div>

                {/* Subtitle */}
                <motion.p
                    variants={SUBTITLE_BLUR}
                    initial="hidden"
                    animate="show"
                    style={{
                        marginTop: 24,
                        fontSize: 'clamp(13px, 1.4vw, 15px)',
                        letterSpacing: '0.22em',
                        textTransform: 'uppercase',
                        color: 'rgba(255,255,255,0.45)',
                        fontWeight: 400,
                    }}
                >
                    Nueva Colección 2026
                </motion.p>

                {/* CTA Button */}
                <motion.div
                    variants={BUTTON_SCALE}
                    initial="hidden"
                    animate="show"
                    style={{ marginTop: 48 }}
                >
                    <Link href="/productos" style={{ textDecoration: 'none', display: 'inline-block' }}>
                        <motion.button
                            id="hero-cta-btn"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 12,
                                padding: '16px 36px',
                                borderRadius: 12,
                                background: 'var(--accent)',
                                color: '#fff',
                                fontSize: 14,
                                fontWeight: 700,
                                letterSpacing: '0.1em',
                                textTransform: 'uppercase',
                                border: '2px solid var(--accent)',
                                cursor: 'pointer',
                                transition: 'all 0.25s ease',
                                fontFamily: 'Inter, sans-serif',
                            }}
                            whileHover={{
                                background: 'transparent',
                                borderColor: 'var(--accent)',
                                color: 'var(--accent)',
                                scale: 1.03,
                                boxShadow: '0 0 32px var(--accent-glow)',
                            }}
                            whileTap={{ scale: 0.97 }}
                        >
                            Explorar Drop
                            <motion.span
                                animate={{ x: [0, 4, 0] }}
                                transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
                            >
                                <ArrowRight size={18} />
                            </motion.span>
                        </motion.button>
                    </Link>
                </motion.div>
            </div>

            {/* ══════════════════════════════════════════
          LAYER 6 — SCROLL INDICATOR (right side)
      ══════════════════════════════════════════ */}
            <motion.div
                variants={SCROLL_FADE}
                initial="hidden"
                animate="show"
                style={{
                    position: 'absolute',
                    right: 28,
                    bottom: 48,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 12,
                    zIndex: 10,
                }}
            >
                {/* vertical "SCROLL" text */}
                <span
                    style={{
                        writingMode: 'vertical-rl',
                        textOrientation: 'mixed',
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: '0.22em',
                        textTransform: 'uppercase',
                        color: 'rgba(255,255,255,0.3)',
                    }}
                >
                    Scroll
                </span>

                {/* animated line */}
                <div
                    style={{
                        width: 1,
                        height: 60,
                        background: 'rgba(255,255,255,0.12)',
                        position: 'relative',
                        overflow: 'hidden',
                        borderRadius: 999,
                    }}
                >
                    <motion.div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '50%',
                            background: 'linear-gradient(to bottom, transparent, #0070f3)',
                            borderRadius: 999,
                        }}
                        animate={{ y: ['0%', '200%'] }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                    />
                </div>
            </motion.div>

            {/* ══════════════════════════════════════════
          LAYER 7 — BOTTOM FADE
      ══════════════════════════════════════════ */}
            <div
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 120,
                    background: 'linear-gradient(to top, var(--bg-primary), transparent)',
                    pointerEvents: 'none',
                }}
            />
        </section>
    )
}
