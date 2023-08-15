/* call */
Function.prototype.myCall = function (context) {
  if (typeof this !== 'function') {
    throw new TypeError('this is not a function')
  }
  
  context = context || window;
  const args = Array.from(arguments).slice(1)
  const fn = Symbol()
  context[fn] = this;
  const result = context[fn](...args)
  delete context[fn]
  return result
}
/* apply */
Function.prototype.myApply = function (context) {
  if (typeof this !== 'function') {
    throw new TypeError('this is not a function')
  }
  let result;
  context = context || window
  const fn = Symbol()
  context[fn] = this;
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

  return function fn() {
    if (this instanceof fn) {
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
  let result = fn.apply(obj, args)
  return result instanceof Object ? result : obj
}
/* debounceImmediate */

/* throttleImmediate */

/* cloneDeep */

/* promise */

/* promise all */

