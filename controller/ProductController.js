const Product = require("../models/Product");
const ErrHandle = require("../untils/ErrHandle");
const crypto = require('crypto');
const {groupBy, lastResult }= require("../untils/reduceProduct");
const {printWithKey} = require("../untils/reduceProduct");
const url = require('url');


exports.createProduct = async (req, res, next) => {

    try {
            const product = await Product.create(req.body);

            res.status(201).json({
                success: true,
                product,
            })
    }
    catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        })
    }
         
    
};

exports.allProduct = async (req, res, next) => {


    const allproduct = await Product.find();
  

        res.status(201).json({
            success: true,
            allproduct,
        })
};

exports.searchTitle = async (req, res) => {
    
    try {
        const { title } = req.query;

        let listTitle = [];
        const url = req?.url?.slice(8,9);
        
        const product = await Product.find();
        if(title && url === "t") {
            console.log("title1", title);
            if(product) {
                product.filter(_ => {
                    if(_.slug.indexOf(title) !== -1){
    
                        listTitle.push(_.slug);
                    }
                })
            }
        } 
        if(url === "q") {
            const { q } = req.query;
            if(product) {
                product.filter(_ => {
                    if(_.slug.indexOf(q) !== -1){
    
                        listTitle.push(_);
                    }
                })
            }
        }

        res.status(200).json({
            success: true,
            listTitle,
        })
    } catch (err) {
        throw Error(err);
    }


}



//search all, detail "color, price, size", pagination
exports.getAllProduct = async (req, res, next) => {
    const querycolor = req.query.mastercolor; // color
    const querysize = req.query.size; // size
    const queryprice = req.query.price; // price
    const url = req.url?.replace("/", '')?.split('?')[0];
    
    console.log("querycolor", req.url?.replace("/", '')?.split('?')[0]);
    // first handle
    let arrKey = [];
    let reductProduct = [];
    let filterColor = [];
    let filterSize = [];
    let filterPrice = [];

    //page
    let resultPerPage = 12; 
    let page = req.query.page || 1; 
    let skip = resultPerPage * (page - 1);
    let lengthSkip = skip + resultPerPage;

    const ProductCount = await Product.find();

    await ProductCount.filter( sizecurrent => {
     if( sizecurrent.slug.indexOf(url) !== -1) {
        filterColor.push(sizecurrent);
     }
    })

    console.log(filterColor);



    // const filter = await ProductCount.filter(user => user.desc == (`${param}`))
    //color
    // if(querycolor) {
    //   if(typeof querycolor === 'object') {
    //     await  querycolor.map((titleColor, index) => {
    //         ProductCount.filter(product => {
    //          if( product.color.title == titleColor) {
    //              filterColor.push(product);
    //          }
    //         })
    //      })
    //   }
    //   else {
    //         ProductCount.filter(product => {
    //          if( product.color.title == querycolor) {
    //              filterColor.push(product);
    //          }
    //         })
    //   }
    // }
    // else {
    //     filterColor = ProductCount;
    // }
    // filterColor = ProductCount;
    // size
    if(querysize) {
        if( typeof querysize === 'object') {
            let checkHave = [];
            await  querysize.map((titleSize, index) => {
                
                filterColor.filter( sizecurrent => {
                    // check _id and check have size to add
                 if( checkHave.indexOf(sizecurrent._id === -1) && sizecurrent.size.indexOf(titleSize) !== -1) {
                    checkHave.push(sizecurrent._id)
                     filterSize.push(sizecurrent);
                 }
                })
             })
        }
        else {
             await filterColor.filter( sizecurrent => {
                // check _id and check have size to add
             if( sizecurrent.size.indexOf(querysize) !== -1) {
                 filterSize.push(sizecurrent);
             }
            })
        }
     }
     else {
        filterSize = filterColor ;
     }
     
     
     //price
     if(queryprice) {
        const sliptPrice = queryprice.split('-');
        let number1 = Number(sliptPrice[0]);
        let number2 = Number(sliptPrice[1]);
         filterSize.filter(price => {
            if(price.price >=  number1 && price.price <=  number2) {
                filterPrice.push(price);
            }
        })
    }
    else {
        filterPrice = filterSize;
    }

    // if(filterPrice.length > 0) {

    //     // group code
    //     reductProduct = await groupBy(filterPrice, 'code', arrKey);
        // arrKey code to map 
        arrKey = arrKey.slice(skip, lengthSkip);
    //     // arr format 'code'
        // reductProductLast = await printWithKey(arrKey, reductProduct).slice(skip, lengthSkip);
        reductProductLast = await lastResult('code', filterSize);

        if(reductProduct.length > lengthSkip) {
            reductProduct.slice(skip, lengthSkip)
        } else {
            reductProduct.slice(skip, reductProduct.length)
        }

    // }


    res.status(201).json({
        reductProduct: reductProductLast,
        length: Math.ceil(arrKey.length / resultPerPage),
        // arrKey: arrKey,
    })
};


// same codeProduct
exports.getSingleSameProduct = async (req, res, next) => {
    const id = req.params.id;
    const sliptSingleProduct = id.split('-');
    const lastCode = sliptSingleProduct[sliptSingleProduct.length - 1];

    const products = await Product.find();
    const filterCode = await products.filter(detail => detail.code == (`${lastCode}`))
    res.status(200).json({
        success: true,
        productCode: filterCode
    })
}

exports.updateProduct = async (req, res, next) => {
    let product = await Product.findById(req.params.id);
    if(!product) {
        return next(ErrHandle('Not found product with id', 400, res));
   
    }
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useUnified: false
    });

    res.status(200).json({
        success: true,
        product
    })

}
exports.deleteProduct = async (req, res, next) => {
    let product = await Product.findById(req.params.id);
    if(!product) {
        return next(ErrHandle('Not found product with id to delete', 400, res));
   
    }
    await product.remove();

    res.status(200).json({
        success: true,
        message: `Deleted ${req.params.id}`
    })

}

// get singleProduct
exports.singleProduct = async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if(!product) {
        return next(ErrHandle('Not found product with id to show singleProduct', 400, res));
    }

    res.status(201).json({
        success: true,
        product
    })
}