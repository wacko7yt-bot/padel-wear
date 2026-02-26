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

        let stripeCustomerId: string | undefined = undefined

        if (user) {
            // Check if user has a saved stripe_customer_id in user_profiles
            const { data: profile } = await supabase
                .from('user_profiles')
                .select('*')
                .eq('id', user.id)
                .single()

            if (profile?.stripe_customer_id) {
                stripeCustomerId = profile.stripe_customer_id
            } else {
                // Create a Stripe customer
                const customer = await stripe.customers.create({
                    email: user.email,
                    name: profile?.full_name || user.user_metadata?.full_name,
                    shipping: profile?.address_line1 ? {
                        name: profile?.full_name || user.user_metadata?.full_name || user.email!,
                        address: {
                            line1: profile.address_line1,
                            line2: profile.address_line2 || undefined,
                            city: profile.city || undefined,
                            postal_code: profile.postal_code || undefined,
                            country: 'ES', // Default country for now
                        }
                    } : undefined
                })
                stripeCustomerId = customer.id

                // Save to DB
                await supabase
                    .from('user_profiles')
                    .update({ stripe_customer_id: customer.id })
                    .eq('id', user.id)
            }
        }

        const session = await stripe.checkout.sessions.create({
            mode: 'payment',
            line_items: lineItems,
            customer: stripeCustomerId,
            customer_email: stripeCustomerId ? undefined : user?.email,
            metadata: {
                userId: user?.id ?? 'guest',
            },
            shipping_address_collection: {
                allowed_countries: ['ES', 'PT', 'FR', 'DE', 'IT', 'GB'],
            },
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/exito?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/cancelado`,
            // Enable Link for one-click checkout
            payment_method_options: {
                card: {
                    setup_future_usage: 'on_session',
                }
            }
        })

        return NextResponse.json({ url: session.url })
    } catch (error) {
        console.error('[STRIPE CHECKOUT ERROR]', error)
        return NextResponse.json({ error: 'Error al crear la sesión de pago' }, { status: 500 })
    }
}
