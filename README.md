# Vue-Resource-Mock
![Vue 1.x](https://img.shields.io/badge/vue-1.x-green.svg "Vue 1 Compatible")
![Vue 2.x](https://img.shields.io/badge/vue-2.x-green.svg "Vue 2 Compatible")
[![Build Status](https://travis-ci.org/noru/vue-resource-mock.svg?branch=master)](https://travis-ci.org/noru/vue-resource-mock)
[![npm version](https://img.shields.io/npm/v/vue-resource-mock.svg)](https://www.npmjs.com/package/vue-resource-mock)

This package requires no specific version of Vue but vue-resource. It works for both Vue/Vue2 as the time of this writing.

Copy and modified from https://github.com/airtonix/vue-resource-mock

Open to PR/Issue :)

## Usage

#### Install

After `npm install vue-resource-mock --save-dev`,

```javascript
import Vue from 'vue'
import VueResource from 'vue-resource'
import VueResourceMock from 'vue-resource-mock'
import MockData from 'path/to/file'   // MockData syntax down below

Vue.use(VueResource)

if (devMode) { // don't use it on your production build
  Vue.use(VueResourceMock, MockData, /* { silent: true/false } */) // after use vue-resource
}

```

#### Mock data
```javascript
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
      delay: 500, // millisecond
    }
  },

  // shorthand mock
  ['PUT */path/to/resource']: 200 // respond with only status code

  ['POST */path/to/resource']: { /*whatever*/ } // respond with only body, status code = 200

}

```


## License
MIT
