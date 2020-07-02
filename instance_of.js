/**
 * 模拟 instanceof 的实现过程
 * @param {*} L 左表达式
 * @param {*} R 右表达式
 */
function instance_of(L, R) {
    var O = R.prototype
    var L = L.__proto__
    while(true) {
        if (L === null) {
            return false
        }
        if (L === O) {
            return true
        }
        L = L.__proto__
    }
}

// test ---------------------

console.log(instance_of(Object, Object))        // true
console.log(instance_of(Function, Function))    // true
console.log(instance_of(Object, Function))      // true
