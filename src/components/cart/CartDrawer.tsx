'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { formatPrice } from '@/lib/utils/cn'
import toast from 'react-hot-toast'

export function CartDrawer() {
    const { items, isOpen, closeCart, removeItem, updateQuantity, totalPrice, clearCart } =
        useCartStore()
    const panelRef = useRef<HTMLDivElement>(null)

    // Close on Escape
    useEffect(() => {
        const handle = (e: KeyboardEvent) => {
            if (e.key === 'Escape') closeCart()
        }
        window.addEventListener('keydown', handle)
        return () => window.removeEventListener('keydown', handle)
    }, [closeCart])

    // Lock body scroll when open
    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : ''
        return () => { document.body.style.overflow = '' }
    }, [isOpen])

    const handleCheckout = async () => {
        toast.loading('Redirigiendo a pago...', { id: 'checkout' })
        try {
            const res = await fetch('/api/stripe/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items }),
            })
            const data = await res.json()
            if (data.url) {
                toast.dismiss('checkout')
                window.location.href = data.url
            } else {
                toast.error('Error al procesar el pago', { id: 'checkout' })
            }
        } catch {
            toast.error('Error de conexión', { id: 'checkout' })
        }
    }

    if (!isOpen) return null

    return (
        <>
            {/* Overlay */}
            <div
                className="drawer-overlay"
                onClick={closeCart}
                aria-hidden
            />

            {/* Panel */}
            <div
                ref={panelRef}
                className="drawer-panel glass-dark"
                style={{ width: '100%', maxWidth: 440 }}
                role="dialog"
                aria-label="Carrito de compra"
            >
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    {/* Header */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '20px 24px',
                            borderBottom: '1px solid var(--border)',
                        }}
                    >
                        <div className="flex items-center gap-3">
                            <ShoppingBag size={20} style={{ color: 'var(--accent)' }} />
                            <h2 style={{ fontWeight: 700, fontSize: 18 }}>Tu carrito</h2>
                            {items.length > 0 && (
                                <span className="badge badge-accent">{items.length}</span>
                            )}
                        </div>
                        <button className="btn btn-icon btn-ghost" onClick={closeCart} aria-label="Cerrar">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
                        {items.length === 0 ? (
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: '100%',
                                    gap: 16,
                                    color: 'var(--text-muted)',
                                }}
                            >
                                <ShoppingBag size={56} style={{ opacity: 0.2 }} />
                                <p style={{ fontSize: 16, fontWeight: 500, color: 'var(--text-secondary)' }}>
                                    Tu carrito está vacío
                                </p>
                                <p style={{ fontSize: 14, textAlign: 'center' }}>
                                    Echa un vistazo a nuestra colección
                                </p>
                                <Link
                                    href="/productos"
                                    className="btn btn-primary btn-sm"
                                    onClick={closeCart}
                                    style={{ marginTop: 8 }}
                                >
                                    Ver colección
                                </Link>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {items.map((item) => (
                                    <div
                                        key={item.variantId}
                                        className="card animate-fade-up"
                                        style={{ padding: 12, flexDirection: 'row', display: 'flex', gap: 12, border: 'none', background: 'var(--bg-elevated)' }}
                                    >
                                        {/* Image */}
                                        <div
                                            className="img-zoom"
                                            style={{
                                                width: 72,
                                                height: 80,
                                                borderRadius: 8,
                                                flexShrink: 0,
                                                background: 'var(--bg-card)',
                                                overflow: 'hidden',
                                                position: 'relative',
                                            }}
                                        >
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                sizes="72px"
                                                style={{ objectFit: 'cover' }}
                                            />
                                        </div>

                                        {/* Info */}
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}
                                                className="truncate">{item.name}</p>
                                            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>
                                                Talla: <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{item.size}</span>
                                            </p>

                                            <div className="flex items-center justify-between">
                                                {/* Qty controls */}
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 8,
                                                        background: 'var(--bg-card)',
                                                        borderRadius: 8,
                                                        padding: '4px 8px',
                                                    }}
                                                >
                                                    <button
                                                        onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                                                        style={{
                                                            width: 24, height: 24, display: 'flex',
                                                            alignItems: 'center', justifyContent: 'center',
                                                            color: 'var(--text-secondary)', cursor: 'pointer',
                                                            background: 'none', border: 'none',
                                                        }}
                                                    >
                                                        <Minus size={12} />
                                                    </button>
                                                    <span style={{ fontSize: 14, fontWeight: 600, minWidth: 16, textAlign: 'center' }}>
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                                                        style={{
                                                            width: 24, height: 24, display: 'flex',
                                                            alignItems: 'center', justifyContent: 'center',
                                                            color: 'var(--text-secondary)', cursor: 'pointer',
                                                            background: 'none', border: 'none',
                                                        }}
                                                    >
                                                        <Plus size={12} />
                                                    </button>
                                                </div>

                                                <div className="flex items-center gap-8">
                                                    <span style={{ fontWeight: 700, color: 'var(--accent)', fontSize: 15 }}>
                                                        {formatPrice(item.price * item.quantity)}
                                                    </span>
                                                    <button
                                                        onClick={() => {
                                                            removeItem(item.variantId)
                                                            toast.success('Eliminado del carrito')
                                                        }}
                                                        style={{
                                                            background: 'none',
                                                            border: 'none',
                                                            color: 'var(--text-muted)',
                                                            cursor: 'pointer',
                                                            padding: 4,
                                                        }}
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {items.length > 0 && (
                        <div
                            style={{
                                padding: '20px 24px',
                                borderTop: '1px solid var(--border)',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 12,
                            }}
                        >
                            {/* Subtotal */}
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                }}
                            >
                                <span style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Subtotal</span>
                                <span style={{ fontWeight: 800, fontSize: 20 }}>{formatPrice(totalPrice())}</span>
                            </div>
                            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                                Gastos de envío calculados en el checkout. Envío gratis a partir de 80€.
                            </p>

                            <button
                                className="btn btn-primary btn-lg"
                                onClick={handleCheckout}
                                style={{ width: '100%', justifyContent: 'center', gap: 8 }}
                            >
                                Finalizar compra <ArrowRight size={18} />
                            </button>

                            <button
                                className="btn btn-ghost btn-sm"
                                onClick={() => { clearCart(); toast.success('Carrito vaciado') }}
                                style={{ color: 'var(--text-muted)', fontSize: 12, textAlign: 'center' }}
                            >
                                Vaciar carrito
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}
