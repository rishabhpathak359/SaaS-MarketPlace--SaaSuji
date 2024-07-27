import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const Products = () => {
  const [latestFilteredProducts, setLatestFilteredProducts] = useState([]);
  const [popularFilteredProducts, setPopularFilteredProducts] = useState([]);
  const [recentlyViewedFilteredProducts, setRecentlyViewedFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState(null);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [selectedTags, setSelectedTags] = useState([]);
  const [askingForProductPage, setAskingForProductPage] = useState(false);

  const getProducts = async () => {
    try {
      const response = await fetch('https://sassujibackend.onrender.com/api/v1/product/getProducts?page=0&limit=10');
      const data = await response.json();
      if (data.statusCode === 201) {
        const products = data.data.products.map(product => ({
          id: product._id,
          name: product.productName,
          image: product.images[0] || 'fallback-image-url.jpg', 
          rating: product.rating,
          description: product.description,
          price: product.price,
          tags: Array.isArray(product.category) ? product.category : [], 
          time: product.updatedAt
        }));
        setLatestFilteredProducts(products);
        setPopularFilteredProducts(products);
        setRecentlyViewedFilteredProducts(products);
        latestFilteredProducts.sort((a,b) => a.time - b.time)
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Failed to fetch products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
    ],
  };

  const applyFilters = () => {
    filterProducts(latestFilteredProducts, setLatestFilteredProducts);
    filterProducts(popularFilteredProducts, setPopularFilteredProducts);
    filterProducts(recentlyViewedFilteredProducts, setRecentlyViewedFilteredProducts);
  };

  const filterProducts = (products, setFilteredProducts) => {
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
    setFilteredProducts(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [sortBy]);

  const renderSkeleton = () => (
    <Slider {...carouselSettings}>
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="rounded-lg shadow-md overflow-hidden mx-2 text-center cursor-pointer">
          <div className="mx-4">
            <Skeleton height={192} />
          </div>
          <div className="p-4">
            <Skeleton width={120} height={24} />
            <Skeleton width={80} height={16} className="my-2" />
            <Skeleton width={160} height={40} />
            <Skeleton width={60} height={24} />
          </div>
        </div>
      ))}
    </Slider>
  );

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.slice(0, maxLength) + '...';
  };
  
  const renderProductsOrMessage = (products, autoplay) => {
    if (loading) {
      return renderSkeleton();
    }
    if (products.length === 0) {
      return (
        <div className="h-80 flex items-center justify-center">
          <p>No products found.</p>
        </div>
      );
    } else {
      return (
        <Slider {...carouselSettings} autoplay={autoplay}>
          {products.map(product => (
            <Link to={`/product/${product.id}`} key={product.id}>
              <div className="rounded-lg shadow-md overflow-hidden mx-2 text-center cursor-pointer ">
                <div className="mx-4">
                  <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
                </div>
                <div className="p-4">
                  <p className="text-md font-semibold mb-2">{truncateText(product.name, 50)}</p>
                  <p className="text-sm text-gray-600 mb-2">{Array.isArray(product?.category)}</p>
                  <p className="text-gray-700 mb-2 h-10 overflow-auto">{truncateText(product.description, 50)}</p>
                  <p className="flex items-center justify-center">
                    <span className="text-yellow-400">{Array(product.rating).fill('★').join('')}</span>
                    <span className="ml-1 text-lg font-semibold">{`$${product.price.toFixed(2)}`}</span>
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </Slider>
      );
    }
  };
  

  return (
    <div className="container mx-auto md:pt-20 pt-36">
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
            className="border px-2 py-1 mr-2 w-20 md:w-auto"
          />
          <input
            type="number"
            placeholder="Max"
            value={priceRange.max}
            onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
            className="border px-2 py-1 mr-2 w-20 md:w-auto"
          />
          <button onClick={applyFilters} className="bg-orange-400 hover:bg-white border-2 border-orange-400 hover:text-black text-white px-4 py-1 rounded">Apply Filters</button>
        </div>
      </div>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Latest Products</h2>
        {renderProductsOrMessage(latestFilteredProducts, false)}
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Popular Products</h2>
        {renderProductsOrMessage(popularFilteredProducts, true)}
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Recently Viewed Products</h2>
        {renderProductsOrMessage(recentlyViewedFilteredProducts, true)}
      </section>
    </div>
  );
};

export default Products;
