import express from 'express';
import { isSellerAuth, sellerLogin, sellerLogout } from '../controllers/sellerController.js';
import verifySeller from '../middlewares/authSeller.js';

const sellerRouter = express.Router();

sellerRouter.post('/login', sellerLogin);
sellerRouter.get('/is-auth', verifySeller, isSellerAuth);
sellerRouter.get('/logout', verifySeller, sellerLogout);

export default sellerRouter;