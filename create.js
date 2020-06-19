/**
 * 模拟 Object.create 的实现过程
 */
if (typeof Object.create !== 'function') {
    Object.create = function (o) {
        var F = function () {}
        F.prototype = o
        return new F()
    }
}

// 使用 ---------------------

var stooge = {
    "first-name": "Jone",
    "last-name": "Howard"
}

var another_stooge = Object.create(stooge)
console.log(another_stooge)
