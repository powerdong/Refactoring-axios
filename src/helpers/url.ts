import { isDate, isPlainObject } from './util'

interface URLOrigin {
  protocol:string
  host:string
}

function encode(val:string):string {
  return encodeURIComponent(val)
    .replace(/%40/g, '@')
    .replace(/%3A/ig, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/ig, ',')
    // 空格变成 +
    .replace(/%20/g, '+')
    .replace(/%5B/ig, '[')
    .replace(/%5D/ig, ']')
}

export function buildURL (url:string, params ?: any, paramSerializer?:(params:any) => string):string  {
  if (!params) {
    return url
  }
  let serializedParams

  if(paramSerializer){
    serializedParams = paramSerializer(params)
  } else if(isURLSameOrigin(params)) {
    serializedParams = params.toString()
  } else {

  const parts:string[] = []

  Object.keys(params).forEach((key) => {
    const val = params[key]
    if(val === null || typeof val === 'undefined') {
      return 
    }
    let values = []
    if(Array.isArray(val)) {
      values = val
      key += '[]'
    } else {
      values = [val]
    }
    values.forEach((val) => {
      if(isDate(val)) {
        val = val.toISOString()
      } else if (isPlainObject(val)) {
        val = JSON.stringify(val)
      }
      parts.push(`${encode(key)}=${encode(val)}`)
    })
  })

    serializedParams = parts.join('&')
  }
  if(serializedParams) {
    const marIndex = url.indexOf('#')
    if(marIndex !== -1) {
      url = url.slice(0, marIndex)
    }
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams
  }
  return url
}

export function isAbsoluteURL(url:string):boolean {
  return /(^[a-z][a-z\d\+\-\.])*?\/\//i.test(url)
}

export function combineURL(baseURL:string, relativeURL?:string):string {
  return relativeURL ? baseURL.replace(/\/+$/,'') + '/' + relativeURL.replace(/^\/+/, '') :baseURL
}

export function isURLSameOrigin(requestURL:string):boolean {
  const parsedOrigin = resolveURL(requestURL)
  return (parsedOrigin.protocol === currentOrigin.protocol && parsedOrigin.host === currentOrigin.host)
}

const urlParsingNode = document.createElement('a')

const currentOrigin = resolveURL(window.location.href)

function resolveURL(url:string):URLOrigin {
  urlParsingNode.setAttribute('href', url)
  const { protocol, host } = urlParsingNode

  return {
    protocol,
    host
  }
}