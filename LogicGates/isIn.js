exports.isIn = function (value, array) {
    for (let ArrayVal = 0; ArrayVal < array.length; ArrayVal++){
        if (array[ArrayVal] === value){
            return true
        }
    }
    return false
}