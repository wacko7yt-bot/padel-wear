'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
    Package, ShoppingCart, TrendingUp, LogOut,
    Eye, EyeOff, AlertCircle, LayoutDashboard
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { DashboardView } from '@/components/admin/DashboardView'
import { ProductosView } from '@/components/admin/ProductosView'
import { PedidosView } from '@/components/admin/PedidosView'
import toast from 'react-hot-toast'

type AdminView = 'dashboard' | 'productos' | 'pedidos'

export default function AdminPage() {
    const [view, setView] = useState<AdminView>('dashboard')
    const [authed, setAuthed] = useState<boolean | null>(null)
    const [password, setPassword] = useState('')
    const [showPass, setShowPass] = useState(false)
    const [error, setError] = useState('')
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        const checkAuth = async () => {
            const isLegacy = sessionStorage.getItem('trl-admin') === 'ok'
            if (isLegacy) {
                setAuthed(true)
                return
            }
            const { data: { session } } = await supabase.auth.getSession()
            if (session?.user.email === 'admin@theracketlab.es') {
                setAuthed(true)
            } else {
                setAuthed(false)
            }
        }
        checkAuth()
    }, [supabase])

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault()
        const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'racketlab2026'
        if (password === ADMIN_PASSWORD) {
            sessionStorage.setItem('trl-admin', 'ok')
            setAuthed(true)
            toast.success('Acceso concedido')
        } else {
            setError('Contraseña incorrecta')
            setPassword('')
        }
    }

    const handleLogout = async () => {
        await supabase.auth.signOut()
        sessionStorage.removeItem('trl-admin')
        setAuthed(false)
        router.push('/')
    }

    if (authed === null) return <div style={{ minHeight: '100vh', background: '#0a0a0a' }} />

    if (!authed) return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#080808' }}>
            <form onSubmit={handleLogin} style={{ width: 360, background: '#121212', padding: 40, borderRadius: 24, border: '1px solid var(--border)' }}>
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <div style={{ width: 48, height: 48, background: 'var(--accent)', borderRadius: 12, margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000' }}>
                        <LayoutDashboard size={24} />
                    </div>
                    <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 24 }}>ADMIN ACCESS</h1>
                </div>

                <div style={{ position: 'relative', marginBottom: 20 }}>
                    <input
                        type={showPass ? 'text' : 'password'}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Contraseña"
                        style={{ width: '100%', padding: '12px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: 10, color: '#fff', outline: 'none' }}
                    />
                    <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer' }}>
                        {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                </div>

                {error && <p style={{ color: '#f87171', fontSize: 13, marginBottom: 16 }}>{error}</p>}

                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>ENTRAR</button>
            </form>
        </div>
    )

    const NAV = [
        { id: 'dashboard', label: 'Dashboard', Icon: TrendingUp },
        { id: 'productos', label: 'Productos', Icon: Package },
        { id: 'pedidos', label: 'Pedidos', Icon: ShoppingCart },
    ]

    return (
        <div style={{ minHeight: '100vh', display: 'flex', background: '#080808' }}>
            {/* Sidebar */}
            <aside style={{ width: 240, background: '#050505', borderRight: '1px solid var(--border)', padding: '32px 16px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ marginBottom: 32, padding: '0 8px' }}>
                    <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--accent)', letterSpacing: '0.1em' }}>CONTROL PANEL</span>
                    <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 22, marginTop: 4 }}>THE RACKET LAB</h1>
                </div>

                {NAV.map(({ id, label, Icon }) => (
                    <button
                        key={id}
                        onClick={() => setView(id as AdminView)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 12, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, transition: 'all 0.2s', textAlign: 'left',
                            background: view === id ? 'var(--accent-subtle)' : 'transparent',
                            color: view === id ? 'var(--accent)' : 'rgba(255,255,255,0.45)'
                        }}
                    >
                        <Icon size={18} />
                        {label}
                    </button>
                ))}

                <button onClick={handleLogout} style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>
                    <LogOut size={16} /> Cerrar sesión
                </button>
            </aside>

            {/* Main */}
            <main style={{ flex: 1, padding: '48px', overflowY: 'auto', maxHeight: '100vh' }}>
                {view === 'dashboard' && <DashboardView />}
                {view === 'productos' && <ProductosView />}
                {view === 'pedidos' && <PedidosView />}
            </main>
        </div>
    )
}

