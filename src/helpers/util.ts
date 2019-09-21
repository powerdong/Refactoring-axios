/*
 * @Author: 李浩栋
 * @Begin: 2019-09-16 14:44:55
 * @Update: 2019-09-19 16:32:06
 * @Update log: 更新日志
 */
const toString = Object.prototype.toString

export function isDate(val:any):val is Date {
  // 通过这个方法查看是不是日期类型
  return toString.call(val) === '[object Date]'
}

// export function isObject(val:any):val is Object {
//   return val !==  null && typeof val === 'object'
// }

/**
 * 普通对象判断方法
 * @param val 
 */
export function isPlainObject(val:any): val is Object {
  return toString.call(val) === '[object Object]'
}

export function isFormData(val:any):val is FormData {
  return typeof val !== 'undefined' && val instanceof FormData
}

export function isURLSearchParams(val:any):val is URLSearchParams {
  return typeof val !== 'undefined' && val instanceof URLSearchParams
}

export function extend<T, U>(to:T, from:U): T & U {
  for (const key in from) {
    ;(to as T & U)[key] = from[key] as any
  }
  return to as T & U
}

export function deepMerge(...objs:any[]):any {
  const result = Object.create(null)

  objs.forEach(obj => {
    if(obj) {
      Object.keys(obj).forEach(key => {
        const val = obj[key]
        if(isPlainObject(val)){
          if(isPlainObject(result[key])){
            result[key] = deepMerge(result[key], val)
          } else {
            result[key] = deepMerge(val)
          }
        } else {
          result[key] = val
        }
      })
    }
  })

  return result
}
