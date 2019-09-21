import { AxiosRequestConfig } from "./types";
import { transformResponse, transformRequest } from "./helpers/data";
import { processHeaders } from "./helpers/header";

const defaults: AxiosRequestConfig = {
  method: 'get',
  timeout: 0,

  headers: {
    common: {
      Accept: 'application/json, text/plain, */*'
    }
  },

  xsrfCookieName:'XSRF-TOKEN',

  xsrfHeaderName:'X-XSRF-TOKEN',

  transformRequest: [
    function (data:any, headers:any):any {
      processHeaders(headers,data)
      return transformRequest(data)
    }
  ],

  transformResponse:[
    function (data:any):any {
      return transformResponse(data)
    }
  ],

  validateStatus(status:number):boolean {
    return status >= 200 && status < 300
  }
}

const methodsNoDate = ['delete', 'get', 'head','options']

methodsNoDate.forEach(method => {
  defaults.headers[method] = {}
})

const methodsWithData = ['post','put', 'patch']

methodsWithData.forEach(method => {
  defaults.headers[method] = {
    'Content-Type' : 'application/x-www-form-urlencoded'
  }
})

export default defaults