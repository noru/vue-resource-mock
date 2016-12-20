# Vue-Resource-Mock

A helper to mock your http response, based on vue-resource's [inteceptor](https://github.com/pagekit/vue-resource/blob/master/docs/http.md#interceptors)


Copy and modified from https://github.com/airtonix/vue-resource-mock

Open to PR/Issue :)

## Usage

#### Install

After `npm install vue-resource-mock --save-dev`,

```
import Vue from 'vue'
import VueResource from 'vue-resource'
import VueResourceMock from 'vue-resource-mock'
import MockData from 'path/to/file'   // MockData syntax down below

Vue.use(VueResource)

if (devMode) { // don't use it on your production build
  Vue.use(VueResourceMock, MockData) // ! after use vue-resource !
}

```

#### Mock data
```
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

```


## License
MIT
