import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchDataFromApiWithAuthorization, fetchDataFromApiWithResponse, getDataFromApiWithAuthorization, getDataFromApiWithResponse } from '@/utils/api';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};


export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]); // Initial state as an empty array
  const [loading, setLoading] = useState(false); // To handle loading state
  const [error, setError] = useState(null); // To handle errors

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const data = await getDataFromApiWithAuthorization({}, "/api/v1/cart/getCart");
      if (data.statusCode === 200) {
        setCart(data.data);
      } else {
        setError(data.message); // Set error message
      }
    } catch (error) {
      setError('Failed to fetch cart.');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity) => {
    try {
      const body = { productId, quantity };
      const data = await fetchDataFromApiWithAuthorization(body, "/api/v1/cart/addToCart");
      if (data.statusCode === 201) {
        fetchCart(); // Refresh cart
      } else {
        setError(data.message); // Set error message
      }
    } catch (error) {
      setError('Failed to add to cart.');
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, fetchCart, loading, error }}>
      {children}
    </CartContext.Provider>
  );
};
