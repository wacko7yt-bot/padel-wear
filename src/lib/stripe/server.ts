import Stripe from 'stripe'

const apiKey = process.env.STRIPE_SECRET_KEY || ''

if (!apiKey && process.env.NODE_ENV === 'production') {
    console.warn('⚠️ STRIPE_SECRET_KEY is missing. Check your environment variables.')
}

export const stripe = new Stripe(apiKey, {
    apiVersion: '2024-12-18.acacia' as any, // Usar una versión estable conocida o cast para evitar errores de tipo
    typescript: true,
})
