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
app.use(cors());
app.use(cors({
  origin: 'http://localhost:3000'
  // methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
  // allowedHeaders: ['Content-Type', 'Origin', 'X-Requested-With',
  // 'Accept', 'x-client-key', 'x-client-token', 'x-client-secret', 'Authorization'],
  // credentials: true
  }));

// app.use((req, res, next) => {
//   // 👇️ specify CORS headers to send 👇️
//   res.setHeader("Access-Control-Allow-Origin", process.env.REACT_URL);
//   res.setHeader(
//     'Access-Control-Allow-Methods',
//     'POST, PUT, PATCH, GET, DELETE, OPTIONS'
//   );
//   res.setHeader(
//     'Access-Control-Allow-Headers',
//     'X-Requested-With, Content-Type',
//   );
//   res.setHeader('Access-Control-Allow-Credentials', true);
//   next();
// });



app.use(passport.initialize());

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

