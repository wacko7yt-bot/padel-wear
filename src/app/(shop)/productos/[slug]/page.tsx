import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ShoppingBag, ArrowLeft, Star, ChevronRight, Check } from 'lucide-react'
import Link from 'next/link'
import { getProductoById, getProductos } from '@/lib/supabase/queries'
import { formatPrice } from '@/lib/utils/cn'
import { ProductCard } from '@/components/shop/ProductCard'
import { ProductGallery } from './ProductGallery'

export default async function ProductDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params
    // El "slug" es en realidad el ID en nuestro esquema de Supabase actual
    const product = await getProductoById(slug)

    if (!product) notFound()

    const allProducts = await getProductos().catch(() => [])
    const related = allProducts.filter((p) => p.id !== product.id).slice(0, 3)

    return (
        <div style={{ minHeight: '80vh', padding: '40px 0 80px' }}>
            <div className="container-padel">
                {/* Breadcrumb */}
                <div
                    className="flex items-center gap-2"
                    style={{ marginBottom: 32, fontSize: 13, color: 'var(--text-muted)' }}
                >
                    <Link href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Inicio</Link>
                    <ChevronRight size={14} />
                    <Link href="/productos" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Tienda</Link>
                    <ChevronRight size={14} />
                    <span style={{ color: 'var(--text-primary)' }}>{product.name}</span>
                </div>

                {/* Back */}
                <Link
                    href="/productos"
                    className="btn btn-ghost btn-sm"
                    style={{ display: 'inline-flex', gap: 6, marginBottom: 32 }}
                >
                    <ArrowLeft size={16} /> Volver
                </Link>

                {/* Main layout */}
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                        gap: 64,
                        alignItems: 'start',
                    }}
                >
                    {/* Images */}
                    <div>
                        <div
                            style={{
                                borderRadius: 20,
                                overflow: 'hidden',
                                aspectRatio: '4/5',
                                position: 'relative',
                                background: 'var(--bg-card)',
                                marginBottom: 12,
                                border: '1px solid var(--border)',
                            }}
                        >
                            {product.images && product.images.length > 0 ? (
                                <Image
                                    src={product.images[0]}
                                    alt={product.name}
                                    fill
                                    sizes="(max-width:768px) 100vw, 50vw"
                                    style={{ objectFit: 'cover' }}
                                    priority
                                />
                            ) : (
                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-elevated)' }}>
                                    <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 64, opacity: 0.1 }}>TRL</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Info & Interaction (Client Component) */}
                    <ProductGallery product={product} />
                </div>

                {/* Related products */}
                {related.length > 0 && (
                    <div style={{ marginTop: 80 }}>
                        <h2
                            style={{
                                fontFamily: 'Bebas Neue, sans-serif',
                                fontSize: 36,
                                marginBottom: 32,
                            }}
                        >
                            TAMBIÉN TE PUEDE GUSTAR
                        </h2>
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                                gap: 24,
                            }}
                        >
                            {related.map((p, i) => (
                                <ProductCard key={p.id} product={p} index={i} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
