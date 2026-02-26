import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { ProductCard } from '@/components/shop/ProductCard'
import { getProductos } from '@/lib/supabase/queries'
import { BenefitsSection } from '@/components/home/BenefitsSection'
import { HeroSection } from '@/components/home/HeroSection'

export default async function HomePage() {
  const allProducts = await getProductos().catch(() => [])
  const featured = allProducts.slice(0, 4)

  return (
    <>
      {/* ========== HERO ========== */}
      <HeroSection />

      {/* ========== BENEFITS ========== */}
      <BenefitsSection />

      {/* ========== ALL PRODUCTS ========== */}
      <section id="todos" className="section-padding">
        <div className="container-padel">
          <div style={{ marginBottom: 48 }}>
            <p
              style={{
                color: 'var(--accent)',
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                marginBottom: 8,
              }}
            >
              Colección completa
            </p>
            <h2
              style={{
                fontFamily: 'Bebas Neue, sans-serif',
                fontSize: 'clamp(36px, 5vw, 56px)',
                lineHeight: 1,
              }}
            >
              TODOS LOS <span style={{ color: 'var(--accent)' }}>PRODUCTOS</span>
            </h2>
          </div>

          {allProducts.length > 0 ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: 24,
              }}
            >
              {allProducts.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 0', opacity: 0.5 }}>
              <p>No se encontraron productos.</p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
