// =============================================
// TIPOS DE BASE DE DATOS — THE RACKET LAB
// Reflejan el esquema real de Supabase
// =============================================

/** Tabla: productos */
export interface Producto {
    id: string
    name: string
    description: string | null
    price: number
    images: string[] | null      // Lista de URLs de imágenes
    category: string | null      // 'camiseta', 'pantalon', etc.
    available: boolean | null
    size_s: number | null
    size_m: number | null
    size_l: number | null
    size_xl: number | null
    created_at: string | null
}

/** Tabla: pedidos */
export interface Pedido {
    id: string
    email_cliente: string | null
    product_id: string | null
    talla_comprada: string | null
    cantidad: number | null
    estado_pago: string | null
    stripe_session_id: string | null
    fecha: string | null
    created_at: string | null
    // Relación
    productos?: Producto
}

/** Tabla: resenas (sin tilde — tabla nueva con email) */
export interface Resena {
    id: string
    product_id: string | null
    puntuacion: number | null
    comentario: string | null
    nombre_usuario: string | null
    email_usuario: string | null
    created_at: string | null
}

// Tallas disponibles
export type Talla = 's' | 'm' | 'l' | 'xl'
export const TALLAS: { key: Talla; label: string }[] = [
    { key: 's', label: 'S' },
    { key: 'm', label: 'M' },
    { key: 'l', label: 'L' },
    { key: 'xl', label: 'XL' },
]

/** Obtiene el stock de una talla específica */
export function getStockTalla(producto: Producto, talla: Talla): number {
    const map: Record<Talla, keyof Producto> = {
        s: 'size_s',
        m: 'size_m',
        l: 'size_l',
        xl: 'size_xl',
    }
    return (producto[map[talla]] as number) ?? 0
}

/** Indica si un producto tiene stock en alguna talla */
export function tieneStock(producto: Producto): boolean {
    return (
        (producto.size_s ?? 0) > 0 ||
        (producto.size_m ?? 0) > 0 ||
        (producto.size_l ?? 0) > 0 ||
        (producto.size_xl ?? 0) > 0
    )
}

/** Puntuación media de un array de reseñas */
export function puntuacionMedia(resenas: Resena[]): number {
    if (!resenas.length) return 0
    const suma = resenas.reduce((acc, r) => acc + (r.puntuacion ?? 0), 0)
    return Math.round((suma / resenas.length) * 10) / 10
}
