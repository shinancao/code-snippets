/**
 * 用一个数组记录递归过程中计算的结果，避免多余重复的计算
 * @param {*} memo 
 * @param {*} formula 
 */
var memoizer = function (memo, formula) {
    var recur = function (n) {
        var result = memo[n]
        if (typeof result !== 'number') {
            result = formula(recur, n)
            memo[n] = result
        }
        return result
    }
    return recur
}

// 使用 ---------------------

var factorial = memoizer([1, 1], function (resur, n) {
    return n * resur(n - 1)
})

factorial(5)