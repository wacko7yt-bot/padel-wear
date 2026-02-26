'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
    User, ShoppingBag, MapPin, LogOut,
    ChevronRight, ExternalLink, Package
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import Link from 'next/link'

type ProfileTab = 'orders' | 'addresses' | 'account'

export default function ProfilePage() {
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState<ProfileTab>('orders')
    const [orders, setOrders] = useState<any[]>([])
    const [profile, setProfile] = useState<any>(null)

    const supabase = createClient()
    const router = useRouter()

    useEffect(() => {
        const getData = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) {
                router.push('/login')
                return
            }
            setUser(session.user)

            // Fetch Profile
            const { data: prof } = await supabase
                .from('user_profiles')
                .select('*')
                .single()
            setProfile(prof)

            // Fetch Orders
            const { data: ords } = await supabase
                .from('pedidos')
                .select('*, productos(name, price)')
                .eq('user_id', session.user.id)
                .order('created_at', { ascending: false })
            setOrders(ords || [])

            setLoading(false)
        }
        getData()
    }, [supabase, router])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        toast.success('Sesión cerrada')
        router.push('/')
    }

    if (loading) return (
        <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="loader">Cargando perfil...</div>
        </div>
    )

    return (
        <div style={{ minHeight: '100vh', padding: '60px 0 100px' }}>
            <div className="container-padel">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 48, alignItems: 'start' }}>

                    {/* Sidebar */}
                    <aside style={{
                        background: 'var(--bg-card)',
                        borderRadius: 24,
                        border: '1px solid var(--border)',
                        padding: 32,
                        position: 'sticky',
                        top: 100
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
                            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 800, fontSize: 20 }}>
                                {user.email?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p style={{ fontWeight: 700, fontSize: 16, color: 'var(--text-primary)' }}>{user.user_metadata?.full_name || 'Usuario TRL'}</p>
                                <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{user.email}</p>
                            </div>
                        </div>

                        <nav style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            <TabBtn active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} Icon={ShoppingBag} label="Mis Pedidos" />
                            <TabBtn active={activeTab === 'addresses'} onClick={() => setActiveTab('addresses')} Icon={MapPin} label="Direcciones" />
                            <TabBtn active={activeTab === 'account'} onClick={() => setActiveTab('account')} Icon={User} label="Ajustes Cuenta" />
                            <div style={{ padding: '8px 0' }} />
                            <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderRadius: 12, border: 'none', background: 'rgba(239, 68, 68, 0.1)', color: '#f87171', fontSize: 14, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', width: '100%', textAlign: 'left' }}>
                                <LogOut size={18} /> Cerrar Sesión
                            </button>
                        </nav>
                    </aside>

                    {/* Main Content */}
                    <main style={{ minHeight: 400 }}>
                        {activeTab === 'orders' && (
                            <div>
                                <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 48, marginBottom: 32 }}>HISTORIAL DE PEDIDOS</h1>
                                {orders.length === 0 ? (
                                    <div style={{ padding: 60, textAlign: 'center', background: 'var(--bg-elevated)', borderRadius: 24, border: '1px solid var(--border)' }}>
                                        <Package size={48} style={{ opacity: 0.2, marginBottom: 16 }} />
                                        <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>Aún no has realizado ningún pedido.</p>
                                        <Link href="/productos" className="btn btn-primary">IR A LA TIENDA</Link>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                        {orders.map(order => (
                                            <OrderCard key={order.id} order={order} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'addresses' && (
                            <AddressManager profile={profile} supabase={supabase} onUpdate={setProfile} />
                        )}

                        {activeTab === 'account' && (
                            <AccountSettings user={user} profile={profile} />
                        )}
                    </main>
                </div>
            </div>
        </div>
    )
}

function TabBtn({ active, onClick, Icon, label }: { active: boolean, onClick: () => void, Icon: any, label: string }) {
    return (
        <button
            onClick={onClick}
            style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderRadius: 12, border: 'none',
                background: active ? 'var(--accent-subtle)' : 'transparent',
                color: active ? 'var(--accent)' : 'var(--text-primary)',
                fontSize: 14, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', width: '100%', textAlign: 'left'
            }}
        >
            <Icon size={18} /> {label}
        </button>
    )
}

