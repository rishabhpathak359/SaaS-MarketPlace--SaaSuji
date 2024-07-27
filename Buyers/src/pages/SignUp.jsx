import { fetchDataFromApiWithResponse } from '@/utils/api';
import { Player } from '@lottiefiles/react-lottie-player';
import { Eye, EyeOff, Loader } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ani2 from '../assets/ani2.json';
import toast from 'react-hot-toast';

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmedPassword, setShowConfirmedPassword] = useState(false);
  const [userInfo, setUserInfo] = useState({ 
    firstName: "", lastName: "", email: "", username:"", phone: "", address: "", paymentMethod: "", password: "", confirmPassword: "" 
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setUserInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const fetchData = async () => {
    const body = {
      email: userInfo.email,
      role: "buyer",
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      username: userInfo.username,
      phoneNumber: userInfo.phone,
      address: userInfo.address,
      confirmpassword: userInfo.confirmPassword,
      password: userInfo.password,
      paymentMethod: userInfo.paymentMethod,
    };
    const data = await fetchDataFromApiWithResponse(body, "/api/v1/user/register");
    if (data.statusCode === 200) {
      toast.success("User Registered Successfully");
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (userInfo.password === userInfo.confirmPassword) {
      setLoading(true);
      await fetchData();
    } else {
      setError("Passwords do not match");
    }
  };

  const handleHomeButtonClick = () => {
    navigate('/');
  };

  return (
    <div className="flex w-full h-screen bg-gray-100">
      <div className="hidden md:w-1/2 bg-gradient-to-r from-orange-200 to-orange-300 md:flex md:flex-col md:justify-center md:items-center">
        <div className="relative w-full mt-8 lg:w-1/2 lg:mt-0">
          <Player src={ani2} className="player" loop autoplay />
        </div>
        <p className="text-lg font-semibold text-gray-700 mt-4">Welcome to our SaaS marketplace! Register now and explore amazing services.</p>
        <button
          onClick={handleHomeButtonClick}
          className="mt-4 px-4 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition duration-300"
        >
          Go to Home Page
        </button>
      </div>
      <div className="w-full md:w-1/2 flex items-center justify-center p-6">
        <div className="bg-white p-10 rounded-xl shadow-lg w-full max-w-md">
          <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
          <p className="mt-2 text-sm text-gray-600">Fill in your details to get started</p>
          <form className="mt-6" onSubmit={handleSubmit}>
            <div className="flex gap-2">
              <div className="mb-4 w-1/2">
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  id="firstName"
                  type="text"
                  name="firstName"
                  onChange={handleInputChange}
                  placeholder="Your First Name"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none  focus:border-orange-300"
                  required
                />
              </div>
              <div className="mb-4 w-1/2">
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  id="lastName"
                  type="text"
                  name="lastName"
                  onChange={handleInputChange}
                  placeholder="Your Last Name"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none  focus:border-orange-300"
                  required
                />
              </div>
            </div>
            <div className="flex gap-2">
              <div className="mb-4 w-1/2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  autoComplete="email"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none  focus:border-orange-300"
                  required
                />
              </div>
              <div className="mb-4 w-1/2">
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                <input
                  id="username"
                  type="text"
                  name="username"
                  onChange={handleInputChange}
                  placeholder="Enter a username"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none  focus:border-orange-300"
                  required
                />
              </div>
            </div>
            <div className="flex gap-2">
              <div className="mb-4 w-1/2">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  id="phone"
                  type="text"
                  name="phone"
                  onChange={handleInputChange}
                  placeholder="Your Phone Number"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none  focus:border-orange-300"
                  required
                />
              </div>
              <div className="mb-4 w-1/2">
                <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700">Payment Method</label>
                <input
                  id="paymentMethod"
                  type="text"
                  name="paymentMethod"
                  onChange={handleInputChange}
                  placeholder="Your Payment Method"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none  focus:border-orange-300"
                  required
                />
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">Shipping Address</label>
              <input
                id="address"
                type="text"
                name="address"
                onChange={handleInputChange}
                placeholder="Your Address"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none  focus:border-orange-300"
                required
              />
            </div>
            <div className="mb-4 relative">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                onChange={handleInputChange}
                placeholder="Enter a password"
                autoComplete="current-password"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none  focus:border-orange-300"
                required
              />
              <div className="absolute inset-y-0 right-0 top-7 flex items-center pr-3 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff className="h-5 w-5 text-gray-500" /> : <Eye className="h-5 w-5 text-gray-500" />}
              </div>
            </div>
            <div className="mb-4 relative">
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                id="confirm-password"
                type={showConfirmedPassword ? 'text' : 'password'}
                name="confirmPassword"
                onChange={handleInputChange}
                placeholder="Confirm your password"
                autoComplete="current-password"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none  focus:border-orange-300"
                required
              />
              <div className="absolute inset-y-0 right-0 top-7 flex items-center pr-3 cursor-pointer" onClick={() => setShowConfirmedPassword(!showConfirmedPassword)}>
                {showConfirmedPassword ? <EyeOff className="h-5 w-5 text-gray-500" /> : <Eye className="h-5 w-5 text-gray-500" />}
              </div>
            </div>
            {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
            <button
              type="submit"
              className="w-full py-3 mt-6 flex justify-center bg-orange-600 text-white rounded-lg font-medium focus:outline-none hover:bg-orange-700 transition duration-300"
            >
              {loading ? <Loader className='animate-spin' /> : 'Sign Up'}
            </button>
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">Already have an account? <Link to="/sign-in" className="text-orange-600 hover:underline">Sign In</Link></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
