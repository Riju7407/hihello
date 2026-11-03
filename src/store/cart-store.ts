import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Product } from "@/types/crm";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getEstimatedSubtotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      addItem: (product: Product, quantity = 1) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) => item.product.id === product.id
          );

          if (existingIndex > -1) {
            const updatedItems = [...state.items];
            const currentQty = updatedItems[existingIndex].quantity;
            const newQty = Math.min(
              currentQty + quantity,
              product.quantityOnHand ?? 999999
            );
            updatedItems[existingIndex] = {
              ...updatedItems[existingIndex],
              quantity: newQty,
            };
            return { items: updatedItems, isOpen: true };
          }

          return {
            items: [
              ...state.items,
              {
                product,
                quantity: Math.max(1, Math.min(quantity, product.quantityOnHand ?? 999999)),
              },
            ],
            isOpen: true,
          };
        });
      },

      removeItem: (productId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
      },

      updateQuantity: (productId: string, quantity: number) => {
        set((state) => {
          if (quantity <= 0) {
            return {
              items: state.items.filter((item) => item.product.id !== productId),
            };
          }

          return {
            items: state.items.map((item) => {
              if (item.product.id === productId) {
                const maxStock = item.product.quantityOnHand ?? 999999;
                return {
                  ...item,
                  quantity: Math.min(quantity, maxStock),
                };
              }
              return item;
            }),
          };
        });
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getEstimatedSubtotal: () => {
        return get().items.reduce((total, item) => {
          const price = parseFloat(item.product.sellingPrice) || 0;
          return total + price * item.quantity;
        }, 0);
      },
    }),
    {
      name: "holstein_cart_storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
);

