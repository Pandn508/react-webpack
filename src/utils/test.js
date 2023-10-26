Function.prototype.myCall = function (context) {
  if (typeof this !== 'function') {
    throw new TypeError('this is not a function')
  }

  context = context || window;
  const args = Array.from(arguments).slice(1)
  const fn = Symbol()
  context[fn] = this
  const result = context[fn](...args)
  delete context[fn]
  return result
}
/* apply */
Function.prototype.myApply = function (context) {
  if (typeof this !== 'function') {
    throw new TypeError('this is not a function')
  }

  context = context || window
  const fn = Symbol()
  context[fn] = this
  let result;
  if (arguments[1]) {
    result = context[fn](...arguments[1])
  } else {
    result = context[fn]()
  }
  delete context[fn]
  return result
}
/* bind */
Function.prototype.myBind = function (context) {
  if (typeof this !== 'function') {
    throw new TypeError('this is not a function')
  }

  const _this = this
  let args = Array.prototype.slice.call(arguments, 1)
  return function Fn() {
    if (this instanceof Fn) {
      return new _this(...args, ...arguments)
    } else {
      return _this.apply(context, args.concat(...arguments))
    }
  }
}
/* new */
function myNew(fn, ...args) {
  let obj = {};
  obj.__proto__ = fn.prototype
  const result = fn.apply(obj, args)
  return result instanceof Object ? result : obj
}
/* debounceImmediate */

/* throttleImmediate */

/* cloneDeep */
function isObject(value) {
  const type = typeof value
  return value !== null && (type === 'object' || type === 'function')
}
function toType(value) {
  return Object.prototype.toString.call(value).slice(8)
}
function cloneDeep(value, stack = new Map()) {
  if (!isObject(value)) return value
  const type = toType(value)
  const ctor = value.constructor

  if (type === 'RegExp' || type === 'Date') return new ctor(value)
  if (type === 'Error') return new ctor(value.message)
  if (type === 'Function') return function () {
    value.call(this, arguments)
  }

  let result = new ctor()
  let stacked = stack.get(value)
  if (stacked) {
    return stacked
  }
  stack.set(value, result)

  if (type === 'Set') {
    value.forEach(i => {
      result.add(cloneDeep(i, stack))
    })
    return result
  }
  if (type === 'Map') {
    value.forEach((val, key) => {
      result.set(cloneDeep(key, stack), cloneDeep(val, stack))
    })
    return result
  }

  Object.keys(value).forEach((key) => {
    result[key] = cloneDeep(value[key], stack)
  })
  return result
}
/* promise */
const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'
class MyPromise {
  constructor(executor) {
    try {
      executor(this.resolve, this.reject)
    } catch (error) {
      this.reject(error)
    }
  }

  status = PENDING
  value = null
  reason = null
  reason = null

  reason = null 

  onFulfilledCallbacks = []
  onRejectedCallbacks = []

  resolve = (value) => {
    if (this.status === PENDING) {
      this.status = FULFILLED
      this.value = value

      while (this.onFulfilledCallbacks.length) {
        this.onFulfilledCallbacks.shift()(value)
      }
    }
  }
  reject = (reason) => {
    if (this.status === PENDING) {
      this.status = REJECTED
      this.reason = reason

      while(this.onRejectedCallbacks.length) {
        this.onRejectedCallbacks.shift()()
      }
    }
  }
  then(onFulfilled, onRejected) {
    const realOnfulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value
    const realOnrejected = typeof onRejected === 'function' ? onRejected : reason => {throw reason}
   
    const promise2 = new MyPromise((resolve, reject) => {
      const fulfilledMicrotask = () => {
        queueMicrotask(() => {
          try {
            const x = realOnfulfilled(this.value)
            resolvePromise(promise2, x, resolve, reject)
          } catch (error) {
            reject(error)
          }
        })
      }

      const rejectedMicrotask = () => {
        queueMicrotask(() => {
          try {
            const x = realOnrejected(this.reason)
            resolvePromise(promise2, x, resolve, reject)
          } catch(error) {
            reject(error)
          }
        })
      }

      if (this.status === FULFILLED) {
        fulfilledMicrotask()
      } else if (this.status === REJECTED) {
        rejectedMicrotask()
      } else {
        this.onFulfilledCallbacks.push(fulfilledMicrotask)
        this.onRejectedCallbacks.push(rejectedMicrotask)
      }
    })
    return promise2
  }

