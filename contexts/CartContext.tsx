"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useAuth } from "./AuthContext"

export interface CartItem {
  id: string
  productId: string
  title: string
  price: number
  quantity: number
  image: string
  vendorId: string
  vendorName: string
  maxStock: number
  
}

interface CartContextType {
  items: CartItem[]
  totalItems: number
  totalPrice: number
  addItem: (item: Omit<CartItem, "quantity">) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  isOpen: boolean
  setIsOpen: (open: boolean) => void
   addToCart: (item: CartItem) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const { user } = useAuth()

  const { getUserCart, setUserCart } = require("@/lib/firestore")

  // Load cart from Firestore on mount or user change
  useEffect(() => {
    const fetchCart = async () => {
      if (user) {
        try {
          const cart = await getUserCart(user.uid)
          if (cart && Array.isArray(cart.items)) {
            setItems(cart.items)
          } else {
            setItems([])
          }
        } catch (error) {
          console.error("Error loading cart from Firestore:", error)
        }
      } else {
        setItems([])
      }
    }
    fetchCart()
  }, [user])

  // Save cart to Firestore whenever items change
  useEffect(() => {
    const saveCart = async () => {
      if (user) {
        try {
          await setUserCart(user.uid, items)
        } catch (error) {
          console.error("Error saving cart to Firestore:", error)
        }
      }
    }
    saveCart()
  }, [items, user])

  const addItem = (newItem: Omit<CartItem, "quantity">) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.productId === newItem.productId)

      if (existingItem) {
        // Update quantity if item already exists
        return prevItems.map((item) =>
          item.productId === newItem.productId
            ? { ...item, quantity: Math.min(item.quantity + 1, item.maxStock) }
            : item,
        )
      } else {
        // Add new item
        return [...prevItems, { ...newItem, quantity: 1 }]
      }
    })
  }

  const removeItem = (productId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.productId !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId)
      return
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.productId === productId ? { ...item, quantity: Math.min(quantity, item.maxStock) } : item,
      ),
    )
  }

  const clearCart = () => {
    setItems([])
    if (user) {
      setUserCart(user.uid, [])
    }
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  // Implement addToCart function
  const addToCart = (item: CartItem) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.productId === item.productId)
      if (existingItem) {
        return prevItems.map((i) =>
          i.productId === item.productId
            ? { ...i, quantity: Math.min(i.quantity + item.quantity, i.maxStock) }
            : i,
        )
      } else {
        return [...prevItems, { ...item, quantity: Math.min(item.quantity, item.maxStock) }]
      }
    })
  }

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        totalPrice,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isOpen,
        setIsOpen,
        addToCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
