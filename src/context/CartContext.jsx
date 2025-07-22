import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { getCart, addToCart, updateCart, removeFromCart } from "../api/service/CartService";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [cartTotal, setCartTotal] = useState(0);

    const fetchCart = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getCart();
            console.log("Raw API response:", data);
            setCart(data || []);
        } catch (err) {
            console.error("Fetch cart error:", err);
            setCart([]);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    // Tính tổng số tiền mỗi khi cart thay đổi
    useEffect(() => {
        if (cart && Array.isArray(cart)) {
            const total = cart.reduce((sum, item) => {
                const price = item.productVariant?.discountedPrice ?? item.productVariant?.originalPrice ?? 0;
                return sum + price * item.quantity;
            }, 0);
            setCartTotal(total);
        } else {
            setCartTotal(0);
        }
    }, [cart]);

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
                cartTotal,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
