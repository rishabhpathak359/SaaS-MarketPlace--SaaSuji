import { fetchDataFromApiWithResponse } from '@/utils/api';
import { Player } from '@lottiefiles/react-lottie-player';
import { Eye, EyeOff, Loader } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import ani from '../assets/ani.json'

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [userInfo, setUserInfo] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(JSON.stringify(localStorage.getItem("User")) || null);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setUserInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    fetchData();
  };

  const fetchData = async () => {
    const body = {
      email: userInfo.email,
      password: userInfo.password,
    };
    const data = await fetchDataFromApiWithResponse(body, "/api/v1/user/login");
    if (data.statusCode === 200) {
      toast.success("Sign In Successful");
      localStorage.setItem("User", JSON.stringify(data.data.user));
      localStorage.setItem("token", JSON.stringify(data.data.accessToken));
      localStorage.setItem("refreshToken", JSON.stringify(data.data.refreshToken));
      setLoading(false);
      navigate("/");
    } else {
      toast.error(data.message);
      setLoading(false);
    }
  };

  const handleHomeButtonClick = () => {
    navigate('/');
  };

  return (
    <div className="flex w-full h-screen bg-gray-100">
      <div className="hidden md:w-1/2 bg-gradient-to-r from-orange-200 to-orange-300 md:flex md:flex-col md:justify-center md:items-center">
        <div className="relative w-full mt-8 lg:w-1/2 lg:mt-0">
          <Player src={ani} className="player" loop autoplay />
        </div>
        <div className="mt-4 text-center text-xl font-semibold text-gray-800">
          Welcome back! Let's continue where you left off.
        </div>
        <button
          onClick={handleHomeButtonClick}
          className="mt-4 px-4 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition duration-300"
        >
          Go to Home Page
        </button>
      </div>
      <div className="w-full md:w-1/2 flex items-center justify-center p-6">
        <div className="bg-white p-10 rounded-xl shadow-lg w-full max-w-md">
          <h2 className="text-3xl font-bold text-gray-800">Sign In</h2>
          <p className="mt-2 text-sm text-gray-600">Welcome back! Please enter your details</p>
          <form className="mt-6" onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                id="email"
                type="email"
                name="email"
                onChange={handleInputChange}
                placeholder="Enter your email"
                autoComplete="email"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-orange-300"
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
                placeholder="Enter your password"
                autoComplete="current-password"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-orange-300"
                required
              />
              <div className="absolute inset-y-0 right-0 top-5 flex items-center pr-3 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff className="h-5 w-5 text-gray-500" /> : <Eye className="h-5 w-5 text-gray-500" />}
              </div>
            </div>
            {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
            <button
              type="submit"
              className="w-full py-3 mt-6 flex justify-center bg-orange-600 text-white rounded-lg font-medium focus:outline-none hover:bg-orange-700 transition duration-300"
            >
              {loading ? <Loader className='animate-spin' /> : 'Sign In'}
            </button>
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">Don't have an account? <Link to="/sign-up" className="text-orange-600 hover:underline">Sign Up</Link></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
