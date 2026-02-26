'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

const sections = [
    {
        title: '1. Información General',
        content: `THE RACKET LAB (en adelante, "la Tienda") es una tienda de ropa técnica de pádel. Al realizar una compra en nuestra web, el cliente acepta los presentes términos y condiciones en su totalidad.

Datos del titular: THE RACKET LAB | Email: hola@theracketlab.es | Web: theracketlab.es`,
    },
    {
        title: '2. Proceso de Compra',
        content: `Para realizar una compra deberás seleccionar los productos deseados, elegir la talla correspondiente y proceder al pago a través de nuestra pasarela de pago Stripe. Una vez completada la transacción, recibirás un email de confirmación con los detalles de tu pedido.

El contrato de compraventa se perfecciona en el momento en que recibes la confirmación del pedido por email.`,
    },
    {
        title: '3. Precios y Pagos',
        content: `Todos los precios mostrados incluyen IVA (21%) según la legislación española. Los precios pueden cambiar sin previo aviso, pero los pedidos ya realizados se cobrarán al precio vigente en el momento de la compra.

Aceptamos Visa, Mastercard, American Express, Apple Pay y Google Pay. El pago es procesado de forma segura por Stripe Inc., que cumple con los estándares PCI DSS de seguridad.`,
    },
    {
        title: '4. Envíos y Plazos de Entrega',
        content: `Los pedidos realizados antes de las 14:00h en días laborables se procesan el mismo día. Los plazos estimados son:

• España Peninsular: 24-48 horas laborables
• Islas Baleares: 2-4 días laborables  
• Canarias, Ceuta y Melilla: 5-7 días laborables
• Europa: 4-8 días laborables

El envío estándar tiene un coste de 3,99€. Envío GRATUITO en pedidos superiores a 80€. En caso de retraso ajeno a nuestra voluntad (huelgas, climatología, etc.), no nos hacemos responsables del tiempo adicional de entrega.`,
    },
    {
        title: '5. Política de Devoluciones y Cambios',
        content: `Tienes 30 días naturales desde la fecha de recepción del pedido para solicitar una devolución o cambio. Para que sea válida, el artículo debe:

• Estar en perfecto estado, sin haber sido usado
• Mantener todas las etiquetas y embalaje originales
• No presentar signos de lavado o deterioro

Para iniciar una devolución, envía un email a hola@theracketlab.es con tu número de pedido. La primera devolución de cada pedido es gratuita. El reembolso se realizará por el mismo método de pago en un plazo de 5-7 días laborables desde la recepción del artículo.`,
    },
    {
        title: '6. Garantía del Producto',
        content: `Todos nuestros productos cuentan con la garantía legal de 2 años establecida por la legislación española. Esta garantía cubre defectos de fabricación, pero no los daños causados por un uso inadecuado o normal desgaste del producto.`,
    },
    {
        title: '7. Propiedad Intelectual',
        content: `Todos los contenidos de esta web (textos, imágenes, logos, diseños) son propiedad de THE RACKET LAB o de sus respectivos titulares y están protegidos por la legislación de propiedad intelectual española e internacional. Queda prohibida su reproducción, distribución o uso comercial sin autorización expresa.`,
    },
    {
        title: '8. Limitación de Responsabilidad',
        content: `THE RACKET LAB no se hace responsable de los daños indirectos, pérdida de beneficios o daños consecuentes derivados del uso o imposibilidad de uso de nuestros productos, salvo en aquellos casos en que la ley no permita tal limitación.`,
    },
    {
        title: '9. Legislación Aplicable',
        content: `Los presentes términos y condiciones se rigen por la legislación española. Para cualquier litigio, ambas partes se someten a la jurisdicción de los tribunales de España, salvo que la normativa de protección al consumidor establezca otro fuero.`,
    },
    {
        title: '10. Modificaciones',
        content: `THE RACKET LAB se reserva el derecho de modificar estos términos en cualquier momento. Las compras realizadas antes de la modificación se regirán por los términos vigentes en el momento de la transacción.

Última actualización: Enero 2026`,
    },
]

export default function TerminosPage() {
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
                        TÉRMINOS Y <span style={{ color: 'var(--accent)' }}>CONDICIONES</span>
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
                        Última actualización: Enero 2026
                    </p>
                </div>

                {/* Sections */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
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

                {/* CTA */}
                <div style={{ textAlign: 'center', marginTop: 60, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
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
    )
}
