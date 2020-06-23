/**
 * 实现防抖
 * 原理就是在抖动的过程中创建的timer都会被清除掉，直到最后一次的timer会被触发
 * @param {*} fn    真正要被触发的回调
 * @param {*} delay 该时间段内多次执行的都算是抖动
 */
var debounce = function(fn, delay) {
    var timer

    return function() {
        var _args = Array.prototype.slice(arguments)

        if (timer) {
            clearTimeout(timer)
        }

        timer = setTimeout(() => {
            fn.apply(this, _args)
        }, delay)
    }
}

// test ---------------------

var debounceScroll = debounce(function() {
    console.log('do something when window is scrolling...')
}, 1000)

window.addEventListener('scroll', debounceScroll)