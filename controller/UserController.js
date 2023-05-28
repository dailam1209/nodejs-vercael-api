const User = require("../models/UserModel");
const bcrypt = require('bcrypt');
const cloudinary = require("cloudinary");
const sendEmail = require("../untils/sendEmail");
const sendToken = require("../untils/jwtToken");
const { default: ErrHandle } = require("../untils/ErrHandle");


// register
exports.register = async (req, res) => {
    try {
        const  { username, email, password, article_image} = req.body;

        const user = await User.findOne({ email });
        if(user) {
            res.status(400).json({
                success: false,
                message: "User already exists"
            })
        }
        // const myCloud = await cloudinary.v2.uploader.upload(avatar, {
        //     folder: "avatars",
        //   });
        user = await User.create({
            username,
            email,
            password: bcrypt.hashSync(password, 10),

            article_image
            
        });

        // res.status(200).json({
        //     success: true,
        //     user
        // })

        sendToken( user, 200, res);


    }

    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
};




// login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if(!email || !password) {
            res.status(400).json({
                success: false,
                message: 'Please enter the email and password'
            });
        }
        if(!user) {
            res.status(400).json({
                success: false,
                message: 'Request Fail'
            });
        }


        bcrypt.compare(password, user.password , function(err, result) {
            if(err)  {
                res.status(401).json({
                    success: false,
                    message: e.message
                    
                })
            }
            // if(result) {
            //     let jwtSecretKey = process.env.JWT_SECRET_KEY;
            //     let data = {
            //         time: Date(),
            //         userId: 12,
            //     }
            //     const accessToken = jwt.sign(data, jwtSecretKey);
            //     const { ...others} = user._doc;
            //     res.status(200).json({...others, accessToken});
            // } else {
            //     return res.status(401).json({
            //         success: false,
            //         message: 'Please again the email and password'
            //     });
                
            // }

            sendToken( user, 200, res);
        });

    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
            
        })
    }
}


//logout 



// forgot password
exports.forgotpassword = async (req, res) => {

    const user = await User.findOne({ email: req.body.email });
    if(!user) {
        res.status(401).json({
            success: false,
            message: 'No email matched'
        })
    }
   const resetToken = await user.getResetToken();

   await user.save({
    validateBeforeSave: false
   });

   const resetPasswordUrl = `${req.protocol}://${req.get("host")}/password/reset/${resetToken}`

   const message = `Your password reset token is: \n\n ${resetPasswordUrl}`


   // send options
   try {
    await sendEmail( {
        email: user.email,
        subject: `Password`,
        message
    });
    res.status(200).json({
        success: true,
        message: `Email sent to ${user.email} succesfully`
    });

   }
   catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordTime = undefined;
    await user.save({
     validateBeforeSave: false
    });
    res.status(500).json({
        success: false,
        message: err.message
    })
   }
};

// Reset Password
exports.resetPassword = async (req, res) => {

    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.param.token)
        .digest("hex");

    const user = User.findOne({
        resetPasswordToken,
        resetPasswordTime: { $gt: Date.now()}
    });

    if(!user) {
        res.status(400).json({
            success: false,
            message: 'Reset password false'
        })
    }

    if( req.body.password !== req.body.confirPassword) {
        res.status(400).json({
            success: false,
            message: 'Password is not matched with the new password'
        })
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordTime = undefined;

    await user.save();

    sendToken(user, 200, res);
}

//  Get user Details
exports.userDetails = async (req, res, next) => {
    const user = await User.findById(req.user.id);
  
    res.status(200).json({
      success: true,
      user,
    });
};

// Update user Password

exports.updatePassword = async (req, res, next) => {
    const user = await User.findOne( req.user.id);
    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if(!isPasswordMatched) {
        return next(
            ErrHandle("Old Password is incorrect", 400, res)
        )
    } 
    if(req.body.newPassword !== req.body.confirPassword) {
        return next(
            ErrHandle("Password not matched with each other", 400, res)
        )
    }

    user.password = req.body.newPassword;

    await user.save();
    sendToken(user, 200, res);

};

// update profile
exports.updateProfile = async (req, res, next) => {
    const newuserData = {
        name: req.body.name,
        email: req.body.email
    }
    if(req.body.article_image !== '') {
        const user = await User.finndById(req.user.id);

        user.article_image = user.body.article_image;
    }

    const user = await User.findByIdAndUpdate(req.user.id, newuserData, {
        new: true,
        runValidators: true,
        userFindAndModify: false,
    });

    res.status(200).json({
        success: true,
    })
};

// get all user -- admin

exports.getAllUser = async (req, res, next) => {
    const users = User.find();

    res.status(200).json({
        success: true,
        users
    })
};


//get single user --admin
exports.getSingleUser = async (req, res, next) => {
    const user= User.findById(req.param.id);

    if(!user) {
        return next(
            ErrHandle("User is not found with this id", 400, res)
        )
    }

    res.status(200).json({
        success: true,
        user
    })
};

// delete user --admin
exports.deleteUser = async (req, res, next) => {
    const user = User.findById(req.param.id);

    if(!user) {
        return next(
            ErrHandle("User is not found with this id", 400, res)
        )
    }
    await user.remove();

    res.status(200).json({
        success: true,
        message: "User delete successfully"
    })
};

//change user --admin
exports.changeUser = async (req, res, next) => {
    const newuserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    };

    const user = User.findByIdAndUpdate( user.param.id, newuserData,
        {
            new: true,
            runValidators: true,
            userFindAndModify: false
        });

    res.status(200).json({
        success: true,
        user
    })


}
