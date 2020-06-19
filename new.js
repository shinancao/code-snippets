/**
 * 模拟 new 运算符的操作过程
 */
Function.prototype.new = function () {
    // 创建一个新对象，它继承自构造函数的原型对象
    var that = Object.create(this.prototype)

    // 调用构造函数，绑定 -this- 到新对象上
    var other = this.apply(that, arguments)

    // 如果它的返回值不是一个对象，就返回该新对象
    return (typeof other === 'object' && other) || that
}
