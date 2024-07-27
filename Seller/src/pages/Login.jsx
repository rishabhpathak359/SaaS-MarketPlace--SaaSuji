import axios from 'axios';
import { Formik } from 'formik';
import React, { useEffect, useState } from 'react'
import { HOST_NAME } from '../constants';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast"
import { Eye } from 'lucide-react';
import { EyeOff } from 'lucide-react';
import ani from '../assets/ani.json'
import Lottie from 'react-lottie-player'

function Login() {
  const navigate = useNavigate();
  const { toast } = useToast()
  const [passwordVisible,setPasswordVisible]=useState(false);
  useEffect(()=>{
    
    const instance = axios.create({
        withCredentials: true,
        baseURL: `${HOST_NAME}`,
     
        headers: { 'Content-Type': 'application/json'},
        credentials: 'include',
      })

      instance.get('user/getcurrentuser').then((response)=>{
        console.log(response.status)
        if(response.status==200){
          navigate("/",{replace:true});
            
        }
        
      }).catch((error)=>{
        console.log(error)
        // toast({
        //     description:"Error getting user status"
        // })
        
        
        navigate("/sign-in",{replace:true});
      })
},[])
  return (
    <>
    <div className='flex flex-wrap h-screen flex-row max-sm:flex-col'>
      <div className='w-1/2 max-sm:w-full h-screen max-sm:h-1/2 bg-orange-300'>
      <Lottie animationData={ani} className="player w-3/4 h-full align-middle justify-center m-auto"  loop play />
      </div>
      <div className='w-1/2  max-sm:w-full h-screen flex flec-col align-middle justify-center max-sm:h-1/2 '>
        <div className='w-1/2 shadow-2xl flex flex-col p-8 max-sm:p-3 justify-center align-middle  max-sm:w-4/5 h-96 m-auto'>
            <h1 className='text-center text-2xl mb-8 font-semibold'>Welcome Back</h1>
            <Formik
           
       initialValues={{ email: '', password: '' }}
       validate={values => {
         const errors = {};
         if (!values.email) {
           errors.email = 'Email is required';
         } else if (
           !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
         ) {
           errors.email = 'Invalid email address';
         }
         if(!values.password){
          errors.password='Password is required'
         }
         return errors;
       }}
       onSubmit={(values, { setSubmitting }) => {
        const instance = axios.create({
          withCredentials: true,
          baseURL: `${HOST_NAME}`,
       
          headers: { 'Content-Type': 'application/json'},
          credentials: 'include',
        })
         try {
            instance.post(`user/login`,values)
  .then(function (response) {
    // handle success
   console.log(response)
   toast({
    description: "Login Successfull !!",
  })
   navigate("/",{replace:true});
   setSubmitting(false);
  }).catch((error)=>{
    console.log(error)
    toast({
      description: `Unable to login, ${error.message} !!`,
    })
  
    setSubmitting(false);
  })
         } catch (error) {
            console.log(error)
            toast({
              description: `Unable to login, ${error.message} !!`,
            })
            setSubmitting(false);
         }
       }}
     >
       {({
         values,
         errors,
         touched,
         handleChange,
         handleBlur,
         handleSubmit,
         isSubmitting,
         /* and other goodies */
       }) => (
         <form className='flex flex-col font-semibold text-center justify-center' onSubmit={handleSubmit}>
          <label className='font-semibold'   name="email">Email ID</label>
           <input
           className='m-auto p-2  border-orange-300 outline-none w-11/12 border-2 rounded-md  my-1'
             type="email"
             name="email"
             onChange={handleChange}
             onBlur={handleBlur}
             placeholder='Enter your Email ID'
             value={values.email}
           />
           <p className='text-red-500'>
           {errors.email && touched.email && errors.email}
           </p>
           <label className='mt-3 font-semibold' name="password">Password</label>
           <div className='flex flex-row  m-auto align-middle justify-center h-11 w-11/12 rounded-lg border-2 border-orange-300'>
           <input
           className='m-auto p-2 border-0 outline-none w-full rounded-md my-1'
           type={passwordVisible ? 'text' : 'password'}
             name="password"
             placeholder='Enter your password'
             onChange={handleChange}
             
             onBlur={handleBlur}
             value={values.password} 
          />
            <div onClick={()=>{setPasswordVisible(!passwordVisible)}} className='flex align-middle mt-2 mr-2'>
{passwordVisible?<Eye />:<EyeOff />}
</div>
</div>
            <p className='text-red-500'>
           {errors.password && touched.password && errors.password}
           </p>
           <div>
           <button  onClick={()=>{navigate("/sign-up")}} className='mt-5 float-left mx-4 text-orange-400'>{"Sign Up ?"}</button>
           </div>
           <button className=' p-2 px-4 w-11/12  mt-1  border-2 rounded-lg border-orange-300 bg-orange-400 hover:bg-white  m-auto' type="submit" onClick={handleSubmit} disabled={isSubmitting}>
           {isSubmitting?"Processing ..":"Submit"}
           </button>
         </form>
       )}
     </Formik>
        </div>
      </div>
    </div>
    </>
  )
}

export default Login