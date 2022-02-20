const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const session = require('express-session')
const flash = require('express-flash')
const bodyParser = require('body-parser');
const cors = require('cors')
const path = require('path')
const multer = require('multer');

const port = process.env.PORT || 3000

const storageCustomer = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './views/Customer/image/');
    },
    filename: function(req, file, cb) {
        cb(null, (new Date().toISOString().replace(/:/g, '-')));
    }
});

const storageRestaurant = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './views/Restaurants/image/');
    },
    filename: function(req, file, cb) {
        cb(null, (new Date().toISOString().replace(/:/g, '-')));
    }
});

const {getAllDishes, getAllRestaurants, addCustomer, addRestaurant, getUserDetails, 
    updatePassword, allDishes, addDish, updateDish, deleteDish, getDish, updateProfile, 
    addToCartDB, getCartDishes, updateCartQty, deleteFromCart, addOrder, removeCart, getAllOrders} = require('./src/dbQueries.js')

const initializePassport = require('./passport-config');
const { resolveObjectURL } = require('buffer');

const uploadCustomer = multer({storage: storageCustomer});
const uploadRestaurant = multer({storage: storageRestaurant});

const app = express();

initializePassport(
  passport,
  getUserDetails
)



app.set('view engine', 'ejs');

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use(express.static(path.join(__dirname, '/views')));

app.use(cors({
    origin: '*',
}));
app.use(flash())
app.use(session({
    secret: "suyash",
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())


app.get('/', (req, res) => {
    res.render('index.ejs', {user: req.user});
})

app.get('/cart', checkAuthenticated, (req, res) => {
    if(req.user.type === 'customer')
    {
        res.render('./Customer/CustomerCart.ejs');
    }
    else
        res.redirect('/profile');
})

app.get('/cartdishes', checkAuthenticated, (req, res) => {
    const c_email = req.user.email
    getCartDishes(c_email, (message) => {
        res.json(message);
    })
})

app.post('/cart', (req, res) => {
    if(typeof req.user === 'undefined')
    {
        console.log('true');
        res.json({message: "Please Login"});
    }
    else
    {
        if(typeof req.user !== 'undefined' && req.user.type === 'customer')
        {
            const data = {
                c_email: req.user.email,
                d_id: req.body.d_id,
                d_name: req.body.d_name,
                d_cost: req.body.d_cost,
                rest_id: req.body.rest_id,
            }
            addToCartDB(data, (message) => {
                res.json(message);
            })
        }
        else
        {
            res.json({message: 'Not Allowed'});
        }
    }
})

app.patch('/cart', (req, res) => {
    const data = {
        qty: req.body.qty,
        d_id: req.body.d_id,
        c_email: req.body.c_email,
    }
    updateCartQty(data, (message) => {
        res.json(message);
    })
})

app.delete('/cart', (req, res) => {
    const data = {
        d_id: req.query.dish,
        email: req.user.email
    }
    deleteFromCart(data, (message) => {
        res.json(message);
    })
})

app.get('/dishes', checkAuthenticated, (req, res) => {
    res.render('./Restaurants/RestaurantDishes.ejs', {user: req.user});
})

app.get('/alldishes/:id', (req, res) => {
    allDishes(req.params.id, (response) => {
        res.json(response);
    })
})

app.get('/adddish', checkAuthenticated, (req, res) => {
    if(req.user.type === 'restaurant')
        res.render('./Restaurants/AddDish.ejs', {message: ''});
    else
        res.redirect('/');
})

app.post('/adddish', uploadRestaurant.single('dimage'), (req, res) => {
    const data = {
        rest_id: req.user.id,
        d_name: req.body.dname,
        d_cost: req.body.dcost,
        d_type: req.body.dpreference,
        d_image: (req.file !== undefined) ? ((req.file.path.replace('views\\','')).replace('\\', '/')).replace('\\','/') : '',
    }
    addDish(data, (message) => {
        res.render('./Restaurants/AddDish.ejs', message);
    })
})

app.get('/updatedish', checkAuthenticated, (req, res) => {
    getDish(req.query.dish, (results) => {
        res.render('./Restaurants/update.ejs', {results});
    })
})

app.post('/updatedish', uploadRestaurant.single('dimage'), (req, res) => {
    const data = {
        d_id: req.query.dish,
        d_name: req.body.dname,
        d_cost: req.body.dcost,
        d_type: req.body.dpreference,
        d_image: (req.file !== undefined) ? ((req.file.path.replace('views\\','')).replace('\\', '/')).replace('\\','/') : '',
    }
    updateDish(data, (message) => {
        res.redirect('/updatedish?dish=' + req.query.dish);
    })
})

app.get('/deletedish', (req, res) => {
    deleteDish(req.query.dish, (message) => {
        res.redirect('/dishes');
    })
})

app.get('/orders', checkAuthenticated, (req, res) => {
    if(req.user.type === 'restaurant')
        res.render('./Restaurants/RestaurantOrders.ejs');
    else
    {
        res.render('./Customer/CustomerOrders.ejs');
    }
})

app.get('/allorders', (req, res) => {
    if(req.user.type === 'restaurant')
    {
        getAllOrders(req.user.id, 'restaurant', (message) => {
            res.json(message);
        })
    }
    else
    {
        getAllOrders(req.user.email, 'customer', (message) => {
            res.json(message);
        })
    }
})

app.post('/orders', (req, res) => {
    addOrder(req.user.email, (response) => {
        if(response.message === 'Success'){
            removeCart(req.user.email, (message) => {
                res.redirect('/cart');
            })
        }
    })
})

app.patch('/orders', (req, res) => {

})

app.get('/profile', checkAuthenticated, (req, res) => {
    let flag = (req.query.flag != undefined)?req.query.flag : '';
    if(flag !== '')
        flag = (flag === 'true') ? 'Success' : 'Failure'
    if(req.user.type === 'restaurant')
    {
        getUserDetails(req.user.email, "restaurant", (profile) => {
            res.render('./Restaurants/RestaurantProfile.ejs', {user: profile, message: flag})
        })
    }
    else
    {
        getUserDetails(req.user.email, "customer", (profile) => {
            res.render('./Customer/CustomerProfile.ejs', {user: profile, message: flag});
        })
    }
})

app.post('/cprofile', uploadCustomer.single('cimage'), (req, res) => {
    const data = {
        c_email: req.body.cemail,
        c_name: req.body.cname,
        c_address: req.body.caddress,
        c_phone:req.body.cphone,
        c_image:(req.file !== undefined) ? ((req.file.path.replace('views\\','')).replace('\\', '/')).replace('\\','/') : '',
    }
    updateProfile(data, "customer", (message) => {
        res.redirect('/profile?flag=true');
    })
})

app.post('/rprofile', uploadRestaurant.single('rimage'), (req, res) => {
    const data = {
        r_email: req.body.remail,
        r_name: req.body.rname,
        r_address: req.body.raddress,
        r_image:(req.file !== undefined) ? ((req.file.path.replace('views\\','')).replace('\\', '/')).replace('\\','/') : '',
    }
    updateProfile(data, "restaurant", (message) => {
        res.redirect('/profile?flag=true');
    })
})


app.get('/changepassword', checkAuthenticated, (req, res) => {
    if(req.user.type === 'restaurant')
        res.render('./Restaurants/RestaurantChangePass.ejs', {user: req.user})
    else
    {
        res.render('./Customer/CustomerChangePass.ejs', {user: req.user});
    }

})

app.post('/changepassword', (req, res) => {
    const type = req.user.type;
    if(type === undefined)
    {
        req.json({message: "failure"});
    }
    bcrypt.hash(req.body.newpassword, 10, function(err, npassword){
        if(err){
        }
        const data = {
            type: type,
            email: req.body.email,
            opassword: req.body.oldpassword,
            npassword: npassword,
        }
        updatePassword(data, (response) => {
            res.json(response);
        })
    })
})

app.get('/logout', (req, res) => {
    req.logOut()
    res.redirect('/')
})

app.get('/getalldishes', (req, res) => {
    getAllDishes((result) => {
        res.json(result);
    })
})

app.get('/getallrestaurants', (req, res) => {
    getAllRestaurants((result) => {
        res.json(result);
    })
})

app.get('/customerlogin', checkNotAuthenticated, (req, res) => {
    const message = (req.flash().error) || '';
    res.render("./Customer/CustomerLogin.ejs", {message});
})

app.post('/customerlogin', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/customerlogin',
    failureFlash: true,
}))

