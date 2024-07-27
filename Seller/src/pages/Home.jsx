import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import Navbar from '../components/comps/Navbar'
import { HOST_NAME } from '../constants'
import axios from 'axios'
import { useToast } from "@/components/ui/use-toast"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, ArcElement,Tooltip, Legend, RadialLinearScale } from 'chart.js';
import { Bar, Doughnut, PolarArea } from 'react-chartjs-2'
import {
  Card,
} from "@/components/ui/card"
import { Link } from 'react-router-dom'


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  RadialLinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend
);



function Home() {
const [sellerData,setSellerData]=useState();
const [cartData,setCartData]=useState();
const [renewalData,setRenewalData]=useState();
const [salesData,setSalesData]=useState({
  week:[],
  month:[],
  year:[]
})
const { toast } = useToast();
  const instance = axios.create({
    withCredentials: true,
    baseURL: `${HOST_NAME}`,
 
    headers: { 'Content-Type': 'application/json'},
    credentials: 'include',
  })

  useEffect(()=>{
    instance.get("dashboard/getSellerData").then((response)=>{
      setSellerData(response.data.data.data);
      setCartData(response.data.data.data.cartData[0].totalProducts)
      setRenewalData([response.data.data.data.renewalData.week?.[0]?.totalRenewals||0,response.data.data.data.renewalData.month?.[0]?.totalRenewals||0,response.data.data.data.renewalData.year?.[0]?.totalRenewals||0])
      setSalesData({
        week:[(response.data.data.data.salesData.week[0]?.totalSales||0)/1000,(response.data.data.data.salesData.week[0]?.totalOrders||0)],
        month:[(response.data.data.data.salesData.month[0]?.totalSales||0)/1000,response.data.data.data.salesData.month[0]?.totalOrders||0],
        year:[(response.data.data.data.salesData.year[0]?.totalSales||0)/1000,response.data.data.data.salesData.year[0]?.totalOrders||0]
      })
    }).catch((error)=>{
      console.log(error);
      toast({
        description: "Error getting seller data, Please try again !!",
      })
    })
  },[])


  
  const [doughnutData,setDoughnutData] = useState({
  
    labels: ['No. of Products added to Cart'],
    datasets: [
      {
        data: cartData,
        backgroundColor: ['#4BC0C0', 'rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)'],
        borderColor: ['#4BC0C0', 'rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
        borderWidth: 1,
      },
    ],

})


useEffect(()=>{
setDoughnutData({
    
        labels: ['No. of Products added to Cart'],
        datasets: [
          {
            data: [cartData],
            backgroundColor: ['rgba(255, 165, 0,0.2)', 'rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)'],
            borderColor: ['#ffa500', 'rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
            borderWidth: 1,
          },
        ],
    
})
},[cartData])



const [lineChartData,setLineChartData] = useState({
  labels: ["Week","Month","Year"],
  datasets:  [
    {
      data: renewalData,
      backgroundColor: ['rgba(255, 165, 0,0.2)', 'rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)'],
      borderColor: ['#ffa500', 'rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
      borderWidth: 1,
    },
  ],
})
  useEffect(()=>{
      setLineChartData(
          {
              labels: ["Week","Month","Year"],
              datasets: [
                {
                  data: renewalData,
                  backgroundColor: ['rgba(255, 165, 0,0.2)', 'rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)'],
                  borderColor: ['#ffa500', 'rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
                  borderWidth: 1,
                },
              ],
            }
      )
  },[renewalData])
  
  
  const [barChartWeekData,setBarChartWeekData]=useState({
    labels: ["Total Sales","Quantity"],
    datasets: [
      {
        data: salesData.week,
        
        backgroundColor: ['rgba(255, 165, 0,0.2)', 'rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)'],
        borderColor: ['#ffa500', 'rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
        borderWidth: 1,
      },
    ],
  });

  useEffect(()=>{
    setBarChartWeekData({
      labels: ["Total Sales","Quantity"],
        datasets: [
          {
            data: salesData.week,
            
            backgroundColor: ['rgba(255, 165, 0,0.2)', 'rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)'],
            borderColor: ['#ffa500', 'rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
            borderWidth: 1,
          },
        ],
    })
  },[salesData])

  const [barChartMonthData,setBarChartMonthData]=useState({
    labels: ["Total Sales","Quantity"],
    datasets: [
      {
        data: salesData.month,
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        },
        backgroundColor: ['rgba(255, 165, 0,0.2)', 'rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)'],
        borderColor: ['#ffa500', 'rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
        borderWidth: 1,
      },
    ],
  });

  useEffect(()=>{
    setBarChartMonthData({
      labels: ["Total Sales","Quantity"],
        datasets: [
          {
            data: salesData.month,
            options: {
              scales: {
                yAxes: {
                  id:'main-axis',
                  beginAtZero: true,
                  ticks: {
                    stepSize: 10 // this worked as expected
                       }
                }
              }
            },
            backgroundColor: ['rgba(255, 165, 0,0.2)', 'rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)'],
            borderColor: ['#ffa500', 'rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
            borderWidth: 1,
          },
        ],
    })
  },[salesData])
  const [barChartYearData,setBarChartYearData]=useState({
    labels: ["Total Sales","Quantity"],
    datasets: [
      {
        data: salesData.year,
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        },
        backgroundColor: ['rgba(255, 165, 0,0.2)', 'rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)'],
        borderColor: ['#ffa500', 'rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
        borderWidth: 1,
      },
    ],
  });

  useEffect(()=>{
    setBarChartYearData({
      labels: ["Total Sales","Quantity"],
        datasets: [
          {
            data: salesData.year,
            options: {
              scales: {
                yAxes: {
                  id:'main-axis',
                  beginAtZero: true,
                  ticks: {
                    stepSize: 10 // this worked as expected
                       }
                }
              }
            },
            backgroundColor: ['rgba(255, 165, 0,0.2)', 'rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)'],
            borderColor: ['#ffa500', 'rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
            borderWidth: 1,
          },
        ],
    })
  },[salesData])




  return (
  <>
  <Navbar title={"Dashboard"}/>
  <div className='mt-[50px]'>
    <div className='m-3 flex flex-row flex-wrap-reverse  h-1/2 justify-between'>
    <div className='w-2/3 max-sm:w-full m-auto flex flex-wrap justify-between  pl-16 pr-20 max-sm:p-5'>
  <Card className='w-[330px] max-sm:w-full my-5 max-sm:mx-auto p-2'>
          <h2 className='text-center'>Added to Cart</h2>
          <Doughnut data={doughnutData} />
        </Card>
        <Card  className='w-[330px] max-sm:w-full  my-5 max-sm:mx-auto p-2'>
          <h2 className='text-center'>Upcoming Renewals</h2>
          <PolarArea data={lineChartData} />
        </Card>
        </div>
        <div className='flex flex-col max-sm:w-full max-md:w-full m-5 mr-10 max-sm:py-4 max-sm:m-auto  p-auto w-1/4 bg-orange-100 rounded-2xl sm:justify-center'>
        <Card className=' w-3/4 mx-auto'>
          <div className='p-4 flex  max-sm:w-[200px] max-md:w-[400px] '>
          Total Sales (INR) : <b className='text-orange-500'>{salesData.year[0]*1000}</b>
          </div>
        </Card>
        <Link className='mx-auto p-2 bg-orange-400 border-2 border-orange-400 hover:bg-white hover:text-black rounded-lg w-4/5 text-center my-5 text-white' to={"/product"}>Product Panel</Link>
        <Link className='mx-auto p-2 bg-orange-400 border-2 border-orange-400 hover:bg-white hover:text-black rounded-lg w-4/5 text-center my-5 text-white' to={"/order"}> Order Panel</Link>
        </div>
        </div>
        <div className='flex flex-wrap justify-center max-sm:justify-center max-md:justify-center max-md:mx-auto max-md:w-full sm:m-5 max-sm:mx-auto max-sm:w-full'>

        <Card className='w-3/12 max-md:w-5/6 max-sm:w-5/6 my-5 mx-5'>
          <h2 className='text-center' >Total Sales (Week)</h2>
          <Bar data={barChartWeekData}/>
        </Card>
        <Card className='w-3/12 max-md:w-5/6 max-sm:w-5/6 my-5 mx-5'>
          <h2 className='text-center' >Total Sales (Monthly)</h2>
          <Bar data={barChartMonthData}/>
        </Card>
        <Card className='w-3/12 max-md:w-5/6 max-sm:w-5/6 my-5 mx-5'>
          <h2 className='text-center' >Total Sales (Yearly)</h2>
          <Bar data={barChartYearData}/>
        </Card>
        </div>
        
  </div>
  </>
  )
}

export default Home