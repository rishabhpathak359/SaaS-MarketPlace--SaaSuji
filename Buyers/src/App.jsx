import './index.css';
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import SignUp from './pages/SignUp';
import { Home } from 'lucide-react';
import SignIn from './pages/SignIn';
import PrivateRoute from './components/PrivateRoute';
import Products from './pages/Products';
import { Toaster } from 'react-hot-toast';
import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Cart from './pages/Cart';
import FloatingChatbot from './components/FloatingChatbot';
import ProductPage from './pages/ProductPage';
import OrdersPage from './pages/Orders';
import NotFoundPage from './pages/NotFoundPage';
import SearchResultsPage from './pages/SearchResultPage';

function App() {
  return (
    <Router>
      <AppContent />
      <FloatingChatbot></FloatingChatbot>
    </Router>
  );
}

function AppContent() {
  const location = useLocation();
  const isSignInOrSignUp = location.pathname === '/sign-in' || location.pathname === '/sign-up';

  return (
    <>
      {!isSignInOrSignUp && <Navbar />}
      
      <Toaster
        position="bottom-right"
        toastOptions={{ duration: 3000 }}
      />
      <Routes>
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/" element={<Products />} />
        <Route path="/sign-in" element={<SignIn/>} />
        <Route path="/sign-up" element={<SignUp/>} />
        <Route path="/cart" element={<PrivateRoute element={<Cart />} />} />
        <Route path="/product/:productId" element={<ProductPage />} />
        <Route path="/orders" element={<PrivateRoute element={<OrdersPage />} />} />
        <Route path="/search/:searchTerm" element={<SearchResultsPage/>} />
      </Routes>
    </>
  );
}

export default App;
