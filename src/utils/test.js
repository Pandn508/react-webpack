/* call */
Function.prototype.myCall = function (context) {
  if (typeof this !== 'function') {
    throw new TypeError('this is not a function')
  }

  context = context || window;
  const args = Array.from(arguments).slice(1)
  let fn = Symbol()
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
  context[fn] = this;
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

  const args = Array.prototype.slice.call(arguments, 1)
  const _this = this;
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
  const type = typeof value;
  return value !== null && (type === 'object' || type === 'function')
}
function toType(value) {
  return Object.prototype.toString.call(value).slice(8, -1)
}
function cloneDeep(value, stack = new WeakMap) {
  if (!isObject(value)) return value;
  const ctor = value.constructor
  const type = toType(value)

  if (type === 'RegExp' || type === 'Date') return new ctor(value)

  if (type === 'Error') return new ctor(value.message)

  if (type === 'Function') return function() {
    value.call(this, arguments)
  }

  let result = new ctor()
  let stacked = stack.get(value)
  if (stacked) return stacked
  stack.set(value, result)

  if (type === 'Set') {
    value.forEach(item => {
      result.add(cloneDeep(item, stack))
    })
    return result
  }

  if (type === 'Map') {
    value.forEach((item, index) => {
      result.set(index, cloneDeep(item, stack))
    })
    return result 
  }

  Object.keys(value).forEach(key => {
    result[key] = cloneDeep(value[key], stack)
  })
  return result
}
/* promise */
const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'
class MyPromise {
  constructor(exector) {
    try {
      exector(this.resolve, this.reject)
    } catch(error) {
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

      while(this.onFulfilledCallbacks.length) {
        this.onFulfilledCallbacks.shift()(value)
      }
    }
  }

  reject = (reason) => {
    if (this.status === PENDING) {
      this.status = REJECTED
      this.reason = reason

      while(this.onRejectedCallbacks.length) {
        this.onRejectedCallbacks.shift()(reason)
      }
    }
  }

  then(onFulfilled, onRejected) {
    const realOnFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value
    const realOnRejected = typeof onRejected === 'function' ? onRejected : reason => {throw reason}

    const promise2 = new MyPromise((resolve, reject) => {
      const fulfilledMicrotask = () => {
        queueMicrotask(() => {
          try {
            const x = realOnFulfilled(this.value)
            resolvePromise(promise2, x, resolve, reject)
          } catch (error) {
            reject(error)
          }
        })
      }

      const rejectedMicrotask = () => {
        queueMicrotask(() => {
          try {
            const x = realOnRejected(this.reason)
            resolvePromise(promise2, x, resolve, reject)
          } catch (error) {
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

  static resolve (parameter) {
    if (parameter instanceof MyPromise) {
      return parameter
    }
    return new MyPromise(resolve => {
      resolve(parameter)
    })
  }

  static reject (parameter) {
    return new MyPromise((resolve, reject) => {
      reject(parameter)
    })
  }
}
function resolvePromise(promise2, x, resolve, reject) {
  if (promise2 === x) {
    return reject(new TypeError('chaining cycle detect for promise'))
  }
  if (x instanceof MyPromise) {
    x.then(resolve, reject)
  } else {
    resolve(x)
  }
}
/* promise all */
MyPromise.all = (promises) => {
  return new MyPromise((rs, rj) => {
    let count = 0;
    let result = [];

    const len = promises.length
    if (!len) {
      rs([])
    }

    promises.forEach((p, i) => {
      MyPromise.resolve(p).then((res) => {
        count += 1;
        res[i] = res;

        if (len === count ) {
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
  this.balance = 100
}
Parent.prototype.useMoney = function (number) {
  this.balance -= number;
  console.log(`使用${number}块,剩余${this.balance}块`)
}
function Child() {
  Parent.call(this)
}
function objCreate(obj) {
  function f(){};
  f.prototype = obj;
  return new f()
}
function inheritPrototype(Child, Parent) {
  let prototype = objCreate(Parent.prototype)
  prototype.constuctor = Child;
  Child.prototype = prototype
}
inheritPrototype(Child, Parent)

let child = new Child()

class Parent {
  constructor(name) {
    this.name = name
    this.balance = 100 
  }
  useMoney(number) {
    this.balance -= number;
    console.log(`使用${number}块,剩余${this.balance}块`)
  }
}
class Child extends Parent {
  constructor(age) {
    super(name)
    this.age = age
  }
  sayAge() {
    console.log(this.age)
  }
}
/* 科利华 */
function add() {
  let args = Array.prototype.slice.call(arguments)

  let addr = function () {
    args.push(...arguments)
    return addr
  }

  addr.toString = function () {
    return args.reduce((prev, curr) => prev + curr, 0)
  }
  return addr
}
/* promise n */
function promiseQueue(promises, maxCouncurrent) {
  return new Promise((resolve, reject) => {
    let index = 0;
    let complete = 0;
    let result = [];
    const total = promises.length

    function next() {
      if (complete === total) {
        resolve(result)
        return 
      }

      while(index < total && maxCouncurrent > 0) {
        maxCouncurrent --
        const currentIndex = index++
        promises[currentIndex].then((res) => {
          result[currentIndex] = res;
          maxCouncurrent ++;
          complete ++
          next()
        }).catch((err) => {
          reject(err)
        });
      }
    }
    next()
  })
}
/* promise async */

class Scheduler {
  constructor(maxCount) {
    this.count = 0;
    this.taskList = [];
    this.maxCount = maxCount
  }

  async add(fn) {
    if (this.count >= this.maxCount) {
      return new Promise((resolve) => {
        this.taskList.push(() => {
          this.count ++;
          fn().then((res) => {
            this.count --;
            resolve(res)
            if (this.taskList.length > 0) {
              this.taskList.shift()()
            }
          })
        })
      })
    }
    this.count ++;
    return fn().then((res) => {
      this.count--;
      if (this.taskList.length > 0) {
        this.taskList.shift()()
      }
      return res
    })
  }
}
const scheduler = new Scheduler(2)
const addTask = (time, order) => {
  scheduler.add(() => new Promise((resolve) => {
    setTimeout(()=>{resolve(order)}, time)
  })).then((res) => {
    console.log(res)
  })
}

















