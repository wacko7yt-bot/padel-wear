import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ ok: true }) // No hacemos seguimiento a invitados sin email
        }

        const { items } = await request.json()

        // Upsert el carrito abandonado
        const { error } = await supabase
            .from('carritos_abandonados')
            .upsert({
                user_id: user.id,
                items: items,
                estado: items.length > 0 ? 'abandonado' : 'convertido',
                last_updated: new Date().toISOString(),
            }, { onConflict: 'user_id' })

        if (error) throw error

        return NextResponse.json({ ok: true })
    } catch (error) {
        console.error('[CART SYNC ERROR]', error)
        return NextResponse.json({ error: 'Sync failed' }, { status: 500 })
    }
}
