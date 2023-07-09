const nodeMailer = require("nodemailer");
// const dotenv = require('dotenv');

const sendEmail =  async (options) => {
    const transporter = nodeMailer.createTransport({
        secure: true,
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        },
        tls: {
            rejectUnauthorized: false,

        }
    });

    const optionMail =  {
        form: process.env.EMAIL,
        to: options.email,
        subject: "Wellcome to change password of FE-Shop",
        context: {
            name: "FE-Shop",
            company: "Four Seasons FashionClother"
        },
        html: '<p>Hi  '+options.email+' Code NewPassword is: '+options.code+'  , Please copy the link and <a href="'+process.env.LOCALHOST+process.env.LINKFORGOTRESETPASSWORD+'?token='+options.token+' "> reset your password</a>'
    }

    transporter.sendMail(optionMail, function( err, infor) {
        if(err) throw Error(err);
    })
};

module.exports = sendEmail;

