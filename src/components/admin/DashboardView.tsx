'use client'

import { useState, useEffect } from 'react'
import {
    Package, CheckCircle, RefreshCw, AlertCircle,
    TrendingUp, DollarSign, ShoppingBag, ArrowUpRight
} from 'lucide-react'
import { Producto } from '@/lib/supabase/types'
import { formatPrice } from '@/lib/utils/cn'
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, BarChart, Bar, Cell
} from 'recharts'

interface AnalyticsData {
    summary: {
        revenue: number
        orders: number
        units: number
        avgOrder: number
    }
    chartData: Array<{ date: string; total: number }>
    topProducts: Array<{ name: string; sales: number; units: number }>
    bottomProducts: Array<{ name: string; sales: number; units: number }>
}

function StatCard({ label, value, color, Icon, secondary }: { label: string; value: number | string; color: string; Icon: any; secondary?: string }) {
    return (
        <div style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>{label}</p>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={16} style={{ color }} />
                </div>
            </div>
            <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 36, color, letterSpacing: '0.04em', lineHeight: 1 }}>{value}</p>
            {secondary && <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 6 }}>{secondary}</p>}
        </div>
    )
}

export function DashboardView() {
    const [productos, setProductos] = useState<Producto[]>([])
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadData = async () => {
            try {
                const [pRes, aRes] = await Promise.all([
                    fetch('/api/productos?all=true'),
                    fetch('/api/admin/analytics')
                ])
                const pData = await pRes.json()
                const aData = await aRes.json()
                setProductos(Array.isArray(pData) ? pData : [])
                setAnalytics(aData)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        loadData()
    }, [])

    if (loading) return (
        <div style={{ minHeight: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.3)' }}>
            <RefreshCw className="animate-spin" size={24} />
            <span style={{ marginLeft: 12 }}>Analizando datos de la tienda...</span>
        </div>
    )

    return (
        <div className="animate-fade-up">
            <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <p style={{ color: 'var(--accent)', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 4 }}>Panel de Control</p>
                    <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 42, letterSpacing: '0.04em', lineHeight: 1 }}>DASHBOARD</h2>
                </div>
                <div style={{ textAlign: 'right', fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>
                    Últimos 30 días · {new Date().toLocaleDateString()}
                </div>
            </div>

            {/* KPIs Principales */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 32 }}>
                <StatCard
                    label="Ingresos Totales"
                    value={formatPrice(analytics?.summary.revenue || 0)}
                    color="var(--accent)"
                    Icon={DollarSign}
                    secondary={`${analytics?.summary.orders || 0} pedidos confirmados`}
                />
                <StatCard
                    label="Ticket Medio"
                    value={formatPrice(analytics?.summary.avgOrder || 0)}
                    color="#4ade80"
                    Icon={TrendingUp}
                    secondary="Por pedido"
                />
                <StatCard
                    label="Unidades Vendidas"
                    value={analytics?.summary.units || 0}
                    color="#60a5fa"
                    Icon={ShoppingBag}
                    secondary="En el periodo total"
                />
                <StatCard
                    label="Conversión"
                    value="4.2%"
                    color="#fbbf24"
                    Icon={ArrowUpRight}
                    secondary="+0.8% vs mes anterior"
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 24, marginBottom: 32 }}>
                {/* Gráfico de Ventas */}
                <div style={{ background: '#121212', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 20, padding: '24px' }}>
                    <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
                        <TrendingUp size={18} color="var(--accent)" /> Tendencia de Ventas (€)
                    </p>
                    <div style={{ height: 300, width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={analytics?.chartData || []}>
                                <defs>
                                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10 }}
                                    tickFormatter={(val) => val.split('-')[2]} // Solo el día
                                />
                                <YAxis hide />
                                <Tooltip
                                    contentStyle={{ background: '#1c1c1c', border: 'none', borderRadius: 12, boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
                                    itemStyle={{ color: 'var(--accent)' }}
                                />
                                <Area type="monotone" dataKey="total" stroke="var(--accent)" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top/Bottom Productos */}
                <div style={{ background: '#121212', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 20, padding: '24px' }}>
                    <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Package size={18} color="#4ade80" /> Rendimiento de Productos
                    </p>
                    <div style={{ height: 300, width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={analytics?.topProducts || []} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.05)" />
                                <XAxis type="number" hide />
                                <YAxis
                                    dataKey="name"
                                    type="category"
                                    axisLine={false}
                                    tickLine={false}
                                    width={120}
                                    tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
                                />
                                <Tooltip
                                    cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                                    contentStyle={{ background: '#1c1c1c', border: 'none', borderRadius: 12 }}
                                />
                                <Bar dataKey="units" radius={[0, 4, 4, 0]}>
                                    {(analytics?.chartData || []).map((_, index: number) => (
                                        <Cell key={`cell-${index}`} fill={index === 0 ? 'var(--accent)' : 'rgba(255,255,255,0.1)'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Alertas de Stock */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
                <div style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: '24px' }}>
                    <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <AlertCircle size={16} color="#f87171" /> Reponer Inventario
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {productos.filter((p: Producto) => (p.size_s || 0) + (p.size_m || 0) + (p.size_l || 0) + (p.size_xl || 0) <= 5).map((p: Producto) => (
                            <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>{p.name}</span>
                                <span style={{ padding: '4px 10px', background: '#f8717115', color: '#f87171', borderRadius: 8, fontSize: 11, fontWeight: 700 }}>
                                    Crítico
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Ranking detallado */}
                <div style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: '24px' }}>
                    <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 20 }}>Rendimiento Comercial</p>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <th style={{ textAlign: 'left', paddingBottom: 12, fontSize: 11, color: 'rgba(255,255,255,0.3)', fontWeight: 500 }}>PRODUCTO</th>
                                <th style={{ textAlign: 'right', paddingBottom: 12, fontSize: 11, color: 'rgba(255,255,255,0.3)', fontWeight: 500 }}>VENTAS</th>
                                <th style={{ textAlign: 'right', paddingBottom: 12, fontSize: 11, color: 'rgba(255,255,255,0.3)', fontWeight: 500 }}>INGRESOS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {analytics?.topProducts.slice(0, 3).map((p: any) => (
                                <tr key={p.name} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                    <td style={{ padding: '12px 0', fontSize: 13 }}>{p.name}</td>
                                    <td style={{ textAlign: 'right', fontSize: 13 }}>{p.units}</td>
                                    <td style={{ textAlign: 'right', fontSize: 13, fontWeight: 700, color: 'var(--accent)' }}>{formatPrice(p.sales)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
