'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Minus, ArrowLeft, Mail } from 'lucide-react'

const FAQS = [
    {
        category: '📦 Envíos',
        items: [
            {
                q: '¿Cuánto tarda en llegar mi pedido?',
                a: 'Los pedidos se envían en 24-72h laborables desde la confirmación del pago. Recibirás un email con el número de seguimiento para rastrear tu paquete en tiempo real.',
            },
            {
                q: '¿Cuánto cuesta el envío?',
                a: 'El envío estándar cuesta 3,99€. A partir de 80€ de compra el envío es completamente GRATUITO. Para envíos a Europa el coste es de 9,99€.',
            },
            {
                q: '¿Puedo hacer seguimiento de mi pedido?',
                a: 'Sí, una vez enviado recibirás un email con el número de seguimiento. Podrás rastrear tu paquete en tiempo real a través del enlace que te enviamos.',
            },
        ],
    },
    {
        category: '↩ Devoluciones',
        items: [
            {
                q: '¿Puedo devolver mi pedido?',
                a: 'Sí, tienes 14 días desde la recepción del pedido para solicitar una devolución. El artículo debe estar en perfecto estado, sin usar y con todas las etiquetas. Escríbenos a hola@theracketlab.es y te guiamos.',
            },
            {
                q: '¿La devolución tiene coste?',
                a: 'La primera devolución de cada pedido es gratuita. A partir de la segunda devolución del mismo pedido, se aplicarán 3,99€ que se descontarán del reembolso.',
            },
            {
                q: '¿Cuándo recibiré mi reembolso?',
                a: 'Una vez verificado el producto devuelto, procesaremos el reembolso en un máximo de 5-7 días laborables. El dinero aparecerá en tu cuenta según los plazos de tu banco.',
            },
        ],
    },
    {
        category: '📏 Tallas',
        items: [
            {
                q: '¿Cómo sé mi talla?',
                a: 'Consulta nuestra guía de tallas en la ficha de cada producto. Allí encontrarás las medidas exactas del tejido en centímetros. Si estás entre dos tallas, te recomendamos la talla superior para mayor comodidad durante el juego.',
            },
            {
                q: '¿Las tallas son unisex?',
                a: 'Sí, todas nuestras camisetas son de corte unisex con diseño ligeramente oversize. Las tallas van de S a XL.',
            },
        ],
    },
    {
        category: '💳 Pagos',
        items: [
            {
                q: '¿Es seguro el pago?',
                a: 'Absolutamente. Procesamos todos los pagos a través de Stripe, el estándar de la industria con cifrado SSL de máxima seguridad. Nunca almacenamos los datos de tu tarjeta.',
            },
            {
                q: '¿Qué métodos de pago aceptáis?',
                a: 'Aceptamos todas las tarjetas de crédito y débito (Visa, Mastercard, American Express), Apple Pay y Google Pay. Próximamente también Bizum.',
            },
        ],
    },
    {
        category: '🎾 Productos',
        items: [
            {
                q: '¿Los materiales son transpirables?',
                a: 'Todos nuestros productos están fabricados con tejidos técnicos de alto rendimiento: gestión de la humedad, secado rápido y protección UV50+. Diseñados específicamente para el pádel de competición.',
            },
            {
                q: '¿Puedo modificar mi pedido una vez realizado?',
                a: 'Los pedidos se procesan rápidamente para garantizar la entrega en 24-72h. Si necesitas un cambio, contáctanos inmediatamente en hola@theracketlab.es. Lo intentaremos si el pedido no ha salido del almacén.',
            },
        ],
    },
]

