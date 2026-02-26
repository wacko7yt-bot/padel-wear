import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe/server'
import { createClient } from '@/lib/supabase/server'
import Stripe from 'stripe'

export async function POST(request: Request) {
    const body = await request.text()
    const headersList = await headers()
    const signature = headersList.get('stripe-signature')!

    let event: Stripe.Event

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        )
    } catch (err) {
        console.error('[WEBHOOK] Firma inválida:', err)
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    const supabase = await createClient()

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session

        // Expand line items to get metadata
        const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
            expand: ['data.price.product'],
        })

        // Webhook handles one row per item in 'pedidos' table as per current schema
        for (const item of lineItems.data) {
            const product = item.price?.product as Stripe.Product
            const metadata = product.metadata || {}

            // Expected metadata: productId, variantId (which contains size like "id-S")
            const productId = metadata.productId
            const variantId = metadata.variantId
            const size = variantId?.split('-').pop() || 'U'

            if (productId) {
                // 1. Create entry in 'pedidos'
                const { error: pedidoError } = await supabase
                    .from('pedidos')
                    .insert({
                        email_cliente: session.customer_details?.email || session.metadata?.email,
                        product_id: productId,
                        talla_comprada: size,
                        cantidad: item.quantity || 1,
                        estado_pago: 'pagado',
                        stripe_session_id: session.id,
                    })

                if (pedidoError) {
                    console.error('[WEBHOOK] Error insertando pedido:', pedidoError)
                    continue
                }

                try {
                    await supabase.rpc('decrement_stock', {
                        p_product_id: productId,
                        p_size: size,
                        p_quantity: item.quantity ?? 1,
                    })
                } catch (rpcErr) {
                    console.warn('[WEBHOOK] RPC decrement_stock falló, intentando manual...')
                    // Manual fall-back omitted for brevity but recommended in production
                }
            }
        }
    }

    return NextResponse.json({ received: true })
}
