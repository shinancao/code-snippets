/**
 * 实现节流
 * 原理就是记录上一次的时间，如果上一次与当前的时间差大于或等于了delay，就执行回调，否则交给定时器
 * @param {*} fn 
 * @param {*} delay 
 */
var throttle = function(fn, delay) {
    var timer, now, previous

    return function() {
        var _args = arguments
            context = this

        // 存储当前时间戳
        now = Date.now()

        var _fn = function() {
            previous = Date.now()
            timer = null
            fn.apply(context, _args)
        }

        clearTimeout(timer)

        if (previous !== undefined) {
            if (now - previous >= delay) {
                // 超过了延迟时间，立即执行
                fn.apply(context, _args)
                previous = now
            } else {
                timer = setTimeout(_fn, delay)
            }
        } else {
            // 第一次立即执行
            _fn()
        }
    }
}

// test ---------------------

var throttleScroll = throttle(function(){
    console.log('do something when window is scrolling...')
}, 1000)

window.addEventListener('scroll', throttleScroll)

// test end ---------------------
/**
 * 使用window.requestAnimationFrame()来实现节流
 * 原理是设置一个标识，如果标识为true就直接返回，否则置为true，然后告诉浏览器在下次重绘之前调用回调函数
 * 这种性能要比使用timeOut好
 */
var raFrame = window.requestAnimationFrame ||
              window.webkitRequestAnimationFrame ||
              window.mozRequestAnimationFrame ||
              window.oRequestAnimationFrame ||
              window.msRequestAnimationFrame ||
              function(callback) {
                  window.setTimeout(callback, 1000 / 60)
              }

var rafThrottle = function(fn) {
    var isLocked
    return function() {
        var _args = arguments
            context = this
                    
        if (isLocked) return
        
        isLocked = true

        raFrame(function() {
            isLocked = false
            fn.apply(context, _args)
        })
    }
}
    
// test ---------------------

var rafThrottleScroll = rafThrottle(function() {
    console.log('do something when window is scrolling...')
})

window.addEventListener('scroll', throttleScroll)