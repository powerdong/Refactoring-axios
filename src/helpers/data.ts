import { isPlainObject } from "./util";

export function transformRequest(data:any):any {
  if(isPlainObject(data)) {
    return JSON.stringify(data)
  }
  return data
}

export function transformResponse(data:any):any {
  if(typeof data === 'string') {
    try {
      // 转换json对象
      data = JSON.parse(data)
    }catch (e) {
      // do nothing
    }
  }
  return data
}