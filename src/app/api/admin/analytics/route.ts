export const dynamic = 'force-dynamic'

import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET() {
    // 1. Verificar sesión de administrador
    const supabaseClient = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { data: { session } } = await supabaseClient.auth.getSession()

    if (session?.user.email !== 'admin@theracketlab.es') {
        return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    // 2. Usar Service Role para analíticas detalladas
    const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    try {
        // --- A. KPI GLOBALES ---
        const { data: pedidos, error: pError } = await supabaseAdmin
            .from('pedidos')
            .select('*, productos(name, price)')
            .order('created_at', { ascending: true })

        if (pError) throw pError

        const totalRevenue = pedidos.reduce((acc, p) => acc + (p.precio_unitario || p.productos?.price || 0) * (p.cantidad || 1), 0)
        const totalOrders = pedidos.length
        const totalUnits = pedidos.reduce((acc, p) => acc + (p.cantidad || 1), 0)

        // --- B. VENTAS POR DÍA (Últimos 30 días) ---
        const salesByDay: Record<string, number> = {}
        const today = new Date()
        for (let i = 29; i >= 0; i--) {
            const date = new Date(today)
            date.setDate(today.getDate() - i)
            const key = date.toISOString().split('T')[0]
            salesByDay[key] = 0
        }

        pedidos.forEach(p => {
            const dateStr = new Date(p.created_at).toISOString().split('T')[0]
            if (salesByDay[dateStr] !== undefined) {
                salesByDay[dateStr] += (p.precio_unitario || p.productos?.price || 0) * (p.cantidad || 1)
            }
        })

        const chartData = Object.entries(salesByDay).map(([date, total]) => ({
            date,
            total: Math.round(total * 100) / 100
        }))

        // --- C. TOP PRODUCTOS ---
        const productStats: Record<string, { name: string; sales: number; units: number }> = {}
        pedidos.forEach(p => {
            const pid = p.product_id
            const pname = p.productos?.name || 'Producto Desconocido'
            if (!productStats[pid]) {
                productStats[pid] = { name: pname, sales: 0, units: 0 }
            }
            productStats[pid].sales += (p.precio_unitario || p.productos?.price || 0) * (p.cantidad || 1)
            productStats[pid].units += (p.cantidad || 1)
        })

        const topProducts = Object.values(productStats)
            .sort((a, b) => b.units - a.units)
            .slice(0, 5)

        // --- D. PEOR VENDIDOS (Opcional) ---
        const bottomProducts = Object.values(productStats)
            .sort((a, b) => a.units - b.units)
            .slice(0, 5)

        return NextResponse.json({
            summary: {
                revenue: Math.round(totalRevenue * 100) / 100,
                orders: totalOrders,
                units: totalUnits,
                avgOrder: totalOrders > 0 ? Math.round((totalRevenue / totalOrders) * 100) / 100 : 0
            },
            chartData,
            topProducts,
            bottomProducts
        })

    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
