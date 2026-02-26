import { createClient } from './client'
import type { Producto, Resena, Pedido } from './types'

// =============================================
// PRODUCTOS
// =============================================

/** Obtiene todos los productos disponibles */
export async function getProductos(): Promise<Producto[]> {
    const supabase = createClient()
    const { data, error } = await supabase
        .from('productos')
        .select('*')
        .eq('available', true)
        .order('created_at', { ascending: false })

    if (error) throw new Error(`Error al obtener productos: ${error.message}`)
    return data ?? []
}

/** Obtiene un producto por ID */
export async function getProductoById(id: string): Promise<Producto | null> {
    const supabase = createClient()
    const { data, error } = await supabase
        .from('productos')
        .select('*')
        .eq('id', id)
        .eq('available', true)
        .single()

    if (error) return null
    return data
}

/** Obtiene productos por categoría */
export async function getProductosByCategoria(categoria: string): Promise<Producto[]> {
    const supabase = createClient()
    const { data, error } = await supabase
        .from('productos')
        .select('*')
        .eq('available', true)
        .eq('category', categoria)
        .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return data ?? []
}

// =============================================
// RESEÑAS
// =============================================

/** Obtiene las reseñas de un producto */
export async function getResenasByProducto(productId: string): Promise<Resena[]> {
    const supabase = createClient()
    const { data, error } = await supabase
        .from('resenas')
        .select('*')
        .eq('product_id', productId)
        .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return data ?? []
}

/** Crea una nueva reseña */
export async function crearResena(
    resena: Omit<Resena, 'id' | 'created_at'>
): Promise<Resena> {
    const supabase = createClient()
    const { data, error } = await supabase
        .from('resenas')
        .insert(resena)
        .select()
        .single()

    if (error) throw new Error(error.message)
    return data
}

// =============================================
// PEDIDOS
// =============================================

/** Crea un nuevo pedido (tras pago Stripe) */
export async function crearPedido(
    pedido: Omit<Pedido, 'id' | 'created_at' | 'fecha' | 'productos'>
): Promise<Pedido> {
    const supabase = createClient()
    const { data, error } = await supabase
        .from('pedidos')
        .insert(pedido)
        .select()
        .single()

    if (error) throw new Error(error.message)
    return data
}

/** Obtiene un pedido por stripe_session_id */
export async function getPedidoByStripeSession(
    sessionId: string
): Promise<Pedido | null> {
    const supabase = createClient()
    const { data, error } = await supabase
        .from('pedidos')
        .select(`*, productos(*)`)
        .eq('stripe_session_id', sessionId)
        .single()

    if (error) return null
    return data
}
