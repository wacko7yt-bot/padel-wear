import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Usamos Service Role para operaciones administrativas (POST, PATCH, DELETE)
// para saltar las políticas de RLS.
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

// Next.js 15: params es una Promesa
type RouteParams = { params: Promise<{ id: string }> }

// GET /api/productos/[id]
export async function GET(_req: Request, { params }: RouteParams) {
    const { id } = await params
    const { data, error } = await getPublicClient()
        .from('productos').select('*').eq('id', id).single()

    if (error) return NextResponse.json({ error: error.message }, { status: 404 })
    return NextResponse.json(data)
}

// PATCH /api/productos/[id] — actualizar
export async function PATCH(req: Request, { params }: RouteParams) {
    const { id } = await params
    const body = await req.json()
    const updates: Record<string, unknown> = {}
    const fields = ['name', 'description', 'price', 'category', 'images', 'available', 'size_s', 'size_m', 'size_l', 'size_xl']

    for (const f of fields) {
        if (body[f] !== undefined) {
            updates[f] = ['price', 'size_s', 'size_m', 'size_l', 'size_xl'].includes(f)
                ? Number(body[f])
                : body[f]
        }
    }

    const { data, error } = await getAdminClient()
        .from('productos').update(updates).eq('id', id).select().single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
}

// DELETE /api/productos/[id]
export async function DELETE(_req: Request, { params }: RouteParams) {
    const { id } = await params
    // Usamos el cliente admin para asegurar que podemos borrar sin bloqueos de RLS
    const { error } = await getAdminClient().from('productos').delete().eq('id', id)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
}
