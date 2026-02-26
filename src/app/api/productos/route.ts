export const dynamic = 'force-dynamic'

import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

function getAdminClient() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
}

function getPublicClient() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
}

// GET /api/productos
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const all = searchParams.get('all') === 'true'

    const supabase = getPublicClient()
    let query = supabase.from('productos').select('*').order('created_at', { ascending: false })
    if (!all) query = query.eq('available', true)

    const { data, error } = await query
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data ?? [])
}

// POST /api/productos — crear producto (admin)
export async function POST(req: Request) {
    const supabase = getAdminClient()
    const body = await req.json()

    const { data, error } = await supabase
        .from('productos')
        .insert([{
            name: body.name,
            description: body.description ?? null,
            price: Number(body.price),
            category: body.category ?? null,
            images: body.images ?? null,
            available: body.available ?? true,
            size_s: Number(body.size_s ?? 0),
            size_m: Number(body.size_m ?? 0),
            size_l: Number(body.size_l ?? 0),
            size_xl: Number(body.size_xl ?? 0),
        }])
        .select()
        .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data, { status: 201 })
}
