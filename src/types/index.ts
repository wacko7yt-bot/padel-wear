// =============================================
// PRODUCT TYPES
// =============================================
export type ProductSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL'

export interface ProductVariant {
    id: string
    product_id: string
    size: ProductSize
    stock: number
    sku: string
}

export interface Product {
    id: string
    name: string
    slug: string
    description: string
    price: number
    images: string[]
    category: string
    stripe_product_id: string | null
    stripe_price_id: string | null
    created_at: string
    variants?: ProductVariant[]
}

// =============================================
// CART TYPES
// =============================================
export interface CartItem {
    variantId: string
    productId: string
    name: string
    slug: string
    size: ProductSize
    price: number
    quantity: number
    image: string
}

// =============================================
// ORDER TYPES
// =============================================
export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'

export interface ShippingAddress {
    fullName: string
    email: string
    phone: string
    address: string
    city: string
    postalCode: string
    country: string
}

export interface OrderItem {
    id: string
    order_id: string
    variant_id: string
    quantity: number
    unit_price: number
    variant?: ProductVariant & { product?: Product }
}

export interface Order {
    id: string
    user_id: string
    stripe_session_id: string
    status: OrderStatus
    total: number
    shipping_address: ShippingAddress
    created_at: string
    items?: OrderItem[]
}
