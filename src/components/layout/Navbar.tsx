'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ShoppingBag, Menu, X, User, LayoutDashboard, LogIn, LogOut, Heart, Package } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils/cn'
import { StockTicker } from './StockTicker'
import toast from 'react-hot-toast'

type AccountMode = 'loading' | 'admin' | 'client' | 'guest'

const STATIC_LINKS = [
    { href: '/', label: 'Inicio' },
    { href: '/productos', label: 'Tienda' },
]

export function Navbar() {
    const [scrolled, setScrolled] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const [accountMode, setAccountMode] = useState<AccountMode>('loading')
    const [userEmail, setUserEmail] = useState<string | null>(null)
    const { totalItems, openCart } = useCartStore()
    const { items: wishlistItems } = useWishlistStore()
    const cartCount = totalItems()
    const wishlistCount = wishlistItems.length
    const router = useRouter()
    const supabase = createClient()

    // ── Update scroll state ──
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40)
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    // ── Listen to Auth changes ──
    useEffect(() => {
        const syncSession = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            updateMode(session)
        }

        const updateMode = (session: any) => {
            if (!session) {
                // Check if still has legacy admin session (for migration period or simplicity)
                const isAdmin = sessionStorage.getItem('trl-admin') === 'ok'
                setAccountMode(isAdmin ? 'admin' : 'guest')
                setUserEmail(null)
            } else {
                const admins = ['admin@theracketlab.es', 'racketlab@admin.es']
                const isAdmin = admins.includes(session.user.email) || sessionStorage.getItem('trl-admin') === 'ok'
                setAccountMode(isAdmin ? 'admin' : 'client')
                setUserEmail(session.user.email)
            }
        }

        syncSession()

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            updateMode(session)
        })

        return () => subscription.unsubscribe()
    }, [supabase])

    const handleLogout = async () => {
        setMenuOpen(false)
        await supabase.auth.signOut()
        sessionStorage.removeItem('trl-admin')
        setAccountMode('guest')
        toast.success('Sesión cerrada')
        router.push('/')
    }

    const handleAccountClick = () => {
        setMenuOpen(false)
        if (accountMode === 'admin') router.push('/admin')
        else if (accountMode === 'client') router.push('/perfil')
        else router.push('/login')
    }

    const accountConfig = {
        admin: { label: 'Panel Admin', Icon: LayoutDashboard, color: 'var(--accent)' },
        client: { label: userEmail?.split('@')[0] || 'Mi Cuenta', Icon: User, color: 'var(--text-primary)' },
        guest: { label: 'Iniciar Sesión', Icon: LogIn, color: 'var(--text-secondary)' },
        loading: { label: '...', Icon: User, color: 'var(--text-muted)' },
    }[accountMode]

    return (
        <>
            <header
                className={cn(
                    'fixed top-0 left-0 right-0 z-30 transition-all duration-500',
                    scrolled ? 'glass-dark shadow-2xl' : 'bg-transparent'
                )}
                style={{ height: 'var(--navbar-h)' }}
            >
                <StockTicker />
                <div className="container-padel flex items-center justify-between" style={{ height: 'calc(var(--navbar-h) - var(--ticker-h))' }}>
                    {/* Logo */}
                    <Link href="/" className="flex flex-col leading-none no-underline">
                        <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 22, letterSpacing: '0.18em', color: 'var(--text-primary)' }}>
                            THE RACKET
                        </span>
                        <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 22, letterSpacing: '0.18em', color: 'var(--accent)' }}>
                            LAB
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-6">
                        {STATIC_LINKS.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="nav-link px-4 py-2 rounded-lg text-[13px] font-medium tracking-wide uppercase no-underline transition-all hover:text-accent hover:bg-accent-subtle text-secondary"
                                style={{ color: 'var(--text-secondary)' }}
                            >
                                {link.label}
                            </Link>
                        ))}

                        <button
                            onClick={handleAccountClick}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-bold tracking-wide uppercase transition-all cursor-pointer border-none bg-transparent"
                            style={{
                                color: accountConfig.color,
                                background: accountMode === 'admin' ? 'var(--accent-subtle)' : 'transparent'
                            }}
                        >
                            <accountConfig.Icon size={16} />
                            {accountConfig.label}
                        </button>

                        {(accountMode === 'client' || accountMode === 'admin') && (
                            <button
                                onClick={handleLogout}
                                className="p-2 text-muted hover:text-error transition-colors bg-transparent border-none cursor-pointer"
                                title="Cerrar sesión"
                            >
                                <LogOut size={16} />
                            </button>
                        )}
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                        <Link
                            href="/wishlist"
                            className="btn btn-icon btn-ghost relative"
                            title="Lista de deseos"
                        >
                            <Heart size={20} className={wishlistCount > 0 ? 'fill-accent text-accent' : ''} />
                            {wishlistCount > 0 && (
                                <span className="absolute top-1 right-1 w-4 h-4 bg-white text-black rounded-full text-[10px] font-bold flex items-center justify-center animate-scale-in">
                                    {wishlistCount}
                                </span>
                            )}
                        </Link>

                        <button
                            id="cart-toggle-btn"
                            onClick={openCart}
                            className="btn btn-icon btn-ghost relative"
                        >
                            <ShoppingBag size={20} />
                            {cartCount > 0 && (
                                <span className="absolute top-1 right-1 w-4 h-4 bg-accent text-black rounded-full text-[10px] font-bold flex items-center justify-center animate-scale-in">
                                    {cartCount > 9 ? '9+' : cartCount}
                                </span>
                            )}
                        </button>

                        <button
                            className="btn btn-icon btn-ghost md:hidden"
                            onClick={() => setMenuOpen(!menuOpen)}
                        >
                            {menuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile menu */}
            {menuOpen && (
                <div className="fixed inset-0 z-20 md:hidden pt-[var(--navbar-h)]">
                    <div className="glass-dark h-full border-t border-border">
                        <nav className="container-padel py-8 flex flex-col gap-2">
                            {STATIC_LINKS.map((link, i) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMenuOpen(false)}
                                    className="animate-fade-up p-4 rounded-xl text-xl font-semibold tracking-widest uppercase text-primary no-underline border-b border-border"
                                    style={{ animationDelay: `${i * 70}ms` }}
                                >
                                    {link.label}
                                </Link>
                            ))}

                            <Link
                                href="/perfil"
                                onClick={() => setMenuOpen(false)}
                                className="animate-fade-up p-4 flex items-center gap-3 text-xl font-semibold tracking-widest uppercase text-primary no-underline border-b border-border"
                                style={{ animationDelay: `${STATIC_LINKS.length * 70}ms` }}
                            >
                                <Package size={24} className="text-accent" /> Mis Pedidos
                            </Link>

                            <button
                                onClick={handleAccountClick}
                                className="animate-fade-up p-4 flex items-center gap-3 text-xl font-semibold tracking-widest uppercase text-left w-full bg-transparent border-none border-b border-border"
                                style={{
                                    animationDelay: `${(STATIC_LINKS.length + 1) * 70}ms`,
                                    color: accountConfig.color
                                }}
                            >
                                <accountConfig.Icon size={20} />
                                {accountConfig.label}
                            </button>

                            {(accountMode === 'client' || accountMode === 'admin') && (
                                <button
                                    onClick={handleLogout}
                                    className="animate-fade-up p-4 flex items-center gap-3 text-xl font-semibold tracking-widest uppercase text-left w-full bg-transparent border-none text-red-500"
                                    style={{ animationDelay: `${(STATIC_LINKS.length + 1) * 70}ms` }}
                                >
                                    <LogOut size={20} /> Salir
                                </button>
                            )}
                        </nav>
                    </div>
                </div>
            )}
        </>
    )
}
