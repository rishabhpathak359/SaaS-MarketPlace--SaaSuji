import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getDataFromApiWithResponse } from '@/utils/api';
import toast from 'react-hot-toast';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import Slider from 'react-slick';

const SearchResultsPage = () => {
  const { searchTerm } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [selectedTags, setSelectedTags] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getDataFromApiWithResponse({}, `/api/v1/product/getSuggestions?keyword=${searchTerm}&limit=10`);
        setProducts(response.data);
      } catch (error) {
        toast.error('Error fetching products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchTerm]);

  const applyFilters = () => {
    filterProducts();
  };

  const filterProducts = () => {
    let filtered = products.slice();
    if (priceRange.min !== '' && priceRange.max !== '') {
      filtered = filtered.filter(product => product.price >= parseFloat(priceRange.min) && product.price <= parseFloat(priceRange.max));
    }
    if (selectedTags.length > 0) {
      filtered = filtered.filter(product => selectedTags.some(tag => product.tags.includes(tag)));
    }

    if (sortBy === 'priceLowToHigh') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'priceHighToLow') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'ratingHighToLow') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'ratingLowToHigh') {
      filtered.sort((a, b) => a.rating - b.rating);
    }
    setProducts(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [sortBy]);

  const renderSkeleton = () => (
    <Slider>
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="p-4">
          <Skeleton height={200} />
          <Skeleton count={3} className="my-2" />
        </div>
      ))}
    </Slider>
  );

  const truncateText = (text, maxLength) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  const renderProductsOrMessage = () => {
    if (loading) {
      return renderSkeleton();
    }
    if (products.length === 0) {
      return (
        <div className="flex items-center justify-center h-80">
          <p className="text-lg">No products found.</p>
        </div>
      );
    } else {
      return (
        <div className="flex flex-col space-y-4">
          {products.map(product => (
            <Link to={`/product/${product._id}`} key={product._id}>
              <div className="rounded-lg shadow-md overflow-hidden border border-gray-200 bg-white mx-2 md:mx-4 p-4 transition-transform transform hover:scale-105">
                <div className="flex items-center justify-center">
                  <img src={product.images[0]} alt={product.productName} className="w-full h-64 object-cover rounded-md" />
                </div>
                <div className="mt-4">
                  <h2 className="text-lg font-semibold mb-2">{truncateText(product.productName, 50)}</h2>
                  <p className="text-sm text-gray-600 mb-2">{Array.isArray(product.category) ? product.category.join(', ') : ''}</p>
                  <p className="text-gray-700 mb-2 h-12 overflow-hidden">{truncateText(product.description, 100)}</p>
                  <p className="flex items-center justify-between">
                    <span className="text-yellow-400">{Array(product.rating).fill('★').join('')}</span>
                    <span className="text-lg font-semibold">{`$${product.price.toFixed(2)}`}</span>
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      );
    }
  };

  return (
    <div className="container mx-auto pt-36">
      {/* Filter Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <div className="flex items-center mb-2 md:mb-0">
          <label className="mr-2">Sort By:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border px-2 py-1"
          >
            <option value="">Select</option>
            <option value="priceLowToHigh">Price: Low to High</option>
            <option value="priceHighToLow">Price: High to Low</option>
            <option value="ratingHighToLow">Rating: High to Low</option>
            <option value="ratingLowToHigh">Rating: Low to High</option>
          </select>
        </div>
        <div className="flex flex-col gap-5 md:gap-0 md:flex-row items-center">
          <label className="mr-2">Price Range:</label>
          <input
            type="number"
            placeholder="Min"
            value={priceRange.min}
            onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
            className="border px-2 py-1 mr-2 w-24 md:w-auto"
          />
          <input
            type="number"
            placeholder="Max"
            value={priceRange.max}
            onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
            className="border px-2 py-1 mr-2 w-24 md:w-auto"
          />
          <button onClick={applyFilters} className="bg-orange-400 hover:bg-white border-2 border-orange-400 hover:text-black text-white px-4 py-2 rounded">Apply Filters</button>
        </div>
      </div>

      <h1 className="text-3xl font-semibold mb-4">Search Results for "{searchTerm}"</h1>
      {renderProductsOrMessage()}
    </div>
  );
};

export default SearchResultsPage;
