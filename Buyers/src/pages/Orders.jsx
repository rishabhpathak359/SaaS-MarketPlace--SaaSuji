import React, { useEffect, useState } from 'react';
import { getDataFromApiWithAuthorization } from '@/utils/api'; 
import toast from 'react-hot-toast';
import { Box, Clipboard, CreditCard, MapPin, ShoppingCart } from 'lucide-react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getDataFromApiWithAuthorization({}, '/api/v1/order/getOrdersByUser');
        if (response.statusCode === 200) {
          const sortedOrders = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setOrders(sortedOrders);
        } else {
          toast.error(response.data.message || 'Failed to fetch orders.');
        }
      } catch (error) {
        toast.error('Failed to fetch orders.');
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-4 md:pt-20">
        <h1 className="text-3xl font-bold mb-6 text-center">Your Orders</h1>
        <div className="space-y-6">
          {[1, 2, 3].map((_, index) => (
            <div key={index} className="bg-white shadow-lg rounded-lg p-6 mb-6">
              <Skeleton height={30} width="80%" className="mb-4" />
              <Skeleton height={20} width="50%" className="mb-4" />
              <Skeleton count={3} height={20} className="mb-2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:pt-20">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Orders</h1>

      {orders.length === 0 ? (
        <p className="text-center text-gray-600">You have no orders yet.</p>
      ) : (
        <div>
          {orders.map((order) => (
            <div key={order._id} className="bg-white shadow-lg rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Order ID: {order._id}</h2>
                <span className={`text-lg font-medium ${order.paymentStatus === 'paid' ? 'text-green-600' : 'text-red-600'}`}>
                  {order.paymentStatus === 'paid' ? <CreditCard className="inline mr-1" /> : <Clipboard className="inline mr-1" />}
                  {order.paymentStatus}
                </span>
              </div>
              <p className="text-gray-600 mb-4"><ShoppingCart className="inline mr-1" /> Total Price: ${order.totalPrice.toFixed(2)}</p>
              <h3 className="text-lg font-semibold mb-2">Items:</h3>
              <ul className="list-disc list-inside pl-6">
                {order.items.map((item) => (
                  <li key={item.productId} className="mb-1">
                    <span className="font-medium">{item.productName}</span> - {item.quantity} x ${item.price.toFixed(2)}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
