const User = require("../models/UserModel");
const bcrypt = require('bcrypt');
const crypto = require("crypto");
const cloudinary = require("cloudinary");
const sendEmail = require("../untils/sendEmail");
const sendToken = require("../untils/jwtToken");
const ErrHandle  = require("../untils/ErrHandle");
const gennerCode = require("../untils/genercode");
const validateMongoDbId = require("../untils/validateMongooseDbId");


// register -> ok
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
        else {

            let newUser = await User.create({
                username,
                email,
                password: bcrypt.hashSync(password, 10),
    
                article_image
                
            });
    
            sendToken( newUser, 200, res);
        }


    }

    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
};

// login  -> ok
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if(!email || !password) {
            return next(
                ErrHandle("Please enter the email and password",400, res)
                )
        }

        else {

            const user = await User.findOne({ email });
            
            if(!user) {
                return next(
                    ErrHandle("Email or Password no match",400, res)
                    )
            }
    
            const match = await bcrypt.compare(password, user.password);
            if(match) {
                sendToken( user, 200, res);
            }
            else {
                return next(
                    ErrHandle("Email or Password no match 1",401, res)
                    )
            }
        }

    }
    catch (err) {
        return next(
            ErrHandle(err.message,500, res)
            )
        
    }
}


//logout  -> ok

exports.logout = async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        message: "LogOut Success!"
    })
}


// forgot password -> ok
exports.forgotpassword = async (req, res, next) => {

    const { email } = req.body;

    const user = await User.findOne({ email });
    if(!user) {
        console.log("email", email);
        return next(
            ErrHandle("Not found email matched",400, res)
            )
    }
//    const resetToken = user.getResetToken();
   const resetToken = crypto.randomBytes(20).toString("hex");

    user.resetPasswordToken = crypto.createHash("sha256")
                                    .update(resetToken)
                                    .digest("hex");

    user.resetPasswordTime = Date.now() + 15 * 60 * 1000;
    user.code = gennerCode(6);

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
        code: user.code,
        refreshToken: resetToken,
        message
    });
    res.status(200).json({
        success: true,
        refreshToken: resetToken,
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

exports.checkCode = async(req, res, next) => {
    try {
        // const { code } = req.params;
        const { email, code } = req.body;
        const user = await User.findOne({ email });
        if(!user) {
            return next(
                ErrHandle("Not found email matched",400, res)
                )
        }
        if(user.code === code) {
            user.code = "";
            await user.save({
                validateBeforeSave: false
               });

            res.status(200).json({
                success: true,
                message: "Have match code"
            })
        }


    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }

}

exports.deleteCode = async(req, res, next) => {
    try {
        const { email  } = req.body;
        const user = await User.findOne({ email });
        if(!user) {
            return next(
                ErrHandle("Not found email matched",400, res)
                )
        }
        if(user.code === code) {
            user.code = "";
            await user.save({
                validateBeforeSave: false
               });

            res.status(200).json({
                success: true,
                message: "Delete Code"
            })
        }


    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }

}

// Reset Password -> ok
exports.resetpassword = async (req, res) => {

    try {
        const { token } = req.query;
        console.log('token', token);
        const resetPasswordToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");
    
    
        console.log(resetPasswordToken);
        const user = User.findOne({
            resetPasswordToken: resetPasswordToken,
            resetPasswordTime: { $gt: Date.now()}
        });
        if( req.body.password !== req.body.confirPassword) {
            res.status(400).json({
                success: false,
                message: 'Password is not matched with the new password'
            })
        }
    
        if(!user) {
            res.status(400).json({
                success: false,
                message: 'Reset password false'
            })
        } 
        else {
    
            // user.password = bcrypt.hashSync(req.body.password, 10);
            // user.resetPasswordToken = undefined;
            // user.resetPasswordTime = undefined;
        
            // await user.save({ validateBeforeSave: false });
            await User.updateOne({ resetPasswordToken: resetPasswordToken },
                { $set: { password: bcrypt.hashSync(req.body.password, 10), resetPasswordToken: ""}}
            );
            
        
            res.status(200).json({
                success: true
            })
            // sendToken(user, 200, res);
        }
    } catch(err) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }


}

//  Get all user Details -> ok
exports.getAllUser = async (req, res) => {
    const users = await User.find();

    res.status(200).json({
        success: true,
        users,
    }); 
  
};

 //Get user Details -> ok
exports.getUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        res.status(200).json({
          success: true,
          user,
        });
    }
    catch (err) {
        throw new Error(err);
    } 
  
};






// Update user Password ->ok

exports.updatePassword = async (req, res, next) => {
    try {

        const user = await User.findOne({ _id: req.body.user_id });
        const isPasswordMatched = await bcrypt.compare(req.body.oldPassword, user.password);
    
        if(!isPasswordMatched) {
            return next(
                ErrHandle("Old Password is incorrect", 400, res)
            )
        } 
        if(req.body.oldPassword === req.body.newPassword) {
            return next(
                ErrHandle("Password have been exist", 400, res)
            )
        }
    
        await User.updateOne(
                { email: user.email},
                { $set: { password: bcrypt.hashSync(req.body.newPassword, 10)}}
        );
    
        res.status(200).json(
            {
                success: true
            }
        )
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }

};

// update profile -> ok
exports.updateProfile = async (req, res, next) => {
    try {

        const newuserData = {
            username: req.body.username,
            phone: req.body.phone,
            email: req.body.email,
            birthDay: req.body.birthDay,
            province: req.body.province,
            distric: req.body.distric,
            wards: req.body.wards,
            address: req.body.address,
            noteAddress: req.body.note,
            payment: req.body.payment
    
        }
        // if(req.body.article_image !== '') {
        //     const user = await User.finndById(req.user.id);
    
        //     user.article_image = user.body.article_image;
        // }
    
        await User.findByIdAndUpdate(req.user._id, newuserData, {
            new: true,
            runValidators: true,
            userFindAndModify: false,
        });
    
        res.status(200).json({
            success: true,
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
};

// get all user -- admin -> ok

exports.getAllUser = async (req, res) => {
    const users = await User.find();

    res.status(200).json({
        success: true,
        users
    })
};


//get single user --admin -> ok
exports.getSingleUser = async (req, res, next) => {
    try {

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
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
};

// delete user --admin -> ok
exports.deleteUser = async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if(!user) {
        return next(
            ErrHandle(`User is not found with this ${req.params.id}`, 400, res)
        )
    }
    await user.deleteOne()

    res.status(200).json({
        success: true,
        message: "User delete successfully"
    })
};

//change user --admin  -> ok
exports.changeUser = async (req, res) => {
    const newuserData = {
        username: req.body.username,
        email: req.body.email,
        role: req.body.role
    };
    
    const user = await User.findByIdAndUpdate( req.params.id, newuserData,
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
