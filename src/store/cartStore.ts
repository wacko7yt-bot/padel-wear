'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, ProductSize } from '@/types'

interface CartStore {
    items: CartItem[]
    isOpen: boolean
    addItem: (item: CartItem) => void
    removeItem: (variantId: string) => void
    updateQuantity: (variantId: string, quantity: number) => void
    clearCart: () => void
    toggleCart: () => void
    openCart: () => void
    closeCart: () => void
    totalItems: () => number
    totalPrice: () => number
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            isOpen: false,

            addItem: (newItem) => {
                const items = get().items
                const existing = items.find((i) => i.variantId === newItem.variantId)

                if (existing) {
                    set({
                        items: items.map((i) =>
                            i.variantId === newItem.variantId
                                ? { ...i, quantity: i.quantity + newItem.quantity }
                                : i
                        ),
                    })
                } else {
                    set({ items: [...items, newItem] })
                }
                set({ isOpen: true })
            },

            removeItem: (variantId) =>
                set({ items: get().items.filter((i) => i.variantId !== variantId) }),

            updateQuantity: (variantId, quantity) => {
                if (quantity <= 0) {
                    get().removeItem(variantId)
                    return
                }
                set({
                    items: get().items.map((i) =>
                        i.variantId === variantId ? { ...i, quantity } : i
                    ),
                })
            },

            clearCart: () => set({ items: [] }),
            toggleCart: () => set({ isOpen: !get().isOpen }),
            openCart: () => set({ isOpen: true }),
            closeCart: () => set({ isOpen: false }),

            totalItems: () => get().items.reduce((acc, i) => acc + i.quantity, 0),
            totalPrice: () =>
                get().items.reduce((acc, i) => acc + i.price * i.quantity, 0),
        }),
        {
            name: 'padel-wear-cart',
        }
    )
)
