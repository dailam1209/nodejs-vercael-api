const nodeMailer = require("nodemailer");

const sendEmail =  async (options) => {
    const transporter = nodeMailer.createTransport({
        host: process.env.SMPT_HOST,
        port: process.env.SMTP_PORT,
        service: process.env.SMPT_SERVICE,
        auth: {
            user: process.env.SMTP_MAIL,
            pass: process.env.SMPT_PASSWORD
        },
    });

    const optionMail =  {
        form: process.env.SMTP_MAIL,
        to: options.email,
        subject: options.subject,
        text: options.message,
    }

    await transporter.sendMail(optionMail, function( err, infor) {
        if(err) throw Error(err);
            console.log('Email sent successfully');
            console.log(infor);
    })
};

module.exports = sendEmail;

