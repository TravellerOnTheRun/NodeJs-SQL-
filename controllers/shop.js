const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
    Product.findAll()
    .then(products => {
        res.render('shop/product-list', { 
            products: products,  
            pageTitle: 'All Products', 
            path: '/products'
        });
    })
    .catch(err => console.log(err));
};

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    //FIND ALL APPROACH
    // Product.findAll({ where: { id: prodId}})
    //     .then(products => {
    //         res.render('shop/product-details', {
    //             product: products[0],
    //             pageTitle: products[0].title,
    //             path:'/products'
    //         });
    //     })
    //     .catch(err => console.log(err));
    Product.findByPk(prodId)
        .then(product => {
            res.render('shop/product-details', {
                product: product,
                pageTitle: product.title,
                path:'/products'
            });
        })
        .catch(err => console.log(err));
};

exports.getIndex = (req, res, next) => {
    Product.findAll()
        .then(products => {
            res.render('shop/index', { 
                products: products,  
                pageTitle: 'Shop', 
                path: '/'
            });
        })
        .catch(err => console.log(err));
};

exports.getCart = (req, res, next) => {
    req.user.getCart()
        .then(cart => {
            return cart.getProducts();
        })
        .then(products => {
            res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Your Cart',
                products: products
            });
        })
        .catch(err => console.log(err));
};

exports.postToCart = (req, res, next) => {
    const prodId = req.body.productId;
    let fetchedCart; 
    let newQty = 1;
    req.user.getCart()
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts({ where: { id: prodId }});
        })
        .then(products => {
            let product;
            if(products.length > 0) {
                product = products[0];
            }
            if(product) {
                const oldQty = product.cartItem.qty;
                newQty = oldQty + 1;
                return product;
            };
            return Product.findByPk(prodId)
        })
        .then(product => {
            return fetchedCart.addProduct(product, { 
                through: { qty: newQty }
            });
        })
        .then(() => {
            res.redirect('/cart')
        })
        .catch(err => console.log(err));
};

exports.postDeleteItemFromCart = (req, res, next) => {
    const prodId = req.body.productId;
    req.user.getCart()
    .then(cart => {
       return cart.getProducts({ where: { id: prodId }}); 
    })
    .then(products => {
        const product = products[0];
        return product.cartItem.destroy();
    })
    .then(result => {
        res.redirect('/cart');
    })
    .catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
    req.user.getOrders({ include: ['products']})
        .then(orders => {
            res.render('shop/orders', {
                path: '/orders',
                pageTitle: 'Your Orders',
                orders: orders
            });
        })
        .catch(err => console.log(err));
};

exports.postOrder = ( req, res, next) => {
    let fetchedCart;
    req.user.getCart()
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts();
        })
        .then(products => {
            return req.user.createOrder()
                .then(order => {
                    order.addProducts(products.map(product => {
                        product.orderItem = { qty: product.cartItem.qty };
                        return product;
                    }));
                })
                .catch(err => console.log(err));
        })
        .then(result => {
           return fetchedCart.setProducts(null);
        })
        .then(() => {
            res.redirect('/orders');
        })
        .catch(err => console.log(err));
};  

// exports.getCheckout = (req, res, next) => {
//     res.render('shop/checkout', {
//         path: '/checkout',
//         pageTitle: 'Checkout'
//     });
// };

