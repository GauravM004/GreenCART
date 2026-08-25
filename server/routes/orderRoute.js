import express from 'express';
import authenticateUser from '../middlewares/authUser.js';
import { getAllOrders, getUserOrders, placeOrderCOD, placeOrderRazorpay, verifyRazorpayPayment, updateOrderStatus, submitOrderRating } from '../controllers/orderController.js';
import verifySeller from '../middlewares/authSeller.js';

const orderRouter = express.Router();

// Specific routes first (before parameter routes)
orderRouter.post('/cod', authenticateUser, placeOrderCOD)
orderRouter.post('/razorpay', authenticateUser, placeOrderRazorpay)
orderRouter.post('/razorpay/verify', authenticateUser, verifyRazorpayPayment)
orderRouter.get('/user', authenticateUser, getUserOrders)
orderRouter.get('/seller', verifySeller, getAllOrders)

// Parameter routes after specific routes
orderRouter.put('/:orderId/status', verifySeller, updateOrderStatus)
orderRouter.post('/:orderId/rating', authenticateUser, submitOrderRating)

export default orderRouter;