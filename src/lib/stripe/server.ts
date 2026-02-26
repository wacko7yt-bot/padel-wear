import Stripe from 'stripe'

// Función para obtener la instancia de Stripe de forma perezosa
export function getStripe(): Stripe {
    const apiKey = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder_long_enough_to_be_valid_structure'
    return new Stripe(apiKey, {
        apiVersion: '2024-12-18.acacia' as any,
        typescript: true,
    })
}

/**
 * Proxy de Stripe para que no se inicialice durante el "build" de Next.js
 * pero que funcione como si fuera el objeto real cuando se use en las API Routes.
 */
export const stripe = new Proxy({} as Stripe, {
    get(target, prop, receiver) {
        // Ignorar propiedades de inspección de Node/Jest si fuera necesario
        if (prop === '$$typeof' || typeof prop === 'symbol') return Reflect.get(target, prop, receiver)

        // Inicialización bajo demanda
        const instance = getStripe()
        const value = Reflect.get(instance, prop)

        if (typeof value === 'function') {
            return value.bind(instance)
        }
        return value
    }
})
