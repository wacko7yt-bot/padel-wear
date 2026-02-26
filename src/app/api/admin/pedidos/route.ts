export const dynamic = 'force-dynamic'

import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET() {
    // 1. Verificar sesión de administrador
    const { data: { session } } = await createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    ).auth.getSession()

    if (session?.user.email !== 'admin@theracketlab.es') {
        return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    // 2. Usar Service Role para obtener todos los pedidos (saltando RLS)
    const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { data, error } = await supabaseAdmin
        .from('pedidos')
        .select(`
            *,
            productos (
                name,
                price
            )
        `)
        .order('created_at', { ascending: false })
        .limit(100)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data ?? [])
}
