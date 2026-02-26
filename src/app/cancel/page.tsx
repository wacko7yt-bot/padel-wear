import { redirect } from 'next/navigation'

// Stripe cancel URL redirects here
export default function CancelPage() {
    redirect('/checkout/cancelado')
}
