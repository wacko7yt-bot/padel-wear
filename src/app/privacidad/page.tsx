'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

const sections = [
    {
        title: '1. Responsable del Tratamiento',
        content: `THE RACKET LAB es el Responsable del tratamiento de los datos personales del Usuario.

Datos de contacto: hola@theracketlab.es`,
    },
    {
        title: '2. Datos que Recopilamos',
        content: `Recopilamos los siguientes datos personales cuando realizas una compra o te suscribes a nuestra newsletter:

• Nombre y apellidos
• Dirección de email
• Dirección de envío (calle, ciudad, código postal, país)
• Número de teléfono (opcional)
• Datos de pago (procesados exclusivamente por Stripe — nosotros NO vemos ni almacenamos datos de tarjetas)

Cuando navegas por nuestra web, también recopilamos datos técnicos como tu dirección IP, tipo de navegador y páginas visitadas, a través de cookies analíticas.`,
    },
    {
        title: '3. Finalidad y Base Legal del Tratamiento',
        content: `Utilizamos tus datos personales para las siguientes finalidades:

• Gestión de pedidos y envíos (base legal: ejecución de contrato)
• Comunicaciones sobre el estado de tu pedido (base legal: ejecución de contrato)
• Atención al cliente y resolución de incidencias (base legal: interés legítimo)
• Envío de newsletter con novedades y ofertas (base legal: consentimiento — puedes darte de baja en cualquier momento)
• Cumplimiento de obligaciones legales fiscales y contables (base legal: obligación legal)`,
    },
    {
        title: '4. Conservación de los Datos',
        content: `Conservamos tus datos personales durante el tiempo necesario para cumplir con la finalidad para la que fueron recogidos:

• Datos de pedidos: 5 años (obligación fiscal en España)
• Datos de newsletter: hasta que solicites la baja
• Cookies analíticas: 13 meses
• Datos de atención al cliente: 1 año tras la resolución de la incidencia`,
    },
    {
        title: '5. Destinatarios de los Datos',
        content: `Compartimos tus datos únicamente con los prestadores de servicios necesarios para operar nuestra tienda:

• Stripe Inc. (procesamiento de pagos) — Privacidad: stripe.com/es/privacy
• Servicios de transporte (para realizar la entrega de tu pedido)
• Servicios de email transaccional (para enviarte confirmaciones de pedido)

No vendemos ni cedemos tus datos a terceros con fines comerciales.`,
    },
    {
        title: '6. Tus Derechos',
        content: `Como usuario, tienes los siguientes derechos sobre tus datos personales según el RGPD:

• Derecho de Acceso: Solicitar qué datos tenemos sobre ti
• Derecho de Rectificación: Corregir datos incorrectos
• Derecho de Supresión ("derecho al olvido"): Solicitar la eliminación de tus datos
• Derecho a la Limitación del Tratamiento: Solicitar que dejemos de usar tus datos temporalmente
• Derecho a la Portabilidad: Recibir tus datos en un formato legible por máquina
• Derecho de Oposición: Oponerte al tratamiento de tus datos para fines de marketing

Para ejercer cualquiera de estos derechos, escríbenos a hola@theracketlab.es. También tienes derecho a presentar una reclamación ante la Agencia Española de Protección de Datos (aepd.es).`,
    },
    {
        title: '7. Seguridad de los Datos',
        content: `Implementamos medidas técnicas y organizativas apropiadas para proteger tus datos personales contra acceso no autorizado, pérdida o destrucción accidental. Toda la comunicación entre tu navegador y nuestra web está cifrada mediante SSL/TLS.

Los pagos son procesados por Stripe, que cumple con el estándar PCI DSS Nivel 1, el más alto nivel de certificación de seguridad en la industria de pagos.`,
    },
    {
        title: '8. Cookies',
        content: `Utilizamos cookies propias y de terceros para:

• Cookies técnicas (esenciales): Funcionamiento del carrito y la sesión
• Cookies analíticas: Análisis anónimo del comportamiento de navegación

Puedes configurar tu navegador para rechazar o eliminar las cookies. Ten en cuenta que algunas funcionalidades de la web pueden no estar disponibles si rechazas las cookies técnicas.`,
    },
    {
        title: '9. Actualizaciones de esta Política',
        content: `Podemos actualizar esta política de privacidad en cualquier momento para adaptarla a cambios legales o en nuestros servicios. Te notificaremos cualquier cambio significativo por email o a través de un aviso prominente en la web.

Última actualización: Enero 2026`,
    },
]

