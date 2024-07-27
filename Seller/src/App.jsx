import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Button } from "@/components/ui/button"
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import Login from './pages/Login.jsx'
import Signin from './pages/Signin.jsx'
import Home from './pages/Home.jsx'
import { Toaster } from "@/components/ui/toaster"
import Product from './pages/Product.jsx'
import Order from './pages/Order.jsx'
import PrivatePages from './components/comps/PrivatePages.jsx'


function App() {
 

  return (
    <>
    <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path={"/"} element={<PrivatePages element={<Home/>}/>}/>
          <Route path={"/sign-in"} element={<Login/>}/>
          <Route path={"/sign-up"} element={<Signin/>}/>
          <Route path={"/product"} element={<PrivatePages element={<Product/>}/>}/>
          <Route path={"/order"} element={<PrivatePages element={<Order/>}/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
