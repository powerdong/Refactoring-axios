/*
 * @Author: 李浩栋
 * @Begin: 2019-09-16 16:41:09
 * @Update: 2019-09-16 16:41:09
 * @Update log: 更新日志
 */
import { AxiosRequestConfig, AxiosStatic } from "./types";
import Axios from "./core/Axios";
import { extend } from "./helpers/util";
import defaults from "./default";
import mergeConfig from "./core/mergeConfig";
import CancelToken from "./cancel/cancelToken";
import Cancel, { isCancel } from "./cancel/Cancel";

function createInstance(config: AxiosRequestConfig):AxiosStatic {
  const context = new Axios(config)
  const instance = Axios.prototype.request.bind(context)

  extend(instance, context)

  return instance as AxiosStatic
}

const axios = createInstance(defaults)

axios.create = function create(config) {
  return createInstance(mergeConfig(defaults, config))
}

axios.CancelToken = CancelToken
axios.Cancel = Cancel
axios.isCancel = isCancel

axios.all = function all(promises) {
  return Promise.all(promises)
}

axios.spread = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr)
  }
}

axios.Axios = Axios

export default axios