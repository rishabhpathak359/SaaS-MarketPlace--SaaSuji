import React, { useEffect, useState, useRef } from 'react';
import { fetchDataFromApiWithAuthorization, getDataFromApiWithAuthorization } from '@/utils/api';
import toast from 'react-hot-toast';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useNavigate } from 'react-router-dom';


const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [increment, setIncrement] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [loading,setLoading]  = useState(true);
  const initialQuantities = useRef({});
  const navigate = useNavigate();
  const debounceTimeout = useRef(null);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await getDataFromApiWithAuthorization({}, '/api/v1/order/getCart');
      if (response.statusCode === 200) {
        setCart(response.data.items);
        const initialQuantitiesData = response.data.items.reduce((acc, item) => {
          acc[item.productId._id] = item.quantity;
          return acc;
        }, {});
        setQuantities(initialQuantitiesData);
        initialQuantities.current = initialQuantitiesData;
      } else {
        console.error(response.data.message);
      }
    } catch (error) {
      console.error('Failed to fetch cart.', error);
    }
    finally{
      setLoading(false);
    }
  };

  const handleQuantityChange = (productId, newQuantity, action) => {
    if (newQuantity <= 0) {
      setCart((prevCart) => prevCart.filter((item) => item.productId._id !== productId));
    }
    setIncrement((prevIncrement) => ({
      ...prevIncrement,
      [productId]: action,
    }));
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: newQuantity,
    }));
  };

  useEffect(() => {
    const updateCart = async () => {
      const updates = Object.keys(quantities).filter(
        (productId) => quantities[productId] !== initialQuantities.current[productId]
      );

      if (updates.length === 0) return;

      try {
        await Promise.all(
          updates.map(async (productId) => {
            const quantity = quantities[productId];
            const action = increment[productId];
            let body;

            if (quantity <= 0) {
              body = { productId, quantity: -initialQuantities.current[productId] };
              await fetchDataFromApiWithAuthorization(body, '/api/v1/order/addToCart');
            } else {
              if (action) {
                // Increment
                body = { productId, quantity: quantity - initialQuantities.current[productId] };
              } else {
                // Decrement
                body = { productId, quantity: -(initialQuantities.current[productId] - quantity) };
              }
              await fetchDataFromApiWithAuthorization(body, '/api/v1/order/addToCart');
            }
          })
        );
        fetchCart(); 
      } catch (error) {
        console.error('Failed to update cart.', error);
      }
    };

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(updateCart, 500);

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [quantities]);

  const handleCheckout = () => {
    setShowModal(true);
  };
  function calculateValidUpto(validityDays) {
    const today = new Date();
    today.setDate(today.getDate() + validityDays);
    return today.toISOString(); 
  }
  
  const loadScript = (src) =>{
    return new Promise((resolve)=>{
      const script = document.createElement('script');
      script.src=src;
      script.onload=()=>{
        resolve(true);
      }
      script.onerror=()=>{
        resolve(false);
      }
      document.body.appendChild(script)
    })
  }

  const handlePayment = async () => {
    console.log(cart)
        try {
            const orderData = {
                items: cart.map(item => ({
                    productId: item.productId._id,
                    quantity: item.quantity,
                    validity:item.validity,
                    sellerId:item.sellerId,
                    price: item.price,
                    productName: item.productName,
                })),
            };

            const response = await fetchDataFromApiWithAuthorization(orderData, '/api/v1/order/createOrder');
            const { newOrder, order } = response.data;

            const paymentObject = new (window).Razorpay({
                  key:'rzp_test_modxwIOl3HQQ1C',
                  order_id:order.id,
                  ...order,
                  handler : async function(res){
                    console.log(res);
                    const options = {
                      rzpOrderId:res.razorpay_order_id,
                      paymentId:res.razorpay_payment_id,
                      signature:res.razorpay_signature,
                      orderId:newOrder._id
                    }
                    const verification = await fetchDataFromApiWithAuthorization(options, '/api/v1/order/verifyPayment')
                    console.log(verification)
                  }
            })

            paymentObject.open();
      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error('Payment handling error:', error);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 pt-20">
        <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white shadow-lg rounded-lg p-4 mb-4">
            <Skeleton width={96} height={96} className="rounded" />
            <div className="flex-1 ml-4">
              <Skeleton width="80%" height={24} />
              <Skeleton width="60%" height={20} className="mt-2" />
              <div className="flex items-center mt-2">
                <Skeleton width={24} height={24} className="mr-2" />
                <Skeleton width={24} height={24} />
              </div>
            </div>
            <Skeleton width={80} height={24} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 pt-20">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          {cart.map((item) => (
            <div
              key={item.productId._id}
              className="flex items-center justify-between bg-white shadow-lg rounded-lg p-4 mb-4"
            >
              <img
                src={item.image || 'fallback-image-url.jpg'}
                alt={item.productName}
                className="w-24 h-24 object-cover rounded"
              />
              <div className="flex-1 ml-4">
                <h2 className="text-xl font-semibold">{item.productName}</h2>
                <p className="text-gray-600">${item.price.toFixed(2)}</p>
                <div className="flex items-center mt-2">
                  <button
                    onClick={() => handleQuantityChange(item.productId._id, quantities[item.productId._id] - 1, 0)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-2 py-1 rounded"
                    disabled={quantities[item.productId._id] <= 1}
                  >
                    -
                  </button>
                  <input
                    type="text"
                    value={quantities[item.productId._id]}
                    readOnly
                    className="mx-2 text-center w-12 border border-gray-300 rounded"
                  />
                  <button
                    onClick={() => handleQuantityChange(item.productId._id, quantities[item.productId._id] + 1, 1)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-2 py-1 rounded"
                  >
                    +
                  </button>
                </div>
              </div>
              <button
                onClick={() => handleQuantityChange(item.productId._id, 0)}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          ))}
          <div className="mt-6">
            <button
              onClick={handlePayment}
              className="bg-green-500 hover:bg-green-700 text-white px-6 py-3 rounded-lg shadow-md transition duration-300"
            >
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
