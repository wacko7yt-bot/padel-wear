import Stripe from 'stripe'

// Valor por defecto para evitar errores de instanciación durante el build de Next.js.
const FALLBACK_KEY = 'sk_test_placeholder_for_build_purposes_only'

/**
 * Función centralizada para obtener el cliente de Stripe.
 * Se instancia bajo demanda para evitar fallos en el "build" de Next.js.
 */
export function getStripe(): Stripe {
    const apiKey = process.env.STRIPE_SECRET_KEY || FALLBACK_KEY
    const stripe = new Stripe(apiKey, {
        apiVersion: '2024-12-18.acacia' as any,
        typescript: true,
    })
    return stripe
}
