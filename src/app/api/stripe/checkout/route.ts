import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/server'
import { createClient } from '@/lib/supabase/server'
import type { CartItem } from '@/types'

export async function POST(request: Request) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        const { items }: { items: CartItem[] } = await request.json()

        if (!items || items.length === 0) {
            return NextResponse.json({ error: 'El carrito está vacío' }, { status: 400 })
        }

        const lineItems = items.map((item) => ({
            price_data: {
                currency: 'eur',
                product_data: {
                    name: `${item.name} — Talla ${item.size}`,
                    images: [item.image],
                    metadata: {
                        variantId: item.variantId,
                        productId: item.productId,
                    },
                },
                unit_amount: Math.round(item.price * 100), // cents
            },
            quantity: item.quantity,
        }))

        const session = await stripe.checkout.sessions.create({
            mode: 'payment',
            line_items: lineItems,
            customer_email: user?.email,
            metadata: {
                userId: user?.id ?? 'guest',
            },
            shipping_address_collection: {
                allowed_countries: ['ES', 'PT', 'FR', 'DE', 'IT', 'GB'],
            },
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/exito?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/cancelado`,
        })

        return NextResponse.json({ url: session.url })
    } catch (error) {
        console.error('[STRIPE CHECKOUT ERROR]', error)
        return NextResponse.json({ error: 'Error al crear la sesión de pago' }, { status: 500 })
    }
}