export default function PrivacidadPage() {
    return (
        <div style={{ minHeight: '80vh', padding: '60px 0 100px' }}>
            <div className="container-padel" style={{ maxWidth: 800 }}>
                {/* Back */}
                <Link
                    href="/"
                    className="btn btn-ghost btn-sm"
                    style={{ display: 'inline-flex', gap: 6, marginBottom: 40 }}
                >
                    <ArrowLeft size={16} /> Volver
                </Link>

                {/* Header */}
                <div style={{ marginBottom: 56 }}>
                    <span
                        style={{
                            color: 'var(--accent)',
                            fontSize: 12,
                            fontWeight: 700,
                            letterSpacing: '0.12em',
                            textTransform: 'uppercase',
                            display: 'block',
                            marginBottom: 12,
                        }}
                    >
                        Legal
                    </span>
                    <h1
                        style={{
                            fontFamily: 'Bebas Neue, sans-serif',
                            fontSize: 'clamp(40px, 6vw, 72px)',
                            lineHeight: 1,
                            marginBottom: 16,
                        }}
                    >
                        POLÍTICA DE <span style={{ color: 'var(--accent)' }}>PRIVACIDAD</span>
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
                        Última actualización: Enero 2026 · Cumplimiento RGPD (UE) 2016/679
                    </p>
                </div>

                {/* Intro box */}
                <div
                    style={{
                        padding: 20,
                        background: 'var(--accent-subtle)',
                        border: '1px solid var(--border-hover)',
                        borderRadius: 12,
                        marginBottom: 40,
                        fontSize: 14,
                        color: 'var(--text-secondary)',
                        lineHeight: 1.7,
                    }}
                >
                    🔒 <strong style={{ color: 'var(--accent)' }}>Tu privacidad es importante para nosotros.</strong>{' '}
                    En THE RACKET LAB nos comprometemos a proteger tus datos personales y a ser
                    completamente transparentes sobre cómo los utilizamos. Nunca vendemos tus datos.
                </div>

                {/* Sections */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                    {sections.map((section) => (
                        <section
                            key={section.title}
                            style={{
                                padding: 28,
                                background: 'var(--bg-card)',
                                border: '1px solid var(--border)',
                                borderRadius: 16,
                            }}
                        >
                            <h2
                                style={{
                                    fontSize: 16,
                                    fontWeight: 700,
                                    marginBottom: 14,
                                    color: 'var(--text-primary)',
                                    paddingBottom: 10,
                                    borderBottom: '1px solid var(--border)',
                                }}
                            >
                                {section.title}
                            </h2>
                            <p
                                style={{
                                    color: 'var(--text-secondary)',
                                    fontSize: 14,
                                    lineHeight: 1.8,
                                    whiteSpace: 'pre-line',
                                }}
                            >
                                {section.content}
                            </p>
                        </section>
                    ))}
                </div>

                {/* Contact box */}
                <div
                    style={{
                        marginTop: 48,
                        padding: 28,
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border)',
                        borderRadius: 16,
                        textAlign: 'center',
                    }}
                >
                    <p style={{ fontWeight: 700, marginBottom: 8 }}>¿Preguntas sobre privacidad?</p>
                    <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 20 }}>
                        Escríbenos a{' '}
                        <a href="mailto:hola@theracketlab.es" style={{ color: 'var(--accent)' }}>
                            hola@theracketlab.es
                        </a>{' '}
                        y respondemos en menos de 48h.
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, marginTop: 4 }}>
                        <Link
                            href="/productos"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 8,
                                padding: '14px 32px',
                                background: 'var(--accent)',
                                color: '#fff',
                                borderRadius: 12,
                                fontWeight: 700,
                                fontSize: 15,
                                letterSpacing: '0.04em',
                                textDecoration: 'none',
                                border: '1px solid var(--border-hover)',
                                transition: 'all 0.2s',
                                boxShadow: '0 0 24px var(--accent-glow)',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--accent-dim)')}
                            onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--accent)')}
                        >
                            → Volver a la tienda
                        </Link>
                        <Link href="/" style={{ color: 'var(--text-muted)', fontSize: 13, textDecoration: 'none' }}>
                            ← Ir al inicio
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
