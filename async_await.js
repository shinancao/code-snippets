/**
 * 模拟 async/await 的实现过程
 * 简单版，为了容易理解整个过程
 * @param {*} generatorFunction 
 */
function asyncAlt(generatorFunction) {
    // 始终返回一个Promise对象

    let generator = generatorFunction()

    function resolve(next) {
        if (next.done) {
            // 如果generatorFunction有返回值，这里的value就是该返回值，否则是 undefined
            return Promise.resolve(next.value)
        }

        return Promise.resolve(next.value).then(value => {
            // 当前next拿到的value值，通过下一个next发送给generatorFunction
            // 以便下一个yield后的表达式依赖于当前的这个value
            return resolve(generator.next(value))
        })
    }

    // 启动计算第一个yield后面表达式的值
    // 第一个next无需传值
    return resolve(generator.next())
}

// test ---------------------

asyncAlt(function* (){
    const response = yield fetch('https://jsonplaceholder.typicode.com/users')
    const json = yield response.json()
    console.log(json)
})

// test end ---------------------
/**
 * 模拟 async/await 的实现过程
 * 加上了异常的处理
 * 代码源于：https://developers.google.com/web/fundamentals/primers/promises
 * 作者在 Q 的实现上做了稍加修改
 * @param {*} generatorFunction 
 */
function spawn(generatorFunction) {
    function continuer(verb, arg) {
        var result;
        try {
            result = generator[verb](arg)
        } catch (error) {
            return Promise.reject(error)
        }

        if (result.done) {
            return result.value
        } else {
            return Promise.resolve(result.value).then(onFulfilled, onRejected)
        }
    }

    var generator = generatorFunction()
    var onFulfilled = continuer.bind(continuer, 'next')
    var onRejected = continuer.bind(continuer, 'throw')

    return onFulfilled()
}

// test ---------------------

spawn(function* () {
    try {
        const response = yield fetch('https://jsonplaceholder.typicode.com/users')
        const json = yield response.json()
        console.log(json)
    } catch (error) {
        console.log(error)
    }
})

