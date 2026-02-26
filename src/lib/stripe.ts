// Re-exportación centralizada del cliente Stripe
// El cliente Stripe solo se instancia en el servidor (API Routes / Server Actions)

export { stripe } from './stripe/server'
