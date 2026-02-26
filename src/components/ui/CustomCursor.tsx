'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

/* ─── tipos de estado del cursor ─── */
type CursorState = 'default' | 'hover' | 'click' | 'text' | 'hidden'

/* ─── selectores de elementos interactivos ─── */
const INTERACTIVE = [
    'a', 'button', '[role="button"]',
    'input', 'textarea', 'select', 'label',
    '[data-cursor="hover"]',
].join(', ')

const TEXT_SELECTORS = ['p', 'h1', 'h2', 'h3', 'h4', 'span', 'li'].join(', ')

export function CustomCursor() {
    const [state, setState] = useState<CursorState>('default')
    const [mounted, setMounted] = useState(false)

    /* ── posición cruda del ratón ── */
    const rawX = useMotionValue(-100)
    const rawY = useMotionValue(-100)

    /* ── posición del anillo exterior (con lag suave) ── */
    const ringX = useSpring(rawX, { stiffness: 110, damping: 18, mass: 0.5 })
    const ringY = useSpring(rawY, { stiffness: 110, damping: 18, mass: 0.5 })

    /* ── posición del punto interior (sin lag) ── */
    const dotX = useSpring(rawX, { stiffness: 420, damping: 28, mass: 0.2 })
    const dotY = useSpring(rawY, { stiffness: 420, damping: 28, mass: 0.2 })

    const isTouch = useRef(false)

    useEffect(() => {
        /* skip on touch devices */
        if (window.matchMedia('(hover: none)').matches) {
            isTouch.current = true
            return
        }
        setMounted(true)

        const onMove = (e: MouseEvent) => {
            rawX.set(e.clientX)
            rawY.set(e.clientY)

            const target = e.target as Element
            if (target.closest(INTERACTIVE)) {
                setState('hover')
            } else if (target.closest(TEXT_SELECTORS)) {
                setState('text')
            } else {
                setState('default')
            }
        }

        const onDown = () => setState('click')
        const onUp = (e: MouseEvent) => {
            const target = e.target as Element
            setState(target.closest(INTERACTIVE) ? 'hover' : 'default')
        }

        const onLeave = () => setState('hidden')
        const onEnter = () => setState('default')

        window.addEventListener('mousemove', onMove, { passive: true })
        window.addEventListener('mousedown', onDown)
        window.addEventListener('mouseup', onUp)
        document.documentElement.addEventListener('mouseleave', onLeave)
        document.documentElement.addEventListener('mouseenter', onEnter)

        return () => {
            window.removeEventListener('mousemove', onMove)
            window.removeEventListener('mousedown', onDown)
            window.removeEventListener('mouseup', onUp)
            document.documentElement.removeEventListener('mouseleave', onLeave)
            document.documentElement.removeEventListener('mouseenter', onEnter)
        }
    }, [rawX, rawY])

    if (!mounted || isTouch.current) return null

    /* ── tamaños y colores por estado ── */
    const RING_SIZE = {
        default: 36,
        hover: 56,
        click: 28,
        text: 3,
        hidden: 0,
    }[state]

    const RING_ALPHA = {
        default: 0.55,
        hover: 0.85,
        click: 0.95,
        text: 0,
        hidden: 0,
    }[state]

    const DOT_SIZE = {
        default: 6,
        hover: 8,
        click: 4,
        text: 18,   /* text cursor becomes a thin tall bar */
        hidden: 0,
    }[state]

    const isText = state === 'text'
    const isHover = state === 'hover'

    return (
        <>
            {/* ── ANILLO EXTERIOR — sigue con lag ── */}
            <motion.div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    pointerEvents: 'none',
                    zIndex: 99999,
                    x: ringX,
                    y: ringY,
                    translateX: '-50%',
                    translateY: '-50%',
                }}
            >
                <motion.div
                    animate={{
                        width: RING_SIZE,
                        height: RING_SIZE,
                        opacity: RING_ALPHA,
                        borderRadius: isText ? '2px' : '50%',
                        backgroundColor: isHover ? 'var(--accent)' : 'transparent',
                        borderColor: isHover
                            ? 'transparent'
                            : 'rgba(255, 92, 0, 0.7)',
                    }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    style={{
                        border: '1.5px solid rgba(255, 92, 0, 0.7)',
                        mixBlendMode: isHover ? 'normal' : 'normal',
                    }}
                />
            </motion.div>

            {/* ── PUNTO INTERIOR — sin lag ── */}
            <motion.div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    pointerEvents: 'none',
                    zIndex: 99999,
                    x: dotX,
                    y: dotY,
                    translateX: '-50%',
                    translateY: '-50%',
                }}
            >
                <motion.div
                    animate={{
                        width: isText ? 2 : DOT_SIZE,
                        height: isText ? 20 : DOT_SIZE,
                        opacity: state === 'hidden' ? 0 : 1,
                        borderRadius: isText ? '1px' : '50%',
                        backgroundColor: 'var(--accent)',
                    }}
                    transition={{ duration: 0.1, ease: 'easeOut' }}
                />
            </motion.div>
        </>
    )
}
