function isObject(value) {
  const type = typeof value;
  return value !== null && (type === 'object' || type == 'function')
}
function toType(value) {
  return Object.prototype.toString.call(value).slice(8, -1)
}
export const cloneDeep = function (value, stack = new Map()) {
  if (!isObject(value)) return value;
  let type = toType(value);
  let ctor = value.constructor;
  if (type === 'RegExp' || type === 'date') return new ctor(value);

  if (type === 'Error') return new ctor(value.message)

  if (type === 'Function') return function() {
    value.apply(this, arguments)
  }

  let result = new ctor()
  const stacked = stack.get(value)
  if (stacked) {
    return stacked
  }
  stack.set(value, result)

  if (type === 'Map') {
    value.forEach((item, index) => {
      result.set(index, cloneDeep(item, stack))
    })
    return result;
  }

  if (type === 'Set') {
    value.forEach((item) => {
      result.add(cloneDeep(item, stack))
    })
  }

  Object.keys(value).forEach(key => {
    result[key] = cloneDeep(value[key], stack)
  })
  return result;
}

const PENDING = 'pending';
const FULFILLED ='fulfilled';
const REJECTED = 'rejected';
class MyPromise {
  constructor(executor) {
    try {
      executor(this.resolve, this.reject)
    } catch (error) {
      this.reject(error)
    }
  }

  status = PENDING;
  value = null;
  reason = null;

  onFulfilledCallbacks = [];
  onRejectedCallbacks = [];

  resolve = (value) => {
    if (this.status === PENDING) {
      this.status = FULFILLED;
      this.value = value;

      while(this.onFulfilledCallbacks.length) {
        this.onFulfilledCallbacks.shift()(value)
      }
    }
  }

  reject = (reason) => {
    if (this.status === PENDING) {
      this.status = REJECTED;
      this.reason = reason;

      while(this.onRejectedCallbacks.length) {
        this.onRejectedCallbacks.shift()(value)
      }
    }
  }

  then(onFulfilled, onRejected) {
    const realOnFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
    const realOnRejected = typeof onRejected === 'functon' ? onRejected : reason => reason;

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
      } else if (this.status === PENDING) {
        this.onFulfilledCallbacks.push(fulfilledMicrotask)
        this.onRejectedCallbacks.push(rejectedMicrotask)
      }
    })
    return promise2;
  }

  static resolve(parameter) {
    if (parameter instanceof MyPromise) {
      return parameter;
    }

    return new MyPromise((resolve) => {
      resolve(parameter)
    })
  }

  static reject(parameter) {
    return new MyPromise((resolve, reject) => {
      reject(parameter)
    })
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

MyPromise.all = (promises) => {
  return new MyPromise((rs, rj) => {
    let count = 0;
    let result = [];

    const len = promises.length;
    if (len === 0) {
      return rs([])
    }

    promises.forEach((p, i) => {
      MyPromise.resolve(p).then((res) => {
        count += 1;
        result[i] = res;

        if (len === count) {
          rs(result)
        }
      }).catch(rj);
    })
  })
}

function add() {
  var args = Array.prototype.slice.call(arguments)

  var adder = function () {
    args.push(...arguments)
    return adder
  }

  adder.toString = function () {
    return args.reduce((prev, curr) => {return prev + curr}, 0)
  }

  return adder
}
add(1)(2,3,4)(5).toString()




class PubSub {
  constructor() {
    this.subscribers = {};
  }

  subscribe(event, callback) {
    if (!this.subscribers[event]) {
      this.subscribers[event] = [];
    }
    this.subscribers[event].push(callback)
  }

  publish(event, data) {
    if (!this.subscribers[event]) return;
    this.subscribers[event].forEach(callback => callback(data))
  }
}

let data = {
  text: 'Hello World',
  pubsub: new PubSub()
}

Object.defineProperty(data, 'text', {
  get: function() {
    return this._text
  },
  set: function (value) {
    this._text = value;
    this.pubsub.publish('textChanged', value)
  }
})
data.pubsub.subscribe('textChanged', function(value) {
  console.log(value)
})

class Scheduler {
  constructor(maxCouncurrent) {
    this.taskList = []
    this.count = 0;
    this.maxCount = maxCouncurrent
  }

  async add (fn) {
    if (this.count >= this.maxCount) {
      return new Promise((resolve) => {
        this.taskList.push(() => {
          this.count ++;
          fn().then(res => {
            this.count --
            resolve(res)
            if (this.taskList.length > 0) {
              this.taskList.shift()()
            }
          })
        })
      })
    } else {
      this.count ++
      return fn().then(res => {
        this.count --
        if (this.taskList.length > 0) {
          this.taskList.shift()()
        }
        return res
      })
    }
  }
}
const scheduler = new Scheduler(2)
const addTask = (time, order) => {
  scheduler.add(()=>new Promise(r=>setTimeout(() => {r(order)},time)))
      .then((res)=>console.log(res, order))
}
//log:2 1 3 4 4

/* 数组去重 */
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
function equals(value1, value2) {
  if (isPrimitive(value1) || isPrimitive(value2)) {
    return Object.is(value1, value2)
  }
  const entries1 = Object.entries(value1)
  const entries2 = Object.entries(value2)
  if (entries1.length !== entries2.length) {
    return false
  }
  for (const [key, value] of entries1) {
    if (!equals(value, value2[key])) {
      return false
    }
  }
  return true
}
function isPrimitive(value) {
  return value === null || !['object', 'function'].includes(typeof value)
}



