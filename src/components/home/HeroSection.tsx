'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'

/* ─── Easing helper ─────────────────────────────────────────────────────── */
// Framer Motion v12 acepta BezierDefinition como [n,n,n,n] con "as const"
const EASE_OUT = [0.22, 1, 0.36, 1] as const
const EASE_SPRING = [0.34, 1.56, 0.64, 1] as const

/* ─── Stats ─────────────────────────────────────────────────────────────── */
const STATS = [
    { value: '10K+', label: 'Jugadores' },
    { value: '50+', label: 'Modelos' },
    { value: '15', label: 'Países' },
    { value: '4.9★', label: 'Valoración' },
]

export function HeroSection() {
    const prefersReduced = useReducedMotion()

    return (
        <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
                overflow: 'hidden',
                background: 'linear-gradient(135deg, #080808 0%, #150a00 50%, #080808 100%)',
            }}
        >
            {/* ── Background grid ────────────────────────────────────────────── */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: `
            linear-gradient(var(--accent-subtle) 1px, transparent 1px),
            linear-gradient(90deg, var(--accent-subtle) 1px, transparent 1px)
          `,
                    backgroundSize: '60px 60px',
                    pointerEvents: 'none',
                }}
            />

            {/* ── Glow spheres ───────────────────────────────────────────────── */}
            <motion.div
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.4, ease: 'easeOut', delay: 0.2 }}
                style={{
                    position: 'absolute',
                    width: 600,
                    height: 600,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)',
                    top: '-200px',
                    right: '-100px',
                    pointerEvents: 'none',
                }}
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.4, ease: 'easeOut', delay: 0.5 }}
                style={{
                    position: 'absolute',
                    width: 400,
                    height: 400,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, var(--accent-subtle) 0%, transparent 70%)',
                    bottom: '-100px',
                    left: '10%',
                    pointerEvents: 'none',
                }}
            />

            <div className="container-padel" style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ maxWidth: 720 }}>

                    {/* ── Tag badge — step 1 ─────────────────────────────────────── */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.15, ease: EASE_OUT }}
                        className="badge badge-outline"
                        style={{ marginBottom: 24, gap: 6 }}
                    >
                        <span
                            style={{
                                width: 6,
                                height: 6,
                                borderRadius: '50%',
                                background: 'var(--accent)',
                                display: 'inline-block',
                            }}
                        />
                        Nueva colección — THE RACKET LAB
                    </motion.div>

                    {/* ── Headline "NUEVA COLECCIÓN" — step 2: slide-up ─────────── */}
                    <motion.h1
                        initial={{ opacity: 0, y: 48 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.75, delay: 0.3, ease: EASE_OUT }}
                        style={{
                            fontFamily: 'Bebas Neue, sans-serif',
                            fontSize: 'clamp(64px, 10vw, 120px)',
                            lineHeight: 0.9,
                            letterSpacing: '-0.01em',
                            marginBottom: 8,
                            position: 'relative',
                            overflow: 'hidden',
                        }}
                    >
                        {/* Shimmer sweep — corre UNA sola vez de izquierda a derecha */}
                        {!prefersReduced && (
                            <motion.span
                                aria-hidden
                                initial={{ x: '-110%' }}
                                animate={{ x: '110%' }}
                                transition={{ duration: 1.1, delay: 0.95, ease: 'easeInOut' }}
                                style={{
                                    position: 'absolute',
                                    inset: 0,
                                    background:
                                        'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.35) 50%, transparent 60%)',
                                    pointerEvents: 'none',
                                    zIndex: 2,
                                }}
                            />
                        )}
                        NUEVA{' '}
                        <span className="gradient-text">COLECCIÓN</span>
                    </motion.h1>

                    {/* ── Año "2026" — step 3: blur-to-clear ────────────────────── */}
                    <motion.p
                        initial={{ opacity: 0, filter: 'blur(14px)' }}
                        animate={{ opacity: 1, filter: 'blur(0px)' }}
                        transition={{ duration: 0.7, delay: 0.55, ease: EASE_OUT }}
                        style={{
                            fontFamily: 'Bebas Neue, sans-serif',
                            fontSize: 'clamp(48px, 8vw, 96px)',
                            lineHeight: 0.9,
                            letterSpacing: '0.12em',
                            color: 'var(--accent)',
                            marginBottom: 28,
                        }}
                    >
                        2026
                    </motion.p>

                    {/* ── Descripción ────────────────────────────────────────────── */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.55, ease: EASE_OUT }}
                        style={{
                            fontSize: 'clamp(16px, 2vw, 20px)',
                            color: 'var(--text-secondary)',
                            lineHeight: 1.7,
                            marginBottom: 40,
                            maxWidth: 520,
                        }}
                    >
                        Ropa técnica de pádel diseñada para rendir cuando más importa.
                        Tecnología de élite, estética premium. Hecho en España.
                    </motion.p>

                    {/* ── CTAs — step 4: scale-up ─────────────────────────────────── */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.82 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.72, ease: EASE_SPRING }}
                        style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 16 }}
                    >
                        <Link
                            href="/productos"
                            className="btn btn-primary btn-lg"
                            style={{ display: 'inline-flex', gap: 8 }}
                        >
                            EXPLORAR DROP <ArrowRight size={20} />
                        </Link>
                        <a
                            href="#coleccion"
                            className="btn btn-secondary btn-lg"
                            style={{ display: 'inline-flex' }}
                        >
                            Ver colección
                        </a>
                    </motion.div>

                    {/* ── Edición limitada — step 4 staggered ────────────────────── */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.82 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.82, ease: EASE_SPRING }}
                    >
                        <span
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 6,
                                fontSize: 11,
                                fontWeight: 700,
                                letterSpacing: '0.14em',
                                textTransform: 'uppercase',
                                color: 'var(--text-muted)',
                            }}
                        >
                            <span
                                style={{
                                    width: 5,
                                    height: 5,
                                    borderRadius: '50%',
                                    background: 'var(--accent)',
                                    display: 'inline-block',
                                }}
                            />
                            EDICIÓN LIMITADA — STOCK MUY REDUCIDO
                        </span>
                    </motion.div>

                    {/* ── Stats ──────────────────────────────────────────────────── */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.95, ease: EASE_OUT }}
                        style={{
                            display: 'flex',
                            gap: 40,
                            marginTop: 52,
                            flexWrap: 'wrap',
                        }}
                    >
                        {STATS.map((s) => (
                            <div key={s.label}>
                                <p
                                    style={{
                                        fontFamily: 'Bebas Neue, sans-serif',
                                        fontSize: 36,
                                        color: 'var(--accent)',
                                        lineHeight: 1,
                                    }}
                                >
                                    {s.value}
                                </p>
                                <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>
                                    {s.label}
                                </p>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* ── Scroll indicator ───────────────────────────────────────────── */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4, duration: 0.6 }}
                style={{
                    position: 'absolute',
                    bottom: 32,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 8,
                    color: 'var(--text-muted)',
                    fontSize: 11,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                }}
            >
                <motion.div
                    animate={{ scaleY: [1, 1.6, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                    style={{
                        width: 1,
                        height: 40,
                        background: 'linear-gradient(to bottom, transparent, var(--accent))',
                        transformOrigin: 'top',
                    }}
                />
                Scroll
            </motion.div>
        </motion.section>
    )
}
