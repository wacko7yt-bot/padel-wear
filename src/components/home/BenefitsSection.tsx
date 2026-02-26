'use client'

import { Zap, Shield, Truck, BadgeCheck } from 'lucide-react'
import { motion } from 'framer-motion'

/* ─── Easing ─────────────────────────────────────────────────────────────── */
const EASE_OUT = [0.22, 1, 0.36, 1] as const

/* ─── Data ─────────────────────────────────────────────────────────────── */
const BENEFITS = [
    {
        icon: Zap,
        tag: 'ASEQUIBILIDAD',
        title: 'Estilo Pro',
        desc: 'Consigue la estética de los mejores jugadores del mundo a una fracción de su precio. Camisetas réplica con diseño fiel al original.',
    },
    {
        icon: Shield,
        tag: 'COMPETICIÓN',
        title: 'Equipación Élite',
        desc: 'Cada prenda certificada por jugadores de nivel profesional. Cortes anatómicos que potencian tu movimiento sin restricciones.',
    },
    {
        icon: Truck,
        tag: '24–48H GARANTIZADO',
        title: 'Envío Rápido',
        desc: 'Recibe tu pedido antes de tu próximo partido. Envío gratuito peninsular en pedidos superiores a 80€.',
    },
    {
        icon: BadgeCheck,
        tag: 'SIN RIESGOS',
        title: 'Calidad Garantizada',
        desc: 'Si no estás 100% satisfecho, lo recogemos sin coste y te devolvemos el dinero íntegro. Sin letra pequeña.',
    },
]

/* ─── Constants ────────────────────────────────────────────────────────── */
const ACCENT = 'var(--accent)'
const ACCENT_DIM = 'var(--accent-subtle)'
const ACCENT_BDR = 'var(--border-hover)'
const ACCENT_HOVR = 'rgba(255, 92, 0, 0.20)'

export function BenefitsSection() {
    return (
        <section
            style={{
                padding: '96px 0',
                background: 'var(--bg-secondary)',
                borderTop: '1px solid var(--border)',
                borderBottom: '1px solid var(--border)',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Subtle radial glow in center */}
            <div
                aria-hidden
                style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: `radial-gradient(ellipse 900px 500px at 50% 50%, var(--accent-subtle) 0%, transparent 70%)`,
                    pointerEvents: 'none',
                }}
            />

            <div className="container-padel" style={{ position: 'relative' }}>

                {/* ── Section header ────────────────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.65, ease: EASE_OUT }}
                    viewport={{ once: true, margin: '-80px' }}
                    style={{ textAlign: 'center', marginBottom: 64 }}
                >
                    <p
                        style={{
                            color: ACCENT,
                            fontSize: 11,
                            fontWeight: 700,
                            letterSpacing: '0.18em',
                            textTransform: 'uppercase',
                            marginBottom: 12,
                        }}
                    >
                        Por qué elegirnos
                    </p>
                    <h2
                        style={{
                            fontFamily: 'Bebas Neue, sans-serif',
                            fontSize: 'clamp(32px, 5vw, 52px)',
                            lineHeight: 1,
                        }}
                    >
                        EQUIPACIÓN QUE{' '}
                        <span style={{ color: ACCENT }}>MARCA</span>
                        {' '}LA DIFERENCIA
                    </h2>
                </motion.div>

                {/* ── Cards grid ────────────────────────────────────────────── */}
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                        gap: 20,
                    }}
                >
                    {BENEFITS.map(({ icon: Icon, tag, title, desc }, i) => (
                        <motion.div
                            key={title}
                            initial={{ opacity: 0, y: 36, scale: 0.97 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ delay: i * 0.13, duration: 0.6, ease: EASE_OUT }}
                            viewport={{ once: true, margin: '-60px' }}
                            whileHover={{
                                borderColor: ACCENT_HOVR,
                                background: 'var(--accent-subtle)',
                                y: -10,
                                scale: 1.02,
                                boxShadow: '0 20px 40px rgba(0,0,0,0.4), 0 0 20px var(--accent-glow)',
                                transition: { type: 'spring', stiffness: 400, damping: 17 },
                            }}
                            style={{
                                padding: '32px 28px',
                                borderRadius: 18,
                                background: 'rgba(16,16,18,0.78)',
                                backdropFilter: 'blur(18px)',
                                WebkitBackdropFilter: 'blur(18px)',
                                border: '1px solid rgba(255,255,255,0.07)',
                                cursor: 'default',
                                position: 'relative',
                                overflow: 'hidden',
                            }}
                        >
                            {/* Corner glow accent */}
                            <div
                                aria-hidden
                                style={{
                                    position: 'absolute',
                                    top: -40,
                                    right: -40,
                                    width: 120,
                                    height: 120,
                                    borderRadius: '50%',
                                    background: 'radial-gradient(circle, var(--accent-subtle) 0%, transparent 70%)',
                                    pointerEvents: 'none',
                                }}
                            />

                            {/* Icon container */}
                            <div
                                style={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: 14,
                                    background: ACCENT_DIM,
                                    border: `1px solid ${ACCENT_BDR}`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: 20,
                                }}
                            >
                                <Icon size={22} style={{ color: ACCENT }} />
                            </div>

                            {/* Tag */}
                            <p
                                style={{
                                    fontSize: 10,
                                    fontWeight: 700,
                                    letterSpacing: '0.15em',
                                    textTransform: 'uppercase',
                                    color: ACCENT,
                                    marginBottom: 8,
                                }}
                            >
                                {tag}
                            </p>

                            {/* Title */}
                            <h3
                                style={{
                                    fontWeight: 700,
                                    fontSize: 19,
                                    marginBottom: 10,
                                    color: 'var(--text-primary)',
                                    fontFamily: 'Inter, sans-serif',
                                }}
                            >
                                {title}
                            </h3>

                            {/* Body */}
                            <p
                                style={{
                                    fontSize: 14,
                                    color: 'var(--text-muted)',
                                    lineHeight: 1.76,
                                }}
                            >
                                {desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
