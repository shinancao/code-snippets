/**
 * 实现 发布/订阅 模式
 */
var Event = (function(){
    let clientList = {}
        listen,
        trigger,
        remove
    
    listen = function (key, fn) {
        if (!clientList[key]) {
            clientList[key] = []
        }

        clientList[key].push(fn)
    }

    trigger = function (key) {
        let fns = clientList[key]
        if (!fns || fns.length === 0) {
            return false
        }

        let args = Array.prototype.slice.call(arguments, 1)
        fns.forEach(fn => fn.apply(this, args))
    }

    remove = function (key, fn) {
        let fns = clientList[key]
        if (!fns || fns.length === 0) {
            return false
        }
        for(let i = 0; i < fns.length; i++) {
            let _fn = fns[i]
            if (_fn === fn) {
                fns.splice(i, 1)
            }
        }
    }

    return { listen, trigger, remove }
})()

// test ---------------------

let fn = function(param) {
        console.log('test-----' + param)
    }

Event.listen('test', fn)

Event.trigger('test', 888)

Event.remove('test', fn)

Event.trigger('test', 999)



