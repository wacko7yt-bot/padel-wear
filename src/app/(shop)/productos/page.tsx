'use client'

import { useState, useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'
import { ProductCard } from '@/components/shop/ProductCard'
import type { Producto } from '@/lib/supabase/types'

export default function TiendaPage() {
    const [productos, setProductos] = useState<Producto[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [search, setSearch] = useState('')
    const [catFilter, setCatFilter] = useState('todos')

    useEffect(() => {
        fetch('/api/productos')
            .then(r => r.json())
            .then(data => {
                if (Array.isArray(data)) setProductos(data)
                else setError('Error al cargar productos')
                setLoading(false)
            })
            .catch(() => { setError('Error de conexión'); setLoading(false) })
    }, [])

    const categorias = ['todos', ...Array.from(new Set(productos.map(p => p.category).filter(Boolean) as string[]))]

    const filtered = productos.filter(p => {
        const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
            (p.description ?? '').toLowerCase().includes(search.toLowerCase())
        const matchCat = catFilter === 'todos' || p.category === catFilter
        return matchSearch && matchCat
    })

    return (
        <div style={{ minHeight: '80vh', padding: '60px 0 100px' }}>
            <div className="container-padel">
                {/* Header */}
                <div style={{ marginBottom: 48 }}>
                    <p style={{ color: 'var(--accent)', fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>
                        Colección completa
                    </p>
                    <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(40px,6vw,72px)', lineHeight: 1, marginBottom: 8 }}>
                        TODOS LOS <span style={{ color: 'var(--accent)' }}>PRODUCTOS</span>
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
                        {loading ? 'Cargando…' : `${filtered.length} producto${filtered.length !== 1 ? 's' : ''} disponibles`}
                    </p>
                </div>

                {/* Filters */}
                <div style={{ display: 'flex', gap: 12, marginBottom: 40, flexWrap: 'wrap', alignItems: 'center' }}>
                    <input
                        type="search"
                        placeholder="Buscar productos…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{
                            padding: '10px 16px', borderRadius: 10, background: 'var(--bg-card)',
                            border: '1px solid var(--border)', color: 'var(--text-primary)', fontSize: 14,
                            outline: 'none', minWidth: 220,
                        }}
                    />
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {categorias.map(cat => (
                            <button key={cat} onClick={() => setCatFilter(cat)} style={{
                                padding: '8px 16px', borderRadius: 8, border: '1px solid',
                                borderColor: catFilter === cat ? 'var(--accent)' : 'var(--border)',
                                background: catFilter === cat ? 'var(--accent-glow)' : 'transparent',
                                color: catFilter === cat ? 'var(--accent)' : 'var(--text-muted)',
                                cursor: 'pointer', fontSize: 13, fontWeight: catFilter === cat ? 700 : 400,
                                textTransform: 'capitalize',
                            }}>
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* States */}
                {loading && (
                    <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
                        <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 24, color: 'var(--accent)', marginBottom: 8 }}>CARGANDO</div>
                        <p>Conectando con Supabase…</p>
                    </div>
                )}

                {error && (
                    <div style={{ textAlign: 'center', padding: 40, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 16 }}>
                        <AlertTriangle size={32} style={{ color: '#f87171', marginBottom: 12 }} />
                        <p style={{ color: '#f87171', fontWeight: 600 }}>{error}</p>
                        <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 8 }}>
                            Comprueba que las variables de Supabase en .env.local están configuradas.
                        </p>
                    </div>
                )}

                {!loading && !error && filtered.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
                        <p style={{ fontSize: 18, marginBottom: 8 }}>No hay productos que coincidan.</p>
                        <button onClick={() => { setSearch(''); setCatFilter('todos') }} style={{ color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>
                            Ver todos
                        </button>
                    </div>
                )}

                {/* Grid */}
                {!loading && !error && filtered.length > 0 && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 24 }}>
                        {filtered.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
                    </div>
                )}
            </div>
        </div>
    )
}
