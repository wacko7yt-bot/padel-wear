'use client'

import { useState } from 'react'
import { ShoppingBag, Star, Check, Heart, Mail } from 'lucide-react'
import { formatPrice } from '@/lib/utils/cn'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import { createClient } from '@/lib/supabase/client'
import type { Producto } from '@/lib/supabase/types'
import toast from 'react-hot-toast'
import Link from 'next/link'

interface ProductGalleryProps {
    product: Producto
}

const SIZES = [
    { key: 'size_s', label: 'S' },
    { key: 'size_m', label: 'M' },
    { key: 'size_l', label: 'L' },
    { key: 'size_xl', label: 'XL' },
] as const

export function ProductGallery({ product }: ProductGalleryProps) {
    const [selectedSize, setSelectedSize] = useState<string | null>(null)
    const [added, setAdded] = useState(false)
    const [email, setEmail] = useState('')
    const [submitting, setSubmitting] = useState(false)

    const { addItem, openCart } = useCartStore()
    const { toggleItem, isInWishlist } = useWishlistStore()
    const isFavorite = isInWishlist(product.id)
    const supabase = createClient()

    const stockMap: Record<string, number> = {
        S: product.size_s ?? 0,
        M: product.size_m ?? 0,
        L: product.size_l ?? 0,
        XL: product.size_xl ?? 0,
    }

    const hasStock = Object.values(stockMap).some(v => v > 0)

    const handleAdd = () => {
        if (!selectedSize) {
            toast.error('Por favor, selecciona una talla')
            return
        }

        if ((stockMap[selectedSize] ?? 0) === 0) {
            toast.error('Talla sin stock disponible')
            return
        }

        addItem({
            variantId: `${product.id}-${selectedSize}`,
            productId: product.id,
            name: product.name,
            slug: product.id,
            size: selectedSize as any,
            price: product.price,
            quantity: 1,
            image: product.images?.[0] || '/placeholder.jpg',
        })

        setAdded(true)
        openCart()
        toast.success(`¡${product.name} (${selectedSize}) añadido!`)
        setTimeout(() => setAdded(false), 2000)
    }

    return (
        <div>
            {/* Category + Stars */}
            <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
                <span className="badge badge-outline" style={{ textTransform: 'capitalize' }}>
                    {product.category ?? 'Camiseta'}
                </span>
                <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                        <Star
                            key={i}
                            size={14}
                            fill={i < 5 ? 'var(--accent)' : 'none'}
                            color={i < 5 ? 'var(--accent)' : 'var(--text-muted)'}
                        />
                    ))}
                    <span style={{ fontSize: 13, color: 'var(--text-muted)', marginLeft: 6 }}>5.0 (12 reseñas)</span>
                </div>
            </div>

            {/* Name */}
            <h1
                style={{
                    fontFamily: 'Bebas Neue, sans-serif',
                    fontSize: 'clamp(40px, 5vw, 60px)',
                    lineHeight: 1,
                    marginBottom: 12,
                    letterSpacing: '0.02em',
                }}
            >
                {product.name}
            </h1>

            {/* Price */}
            <p
                style={{
                    fontSize: 32,
                    fontWeight: 800,
                    color: 'var(--accent)',
                    marginBottom: 24,
                    fontFamily: 'Bebas Neue, sans-serif'
                }}
            >
                {formatPrice(product.price)}
            </p>

            {/* Description */}
            <p
                style={{
                    color: 'var(--text-secondary)',
                    lineHeight: 1.8,
                    fontSize: 15,
                    marginBottom: 32,
                }}
            >
                {product.description || 'Sin descripción disponible.'}
            </p>

            {/* Size selector */}
            <div style={{ marginBottom: 28 }}>
                <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
                    <p style={{ fontWeight: 600, fontSize: 14 }}>
                        Selecciona Talla
                        {selectedSize && (
                            <span style={{ color: 'var(--accent)', marginLeft: 8 }}>— {selectedSize}</span>
                        )}
                    </p>
                </div>

                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {SIZES.map(({ key, label }) => {
                        const stock = stockMap[label]
                        const available = stock > 0
                        const isSelected = selectedSize === label
                        return (
                            <button
                                key={key}
                                onClick={() => setSelectedSize(isSelected ? null : label)}
                                className={`size-btn ${isSelected ? 'selected' : ''}`}
                                style={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: 12,
                                    border: '1px solid',
                                    borderColor: isSelected ? 'var(--accent)' : available ? 'var(--border)' : 'rgba(255,255,255,0.1)',
                                    background: isSelected ? 'var(--accent)' : 'transparent',
                                    color: isSelected ? '#000' : available ? 'var(--text-primary)' : 'var(--text-muted)',
                                    cursor: 'pointer',
                                    fontWeight: 700,
                                    transition: 'all 0.2s',
                                    opacity: available ? 1 : 0.6,
                                    textDecoration: available ? 'none' : 'line-through'
                                }}
                            >
                                {label}
                            </button>
                        )
                    })}
                </div>

                {selectedSize && stockMap[selectedSize] > 0 && (
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 12 }}>
                        {stockMap[selectedSize] <= 3
                            ? `⚠ Solo quedan ${stockMap[selectedSize]} unidades en stock`
                            : `✓ ${stockMap[selectedSize]} unidades disponibles`}
                    </p>
                )}
            </div>

            {/* CTA */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 56px', gap: 12, marginBottom: 12 }}>
                <button
                    className="btn btn-primary btn-lg"
                    onClick={handleAdd}
                    disabled={!hasStock || !!(selectedSize && stockMap[selectedSize] === 0)}
                    style={{ justifyContent: 'center', gap: 8, height: 56, width: '100%' }}
                >
                    {added ? (
                        <><Check size={20} /> ¡AÑADIDO!</>
                    ) : (
                        <><ShoppingBag size={20} /> {hasStock ? (selectedSize ? 'AÑADIR AL CARRITO' : 'SELECCIONA TALLA') : 'PRODUCTO AGOTADO'}</>
                    )}
                </button>

                <button
                    onClick={() => {
                        toggleItem(product.id)
                        if (!isFavorite) toast.success('Añadido a favoritos')
                    }}
                    className="btn btn-secondary"
                    style={{
                        padding: 0,
                        height: 56,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: isFavorite ? 'rgba(255, 92, 0, 0.1)' : 'transparent',
                        borderColor: isFavorite ? 'var(--accent)' : 'var(--border)',
                        color: isFavorite ? 'var(--accent)' : 'var(--text-primary)',
                    }}
                    title="Añadir a favoritos"
                >
                    <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
                </button>
            </div>

            {/* Notify form if out of stock */}
            {selectedSize && stockMap[selectedSize] === 0 && (
                <div
                    className="animate-fade-in"
                    style={{
                        padding: 20,
                        background: 'rgba(255, 92, 0, 0.05)',
                        border: '1px dashed var(--accent)',
                        borderRadius: 16,
                        marginBottom: 24,
                    }}
                >
                    <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Mail size={16} /> ¡Avísame cuando haya stock!
                    </p>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>
                        La talla {selectedSize} está agotada. Déjanos tu email y te avisaremos en cuanto repongamos.
                    </p>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <input
                            type="email"
                            placeholder="tu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{
                                flex: 1,
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid var(--border)',
                                borderRadius: 10,
                                padding: '0 12px',
                                color: '#fff',
                                outline: 'none',
                                fontSize: 14,
                            }}
                        />
                        <button
                            onClick={async () => {
                                if (!email || !email.includes('@')) return toast.error('Email inválido')
                                setSubmitting(true)
                                const { error } = await supabase.from('stock_notifications').insert({
                                    product_id: product.id,
                                    size: selectedSize,
                                    email: email
                                })
                                setSubmitting(false)
                                if (error) toast.error('Error al guardar')
                                else {
                                    toast.success('¡Te avisaremos!')
                                    setEmail('')
                                }
                            }}
                            disabled={submitting}
                            className="btn btn-primary btn-sm"
                            style={{ padding: '0 16px' }}
                        >
                            {submitting ? '...' : 'AVISARME'}
                        </button>
                    </div>
                </div>
            )}

            <Link
                href="/productos"
                className="btn btn-secondary"
                style={{ width: '100%', justifyContent: 'center', display: 'flex', height: 50, border: '1px solid var(--border)', marginBottom: 24 }}
            >
                Volver a la tienda
            </Link>

            {/* Features */}
            <div
                style={{
                    padding: 20,
                    background: 'var(--bg-card)',
                    borderRadius: 12,
                    border: '1px solid var(--border)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12,
                }}
            >
                {[
                    '🚚 Envío gratis en pedidos +80€',
                    '↩ Devoluciones gratuitas 30 días',
                    '🔒 Pago seguro con Stripe',
                    '⭐ Calidad garantizada',
                ].map((feat) => (
                    <p key={feat} style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                        {feat}
                    </p>
                ))}
            </div>
        </div>
    )
}
