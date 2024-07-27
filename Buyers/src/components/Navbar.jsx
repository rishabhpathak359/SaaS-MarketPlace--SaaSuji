import React, { useState, useEffect, useRef } from 'react';
import { Search, ShoppingCart, User, ChevronDown, ChevronUp } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { getDataFromApiWithResponse } from '@/utils/api';
import useDebounce from '@/utils/useDebounce';

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [suggOpen, setSuggOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const suggestionDropRef = useRef(null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("User")) || null);
  const [searchValue, setSearchValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const debouncedSearchValue = useDebounce(searchValue, 500);

  const handleLogout = () => {
    localStorage.removeItem('User');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    navigate("/sign-in");
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
    if (suggestionDropRef.current && !suggestionDropRef.current.contains(event.target)) {
      setSuggOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  useEffect(() => {
    if (debouncedSearchValue) {
      const fetchSuggestions = async () => {
        try {
          const response = await getDataFromApiWithResponse({},`/api/v1/product/getSuggestions?keyword=${debouncedSearchValue}&limit=10`);
          setSuggestions(response.data);
          setSuggOpen(true);
        } catch (error) {
          console.error("Error fetching search suggestions:", error);
        }
      };

      fetchSuggestions();
    } else {
      setSuggestions([]);
      setSuggOpen(false);
    }
  }, [debouncedSearchValue]);

  const onSearch = (searchTerm) => {
    navigate(`/search/${searchTerm}`);
    setSearchValue('');
    setSuggestions([]);
    setSuggOpen(false);
  };
  const onIndividualSearch = (id) => {
    navigate(`/product/${id}`);
    setSearchValue('');
    setSuggestions([]);
    setSuggOpen(false);
  };

  return (
    <nav className="w-screen bg-gradient-to-r from-orange-300 to-orange-400 shadow-md fixed z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a href='/'>
            <div className="text-3xl text-white font-serif md:-ml-12 md:mr-7">
              SassuJi
            </div>
          </a>
          <div className="hidden md:flex flex-grow mx-4 mr-5">
            <div className="relative text-gray-600 w-full">
              <input
                type="search"
                name="search"
                placeholder="Search for products"
                className="bg-white h-10 px-5 pr-10 rounded-full text-sm focus:outline-none w-full"
                value={searchValue} 
                onChange={handleSearchChange}
              />
              <button 
                type="submit" 
                className="absolute right-0 top-0 md:mt-3 md:mr-4"
                onClick={() => onSearch(searchValue)}
              >
                <Search className="h-4 w-4 text-gray-600" />
              </button>
              {suggOpen && (
                <div 
                  // style={{ width: 'calc(100% - 2.5rem)' }}
                  ref={suggestionDropRef}
                  className="absolute z-10 bg-white mt-2 rounded-md shadow-lg"
                >
                  {suggestions
                    .map((item, index) => (
                      <div
                        key={index}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => onIndividualSearch(item._id)}
                      >
                        {item.productName}
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4 md:ml-10 md:-mr-10">
            <Link to="/cart">
              <ShoppingCart className="h-8 w-8 text-white hover:text-orange-600 cursor-pointer" />
            </Link>
            <div className="relative">
              <button
                className="flex items-center text-white focus:outline-none"
                onClick={toggleDropdown}
              >
                <User className="h-8 w-8 rounded-full bg-white text-orange-600 p-1" />
                {isDropdownOpen ? (
                  <ChevronUp className="h-4 w-4 ml-1 text-white" />
                ) : (
                  <ChevronDown className="h-4 w-4 ml-1 text-white" />
                )}
              </button>
              {isDropdownOpen && user ? (
                <div
                  className="absolute z-50 right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                  ref={dropdownRef}
                >
                  <div className="py-1">
                    <Link
                      to="/"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Products
                    </Link>
                    <Link
                      to="/orders"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Your Orders
                    </Link>
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : isDropdownOpen && (
                <div
                  className="absolute z-50 right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                  ref={dropdownRef}
                >
                  <div className="py-1">
                    <Link
                      to="/sign-up"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign Up
                    </Link>
                  </div>
                  <div className="py-1">
                    <Link
                      to="/sign-in"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign In
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="md:hidden mt-2 pb-2">
          <div className="relative text-gray-600 w-full">
            <input
              type="search"
              name="search"
              placeholder="Search for products"
              className="bg-white h-10 px-5 pr-10 rounded-full text-sm focus:outline-none w-full"
              value={searchValue} 
              onChange={handleSearchChange}
            />
            <button 
              type="submit" 
              className="absolute right-0 top-0 mt-3 mr-4"
              onClick={() => onSearch(searchValue)}
            >
              <Search className="h-4 w-4 text-gray-600" />
            </button>
            {suggOpen && (
                <div 
                  // style={{ width: 'calc(100% - 2.5rem)' }}
                  ref={suggestionDropRef}
                  className="absolute z-10 bg-white mt-2 rounded-md shadow-lg"
                >
                  {suggestions
                    .map((item, index) => (
                      <div
                        key={index}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => onIndividualSearch(item._id)}
                      >
                        {item.productName}
                      </div>
                    ))}
                </div>
              )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
