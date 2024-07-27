import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addToCart, createOrder, getCart, getOrderById, getOrdersBySeller, getOrdersByUser, getOrderStatisticsBySeller, verifyPayment } from "../controllers/order.controller.js";


const orderRouter = Router()
orderRouter.route("/addToCart").post(
   verifyJWT,
   addToCart
  );
  orderRouter.route("/getCart").get(
    verifyJWT,
    getCart
  );
  orderRouter.route("/createOrder").post(
    verifyJWT,
    createOrder
  )
  orderRouter.route("/getOrderById").get(
    verifyJWT,
    getOrderById
  );
  orderRouter.route("/getOrdersByUser").get(
    verifyJWT,
    getOrdersByUser
  )
  orderRouter.route("/getOrdersBySeller").get(
    verifyJWT,
    getOrdersBySeller
  )
  orderRouter.route("/getOrderStatistics").get(
    verifyJWT,
    getOrderStatisticsBySeller
  )
  orderRouter.route("/verifyPayment").post(
    verifyJWT,
    verifyPayment
  )

  export {orderRouter}