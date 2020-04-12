//CORE MODULES
// const path = require('path');

//3D PARTY LIBRARIES
const express = require('express');

const shopController = require('../controllers/shop');

const router = express.Router();

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/products/:productId', shopController.getProduct);

router.get('/cart', shopController.getCart);

router.post('/cart-delete-item', shopController.postDeleteItemFromCart);

router.post('/create-order', shopController.postOrder);

router.post('/add-to-cart', shopController.postToCart);

router.get('/orders', shopController.getOrders);


module.exports = router;
