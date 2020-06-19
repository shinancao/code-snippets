/**
 * 创建单例
 * @param {*} fn 
 */
var getSingle = function (fn) {
    var result
    return function () {
        return result || (result = fn.apply(this, arguments))
    }
}

// 使用 ---------------------

var createLoginLayer = function () {
    var div = document.createElement( 'div' )
    div.innerHTML = '我是登录浮窗'
    return div
}

var createSingleLoginLayer = getSingle(createLoginLayer)
var singleLoginLayer = createSingleLoginLayer()
