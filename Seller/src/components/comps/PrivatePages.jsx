import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast"
import { HOST_NAME } from '../../constants';
import axios from 'axios';


function PrivatePages({element}) {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [loggedIn,setLoggedIn]=useState(false);
    const [loading,setLoading]=useState(true);
    useEffect(()=>{
        setLoading(true);
        const instance = axios.create({
            withCredentials: true,
            baseURL: `${HOST_NAME}`,
         
            headers: { 'Content-Type': 'application/json'},
            credentials: 'include',
          })

          instance.get('user/getcurrentuser').then((response)=>{
            if(response.status==200){
                setLoggedIn(true);
                setLoading(false);
            }
            else{
                setLoggedIn(false);
                setLoading(false);
                navigate("/sign-in",{replace:true});
            }
          }).catch((error)=>{
            console.log(error)
            toast({
                description:"Error getting user status"
            })
            setLoggedIn(false);
            setLoading(false);
            navigate("/sign-in",{replace:true});
          })
    },[])
  return(
    !loggedIn?<div>Loading ...</div>:element
    
  )
  
}

export default PrivatePages