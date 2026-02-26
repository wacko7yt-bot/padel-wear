'use client'

import { useEffect, useRef } from 'react'
import { useCartStore } from '@/store/cartStore'
import { createClient } from '@/lib/supabase/client'

export function CartSync() {
    const items = useCartStore(state => state.items)
    const supabase = createClient()
    const timerRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        const sync = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) return

            // Debounce para no saturar la base de datos
            if (timerRef.current) clearTimeout(timerRef.current)

            timerRef.current = setTimeout(async () => {
                await fetch('/api/cart/sync', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ items })
                }).catch(err => console.warn('Sync failed', err))
            }, 5000) // Sync tras 5 segundos de inactividad
        }

        sync()

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current)
        }
    }, [items, supabase])

    return null
}
