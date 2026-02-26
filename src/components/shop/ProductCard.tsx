'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingBag, Eye, Star } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import { formatPrice } from '@/lib/utils/cn'
import type { Producto } from '@/lib/supabase/types'
import toast from 'react-hot-toast'
import { Heart } from 'lucide-react'

interface ProductCardProps {
    product: Producto
    index?: number
}

const SIZES = [
    { key: 'size_s', label: 'S' },
    { key: 'size_m', label: 'M' },
    { key: 'size_l', label: 'L' },
    { key: 'size_xl', label: 'XL' },
] as const

export function ProductCard({ product, index = 0 }: ProductCardProps) {
    const [selectedSize, setSelectedSize] = useState<string | null>(null)
    const [hovered, setHovered] = useState(false)
    const { addItem, openCart } = useCartStore()
    const { toggleItem, isInWishlist } = useWishlistStore()
    const isFavorite = isInWishlist(product.id)

    const stockMap: Record<string, number> = {
        S: product.size_s ?? 0,
        M: product.size_m ?? 0,
        L: product.size_l ?? 0,
        XL: product.size_xl ?? 0,
    }

    const hasStock = Object.values(stockMap).some(v => v > 0)

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        if (!selectedSize) {
            toast.error('Selecciona una talla primero')
            return
        }

        if ((stockMap[selectedSize] ?? 0) === 0) {
            toast.error('Talla sin stock')
            return
        }

        addItem({
            variantId: `${product.id}-${selectedSize}`,
            productId: product.id,
            name: product.name,
            slug: product.id, // Usamos ID como slug ya que la DB no tiene slug
            size: selectedSize as any,
            price: product.price,
            quantity: 1,
            image: product.images?.[0] || '/placeholder.jpg',
        })

        openCart()
        toast.success(`${product.name} (${selectedSize}) añadido ✓`)
    }

    return (
        <article
            className="card animate-fade-up"
            style={{
                animationDelay: `${index * 80}ms`,
                background: 'var(--bg-card)',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.3s ease, border-color 0.3s ease',
                border: hovered ? '1px solid var(--accent)' : '1px solid var(--border)',
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* Image */}
            <div className="img-zoom" style={{ position: 'relative', aspectRatio: '4/5', overflow: 'hidden' }}>
                {product.images?.[0] ? (
                    <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
                        style={{
                            objectFit: 'cover',
                            transition: 'transform 0.5s ease',
                            transform: hovered ? 'scale(1.05)' : 'scale(1)'
                        }}
                        priority={index < 3}
                    />
                ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-elevated)' }}>
                        <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 40, opacity: 0.1 }}>TRL</span>
                    </div>
                )}

                {/* Overlay on hover */}
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)',
                        opacity: hovered ? 1 : 0,
                        transition: 'opacity 0.3s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-end',
                        padding: 16,
                        gap: 8,
                    }}
                >
                    <p style={{ fontSize: 10, color: '#fff', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', opacity: 0.8 }}>
                        Tallas disponibles
                    </p>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {SIZES.map(({ label }) => {
                            const available = stockMap[label] > 0
                            const isSelected = selectedSize === label
                            return (
                                <button
                                    key={label}
                                    onClick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        if (available) setSelectedSize(isSelected ? null : label)
                                    }}
                                    className={`size-btn ${isSelected ? 'selected' : ''}`}
                                    style={{
                                        width: 34,
                                        height: 34,
                                        fontSize: 11,
                                        opacity: available ? 1 : 0.2,
                                        cursor: available ? 'pointer' : 'not-allowed',
                                        background: isSelected ? 'var(--accent)' : 'rgba(0,0,0,0.5)',
                                        border: isSelected ? 'none' : '1px solid rgba(255,255,255,0.2)',
                                        color: isSelected ? '#000' : '#fff'
                                    }}
                                    disabled={!available}
                                >
                                    {label}
                                </button>
                            )
                        })}
                    </div>
                </div>

                {/* Badges */}
                <div
                    style={{
                        position: 'absolute',
                        top: 12,
                        left: 12,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 6,
                    }}
                >
                    {!hasStock && <span className="badge badge-error">Agotado</span>}
                    {product.category && <span className="badge badge-outline" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>{product.category}</span>}
                </div>

                {/* Quick view */}
                <Link
                    href={`/productos/${product.id}`}
                    style={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        width: 36,
                        height: 36,
                        background: 'rgba(0,0,0,0.5)',
                        backdropFilter: 'blur(4px)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 8,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        opacity: hovered ? 1 : 0,
                        transition: 'opacity 0.2s',
                    }}
                    aria-label="Ver producto"
                    onClick={(e) => e.stopPropagation()}
                >
                    <Eye size={16} />
                </Link>

                {/* Wishlist button */}
                <button
                    onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        toggleItem(product.id)
                        if (!isFavorite) toast.success('Añadido a favoritos')
                        else toast('Eliminado de favoritos', { icon: '🗑️' })
                    }}
                    style={{
                        position: 'absolute',
                        top: 56,
                        right: 12,
                        width: 36,
                        height: 36,
                        background: isFavorite ? 'rgba(255, 92, 0, 0.2)' : 'rgba(0,0,0,0.5)',
                        backdropFilter: 'blur(4px)',
                        border: isFavorite ? '1px solid var(--accent)' : '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 8,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isFavorite ? 'var(--accent)' : '#fff',
                        opacity: hovered || isFavorite ? 1 : 0,
                        transition: 'all 0.2s',
                        cursor: 'pointer',
                    }}
                    aria-label="Favorito"
                >
                    <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} />
                </button>
            </div>

            {/* Info */}
            <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                        <Star
                            key={i}
                            size={11}
                            fill={i < 5 ? 'var(--accent)' : 'none'}
                            color={i < 5 ? 'var(--accent)' : 'var(--text-muted)'}
                        />
                    ))}
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 4 }}>(12)</span>
                </div>

                <div style={{ flex: 1 }}>
                    <Link
                        href={`/productos/${product.id}`}
                        style={{ textDecoration: 'none' }}
                    >
                        <h3
                            style={{
                                fontWeight: 700,
                                fontSize: 15,
                                color: 'var(--text-primary)',
                                transition: 'color 0.2s',
                            }}
                        >
                            {product.name}
                        </h3>
                    </Link>
                    {product.description && (
                        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {product.description}
                        </p>
                    )}
                </div>

                {/* Price + CTA */}
                <div className="flex items-center justify-between" style={{ marginTop: 4 }}>
                    <span style={{ fontWeight: 800, fontSize: 18, color: 'var(--accent)', fontFamily: 'Bebas Neue, sans-serif' }}>
                        {formatPrice(product.price)}
                    </span>

                    <button
                        className="btn btn-primary btn-sm"
                        onClick={handleAddToCart}
                        disabled={!hasStock}
                        style={{
                            display: 'flex',
                            gap: 6,
                            alignItems: 'center',
                            padding: '6px 12px',
                            background: selectedSize ? 'var(--accent)' : 'transparent',
                            color: selectedSize ? '#000' : 'var(--accent)',
                            border: '1px solid var(--accent)'
                        }}
                    >
                        <ShoppingBag size={14} />
                        <span style={{ fontSize: 11, fontWeight: 700 }}>
                            {selectedSize ? `Añadir ${selectedSize}` : 'Añadir'}
                        </span>
                    </button>
                </div>
            </div>
        </article>
    )
}
