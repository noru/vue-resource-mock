/** copy from https://github.com/noru/vue-resource-mock, since it is not registered on npm
 */
/* eslint-disable */
import UrlPattern from 'url-pattern'

const TAG = '[vue-resource-mock]'
const MATCH_OPTIONS = {
  segmentValueCharset: 'a-zA-Z0-9.:-_%'
}
/**
 * Route Map Creator
 * @param  {Object} map [description]
 * @return {Array}     [description]
 */
export const mapRoutes = (map) => {
    // https://www.npmjs.com/package/url-pattern
    return Object.keys(map)
        .reduce((result, route) => {
            let [method, url] = route.split(' '),
                handler = map[route]
            if (handler.constructor.name === 'Function') {
                result = result.concat([{
                    method: method,
                    pattern: new UrlPattern(url, MATCH_OPTIONS),
                    handler: handler
                }])
            } else if (handler.constructor.name === 'Object') {
                result = result.concat(mapRoutes(handler))
            } else {
                throw new Error('Routes must be an object or function')
            }
            return result;
        }, [])
}

/**
 * Interceptor Middleware
 * @param  {object} routes   route definition object
 * @return {function}        middleware function
 */
export const MockServer = (routes) => {
    let Routes = mapRoutes(routes)

    // https://github.com/vuejs/vue-resource/blob/master/docs/http.md#interceptors
    return (request, next) => {
        let route = Routes.filter((item) => {
          item.matchResult = item.pattern.match(request.url.split('?')[0])
          return request.method.toLowerCase() === item.method.toLowerCase() && !!item.matchResult
        })
        if (route.length == 0) {
            console.warn(TAG + 'Request pass through: ' + request.url)
            next()
        } else {
            console.info(TAG + 'Request served with mock: ' + request.url)
            next(request.respondWith(route[0].handler(request, next, route[0].matchResult)))
        }

    }

}