  static resolve(parameter) {
    if (parameter instanceof MyPromise) {
      return parameter
    }
    return new MyPromise(resolve => resolve(parameter))
  }
  static reject(reason) {
    return new MyPromise((resolve, reject) => reject(reason))
  }
}
function resolvePromise(promise2, x, resolve, reject) {
  if (promise2 === x) {
    return reject(new TypeError('chaining cycle detect from promise'))
  }
  if (x instanceof MyPromise) {
    x.then(resolve, reject)
  } else {
    resolve(x)
  }
}
/* promise all */
MyPromise.all = function (promises) {
  return new Promise((rs, rj) => {
    let count = 0;
    const len = promises.length
    let result = []

    if (lef === 0) {
      rs([])
    }

    promises.forEach((p, i) => {
      MyPromise.resolve(p).then((res) => {
        count++;
        result[i] = res

        if (count === len) {
          rs(result)
        }
      }).catch((err) => {
        rj(err)
      });
    })
  })
}
/* es5 es6 */
function Parent() {
  this.balance = 1000
}
Parent.prototype.useMoney = function(money) {
  this.balance -= money
  console.log(`使用${money}元,剩余${this.balance}元`)
}
function Child() {
  Parent.call(this)
}
function createObj(obj) {
  function F(){}
  F.prototype = obj.prototype
  return new F()
}
function inheritPrototype(Parent, Child) {
  let prototype = createObj(Parent.prototype)
  prototype.constructor = Child.constructor
  Child.prototype = prototype
}
inheritPrototype(Parent, Child)
let child = new Child()

class Parent1 {
  constructor(name) {
    this.name = name
    this.balance = 10000
  }

  useMoney(money) {
    this.balance -= money;
    console.log(`使用${money}元,剩余${this.balance}元`)
  }
}
class Child1 extends Parent1 {
  constructor(name, age) {
    super(name)
    this.age = age
  }

  getMsg() {
    console.log(`${this.name} ${this.age}, 剩余${this.balance}`)
  }
}
/* 科利华 */
function add() {
  let args = Array.prototype.slice.call(arguments)

  function adder() {
    args.push(...arguments)
    return adder
  }
  adder.toString = function () {
    return args.reduce((prev, curr) => curr+prev, 0)
  }
  return adder
}
/* promise n */
function queuePromise(promises, n) {
  return new Promise((rs, rj) => {
    const len = promises.length
    let complete = 0
    let index = 0
    let maxCount = n
    let result = []

    function next() {
      if (len === complete) {
        rs(result)
        return
      }
      while(index < len && maxCount > 0) {
        maxCount--
        let currIndex = index++
        MyPromise.resolve(promises[currIndex])
        .then((res) => {
          maxCount++
          complete++
          result[currIndex] = res
          next()
        })
      }
    }
    next()
  })
}
/* promise async */



function uniqueArray(arr) {
  const result = []
  for (let i = 0; i < arr.length; i++) {
    const item1 = arr[i]
    let isFind = false
    for (let j = 0; j < result.length; j++) {
      const item2 = result[j]
      if (equals(item1, item2)) {
        isFind = true
        break
      }
    }
    if (!isFind) {
      result.push(item1)
    }
  }
  return result
}
function equals(item1, item2) {
  if (isObject(item1) || isObject(item2)) {
    return Object.is(item1, item2)
  }
  const entries1 = Object.entries(value1)
  const entries2 = Object.entries(value2)
  if (entries1.length !== entries2.length) {
    return false
  }
  for (let [key, value] of entries1) {
    if (!equals(value, value2[key])) {
      return false
    }
  }
  return true
}
function isObject(value) {
  return value === null || !['object',' function'].includes(typeof value)
}















