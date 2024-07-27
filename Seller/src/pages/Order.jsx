import React, { useEffect, useState } from 'react'
import { Line, Bar, PolarArea,Doughnut  } from 'react-chartjs-2';
import axios from 'axios';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, ArcElement,Tooltip, Legend, RadialLinearScale } from 'chart.js';
import { HOST_NAME } from '../constants';
import {
    Card,
  } from "@/components/ui/card"
import Navbar from '../components/comps/Navbar';



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

function Order() {
  const [totalSales,setTotalSales] = useState([]);
  const [totalOrders,setTotalOrders] = useState([]);
  const [totalQuantity,setTotalQuantity] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading,setLoading] = useState(false);
  const { toast } = useToast();
  const instance = axios.create({
    credentials: 'include',
    withCredentials: true,
      baseURL: `${HOST_NAME}`,
      headers: { 'Content-Type': 'application/json'},
      
    })

  useEffect(() => {
    const fetchData = async () => {
        setLoading(true);
        instance.get(`order/getOrderStatistics`).then((response)=>{
            console.log(response)
           
                setTotalSales([response.data.data[0].totalSales]);
                setTotalOrders([response.data.data[0].totalOrders]);
                setTotalQuantity([response.data.data[0].totalQuantity]); 
            
            
            setLoading(false);
        }).catch((error)=>{
            console.log(error);
            toast({
                description: "Error getting Order data, Please try again !!",
              })
              setLoading(false);
        })

      
}
fetchData();
},[])


useEffect(() => {
    const fetchOrders = async () => {
        setLoading(true);
      try {
        const response = await instance.get('order/getOrdersBySeller');
        setOrders(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast({
            description: "Error getting Order data, Please try again !!",
          })
          setLoading(false);
      }
    };

    fetchOrders();
  }, []);



  const [barChartData,setBarChartData]=useState({
    labels: ["Total Sales"],
    datasets: [
      {
        label: 'Total Sales',
        data: totalSales,
        backgroundColor: '#4BC0C0',
        borderColor: '#4BC0C0',
        borderWidth: 1,
    
      },
    ],
  });

  useEffect(()=>{
    setBarChartData({
        labels: ["Total Sales"],
    datasets: [
      {
        label: 'Total Sales',
        data: totalSales,
        backgroundColor: 'rgba(255, 165, 0,0.2)',
        borderColor: '#db9d00',
        borderWidth: 1,
      },
    ],
    })
  },[totalSales])
  const [lineChartData,setLineChartData] = useState({
    labels: ["1","2"],
    datasets: [
      {
        label: 'Total Orders',
        data:totalOrders,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
      {
        label: 'Total Quantity',
        data: totalQuantity,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  })
    useEffect(()=>{
        setLineChartData(
            {
                labels: ["Total Orders","Total Quantity"],
                datasets: [
                  {
                    label: 'Total Orders',
                    data: totalOrders,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1,
                  },
                  {
                    label: 'Total Quantity',
                    data: totalQuantity,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1,
                  },
                ],
              }
        )
    },[totalQuantity,totalOrders])
    
    const [doughnutData,setDoughnutData] = useState({
  
            labels: ['Total Sales', 'Total Orders', 'Total Quantity'],
            datasets: [
              {
                data: [
                totalSales,
                totalOrders,
                totalQuantity
                ],
                backgroundColor: ['#4BC0C0', 'rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)'],
                borderColor: ['#4BC0C0', 'rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
                borderWidth: 1,
              },
            ],
       
    })


    useEffect(()=>{
        setDoughnutData({
            
                labels: ['Total Sales', 'Total Orders', 'Total Quantity'],
                datasets: [
                  {
                    data: [
                       totalSales/1000,
                        totalOrders,
                        totalQuantity
                    ],
                    backgroundColor: ['rgba(255, 165, 0,0.2)', 'rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)'],
                    borderColor: ['#ffa500', 'rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
                    borderWidth: 1,
                  },
                ],
            
        })
    },[totalSales,
        totalOrders,
        totalQuantity])

  return (
    <>
   
    <Navbar title={"Orders Page"}/>
     <div className='flex flex-row flex-wrap ' style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '10px',marginTop:"40px" }}>
        <Card className='w-[600px] max-sm:w-5/6 my-5'>
          <h2 className='text-center' >Total Sales</h2>
          <Bar data={barChartData}/>
        </Card>
        <Card  className='w-[300px] max-sm:w-5/6 my-5'>
          <h2 className='text-center'>Total Orders and Quantity</h2>
          <PolarArea data={lineChartData} />
        </Card>
        <Card className='w-[300px] max-sm:w-5/6 my-5'>
          <h2 className='text-center'>Overview</h2>
          <Doughnut data={doughnutData} />
        </Card>
      </div>
      <div className='my-10 mx-5'>
      <Table className="m-auto p-5 w-11/12">
  <TableCaption>A list of all your Orders</TableCaption>
  <TableHeader>
    <TableRow>
    <TableHead className="w-[50px] text-center">Order ID</TableHead> 
      <TableHead className="w-[200px] text-center">Product Name</TableHead>
      <TableHead className="text-center">Price</TableHead>
      <TableHead className="w-[100px] text-center">Quantity</TableHead>
      <TableHead className=" text-center">Total Price</TableHead>
      <TableHead className="text-center">Payment Status</TableHead>
      <TableHead className="w-[170px] text-center">Created At</TableHead>
      
    </TableRow>
  </TableHeader>
  <TableBody>
  {orders.map((order) => (
    <TableRow key='order._id'>
<TableCell className="text-center">{order._id}</TableCell>
              <TableCell className="text-center">{order.productDetails.productName}</TableCell>
              <TableCell className="text-center">{order.productDetails.price}</TableCell>
              <TableCell className="text-center">{order.totalQuantity}</TableCell>
              <TableCell className="text-center">{order.productDetails.price*order.totalQuantity}</TableCell>
              <TableCell className="text-center">{order.paymentStatus}</TableCell>
              <TableCell className="text-center">{new Date(order.createdAt).toLocaleString()}</TableCell>
    </TableRow>
    
))}
   
</TableBody>
</Table>
      </div>
    </>
  )
}

export default Order