Function.prototype.myCall = function(context) {
  if (typeof this !== 'function') {
    throw new TypeError('this is not a function')
  }
  context = context || wondow
  const args = Array.from(arguments).slice(1)
  const fn = Symbol()
  context[fn] = this
  let result = context[fn](...args)
  delete context[fn]
  return result
};
Function.prototype.myApply = function(context) {
  if (typeof this !== 'function') {
    throw new TypeError('this is not a function')
  }
  context = context || window
  let result;
  const fn = Symbol()
  context[fn] = this
  if (arguments[1]) {
    result = context[fn](...args)
  } else {
    result = context[fn]()
  }
  delete context[fn]
  return result
};
Function.prototype.myBind = function(context) {
  if (typeof this !== 'function') {
    throw new TypeError('this is not a funcion')
  }
  const _this = this
  let args = Array.prototype.slice.call(arguments, 1)
  return function F() {
    if (this instanceof F) {
      return new _this(...args, ...arguments)
    } else {
      return _this.apply(context, args.context(...arguments))
    }
  }
};
function isObject(value) {
  const type = typeof value
  return value !== null && (type === 'object' || type === 'function')
}
function toType(value) {
  return Object.prototype.toString.call(value).slice(8)
}
function cloneDeep(value, stack = new Map()) {
  if (!isObject(value)) return value;
  const type = toType(value);
  const ctor = value.constructor

  if (type === 'RegExp' || type === 'Date') return new ctor()
  if (type === 'Error') return new ctor(value.message)
  if (type === 'function') return function () {
    value.apply(this, arguments)
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
  Object.keys(value).forEach(key => {
    result[key] = cloneDeep(value[key], stack)
  })
  return result
}
function myNew (fn, ...args) {
  let obj = {}
  obj.__proto__ = fn.prototype
  let result = fn.apply(obj, args)
  return result instanceof Object ? result : obj
}
const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'
class Mypromise {
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
  onFulfilledCallbacks = []
  onRejectedCallbacks = []

  resolve = (value) => {
    if (this.status === PENDING) {
      this.status = FULFILLED
      this.value = value
      if (this.onFulfilledCallbacks.length) {
        this.onFulfilledCallbacks.shift()(this.value)
      }
    }
  }
  reject = (reason) => {
    if (this.status = PENDING) {
      this.status = REJECTED
      this.reason = reason
      if (this.onRejectedCallbacks.length) {
        this.onRejectedCallbacks.shift()(this.reason)
      }
    }
  }
  static resolve(parameter) {
    if (parameter instanceof Mypromise) {
      return parameter
    }
    return new Mypromise((rs, rj) => {
      rs(parameter)
    })
  }
  static rejected(parameter) {
    return new Mypromise((rs, rj) => {
      rj(parameter)
    })
  }
  then(onFulfilled, onRejected) {
    const realFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value
    const realRejected = typeof onRejected === 'function' ? onRejected : reason => reason
    const promise2 = new Promise((rs, rj) => {
      const fulfilledMicrotask = () => {
        queueMicrotask(() => {
          try {
            const x = realFulfilled(this.value);
            resolvePromise(promise2, x, rs, rj)
          } catch (error) {
            this.reject(error)
          }
        })
      }
      const rejectedMicrotask = () => {
        queueMicrotask(() => {
          try {
            const x = realRejected(this.reason)
            resolvePromise(promise2, x, rs, rj)
          } catch (error) {
            this.reject(error)
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
}
function resolvePromise(promise2, x, rs, rj) {
  if (promise2 === x) {
    return new TypeError('chaining cycle detect from Mypromise')
  }
  if (x instanceof Mypromise) {
    x.then(rs, rj)
  } else {
    rs(x)
  }
}
Mypromise.all = (promises) => {
  return new Mypromise((rs, rj) => {
    const len = promises.length
    let count = 0
    let result = []
    if (!len) {
      return rs([])
    }
    promises.forEach((p, i) => {

    })
  })
}
function myTypeof(value, fullClass) {
  if (fullClass) return value === null ? '[object Null]' : Object.prototype.toString.call(value)
  if (value == null) return (value + '').toLowerCase()
  const type = Object.prototype.toString.call(value).slice(8).toLowerCase()
  if (type === 'generatorfunction') return 'function'

  return type.match(/^(array|bigint|error|function|generator|regexp|date|symbol)$/) ? type :
    (typeof value === 'function' || typeof value === 'object') ? 'object' : typeof value
}
function myInstanceOf(instance, object) {
  if (object[Symbol.hasInstance]) return object[Symbol.hasInstance](instance)
  else {
    if (instance === null || typeof instance !== 'object') return false
    if (object === Array) return Array.isArray(instance)

    let proto = Object.getPrototypeOf(instance)
    while(proto !== null) {
      if (proto === object.prototype) return true
      proto = Object.getPrototypeOf(proto)
    }
    return false
  }
}
function uniqueArray(arr) {
  let result = []
  for (let i = 0; i < arr.length; i++) {
    const item1 = arr[i]
    let isFind = false
    for (let j = 0; j < result.length; j++) {
      const item2 = result[j]
      if (isEqual(item1, item2)) {
        isFind = true
        break
      }
    }
    if (isFind) {
      result.push(item1)
    }
  }
  return result
}
function isEqual(value1, value2) {
  if (!isObject(value1) || !isObject(value2)) {
    return Object.is(value1, value2)
  }
  const entries1 = Object.entries(value1)
  const entries2 = Object.entries(value2)
  if (entries1.length !== entries2.length) {
    return false
  }
  for (const [key, val] of entries1) {
    if (!isEqual(val, entries2[key])) {
      return false
    }
  }
  return true
}
function flat(arr, n = 1) {
  function deep(item, i) {
    if (i === n) {
      return item
    } else {
      if (Array.isArray(item)) {
        return item.reduce((prev, curr) => prev.concat(deep(curr, i+1)), [])
      } else return item
    }
  }
  return deep(arr, 0)
}
function getFps(wait) {
  const prev = + new Date()
  function loop() {
    const now = + new Date()
    if (now - prev >= wait) {
      console.log(fps)
    } else {
      fps++
      requestAnimationFrame(loop)
    }
  }
  requestAnimationFrame(loop)
}
function checkStuck() {
  let prev = + new Date()
  let count = 0
  let isStuck = false
  function loop() {
    const now = + new Date()
    if (now - prev > 1000/60*1.5) {
      count++
      if (count >= 3 && !isStuck) {
        console.log('系统卡顿')
        setTimeout(() => {
          count = 0
          isStuck = false
          console.log('系统重启')
        }, 3000)
      }
    } else {
      count = 0
    }
    prev = now
    requestAnimationFrame(loop)
  }
  requestAnimationFrame(loop)
}
class EventBus {
  constructor () {
    this.map = {}
  }
  on(event, fn) {
    const { map } = this
    if (map[event]) map[event].push(fn)
    else map[event] = fn
    return this
  }
  emit(event, ...args) {
    const fns = this.map[event] || []
    (async () => {
      for (let i = 0; i < fns.length; i++) {
        fns[i].apply(this, args)
      }
    })()
    return this
  }
  once(event, fn) {
    const { map } = this
    const F = (...args) => {
      fn.apply(this, args)
      const index = map[event].indexOf(F)
      map[event].splice(index, 1)
    }
    if (map[event]) map[event].push(F)
    else map[event] = [F]
    return this
  }
  off(event, fn) {
    const { map } = this;
    if (map[event] === undefined) return false
    const index = map[event].indexOf(fn)
    if (index >= 0) {
      map[event].splice(index, 1)
      return true
    }
    return false
  }
}
function promiseQueue(promises, maxCount) {
  return new Promise((rs, rj) => {
    let index = 0
    let complete = 0
    let total = promises.length
    let result = []
    function next() {
      if (total === complete) {
        rs(result)
      }
      while(index < total && maxCount > 0) {
        maxCount--
        let current = index++
        promises[current].then((res) => {
          maxCount++
          complete++
          result[current] = res
          next()
        }).catch((err) => {
          rs(err)
        });
      }
    }
    next()
  })
}
function testPromiseQueue() {
  const promises = [
    new Promise((rs, rj) => setTimeout(() => rs(1), 1000)),
    new Promise((rs, rj) => setTimeout(() => rs(2), 2000)),
    new Promise((rs, rj) => setTimeout(() => rs(3), 3000)),
  ]
  promiseQueue(promises, 2)
}
function add() {
  let args = Array.prototype.slice.call(arguments)
  function addr() {
    args.push(...arguments)
    return addr
  }
  addr.toString = function() {
    return args.reduce((prev, curr) => prev + curr, 0)
  }
}
function debounce(fn, wait) {
  let timer
  return function(...args) {
    if (timer) clearTimeout()
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, wait)
  }
}
function debouncedImmediate(fn, wait) {
  let timer
  return function(args) {
    if (timer) clearTimeout(timer)
    let callNow = !timer
    timer = setTimeout(() => {
      timer = null
    }, wait)
    if (callNow) { fn.apply(this, args) }
  }
}
function throttleImmediate(fn, wait) {
  let timer, result;
  let throttled = function (...args) {
    if (!timer) {
      result = fn.apply(this, args)
      timer = setTimeout(() => {
        timer = null
      }, wait)
      return result
    }
  }
  return throttled
}