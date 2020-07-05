// typeof null 等于 'object'，所以这里要再判断一次
var isObject = function(obj) {
    return typeof obj === 'object' && obj !== null
}

/**
 * 深层次拷贝
 * @param {*} source 
 * @param {*} hash 
 */
var cloneDeep = function(source, hash = new WeakMap()) {
    // String, Number, Null, Undefined, Symbol, Function直接返回
    if (!isObject(source)) return source

    // 已经创建过的对象，直接取出返回，主要解决循环引用的情况
    if (hash.get(source)) return hash.get(source)

    // 创建新的对象，存入hash
    const target = Array.isArray(source) ? [] : {}
    hash.set(source, target)

    // 拷贝对象的Symbol属性
    const symbolArr = Object.getOwnPropertySymbols(source)
    if (symbolArr.length) {
        symbolArr.forEach(key => {
            if (isObject(source[key])) {
                target[key] = cloneDeep(source[key], hash)
            } else {
                target[key] = source[key]
            }
        })
    }

    // 拷贝own propertys
    for (let key in source) {
        if (source.hasOwnProperty(key)) {
            if (isObject(source[key])) {
                target[key] = cloneDeep(source[key], hash)
            } else {
                target[key] = source[key]
            }
        }
    }

    return target
}

// test ---------------------

let obj = {         
    reg : /^asd$/,
    fun: function(){},
    syb:Symbol('foo'),
    asd:'asd'
}

let clonedObj = cloneDeep(obj)
console.log(clonedObj)
