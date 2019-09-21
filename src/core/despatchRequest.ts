/*
 * @Author: 李浩栋
 * @Begin: 2019-09-15 16:46:05
 * @Update: 2019-09-19 16:15:27
 * @Update log: 更新日志
 */
import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types';
import xhr from './xhr';
import { buildURL, isAbsoluteURL, combineURL } from '../helpers/url'
import {  flattenHeaders } from '../helpers/header';
import transform from './transform';

export default function despatchRequest(config: AxiosRequestConfig):AxiosPromise {
  throwIfCancellationRequested(config)
  processConfig(config)
  return xhr(config).then((res) => {
    return transformResponseData(res)
  })
}


function processConfig(config:AxiosRequestConfig):void {
  config.url = transformURL(config)
  config.data = transform(config.data, config.headers, config.transformRequest!)
  config.headers = flattenHeaders(config.headers, config.method!)
}

export function transformURL(config:AxiosRequestConfig):string {
  let {url, params, paramSerializer,baseURL} = config
  if(baseURL && !isAbsoluteURL(url!)) {
    url = combineURL(baseURL, url)
  }
  return buildURL(url!, params, paramSerializer)
}


function transformResponseData(res:AxiosResponse):AxiosResponse {
  res.data = transform(res.data,res.headers,res.config.transformResponse!)
  return res
}


function throwIfCancellationRequested(config:AxiosRequestConfig):void {
  if(config.cancelToken){
    config.cancelToken.throwIfRequested()
  }
}