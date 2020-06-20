/**
 * 按照 Promise/A+ 规范，模拟实现 Promise
 * 实现了原型方法：then, catch, finally
 * 实现了静态方法：resolve, reject, all, race
 * 代码源于：https://mp.weixin.qq.com/s?__biz=MzI4NjY4MTU5Nw==&mid=2247486661&idx=1&sn=8e4b3056aa9c110ca08047d0917290f4&chksm=ebd87c57dcaff54168d1a8f94b074fa814270b9753d8c1e7eebe3b4203254ecb0e6989ba1f19&scene=21
 * 我加上了一些注释，感谢作者的分享👍
 */
class MyPromise {
    callbacks = []
    state = 'pending'
    value = null

    constructor(fn) {
        fn(this._resolved.bind(this), this._rejected.bind(this))
    }

    // prototype methods
    then(onFulfilled, onRejected) {
        return new MyPromise((resolve, reject) => {
            this._handle({
                onFulfilled: onFulfilled || null,
                onRejected: onRejected || null,
                resolve: resolve,
                reject: reject
            })
        })
    }

    // catch专门用来处理reject的情况，相当于是调用then的一个语法糖吧
    catch(onError) {
        return this.then(null, onError)
    }

    // finally其实也是调用then，只是finally不能修改Promise的状态，所以在实现的时候稍微复杂了一些
    finally(onDone) {
        if (typeof onDone !== 'function') return this.then()
        // 用一个完全新的Promise执行onDone，调用then，是为了如果在finally后面还有then操作，可以拿到上一步的值
        // 这样确保 onDone始终会被执行，并且不会修改当前 Promise的状态
        let MyPromise = this.constructor
        return this.then(
            value => MyPromise.resolve(onDone()).then(() => value),
            reason => MyPromise.reject(onDone()).then(() => { throw reason })
        )
    }

    // static methods
    static resolve(value) {
        if (value && value instanceof MyPromise) {
            // 如果是 Promise，则保持该Promise的状态不变
            return value
        }

        if (value && typeof value === 'object' && typeof value.then === 'function') {
            let then = value
            return new MyPromise((resolve, reject) => {
                then(resolve)
            })
        }

        if (value) {
            return new MyPromise((resolve, reject) => {
                resolve(value)
            })
        }

        return new MyPromise((resolve, reject) => resolve())
    }
    
    // reject会让返回的Promise始终是rejected状态
    static reject(value) {
        return new MyPromise((resolve, reject) => {
            reject(value)
        })
    }

    // 接收一组 Promise 实例数组，在这些 Promise 实例都 fulfilled后，按照 Promise 实例的顺序返回结果
    static all(iterable) {
        return new MyPromise((resolve, reject) => {
            let itemNum = iterable.length
            let rets = Array.from({ length: itemNum })
            let fulfilledCount = 0
            iterable.forEach((promise, index) => {
                MyPromise.resolve(promise).then(value => {
                    fulfilledCount++
                    rets[index] = value
                    if (fulfilledCount === itemNum) {
                        resolve(rets)
                    }
                }, reject)
            })
        })
    }

    // 与 all 功能类似，但 race 有一个成功或失败了就返回
    static race(iterable) {
        return new MyPromise((resolve, reject) => {
            for (let i = 0; i < iterable.length; i++) {
                MyPromise.resolve(iterable[i]).then(resolve, reject)
            }
        })
    }

    // help methods
    _handle(callback) {
        if (this.state === 'pending') {
            this.callbacks.push(callback)
            return
        }

        let cb = this.state === 'fulfilled' ? callback.onFulfilled : callback.onRejected
        
        if(!cb) {
            cb = this.state === 'fulfilled' ? callback.resolve : callback.reject
            cb(this.value)
            return
        }

        let ret;
        try {
            cb(this.value)
            cb = this.state === 'fulfilled' ? callback.resolve : callback.reject
        } catch (error) {
            ret = error
            cn = callback.reject
        } finally {
            cb(ret)
        }
    }

    _resolved(value) {
        if (this.state !== 'pending') {
            return
        }

        if (value && (typeof value === 'object' || typeof value === 'function') {
            let then = value.then
            if (typeof then === 'function') {
                then.call(value, this._resolved.bind(this))
                return
            }
        }

        this.state = 'fulfilled'
        this.value = value
        this.callbacks.forEach(callback => this._handle(callback))
    }

    _rejected(reason) {
        if (this.state !== 'pending') {
            return
        }

        this.state = 'rejected'
        this.value = reason
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
        callback(url + '异步请求耗时' + s + '秒', 'oops! error!');
    }, 1000 * s)
}

const promise1 = new MyPromise((resolve, reject) => {
    mockAjax('getUserId', 5, function(result, error) {
        if (error) {
            reject(error)
        } else {
            resolve(result)
        }
        resolve(result)
    })
})

const promise2 = new MyPromise((resolve, reject) => {
    mockAjax('getNameById', 5, function(result, error) {
        if (error) {
            reject(error)
        } else {
            resolve(result)
        }
    })
})

// 测试 catch & finally
promise1.then(function(result) {
    // 拿上面 Promise的执行结果
    console.log(result)
})
.catch(function(error) {
    console.log(error)
})
.finally(function() {
    console.log('Done!')
})

// 测试 all & race
MyPromise.all([promise1, promise2])
.then(rets => {
    console.log(rets)
}, error => {
    console.log(error)
})

MyPromise.race([promise1, promise2])
.then(ret => {
    console.log(ret)
}, error => {
    console.log(error)
})