function AccordionItem({ q, a, index }: { q: string; a: string; index: number }) {
    const [open, setOpen] = useState(false)
    const [height, setHeight] = useState(0)
    const bodyRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (bodyRef.current) setHeight(open ? bodyRef.current.scrollHeight : 0)
    }, [open])

    return (
        <div
            style={{
                background: open ? 'var(--accent-subtle)' : 'var(--bg-card)',
                border: `1px solid ${open ? 'var(--border-hover)' : 'var(--border-subtle)'}`,
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                transition: 'background 0.3s ease, border-color 0.3s ease',
                animationDelay: `${index * 60}ms`,
            }}
            className="animate-fade-up"
        >
            <button
                onClick={() => setOpen(!open)}
                style={{
                    width: '100%',
                    padding: '20px 24px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 16,
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    color: open ? 'var(--accent)' : 'var(--text-primary)',
                    fontWeight: 600,
                    fontSize: 15,
                    fontFamily: 'Inter, sans-serif',
                    transition: 'color 0.3s ease',
                }}
                aria-expanded={open}
            >
                <span style={{ flex: 1, lineHeight: 1.5 }}>{q}</span>
                <span
                    style={{
                        flexShrink: 0,
                        width: 30,
                        height: 30,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '50%',
                        background: open ? 'var(--accent-subtle)' : 'var(--bg-elevated)',
                        border: `1px solid ${open ? 'var(--border-hover)' : 'var(--border)'}`,
                        color: open ? 'var(--accent)' : 'var(--text-muted)',
                        transition: 'all 0.3s ease',
                    }}
                >
                    {open ? <Minus size={13} /> : <Plus size={13} />}
                </span>
            </button>

            <div
                style={{
                    height: `${height}px`,
                    overflow: 'hidden',
                    transition: 'height 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
            >
                <div ref={bodyRef}>
                    <div
                        style={{
                            padding: '0 24px 22px',
                            borderTop: '1px solid var(--border)',
                            paddingTop: 16,
                            color: 'var(--text-secondary)',
                            fontSize: 14,
                            lineHeight: 1.85,
                        }}
                    >
                        {a}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function FAQPage() {
    return (
        <div
            style={{
                minHeight: '100vh',
                background: 'var(--bg-primary)',
                paddingTop: 'calc(var(--navbar-h) + 40px)',
                paddingBottom: 120,
            }}
        >
            <div className="container-padel" style={{ maxWidth: 820 }}>

                <Link
                    href="/"
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        color: 'var(--text-muted)',
                        fontSize: 14,
                        fontWeight: 500,
                        textDecoration: 'none',
                        marginBottom: 48,
                        transition: 'color 0.2s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                >
                    <ArrowLeft size={16} />
                    Volver
                </Link>

                {/* Header */}
                <div style={{ marginBottom: 72 }} className="animate-fade-up">
                    <span
                        style={{
                            display: 'inline-block',
                            marginBottom: 14,
                            padding: '4px 14px',
                            borderRadius: 999,
                            background: 'var(--accent-subtle)',
                            border: '1px solid var(--border-hover)',
                            color: 'var(--accent)',
                            fontSize: 11,
                            fontWeight: 700,
                            letterSpacing: '0.12em',
                            textTransform: 'uppercase',
                        }}
                    >
                        Soporte
                    </span>

                    <h1
                        style={{
                            fontFamily: 'Bebas Neue, sans-serif',
                            fontSize: 'clamp(52px, 8vw, 88px)',
                            lineHeight: 0.95,
                            marginBottom: 20,
                            color: 'var(--text-primary)',
                        }}
                    >
                        PREGUNTAS{' '}
                        <span className="gradient-text">FRECUENTES</span>
                    </h1>

                    <p
                        style={{
                            color: 'var(--text-secondary)',
                            fontSize: 16,
                            lineHeight: 1.75,
                            maxWidth: 580,
                        }}
                    >
                        ¿Tienes dudas? Aquí encontrarás respuestas a las preguntas más comunes.
                        Si no encuentras lo que buscas, escríbenos a{' '}
                        <a
                            href="mailto:hola@theracketlab.es"
                            style={{ color: 'var(--accent)', fontWeight: 500 }}
                        >
                            hola@theracketlab.es
                        </a>
                    </p>
                </div>

                {/* FAQ Sections */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 56 }}>
                    {FAQS.map((section, si) => (
                        <section key={section.category}>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 12,
                                    marginBottom: 20,
                                    paddingBottom: 16,
                                    borderBottom: '1px solid var(--border)',
                                }}
                            >
                                <span style={{ fontSize: 22 }}>{section.category.split(' ')[0]}</span>
                                <h2
                                    style={{
                                        fontSize: 14,
                                        fontWeight: 700,
                                        letterSpacing: '0.1em',
                                        textTransform: 'uppercase',
                                        color: 'var(--text-primary)',
                                    }}
                                >
                                    {section.category.split(' ').slice(1).join(' ')}
                                </h2>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                {section.items.map((item, ii) => (
                                    <AccordionItem key={item.q} q={item.q} a={item.a} index={si * 10 + ii} />
                                ))}
                            </div>
                        </section>
                    ))}
                </div>

                {/* CTA */}
                <div
                    className="animate-fade-up"
                    style={{
                        marginTop: 88,
                        padding: '48px 40px',
                        background: 'var(--accent-subtle)',
                        border: '1px solid var(--border-hover)',
                        borderRadius: 'var(--radius-xl)',
                        textAlign: 'center',
                    }}
                >
                    <div
                        style={{
                            width: 52,
                            height: 52,
                            borderRadius: '50%',
                            background: 'var(--accent-subtle)',
                            border: '1px solid var(--border-hover)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 20px',
                            color: 'var(--accent)',
                        }}
                    >
                        <Mail size={22} />
                    </div>
                    <p style={{ fontWeight: 700, fontSize: 20, marginBottom: 8, color: 'var(--text-primary)' }}>
                        ¿Sigues teniendo dudas?
                    </p>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 28 }}>
                        Nuestro equipo atiende de lunes a viernes, de 9:00 a 18:00h
                    </p>
                    <a
                        href="mailto:hola@theracketlab.es"
                        className="btn btn-primary btn-lg"
                    >
                        <Mail size={15} />
                        Contactar por email
                    </a>
                </div>
            </div>
        </div>
    )
}
