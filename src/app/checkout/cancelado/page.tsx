import Link from 'next/link'
import { XCircle, ArrowLeft, ShoppingBag } from 'lucide-react'

export default function CheckoutCanceladoPage() {
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
            <div style={{ maxWidth: 480, width: '100%', textAlign: 'center' }}>
                {/* Icon */}
                <div
                    className="animate-scale-in"
                    style={{
                        width: 96,
                        height: 96,
                        borderRadius: '50%',
                        background: 'rgba(239,68,68,0.1)',
                        border: '2px solid #f87171',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 32px',
                    }}
                >
                    <XCircle size={48} style={{ color: '#f87171' }} />
                </div>

                <h1
                    className="animate-fade-up"
                    style={{
                        fontFamily: 'Bebas Neue, sans-serif',
                        fontSize: 52,
                        lineHeight: 1,
                        marginBottom: 16,
                    }}
                >
                    PAGO CANCELADO
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
                    Parece que has cancelado el proceso de pago. Tu carrito sigue guardado
                    por si quieres intentarlo de nuevo.
                </p>

                <div className="flex gap-4 justify-center flex-wrap animate-fade-up delay-200">
                    <Link
                        href="/productos"
                        className="btn btn-primary"
                        style={{ display: 'inline-flex', gap: 8 }}
                    >
                        <ShoppingBag size={18} /> Volver a la tienda
                    </Link>
                    <Link
                        href="/"
                        className="btn btn-secondary"
                        style={{ display: 'inline-flex', gap: 8 }}
                    >
                        <ArrowLeft size={18} /> Inicio
                    </Link>
                </div>
            </div>
        </div>
    )
}
