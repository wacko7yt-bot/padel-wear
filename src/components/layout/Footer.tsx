'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Instagram } from 'lucide-react'

/* ─── TikTok SVG inline (Lucide no lo incluye) ─── */
function TikTokIcon({ size = 16 }: { size?: number }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
        >
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.27 8.27 0 0 0 4.84 1.55V6.79a4.85 4.85 0 0 1-1.07-.1z" />
        </svg>
    )
}

/* Payment logo pills */
function PaymentBadge({ label }: { label: string }) {
    return (
        <span
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '4px 10px',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 6,
                fontSize: 11,
                fontWeight: 700,
                color: 'rgba(255,255,255,0.35)',
                letterSpacing: '0.06em',
                background: 'rgba(255,255,255,0.03)',
            }}
        >
            {label}
        </span>
    )
}

/* ─── Link with blue hover (CSS class approach avoids SSR issues) ─── */
function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <Link href={href} className="footer-link">
            {children}
        </Link>
    )
}

/* ─── Social icon circle ─── */
function SocialBtn({
    href,
    label,
    children,
}: {
    href: string
    label: string
    children: React.ReactNode
}) {
    return (
        <a
            href={href}
            aria-label={label}
            target="_blank"
            rel="noopener noreferrer"
            className="footer-social-btn"
        >
            {children}
        </a>
    )
}

