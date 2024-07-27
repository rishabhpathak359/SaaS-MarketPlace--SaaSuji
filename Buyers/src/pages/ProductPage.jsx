import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchDataFromApiWithAuthorization, getDataFromApiWithResponse } from '@/utils/api';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const ProductPage = () => {
  const [product, setProduct] = useState(null);
  const [newReview, setNewReview] = useState('');
  const [loading, setLoading] = useState(true);
  const { productId } = useParams();
  const navigate = useNavigate();

  const isLoggedIn = () => {
    const token = localStorage.getItem('token');
    return token ? true : false;
  };

  const fetchProductDetails = async () => {
    try {
      const body = { id: productId };
      const data = await getDataFromApiWithResponse(body, '/api/v1/product/getProductById');
      if (data.statusCode === 201) {
        setProduct(data.data);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error('Failed to fetch product details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [productId]);

  const handleAddToCart = async () => {
    const loggedIn = isLoggedIn();
    if (!loggedIn) navigate('/sign-in');
    try {
      const body = { productId, quantity: 1 };
      await fetchDataFromApiWithAuthorization(body, '/api/v1/order/addToCart');
      console.log('Added to cart');
    } catch (error) {
      console.error('Failed to add to cart.');
    }
  };

  const handleBuyNow = () => {
    const loggedIn = isLoggedIn();
    if (!loggedIn) navigate('/sign-in');
    console.log('Buy now');
  };

  const handleReviewSubmit = async () => {
    const loggedIn = isLoggedIn();
    if (!loggedIn) navigate('/sign-in');
    try {
      console.log('Review submitted:', newReview);
    } catch (error) {
      console.error('Failed to submit review.');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 md:pt-20 bg-gray-100">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <Skeleton height={400} className="mb-8" />
          <Skeleton height={50} className="mb-4" />
          <Skeleton height={30} className="mb-2" />
          <Skeleton height={100} className="mb-4" />
          <Skeleton height={30} className="mb-2" />
          <Skeleton height={30} className="mb-4" />
          <Skeleton height={50} className="mb-2" />
          <Skeleton height={30} className="mb-4" />
          <Skeleton height={200} className="mb-8" />
        </div>
      </div>
    );
  }

  if (!product) {
    return <div>Failed to load product details.</div>;
  }

  const stockStatus = () => {
    if (product.stock === 0) {
      return 'Out of Stock';
    } else if (product.stock <= 5) {
      return 'Hurry up, only a few left!';
    } else {
      return 'In Stock';
    }
  };

  return (
    <div className="container mx-auto p-6 md:pt-20 bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6">
        {/* Product Image Carousel */}
        <div className="mb-8">
          {product.images.length > 0 ? (
            <div className="flex overflow-x-auto space-x-4">
              {product.images.map((image, index) => (
                <img key={index} src={image || 'fallback-image-url.jpg'} alt={product.productName} className="w-full h-96 object-cover rounded-lg shadow-md" />
              ))}
            </div>
          ) : (
            <img src="fallback-image-url.jpg" alt="No image available" className="w-full h-96 object-cover rounded-lg shadow-md" />
          )}
        </div>

        {/* Product Details */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-800">{product.productName}</h1>
          <p className="text-2xl text-gray-600 mb-2">{`$${product.price.toFixed(2)}`}</p>
          <p className="text-gray-800 mb-4">{product.description}</p>
          <p className="text-gray-500 mb-2"><strong>Category:</strong> {product.category}</p>
          <p className={`mb-4 ${product.stock === 0 ? 'text-red-600' : product.stock <= 5 ? 'text-orange-500' : 'text-green-500'}`}>{stockStatus()}</p>
          <div className="flex space-x-4">
            <button 
            onClick={handleAddToCart} 
            className="bg-blue-600 hover:bg-blue-800 text-white px-6 py-3 rounded-lg shadow-md transition duration-300">
              Add to Cart
            </button>
            <button 
            onClick={handleBuyNow} 
            className={`bg-green-600 hover:bg-green-800 text-white px-6 py-3 rounded-lg shadow-md transition duration-300 ${product.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={product.stock === 0}>
              Buy Now
            </button>
          </div>
        </div>

        {/* Seller Info */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2 text-gray-800">Seller Information</h2>
          <p className="text-gray-800"><strong>Username:</strong> {product.seller.username}</p>
          <p className="text-gray-600"><strong>Email:</strong> {product.seller.email}</p>
        </div>

        {/* Reviews Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Customer Reviews</h2>
          {product.reviews.length === 0 ? (
            <p className="text-gray-500">No reviews yet.</p>
          ) : (
            <div className="space-y-4">
              {product.reviews.map((review, index) => (
                <div key={index} className="border p-4 rounded-lg bg-gray-50 shadow-sm">
                  <p className="font-semibold text-gray-800">{review.username}</p>
                  <p className="text-gray-700">{review.text}</p>
                </div>
              ))}
            </div>
          )}
          <div className="mt-6">
            <textarea
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
              className="w-full border p-4 rounded-lg shadow-sm mb-4"
              placeholder="Write your review here..."
            />
            <button onClick={handleReviewSubmit} className="bg-blue-600 hover:bg-blue-800 text-white px-6 py-3 rounded-lg shadow-md transition duration-300">
              Submit Review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
