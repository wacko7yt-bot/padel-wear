'use client'

import { useState, useEffect } from 'react'
import { ShoppingCart, ExternalLink } from 'lucide-react'
import { formatPrice } from '@/lib/utils/cn'

export function PedidosView() {
    const [pedidos, setPedidos] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch('/api/admin/pedidos')
            .then(r => r.json())
            .then(d => { setPedidos(Array.isArray(d) ? d : []); setLoading(false) })
            .catch(() => setLoading(false))
    }, [])

    if (loading) return <div style={{ color: 'rgba(255,255,255,0.3)' }}>Cargando ventas...</div>

    return (
        <div className="animate-fade-up">
            <div style={{ marginBottom: 32 }}>
                <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 38, letterSpacing: '0.04em' }}>PEDIDOS</h2>
            </div>

            {pedidos.length === 0 ? (
                <div style={{ padding: 48, textAlign: 'center', background: '#161616', borderRadius: 16, border: '1px solid rgba(255,255,255,0.07)' }}>
                    <ShoppingCart size={40} style={{ marginBottom: 12, opacity: 0.3, margin: '0 auto' }} />
                    <p style={{ color: 'rgba(255,255,255,0.4)' }}>No hay pedidos registrados.</p>
                </div>
            ) : (
                <div style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left' }}>
                                <th style={{ padding: 16, fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>ID</th>
                                <th style={{ padding: 16, fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>CARACTERÍSTICAS</th>
                                <th style={{ padding: 16, fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>TOTAL</th>
                                <th style={{ padding: 16, fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>ESTADO</th>
                                <th style={{ padding: 16, fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>ACCIONES</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pedidos.map(p => (
                                <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td style={{ padding: 16, fontFamily: 'monospace', fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
                                        #{p.id.slice(0, 8)}
                                    </td>
                                    <td style={{ padding: 16 }}>
                                        <p style={{ fontWeight: 600, fontSize: 14 }}>{p.email_cliente}</p>
                                        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>
                                            {p.productos?.name} (x{p.cantidad}) — Talla {p.talla_comprada}
                                        </p>
                                    </td>
                                    <td style={{ padding: 16, fontWeight: 700, color: 'var(--accent)' }}>
                                        {formatPrice((p.productos?.price ?? 0) * (p.cantidad ?? 1))}
                                    </td>
                                    <td style={{ padding: 16 }}>
                                        <span style={{
                                            padding: '4px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700,
                                            background: 'rgba(74,222,128,0.1)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.2)'
                                        }}>
                                            {p.estado_pago?.toUpperCase() || 'PAGADO'}
                                        </span>
                                    </td>
                                    <td style={{ padding: 16 }}>
                                        {p.stripe_session_id && (
                                            <a
                                                href={`https://dashboard.stripe.com/payments/${p.stripe_session_id}`}
                                                target="_blank" rel="noreferrer"
                                                style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontSize: 12 }}
                                            >
                                                Ver en Stripe <ExternalLink size={12} />
                                            </a>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