function OrderCard({ order }: { order: any }) {
    return (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                <div>
                    <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>ID Pedido: #{order.id.slice(0, 8)}</p>
                    <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Realizado el {new Date(order.created_at).toLocaleDateString()}</p>
                </div>
                <div style={{ padding: '4px 12px', background: 'rgba(74,222,128,0.1)', color: '#4ade80', borderRadius: 99, fontSize: 12, fontWeight: 700, border: '1px solid rgba(74,222,128,0.2)' }}>
                    {order.estado_pago?.toUpperCase() || 'PAGADO'}
                </div>
            </div>

            <div style={{ display: 'flex', gap: 16, alignItems: 'center', padding: '16px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', marginBottom: 20 }}>
                <div style={{ width: 64, height: 64, background: 'var(--bg-elevated)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Package size={24} style={{ opacity: 0.5 }} />
                </div>
                <div>
                    <h3 style={{ fontWeight: 700, fontSize: 15 }}>{order.productos?.name || 'Producto de TRL'}</h3>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Cantidad: {order.cantidad || 1}</p>
                </div>
                <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                    <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 24, color: 'var(--accent)' }}>
                        {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format((order.productos?.price || 0) * (order.cantidad || 1))}
                    </p>
                </div>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
                {order.invoice_url && (
                    <a href={order.invoice_url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', flex: 1 }}>
                        <button className="btn btn-secondary btn-sm" style={{ width: '100%', justifyContent: 'center', gap: 8 }}>
                            <ExternalLink size={14} /> Descargar Factura
                        </button>
                    </a>
                )}
                <Link href={`/productos/${order.producto_id}`} style={{ textDecoration: 'none', flex: 1 }}>
                    <button className="btn btn-ghost btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
                        Ver Producto
                    </button>
                </Link>
            </div>
        </div>
    )
}

function AddressManager({ profile, supabase, onUpdate }: { profile: any, supabase: any, onUpdate: (p: any) => void }) {
    const [formData, setFormData] = useState({
        address_line1: profile?.address_line1 || '',
        city: profile?.city || '',
        postal_code: profile?.postal_code || '',
    })

    const handleSave = async () => {
        const { data, error } = await supabase
            .from('user_profiles')
            .update(formData)
            .eq('id', profile.id)
            .select()
            .single()

        if (error) toast.error('Error al guardar')
        else {
            toast.success('Dirección actualizada')
            onUpdate(data)
        }
    }

    return (
        <div>
            <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 48, marginBottom: 32 }}>DIRECCIONES DE ENVÍO</h1>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 24, padding: 32 }}>
                <div style={{ display: 'grid', gap: 20 }}>
                    <div>
                        <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>DIRECCIÓN</label>
                        <input
                            type="text"
                            value={formData.address_line1}
                            onChange={e => setFormData({ ...formData, address_line1: e.target.value })}
                            placeholder="Calle, número, piso..."
                            style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', borderRadius: 12, padding: '14px 16px', color: '#fff', outline: 'none' }}
                        />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <div>
                            <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>CIUDAD</label>
                            <input
                                type="text"
                                value={formData.city}
                                onChange={e => setFormData({ ...formData, city: e.target.value })}
                                style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', borderRadius: 12, padding: '14px 16px', color: '#fff', outline: 'none' }}
                            />
                        </div>
                        <div>
                            <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>CÓDIGO POSTAL</label>
                            <input
                                type="text"
                                value={formData.postal_code}
                                onChange={e => setFormData({ ...formData, postal_code: e.target.value })}
                                style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', borderRadius: 12, padding: '14px 16px', color: '#fff', outline: 'none' }}
                            />
                        </div>
                    </div>
                    <button onClick={handleSave} className="btn btn-primary" style={{ marginTop: 12 }}>GUARDAR DIRECCIÓN</button>
                </div>
            </div>
        </div>
    )
}

function AccountSettings({ user, profile }: { user: any, profile: any }) {
    return (
        <div>
            <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 48, marginBottom: 32 }}>AJUSTES DE CUENTA</h1>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 24, padding: 32 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                    <div>
                        <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 8 }}>NOMBRE COMPLETO</p>
                        <p style={{ fontSize: 16, fontWeight: 600 }}>{profile?.full_name || 'No configurado'}</p>
                    </div>
                    <div>
                        <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 8 }}>EMAIL</p>
                        <p style={{ fontSize: 16, fontWeight: 600 }}>{user.email}</p>
                    </div>
                    <div>
                        <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 8 }}>CONTRASEÑA</p>
                        <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>••••••••••••</p>
                        <button className="btn btn-ghost btn-sm" style={{ marginTop: 12, paddingLeft: 0 }}>Cambiar contraseña</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
