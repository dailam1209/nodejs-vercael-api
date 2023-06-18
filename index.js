const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require("mongoose");
const dotenv = require('dotenv');
const passport = require('passport');
const cookieSession = require("cookie-session");
const cookieParser = require("cookie-parser");
const passportSetup = require("./middlewares/passport");
const paypal = require('paypal-rest-sdk');

// router
const user = require("./router/UserRouter");
const product = require("./router/ProductRouter");
const cart = require("./router/CartRouter");
const category = require("./router/CategoryRouter");
const brand = require("./router/BrandRouter");
const Paypal = require("./router/PaypalRouter");

dotenv.config();
paypal.configure({
  "host" : process.env.HOST_PAYPAL ,
  "port" : "",
  "client_id": process.env.CLIENT_ID,
  "client_secret": process.env.SECRET_ID
});
// set the view engine to ejs
app.set('view engine', 'ejs');

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:true,limit:"50mb"}));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors({
    origin: "http://localhost:3001/",
    origin: "*",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  }));

// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept, Authorization"
//   );
//   next();
// });


app.use(passport.initialize());
// app.use(passport.session());

mongoose.connect(process.env.MONGOOSE_URL,
    // {
    //     useNewUrlParser: true,
    //     useUnifiedTopology: true,
    //     useCreateIndex: true,
    //     useFindAndModify: false,
    //   }
      )
    .then(() => {
        console.log("DB seccess connecttion!");
    })
    .catch((err) => {
        console.log(err);
    })


app.get('/', function(req, res) {
  res.render('pages/index');
});


app.use("/api/v2/auth", user);
app.use("/api/v2/product", product);
app.use("/api/v2/cart", cart);
app.use("/api/v2/category", category)
app.use("/api/v2/brand", brand);
app.use("/paypal", Paypal )

app.listen( process.env.PORT , () => {
    console.log(`Listenning to port ${process.env.PORT}`);
})

