


exports.groupBy = (objectArray, property, arrKey) => {
    return objectArray.reduce(function (accumulator, obj) {
      let key = obj[property];
      if(arrKey.length <= 0) {
          arrKey.push(key);
      }
      else {
        const searchKey = arrKey.find((a) => a === key);
        if(!searchKey) {
          arrKey.push(key);
        }
      }
      if (!accumulator[key]) {
        accumulator[key] = []
      }
      accumulator[key].push(obj)
      return accumulator
    }, {})
    
  }

  let  newArrProduct = [];

  exports.printWithKey = (a, arr) => {
  for (let i in a) {
      let code = a[i];
      newArrProduct = [...newArrProduct,  arr[code]]
  }
  return newArrProduct;
}