app.get('/restaurantlogin', checkNotAuthenticated, (req, res) => {
    const message = (req.flash().error) || '';
    res.render("./Restaurants/RestaurantLogin.ejs", {message});
})

app.post('/restaurantlogin', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/restaurantlogin',
    failureFlash: true,
}))

app.get('/customersignup', (req, res) => {
    res.render("./Customer/CustomerRegistration.ejs", {"message": -1});
})

app.post('/customersignup', uploadCustomer.single('cimage'), (req, res) => {
    bcrypt.hash(req.body.cpassword, 10, function(err, password){
        if(err){
            res.json({
                "message": "User not added"
            })
        }
        const data = {
            name: req.body.cname,
            phone: req.body.cphone,
            preference: req.body.cpreference,
            address: req.body.caddress,
            email: req.body.cemail,
            password: password,
            image: (req.file !== undefined) ? ((req.file.path.replace('views/','')).replace('/', '//')) : '',      
        }
        addCustomer(data, (message) => {
            res.render("./Customer/CustomerRegistration.ejs", {
                "message": 1
            })
        })
    })
})

app.get('/restaurantsignup', (req, res) => {
    res.render("./Restaurants/RestaurantRegistration.ejs", {"message": -1});
})

app.post('/restaurantsignup', uploadRestaurant.single('rimage'), (req, res) => {
    bcrypt.hash(req.body.rpassword, 10, function(err, password){
        if(err){
            res.json({
                "message": "User not added"
            })
        }
        const data = {
            name: req.body.rname,
            address: req.body.raddress,
            email: req.body.remail,
            password: password,
            image: (req.file !== undefined) ? ((req.file.path.replace('views\\','')).replace('\\', '/')).replace('\\','/') : '',    
        }
        addRestaurant(data, (message) => {
            res.render("./Restaurants/RestaurantRegistration.ejs",{
                "message": 1
            })
        })
    })
})

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
    res.redirect('/customerlogin')
}
  
function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }
    next()
}

function selectMulter(req){
    if(req.user.type === 'customer')
    {
        uploadCustomer.single('image');
    }
    uploadRestaurant.single('image');
}

app.listen(port);