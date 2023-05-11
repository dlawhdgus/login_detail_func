exports.CHK_ARRAY = (arr) => {
    if(Array.isArray(arr)) { return arr.length !== 0 }
    else { return false }
}