import Link from 'next/link'
import { CheckCircle, ArrowRight, ShoppingBag } from 'lucide-react'

export default function CheckoutExitoPage({
    searchParams,
}: {
    searchParams: { session_id?: string }
}) {
    return (
        <div
            style={{
                minHeight: '80vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '40px 24px',
            }}
        >
            <div
                style={{
                    maxWidth: 540,
                    width: '100%',
                    textAlign: 'center',
                }}
            >
                {/* Icon */}
                <div
                    className="animate-scale-in"
                    style={{
                        width: 96,
                        height: 96,
                        borderRadius: '50%',
                        background: 'var(--accent-subtle)',
                        border: '2px solid var(--accent)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 32px',
                    }}
                >
                    <CheckCircle size={48} style={{ color: 'var(--accent)' }} />
                </div>

                {/* Title */}
                <h1
                    className="animate-fade-up"
                    style={{
                        fontFamily: 'Bebas Neue, sans-serif',
                        fontSize: 56,
                        lineHeight: 1,
                        marginBottom: 16,
                    }}
                >
                    ¡PEDIDO CONFIRMADO!
                </h1>

                <p
                    className="animate-fade-up delay-100"
                    style={{
                        color: 'var(--text-secondary)',
                        fontSize: 16,
                        lineHeight: 1.7,
                        marginBottom: 40,
                    }}
                >
                    Tu pedido ha sido procesado correctamente. Recibirás un email de confirmación
                    en breve con todos los detalles y el seguimiento del envío.
                </p>

                {searchParams.session_id && (
                    <p
                        className="animate-fade-up delay-200"
                        style={{
                            fontSize: 12,
                            color: 'var(--text-muted)',
                            background: 'var(--bg-elevated)',
                            borderRadius: 8,
                            padding: '8px 16px',
                            marginBottom: 32,
                            fontFamily: 'monospace',
                        }}
                    >
                        Ref: {searchParams.session_id.slice(0, 30)}...
                    </p>
                )}

                {/* Steps */}
                <div
                    className="animate-fade-up delay-300"
                    style={{
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border)',
                        borderRadius: 16,
                        padding: 24,
                        marginBottom: 32,
                        textAlign: 'left',
                    }}
                >
                    {[
                        { step: '1', title: 'Email de confirmación', desc: 'Te hemos enviado los detalles del pedido.' },
                        { step: '2', title: 'Preparación', desc: 'Tu pedido se prepara en nuestro almacén en 24h.' },
                        { step: '3', title: 'Envío', desc: 'Recibirás el tracking cuando se envíe tu paquete.' },
                    ].map(({ step, title, desc }) => (
                        <div
                            key={step}
                            className="flex items-start gap-16"
                            style={{ marginBottom: step !== '3' ? 20 : 0 }}
                        >
                            <div
                                style={{
                                    width: 28,
                                    height: 28,
                                    borderRadius: '50%',
                                    background: 'var(--accent)',
                                    color: '#000',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: 12,
                                    fontWeight: 700,
                                    flexShrink: 0,
                                }}
                            >
                                {step}
                            </div>
                            <div>
                                <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>{title}</p>
                                <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTAs */}
                <div className="flex gap-4 justify-center flex-wrap animate-fade-up delay-400">
                    <Link
                        href="/productos"
                        className="btn btn-primary"
                        style={{ display: 'inline-flex', gap: 8 }}
                    >
                        <ShoppingBag size={18} /> Seguir comprando
                    </Link>
                    <Link
                        href="/pedidos"
                        className="btn btn-secondary"
                        style={{ display: 'inline-flex', gap: 8 }}
                    >
                        Mis pedidos <ArrowRight size={18} />
                    </Link>
                </div>
            </div>
        </div>
    )
}
