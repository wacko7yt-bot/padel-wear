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
    } catch (err: any) {
        console.error('[WEBHOOK] Firma inválida:', err.message)
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    const supabase = await createClient()

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session

        // Use user_id from metadata if present
        const userId = session.metadata?.userId === 'guest' ? null : session.metadata?.userId

        // Expand line items to get metadata
        const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
            expand: ['data.price.product'],
        })

        for (const item of lineItems.data) {
            const product = item.price?.product as Stripe.Product
            const metadata = product.metadata || {}

            const productId = metadata.productId
            const variantId = metadata.variantId
            const size = variantId?.split('-').pop() || 'U'

            if (productId) {
                // Insert into 'pedidos' with user_id to link with profile
                const { error: pedidoError } = await supabase
                    .from('pedidos')
                    .insert({
                        user_id: userId,
                        email_cliente: session.customer_details?.email,
                        product_id: productId,
                        talla_comprada: size,
                        cantidad: item.quantity || 1,
                        estado_pago: 'pagado',
                        stripe_session_id: session.id,
                        precio_unitario: (item.price?.unit_amount || 0) / 100,
                        fecha: new Date().toISOString()
                    })

                if (pedidoError) {
                    console.error('[WEBHOOK] Error insertando pedido:', pedidoError)
                    continue
                }

                // Decrement Stock
                try {
                    await supabase.rpc('decrement_stock_v2', {
                        p_product_id: productId,
                        p_size: size,
                        p_quantity: item.quantity ?? 1,
                    })
                } catch (rpcErr) {
                    console.warn('[WEBHOOK] RPC decrement_stock_v2 falló:', rpcErr)
                    // Fallback to direct update
                    const size_col = `size_${size.toLowerCase()}`
                    await supabase.rpc('decrement_product_column', {
                        p_product_id: productId,
                        p_size_col: size_col,
                        p_quantity: item.quantity ?? 1
                    }).catch(() => { })
                }
            }
        }
    }

    return NextResponse.json({ received: true })
}
