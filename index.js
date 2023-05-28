const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require("mongoose");
const dotenv = require('dotenv');
const passport = require('passport');
const cookieSession = require("cookie-session");
const passportSetup = require("./middlewares/passport")

// router
const user = require("./router/UserRouter");
const product = require("./router/ProductRouter");
const cart = require("./router/CartRouter");


dotenv.config();
// set the view engine to ejs
app.set('view engine', 'ejs');

app.use(express.json());
app.use(bodyParser.urlencoded({extended: true }));
app.use(cors({
    origin: "http://localhost:3000/",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  }));

app.use(
    cookieSession({ name: "session", keys: ["dailam"], maxAge: 24 * 60 * 60 * 100 })
  );
  
app.use(passport.initialize());
app.use(passport.session());

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

app.use("/auth", user);
app.use("/api/v2", product);
app.use("/api/v2", cart)

app.listen( process.env.PORT , () => {
    console.log(`Listenning to port ${process.env.PORT}`);
})


