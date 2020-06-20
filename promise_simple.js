/**
 * 模拟 Promise 的实现过程，简化版，只实现了执行成功的情况，和链式调用
 * 代码源于：https://mp.weixin.qq.com/s?__biz=MzI4NjY4MTU5Nw==&mid=2247486661&idx=1&sn=8e4b3056aa9c110ca08047d0917290f4&chksm=ebd87c57dcaff54168d1a8f94b074fa814270b9753d8c1e7eebe3b4203254ecb0e6989ba1f19&scene=21
 * 我加上了一些注释，感谢作者的分享👍
 */
class MyPromise {
    // 用来存放所有通过then添加进来的callback
    callbacks = []
    // 如果不加上状态，就会在resolve之后，再通过 then 添加的 callback 就没有机会执行了
    // 可取值 pending fulfilled rejected
    state = 'pending'
    // 执行 resolve 时传入的 value 也需要保存下来
    value = null

    constructor(fn) {
        // 构造 Promise 的时候，fn 就被调用执行了
        // fn需要将 resolve 作为参数传递出去
        fn(this._resolved.bind(this))
    }

    // onFullfilled 为事件执行成功时的回调
    then(onFulfilled) {
        // 返回一个新的 Promise，保证下一步 then 中拿到的值是上一个的执行结果
        // 如果直接 return this，那所有的 then 中拿到的都是同一个值，构造 Promise时产生的值
        const inner_promise = new MyPromise((resolve) => {
            this._handle({
                onFulfilled: onFulfilled,
                resolve: resolve
            })
        })
        inner_promise.name = 'inner_promise'

        return inner_promise
    }

    _handle(callback) {
        if (this.state === 'pending') {
            this.callbacks.push(callback)
            return
        }

        if (callback.onFulfilled) {
            callback.resolve(this.value)
            return
        }

        let ret = callback.onFulfilled(this.value)
        callback.resolve(ret)

        // resolve 是 inner_promise 的 resolve
        // 所以在执行 resolve 时，内部的 this 指向的都是 inner_promise
    }

    // value 是开发者调用 resolve(value) 传入的
    _resolved(value) {
        // 判断 value 是否为一个 Promise
        if (value && (typeof value === 'object' || typeof value === 'function')) {
            let then = value.then
            if (typeof then === 'function') {
                // 需要用 call 来改变 then中的this指向，否则此时 then 中的 this 指向 undefined
                // 此时 this 的指向是 inner_promise
                then.call(value, this._resolved.bind(this))
                return
            }
        }

        this.state = 'fulfilled'
        this.value = value
        this.callbacks.forEach(callback => this._handle(callback))
    }
}

// test ---------------------

/**
 * 模拟异步请求
 * @param {*} url  请求的URL
 * @param {*} s  指定该请求的耗时，即多久之后请求会返回。单位秒
 * @param {*} callback 请求返回后的回调函数
 */
const mockAjax = (url, s, callback) => {
    setTimeout(() => {
        callback(url + '异步请求耗时' + s + '秒');
    }, 1000 * s)
}

const promise1 = new MyPromise((resolve) => {
    mockAjax('getUserId', 5, function(result) {
        resolve(result)
    })
})
promise1.name = 'promise1'

const promise2 = new MyPromise((resolve) => {
    mockAjax('getNameById', 5, function(result) {
        resolve(result)
    })
})
promise2.name = 'promise2'

promise1.then(function(result) {
    // then1
    console.log(result)

    return promise2
})
.then(function(result) {
    // then2
    console.log(result)
})

// 为了便于打断点调试时方便观察，所以这里都将 Promise 单独定义了一下，并且给了一个名字

// 对执行过程进行说明 ---------------------
/**
 * then1 的回调放在 promise1 的 callbacks 中，promise1 是 pending 状态
 * 
 * then2 的回调放在 inner_promise 的 callbacks 中，inner_promise 是 pending 状态
 * 
 * 异步事件处理完毕，执行了 promise1 的 resovle，使 promise1 变为 fulfilled 状态
 * 
 * then1 的回调会执行，并返回了 promise2，promise2 是 pending 状态
 * 
 * 因为上一个返回的是一个 Promise，所以 _resolved 被放入了 promise2 的 callbacks 中，
 * 此时 _resolved内的 this 指向的是 inner_promise
 * 
 * promise2中的异步事件处理完毕，执行 resolve，使 promise2 变为 fulfilled 状态
 * 
 * promise2 的 callbacks 被依次调用，所以 _resolved 被执行了，
 * 因为_resolved内的 this 指向的是 inner_promise，使得 inner_promise 获得 value，并且状态变为 fulfilled。
 * 
 * then2 被执行，最终输出了 promise2 异步事件返回的值。
 * 
 */