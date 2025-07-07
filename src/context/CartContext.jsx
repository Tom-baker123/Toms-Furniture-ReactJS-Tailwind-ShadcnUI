import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { getCart, addToCart, updateCart, removeFromCart } from "@/api/api";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchCart = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getCart();
            setCart(data || []);
        } catch (err) {
            setCart([]);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const handleAddToCart = async (item) => {
        await addToCart(item);
        fetchCart();
    };

    const handleUpdateCart = async (item) => {
        await updateCart(item);
        fetchCart();
    };

    const handleRemoveFromCart = async (id) => {
        await removeFromCart(id);
        fetchCart();
    };

    return (
        <CartContext.Provider
            value={{
                cart,
                loading,
                error,
                fetchCart,
                addToCart: handleAddToCart,
                updateCart: handleUpdateCart,
                removeFromCart: handleRemoveFromCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
