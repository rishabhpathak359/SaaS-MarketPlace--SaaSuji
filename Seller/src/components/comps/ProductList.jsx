import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { HOST_NAME, SERVER_URL } from '../../constants'
import { useToast } from "@/components/ui/use-toast"
import ReactPaginate from 'react-paginate';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Navbar from './Navbar';
import { Pencil,Trash,Plus,Image,ScanSearch } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"


function ProductList() {
    const [page,setPage] = useState(0);
    const [pageCount, setPageCount] = useState(0);
    const [limit,setLimit] = useState(10);
    const [sellerId,setSellerId] = useState("");
    const [productWebsite,setProductWebsite] = useState("");
    const [totalProduct,setTotalProduct] = useState(0);
    const [data,setData] = useState([]);
    const [updateData,setUpdateData]  = useState({
      productName: "",
      description: "",
      price: 0,
      category: "",
      stock: 0,
      validity:365
    });
    const [newProduct,setNewProduct] = useState({
      productName: "",
      description: "",
      price: 0,
      category: "",
      stock: 0,
      validity:365
    })
    const [newProductImage,setNewProductImage] = useState()
    const [loading,setLoading] = useState(false)
    const { toast } = useToast();
    const instance = axios.create({
      credentials: 'include',
      withCredentials: true,
        baseURL: `${HOST_NAME}`,
      })
      useEffect(()=>{
        
        setLoading(true)
        
        axios.get(`${HOST_NAME}product/getProducts`,{params:{page:page,limit:limit}}).then((response)=>{
          console.log(response);
            setData(response.data.data.products);
            setPageCount(response.data.data.totalPages);
            setTotalProduct(response.data.data.totalProducts);
            console.log(response.data.data.products);
            setLoading(false);
          }).catch((error)=>{
            toast({
                description: "Error getting Products data, Please try again !!",
              })
              setLoading(false);
              console.log(error)
          })
      },[ limit, page,])


      

      
const deleteProduct = async(id) => {
if(id){
  setLoading(true)
       await instance.get(`product/deleteProduct?id=${id}`).then((response)=>{
          const updatedItems = data.filter(item => item._id !== id);
            setData(updatedItems);
            setTotalProduct(totalProduct-1);
            toast({
              description: "Product deleted succesfully !!",
            })
            setLoading(false);
          }).catch((error)=>{
            toast({
                description: "Error deleting Products data, Please try again !!",
              })
              setLoading(false);
              console.log(error)
          })
}
}


     
const handleProductUpdate = async (id) =>{

if(id){
  const object = {"id":id,"updates":updateData}
  await instance.post("product/updateProduct",object).then((response)=>{
  window.location.reload();
      
      toast({
        description: "Product updated succesfully !!",
      })
      setLoading(false);
    }).catch((error)=>{
      toast({
          description: "Error updating Products data, Please try again !!",
        })
        setLoading(false);
        console.log(error)
    })
}
}

const handleProductSubmit = async () => {
  if(newProduct.productName==null || newProduct.description==null || newProduct.category==null || newProduct.price==0 ){
    toast({
      description: "Some fields are empty, Please try again !!",
    })
  }
  else {
    setLoading(true)
    try {
      const formData = new FormData();
    formData.append('image', newProductImage);
    formData.append('productName',newProduct.productName);
    formData.append('description',newProduct.description);
    formData.append('price',newProduct.price);
    formData.append('category',newProduct.category);
    formData.append('stock',newProduct.stock);
    formData.append('validity',newProduct.validity);
       await instance.post(`${HOST_NAME}product/createProduct`,formData)
    .then(function (response) {
    // handle success
    console.log(response)
    window.location.reload()
    toast({
      description: response.data.message
    })

    
    setLoading(false);
    }).catch((error)=>{
    console.log(error)
    toast({
      description: error.message
    })
    setLoading(false);
    })
     } catch (error) {
        console.log(error)
        toast.error(error.message)
        setLoading(false);
     }
  }
}
    const scrapeWebsite= async()=>{
  if(!productWebsite){
  toast.error("Please enter Product Website URL to fetch data !!")
  }
  else{
    try {
    setLoading(true);
      axios.get(`${SERVER_URL}scrape?url=${productWebsite}`).then((response)=>{
      const scrapedData = response.data;
      const title = scrapedData.title;
      const description = scrapedData.description;
      setNewProduct((prev)=>({...prev,productName:title})),
      setNewProduct((prev)=>({...prev,description:description}))
      setLoading(false)
      }).catch((error)=>{
         console.log(error)
    toast({
      description: error.data
    })
    setLoading(false);})
    } catch (error) {
      console.log(error)
        toast.error(error.message)
        setLoading(false);
    }
    }
    }

  return (
    <div>
    <Navbar title={"Products Page"}/>
    <div className='flex justify-end m-3 p-2 mt-[50px]'>
    <Dialog>
      <DialogTrigger asChild>
      <button className='flex p-2 rounded-lg hover:bg-white bg-orange-400 border-2 border-orange-400'><Plus size={25} color='black'/>  Add Product</button>

      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Product</DialogTitle>
          <DialogDescription>
          Fill in details to add a new, accurate product listing.
          </DialogDescription>
        </DialogHeader>
       <div className='flex flex-col'>
       <div className='m-auto w-fit'>
  <label htmlFor="files" className='text-orange-400 hover:cursor-pointer'>
  { newProductImage&& 
  <Drawer>
  <DrawerTrigger>            <img width={"45"} height={"45"}  src={URL.createObjectURL(newProductImage)} alt='avatar'/>
  </DrawerTrigger>
  <DrawerContent>
    <DrawerHeader>
      <DrawerTitle>Preview</DrawerTitle>
      <DrawerDescription className='flex justify-center'> <img width={"400px"}   src={URL.createObjectURL(newProductImage)} alt='avatar'/></DrawerDescription>
    </DrawerHeader>
    <DrawerFooter>
      <div className='flex align-middle justify-end'>
    <DrawerClose className='m-2 mr-6 mt-[-8px]'>
        <button className=' border-2 border-orange-400 hover:bg-white  p-2 rounded-lg hover:cursor-pointer'>Close</button>
        </DrawerClose>
    <div>
    <label htmlFor="files" className='bg-orange-400 border-2   border-orange-400 hover:bg-white  p-2 rounded-lg hover:cursor-pointer'>Change Picture</label><input onChange={(e)=>{setNewProductImage(e.target.files[0])}} accept='image/*' 
        id="files" className='hidden' type="file"/></div>
     </div>
    </DrawerFooter>
  </DrawerContent>
</Drawer>

            }{!newProductImage&&
    <Image size={50}  />
            }
  </label>
  <input onChange={(e)=>{setNewProductImage(e.target.files[0])}} accept='image/*' 
        id="files" className='hidden' type="file"/>
</div>
<label htmlFor='productWebsite'>Product Website</label>
<div className='flex flex-row'>
  <input
             className='m-auto p-2  border-orange-300 outline-none w-full mr-3 border-2 rounded-md  my-1'
             name="productWebsite"
             onChange={(e)=>setProductWebsite(e.target.value)}
             
             placeholder='Enter Product Website'
             value={productWebsite}
  />
<button className='text-orange-400' onClick={scrapeWebsite}>
  <ScanSearch size={40}/>
</button>
</div>
        <label htmlFor='productName'>Name</label>
        <input
           className='m-auto p-2  border-orange-300 outline-none w-full border-2 rounded-md  my-1'
            
             name="productName"
             onChange={(e)=>setNewProduct((prev)=>({...prev,productName:e.target.value}))}
             
             placeholder='Enter Product Name'
             value={newProduct.productName}
           />
           <label htmlFor='description'>Description</label>
        <input
           className='m-auto p-2  border-orange-300 outline-none w-full border-2 rounded-md  my-1'
            
             name="description"
             onChange={(e)=>setNewProduct((prev)=>({...prev,description:e.target.value}))}
             type='text'
             placeholder='Enter Product Description'
             value={newProduct.description}
           />
           <label htmlFor='category'>Category</label>
        <input
           className='m-auto p-2  border-orange-300 outline-none w-full border-2 rounded-md  my-1'
            
             name="category"
             onChange={(e)=>setNewProduct((prev)=>({...prev,category:e.target.value}))}
             type='text'
             placeholder='Enter Product Category'
             value={newProduct.category}
           />
            <label htmlFor='price'>Price</label>
           <input
           className='m-auto p-2  border-orange-300 outline-none w-full border-2 rounded-md  my-1'
            
             name="price"
             onChange={(e)=>setNewProduct((prev)=>({...prev,price:e.target.value}))}
             type='tel'
             placeholder='Enter Price'
             value={newProduct.price}
           />
           <label htmlFor='validity'>Validity (in days)</label>
           <input
           className='m-auto p-2  border-orange-300 outline-none w-full border-2 rounded-md  my-1'
            
             name="validity"
             onChange={(e)=>setNewProduct((prev)=>({...prev,validity:e.target.value}))}
             type='tel'
             placeholder='Enter Price'
             value={newProduct.validity}
           />
           <label htmlFor='stock'>Stock</label>
           <input
           className='m-auto p-2  border-orange-300 outline-none w-full border-2 rounded-md  my-1'
            
             name="stock"
             onChange={(e)=>setNewProduct((prev)=>({...prev,stock:e.target.value}))}
             type='tel'
             placeholder='Enter Stock'
             value={newProduct.stock}
           />
<button className=' p-2 px-4 w-11/12  mt-1   border-2 rounded-lg border-orange-400 bg-orange-400 hover:bg-white  m-auto' onClick={handleProductSubmit} disabled={loading}>
           {loading?"Processing ..":"Submit"}
           </button>    
    </div>
      </DialogContent>
    </Dialog>
    </div>
    <Table className="m-auto p-5 w-11/12">
  <TableCaption>A list of all your Products</TableCaption>
  <TableHeader>
    <TableRow>
    <TableHead className="w-[50px] text-center">Action</TableHead> 
      <TableHead className="w-[200px] text-center">Product</TableHead>
      <TableHead className="text-center">Description</TableHead>
      <TableHead className="w-[100px] text-center">Category</TableHead>
      <TableHead className=" text-center">Price</TableHead>
      <TableHead className=" text-center">Validity</TableHead>
      <TableHead className="text-center">Stock</TableHead>
      <TableHead className="w-[150px] text-center">Seller</TableHead>
      <TableHead className="w-[170px] text-center">Created At</TableHead>
      <TableHead className="w-[170px] text-center">Updated At</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
  {data.map((product) => (
    
          <TableRow key={product._id}>
            <TableCell className="text-center flex justify-between">
            <AlertDialog>
  <AlertDialogTrigger><Trash color='red' size={25}/></AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone. This will permanently delete your product details
        and remove your data from our servers.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction onClick={(e)=>{deleteProduct(product._id)}}>Continue</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>


<Dialog>
  <DialogTrigger><Pencil onClick={(e)=>{
    setUpdateData({
      productName: product.productName,
      description: product.description,
      price: product.price,
      category: product.category,
      validity:product.validity,
      stock: product.stock
    })
  }} className='ml-2' size={25} color='orange'/></DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Are you absolutely sure?</DialogTitle>
      <DialogDescription>
        This action cannot be undone. This will permanently update your product
         data from our servers.
      </DialogDescription>
    </DialogHeader>
        <div className='flex flex-col'>
      
        <label htmlFor='productName'>Name</label>
        <input
           className='m-auto p-2  border-orange-300 outline-none w-full border-2 rounded-md  my-1'
            
             name="productName"
             onChange={(e)=>setUpdateData((prev)=>({...prev,productName:e.target.value}))}
             
             placeholder='Enter Product Name'
             value={updateData.productName}
           />
           <label htmlFor='description'>Description</label>
        <input
           className='m-auto p-2  border-orange-300 outline-none w-full border-2 rounded-md  my-1'
            
             name="description"
             onChange={(e)=>setUpdateData((prev)=>({...prev,description:e.target.value}))}
             type='text'
             placeholder='Enter Product Description'
             value={updateData.description}
           />
           <label htmlFor='category'>Category</label>
        <input
           className='m-auto p-2  border-orange-300 outline-none w-full border-2 rounded-md  my-1'
            
             name="category"
             onChange={(e)=>setUpdateData((prev)=>({...prev,category:e.target.value}))}
             type='text'
             placeholder='Enter Product Category'
             value={updateData.category}
           />
            <label htmlFor='price'>Price</label>
           <input
           className='m-auto p-2  border-orange-300 outline-none w-full border-2 rounded-md  my-1'
            
             name="price"
             onChange={(e)=>setUpdateData((prev)=>({...prev,price:e.target.value}))}
             type='tel'
             placeholder='Enter Price'
             value={updateData.price}
           />
           <label htmlFor='validity'>Validity (in Days)</label>
           <input
           className='m-auto p-2  border-orange-300 outline-none w-full border-2 rounded-md  my-1'
            
             name="validity"
             onChange={(e)=>setUpdateData((prev)=>({...prev,validity:e.target.value}))}
             type='tel'
             placeholder='Enter Validity'
             value={updateData.validity}
           />
           <label htmlFor='stock'>Stock</label>
           <input
           className='m-auto p-2  border-orange-300 outline-none w-full border-2 rounded-md  my-1'
            
             name="stock"
             onChange={(e)=>setUpdateData((prev)=>({...prev,stock:e.target.value}))}
             type='tel'
             placeholder='Enter Stock'
             value={updateData.stock}
           />
<button className=' p-2 px-4 w-11/12  mt-1   border-2 rounded-lg border-orange-400 bg-orange-400 hover:bg-white  m-auto' onClick={(e)=>{handleProductUpdate(product._id)}} disabled={loading}>
           {loading?"Processing ..":"Submit"}
           </button>    
    </div>
  
  </DialogContent>
</Dialog>

                  </TableCell>
            <TableCell className="text-center">{product.productName}</TableCell>
            <TableCell className="text-center">{product.description}</TableCell>
            <TableCell className="text-center">{product.category}</TableCell>
            <TableCell className="text-center">{product.price}</TableCell>
            <TableCell className="text-center">{product.validity}</TableCell>
            <TableCell className="text-center">{product.stock}</TableCell>
            <TableCell className="text-center">{product.seller.email}</TableCell>
            <TableCell className="text-center">{new Date(product.createdAt).toLocaleString()}</TableCell>
            <TableCell className="text-center">{new Date(product.updatedAt).toLocaleString()}</TableCell>
           </TableRow>
    
        ))}
   
  </TableBody>
</Table>

<div className='flex flex-row  m-2 px-10 max-sm:px-5 h-max justify-between'>
<div> <button disabled={!page>0} onClick={(e)=>{page>0?setPage(page-1):""}} className='p-2 px-3  bg-orange-400 text-black border-2 border-orange-400   hover:bg-white rounded-lg'>Prev</button></div>
   <div className='flex align-middle text-center h-full'>Product {page*limit+1} - {totalProduct<page*limit+limit?totalProduct:page*limit+limit} of {totalProduct} <select className='mx-3' onChange={(e)=>{setLimit(e.target.value)}}>
    <option  value={"10"}>10</option>
    <option value={"30"}>30</option>
    <option value={"50"}>50</option>
    <option value={"100"}>100</option>
    </select></div>
<div><button disabled={Math.ceil(totalProduct/limit)<=page+1} onClick={(e)=>{Math.ceil(totalProduct/limit)>page+1?setPage(page+1):""}} className='p-2 px-3 text-black  bg-orange-400 hover:bg-white border-2 border-orange-400  rounded-lg'>Next</button></div>
</div>
  </div>

  )
}

export default ProductList