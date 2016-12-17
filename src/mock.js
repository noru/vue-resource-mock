export default {

  // basic mock
  ['GET */path/to/resource'] (pathMatch, query, request) {
    // before respond, you can check the path and query parameters with `pathMatch` & `query`
    // powered by 'url-pattern' & 'qs'
    // https://www.npmjs.com/package/url-pattern
    // https://www.npmjs.com/package/qs
    let body = { /* whatever */ }
    return {
      body: body,
      status: 200,
      statusText: 'OK',
      headers: { /*headers*/ }
      deylay: 500, // millisecond
    }
  },

  // shorthand mock
  ['PUT */path/to/resource'] = 200 // respond with only status code

  ['POST */path/to/resource'] = { /*whatever*/ } // respond with only body, status code = 200

}
