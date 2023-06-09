const paypal = require('paypal-rest-sdk');

// exports.configPaypal = {
//     "port" : 3000,
//     "api" : {
//       "host" : "api.sandbox.paypal.com",
//       "port" : "",            
//       "client_id" : "AUvCwyDw5CrmXbmPE9BMieP6qbR3nHFJ7_1GdD2ZQK-CX5r7dGcNXng95tskcRhyMMbwByyIjWjsxPPL",  // your paypal application client id
//       "client_secret" : "EIPYG4TaA1myQfVYJOg0bzNaIs8RlYBQqm_88entmPeIwqqYLrg_0jvfOcoXjk0n6djR7bp3LSRYnFV0" // your paypal application secret id
//     }
// }

// Page will display after payment has beed transfered successfully
exports.getPaypalSuccess = async (req, res, next) => {
    res.status(200).json({
        success: true,
        message: "Payment transfered successfully."
    })
    window.location('')
};

// Page will display when you canceled the transaction 
exports.cancelPaypal = async (req, res, next) => {
    res.status(200).json({
        success: true,
        message: "Cancel Paypal successfully."
    })
    window.location('')
};

exports.toPaypal = async (req, res, next) => {
    // paypal payment configuration.
    var payment = {
        "intent": "sale",
        "payer": {
          "payment_method": "paypal"
        },
        "redirect_urls": {
          "return_url": "http://localhost:3001"+"/success",
          "cancel_url": "http://localhost:3001"+"/cancel"
        },
        "transactions": [{
          "amount": {
            "total":parseInt(req.body.amount),
            "currency":  req.body.currency
          },
          "description": req.body.description
        }]
      };

      paypal.payment.create(payment, function (error, payment) {
        if (error) {
          console.log(error);
        } else {
          if(payment.payer.payment_method === 'paypal') {
            req.paymentId = payment.id;
            var redirectUrl;
            console.log(payment);
            for(var i=0; i < payment.links.length; i++) {
              var link = payment.links[i];
              if (link.method === 'REDIRECT') {
                redirectUrl = link.href;
              }
            }
            res.redirect(redirectUrl);
          }
        }
      });
};
