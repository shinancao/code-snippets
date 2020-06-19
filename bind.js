/**
 * 使用 apply 模拟 Function.prototype.bind 的实现
 * @param {*} that 
 */
Function.prototype.bind = function (that) {
    var method = this                        // this 指向调用 bind 的函数
        slice = Array.prototype.slice
        args = slice.apply(arguments, [1])   // 取除 that 以外的其他参数
    return function () {
        return method.apply(that, args.concat(slice.apply(arguments, [0])))
    }
}

// 使用 ---------------------

var x = function (a, b) {
    return this.base + a + b
}.bind({base: 10}, 1, 2)

console.log(x())   // 打印 13
