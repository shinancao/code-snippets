/**
 * 给函数对象添加方法
 * @param {*} name 
 * @param {*} func 
 */
Function.prototype.method = function(name, func) {
    Object.defineProperty(this.prototype, name, {
        value: func,
        enumerable: false
    })
}

/**
 * *****************说明****************
 * 1. O.length >>> 0 
 * >>> 表示无符号右移
 * 这会得到一个无符号的32位整数UInt32，length是可以被开发者赋值的，这样可以确保使用的是一个合格的length值
 * 具体解析：https://stackoverflow.com/questions/22335853/hack-to-convert-javascript-number-to-uint32
 * 
 * 2. if(k in O)
 * 这是为了过滤掉数组中的空项
 * *************************************
 */


/**
 * 实现Array.prototype.map
 */
Array.method('myMap', function(callback/*, thisArg*/) {
    if (this === null) {
        throw new TypeError('this is null or not defined')
    }

    if (typeof callback !== 'function') {
        throw new TypeError(callback + ' is not a function')
    }

    const O = this, 
        len = O.length >>> 0

    let T, A

    if (arguments.length > 1) {
        T = arguments[1]
    }

    A = new Array(len)

    for(let k = 0; k < len; k++) {
        if (k in O) {
            const kValue = O[k]
            const mappedValue = callback.call(T, kValue, k, O)
            A[k] = mappedValue
        }
    }

    return A
})

/**
 * 实现Array.prototype.filter
 */
Array.method('myFilter', function(callback/*, thisArg*/) {
    if (this === null) {
        throw new TypeError('this is null or not defined')
    }

    if (typeof callback !== 'function') {
        throw new TypeError(callback + ' is not a function')
    }

    const O = this,
        len = O.length >>> 0

    let T, A

    if (arguments.length > 1) {
        T = arguments[1]
    }

    A = new Array(len)

    let c = 0

    for(let k = 0; k < len; k++) {
        if (k in O) {
            const kValue = O[k]
            if (callback.call(T, kValue, k, O)) {
                A[c++] = kValue
            }
        }
    }

    A.length = c
    return A
})

/**
 * 实现Array.prototype.reduce
 */
Array.method('myReduce', function(callback/*, initialValue*/) {
    if (this === null) {
        throw new TypeError('this is null or not defined')
    }

    if (typeof callback !== 'function') {
        throw new TypeError(callback + ' is not a function')
    }

    const O = this,
        len = O.length >>> 0

    let value, k = 0

    if(arguments.length > 1) {
        value = arguments[1]
    } else {
        while(k < len && !(k in O)) {
            k++
        }
        if (k > len) {
            throw new TypeError('reduce of empty array with no initial value')
        } else {
            value = O[k++]
        }
    }

    for(; k < len; k++) {
        if (k in O) {
            value = callback(value, O[k], k, O)
        }
    }

    return value
})

/**
 * 实现Array.prototype.flat
 */
Array.method('myFlat', function(depth = 1) {
    const A = []

    function flat(arr, depth) {
        arr.forEach(item => {
            if (Array.isArray(item) && depth > 0) {
                flat(item, depth - 1)
            } else {
                A.push(item)
            }
        })
    }

    flat(this, depth)

    return A
})

/**
 * 实现数组乱序
 * 关于数组乱序：https://oldj.net/blog/2017/01/23/shuffle-an-array-in-javascript
 */
Array.method('shuffle', function() {
    const O = this
    let i = O.length >>> 0
    while(i) {
        const j = Math.floor(Math.random() * i--)
        const value = O[i]
        O[i] = O[j]
        O[j] = value
    }
})


// test ---------------------

let array = new Array(10)
array[2] = 2
array[4] = 4
array[6] = 6

let newArr = array.myMap((e) => e * 2)
console.log(newArr)

newArr = array.myFilter((e) => e % 2 === 0)
console.log(newArr)

newArr = array.myReduce((acc, cur) => acc.concat([cur * 2]), [])
console.log(newArr)

array = [[1, 2, 3], [4, 5], [[6, 7], 8], [[9]]]
newArr = array.myFlat(2)
console.log(newArr)

array = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
array.shuffle()
