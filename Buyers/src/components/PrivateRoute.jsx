// PrivateRoute.jsx
import React from 'react';
import {Navigate } from 'react-router-dom';

const PrivateRoute = ({ element }) => {
    const isLoggedIn = localStorage.getItem("User") !== null;
    console.log(isLoggedIn)
    if(isLoggedIn) return element;
  return <Navigate to="/sign-in" />;
};

export default PrivateRoute;
