'use client'

import { useState, useEffect } from 'react'
import { ShoppingBag, Mail, Trash2, Clock, User, Package } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

export function AbandonedCartsView() {
    const [carts, setCarts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    const loadCarts = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('carritos_abandonados')
            .select('*')
            .order('last_updated', { ascending: false })

        if (error) toast.error('Error al cargar carritos')
        else setCarts(data || [])
        setLoading(false)
    }

    useEffect(() => { loadCarts() }, [])

    const sendReminder = (cartId: string) => {
        // En una implementación real conectaríamos con Resend/Sendgrid
        toast.promise(
            new Promise(resolve => setTimeout(resolve, 1500)),
            {
                loading: 'Enviando email de recuperación...',
                success: 'Email enviado con código de descuento (Simulado)',
                error: 'Error al enviar'
            }
        )
    }

    return (
        <div className="animate-fade-up">
            <div style={{ marginBottom: 32 }}>
                <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 38, letterSpacing: '0.04em' }}>CARRITOS ABANDONADOS</h2>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>Usuarios que no han finalizado su compra en las últimas 24h.</p>
            </div>

            <div style={{ display: 'grid', gap: 20 }}>
                {carts.map(cart => (
                    <div key={cart.id} style={{
                        background: '#121212',
                        border: '1px solid rgba(255,255,255,0.05)',
                        borderRadius: 20,
                        padding: 24,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 20
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                <div style={{ width: 44, height: 44, background: 'rgba(255,255,255,0.03)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <User size={20} color="var(--accent)" />
                                </div>
                                <div>
                                    <p style={{ fontWeight: 700, fontSize: 15 }}>Usuario ID: {cart.user_id.slice(0, 8)}...</p>
                                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: 4 }}>
                                        <Clock size={12} /> Última actividad: {new Date(cart.last_updated).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => sendReminder(cart.id)}
                                className="btn btn-primary btn-sm"
                                style={{ gap: 8 }}
                            >
                                <Mail size={14} /> ENVIAR RECORDATORIO
                            </button>
                        </div>

                        <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 12, padding: 16 }}>
                            <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: 12 }}>PRODUCTOS EN EL CARRITO</p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                                {cart.items.map((item: any, idx: number) => (
                                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.04)', padding: '6px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.05)' }}>
                                        <Package size={14} style={{ opacity: 0.5 }} />
                                        <span style={{ fontSize: 13 }}>{item.name} ({item.size}) x{item.quantity}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}

                {carts.length === 0 && !loading && (
                    <div style={{ padding: 80, textAlign: 'center', background: '#121212', borderRadius: 24, border: '1px dashed rgba(255,255,255,0.1)' }}>
                        <ShoppingBag size={48} style={{ opacity: 0.1, marginBottom: 16 }} />
                        <p style={{ color: 'rgba(255,255,255,0.3)' }}>No se han detectado carritos abandonados recientemente.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
