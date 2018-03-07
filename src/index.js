export default {
  install(Vue, data, options = { silent: false }) {
    if (!Vue.http) {
      throw new Error('[vue-resource] is not found. Make sure it is imported and "Vue.use" it before vue-resource-mock')
    }
    Vue.http.interceptors.push(MockMiddleware(data, options))
  }
}

import UrlPattern from 'url-pattern'
import qs from 'qs'

const TAG = '[vue-resource-mock]'
const MATCH_OPTIONS = {
  segmentValueCharset: 'a-zA-Z0-9-.:_%'
}
const mapRoutes = (map) => {
  return Object.keys(map)
      .reduce((result, route) => {
        let [method, url] = route.split(' ')
        let handler = map[route]

        switch (handler.constructor.name) {
          case 'Function':
            result.push({
              method: method,
              pattern: new UrlPattern(url, MATCH_OPTIONS),
              handler: handler
            })
            break
          case 'Array':
          case 'Object':
            result.push({
              method: method,
              pattern: new UrlPattern(url, MATCH_OPTIONS),
              handler: () => {
                return {
                  body: handler,
                  status: 200
                }
              }
            })
            break
          case 'Number':
            if (!Number.isInteger(handler) || handler < 200 || handler > 599) {
              throw new Error(`${handler} is not a valid Http Status Code`)
            }
            result.push({
              method: method,
              pattern: new UrlPattern(url, MATCH_OPTIONS),
              handler: () => {
                return {
                  body: undefined,
                  status: 200
                }
              }
            })
            break
          default:
            throw new Error('Routes must be an Object, Array, Function or Number(status code)')
        }
        return result
      }, [])
}
const MockMiddleware = (routes, { silent }) => {
  let Routes = mapRoutes(routes)

  return (request, next) => {
    let [path, query] = request.url.split('?')
    let route = Routes.filter((item) => {
      item.matchResult = item.pattern.match(path)
      return request.method.toLowerCase() === item.method.toLowerCase() && !!item.matchResult
    })
    if (route.length === 0) {
      silent || console.warn(TAG + 'Request pass through: ' + request.url)
      next()
    } else {
      silent || console.info(TAG + 'Request served with mock: ' + request.url)
      let mockResponse = route[0].handler(route[0].matchResult, qs.parse(query), request)
      if (mockResponse.delay) {
        setTimeout(() => next(request.respondWith(mockResponse.body, mockResponse)), mockResponse.delay)
      } else {
        next(request.respondWith(mockResponse.body, mockResponse))
      }
    }
  }
}
