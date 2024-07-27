import React, { useEffect, useState } from 'react'
import { Progress } from "@/components/ui/progress"
import { Eye } from 'lucide-react';
import { EyeOff } from 'lucide-react';
import { HOST_NAME } from '../constants';
import axios from 'axios';
import { useToast } from "@/components/ui/use-toast"
import { useNavigate } from 'react-router-dom';
import Lottie from 'react-lottie-player';
import ani from '../assets/ani.json'

function Signin() {


  const [passwordVisible,setPasswordVisible]=useState(false);
  const [cnfPasswordVisible,setCnfPasswordVisible]=useState(false);
  const [cnfPassword,setCnfPassword]=useState('');
  const navigate = useNavigate();
  const [formPage,setFormPage]=useState(1);
  const [isLoading , setIsLoading]=useState(false);
  const { toast } = useToast()
  useEffect(()=>{
    setIsLoading(true);
    const instance = axios.create({
        withCredentials: true,
        baseURL: `${HOST_NAME}`,
     
        headers: { 'Content-Type': 'application/json'},
        credentials: 'include',
      })

      instance.get('user/getcurrentuser').then((response)=>{
        if(response.status!=200){
          
            setIsLoading(false);
        }
        else{
           
            setIsLoading(false);
            navigate("/",{replace:true});
        }
      }).catch((error)=>{
        console.log(error)
        // toast({
        //     description:"Error getting user status"
        // })
        
        setIsLoading(false);
        navigate("/sign-up",{replace:true});
      })
},[])
  const [categoryDropdown,setCategoryDropdown]=useState([{key:"Select an option",value:''},
                                                          {key:"E-commerce",value:"E-commerce"},
                                                          {key:'Accounting',value:'Accounting'},
                                                          {key:'Social Media',value:'Social Media'},
                                                          {key:'Education',value:'Education'}
  ])
  const [userData,setUserData]=useState({email:'',password:'',username:'',role:'seller',profile:{firstName:'',lastName:'',address:'',phoneNumber:'',avatar:''},sellerDetails:{businessName:'',businessAddress:'',taxId:'',category:'',website:'',linkedin:''}})
  const handleSubmit = async() =>{
    setIsLoading(true);
    console.log(userData)
    const instance = axios.create({
      withCredentials: true,
      baseURL: `${HOST_NAME}`,
   
      headers: { 'Content-Type': 'application/json'},
      credentials: 'include',
    })

    instance.post('user/register',{userData:userData}).then((response)=>{
console.log(response)
toast({
  description:`User registered successfully !!`
})
setIsLoading(false);
navigate('/sign-in')
    }).catch((error)=>{
      console.log(error);
      toast({
        description:`Error occurred while registering user ${error.message}`
      })
      setIsLoading(false);
    })

  }

  return (
    <>
    <div className='flex flex-wrap h-screen flex-row max-sm:flex-col'>
      <div className='w-1/2 max-sm:w-full h-screen max-sm:h-20 bg-orange-300'>
      <Lottie animationData={ani} className="player w-3/4 h-full align-middle justify-center m-auto"  loop play />

      </div>
      <div className='w-1/2  max-sm:w-full h-screen flex flex-col align-middle  max-sm:h-5/6 '>
        <div className='w-3/5 shadow-2xl flex flex-col p-8 max-sm:p-3    max-sm:w-5/6 h-4/5 max-sm:h-full max-sm:mt-4 m-auto'>
            <h1 className='text-center text-2xl   font-semibold'>Create Account</h1>
            <p className='mb-3 mx-auto'>Fill you details to Get Started</p>
            
{formPage==1&&
<div className='h-3/4'>
  <div className='justify-center float-left'>
  <h1 className='text-center text-xl  mb-2  font-semibold'>Personal Information</h1>
  <div className='flex flex-row m-auto'>
  <div className=' flex flex-col'>
    <label className='font-semibold' name="firstname">First Name</label>
    <input
           className=' p-2  border-orange-300 outline-none w-11/12 border-2 rounded-md  my-1'
             
             name="firstname"
             onChange={(e)=>{setUserData((prev)=>({...prev,profile:{...prev.profile,firstName:e.target.value}}))}}
             
             placeholder='Enter your First Name'
             value={userData.profile.firstName}
           />
  </div>
  <div className=' flex flex-col'>
    <label className='font-semibold' name="firstname">Last Name</label>
    <input
           className=' p-2  border-orange-300 outline-none w-11/12 border-2 rounded-md  my-1'
             
             name="lastname"
             onChange={(e)=>{setUserData((prev)=>({...prev,profile:{...prev.profile,lastName:e.target.value}}))}}
             
             placeholder='Enter your Last name'
             value={userData.profile.lastName}
           />
  </div>
  </div>
  <div className='flex flex-row m-auto'>
  <div className=' flex flex-col'>
    <label className='font-semibold' name="firstname">User Name</label>
    <input
           className=' p-2  border-orange-300 outline-none w-11/12 border-2 rounded-md  my-1'
             
             name="username"
             type='username'
             onChange={(e)=>{setUserData((prev)=>({...prev,username:e.target.value}))}}
             
             placeholder='Enter your UserName'
             value={userData.username}
           />
  </div>
  <div className=' flex flex-col'>
    <label className='font-semibold' name="firstname">Phone Number</label>
    <input
           className=' p-2  border-orange-300 outline-none w-11/12 border-2 rounded-md  my-1'
             
             name="phoneno"
             type='text'
             maxLength={10}                       
             onChange={(e)=>{/^[0-9]+$/i.test(e.target.value)&&setUserData((prev)=>({...prev,profile:{...prev.profile,phoneNumber:e.target.value}}))}}
             
             placeholder='Enter your Phone No.'
             value={userData.profile.phoneNumber}
           />
  </div>
  </div>
  
  <div className=' flex flex-col'>
    <label className='font-semibold' name="email">Email Address</label>
    <input
           className=' p-2  border-orange-300 outline-none mr-4 max-sm:mr-3 border-2 rounded-md  my-1'
             
             name="email"
             type='email'
             onChange={(e)=>{setUserData((prev)=>({...prev,email:e.target.value}))}}
             
             placeholder='Enter your Email ID'
             value={userData.email}
           />
  </div>
  <div className='flex flex-row m-auto'>
  <div className=' flex flex-col'>
    <label className='font-semibold' name="password">Password</label>

    <div className='flex flex-row  my-auto align-middle justify-center h-11 w-11/12 rounded-lg border-2 border-orange-300'>
           <input
           className='m-auto p-2 border-0 outline-none w-full rounded-md my-1'
           type={passwordVisible ? 'text' : 'password'}
             name="password"
             placeholder='Enter your password'
             onChange={(e)=>{setUserData((prev)=>({...prev,password:e.target.value}))}}
             
             
             value={userData.password} 
          />
            <div onClick={()=>{setPasswordVisible(!passwordVisible)}} className='flex align-middle mt-2 mr-2'>
{passwordVisible?<Eye />:<EyeOff />}
</div>
</div>


   
  </div>
  <div className=' flex flex-col'>
    <label className='font-semibold' name="cnfpassword">Confirm Password</label>
    <div className='flex flex-row  my-auto align-middle justify-center h-11 w-11/12 rounded-lg border-2 border-orange-300'>
           <input
           className='m-auto p-2 border-0 outline-none w-full rounded-md my-1'
           type={cnfPasswordVisible ? 'text' : 'password'}
             name="cnfpassword"
             placeholder='Enter your password'
             onChange={(e)=>{setCnfPassword(e.target.value)}}
             
             
             value={cnfPassword} 
          />
            <div onClick={()=>{setCnfPasswordVisible(!cnfPasswordVisible)}} className='flex align-middle mt-2 mr-2'>
{cnfPasswordVisible?<Eye />:<EyeOff />}
</div>
</div>
  

  </div>
  </div>
  </div>
</div>
}
{
  formPage==2&&
  <div className='h-3/4'>
  <div className='justify-center float-left'>
  <h1 className='text-center text-xl  mb-2  font-semibold'>Business Information</h1>
  <div className='flex flex-row m-auto'>
  <div className=' flex flex-col'>
    <label className='font-semibold' name="businessname">Business Name</label>
    <input
           className=' p-2  border-orange-300 outline-none w-11/12 border-2 rounded-md  my-1'
             
             name="businessname"
             onChange={(e)=>{setUserData((prev)=>({...prev,sellerDetails:{...prev.sellerDetails,businessName:e.target.value}}))}}
             
             placeholder='Enter your Business Name'
             value={userData.sellerDetails.businessName}
           />
  </div>
  <div className=' flex flex-col'>
    <label className='font-semibold' name="taxid">Tax ID</label>
    <input
           className=' p-2  border-orange-300 outline-none w-11/12 border-2 rounded-md  my-1'
             
             name="taxid"
             onChange={(e)=>{setUserData((prev)=>({...prev,sellerDetails:{...prev.sellerDetails,taxId:e.target.value}}))}}
             
             placeholder='Enter your Tax ID'
             value={userData.sellerDetails.taxId}
           />
  </div>
  </div>
  
  
  <div className=' flex flex-col'>
    <label className='font-semibold' name="businessAddress">Business Address</label>
    <input
           className=' p-2  border-orange-300 outline-none   mr-4 max-sm:mr-3 border-2 rounded-md  my-1'
             
             name="businessAddress"
             type='text'
             onChange={(e)=>{setUserData((prev)=>({...prev,sellerDetails:{...prev.sellerDetails,businessAddress:e.target.value}}))}}
             
             placeholder='Enter your Business Address'
             value={userData.sellerDetails.businessAddress}
           />
  </div>

  <div className=' flex flex-col'>
    <label className='font-semibold' name="category">Category</label>
    <select            className=' p-2  border-orange-300  outline-none mr-4 max-sm:mr-3 border-2 rounded-md  my-1'
 id="category" value={userData.sellerDetails.category} onChange={(e)=>setUserData((prev)=>({...prev,sellerDetails:{...prev.sellerDetails,category:e.target.value}}))}>
        {categoryDropdown.map((option) => (
          <option className='rounded-lg forced-colors:bg-orange-300' key={option.key} value={option.value}>
            {option.key}
          </option>
        ))}
      </select>
 
  </div>

  


  <div className='flex flex-row m-auto'>
  <div className=' flex flex-col'>
    <label className='font-semibold' name="website">Website</label>

    <input
           className=' p-2  border-orange-300 outline-none mr-4 max-sm:mr-3 w-11/12 border-2 rounded-md  my-1'
             
             name="website"
             type='url'
             onChange={(e)=>{setUserData((prev)=>({...prev,sellerDetails:{...prev.sellerDetails,website:e.target.value}}))}}
             
             placeholder='Enter Website URL'
             value={userData.sellerDetails.website}
           />


   
  </div>
  <div className=' flex flex-col'>
    <label className='font-semibold' name="linkedin">LinkedIn</label>
    <input
           className=' p-2  border-orange-300 outline-none mr-4 max-sm:mr-3 w-11/12 border-2 rounded-md  my-1'
             
             name="linkedIn"
             type='url'
             onChange={(e)=>{setUserData((prev)=>({...prev,sellerDetails:{...prev.sellerDetails,linkedin:e.target.value}}))}}
             
             placeholder='Enter LnkedIn URL'
             value={userData.sellerDetails.linkedin}
           />
  

  </div>
  </div>
  </div>
</div>
}

<div className='flex   flex-row justify-between'>
  { <button onClick={()=>{setFormPage(formPage-1)}} disabled={formPage<=1} className='p-2 px-3 rounded-lg m-2 border-2 border-orange-300 hover:bg-orange-300'>

{'Back'}

  </button>}
  <Progress style={{color:"orange"}} className={'mt-6 w-1/2  text-orange-300 ' }value={100*formPage/2} />
  <button disabled={isLoading}  onClick={()=>{formPage<2&&setFormPage(formPage+1);formPage==2&&handleSubmit()}} className='p-2 px-3 rounded-lg m-2 border-2 border-orange-300 bg-orange-300 hover:bg-white'>
{formPage==2?'Submit':'Next'}
  </button>

</div>

            </div>
            </div>
            
            </div>
            </>
  )
}

export default Signin