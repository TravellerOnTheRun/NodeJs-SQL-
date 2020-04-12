const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
// const expresshbs = require('express-handlebars');

//Models and Controllers
const pageNotFoundController = require('./controllers/404');
const sequelize = require('./utility/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');




const app = express();

//Setting a global configuration value
// app.engine('hbs', expresshbs({
//     layoutsDir: 'views/handlebars/layout',
//     defaultLayout: 'main-layout',
//     extname: 'hbs'
// }));

//Seeting Up the Templating Engine
app.set('view engine', 'ejs');
app.set('views', './views/ejs');

//Routes
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findByPk(1)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(pageNotFoundController.error);

//ASSOSIATIONS & RELATIONS
Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE'});
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem});

// Overwriting the tables
// sync({ force: true })

sequelize.sync()
    .then(result => {
        return User.findByPk(1);  
}).then(user => {
    if(!user) {
        return User.create({ name: 'Betty', email: 'test@test.com'});
    }
    return user;
}).then(user => {
    // console.log(user);
    return user.createCart();
})
.then(cart => {
    app.listen(3000);
})
.catch(err => console.log(err));

