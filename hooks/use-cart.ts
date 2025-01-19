import { Products } from "@/types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import toast from "react-hot-toast";

interface CartStore {
    items: Products[],
    addItem: (data: Products) => void;
    deleteItem: (id: string) => void;
    deleteAll: () => void;
}

const useCart = create(
    persist<CartStore>((set, get) => ({
        items: [],
        addItem: (data: Products) => {
            const currentItems = get().items;
            const existingItem = currentItems.find(item => item.id === data.id);

            if (existingItem) {
                return toast("Item already exists");
            }

            // 1) Update the local Zustand cart
            set({ items: [...currentItems, data] });
            toast.success("Item added to cart");

            // 2) Call your new API route to record "cart-add" in the DB
            fetch("/api/interactions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId: data.id }),
            })
                .then(() => {
                    // If needed, do something on success
                })
                .catch((err) => {
                    console.error("Failed to record cart-add interaction:", err);
                });
        },
        deleteItem: (id: string) => {
            set({ items: [...get().items.filter(item => item.id !== id)] });
        },
        deleteAll: () => set({ items: [] })
    }), {
        name: "Cart-Storage",
        storage: createJSONStorage(() => localStorage),
    })
);

export default useCart;
