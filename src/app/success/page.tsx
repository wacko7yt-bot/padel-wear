import { redirect } from 'next/navigation'

// Stripe redirects here — forward to our styled success page
export default function SuccessPage({
    searchParams,
}: {
    searchParams: { session_id?: string }
}) {
    const query = searchParams.session_id ? `?session_id=${searchParams.session_id}` : ''
    redirect(`/checkout/exito${query}`)
}