export function Footer() {
    const [email, setEmail] = useState('')
    const [done, setDone] = useState(false)
    const year = new Date().getFullYear()

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault()
        if (email.trim()) {
            setDone(true)
            setEmail('')
        }
    }

    return (
        <footer
            style={{
                background: '#050505',
                borderTop: '1px solid rgba(255,255,255,0.07)',
                fontFamily: 'Inter, sans-serif',
            }}
        >
            {/* ── MAIN GRID ── */}
            <div
                className="container-padel"
                style={{ padding: '64px 24px 48px' }}
            >
                <div className="footer-grid">

                    {/* COL 1 — BRAND */}
                    <div>
                        <Link href="/" style={{ textDecoration: 'none', display: 'inline-block', marginBottom: 14 }}>
                            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
                                <span
                                    style={{
                                        fontFamily: 'Bebas Neue, sans-serif',
                                        fontSize: 22,
                                        letterSpacing: '0.18em',
                                        color: '#fff',
                                    }}
                                >
                                    THE RACKET
                                </span>
                                <span
                                    style={{
                                        fontFamily: 'Bebas Neue, sans-serif',
                                        fontSize: 22,
                                        letterSpacing: '0.18em',
                                        color: 'var(--accent)',
                                    }}
                                >
                                    LAB
                                </span>
                            </div>
                        </Link>

                        <p
                            style={{
                                fontSize: 13,
                                color: 'rgba(255,255,255,0.28)',
                                letterSpacing: '0.1em',
                                textTransform: 'uppercase',
                                fontWeight: 600,
                                marginBottom: 6,
                            }}
                        >
                            Estética Urbana 2026
                        </p>
                        <p
                            style={{
                                fontSize: 13,
                                color: '#a0a0a0',
                                lineHeight: 1.7,
                                maxWidth: 210,
                                marginTop: 12,
                            }}
                        >
                            Ropa técnica de pádel diseñada para rendir cuando más importa.
                        </p>
                    </div>

                    {/* COL 2 — TIENDA */}
                    <div>
                        <h4 className="footer-heading">Tienda</h4>
                        <ul className="footer-link-list">
                            <li><FooterLink href="/productos">Todos los Productos</FooterLink></li>
                            <li><FooterLink href="/productos">Novedades</FooterLink></li>
                            <li><FooterLink href="/productos">Ofertas</FooterLink></li>
                            <li><FooterLink href="/productos">Más Vendidos</FooterLink></li>
                        </ul>
                    </div>

                    {/* COL 3 — AYUDA */}
                    <div>
                        <h4 className="footer-heading">Ayuda</h4>
                        <ul className="footer-link-list">
                            <li><FooterLink href="/faq">Preguntas Frecuentes</FooterLink></li>
                            <li><FooterLink href="mailto:hola@theracketlab.es">Contacto</FooterLink></li>
                            <li><FooterLink href="/faq">Guía de Tallas</FooterLink></li>
                            <li><FooterLink href="/faq">Envíos y Devoluciones</FooterLink></li>
                        </ul>
                    </div>

                    {/* COL 4 — NEWSLETTER */}
                    <div>
                        <h4 className="footer-heading">Newsletter</h4>
                        <p style={{ fontSize: 13, color: '#a0a0a0', lineHeight: 1.65, marginBottom: 18 }}>
                            Sé el primero en ver los nuevos drops. Sin spam, solo lo bueno.
                        </p>

                        {done ? (
                            <div
                                style={{
                                    padding: '12px 16px',
                                    border: '1px solid var(--border-hover)',
                                    borderRadius: 10,
                                    background: 'var(--accent-subtle)',
                                    color: 'var(--accent)',
                                    fontSize: 13,
                                    fontWeight: 600,
                                }}
                            >
                                ✓ ¡Ya estás en la lista!
                            </div>
                        ) : (
                            <form onSubmit={handleSubscribe} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="tu@email.com"
                                    style={{
                                        background: 'rgba(255,255,255,0.04)',
                                        border: '1px solid rgba(255,255,255,0.12)',
                                        borderRadius: 8,
                                        padding: '10px 14px',
                                        color: '#fff',
                                        fontSize: 13,
                                        outline: 'none',
                                        transition: 'border-color 0.2s',
                                        fontFamily: 'Inter, sans-serif',
                                        width: '100%',
                                        boxSizing: 'border-box',
                                    }}
                                    onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
                                    onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.12)')}
                                />
                                <button
                                    type="submit"
                                    style={{
                                        padding: '10px 16px',
                                        borderRadius: 8,
                                        background: 'var(--accent)',
                                        color: '#fff',
                                        fontSize: 11,
                                        fontWeight: 800,
                                        letterSpacing: '0.14em',
                                        textTransform: 'uppercase',
                                        border: '2px solid var(--accent)',
                                        cursor: 'pointer',
                                        transition: 'all 0.22s',
                                        fontFamily: 'Inter, sans-serif',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'transparent'
                                        e.currentTarget.style.color = 'var(--accent)'
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'var(--accent)'
                                        e.currentTarget.style.color = '#fff'
                                    }}
                                >
                                    SUSCRIBIRSE
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>

            {/* ── DIVIDER ── */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} />

            {/* ── TRUST BAR ── */}
            <div className="container-padel" style={{ padding: '20px 24px' }}>
                <div className="footer-trust-bar">

                    {/* Social icons */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <SocialBtn href="https://instagram.com" label="Instagram">
                            <Instagram size={16} />
                        </SocialBtn>
                        <SocialBtn href="https://tiktok.com" label="TikTok">
                            <TikTokIcon size={15} />
                        </SocialBtn>
                    </div>

                    {/* Payment logos */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', marginRight: 4, letterSpacing: '0.06em' }}>
                            🔒 PAGO SEGURO
                        </span>
                        <PaymentBadge label="VISA" />
                        <PaymentBadge label="MASTERCARD" />
                        <PaymentBadge label="STRIPE" />
                        <PaymentBadge label="PAYPAL" />
                    </div>
                </div>
            </div>

            {/* ── DIVIDER ── */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }} />

            {/* ── BOTTOM BAR ── */}
            <div className="container-padel" style={{ padding: '16px 24px' }}>
                <div className="footer-bottom-bar">
                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.22)' }}>
                        © {year} The Racket Lab. Todos los derechos reservados. Hecho con ♥ en España.
                    </p>
                    <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                        <FooterLink href="/privacidad">Privacidad</FooterLink>
                        <FooterLink href="/terminos">Términos</FooterLink>
                        <FooterLink href="/faq">Cookies</FooterLink>
                    </div>
                </div>
            </div>
        </footer>
    )
}
