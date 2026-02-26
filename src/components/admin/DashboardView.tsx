'use client'

import { useState, useEffect } from 'react'
import { Package, CheckCircle, RefreshCw, AlertCircle, TrendingUp } from 'lucide-react'
import { Producto } from '@/lib/supabase/types'
import { formatPrice } from '@/lib/utils/cn'

function StatCard({ label, value, color, Icon }: { label: string; value: number | string; color: string; Icon: any }) {
    return (
        <div style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '18px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{label}</p>
                <Icon size={16} style={{ color }} />
            </div>
            <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 38, color, letterSpacing: '0.04em', lineHeight: 1 }}>{value}</p>
        </div>
    )
}

function StockBadge({ label, val }: { label?: string; val: number }) {
    const color = val === 0 ? '#f87171' : val <= 3 ? '#fbbf24' : '#4ade80'
    const bg = val === 0 ? 'rgba(239,68,68,0.08)' : val <= 3 ? 'rgba(251,191,36,0.08)' : 'rgba(74,222,128,0.08)'
    return (
        <span style={{
            display: 'inline-flex', flexDirection: 'column', alignItems: 'center',
            padding: '2px 7px', borderRadius: 6, fontSize: 12, fontWeight: 700,
            background: bg, color, border: `1px solid ${color}30`, minWidth: 28,
        }}>
            {label && <span style={{ fontSize: 9, opacity: 0.6 }}>{label}</span>}
            {val}
        </span>
    )
}

export function DashboardView() {
    const [productos, setProductos] = useState<Producto[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch('/api/productos?all=true')
            .then(r => r.json())
            .then(d => { setProductos(Array.isArray(d) ? d : []); setLoading(false) })
            .catch(() => setLoading(false))
    }, [])

    const totalStock = productos.reduce(
        (s, p) => s + (p.size_s ?? 0) + (p.size_m ?? 0) + (p.size_l ?? 0) + (p.size_xl ?? 0), 0
    )
    const lowStock = productos.filter(p =>
        [(p.size_s ?? 0), (p.size_m ?? 0), (p.size_l ?? 0), (p.size_xl ?? 0)].some(v => v > 0 && v <= 3)
    )
    const activos = productos.filter(p => p.available)

    if (loading) return <div style={{ color: 'rgba(255,255,255,0.3)' }}>Cargando datos...</div>

    return (
        <div className="animate-fade-up">
            <div style={{ marginBottom: 32 }}>
                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 4 }}>Resumen</p>
                <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 38, letterSpacing: '0.04em', lineHeight: 1 }}>DASHBOARD</h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 32 }}>
                <StatCard label="Productos" value={productos.length} color="var(--accent)" Icon={Package} />
                <StatCard label="Activos" value={activos.length} color="#4ade80" Icon={CheckCircle} />
                <StatCard label="Unidades en stock" value={totalStock} color="#60a5fa" Icon={RefreshCw} />
                <StatCard label="Stock bajo (≤3)" value={lowStock.length} color="#f87171" Icon={AlertCircle} />
            </div>

            {lowStock.length > 0 && (
                <div style={{
                    background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.18)',
                    borderRadius: 14, padding: 20, marginBottom: 28,
                }}>
                    <p style={{ fontWeight: 700, fontSize: 13, color: '#f87171', marginBottom: 12, display: 'flex', gap: 8, alignItems: 'center' }}>
                        <AlertCircle size={15} /> Productos con stock bajo
                    </p>
                    {lowStock.map(p => (
                        <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                            <span>{p.name}</span>
                            <span style={{ color: '#f87171', fontWeight: 600, fontSize: 12 }}>
                                S:{p.size_s} M:{p.size_m} L:{p.size_l} XL:{p.size_xl}
                            </span>
                        </div>
                    ))}
                </div>
            )}

            <div style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16 }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                    <p style={{ fontWeight: 700, fontSize: 14 }}>Productos recientes</p>
                </div>
                {productos.slice(0, 5).map((p, i) => (
                    <div key={p.id} style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '12px 20px',
                        borderBottom: i < Math.min(productos.length, 5) - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                    }}>
                        <div>
                            <p style={{ fontWeight: 600, fontSize: 14 }}>{p.name}</p>
                            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>
                                {p.category ?? 'Sin categoría'} · {formatPrice(p.price)}
                            </p>
                        </div>
                        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                            <StockBadge label="S" val={p.size_s ?? 0} />
                            <StockBadge label="M" val={p.size_m ?? 0} />
                            <StockBadge label="L" val={p.size_l ?? 0} />
                            <StockBadge label="XL" val={p.size_xl ?? 0} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
