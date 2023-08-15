interface Function {
  myCall: (thisArg: any, ...argArray: any[]) => any;
  myApply: (thisArg: any, argArray?: any[]) => any;
  myBind: (thisArg: any, ...argArray: any[]) => any;
}

Function.prototype.myCall = function (thisArg: any, ...argArray: any[]) {
  if (typeof this !== 'function') {
    throw new TypeError('this is not a function')
  }

  thisArg = thisArg || window;
  const fn = Symbol()
  thisArg[fn] = this
  const result = thisArg[fn](...argArray)
  delete thisArg[fn];
  return result
}

Function.prototype.myApply = function (thisArg: any, argArray?: any[]) {
  if (typeof this !== 'function') {
    throw new TypeError('this is not a function')
  }

  thisArg = thisArg || window;
  const fn = Symbol()
  thisArg[fn] = this

  let result;
  if(argArray) {
    result = thisArg[fn](argArray)
  } else {
    result = thisArg[fn]()
  }

  delete thisArg[fn]
  return result
}

Function.prototype.myBind = function (thisArg: any, ...argArray: any[]) {
  if (typeof this !== 'function') {
    throw new TypeError('this is not a function')
  }

  let _this = this;
  return function (...args: any[]) {
    return _this.apply(thisArg, [...argArray, ...args])
  }
}

function myNew (constructor: any, ...argArray: any[]) {
  let obj = Object.create(constructor.prototype)
  let result = constructor.apply(obj, argArray)
  return result instanceof Object ? result : obj
}

/* 生成了一个函数并不会执行，需要的时候要调用返回的func */
/* 防抖的本质在于，重复点击会重新计时 */
function debounceImmediate<T extends (...args: any[]) => any>(fn:T, wait: number): T {
  let timer: ReturnType<typeof setTimeout> | null = null;
  let result: any;

  let debounce = function (this: any, ...args:any[]) {
    if (timer) clearTimeout(timer)
    else result = fn.apply(this, args)

    timer = setTimeout(() => {
      timer = null;
      /* 普通防抖函数 */
      // result = fn.apply(this, args)
    }, wait)
    return result
  }
  return debounce as T
}
/* 节流的本质在于，重复点击只是不执行 */
function throttleImmediate<T extends (...args: any[]) => any>(fn:T, wait:number): T {
  let timer: ReturnType<typeof setTimeout> | null = null;
  let result: any;

  let throttled = function (this:any, ...args: any[]) {
    if (!timer) {
      result = fn.apply(this, args)
      timer = setTimeout(() => {
        timer = null
        /* 普通节流函数 */
        // result = fn.apply(this, args)
      }, wait)
      return result
    }
  }
  return throttled as T
}