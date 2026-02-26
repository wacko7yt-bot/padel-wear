'use client'

import { useEffect, useState } from 'react'
import { Heart, ShoppingBag, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useWishlistStore } from '@/store/wishlistStore'
import { getProductos } from '@/lib/supabase/queries'
import { ProductCard } from '@/components/shop/ProductCard'
import type { Producto } from '@/lib/supabase/types'

export default function WishlistPage() {
    const { items } = useWishlistStore()
    const [products, setProducts] = useState<Producto[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadWishlist = async () => {
            const all = await getProductos().catch(() => [])
            const filtered = all.filter(p => items.includes(p.id))
            setProducts(filtered)
            setLoading(false)
        }
        loadWishlist()
    }, [items])

    return (
        <div style={{ minHeight: '80vh', padding: '60px 0 100px' }}>
            <div className="container-padel">
                <div style={{ marginBottom: 48 }}>
                    <Link
                        href="/productos"
                        className="btn btn-ghost btn-sm"
                        style={{ display: 'inline-flex', gap: 6, marginBottom: 24, paddingLeft: 0 }}
                    >
                        <ArrowLeft size={16} /> Volver a la tienda
                    </Link>
                    <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(48px, 6vw, 72px)', lineHeight: 1 }}>
                        LISTA DE <span style={{ color: 'var(--accent)' }}>DESEOS</span>
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 16 }}>
                        Tus camisetas favoritas guardadas para más tarde.
                    </p>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: 100 }}>Cargando tus favoritos...</div>
                ) : products.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '100px 20px', background: 'var(--bg-elevated)', borderRadius: 32, border: '1px dashed var(--border)' }}>
                        <div style={{ width: 80, height: 80, background: 'rgba(255, 92, 0, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: 'var(--accent)' }}>
                            <Heart size={40} />
                        </div>
                        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>Tu lista está vacía</h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: 32, maxWidth: 400, margin: '0 auto 32px' }}>
                            Explora nuestra colección y guarda las prendas que más te gusten pulsando en el icono del corazón.
                        </p>
                        <Link href="/productos" className="btn btn-primary btn-lg">
                            DESCUBRIR PRODUCTOS
                        </Link>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
                        {products.map((p, i) => (
                            <ProductCard key={p.id} product={p} index={i} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
