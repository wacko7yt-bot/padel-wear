'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Producto } from '@/lib/supabase/types'
import { Zap } from 'lucide-react'

interface TickerItem {
    id: string
    text: string
}

export function StockTicker() {
    const [items, setItems] = useState<TickerItem[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    const processProducts = useCallback((products: Producto[]) => {
        const lowStockItems: TickerItem[] = []
        products.forEach(p => {
            const sizes = [
                { label: 'S', stock: p.size_s ?? 0 },
                { label: 'M', stock: p.size_m ?? 0 },
                { label: 'L', stock: p.size_l ?? 0 },
                { label: 'XL', stock: p.size_xl ?? 0 },
            ]

            sizes.forEach(s => {
                if (s.stock < 5) {
                    const status = s.stock === 0
                        ? 'AGOTADO'
                        : s.stock === 1 ? '¡SOLO 1!' : `${s.stock} left`

                    lowStockItems.push({
                        id: `${p.id}-${s.label}`,
                        text: `${p.name} Talla ${s.label} (${status})`
                    })
                }
            })
        })
        setItems(lowStockItems)
    }, [])

    const fetchInitialData = useCallback(async () => {
        const { data, error } = await supabase
            .from('productos')
            .select('*')
            .eq('available', true)

        if (!error && data) {
            processProducts(data as Producto[])
        }
        setLoading(false)
    }, [supabase, processProducts])

    useEffect(() => {
        fetchInitialData()

        // Realtime Subscription
        const channel = supabase
            .channel('stock-ticker-changes')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'productos' },
                () => {
                    // Refetch all to simplify state management of derived stock items
                    fetchInitialData()
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [supabase, fetchInitialData])

    if (loading || items.length === 0) return null

    return (
        <div style={{
            background: '#0a0a0a',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            height: 32,
            display: 'flex',
            alignItems: 'center',
            overflow: 'hidden',
            position: 'relative',
            zIndex: 40,
        }}>
            <div className="flex animate-marquee whitespace-nowrap">
                {/* Doble render para el bucle infinito suave */}
                {[...items, ...items, ...items].map((item, idx) => (
                    <div
                        key={`${item.id}-${idx}`}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            padding: '0 40px',
                            fontFamily: 'var(--font-mono)',
                            fontSize: 11,
                            letterSpacing: '0.05em',
                            textTransform: 'uppercase'
                        }}
                    >
                        <Zap size={10} className="text-accent fill-accent" style={{ marginRight: 8 }} />
                        <span style={{ color: '#fff', marginRight: 8 }}>ÚLTIMAS UNIDADES:</span>
                        <span className="text-accent font-bold">
                            {item.text}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}
