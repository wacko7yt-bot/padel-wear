import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { CartDrawer } from '@/components/cart/CartDrawer'
import { CartSync } from '@/components/shop/CartSync'
import { Toaster } from 'react-hot-toast'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'THE RACKET LAB — Ropa Técnica de Pádel Premium',
    template: '%s | THE RACKET LAB',
  },
  description:
    'Descubre la colección de camisetas técnicas de pádel de alto rendimiento. Diseño español, calidad premium. Envíos a toda Europa.',
  keywords: ['pádel', 'camisetas pádel', 'ropa deportiva', 'the racket lab', 'tienda pádel', 'padel wear'],
  openGraph: {
    title: 'THE RACKET LAB — Ropa Técnica de Pádel Premium',
    description: 'Camisetas técnicas de pádel de alto rendimiento. Diseño español, calidad premium.',
    type: 'website',
    locale: 'es_ES',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={inter.variable}>
      <body className="antialiased">
        <CartSync />
        <Navbar />
        <CartDrawer />
        <main style={{ paddingTop: 'var(--navbar-h)' }}>
          {children}
        </main>
        <Footer />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#1c1c1c',
              color: '#f5f5f5',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px',
              fontSize: '14px',
            },
            success: {
              iconTheme: { primary: '#ff5c00', secondary: '#000' },
            },
          }}
        />
      </body>
    </html>
  )
}
