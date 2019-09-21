/*
 * @Author: 李浩栋
 * @Begin: 2019-09-18 14:38:53
 * @Update: 2019-09-21 10:21:24
 * @Update log: 更新日志
 */
import { AxiosRequestConfig, AxiosPromise, Method, AxiosResponse, ResolvedFn, RejectedFn } from "../types";
import despatchRequest, { transformURL } from './despatchRequest';
import InterceptorManager from "./interceptorManager";
import mergeConfig from "./mergeConfig";

interface interceptors {
  request: InterceptorManager<AxiosRequestConfig>
  response: InterceptorManager<AxiosResponse>
}

interface PromiseChain<T>{
  resolved: ResolvedFn<T> | ((config:AxiosRequestConfig) => AxiosPromise)
  rejected ?: RejectedFn
}

export default class Axios {
  defaults: AxiosRequestConfig
  interceptors: interceptors

  constructor(initConfig: AxiosRequestConfig) {
    this.defaults = initConfig
    this.interceptors = {
      request: new InterceptorManager<AxiosRequestConfig>(),
      response: new InterceptorManager<AxiosResponse>()
    }
  }

  request(url?: any, config?: any) : AxiosPromise {
    if(typeof url === 'string') {
      if(!config) {
        config = {}
      }
      config.url = url
    } else {
      config = url
    }

    config = mergeConfig(this.defaults, config)

    const chain:PromiseChain<any>[] = [{
      resolved: despatchRequest,
      rejected: undefined
    }]

    this.interceptors.request.forEach(interceptor => {
      chain.unshift(interceptor)
    })

    this.interceptors.response.forEach(interceptor => {
      chain.push(interceptor)
    })

    let promise = Promise.resolve(config)

    while (chain.length) {
      const { resolved, rejected } = chain.shift()!
      promise = promise.then(resolved, rejected)
    }

    return promise
  }

  get(url:string, config?:AxiosRequestConfig):AxiosPromise {
    return this._requestMethodWithoutDate('get', url, config)
  }

  delete(url:string, config?:AxiosRequestConfig):AxiosPromise {
    return this._requestMethodWithoutDate('delete', url, config)
  }

  head(url:string, config?:AxiosRequestConfig):AxiosPromise {
    return this._requestMethodWithoutDate('head', url, config)
  }

  options(url:string, config?:AxiosRequestConfig):AxiosPromise {
    return this._requestMethodWithoutDate('options', url, config)
  }

  post(url:string, data?:any, config?:AxiosRequestConfig):AxiosPromise {
    return this._requestMethodWithDate('post', url, data, config)
  }

  put(url:string, data?:any, config?:AxiosRequestConfig):AxiosPromise {
    return this._requestMethodWithDate('put', url, data, config)
  }

  patch(url:string, data?:any, config?:AxiosRequestConfig):AxiosPromise {
    return this._requestMethodWithDate('patch', url, data, config)
  }

  getUrl(config?: AxiosRequestConfig) :string {
    config = mergeConfig(this.defaults, config)
    return transformURL(config)
  }

  _requestMethodWithoutDate(methods:Method, url: string, config?: AxiosRequestConfig):AxiosPromise {
    return this.request(Object.assign(config || {}, {
      methods,
      url
    }))
  }

  _requestMethodWithDate(methods:Method, url: string, data?:any, config?: AxiosRequestConfig):AxiosPromise {
    return this.request(Object.assign(config || {}, {
      methods,
      url,
      data
    }))
  }
}