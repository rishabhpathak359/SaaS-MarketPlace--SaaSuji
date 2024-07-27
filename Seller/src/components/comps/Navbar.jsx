/* eslint-disable react/prop-types */
import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import logo from "../../assets/saasuJiLogo.png"
import { CircleUserRound,Power,ShoppingCart } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import axios from 'axios';
import { HOST_NAME } from '../../constants';
import { useToast } from "@/components/ui/use-toast"


const Navbar=(props)=> {
    const navigate = useNavigate();
    const { toast } = useToast();
    const handleLogout = () => {
      const instance = axios.create({
        withCredentials: true,
        baseURL: `${HOST_NAME}`,
     
        headers: { 'Content-Type': 'application/json'},
        credentials: 'include',
      })
      instance.post(`user/logout`).then((response)=>{
        toast({
          description: "Logout Successfull !!",
        })
        navigate("/sign-in",{replace:true})
      }).catch((error)=>{
        console.log(error);
        toast({
          description: "Error logging out user !!",

        })
      })
    }
   
  return (
   <>
    
    <div className='w-full fixed left-0 top-0  bg-orange-400 flex flex-row justify-between text-white' >
        <Link to={"/"}>
        <div className='align-center text-2xl  mt-1.5 m-auto text-center max-sm:ml-4 ml-14'>
    SaaSu Ji
    </div>
    </Link>
    <div className=' text-2xl my-2  w-fit font-bold font-serif   max-sm:mb-0 max-sm:text-xl '>
  
 
    {props.title}
 </div>
 <Popover >
  <PopoverTrigger ><button  className='mr-14 max-sm:mr-4'><CircleUserRound size={40}  color='white'/></button></PopoverTrigger>
  <PopoverContent className='mr-10 w-fit px-10 py-3'>

    <div className='flex flex-col w-fit'><Link to={"/order"} className='m-2 flex'><ShoppingCart color='orange' size={25} className='mr-2'/>Orders</Link><button onClick={handleLogout} className='m-2 flex'><Power color='orange' className='mr-2'/>Logout</button></div>
  </PopoverContent>
</Popover>

       </div>
   </>
  )
}

export default Navbar