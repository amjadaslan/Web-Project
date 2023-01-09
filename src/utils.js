module.exports.getIndexedArray = (array) => {
    return array.map((elm, idx) => {
        return [elm, idx];
    })
}